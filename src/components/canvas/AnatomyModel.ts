/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Generate procedural muscle fiber bump & roughness texture
function createMuscleFiberTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark base
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Draw fine longitudinal striations
  for (let y = 0; y < 512; y += 2) {
    const intensity = Math.sin(y * 0.45) * 25 + Math.sin(y * 1.8) * 15 + (Math.random() * 20 - 10);
    const val = Math.min(255, Math.max(0, 128 + intensity));
    ctx.strokeStyle = `rgb(${val},${val},${val})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.random() - 0.5) * 1.5);
    for (let x = 32; x <= 512; x += 32) {
      const wobble = Math.sin((x / 512) * Math.PI * 4 + y * 0.1) * 2;
      ctx.lineTo(x, y + wobble);
    }
    ctx.stroke();
  }

  // Cross fascial connective tissue
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 512;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 80, 512);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  return texture;
}

// Generate compression shorts fabric texture
function createFabricTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1e24';
  ctx.fillRect(0, 0, 256, 256);

  // Carbon honeycomb / rib pattern
  ctx.fillStyle = '#15171b';
  for (let y = 0; y < 256; y += 4) {
    for (let x = 0; x < 256; x += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

export interface AnatomicalRig {
  rootGroup: THREE.Group;
  muscleMeshes: Map<string, THREE.Mesh>;
  materialsMap: Map<string, THREE.MeshStandardMaterial>;
  bones: {
    spine: THREE.Group;
    torso: THREE.Group;
    head: THREE.Group;
    armLeft: THREE.Group;
    forearmLeft: THREE.Group;
    armRight: THREE.Group;
    forearmRight: THREE.Group;
    thighLeft: THREE.Group;
    shinLeft: THREE.Group;
    thighRight: THREE.Group;
    shinRight: THREE.Group;
  };
  props: {
    bench: THREE.Group;
    dumbbells: THREE.Group;
    barbell: THREE.Group;
    latBar: THREE.Group;
    orbitRing: THREE.Group;
  };
}

export function buildRealisticAnatomyRig(): AnatomicalRig {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'HumanAnatomyRig';

  const muscleMeshes = new Map<string, THREE.Mesh>();
  const materialsMap = new Map<string, THREE.MeshStandardMaterial>();

  const fiberTexture = createMuscleFiberTexture();
  const fabricTexture = createFabricTexture();

  // Base materials with anatomical metallic sheen and fine striation bump
  const defaultMuscleColor = new THREE.Color(0x3e424c); // Deep athletic charcoal
  const sharedFiberMaterial = (muscleId: string) => {
    const mat = new THREE.MeshStandardMaterial({
      color: defaultMuscleColor.clone(),
      roughness: 0.42,
      metalness: 0.28,
      bumpMap: fiberTexture,
      bumpScale: 0.025,
      roughnessMap: fiberTexture,
      envMapIntensity: 1.2,
    });
    materialsMap.set(muscleId, mat);
    return mat;
  };

  const skinToneMaterial = new THREE.MeshStandardMaterial({
    color: 0x484b55,
    roughness: 0.55,
    metalness: 0.15,
  });

  const shortsMaterial = new THREE.MeshStandardMaterial({
    color: 0x181a1f,
    map: fabricTexture,
    roughness: 0.85,
    metalness: 0.1,
  });

  // Helper to register muscle mesh for raycasting and phase coloring
  const registerMuscleMesh = (
    mesh: THREE.Mesh,
    muscleId: string,
    meshRegionId: string
  ) => {
    mesh.name = meshRegionId;
    mesh.userData = {
      isMuscle: true,
      muscleId: muscleId,
      meshRegionId: meshRegionId,
    };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    muscleMeshes.set(meshRegionId, mesh);
  };

  // --- HIERARCHY / SKELETON GROUPS ---
  const spine = new THREE.Group();
  spine.position.set(0, 0.95, 0); // Pelvis/hip center
  rootGroup.add(spine);

  const torso = new THREE.Group();
  torso.position.set(0, 0.35, 0); // Chest center
  spine.add(torso);

  const head = new THREE.Group();
  head.position.set(0, 0.52, 0); // Neck base
  torso.add(head);

  // Left Arm
  const armLeft = new THREE.Group();
  armLeft.position.set(0.38, 0.38, 0);
  torso.add(armLeft);

  const forearmLeft = new THREE.Group();
  forearmLeft.position.set(0, -0.36, 0);
  armLeft.add(forearmLeft);

  // Right Arm
  const armRight = new THREE.Group();
  armRight.position.set(-0.38, 0.38, 0);
  torso.add(armRight);

  const forearmRight = new THREE.Group();
  forearmRight.position.set(0, -0.36, 0);
  armRight.add(forearmRight);

  // Left Leg
  const thighLeft = new THREE.Group();
  thighLeft.position.set(0.18, 0, 0);
  spine.add(thighLeft);

  const shinLeft = new THREE.Group();
  shinLeft.position.set(0, -0.52, 0);
  thighLeft.add(shinLeft);

  // Right Leg
  const thighRight = new THREE.Group();
  thighRight.position.set(-0.18, 0, 0);
  spine.add(thighRight);

  const shinRight = new THREE.Group();
  shinRight.position.set(0, -0.52, 0);
  thighRight.add(shinRight);

  // ==========================================
  // 1. HEAD & ATHLETIC JAW/NECK
  // ==========================================
  const headGroup = new THREE.Group();
  // Cranium
  const craniumGeo = new THREE.SphereGeometry(0.12, 32, 24);
  craniumGeo.scale(0.95, 1.15, 1.05);
  const craniumMesh = new THREE.Mesh(craniumGeo, skinToneMaterial);
  craniumMesh.position.set(0, 0.12, 0);
  headGroup.add(craniumMesh);

  // Chiseled Jaw & Chin
  const jawGeo = new THREE.CylinderGeometry(0.09, 0.055, 0.1, 16);
  jawGeo.scale(1.0, 1.0, 0.85);
  const jawMesh = new THREE.Mesh(jawGeo, skinToneMaterial);
  jawMesh.position.set(0, 0.03, 0.03);
  headGroup.add(jawMesh);

  // Neck with sternocleidomastoid definition
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.095, 0.16, 24);
  const neckMesh = new THREE.Mesh(neckGeo, skinToneMaterial);
  neckMesh.position.set(0, -0.05, 0);
  headGroup.add(neckMesh);

  head.add(headGroup);

  // ==========================================
  // 2. CHEST (Pectoralis Major - Sculpted Fan Plates)
  // ==========================================
  const chestMat = sharedFiberMaterial('chest');
  const createPecMesh = (isLeft: boolean) => {
    // Sculpted pectoralis plate with natural curvature
    const pecGeo = new THREE.BoxGeometry(0.24, 0.18, 0.1, 8, 8, 4);
    const pos = pecGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Clavicular taper & sternal division
      if (z > 0) {
        // Curve outward in the muscle belly
        z += Math.cos(x * 10) * 0.045 * (1 - Math.abs(y * 3));
        // Sternal gap
        if (isLeft && x < -0.06) z -= 0.03;
        if (!isLeft && x > 0.06) z -= 0.03;
      }
      pos.setXYZ(i, x, y, z);
    }
    pecGeo.computeVertexNormals();
    const mesh = new THREE.Mesh(pecGeo, chestMat);
    return mesh;
  };

  const pecLeft = createPecMesh(true);
  pecLeft.position.set(0.14, 0.22, 0.12);
  pecLeft.rotation.set(-0.08, 0.15, -0.08);
  torso.add(pecLeft);
  registerMuscleMesh(pecLeft, 'chest', 'mesh_pectoralis_major_l');

  const pecRight = createPecMesh(false);
  pecRight.position.set(-0.14, 0.22, 0.12);
  pecRight.rotation.set(-0.08, -0.15, 0.08);
  torso.add(pecRight);
  registerMuscleMesh(pecRight, 'chest', 'mesh_pectoralis_major_r');

  // ==========================================
  // 3. ABDOMINALS (6-Pack Rectus Abdominis)
  // ==========================================
  const absMat = sharedFiberMaterial('abdominals');
  const absTiers = [
    { y: 0.07, sizeY: 0.075, depth: 0.115, scaleZ: 1.0 }, // Upper abs
    { y: -0.02, sizeY: 0.078, depth: 0.112, scaleZ: 0.98 }, // Mid abs
    { y: -0.11, sizeY: 0.085, depth: 0.108, scaleZ: 0.95 }, // Lower abs
  ];

  absTiers.forEach((tier, tierIdx) => {
    // Left pack
    const absPackGeoL = new THREE.BoxGeometry(0.095, tier.sizeY, 0.05, 6, 6, 4);
    const posL = absPackGeoL.attributes.position;
    for (let i = 0; i < posL.count; i++) {
      if (posL.getZ(i) > 0) {
        posL.setZ(i, posL.getZ(i) + 0.025 * Math.cos(posL.getX(i) * 20));
      }
    }
    absPackGeoL.computeVertexNormals();
    const meshL = new THREE.Mesh(absPackGeoL, absMat);
    meshL.position.set(0.065, tier.y, tier.depth);
    torso.add(meshL);
    registerMuscleMesh(meshL, 'abdominals', `mesh_abs_tier${tierIdx + 1}_l`);

    // Right pack
    const absPackGeoR = new THREE.BoxGeometry(0.095, tier.sizeY, 0.05, 6, 6, 4);
    const posR = absPackGeoR.attributes.position;
    for (let i = 0; i < posR.count; i++) {
      if (posR.getZ(i) > 0) {
        posR.setZ(i, posR.getZ(i) + 0.025 * Math.cos(posR.getX(i) * 20));
      }
    }
    absPackGeoR.computeVertexNormals();
    const meshR = new THREE.Mesh(absPackGeoR, absMat);
    meshR.position.set(-0.065, tier.y, tier.depth);
    torso.add(meshR);
    registerMuscleMesh(meshR, 'abdominals', `mesh_abs_tier${tierIdx + 1}_r`);
  });

  // ==========================================
  // 4. OBLIQUES & SERRATUS ANTERIOR (Flanks)
  // ==========================================
  const obliquesMat = sharedFiberMaterial('obliques');
  const createObliquesMesh = (isLeft: boolean) => {
    const geo = new THREE.CylinderGeometry(0.08, 0.095, 0.22, 16);
    geo.scale(1.2, 1.0, 0.7);
    const mesh = new THREE.Mesh(geo, obliquesMat);
    mesh.position.set(isLeft ? 0.19 : -0.19, -0.04, 0.04);
    mesh.rotation.set(0, 0, isLeft ? -0.18 : 0.18);
    return mesh;
  };

  const obliquesL = createObliquesMesh(true);
  torso.add(obliquesL);
  registerMuscleMesh(obliquesL, 'obliques', 'mesh_obliques_l');

  const obliquesR = createObliquesMesh(false);
  torso.add(obliquesR);
  registerMuscleMesh(obliquesR, 'obliques', 'mesh_obliques_r');

  // ==========================================
  // 5. BACK: LATISSIMUS DORSI (V-Taper Wings)
  // ==========================================
  const latsMat = sharedFiberMaterial('latissimus_dorsi');
  const createLatsMesh = (isLeft: boolean) => {
    const latGeo = new THREE.BoxGeometry(0.2, 0.32, 0.14, 8, 8, 4);
    const pos = latGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Flare out wide at the top (under armpit) and taper down to lumbar spine
      if (y > 0) {
        if (isLeft && x > 0) x += y * 0.15;
        if (!isLeft && x < 0) x -= y * 0.15;
      }
      if (z < 0) {
        z -= Math.cos(x * 12) * 0.035;
      }
      pos.setXYZ(i, x, y, z);
    }
    latGeo.computeVertexNormals();
    const mesh = new THREE.Mesh(latGeo, latsMat);
    mesh.position.set(isLeft ? 0.17 : -0.17, 0.12, -0.09);
    mesh.rotation.set(0.1, isLeft ? -0.22 : 0.22, isLeft ? 0.12 : -0.12);
    return mesh;
  };

  const latsL = createLatsMesh(true);
  torso.add(latsL);
  registerMuscleMesh(latsL, 'latissimus_dorsi', 'mesh_lats_upper_l');

  const latsR = createLatsMesh(false);
  torso.add(latsR);
  registerMuscleMesh(latsR, 'latissimus_dorsi', 'mesh_lats_upper_r');

  // ==========================================
  // 6. BACK: TRAPEZIUS (Diamond Diamond Cape)
  // ==========================================
  const trapsMat = sharedFiberMaterial('trapezius');
  const createTrapsMesh = (isLeft: boolean) => {
    const trapGeo = new THREE.BoxGeometry(0.16, 0.24, 0.11, 8, 8, 4);
    const pos = trapGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      if (z < 0) {
        z -= Math.cos(x * 15) * 0.03;
      }
      pos.setXYZ(i, x, y, z);
    }
    trapGeo.computeVertexNormals();
    const mesh = new THREE.Mesh(trapGeo, trapsMat);
    mesh.position.set(isLeft ? 0.09 : -0.09, 0.32, -0.09);
    mesh.rotation.set(0.08, isLeft ? 0.1 : -0.1, isLeft ? 0.05 : -0.05);
    return mesh;
  };

  const trapsL = createTrapsMesh(true);
  torso.add(trapsL);
  registerMuscleMesh(trapsL, 'trapezius', 'mesh_traps_upper_l');

  const trapsR = createTrapsMesh(false);
  torso.add(trapsR);
  registerMuscleMesh(trapsR, 'trapezius', 'mesh_traps_upper_r');

  // Core internal ribcage / rib structure for depth
  const ribcageGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.44, 24);
  ribcageGeo.scale(1.0, 1.0, 0.72);
  const ribcage = new THREE.Mesh(ribcageGeo, skinToneMaterial);
  ribcage.position.set(0, 0.12, 0);
  torso.add(ribcage);

  // ==========================================
  // 7. SHOULDERS (DELTOIDS: Front, Lateral, Rear)
  // ==========================================
  const deltAntMat = sharedFiberMaterial('deltoid_anterior');
  const deltLatMat = sharedFiberMaterial('deltoid_lateral');
  const deltPostMat = sharedFiberMaterial('deltoid_posterior');

  const createDeltoidsForArm = (armGroup: THREE.Group, isLeft: boolean) => {
    // Anterior Deltoid (Front)
    const antGeo = new THREE.SphereGeometry(0.09, 16, 16);
    antGeo.scale(0.85, 1.25, 0.9);
    const antMesh = new THREE.Mesh(antGeo, deltAntMat);
    antMesh.position.set(isLeft ? 0.04 : -0.04, 0.02, 0.07);
    antMesh.rotation.set(0.2, 0, isLeft ? -0.2 : 0.2);
    armGroup.add(antMesh);
    registerMuscleMesh(antMesh, 'deltoid_anterior', isLeft ? 'mesh_delt_ant_l' : 'mesh_delt_ant_r');

    // Lateral Deltoid (Outer cap - V shape)
    const latGeo = new THREE.SphereGeometry(0.095, 16, 16);
    latGeo.scale(1.1, 1.4, 0.85);
    const latMesh = new THREE.Mesh(latGeo, deltLatMat);
    latMesh.position.set(isLeft ? 0.08 : -0.08, -0.01, 0);
    latMesh.rotation.set(0, 0, isLeft ? -0.15 : 0.15);
    armGroup.add(latMesh);
    registerMuscleMesh(latMesh, 'deltoid_lateral', isLeft ? 'mesh_delt_lat_l' : 'mesh_delt_lat_r');

    // Posterior Deltoid (Rear)
    const postGeo = new THREE.SphereGeometry(0.085, 16, 16);
    postGeo.scale(0.85, 1.2, 0.9);
    const postMesh = new THREE.Mesh(postGeo, deltPostMat);
    postMesh.position.set(isLeft ? 0.03 : -0.03, 0.01, -0.07);
    postMesh.rotation.set(-0.25, 0, isLeft ? -0.15 : 0.15);
    armGroup.add(postMesh);
    registerMuscleMesh(postMesh, 'deltoid_posterior', isLeft ? 'mesh_delt_post_l' : 'mesh_delt_post_r');
  };

  createDeltoidsForArm(armLeft, true);
  createDeltoidsForArm(armRight, false);

  // ==========================================
  // 8. ARMS (BICEPS & TRICEPS)
  // ==========================================
  const bicepsMat = sharedFiberMaterial('biceps');
  const tricepsMat = sharedFiberMaterial('triceps');

  const setupUpperArm = (armGroup: THREE.Group, isLeft: boolean) => {
    // Biceps Belly with peaked contour
    const bicepGeo = new THREE.CylinderGeometry(0.072, 0.065, 0.22, 20);
    bicepGeo.scale(0.9, 1.0, 1.2);
    const pos = bicepGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getZ(i) > 0) {
        // peak curvature in center of muscle belly
        const y = pos.getY(i);
        pos.setZ(i, pos.getZ(i) + (0.025 * (1 - Math.abs(y * 8))));
      }
    }
    bicepGeo.computeVertexNormals();
    const bicepMesh = new THREE.Mesh(bicepGeo, bicepsMat);
    bicepMesh.position.set(isLeft ? 0.01 : -0.01, -0.18, 0.045);
    bicepMesh.rotation.set(0.05, 0, 0);
    armGroup.add(bicepMesh);
    registerMuscleMesh(bicepMesh, 'biceps', isLeft ? 'mesh_biceps_l' : 'mesh_biceps_r');

    // Triceps Horseshoe (Lateral and Long heads)
    const tricepGeo = new THREE.CylinderGeometry(0.076, 0.068, 0.24, 20);
    tricepGeo.scale(1.15, 1.0, 0.95);
    const posTri = tricepGeo.attributes.position;
    for (let i = 0; i < posTri.count; i++) {
      if (posTri.getZ(i) < 0) {
        const y = posTri.getY(i);
        posTri.setZ(i, posTri.getZ(i) - (0.022 * (1 - Math.abs(y * 7))));
      }
    }
    tricepGeo.computeVertexNormals();
    const tricepMesh = new THREE.Mesh(tricepGeo, tricepsMat);
    tricepMesh.position.set(isLeft ? -0.01 : 0.01, -0.19, -0.045);
    armGroup.add(tricepMesh);
    registerMuscleMesh(tricepMesh, 'triceps', isLeft ? 'mesh_triceps_lat_l' : 'mesh_triceps_lat_r');

    // Arm Core / Bone
    const armCoreGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.26, 16);
    const armCore = new THREE.Mesh(armCoreGeo, skinToneMaterial);
    armCore.position.set(0, -0.18, 0);
    armGroup.add(armCore);
  };

  setupUpperArm(armLeft, true);
  setupUpperArm(armRight, false);

  // Forearms & Hands
  const setupForearm = (forearmGroup: THREE.Group, isLeft: boolean) => {
    // Muscular forearm with brachioradialis bulge
    const forearmGeo = new THREE.CylinderGeometry(0.068, 0.042, 0.28, 20);
    forearmGeo.scale(1.15, 1.0, 0.85);
    const forearmMesh = new THREE.Mesh(forearmGeo, skinToneMaterial);
    forearmMesh.position.set(0, -0.14, 0);
    forearmGroup.add(forearmMesh);

    // Hand with curled athletic grip
    const handGeo = new THREE.BoxGeometry(0.065, 0.11, 0.04, 8, 8, 4);
    const handMesh = new THREE.Mesh(handGeo, skinToneMaterial);
    handMesh.position.set(0, -0.32, 0.01);
    forearmGroup.add(handMesh);
  };

  setupForearm(forearmLeft, true);
  setupForearm(forearmRight, false);

  // ==========================================
  // 9. PELVIS & COMPRESSION TRUNKS / SHORTS
  // ==========================================
  const pelvisGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.28, 24);
  pelvisGeo.scale(1.0, 1.0, 0.78);
  const trunks = new THREE.Mesh(pelvisGeo, shortsMaterial);
  trunks.position.set(0, 0.11, 0);
  trunks.castShadow = true;
  trunks.receiveShadow = true;
  spine.add(trunks);

  // ==========================================
  // 10. GLUTES (Gluteus Maximus - Powerful Contours)
  // ==========================================
  const glutesMat = sharedFiberMaterial('glutes');
  const createGluteMesh = (isLeft: boolean) => {
    const gluteGeo = new THREE.SphereGeometry(0.13, 20, 20);
    gluteGeo.scale(1.05, 1.25, 0.95);
    const mesh = new THREE.Mesh(gluteGeo, glutesMat);
    mesh.position.set(isLeft ? 0.11 : -0.11, 0.08, -0.12);
    mesh.rotation.set(-0.25, isLeft ? 0.2 : -0.2, 0);
    return mesh;
  };

  const gluteL = createGluteMesh(true);
  spine.add(gluteL);
  registerMuscleMesh(gluteL, 'glutes', 'mesh_glutes_l');

  const gluteR = createGluteMesh(false);
  spine.add(gluteR);
  registerMuscleMesh(gluteR, 'glutes', 'mesh_glutes_r');

  // ==========================================
  // 11. THIGHS (QUADRICEPS & HAMSTRINGS)
  // ==========================================
  const quadsMat = sharedFiberMaterial('quadriceps');
  const hamstringsMat = sharedFiberMaterial('hamstrings');

  const setupThigh = (thighGroup: THREE.Group, isLeft: boolean) => {
    // Quadriceps: Vastus Lateralis (outer sweep) & Rectus Femoris & Vastus Medialis (teardrop)
    const quadGeo = new THREE.CylinderGeometry(0.125, 0.088, 0.44, 24);
    quadGeo.scale(1.05, 1.0, 1.15);
    const pos = quadGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Outer sweep
      if (isLeft && x > 0 && y > -0.1) x += 0.025;
      if (!isLeft && x < 0 && y > -0.1) x -= 0.025;

      // Teardrop above knee (Vastus Medialis)
      if (y < -0.05 && y > -0.18) {
        if (isLeft && x < 0 && z > 0) z += 0.035;
        if (!isLeft && x > 0 && z > 0) z += 0.035;
      }

      // Anterior sweep
      if (z > 0) z += 0.02 * (1 - Math.abs(y * 4));
      pos.setXYZ(i, x, y, z);
    }
    quadGeo.computeVertexNormals();

    const quadMesh = new THREE.Mesh(quadGeo, quadsMat);
    quadMesh.position.set(0, -0.22, 0.03);
    thighGroup.add(quadMesh);
    registerMuscleMesh(quadMesh, 'quadriceps', isLeft ? 'mesh_quad_med_l' : 'mesh_quad_med_r');

    // Hamstrings (Posterior Thigh)
    const hamGeo = new THREE.CylinderGeometry(0.11, 0.075, 0.42, 20);
    hamGeo.scale(0.95, 1.0, 1.05);
    const hamMesh = new THREE.Mesh(hamGeo, hamstringsMat);
    hamMesh.position.set(0, -0.21, -0.05);
    thighGroup.add(hamMesh);
    registerMuscleMesh(hamMesh, 'hamstrings', isLeft ? 'mesh_hamstrings_l' : 'mesh_hamstrings_r');

    // Knee Cap / Patella
    const patellaGeo = new THREE.SphereGeometry(0.045, 16, 16);
    patellaGeo.scale(1.0, 1.2, 0.8);
    const patella = new THREE.Mesh(patellaGeo, skinToneMaterial);
    patella.position.set(0, -0.46, 0.065);
    thighGroup.add(patella);
  };

  setupThigh(thighLeft, true);
  setupThigh(thighRight, false);

  // ==========================================
  // 12. SHINS & CALVES (Gastrocnemius Dual Bellies)
  // ==========================================
  const calvesMat = sharedFiberMaterial('calves');

  const setupShin = (shinGroup: THREE.Group, isLeft: boolean) => {
    // Sculpted Gastrocnemius dual bellies (high medial head, lateral head)
    const calfGeo = new THREE.CylinderGeometry(0.095, 0.045, 0.44, 24);
    calfGeo.scale(1.15, 1.0, 1.2);
    const pos = calfGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Posterior calf bulge
      if (z < 0 && y > -0.05) {
        z -= 0.035 * (1 - Math.abs(y * 4));
      }
      pos.setXYZ(i, x, y, z);
    }
    calfGeo.computeVertexNormals();

    const calfMesh = new THREE.Mesh(calfGeo, calvesMat);
    calfMesh.position.set(0, -0.2, -0.02);
    shinGroup.add(calfMesh);
    registerMuscleMesh(calfMesh, 'calves', isLeft ? 'mesh_calves_med_l' : 'mesh_calves_med_r');

    // Shin Bone & Anterior Tibialis
    const shinBoneGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.44, 16);
    const shinBone = new THREE.Mesh(shinBoneGeo, skinToneMaterial);
    shinBone.position.set(0, -0.2, 0.025);
    shinGroup.add(shinBone);

    // Muscular Athletic Foot
    const footGeo = new THREE.BoxGeometry(0.09, 0.07, 0.22, 8, 4, 8);
    const foot = new THREE.Mesh(footGeo, skinToneMaterial);
    foot.position.set(0, -0.46, 0.06);
    shinGroup.add(foot);
  };

  setupShin(shinLeft, true);
  setupShin(shinRight, false);

  // ==========================================
  // 13. SLEEK CIRCULAR ROTATION ORBIT INDICATOR (like mockup)
  // ==========================================
  const orbitGroup = new THREE.Group();
  orbitGroup.position.set(0, 1.15, 0);

  // Circular guide ring with dash pattern
  const ringGeo = new THREE.RingGeometry(0.68, 0.69, 64);
  ringGeo.rotateX(Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x8892b0,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  orbitGroup.add(ringMesh);

  // Glowing pivot dot on the ring
  const dotGeo = new THREE.SphereGeometry(0.02, 16, 16);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0xb4f000 });
  const dotMesh = new THREE.Mesh(dotGeo, dotMat);
  dotMesh.position.set(0.685, 0, 0);
  orbitGroup.add(dotMesh);

  rootGroup.add(orbitGroup);

  // ==========================================
  // 14. DYNAMIC GYM PROPS (Bench, Dumbbells, Barbell, Lat Bar)
  // ==========================================
  const benchGroup = new THREE.Group();
  const benchPadGeo = new THREE.BoxGeometry(0.42, 0.08, 1.25);
  const benchPadMat = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.7 });
  const benchPad = new THREE.Mesh(benchPadGeo, benchPadMat);
  benchPad.position.set(0, 0.45, 0);
  benchGroup.add(benchPad);

  // Bench legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x2b303c, metalness: 0.8, roughness: 0.3 });
  const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45), legMat);
  leg1.position.set(0, 0.225, 0.45);
  benchGroup.add(leg1);
  const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45), legMat);
  leg2.position.set(0, 0.225, -0.45);
  benchGroup.add(leg2);
  benchGroup.visible = false;
  rootGroup.add(benchGroup);

  // Hex Dumbbells Pair
  const dumbbellsGroup = new THREE.Group();
  const createDumbbell = () => {
    const db = new THREE.Group();
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24), legMat);
    handle.rotation.z = Math.PI / 2;
    db.add(handle);
    const weightGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.06, 6);
    weightGeo.rotateZ(Math.PI / 2);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x1f2228, roughness: 0.5 });
    const w1 = new THREE.Mesh(weightGeo, wMat);
    w1.position.set(0.12, 0, 0);
    db.add(w1);
    const w2 = new THREE.Mesh(weightGeo, wMat);
    w2.position.set(-0.12, 0, 0);
    db.add(w2);
    return db;
  };
  const dbLeft = createDumbbell();
  dbLeft.name = 'db_left';
  dumbbellsGroup.add(dbLeft);
  const dbRight = createDumbbell();
  dbRight.name = 'db_right';
  dumbbellsGroup.add(dbRight);
  dumbbellsGroup.visible = false;
  rootGroup.add(dumbbellsGroup);

  // Barbell
  const barbellGroup = new THREE.Group();
  const barMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.8), legMat);
  barMesh.rotation.z = Math.PI / 2;
  barbellGroup.add(barMesh);
  const plateGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 24);
  plateGeo.rotateZ(Math.PI / 2);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.6 });
  const p1 = new THREE.Mesh(plateGeo, plateMat);
  p1.position.set(0.72, 0, 0);
  barbellGroup.add(p1);
  const p2 = new THREE.Mesh(plateGeo, plateMat);
  p2.position.set(-0.72, 0, 0);
  barbellGroup.add(p2);
  barbellGroup.visible = false;
  rootGroup.add(barbellGroup);

  // Lat Pulldown Bar
  const latBarGroup = new THREE.Group();
  const latBarGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.35, 16);
  latBarGeo.rotateZ(Math.PI / 2);
  const latBarMesh = new THREE.Mesh(latBarGeo, legMat);
  latBarGroup.add(latBarMesh);
  latBarGroup.visible = false;
  rootGroup.add(latBarGroup);

  return {
    rootGroup,
    muscleMeshes,
    materialsMap,
    bones: {
      spine,
      torso,
      head,
      armLeft,
      forearmLeft,
      armRight,
      forearmRight,
      thighLeft,
      shinLeft,
      thighRight,
      shinRight,
    },
    props: {
      bench: benchGroup,
      dumbbells: dumbbellsGroup,
      barbell: barbellGroup,
      latBar: latBarGroup,
      orbitRing: orbitGroup,
    },
  };
}

// Reset skeleton poses to pristine anatomical upright stance
export function resetAnatomyPose(rig: AnatomicalRig) {
  const { bones, props } = rig;
  bones.spine.position.set(0, 0.95, 0);
  bones.spine.rotation.set(0, 0, 0);

  bones.torso.position.set(0, 0.35, 0);
  bones.torso.rotation.set(0, 0, 0);

  bones.head.position.set(0, 0.52, 0);
  bones.head.rotation.set(0, 0, 0);

  bones.armLeft.position.set(0.38, 0.38, 0);
  bones.armLeft.rotation.set(0, 0, -0.15);
  bones.forearmLeft.rotation.set(0, 0, 0);

  bones.armRight.position.set(-0.38, 0.38, 0);
  bones.armRight.rotation.set(0, 0, 0.15);
  bones.forearmRight.rotation.set(0, 0, 0);

  bones.thighLeft.position.set(0.18, 0, 0);
  bones.thighLeft.rotation.set(0, 0, 0);
  bones.shinLeft.rotation.set(0, 0, 0);

  bones.thighRight.position.set(-0.18, 0, 0);
  bones.thighRight.rotation.set(0, 0, 0);
  bones.shinRight.rotation.set(0, 0, 0);

  props.bench.visible = false;
  props.dumbbells.visible = false;
  props.barbell.visible = false;
  props.latBar.visible = false;
}

// Animate skeleton according to exercise keyframes & phase
export function applyExerciseKinematics(
  rig: AnatomicalRig,
  exerciseId: string,
  progress: number // 0.0 to 1.0 normalized
) {
  const { bones, props } = rig;
  resetAnatomyPose(rig);

  switch (exerciseId) {
    case 'dumbbell_bench_press': {
      // Body lies horizontal on the bench
      props.bench.visible = true;
      props.bench.position.set(0, 0.45, 0);

      bones.spine.position.set(0, 0.55, 0);
      bones.spine.rotation.set(-Math.PI / 2, 0, 0);

      // Legs bent down to ground
      bones.thighLeft.rotation.set(0.7, 0, 0.3);
      bones.shinLeft.rotation.set(0.9, 0, 0);
      bones.thighRight.rotation.set(0.7, 0, -0.3);
      bones.shinRight.rotation.set(0.9, 0, 0);

      // Press phase: 0 = bottom stretch, 0.5 = midpoint, 1.0 = top lock
      // Smooth sinusoidal cycle for lowering and pressing
      const pressCycle = Math.sin(progress * Math.PI); // 0 at ends, 1 at peak
      const armAbduction = THREE.MathUtils.lerp(1.2, 0.35, pressCycle);
      const elbowFlex = THREE.MathUtils.lerp(1.6, 0.15, pressCycle);

      bones.armLeft.rotation.set(0, -armAbduction, 0.2);
      bones.forearmLeft.rotation.set(0, elbowFlex, 0);

      bones.armRight.rotation.set(0, armAbduction, -0.2);
      bones.forearmRight.rotation.set(0, -elbowFlex, 0);

      // Position dumbbells in hands
      props.dumbbells.visible = true;
      const dbLeft = props.dumbbells.getObjectByName('db_left');
      const dbRight = props.dumbbells.getObjectByName('db_right');
      if (dbLeft && dbRight) {
        const heightZ = THREE.MathUtils.lerp(0.68, 1.1, pressCycle);
        dbLeft.position.set(0.24 - pressCycle * 0.1, heightZ, 0.12);
        dbRight.position.set(-0.24 + pressCycle * 0.1, heightZ, 0.12);
      }
      break;
    }

    case 'lat_pulldown': {
      // Seated upright with slight lean back
      bones.spine.position.set(0, 0.52, 0);
      bones.thighLeft.rotation.set(Math.PI / 2, 0, 0.1);
      bones.shinLeft.rotation.set(-Math.PI / 2, 0, 0);
      bones.thighRight.rotation.set(Math.PI / 2, 0, -0.1);
      bones.shinRight.rotation.set(-Math.PI / 2, 0, 0);

      // Pull down cycle
      const pullCycle = Math.sin(progress * Math.PI);
      const shoulderElevation = THREE.MathUtils.lerp(2.8, 1.1, pullCycle);
      const elbowPull = THREE.MathUtils.lerp(0.2, 2.1, pullCycle);

      bones.armLeft.rotation.set(0, 0, shoulderElevation);
      bones.forearmLeft.rotation.set(0, 0, -elbowPull);

      bones.armRight.rotation.set(0, 0, -shoulderElevation);
      bones.forearmRight.rotation.set(0, 0, elbowPull);

      props.latBar.visible = true;
      const barY = THREE.MathUtils.lerp(2.2, 1.45, pullCycle);
      props.latBar.position.set(0, barY, 0.15);
      break;
    }

    case 'bodyweight_squat': {
      // Squat depth cycle
      const squatCycle = Math.sin(progress * Math.PI);
      const hipDrop = THREE.MathUtils.lerp(0, 0.46, squatCycle);
      const hipFlex = THREE.MathUtils.lerp(0, 1.7, squatCycle);
      const kneeFlex = THREE.MathUtils.lerp(0, 2.1, squatCycle);
      const torsoAngle = THREE.MathUtils.lerp(0, 0.55, squatCycle);

      bones.spine.position.set(0, 0.95 - hipDrop, -squatCycle * 0.12);
      bones.torso.rotation.set(torsoAngle, 0, 0);

      bones.thighLeft.rotation.set(-hipFlex, 0, 0.18);
      bones.shinLeft.rotation.set(kneeFlex, 0, 0);

      bones.thighRight.rotation.set(-hipFlex, 0, -0.18);
      bones.shinRight.rotation.set(kneeFlex, 0, 0);

      // Arms reaching forward for balance
      bones.armLeft.rotation.set(-1.4, 0, -0.2);
      bones.armRight.rotation.set(-1.4, 0, 0.2);
      break;
    }

    case 'seated_cable_row': {
      // Seated with slight torso sway
      bones.spine.position.set(0, 0.35, 0);
      bones.thighLeft.rotation.set(1.5, 0, 0.15);
      bones.shinLeft.rotation.set(-0.3, 0, 0);
      bones.thighRight.rotation.set(1.5, 0, -0.15);
      bones.shinRight.rotation.set(-0.3, 0, 0);

      const rowCycle = Math.sin(progress * Math.PI);
      bones.torso.rotation.set(THREE.MathUtils.lerp(-0.15, 0.15, rowCycle), 0, 0);

      const armExtension = THREE.MathUtils.lerp(-1.2, 0.4, rowCycle);
      const elbowDrive = THREE.MathUtils.lerp(0.3, 2.0, rowCycle);

      bones.armLeft.rotation.set(armExtension, 0, 0.15);
      bones.forearmLeft.rotation.set(-elbowDrive, 0, 0);
      bones.armRight.rotation.set(armExtension, 0, -0.15);
      bones.forearmRight.rotation.set(-elbowDrive, 0, 0);
      break;
    }

    case 'face_pull': {
      const pullCycle = Math.sin(progress * Math.PI);
      const abduction = THREE.MathUtils.lerp(0.8, 1.6, pullCycle);
      const externalRotation = THREE.MathUtils.lerp(0.2, 1.4, pullCycle);

      bones.armLeft.rotation.set(0, -abduction, -0.4);
      bones.forearmLeft.rotation.set(externalRotation, 0, 0);
      bones.armRight.rotation.set(0, abduction, 0.4);
      bones.forearmRight.rotation.set(externalRotation, 0, 0);
      break;
    }

    case 'overhead_press': {
      const pressCycle = Math.sin(progress * Math.PI);
      const armLift = THREE.MathUtils.lerp(0.8, 2.9, pressCycle);
      const forearmAngle = THREE.MathUtils.lerp(1.8, 0.2, pressCycle);

      bones.armLeft.rotation.set(0, 0, armLift);
      bones.forearmLeft.rotation.set(0, 0, -forearmAngle);
      bones.armRight.rotation.set(0, 0, -armLift);
      bones.forearmRight.rotation.set(0, 0, forearmAngle);

      props.barbell.visible = true;
      const barY = THREE.MathUtils.lerp(1.4, 2.18, pressCycle);
      props.barbell.position.set(0, barY, 0.12);
      break;
    }

    case 'lateral_raise': {
      const raiseCycle = Math.sin(progress * Math.PI);
      const liftAngle = THREE.MathUtils.lerp(0.15, 1.48, raiseCycle);

      bones.armLeft.rotation.set(-0.15, 0, liftAngle);
      bones.armRight.rotation.set(-0.15, 0, -liftAngle);

      props.dumbbells.visible = true;
      const dbLeft = props.dumbbells.getObjectByName('db_left');
      const dbRight = props.dumbbells.getObjectByName('db_right');
      if (dbLeft && dbRight) {
        const xPos = THREE.MathUtils.lerp(0.35, 0.85, raiseCycle);
        const yPos = THREE.MathUtils.lerp(0.9, 1.45, raiseCycle);
        dbLeft.position.set(xPos, yPos, 0.08);
        dbRight.position.set(-xPos, yPos, 0.08);
      }
      break;
    }

    case 'biceps_curl': {
      const curlCycle = Math.sin(progress * Math.PI);
      const curlAngle = THREE.MathUtils.lerp(0.1, 2.2, curlCycle);

      bones.armLeft.rotation.set(0.1, 0, -0.1);
      bones.forearmLeft.rotation.set(curlAngle, 0, 0.2);
      bones.armRight.rotation.set(0.1, 0, 0.1);
      bones.forearmRight.rotation.set(curlAngle, 0, -0.2);

      props.dumbbells.visible = true;
      const dbLeft = props.dumbbells.getObjectByName('db_left');
      const dbRight = props.dumbbells.getObjectByName('db_right');
      if (dbLeft && dbRight) {
        const yPos = THREE.MathUtils.lerp(0.72, 1.25, curlCycle);
        const zPos = THREE.MathUtils.lerp(0.05, 0.28, curlCycle);
        dbLeft.position.set(0.32, yPos, zPos);
        dbRight.position.set(-0.32, yPos, zPos);
      }
      break;
    }

    case 'triceps_pushdown': {
      const pushCycle = Math.sin(progress * Math.PI);
      const extension = THREE.MathUtils.lerp(1.7, 0.1, pushCycle);

      bones.armLeft.rotation.set(0.2, 0, -0.15);
      bones.forearmLeft.rotation.set(extension, 0, 0);
      bones.armRight.rotation.set(0.2, 0, 0.15);
      bones.forearmRight.rotation.set(extension, 0, 0);
      break;
    }

    case 'romanian_deadlift': {
      const hingeCycle = Math.sin(progress * Math.PI);
      const hingeAngle = THREE.MathUtils.lerp(0, 1.25, hingeCycle);
      const kneeSoft = THREE.MathUtils.lerp(0, 0.35, hingeCycle);

      bones.spine.position.set(0, 0.95, -hingeCycle * 0.18);
      bones.torso.rotation.set(hingeAngle, 0, 0);

      bones.thighLeft.rotation.set(-kneeSoft, 0, 0);
      bones.shinLeft.rotation.set(kneeSoft * 0.8, 0, 0);
      bones.thighRight.rotation.set(-kneeSoft, 0, 0);
      bones.shinRight.rotation.set(kneeSoft * 0.8, 0, 0);

      props.barbell.visible = true;
      const barY = THREE.MathUtils.lerp(0.85, 0.38, hingeCycle);
      const barZ = THREE.MathUtils.lerp(0.16, 0.28, hingeCycle);
      props.barbell.position.set(0, barY, barZ);
      break;
    }

    case 'standing_calf_raise': {
      const raiseCycle = Math.sin(progress * Math.PI);
      const plantarFlex = THREE.MathUtils.lerp(0, 0.42, raiseCycle);
      const height = THREE.MathUtils.lerp(0, 0.12, raiseCycle);

      bones.spine.position.set(0, 0.95 + height, 0);
      bones.shinLeft.rotation.set(-plantarFlex, 0, 0);
      bones.shinRight.rotation.set(-plantarFlex, 0, 0);
      break;
    }

    case 'core_plank': {
      // Horizontal prone plank position
      bones.spine.position.set(0, 0.35, 0);
      bones.spine.rotation.set(Math.PI / 2, 0, 0);

      bones.armLeft.rotation.set(0, 0, 1.4);
      bones.forearmLeft.rotation.set(Math.PI / 2, 0, 0);
      bones.armRight.rotation.set(0, 0, -1.4);
      bones.forearmRight.rotation.set(Math.PI / 2, 0, 0);

      bones.thighLeft.rotation.set(0, 0, 0.1);
      bones.shinLeft.rotation.set(0, 0, 0);
      bones.thighRight.rotation.set(0, 0, -0.1);
      bones.shinRight.rotation.set(0, 0, 0);
      break;
    }

    default:
      break;
  }
}

/**
 * Highlights muscles on the procedural rig model with luminous glowing red for selection.
 */
export function highlightRigMuscles(
  rig: AnatomicalRig,
  selectedMuscleId: string | null,
  isolationMode: boolean
) {
  rig.muscleMeshes.forEach((mesh) => {
    const muscleId = mesh.userData.muscleId as string;
    const isSelected = !!(selectedMuscleId && muscleId === selectedMuscleId);
    const mat = mesh.material as THREE.MeshStandardMaterial;

    if (isSelected) {
      // High-visibility glowing crimson red
      mat.color.setHex(0xff1744);
      mat.emissive.setHex(0xdd002f);
      mat.emissiveIntensity = 1.35;
      mat.roughness = 0.25;
      mat.opacity = 1.0;
      mat.transparent = false;
    } else {
      if (isolationMode && selectedMuscleId) {
        mat.color.setHex(0x181a22);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
        mat.opacity = 0.15;
        mat.transparent = true;
      } else {
        mat.color.setHex(0x3e4350);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
        mat.roughness = 0.45;
        mat.opacity = 1.0;
        mat.transparent = false;
      }
    }
  });
}
