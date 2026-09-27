/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  AnatomicalRig,
  buildRealisticAnatomyRig,
  applyExerciseKinematics,
  resetAnatomyPose,
  highlightRigMuscles,
} from './AnatomyModel';
import {
  RealAnatomyData,
  loadRealAnatomicalModel,
  highlightRealAnatomyMuscles,
  matchAnatomicalNameToId,
} from './RealAnatomyModel';
import { evaluateCurve, getMuscleInvolvementColor } from '../../utils/curveUtils';
import { Exercise } from '../../types/exercise';
import { MUSCLE_GROUPS } from '../../data/musclesData';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Loader2, Sparkles } from 'lucide-react';

interface AnatomyCanvasProps {
  selectedMuscleId: string | null;
  onSelectMuscle: (muscleId: string) => void;
  activeExercise?: Exercise | null;
  playbackProgress?: number; // 0.0 to 1.0
  isColorblind?: boolean;
  isolationMode?: boolean;
  viewPreset?: 'front' | 'back' | 'left' | 'right' | null;
  onViewPresetChange?: (preset: 'front' | 'back' | 'left' | 'right') => void;
  showRotateGuide?: boolean;
  className?: string;
}

export const AnatomyCanvas: React.FC<AnatomyCanvasProps> = ({
  selectedMuscleId,
  onSelectMuscle,
  activeExercise = null,
  playbackProgress = 0,
  isColorblind = false,
  isolationMode = false,
  viewPreset = 'front',
  onViewPresetChange,
  showRotateGuide = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rigRef = useRef<AnatomicalRig | null>(null);
  const realAnatomyRef = useRef<RealAnatomyData | null>(null);

  // Keep references to latest props for async callbacks
  const selectedMuscleIdRef = useRef<string | null>(selectedMuscleId);
  selectedMuscleIdRef.current = selectedMuscleId;

  const isolationModeRef = useRef<boolean>(isolationMode);
  isolationModeRef.current = isolationMode;

  const [loadingProgress, setLoadingProgress] = useState<number | null>(0);
  const [modelType, setModelType] = useState<'real_anatomy' | 'rig'>('rig');
  const [loadedModelVersion, setLoadedModelVersion] = useState<number>(0);

  const orbitState = useRef({
    radius: 3.2,
    theta: 0,
    phi: Math.PI / 2,
    target: new THREE.Vector3(0, 1.0, 0),
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startTheta: 0,
    startPhi: 0,
    targetTheta: 0,
    targetPhi: Math.PI / 2,
    targetRadius: 3.2,
    hasMoved: false,
  });

  const [hoveredMuscleName, setHoveredMuscleName] = useState<string | null>(null);
  const [webglError, setWebglError] = useState(false);

  // Initialize Scene, Lighting & Models
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;

    try {
      const width = container.clientWidth || 380;
      const height = container.clientHeight || 520;

      // 1. Scene
      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 20);
      camera.position.set(0, 1.1, 3.2);
      camera.lookAt(0, 1.0, 0);
      cameraRef.current = camera;

      // 3. Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      rendererRef.current = renderer;

      // 4. Studio Lighting Rig
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfff6ed, 1.8);
      keyLight.position.set(2.5, 4.5, 3.5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xb4e1ff, 1.0);
      fillLight.position.set(-3, 2.5, 2.5);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xb4f000, 1.2);
      rimLight.position.set(0, 3.5, -3.5);
      scene.add(rimLight);

      const bounceLight = new THREE.DirectionalLight(0x272b35, 0.6);
      bounceLight.position.set(0, -2, 1);
      scene.add(bounceLight);

      // Contact Shadow Plane
      const shadowGeo = new THREE.PlaneGeometry(3.0, 3.0);
      const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
      const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0.01;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);

      // Studio Stage Grid Ring
      const stageGeo = new THREE.RingGeometry(0.85, 0.87, 64);
      const stageMat = new THREE.MeshBasicMaterial({
        color: 0x3b4252,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const stageRing = new THREE.Mesh(stageGeo, stageMat);
      stageRing.rotation.x = -Math.PI / 2;
      stageRing.position.y = 0.02;
      stageRing.receiveShadow = true;
      scene.add(stageRing);

      // 5. Build Kinematic Rig (Used for exercise movements and instant fallback)
      const rig = buildRealisticAnatomyRig();
      scene.add(rig.rootGroup);
      rigRef.current = rig;

      // Apply initial selection on rig
      highlightRigMuscles(rig, selectedMuscleIdRef.current, isolationModeRef.current);

      // 6. Asynchronously Load Real High-Detail Anatomical Model (GLB)
      loadRealAnatomicalModel((percent) => {
        setLoadingProgress(percent);
      })
        .then((realData) => {
          realAnatomyRef.current = realData;
          scene.add(realData.group);
          setLoadingProgress(null);

          // If in explore mode, switch to real anatomical model and apply highlighting
          if (!activeExercise) {
            rig.rootGroup.visible = false;
            realData.group.visible = true;
            highlightRealAnatomyMuscles(realData, selectedMuscleIdRef.current, isolationModeRef.current);
            setModelType('real_anatomy');
          }
          setLoadedModelVersion((v) => v + 1);
        })
        .catch((err) => {
          console.warn('Real anatomy model load failed, falling back to rig:', err);
          setLoadingProgress(null);
          rig.rootGroup.visible = true;
          setModelType('rig');
        });

      // Handle Resize
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // Render Loop
      const render = () => {
        animationFrameId = requestAnimationFrame(render);

        const s = orbitState.current;
        s.theta += (s.targetTheta - s.theta) * 0.08;
        s.phi += (s.targetPhi - s.phi) * 0.08;
        s.radius += (s.targetRadius - s.radius) * 0.08;

        const sinPhi = Math.sin(s.phi);
        const cosPhi = Math.cos(s.phi);
        const sinTheta = Math.sin(s.theta);
        const cosTheta = Math.cos(s.theta);

        camera.position.x = s.target.x + s.radius * sinPhi * sinTheta;
        camera.position.y = s.target.y + s.radius * cosPhi;
        camera.position.z = s.target.z + s.radius * sinPhi * cosTheta;
        camera.lookAt(s.target);

        if (rig.props.orbitRing) {
          rig.props.orbitRing.rotation.y += 0.008;
        }

        // Selected muscle breathing glow pulse in Explore Mode
        const curSelectedId = selectedMuscleIdRef.current;
        if (!activeExercise && curSelectedId) {
          const pulseIntensity = 1.35 + Math.sin(Date.now() * 0.006) * 0.35;
          const real = realAnatomyRef.current;
          if (real && real.group.visible) {
            const meshes = real.muscleIdToMeshes.get(curSelectedId);
            if (meshes) {
              for (const m of meshes) {
                const mat = real.materialsMap.get(m);
                if (mat) mat.emissiveIntensity = pulseIntensity;
              }
            }
          }
          if (rig && rig.rootGroup.visible) {
            rig.muscleMeshes.forEach((mesh) => {
              if (mesh.userData.muscleId === curSelectedId) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.emissiveIntensity = pulseIntensity;
              }
            });
          }
        }

        renderer.render(scene, camera);
      };

      render();

      return () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        renderer.dispose();
      };
    } catch (e) {
      console.error('WebGL Initialization Error:', e);
      setWebglError(true);
    }
  }, []);

  // View Presets
  useEffect(() => {
    if (!viewPreset) return;
    const s = orbitState.current;
    if (viewPreset === 'front') {
      s.targetTheta = 0;
      s.targetPhi = Math.PI / 2;
    } else if (viewPreset === 'back') {
      s.targetTheta = Math.PI;
      s.targetPhi = Math.PI / 2;
    } else if (viewPreset === 'left') {
      s.targetTheta = -Math.PI / 2;
      s.targetPhi = Math.PI / 2;
    } else if (viewPreset === 'right') {
      s.targetTheta = Math.PI / 2;
      s.targetPhi = Math.PI / 2;
    }
  }, [viewPreset]);

  // Synchronize Pose, Muscle Highlighting & Heatmap
  useEffect(() => {
    const rig = rigRef.current;
    const real = realAnatomyRef.current;

    if (activeExercise) {
      // In Exercise Demonstration: use Kinematic Rig with props and animated joints
      if (rig) {
        rig.rootGroup.visible = true;
        rig.props.orbitRing.visible = false;
        applyExerciseKinematics(rig, activeExercise.id, playbackProgress);

        const involvementMap = new Map<string, number>();
        if (activeExercise.involvementCurves) {
          activeExercise.involvementCurves.forEach((curve) => {
            const val = evaluateCurve(curve.keyframes, playbackProgress);
            involvementMap.set(curve.muscleId, val);
          });
        }

        rig.muscleMeshes.forEach((mesh) => {
          const muscleId = mesh.userData.muscleId as string;
          const intensity = involvementMap.get(muscleId) || 0;
          const mat = mesh.material as THREE.MeshStandardMaterial;

          if (intensity > 0.05) {
            const { color, emissive, emissiveIntensity } = getMuscleInvolvementColor(
              intensity,
              isColorblind
            );
            mat.color.copy(color);
            mat.emissive.copy(emissive);
            mat.emissiveIntensity = emissiveIntensity * 1.25;
            mat.opacity = 1.0;
            mat.transparent = false;
          } else {
            if (isolationMode) {
              mat.color.setHex(0x181a20);
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
              mat.opacity = 0.15;
              mat.transparent = true;
            } else {
              mat.color.setHex(0x353842);
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
              mat.opacity = 1.0;
              mat.transparent = false;
            }
          }
        });
      }

      if (real) {
        real.group.visible = false;
      }
    } else {
      // In Explore Mode: prioritize the Real Anatomical 3D Model!
      if (real) {
        real.group.visible = true;
        if (rig) rig.rootGroup.visible = false;
        highlightRealAnatomyMuscles(real, selectedMuscleId, isolationMode);
      } else if (rig) {
        // Fallback to procedural rig while real model loads
        rig.rootGroup.visible = true;
        rig.props.orbitRing.visible = true;
        resetAnatomyPose(rig);
        highlightRigMuscles(rig, selectedMuscleId, isolationMode);
      }
    }
  }, [activeExercise, playbackProgress, selectedMuscleId, isolationMode, isColorblind, modelType, loadedModelVersion]);

  // Pointer & Raycast Interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!e.isPrimary) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const s = orbitState.current;
    s.isDragging = true;
    s.hasMoved = false;
    s.dragStartX = e.clientX;
    s.dragStartY = e.clientY;
    s.startTheta = s.targetTheta;
    s.startPhi = s.targetPhi;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = orbitState.current;
    if (!s.isDragging) {
      handleRaycastHover(e);
      return;
    }

    const deltaX = e.clientX - s.dragStartX;
    const deltaY = e.clientY - s.dragStartY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      s.hasMoved = true;
    }

    const rotSpeed = 0.007;
    s.targetTheta = s.startTheta - deltaX * rotSpeed;
    s.targetPhi = Math.max(0.1, Math.min(Math.PI - 0.1, s.startPhi - deltaY * rotSpeed));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = orbitState.current;
    s.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!s.hasMoved) {
      handleRaycastSelect(e);
    }
  };

  const findMuscleIdFromObject = (
    hitObj: THREE.Object3D,
    real: RealAnatomyData | null,
    rig: AnatomicalRig | null
  ): string | null => {
    if (real && real.group.visible) {
      let curr: THREE.Object3D | null = hitObj;
      while (curr && curr !== real.group) {
        if (real.meshToMuscleId.has(curr as THREE.Mesh)) {
          const mid = real.meshToMuscleId.get(curr as THREE.Mesh);
          if (mid && mid !== 'other') return mid;
        }
        const matched = matchAnatomicalNameToId(curr.name);
        if (matched) return matched;
        curr = curr.parent;
      }
    } else if (rig && rig.rootGroup.visible) {
      let curr: THREE.Object3D | null = hitObj;
      while (curr && curr !== rig.rootGroup) {
        if (curr.userData && curr.userData.muscleId) {
          return curr.userData.muscleId;
        }
        curr = curr.parent;
      }
    }
    return null;
  };

  const handleRaycastSelect = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    if (!canvas || !camera) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const real = realAnatomyRef.current;
    const rig = rigRef.current;

    let targetObjects: THREE.Object3D[] = [];
    if (real && real.group.visible) {
      targetObjects = real.group.children;
    } else if (rig && rig.rootGroup.visible) {
      targetObjects = rig.rootGroup.children;
    }

    if (targetObjects.length > 0) {
      const intersects = raycaster.intersectObjects(targetObjects, true);
      for (const inter of intersects) {
        const foundMuscleId = findMuscleIdFromObject(inter.object, real, rig);
        if (foundMuscleId) {
          onSelectMuscle(foundMuscleId);
          // Haptic feedback if available
          if ('vibrate' in navigator) {
            try {
              navigator.vibrate(20);
            } catch {
              // ignore
            }
          }
          return;
        }
      }
    }
  };

  const handleRaycastHover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    if (!canvas || !camera) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const real = realAnatomyRef.current;
    const rig = rigRef.current;

    let targetObjects: THREE.Object3D[] = [];
    if (real && real.group.visible) {
      targetObjects = real.group.children;
    } else if (rig && rig.rootGroup.visible) {
      targetObjects = rig.rootGroup.children;
    }

    if (targetObjects.length > 0) {
      const intersects = raycaster.intersectObjects(targetObjects, true);
      for (const inter of intersects) {
        const foundMuscleId = findMuscleIdFromObject(inter.object, real, rig);
        if (foundMuscleId) {
          const found = MUSCLE_GROUPS.find((m) => m.id === foundMuscleId);
          setHoveredMuscleName(found ? found.name : foundMuscleId);
          canvas.style.cursor = 'pointer';
          return;
        }
      }
    }

    setHoveredMuscleName(null);
    canvas.style.cursor = 'grab';
  };

  const handleZoom = (inward: boolean) => {
    const s = orbitState.current;
    const delta = inward ? -0.4 : 0.4;
    s.targetRadius = Math.max(1.7, Math.min(5.0, s.targetRadius + delta));
  };

  const handleResetCamera = () => {
    const s = orbitState.current;
    s.targetTheta = 0;
    s.targetPhi = Math.PI / 2;
    s.targetRadius = 3.2;
    if (onViewPresetChange) onViewPresetChange('front');
  };

  const handleRotateQuick = () => {
    const s = orbitState.current;
    s.targetTheta += Math.PI / 2;
  };

  const activeSelectedGroup = MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden touch-none select-none ${className}`}
    >
      {loadingProgress !== null && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-[#161822]/90 backdrop-blur-md border border-[#b4f000]/30 text-xs font-bold text-[#b4f000] flex items-center gap-2 shadow-xl">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>بارگذاری آناتومی واقعی انسان ({loadingProgress}٪)...</span>
        </div>
      )}

      {webglError ? (
        <div className="text-center p-6 text-slate-400">
          <p className="text-sm font-medium">موتور سه‌بعدی در دسترس نیست</p>
          <p className="text-xs text-slate-500 mt-1">
            مرورگر شما از WebGL پشتیبانی نمی‌کند یا دسترسی شتاب‌دهنده سخت‌افزاری مسدود است.
          </p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
        />
      )}

      {/* Floating Camera Controls (Right side for RTL layout) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-10">
        <button
          onClick={handleRotateQuick}
          title="چرخش ۹۰ درجه"
          aria-label="چرخش زاویه دید"
          className="w-10 h-10 rounded-full bg-[#16181f]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-xl active:scale-95"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(true)}
          title="بزرگنمایی (Zoom In)"
          aria-label="بزرگنمایی"
          className="w-10 h-10 rounded-full bg-[#16181f]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-xl active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(false)}
          title="کوچکنمایی (Zoom Out)"
          aria-label="کوچکنمایی"
          className="w-10 h-10 rounded-full bg-[#16181f]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-xl active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetCamera}
          title="تنظیم مجدد دوربین"
          aria-label="تنظیم مجدد زاویه"
          className="w-10 h-10 rounded-full bg-[#16181f]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-xl active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Drag To Rotate Helper Cue in Persian */}
      {showRotateGuide && !activeExercise && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-80">
          <div className="w-2 h-2 rounded-full bg-[#b4f000] animate-ping" />
          <span className="text-[11px] font-bold text-slate-400 font-sans tracking-wide">
            بکشید برای چرخش ۳D
          </span>
        </div>
      )}

      {/* Selected Muscle Badge Indicator on 3D Canvas */}
      {!activeExercise && activeSelectedGroup && (
        <div className="absolute top-2 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14161f]/85 backdrop-blur-md border border-[#ef4444]/40 shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
          </span>
          <span className="text-[11px] font-bold text-white">
            {activeSelectedGroup.name}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">
            {activeSelectedGroup.latinName}
          </span>
        </div>
      )}

      {/* Hover Muscle Tag */}
      {hoveredMuscleName && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-1.5 rounded-full bg-[#12141a]/90 backdrop-blur-md border border-[#b4f000]/40 text-xs font-bold text-[#b4f000] shadow-2xl flex items-center gap-2 animate-in fade-in duration-150">
          <Sparkles className="w-3 h-3 text-[#b4f000]" />
          <span>{hoveredMuscleName}</span>
        </div>
      )}
    </div>
  );
};
