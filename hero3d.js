// ═══════════════════════════════════════════════════════════
// HERO 3D — Three.js Stylized Robot
// ═══════════════════════════════════════════════════════════
(function () {
  'use strict';

  const canvas = document.getElementById('hero-3d');
  if (!canvas || typeof THREE === 'undefined') return;

  // ─── Renderer ───
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.5, 7);

  // ─── Colors ───
  const ORANGE = 0xff4d00;
  const ORANGE_GLOW = 0xff6a2a;
  const DARK_METAL = 0x1a1a1a;
  const MID_METAL = 0x2a2a2a;
  const LIGHT_METAL = 0x3a3a3a;

  // ─── Materials ───
  const bodyMat = new THREE.MeshStandardMaterial({
    color: DARK_METAL,
    metalness: 0.8,
    roughness: 0.3,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: MID_METAL,
    metalness: 0.7,
    roughness: 0.4,
  });
  const detailMat = new THREE.MeshStandardMaterial({
    color: LIGHT_METAL,
    metalness: 0.6,
    roughness: 0.5,
  });
  const glowMat = new THREE.MeshBasicMaterial({ color: ORANGE });
  const wireMat = new THREE.MeshBasicMaterial({
    color: ORANGE,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });

  // ─── Robot Group ───
  const robot = new THREE.Group();

  // ── HEAD ──
  const head = new THREE.Group();

  // Main head box
  const headBox = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.7, 0.8),
    bodyMat
  );
  head.add(headBox);

  // Visor (eye strip)
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.15, 0.05),
    glowMat
  );
  visor.position.set(0, 0.05, 0.41);
  head.add(visor);

  // Eye dots
  const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const leftEye = new THREE.Mesh(eyeGeo, glowMat);
  leftEye.position.set(-0.2, 0.05, 0.42);
  leftEye.scale.set(1, 1, 0.5);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, glowMat);
  rightEye.position.set(0.2, 0.05, 0.42);
  rightEye.scale.set(1, 1, 0.5);
  head.add(rightEye);

  // Antenna
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8),
    detailMat
  );
  antenna.position.set(0, 0.52, 0);
  head.add(antenna);

  const antennaTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    glowMat
  );
  antennaTip.position.set(0, 0.72, 0);
  head.add(antennaTip);

  // Head side panels
  const earGeo = new THREE.BoxGeometry(0.12, 0.3, 0.5);
  const leftEar = new THREE.Mesh(earGeo, accentMat);
  leftEar.position.set(-0.56, 0, 0);
  head.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, accentMat);
  rightEar.position.set(0.56, 0, 0);
  head.add(rightEar);

  head.position.y = 1.35;
  robot.add(head);

  // ── NECK ──
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.25, 8),
    accentMat
  );
  neck.position.y = 0.9;
  robot.add(neck);

  // ── TORSO ──
  const torso = new THREE.Group();

  // Main chest
  const chest = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.2, 0.9),
    bodyMat
  );
  torso.add(chest);

  // Chest plate
  const chestPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.6, 0.1),
    accentMat
  );
  chestPlate.position.set(0, 0.1, 0.46);
  torso.add(chestPlate);

  // Core reactor (glowing circle)
  const reactorRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.03, 16, 32),
    glowMat
  );
  reactorRing.position.set(0, 0.1, 0.52);
  torso.add(reactorRing);

  const reactorCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    glowMat
  );
  reactorCore.position.set(0, 0.1, 0.52);
  torso.add(reactorCore);

  // Chest detail lines
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.02, 0.02),
      new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.3 })
    );
    line.position.set(0, -0.15 - i * 0.08, 0.46);
    torso.add(line);
  }

  // Belt
  const belt = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.12, 0.95),
    accentMat
  );
  belt.position.y = -0.6;
  torso.add(belt);

  torso.position.y = 0.15;
  robot.add(torso);

  // ── SHOULDERS ──
  const shoulderGeo = new THREE.SphereGeometry(0.22, 16, 16);

  const leftShoulder = new THREE.Mesh(shoulderGeo, accentMat);
  leftShoulder.position.set(-0.85, 0.85, 0);
  robot.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(shoulderGeo, accentMat);
  rightShoulder.position.set(0.85, 0.85, 0);
  robot.add(rightShoulder);

  // ── ARMS ──
  function createArm() {
    const arm = new THREE.Group();

    // Upper arm
    const upper = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.6, 0.22),
      bodyMat
    );
    upper.position.y = -0.3;
    arm.add(upper);

    // Elbow joint
    const elbow = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 16),
      detailMat
    );
    elbow.position.y = -0.6;
    arm.add(elbow);

    // Forearm
    const forearm = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.55, 0.18),
      accentMat
    );
    forearm.position.y = -0.95;
    arm.add(forearm);

    // Hand
    const hand = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.15, 0.12),
      detailMat
    );
    hand.position.y = -1.3;
    arm.add(hand);

    // Glow accent on forearm
    const armGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.25, 0.04),
      glowMat
    );
    armGlow.position.set(0, -0.85, 0.1);
    arm.add(armGlow);

    return arm;
  }

  const leftArm = createArm();
  leftArm.position.set(-0.85, 0.75, 0);
  robot.add(leftArm);

  const rightArm = createArm();
  rightArm.position.set(0.85, 0.75, 0);
  robot.add(rightArm);

  // ── LEGS ──
  function createLeg() {
    const leg = new THREE.Group();

    // Upper leg
    const upper = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.55, 0.3),
      bodyMat
    );
    upper.position.y = -0.28;
    leg.add(upper);

    // Knee joint
    const knee = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      detailMat
    );
    knee.position.y = -0.55;
    leg.add(knee);

    // Lower leg
    const lower = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.6, 0.25),
      accentMat
    );
    lower.position.y = -0.9;
    leg.add(lower);

    // Foot
    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.12, 0.45),
      bodyMat
    );
    foot.position.set(0, -1.26, 0.05);
    leg.add(foot);

    // Leg glow stripe
    const legGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.3, 0.04),
      glowMat
    );
    legGlow.position.set(0, -0.8, 0.14);
    leg.add(legGlow);

    return leg;
  }

  const leftLeg = createLeg();
  leftLeg.position.set(-0.35, -0.55, 0);
  robot.add(leftLeg);

  const rightLeg = createLeg();
  rightLeg.position.set(0.35, -0.55, 0);
  robot.add(rightLeg);

  // ── WIREFRAME AURA ──
  const aura = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.8, 1),
    wireMat
  );
  robot.add(aura);

  // ── FLOATING PARTICLES ──
  const particleCount = 80;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.5 + Math.random() * 2;
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: ORANGE,
    size: 0.025,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  }));
  robot.add(particles);

  // Position robot
  robot.position.y = -0.2;
  scene.add(robot);

  // ─── Lighting ───
  const ambientLight = new THREE.AmbientLight(0x222222, 1.5);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(ORANGE_GLOW, 2.0);
  mainLight.position.set(3, 4, 5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x4466ff, 0.5);
  fillLight.position.set(-3, 2, -2);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(ORANGE, 1.5, 10);
  rimLight.position.set(0, 2, -3);
  scene.add(rimLight);

  // Ground glow
  const groundGlow = new THREE.PointLight(ORANGE, 0.8, 5);
  groundGlow.position.set(0, -2.5, 1);
  scene.add(groundGlow);

  // ─── Mouse Tracking ───
  let mouseX = 0, mouseY = 0;
  let targetMX = 0, targetMY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ─── Resize ───
  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ─── Animation Loop ───
  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    // Smooth mouse
    mouseX += (targetMX - mouseX) * 0.04;
    mouseY += (targetMY - mouseY) * 0.04;

    // Robot hover float
    robot.position.y = -0.2 + Math.sin(t * 0.8) * 0.15;

    // Robot body rotation follows mouse
    robot.rotation.y = mouseX * 0.5 + Math.sin(t * 0.3) * 0.1;
    robot.rotation.x = mouseY * 0.15;

    // Head looks at cursor more
    head.rotation.y = mouseX * 0.4;
    head.rotation.x = -mouseY * 0.25;

    // Arm sway
    leftArm.rotation.x = Math.sin(t * 1.2) * 0.12;
    leftArm.rotation.z = 0.08 + Math.sin(t * 0.9) * 0.05;
    rightArm.rotation.x = Math.sin(t * 1.2 + Math.PI) * 0.12;
    rightArm.rotation.z = -0.08 - Math.sin(t * 0.9) * 0.05;

    // Leg sway (subtle)
    leftLeg.rotation.x = Math.sin(t * 0.7) * 0.05;
    rightLeg.rotation.x = Math.sin(t * 0.7 + Math.PI) * 0.05;

    // Antenna tip pulse
    const pulse = 0.8 + Math.sin(t * 4) * 0.3;
    antennaTip.scale.setScalar(pulse);

    // Reactor pulse
    const rPulse = 1 + Math.sin(t * 3) * 0.2;
    reactorCore.scale.setScalar(rPulse);
    reactorRing.scale.setScalar(0.9 + Math.sin(t * 2) * 0.15);

    // Visor flicker (very subtle)
    visor.material.opacity = 0.85 + Math.sin(t * 8) * 0.15;

    // Aura slow rotate
    aura.rotation.x = t * 0.05;
    aura.rotation.y = t * 0.07;

    // Particles drift
    particles.rotation.y = t * 0.04;

    // Camera
    camera.position.x = mouseX * 0.6;
    camera.position.y = 0.5 - mouseY * 0.3;
    camera.lookAt(0, 0.3, 0);

    renderer.render(scene, camera);
  }

  animate();
})();
