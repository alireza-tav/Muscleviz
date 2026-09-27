/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

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

  // Deltoids (anterior, lateral, posterior)
  if (n.includes('deltoid')) {
    if (n.includes('clavicular') || n.includes('anterior') || n.includes('front')) return 'deltoid_anterior';
    if (n.includes('spinal') || n.includes('posterior') || n.includes('rear')) return 'deltoid_posterior';
    if (n.includes('acromial') || n.includes('lateral') || n.includes('middle')) return 'deltoid_lateral';
    return 'deltoid_lateral';
  }

  // Chest / Pectoralis
  if (n.includes('pectoral') || n.includes('pectoralis')) return 'chest';

  // Arms - Biceps & Triceps
  if (n.includes('biceps brachii') || n.includes('brachialis') || n.includes('coracobrachialis')) return 'biceps';
  if (n.includes('triceps brachii') || n.includes('triceps') || n.includes('anconeus')) return 'triceps';

  // Core & Back
  if (n.includes('rectus abdominis') || n.includes('pyramidalis')) return 'abdominals';
  if (n.includes('oblique') || n.includes('obliquus') || n.includes('transversus abdominis')) {
    // avoid larynx oblique muscles
    if (!n.includes('arytenoid') && !n.includes('auricular')) return 'obliques';
  }
  if (
    n.includes('latissimus dorsi') ||
    n.includes('teres major') ||
    n.includes('infraspinatus') ||
    n.includes('teres minor') ||
    n.includes('subscapularis')
  ) {
    return 'latissimus_dorsi';
  }
  if (n.includes('trapezius') || n.includes('rhomboid') || n.includes('levator scapulae')) return 'trapezius';

  // Lower Body
  if (n.includes('gluteus')) return 'glutes';
  if (
    n.includes('rectus femoris') ||
    n.includes('vastus lateralis') ||
    n.includes('vastus medialis') ||
    n.includes('vastus intermedius') ||
    n.includes('quadriceps') ||
    n.includes('sartorius')
  ) {
    return 'quadriceps';
  }
  if (
    n.includes('biceps femoris') ||
    n.includes('semitendinosus') ||
    n.includes('semimembranosus') ||
    n.includes('hamstring')
  ) {
    return 'hamstrings';
  }
  if (
    n.includes('gastrocnemius') ||
    n.includes('soleus') ||
    n.includes('plantaris') ||
    n.includes('tibialis anterior') ||
    n.includes('peroneus') ||
    n.includes('fibularis') ||
    n.includes('tibialis posterior')
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
