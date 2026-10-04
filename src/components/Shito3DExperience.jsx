import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import './Shito3DExperience.css';

// Procedural noise bump map for authentic coarse Ghanaian shito texture
function createShitoBumpTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Generate coarse chili seed and smoked fish speckles
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const radius = Math.random() * 2.2 + 0.5;
    const shade = Math.floor(Math.random() * 255);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  return texture;
}

// Procedural soft shadow texture for contact floor plane
function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
}

const EDITIONS = [
  {
    id: 'ks-red-250',
    name: 'Red Edition',
    subtitle: 'Scotch Bonnet & Smoked Seafood',
    lidHex: 0xdc2626,
    glowHex: 0xef4444,
    metalness: 0.35,
    roughness: 0.35,
    price: 45.0
  },
  {
    id: 'ks-blue-250',
    name: 'Blue Edition',
    subtitle: 'Volta Delta River Prawn',
    lidHex: 0x2563eb,
    glowHex: 0x3b82f6,
    metalness: 0.35,
    roughness: 0.35,
    price: 45.0
  },
  {
    id: 'ks-green-250',
    name: 'Green Edition',
    subtitle: 'Emerald Kpakpo Pepper',
    lidHex: 0x16a34a,
    glowHex: 0x22c55e,
    metalness: 0.35,
    roughness: 0.35,
    price: 45.0
  },
  {
    id: 'ks-gold-250',
    name: 'Gold Edition',
    subtitle: '12-Hour Copper Kettle Reserve',
    lidHex: 0xd4af37,
    glowHex: 0xf59e0b,
    metalness: 0.88,
    roughness: 0.2,
    price: 55.0
  }
];

export default function Shito3DExperience({
  initialEdition = 'ks-red-250',
  onAddToCart,
  onClose,
  isModal = false
}) {
  const mountRef = useRef(null);
  const [activeEdition, setActiveEdition] = useState(
    () => EDITIONS.find((e) => e.id === initialEdition) || EDITIONS[0]
  );
  const [isExploded, setIsExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeAngle, setActiveAngle] = useState('front');

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const jarGroupRef = useRef(null);
  const lidGroupRef = useRef(null);
  const lidMatRef = useRef(null);
  const oilMeshRef = useRef(null);
  const coreMeshRef = useRef(null);
  const baseMeshRef = useRef(null);
  const glassMeshRef = useRef(null);
  const underGlowLightRef = useRef(null);
  const particlesRef = useRef(null);
  const explodedTimelineRef = useRef(null);

  // Rotation damping state
  const rotationState = useRef({
    targetY: 0,
    targetX: 0,
    currentY: 0,
    currentX: 0,
    isDragging: false,
    prevX: 0,
    prevY: 0
  });

  // ── 1. SETUP THREE.JS SCENE ────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── STUDIO LIGHTING ──────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4.5, 5.5, 4.0);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 2.2);
    rimLight.position.set(-4.5, 4.0, -3.5);
    scene.add(rimLight);

    const amberFillLight = new THREE.DirectionalLight(0xf59e0b, 1.4);
    amberFillLight.position.set(3.0, -1.0, 3.0);
    scene.add(amberFillLight);

    const underGlow = new THREE.PointLight(activeEdition.glowHex, 2.8, 7);
    underGlow.position.set(0, -1.6, 0.8);
    scene.add(underGlow);
    underGlowLightRef.current = underGlow;

    // ── SOFT CONTACT FLOOR SHADOW ────────────────────────────────────────────
    const shadowTex = createShadowTexture();
    if (shadowTex) {
      const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -1.22;
      scene.add(shadowMesh);
    }

    // ── JAR CONTAINER GROUP ──────────────────────────────────────────────────
    const jarGroup = new THREE.Group();
    scene.add(jarGroup);
    jarGroupRef.current = jarGroup;

    // ── ULTRA-REALISTIC PHYSICAL GLASS ───────────────────────────────────────
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.03,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.52,
      depthWrite: false
    });

    // Outer Glass Body
    const glassGeo = new THREE.CylinderGeometry(0.92, 0.88, 2.3, 64, 8, true);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.renderOrder = 10;
    jarGroup.add(glassMesh);
    glassMeshRef.current = glassMesh;

    // Glass Base Bottom
    const baseGlassGeo = new THREE.CylinderGeometry(0.88, 0.84, 0.16, 64);
    const baseGlassMesh = new THREE.Mesh(baseGlassGeo, glassMat);
    baseGlassMesh.position.y = -1.15;
    jarGroup.add(baseGlassMesh);

    // Decorative Twist Ribs (Top & Bottom Shoulders)
    for (let r = 0; r < 4; r++) {
      const ringGeo = new THREE.TorusGeometry(0.935, 0.03, 16, 64);
      const ringMesh = new THREE.Mesh(ringGeo, glassMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -0.75 + r * 0.48;
      jarGroup.add(ringMesh);
    }

    // Glass Screw Neck Threads
    for (let t = 0; t < 2; t++) {
      const threadGeo = new THREE.TorusGeometry(0.93, 0.025, 12, 48);
      const threadMesh = new THREE.Mesh(threadGeo, glassMat);
      threadMesh.rotation.x = Math.PI / 2;
      threadMesh.position.y = 1.14 + t * 0.09;
      jarGroup.add(threadMesh);
    }

    // ── AUTHENTIC CULINARY LAYERS ────────────────────────────────────────────
    const bumpTex = createShitoBumpTexture();

    // Layer 1: Coarse Smoked Seafood Sediment Bed (Volta Prawn & Herring)
    const baseGeo = new THREE.CylinderGeometry(0.87, 0.85, 0.75, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x140602,
      roughness: 0.82,
      metalness: 0.05,
      bumpMap: bumpTex,
      bumpScale: 0.04
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.75;
    jarGroup.add(baseMesh);
    baseMeshRef.current = baseMesh;

    // Layer 2: Slow-Cooked Caramelized Shito Core (Black-Gold Scotch Bonnet)
    const coreGeo = new THREE.CylinderGeometry(0.87, 0.87, 0.85, 48);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x220c04,
      roughness: 0.6,
      metalness: 0.1,
      bumpMap: bumpTex,
      bumpScale: 0.03
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0.05;
    jarGroup.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // Layer 3: Glistening Infused Chili Oil Meniscus
    const oilGeo = new THREE.CylinderGeometry(0.865, 0.87, 0.45, 48);
    const oilMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      emissive: 0x78350f,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.88,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 0.8
    });
    const oilMesh = new THREE.Mesh(oilGeo, oilMat);
    oilMesh.position.y = 0.7;
    jarGroup.add(oilMesh);
    oilMeshRef.current = oilMesh;

    // ── SUSPENDED CHILI FLAKES & SEEDS PARTICLE CLOUD ────────────────────────
    const particleCount = 45;
    const particleGeo = new THREE.DodecahedronGeometry(0.024, 0);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.2
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.15 + Math.random() * 0.65;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = 0.45 + (Math.random() - 0.5) * 0.45;

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = 0.6 + Math.random() * 0.8;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    jarGroup.add(particles);
    particlesRef.current = particles;

    // ── SCREW-TOP FLUTED LID WITH METALLIC SAFETY SEAL ───────────────────────
    const lidGroup = new THREE.Group();

    // Lid Material
    const lidMat = new THREE.MeshStandardMaterial({
      color: activeEdition.lidHex,
      roughness: activeEdition.roughness,
      metalness: activeEdition.metalness
    });
    lidMatRef.current = lidMat;

    // Main Cap
    const lidMainGeo = new THREE.CylinderGeometry(0.96, 0.96, 0.42, 64);
    const lidMainMesh = new THREE.Mesh(lidMainGeo, lidMat);
    lidGroup.add(lidMainMesh);

    // Fluted Vertical Grips (24 grips around circumference)
    for (let g = 0; g < 24; g++) {
      const gripGeo = new THREE.BoxGeometry(0.04, 0.38, 0.05);
      const angle = (g / 24) * Math.PI * 2;
      const gripMesh = new THREE.Mesh(gripGeo, lidMat);
      gripMesh.position.set(Math.cos(angle) * 0.96, 0, Math.sin(angle) * 0.96);
      gripMesh.rotation.y = -angle;
      lidGroup.add(gripMesh);
    }

    // Inner Metallic Safety Seal
    const sealGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.03, 36);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.92,
      roughness: 0.15
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.position.y = -0.2;
    lidGroup.add(sealMesh);

    lidGroup.position.y = 1.28;
    jarGroup.add(lidGroup);
    lidGroupRef.current = lidGroup;

    // ── POINTER & TOUCH DRAG CONTROLS ────────────────────────────────────────
    const domEl = renderer.domElement;
    const rState = rotationState.current;

    const onPointerDown = (e) => {
      rState.isDragging = true;
      rState.prevX = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
      rState.prevY = e.clientY ?? (e.touches && e.touches[0].clientY) ?? 0;
    };

    const onPointerMove = (e) => {
      if (!rState.isDragging) return;
      const x = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
      const y = e.clientY ?? (e.touches && e.touches[0].clientY) ?? 0;
      const deltaX = x - rState.prevX;
      const deltaY = y - rState.prevY;
      rState.prevX = x;
      rState.prevY = y;

      rState.targetY += deltaX * 0.008;
      rState.targetX += deltaY * 0.005;
      rState.targetX = Math.max(-0.45, Math.min(0.45, rState.targetX));
    };

    const onPointerUp = () => {
      rState.isDragging = false;
    };

    domEl.addEventListener('mousedown', onPointerDown);
    domEl.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    domEl.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // ── RENDER & ANIMATION LOOP ──────────────────────────────────────────────
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto-Orbit when not dragging
      if (autoRotate && !rState.isDragging) {
        rState.targetY += 0.006;
      }

      // Smooth Inertial Interpolation (GSAP style damping)
      rState.currentY += (rState.targetY - rState.currentY) * 0.08;
      rState.currentX += (rState.targetX - rState.currentX) * 0.08;

      jarGroup.rotation.y = rState.currentY;
      jarGroup.rotation.x = rState.currentX;

      // Gentle Floating Suspension
      jarGroup.position.y = 0.22 + Math.sin(elapsed * 1.6) * 0.04;

      // Particle Shimmer
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── WINDOW RESIZE OBSERVER ───────────────────────────────────────────────
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 550;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // ── CLEANUP ON UNMOUNT ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onPointerDown);
      domEl.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      domEl.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // ── 2. GSAP EDITION COLOR & LIGHTING TWEEN ─────────────────────────────────
  const handleEditionSwitch = useCallback((edition) => {
    setActiveEdition(edition);

    if (lidMatRef.current) {
      const targetColor = new THREE.Color(edition.lidHex);
      gsap.to(lidMatRef.current.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.75,
        ease: 'power2.out'
      });
      gsap.to(lidMatRef.current, {
        metalness: edition.metalness,
        roughness: edition.roughness,
        duration: 0.75,
        ease: 'power2.out'
      });
    }

    if (underGlowLightRef.current) {
      const glowColor = new THREE.Color(edition.glowHex);
      gsap.to(underGlowLightRef.current.color, {
        r: glowColor.r,
        g: glowColor.g,
        b: glowColor.b,
        duration: 0.75,
        ease: 'power2.out'
      });
    }

    // Gentle punch camera tween on switch
    if (cameraRef.current) {
      gsap.fromTo(
        cameraRef.current.position,
        { z: cameraRef.current.position.z + 0.15 },
        { z: cameraRef.current.position.z, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  }, []);

  // ── 3. GSAP THREADED UNSCREW & EXPLODED VIEW TIMELINE ──────────────────────
  const toggleExplodedView = useCallback(() => {
    const nextState = !isExploded;
    setIsExploded(nextState);

    const lid = lidGroupRef.current;
    const oil = oilMeshRef.current;
    const core = coreMeshRef.current;
    const base = baseMeshRef.current;
    const glass = glassMeshRef.current;
    const particles = particlesRef.current;

    if (!lid || !oil || !core || !base) return;

    if (explodedTimelineRef.current) {
      explodedTimelineRef.current.kill();
    }

    const tl = gsap.timeline();
    explodedTimelineRef.current = tl;

    if (nextState) {
      // UNSCREW & DISSECT TIMELINE
      // Step A: Cap rotates 720° while unscrewing upward along threads
      tl.to(lid.rotation, {
        y: lid.rotation.y + Math.PI * 4,
        duration: 0.9,
        ease: 'power1.inOut'
      }, 0);

      tl.to(lid.position, {
        y: 2.5,
        duration: 1.1,
        ease: 'power3.out'
      }, 0);

      // Step B: Golden chili oil meniscus rises
      tl.to(oil.position, {
        y: 1.35,
        duration: 1.0,
        ease: 'power2.out'
      }, 0.1);

      // Step C: Particles expand
      if (particles) {
        tl.to(particles.position, {
          y: 0.65,
          duration: 1.0,
          ease: 'power2.out'
        }, 0.1);
      }

      // Step D: Core sauce rests in center
      tl.to(core.position, {
        y: 0.1,
        duration: 0.9,
        ease: 'power2.out'
      }, 0.15);

      // Step E: Smoked seafood foundation sinks downward
      tl.to(base.position, {
        y: -1.15,
        duration: 1.0,
        ease: 'power2.out'
      }, 0.15);

      // Dim outer glass slightly so inner layers stand out
      if (glass) {
        tl.to(glass.material, {
          opacity: 0.15,
          duration: 0.8
        }, 0.1);
      }
    } else {
      // REASSEMBLE TIMELINE (Reverse & Screw back tight)
      tl.to(lid.position, {
        y: 1.28,
        duration: 0.9,
        ease: 'power3.inOut'
      }, 0);

      tl.to(lid.rotation, {
        y: lid.rotation.y - Math.PI * 4,
        duration: 0.8,
        ease: 'power2.inOut'
      }, 0.1);

      tl.to(oil.position, {
        y: 0.7,
        duration: 0.85,
        ease: 'power2.inOut'
      }, 0);

      if (particles) {
        tl.to(particles.position, {
          y: 0,
          duration: 0.85,
          ease: 'power2.inOut'
        }, 0);
      }

      tl.to(core.position, {
        y: 0.05,
        duration: 0.85,
        ease: 'power2.inOut'
      }, 0);

      tl.to(base.position, {
        y: -0.75,
        duration: 0.85,
        ease: 'power2.inOut'
      }, 0);

      if (glass) {
        tl.to(glass.material, {
          opacity: 0.35,
          duration: 0.85
        }, 0);
      }
    }
  }, [isExploded]);

  // ── 4. GSAP CINEMATIC CAMERA FLY-TO PRESETS ────────────────────────────────
  const setCameraAngle = useCallback((angleKey) => {
    setActiveAngle(angleKey);
    const camera = cameraRef.current;
    if (!camera) return;

    const angleConfigs = {
      front: { x: 0, y: 0.2, z: 5.8 },
      texture: { x: 0.35, y: 0.2, z: 3.5 },
      seal: { x: 0, y: 3.0, z: 4.2 },
      exploded: { x: 2.0, y: 0.8, z: 6.6 }
    };

    const target = angleConfigs[angleKey] || angleConfigs.front;

    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.2,
      ease: 'power3.inOut'
    });
  }, []);

  return (
    <div className={`shito-3d-experience-root ${isModal ? 'modal-mode' : 'inline-mode'}`}>
      {/* Viewport Canvas Container */}
      <div className="shito-3d-viewport-wrapper">
        <div ref={mountRef} className="shito-3d-canvas-chassis"></div>

        {/* Floating Apple-Style Control Bar */}
        <div className="shito-3d-glass-dock">
          {/* Edition Chips */}
          <div className="dock-edition-group">
            {EDITIONS.map((e) => (
              <button
                key={e.id}
                className={`dock-edition-chip ${activeEdition.id === e.id ? 'active' : ''}`}
                onClick={() => handleEditionSwitch(e)}
              >
                <span
                  className="dock-color-dot"
                  style={{ backgroundColor: `#${e.lidHex.toString(16).padStart(6, '0')}` }}
                ></span>
                <span className="dock-edition-label">{e.name.replace(' Edition', '')}</span>
              </button>
            ))}
          </div>

          <div className="dock-divider"></div>

          {/* Action Tools */}
          <div className="dock-tools-group">
            <button
              className={`dock-tool-btn ${isExploded ? 'active' : ''}`}
              onClick={toggleExplodedView}
              title={isExploded ? 'Reassemble Jar' : 'Unscrew & Explode Layers'}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span>{isExploded ? 'Reassemble' : 'Unscrew & Explode'}</span>
            </button>

            <button
              className={`dock-tool-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle 360° Orbit"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
              </svg>
              <span>{autoRotate ? 'Orbiting' : 'Paused'}</span>
            </button>
          </div>

          <div className="dock-divider"></div>

          {/* Camera Angles */}
          <div className="dock-angles-group">
            {[
              { id: 'front', label: 'Front' },
              { id: 'texture', label: 'Sauce' },
              { id: 'seal', label: 'Cap' },
              { id: 'exploded', label: 'Iso' }
            ].map((ang) => (
              <button
                key={ang.id}
                className={`dock-angle-pill ${activeAngle === ang.id ? 'active' : ''}`}
                onClick={() => setCameraAngle(ang.id)}
              >
                {ang.label}
              </button>
            ))}
          </div>

          {/* Add to Cart Direct */}
          {onAddToCart && (
            <>
              <div className="dock-divider"></div>
              <button
                className="dock-buy-btn"
                onClick={() => onAddToCart(activeEdition)}
              >
                + Cart (GH₵ {activeEdition.price})
              </button>
            </>
          )}

          {/* Modal Close Button */}
          {onClose && (
            <button className="dock-close-btn" onClick={onClose} title="Close 3D Lab">
              ✕
            </button>
          )}
        </div>

        {/* Drag Hint */}
        <div className="shito-3d-hint">
          <span>👆 Click & drag to spin in 3D • Scroll / gestures enabled</span>
        </div>

        {/* Exploded View Layer Telemetry Pins */}
        {isExploded && (
          <div className="shito-3d-layer-pins animate-fade-in">
            <div className="layer-pin pin-lid">
              <span className="pin-badge">01</span>
              <div className="pin-text">
                <strong>Fluted Airtight Cap</strong>
                <span>Food-grade virgin polymer with foil induction seal</span>
              </div>
            </div>
            <div className="layer-pin pin-oil">
              <span className="pin-badge">02</span>
              <div className="pin-text">
                <strong>Infused Chili Oil Meniscus</strong>
                <span>Cold-pressed vegetable oil infused with bird's eye chili</span>
              </div>
            </div>
            <div className="layer-pin pin-core">
              <span className="pin-badge">03</span>
              <div className="pin-text">
                <strong>Caramelized Pepper Core</strong>
                <span>8-hour slow kettle reduction of Scotch Bonnet & pink shallots</span>
              </div>
            </div>
            <div className="layer-pin pin-bed">
              <span className="pin-badge">04</span>
              <div className="pin-text">
                <strong>Smoked Seafood Foundation</strong>
                <span>Sun-dried Volta delta prawns & wild coastal herring</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
