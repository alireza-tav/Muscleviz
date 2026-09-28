/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { evaluateCurve, getMuscleInvolvementColor } from '../../utils/curveUtils';
import { Exercise } from '../../types/exercise';
import type { AnatomicalRig } from './AnatomyModel';

export interface RealAnatomyData {
  group: THREE.Group;
  muscleMeshes: THREE.Mesh[];
  meshToMuscleId: Map<THREE.Mesh, string>;
  muscleIdToMeshes: Map<string, THREE.Mesh[]>;
  materialsMap: Map<THREE.Mesh, THREE.MeshStandardMaterial>;
  skeletonGroup?: THREE.Group;
}

// Map anatomical names from Z-Anatomy / NIH Human Reference Atlas to canonical IDs
export function matchAnatomicalNameToId(name: string): string | null {
  if (!name) return null;
  const n = name.toLowerCase();

  // 1. CHEST / PECTORALIS (Major, Minor, Subclavius, Fascia, Sternocostal)
  if (
    n.includes('pectoral') ||
    n.includes('pectoralis') ||
    n.includes('clavipectoral') ||
    n.includes('subclavius') ||
    n.includes('sternalis')
  ) {
    return 'chest';
  }

  // 2. DELTOIDS (anterior, lateral, posterior)
  if (n.includes('deltoid') || n.includes('subdeltoid')) {
    if (n.includes('clavicular') || n.includes('anterior') || n.includes('front')) return 'deltoid_anterior';
    if (n.includes('spinal') || n.includes('posterior') || n.includes('rear') || n.includes('scapular spinal')) return 'deltoid_posterior';
    if (n.includes('acromial') || n.includes('lateral') || n.includes('middle')) return 'deltoid_lateral';
    return 'deltoid_lateral';
  }

  // 3. ARMS - BICEPS & FOREARMS (Brachialis, Coracobrachialis, Brachioradialis, Hand flexors/extensors)
  if (n.includes('biceps brachii') || n.includes('brachialis') || n.includes('coracobrachialis') || n.includes('bicipital')) return 'biceps';
  if (
    n.includes('brachioradialis') ||
    n.includes('pronator') ||
    n.includes('supinator') ||
    n.includes('antebrachial') ||
    n.includes('flexor carpi') ||
    n.includes('extensor carpi') ||
    n.includes('flexor digitor') ||
    n.includes('extensor digitor') ||
    n.includes('flexor pollicis') ||
    n.includes('extensor pollicis') ||
    n.includes('abductor pollicis') ||
    n.includes('adductor pollicis') ||
    n.includes('opponens') ||
    n.includes('palmaris') ||
    n.includes('lumbrical of hand') ||
    n.includes('interosseous muscle of hand') ||
    n.includes('thenar') ||
    n.includes('hypothenar') ||
    n.includes('hand') ||
    n.includes('wrist') ||
    n.includes('brachial fascia')
  ) {
    return 'biceps';
  }

  // 4. ARMS - TRICEPS
  if (n.includes('triceps brachii') || n.includes('triceps') || n.includes('anconeus')) return 'triceps';

  // 5. CORE - ABDOMINALS (Rectus abdominis, pyramidalis, linea alba, rectus sheath)
  if (
    n.includes('rectus abdominis') ||
    n.includes('pyramidalis') ||
    n.includes('linea alba') ||
    n.includes('investing abdominal') ||
    n.includes('rectus sheath') ||
    n.includes('umbilical')
  ) {
    return 'abdominals';
  }

  // 6. CORE - OBLIQUES (Internal/External Obliques, Transversus, Serratus anterior)
  if (
    n.includes('oblique') ||
    n.includes('obliquus') ||
    n.includes('transversus abdominis') ||
    n.includes('serratus') ||
    n.includes('intercostal') ||
    n.includes('subcostal')
  ) {
    if (!n.includes('arytenoid') && !n.includes('auricular') && !n.includes('capitis')) return 'obliques';
  }

  // 7. BACK - LATISSIMUS DORSI & UPPER/MID BACK
  if (
    n.includes('latissimus dorsi') ||
    n.includes('teres major') ||
    n.includes('infraspinatus') ||
    n.includes('teres minor') ||
    n.includes('subscapularis') ||
    n.includes('supraspinatus') ||
    n.includes('thoracolumbar') ||
    n.includes('erector spinae') ||
    n.includes('iliocostalis') ||
    n.includes('longissimus') ||
    n.includes('spinalis') ||
    n.includes('multifidus') ||
    n.includes('rotatores') ||
    n.includes('interspinales') ||
    n.includes('intertransversarii') ||
    n.includes('quadratus lumborum')
  ) {
    return 'latissimus_dorsi';
  }

  // 8. BACK & NECK - TRAPEZIUS & UPPER SCAPULAR
  if (
    n.includes('trapezius') ||
    n.includes('rhomboid') ||
    n.includes('levator scapulae') ||
    n.includes('splenius') ||
    n.includes('nuchal') ||
    n.includes('sternocleidomastoid') ||
    n.includes('scalenus') ||
    n.includes('scalene') ||
    n.includes('omohyoid') ||
    n.includes('sternohyoid') ||
    n.includes('sternothyroid') ||
    n.includes('thyrohyoid')
  ) {
    return 'trapezius';
  }

  // 9. LOWER BODY - GLUTES & HIPS
  if (
    n.includes('gluteus') ||
    n.includes('gluteal') ||
    n.includes('piriformis') ||
    n.includes('gemellus') ||
    n.includes('obturator') ||
    n.includes('quadratus femoris') ||
    n.includes('tensor fasciae latae')
  ) {
    return 'glutes';
  }

  // 10. LEGS - QUADRICEPS & ANTERIOR/MEDIAL THIGH (Rectus Femoris, Vasti, Adductors, Fascia Lata)
  if (
    n.includes('rectus femoris') ||
    n.includes('vastus lateralis') ||
    n.includes('vastus medialis') ||
    n.includes('vastus intermedius') ||
    n.includes('quadriceps') ||
    n.includes('sartorius') ||
    n.includes('adductor') ||
    n.includes('pectineus') ||
    n.includes('gracilis') ||
    n.includes('iliopsoas') ||
    n.includes('psoas') ||
    n.includes('iliacus') ||
    n.includes('fascia lata') ||
    n.includes('patellar') ||
    n.includes('iliotibial') ||
    n.includes('articularis genus')
  ) {
    return 'quadriceps';
  }

  // 11. LEGS - HAMSTRINGS (Biceps femoris, Semitendinosus, Semimembranosus)
  if (
    n.includes('biceps femoris') ||
    n.includes('semitendinosus') ||
    n.includes('semimembranosus') ||
    n.includes('hamstring')
  ) {
    return 'hamstrings';
  }

  // 12. LEGS - CALVES & LOWER LEG & FOOT (Gastrocnemius, Soleus, Tibialis, Crural fascia)
  if (
    n.includes('gastrocnemius') ||
    n.includes('soleus') ||
    n.includes('plantaris') ||
    n.includes('tibialis') ||
    n.includes('peroneus') ||
    n.includes('fibularis') ||
    n.includes('crural') ||
    n.includes('calcaneal') ||
    n.includes('achilles') ||
    n.includes('popliteus') ||
    n.includes('flexor hallucis') ||
    n.includes('extensor hallucis') ||
    n.includes('flexor digitorum longus') ||
    n.includes('extensor digitorum longus') ||
    n.includes('flexor digitorum brevis') ||
    n.includes('extensor digitorum brevis') ||
    n.includes('abductor hallucis') ||
    n.includes('abductor digiti minimi of foot') ||
    n.includes('quadratus plantae') ||
    n.includes('interosseous muscle of foot') ||
    n.includes('lumbrical of foot') ||
    n.includes('foot') ||
    n.includes('retinaculum of foot') ||
    n.includes('peroneal retinaculum') ||
    n.includes('septum of leg')
  ) {
    return 'calves';
  }

  return null;
}

/**
 * Highlights muscles on the realistic anatomical model.
 * Selected muscle turns vibrant glowing crimson red, non-selected muscles turn sleek slate or fade in isolation mode.
 */
export function highlightRealAnatomyMuscles(
  real: RealAnatomyData,
  selectedMuscleId: string | null,
  isolationMode: boolean
) {
  real.materialsMap.forEach((mat, mesh) => {
    const muscleId = real.meshToMuscleId.get(mesh);
    const isSelected = !!(selectedMuscleId && muscleId === selectedMuscleId);

    if (isSelected) {
      // Extremely bright, glowing saturated crimson red with low roughness for clear visibility
      mat.color.setHex(0xff1744);
      mat.emissive.setHex(0xdd002f);
      mat.emissiveIntensity = 1.35;
      mat.roughness = 0.25;
      mat.metalness = 0.2;
      mat.opacity = 1.0;
      mat.transparent = false;
    } else {
      if (isolationMode && selectedMuscleId) {
        // High-contrast ghosting when isolation mode is turned on
        mat.color.setHex(0x181a22);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
        mat.opacity = 0.12;
        mat.transparent = true;
      } else {
        // Natural athletic slate titanium muscle tone
        mat.color.setHex(0x3e4350);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
        mat.roughness = 0.45;
        mat.metalness = 0.22;
        mat.opacity = 1.0;
        mat.transparent = false;
      }
    }
  });
}

/**
 * Applies dynamic biomechanical heatmap and involvement activation curves to the realistic anatomical model.
 */
export function applyExerciseHeatmapToRealAnatomy(
  real: RealAnatomyData,
  exercise: Exercise,
  playbackProgress: number,
  isColorblind = false,
  isolationMode = false,
  selectedMuscleId: string | null = null
) {
  const involvementMap = new Map<string, number>();

  // 1. Evaluate keyframe involvement curves if defined
  if (exercise.involvementCurves && exercise.involvementCurves.length > 0) {
    exercise.involvementCurves.forEach((curve) => {
      const val = evaluateCurve(curve.keyframes, playbackProgress);
      involvementMap.set(curve.muscleId, val);
    });
  }

  // 2. Ensure all target muscles have an active rep pulse even if curve not individually authored
  if (exercise.targetMuscles) {
    exercise.targetMuscles.forEach((tm) => {
      if (!involvementMap.has(tm.muscleId)) {
        const base = tm.role === 'primary' ? 0.85 : 0.52;
        const wave = Math.sin(playbackProgress * Math.PI * 2) * 0.22;
        const val = Math.max(0.18, Math.min(1.0, base + wave));
        involvementMap.set(tm.muscleId, val);
      }
    });
  }

  // 3. Apply thermal gradient colors to all anatomical meshes
  real.materialsMap.forEach((mat, mesh) => {
    const muscleId = real.meshToMuscleId.get(mesh);
    const isExplicitlySelected = !!(selectedMuscleId && muscleId === selectedMuscleId);

    if (muscleId && (involvementMap.has(muscleId) || isExplicitlySelected)) {
      const curveVal = involvementMap.get(muscleId) || 0.85;
      const intensity = isExplicitlySelected ? Math.max(curveVal, 0.95) : curveVal;

      if (intensity > 0.05) {
        const { color, emissive, emissiveIntensity } = getMuscleInvolvementColor(
          intensity,
          isColorblind
        );
        mat.color.copy(color);
        mat.emissive.copy(emissive);
        mat.emissiveIntensity = emissiveIntensity * 1.35;
        mat.roughness = 0.25;
        mat.metalness = 0.22;
        mat.opacity = 1.0;
        mat.transparent = false;
        return;
      }
    }

    // Non-involved muscles
    if (isolationMode) {
      mat.color.setHex(0x181a22);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
      mat.opacity = 0.12;
      mat.transparent = true;
    } else {
      mat.color.setHex(0x3e4350);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
      mat.roughness = 0.45;
      mat.metalness = 0.22;
      mat.opacity = 1.0;
      mat.transparent = false;
    }
  });
}

export async function loadRealAnatomicalModel(
  onProgress?: (percent: number) => void
): Promise<RealAnatomyData> {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/gltf/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  const gltf = await new Promise<any>((resolve, reject) => {
    loader.load(
      '/models/muscular_male.glb',
      (data) => resolve(data),
      (xhr) => {
        if (xhr.lengthComputable && onProgress) {
          onProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => reject(err)
    );
  });

  const root = gltf.scene as THREE.Group;
  root.name = 'RealAnatomyMuscles';

  // Compute bounding box and normalize scale & center
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Scale model to realistic height of 1.75 meters
  const targetHeight = 1.75;
  const scale = targetHeight / (size.y || 1);
  root.scale.setScalar(scale);

  // Position: centered horizontally and standing with feet grounded near y = 0
  root.position.x = -center.x * scale;
  root.position.y = -box.min.y * scale + 0.05;
  root.position.z = -center.z * scale;

  const muscleMeshes: THREE.Mesh[] = [];
  const meshToMuscleId = new Map<THREE.Mesh, string>();
  const muscleIdToMeshes = new Map<string, THREE.Mesh[]>();
  const materialsMap = new Map<THREE.Mesh, THREE.MeshStandardMaterial>();

  // Default deep athletic charcoal muscle tone
  const defaultMuscleColor = new THREE.Color(0x3e4350);

  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const muscleId =
        matchAnatomicalNameToId(mesh.name) ||
        matchAnatomicalNameToId(mesh.parent?.name || '');

      // Create high-detail material with realistic specular sheen
      const mat = new THREE.MeshStandardMaterial({
        color: defaultMuscleColor.clone(),
        roughness: 0.45,
        metalness: 0.22,
        envMapIntensity: 1.1,
      });

      mesh.material = mat;
      materialsMap.set(mesh, mat);

      if (muscleId) {
        mesh.userData = {
          isMuscle: true,
          muscleId,
          anatomicalName: mesh.name || mesh.parent?.name || '',
        };
        muscleMeshes.push(mesh);
        meshToMuscleId.set(mesh, muscleId);

        if (!muscleIdToMeshes.has(muscleId)) {
          muscleIdToMeshes.set(muscleId, []);
        }
        muscleIdToMeshes.get(muscleId)!.push(mesh);
      } else {
        mesh.userData = {
          isMuscle: true,
          muscleId: 'other',
          anatomicalName: mesh.name || mesh.parent?.name || '',
        };
      }
    }
  });

  return {
    group: root,
    muscleMeshes,
    meshToMuscleId,
    muscleIdToMeshes,
    materialsMap,
  };
}

/**
 * Binds all high-detail anatomical meshes of the realistic model directly to the
 * articulated skeletal bones of the rig, allowing both realistic anatomy display
 * AND full dynamic exercise kinematics/animations with gym equipment!
 */
export function bindRealAnatomyToRig(real: RealAnatomyData, rig: AnatomicalRig) {
  // Ensure matrices are computed in world coordinates before reparenting
  rig.rootGroup.updateMatrixWorld(true);
  real.group.updateMatrixWorld(true);

  const meshesToAttach: THREE.Mesh[] = [];
  real.group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      meshesToAttach.push(child as THREE.Mesh);
    }
  });

  const worldPos = new THREE.Vector3();

  for (const mesh of meshesToAttach) {
    mesh.getWorldPosition(worldPos);
    const name = (mesh.name || mesh.parent?.name || '').toLowerCase();

    const isLeft =
      name.endsWith('.l') ||
      name.endsWith('.el') ||
      name.endsWith('.ol') ||
      name.endsWith('.o1l') ||
      name.endsWith('.o2l') ||
      name.endsWith('.o3l') ||
      name.endsWith('.o4l') ||
      name.endsWith('.o5l') ||
      name.endsWith('.e1l') ||
      name.endsWith('.e2l') ||
      worldPos.x > 0.035;

    const isRight =
      name.endsWith('.r') ||
      name.endsWith('.er') ||
      name.endsWith('.or') ||
      name.endsWith('.o1r') ||
      name.endsWith('.o2r') ||
      name.endsWith('.o3r') ||
      name.endsWith('.o4r') ||
      name.endsWith('.o5r') ||
      name.endsWith('.e1r') ||
      name.endsWith('.e2r') ||
      worldPos.x < -0.035;

    let targetBone: THREE.Group = rig.bones.torso;

    // 1. Head & Facial muscles
    if (
      /capitis|cranium|head|facial|auricular|masseter|temporalis|bucinator|digastric|platysma|mental|nasal|orbicularis|zygomatic|tongue|eye|scalene|splenius capitis|sternocleidomastoid/i.test(
        name
      ) ||
      worldPos.y > 1.48
    ) {
      targetBone = rig.bones.head;
    }
    // 2. Shin, Calves, Foot (Lower Leg)
    else if (
      /gastrocnem|soleus|plantar|tibial|perone|fibular|crural|calcane|achille|poplit|hallucis|foot|pedis/i.test(
        name
      ) ||
      (worldPos.y < 0.48 && Math.abs(worldPos.x) > 0.02)
    ) {
      targetBone = isLeft ? rig.bones.shinLeft : isRight ? rig.bones.shinRight : rig.bones.shinLeft;
    }
    // 3. Thigh, Quads, Hamstrings (Upper Leg)
    else if (
      /femoris|vastus|sartori|gracilis|pectineus|adductor|iliopsoas|psoas|iliacus|fascia lata|patell|iliotib|semitend|semimembr|quadriceps|articularis genus/i.test(
        name
      ) ||
      (worldPos.y < 0.88 && worldPos.y >= 0.48 && Math.abs(worldPos.x) > 0.02)
    ) {
      targetBone = isLeft ? rig.bones.thighLeft : isRight ? rig.bones.thighRight : rig.bones.thighLeft;
    }
    // 4. Forearm, Wrist, Hand
    else if (
      /brachiorad|pronat|supinat|antebrach|flexor carpi|extensor carpi|flexor digitor|extensor digitor|flexor pollicis|extensor pollicis|abductor pollicis|adductor pollicis|palmar|hand|wrist|carpal|thenar|hypothenar|interosseous.*hand|lumbrical.*hand/i.test(
        name
      ) ||
      (worldPos.y < 1.05 && Math.abs(worldPos.x) > 0.18)
    ) {
      targetBone = isLeft ? rig.bones.forearmLeft : isRight ? rig.bones.forearmRight : rig.bones.forearmLeft;
    }
    // 5. Upper Arm & Deltoids
    else if (
      /biceps brachii|brachialis|coracobrach|triceps|anconeus|deltoid|bicipital/i.test(name) ||
      (worldPos.y >= 1.05 && Math.abs(worldPos.x) > 0.16)
    ) {
      targetBone = isLeft ? rig.bones.armLeft : isRight ? rig.bones.armRight : rig.bones.armLeft;
    }
    // 6. Pelvis & Glutes
    else if (
      /glute|piriform|gemell|obturat|quadratus femoris|coccyg|sacr/i.test(name) ||
      (worldPos.y >= 0.82 && worldPos.y <= 0.98 && worldPos.z < -0.02)
    ) {
      targetBone = rig.bones.spine;
    }
    // 7. Torso (chest, abs, lats, traps, erectors, obliques)
    else {
      targetBone = rig.bones.torso;
    }

    // Attach mesh while preserving its world position
    targetBone.attach(mesh);
  }

  // Hide the procedural low-poly rig meshes so only high-detail real anatomical meshes show
  rig.muscleMeshes.forEach((m) => {
    m.visible = false;
  });
  rig.rootGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const m = child as THREE.Mesh;
      if (m.userData && m.userData.meshRegionId) {
        m.visible = false;
      }
      if (
        m.geometry &&
        (m.geometry.type === 'CylinderGeometry' || m.geometry.type === 'SphereGeometry') &&
        !m.userData.isMuscle
      ) {
        m.visible = false;
      }
    }
  });

  rig.rootGroup.updateMatrixWorld(true);
}

