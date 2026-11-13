import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Layers,
  RotateCw,
  Sun,
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  Play,
  X,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

type ModelType = 'court' | 'shuttle' | 'racket';
type LightPreset = 'tournament' | 'cinematic' | 'night';

export const Anatomy3DExperience: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  const [activeModel, setActiveModel] = useState<ModelType>('court');
  const [explosionAmount, setExplosionAmount] = useState<number>(0.45); // 0 to 1
  const [lightPreset, setLightPreset] = useState<LightPreset>('tournament');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // References to communicate with the Three.js loop without re-triggering full canvas mounts
  const paramsRef = useRef({
    explosionAmount: 0.45,
    activeModel: 'court' as ModelType,
    lightPreset: 'tournament' as LightPreset,
    autoRotate: true,
    zoomDelta: 0,
  });

  const adjustCameraZoom = (factor: number) => {
    paramsRef.current.zoomDelta += factor;
  };

  useEffect(() => {
    paramsRef.current.explosionAmount = explosionAmount;
    paramsRef.current.activeModel = activeModel;
    paramsRef.current.lightPreset = lightPreset;
    paramsRef.current.autoRotate = autoRotate;
  }, [explosionAmount, activeModel, lightPreset, autoRotate]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080a0c);
    scene.fog = new THREE.FogExp2(0x080a0c, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5, 8.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 4. Orbit Controls (disable wheel zoom & pan so page scroll never gets stuck)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 4;
    controls.maxDistance = 16;
    controls.target.set(0, 0, 0);
    renderer.domElement.style.touchAction = 'pan-y';

    // 5. Lighting rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xc7f464, 2.4);
    keyLight.position.set(5, 10, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4080ff, 1.2);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
    rimLight.position.set(0, -4, -6);
    scene.add(rimLight);

    // Ground reflective contact plane
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07090b,
      roughness: 0.85,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Grid helper on floor
    const gridHelper = new THREE.GridHelper(24, 24, 0x191f24, 0x111519);
    gridHelper.position.y = -2.19;
    scene.add(gridHelper);

    // -------------------------------------------------------------
    // PROCEDURAL MODELS SETUP
    // -------------------------------------------------------------
    const modelsRoot = new THREE.Group();
    scene.add(modelsRoot);

    // Texture generator for court lines
    const createCourtTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Olympic green mat field
      ctx.fillStyle = '#0b5233';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fine embossed texture
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      for (let i = 0; i < 1024; i += 8) {
        ctx.fillRect(i, 0, 4, 512);
      }

      // Outer boundary white lines (40mm regulation width)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 10;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // Singles side lines (inner)
      ctx.strokeRect(40, 80, canvas.width - 80, canvas.height - 160);

      // Centre net line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 40);
      ctx.lineTo(canvas.width / 2, canvas.height - 40);
      ctx.stroke();

      // Short service lines (1.98m from net)
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 140, 40);
      ctx.lineTo(canvas.width / 2 - 140, canvas.height - 40);
      ctx.moveTo(canvas.width / 2 + 140, 40);
      ctx.lineTo(canvas.width / 2 + 140, canvas.height - 40);
      ctx.stroke();

      // Long service lines for doubles
      ctx.beginPath();
      ctx.moveTo(85, 40);
      ctx.lineTo(85, canvas.height - 40);
      ctx.moveTo(canvas.width - 85, 40);
      ctx.lineTo(canvas.width - 85, canvas.height - 40);
      ctx.stroke();

      // Center longitudinal line
      ctx.beginPath();
      ctx.moveTo(40, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - 140, canvas.height / 2);
      ctx.moveTo(canvas.width / 2 + 140, canvas.height / 2);
      ctx.lineTo(canvas.width - 40, canvas.height / 2);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const courtTexture = createCourtTexture();

    // 1. COURT ANATOMY GROUP (6 Exploded Slabs)
    const courtGroup = new THREE.Group();
    const courtLayers: THREE.Mesh[] = [];

    const layerDefs = [
      { name: 'Layer 6: Concrete Base Subfloor', color: 0x222830, roughness: 0.9, metalness: 0.1, thickness: 0.35, yBase: -0.6 },
      { name: 'Layer 5: Moisture Barrier Film', color: 0x11161d, roughness: 0.4, metalness: 0.5, thickness: 0.08, yBase: -0.3 },
      { name: 'Layer 4: Microcellular High-Rebound Foam', color: 0x1c382b, roughness: 0.7, metalness: 0.1, thickness: 0.15, yBase: -0.05 },
      { name: 'Layer 3: 100% Virgin Polymer Shock Layer', color: 0x0e5a38, roughness: 0.6, metalness: 0.1, thickness: 0.18, yBase: 0.2 },
      { name: 'Layer 2: Woven Polyester Stability Mesh', color: 0xc7f464, roughness: 0.3, metalness: 0.3, thickness: 0.06, yBase: 0.45, wireframe: true },
      { name: 'Layer 1: BWF Embossed Olympic Mat', color: 0xffffff, roughness: 0.4, metalness: 0.05, thickness: 0.1, yBase: 0.7, texture: courtTexture },
    ];

    layerDefs.forEach((def, idx) => {
      const geo = new THREE.BoxGeometry(6.2, def.thickness, 3.4);
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: def.roughness,
        metalness: def.metalness,
        wireframe: def.wireframe || false,
        map: def.texture || null,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      mesh.userData = { id: idx, name: def.name, baseOffset: (idx - 2.5) * 0.4 };
      courtLayers.push(mesh);
      courtGroup.add(mesh);
    });

    // Add 3D Net and Posts to Court Layer 1
    const netGroup = new THREE.Group();
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 16);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xc7f464, metalness: 0.8, roughness: 0.2 });
    const postLeft = new THREE.Mesh(postGeo, postMat);
    postLeft.position.set(0, 0.55, -1.75);
    const postRight = new THREE.Mesh(postGeo, postMat);
    postRight.position.set(0, 0.55, 1.75);
    netGroup.add(postLeft, postRight);

    const netMeshGeo = new THREE.PlaneGeometry(3.5, 0.7, 30, 8);
    const netMeshMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const netMesh = new THREE.Mesh(netMeshGeo, netMeshMat);
    netMesh.rotation.y = Math.PI / 2;
    netMesh.position.set(0, 0.65, 0);
    netGroup.add(netMesh);

    courtLayers[5].add(netGroup);
    modelsRoot.add(courtGroup);

    // 2. SHUTTLECOCK ANATOMY GROUP (Exploded Feathers + Cork Dome + Ribbons)
    const shuttleGroup = new THREE.Group();
    const shuttleParts: THREE.Object3D[] = [];

    // Cork Base
    const corkGeo = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const corkMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.3, metalness: 0.1 });
    const cork = new THREE.Mesh(corkGeo, corkMat);
    cork.rotation.x = Math.PI;
    cork.position.y = -1.2;
    shuttleParts.push(cork);
    shuttleGroup.add(cork);

    // Feather ring & individual 16 feathers
    const featherRingGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const featherGeo = new THREE.CylinderGeometry(0.03, 0.16, 2.2, 8);
      const featherMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.05,
      });
      const feather = new THREE.Mesh(featherGeo, featherMat);
      feather.position.set(Math.cos(angle) * 0.75, 0.5, Math.sin(angle) * 0.75);
      feather.rotation.z = Math.sin(angle) * 0.22;
      feather.rotation.x = -Math.cos(angle) * 0.22;
      featherRingGroup.add(feather);
    }
    shuttleParts.push(featherRingGroup);
    shuttleGroup.add(featherRingGroup);

    // Binding Thread Rings
    const ringGeo1 = new THREE.TorusGeometry(0.9, 0.02, 8, 32);
    const ringGeo2 = new THREE.TorusGeometry(1.2, 0.025, 8, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xc7f464, roughness: 0.3 });
    const thread1 = new THREE.Mesh(ringGeo1, ringMat);
    thread1.rotation.x = Math.PI / 2;
    thread1.position.y = 0.2;
    const thread2 = new THREE.Mesh(ringGeo2, ringMat);
    thread2.rotation.x = Math.PI / 2;
    thread2.position.y = 1.1;
    shuttleParts.push(thread1, thread2);
    shuttleGroup.add(thread1, thread2);

    shuttleGroup.position.set(0, 0, 0);
    modelsRoot.add(shuttleGroup);

    // 3. CARBON RACKET ANATOMY GROUP (Exploded Head, String Bed, Shaft, Grip)
    const racketGroup = new THREE.Group();
    const racketParts: THREE.Object3D[] = [];

    // Isometric Frame
    const frameCurve = new THREE.EllipseCurve(0, 2.2, 1.25, 1.65, 0, 2 * Math.PI, false, 0);
    const framePoints = frameCurve.getPoints(50);
    const frameShape = new THREE.BufferGeometry().setFromPoints(framePoints);
    const frameMat = new THREE.LineBasicMaterial({ color: 0xc7f464, linewidth: 3 });
    const racketFrameLine = new THREE.Line(frameShape, frameMat);
    racketParts.push(racketFrameLine);
    racketGroup.add(racketFrameLine);

    // String Bed Grid
    const stringGroup = new THREE.Group();
    for (let x = -1.0; x <= 1.0; x += 0.12) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 1.0, 0),
        new THREE.Vector3(x, 3.4, 0),
      ]);
      const stringLine = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 }));
      stringGroup.add(stringLine);
    }
    for (let y = 1.0; y <= 3.4; y += 0.14) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.9, y, 0),
        new THREE.Vector3(0.9, y, 0),
      ]);
      const stringLine = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 }));
      stringGroup.add(stringLine);
    }
    racketParts.push(stringGroup);
    racketGroup.add(stringGroup);

    // Carbon Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.2, metalness: 0.9 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = -0.4;
    racketParts.push(shaft);
    racketGroup.add(shaft);

    // Grip Handle
    const gripGeo = new THREE.CylinderGeometry(0.09, 0.1, 1.4, 8);
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x192128, roughness: 0.9, metalness: 0.1 });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.y = -2.0;
    racketParts.push(grip);
    racketGroup.add(grip);

    modelsRoot.add(racketGroup);

    // Initial model visibility
    courtGroup.visible = true;
    shuttleGroup.visible = false;
    racketGroup.visible = false;

    // -------------------------------------------------------------
    // ANIMATION & RENDER LOOP (with IntersectionObserver pause)
    // -------------------------------------------------------------
    let animationFrameId = 0;
    let isInView = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isInView) {
        animationFrameId = 0;
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const currentParams = paramsRef.current;

      // Apply button-driven zoom smoothly without trapping wheel scroll
      if (currentParams.zoomDelta !== 0) {
        const direction = new THREE.Vector3().subVectors(camera.position, controls.target);
        const currentDist = direction.length();
        const nextDist = THREE.MathUtils.clamp(currentDist + currentParams.zoomDelta, 4.5, 15);
        direction.setLength(nextDist);
        camera.position.copy(controls.target).add(direction);
        currentParams.zoomDelta = 0;
      }

      // Switch active model visibility
      courtGroup.visible = currentParams.activeModel === 'court';
      shuttleGroup.visible = currentParams.activeModel === 'shuttle';
      racketGroup.visible = currentParams.activeModel === 'racket';

      // Lighting updates
      if (currentParams.lightPreset === 'tournament') {
        keyLight.intensity = 2.6;
        keyLight.color.setHex(0xc7f464);
        fillLight.intensity = 1.2;
      } else if (currentParams.lightPreset === 'cinematic') {
        keyLight.intensity = 3.4;
        keyLight.color.setHex(0xffffff);
        fillLight.intensity = 0.5;
      } else {
        keyLight.intensity = 1.4;
        keyLight.color.setHex(0x50e3c2);
        fillLight.intensity = 0.4;
      }

      // Smooth exploded-view displacement
      const targetSep = currentParams.explosionAmount;

      if (currentParams.activeModel === 'court') {
        courtLayers.forEach((mesh, idx) => {
          const targetY = (idx - 2.5) * (targetSep * 1.8);
          mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 4, delta);
          // subtle floating sway
          mesh.position.x = Math.sin(time * 0.8 + idx * 0.5) * 0.02 * targetSep;
        });
      } else if (currentParams.activeModel === 'shuttle') {
        // Explode cork downward, feathers upward
        cork.position.y = THREE.MathUtils.damp(cork.position.y, -1.0 - targetSep * 1.6, 4, delta);
        featherRingGroup.position.y = THREE.MathUtils.damp(featherRingGroup.position.y, targetSep * 1.2, 4, delta);
        thread1.position.y = THREE.MathUtils.damp(thread1.position.y, 0.2 + targetSep * 0.6, 4, delta);
        thread2.position.y = THREE.MathUtils.damp(thread2.position.y, 1.1 + targetSep * 1.0, 4, delta);
      } else if (currentParams.activeModel === 'racket') {
        // Explode frame, string bed, and grip
        racketFrameLine.position.z = THREE.MathUtils.damp(racketFrameLine.position.z, targetSep * 1.2, 4, delta);
        stringGroup.position.z = THREE.MathUtils.damp(stringGroup.position.z, -targetSep * 1.0, 4, delta);
        grip.position.y = THREE.MathUtils.damp(grip.position.y, -2.0 - targetSep * 1.2, 4, delta);
        shaft.position.y = THREE.MathUtils.damp(shaft.position.y, -0.4 - targetSep * 0.5, 4, delta);
      }

      // Auto rotation
      if (currentParams.autoRotate) {
        modelsRoot.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasInView = isInView;
        isInView = entry.isIntersecting;
        if (isInView && !wasInView && animationFrameId === 0) {
          clock.getDelta();
          animate();
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const layerDescriptions = [
    {
      title: 'Layer 1: BWF Embossed 5.0mm Surface Mat',
      spec: '100% Virgin Calendered PVC · High Friction Hexagonal Texture',
      details: 'Meets BWF Standard 1. Textured surface guarantees instant foot braking with zero slip squeal even under intense sweat condensation.',
    },
    {
      title: 'Layer 2: Woven High-Tension Polyester Grid',
      spec: 'Multi-Directional Stabilization Scrim · Zero Thermal Shrinkage',
      details: 'Prevents court expansion or bubbling under heavy arena thermal load and high-impact lateral slides.',
    },
    {
      title: 'Layer 3: 100% Virgin Polymer Shock Absorber',
      spec: '62% Vertical Force Reduction · Anti-Abrasion Compounding',
      details: 'Cushions jump smash landings, drastically reducing repetitive stress on patellar tendons and ankle ligaments.',
    },
    {
      title: 'Layer 4: Microcellular High-Rebound Foam Core',
      spec: '98% Kinetic Energy Return · Dual-Density Closed Cell Matrix',
      details: 'Propels explosive lunges and rapid net recovery without sap-draining energy loss.',
    },
    {
      title: 'Layer 5: Moisture Barrier & Vapor Film',
      spec: 'High-Density Polyethylene Membrane · 100% Waterproof',
      details: 'Protects the athletic playing mat from concrete efflorescence and seasonal subfloor moisture.',
    },
    {
      title: 'Layer 6: Precision-Leveled Concrete Subfloor',
      spec: 'C25/30 Reinforced Screed · ±1mm Flatness Tolerance',
      details: 'Laser-screeded foundation providing unwavering structural integrity across the entire 13.4m x 6.1m court perimeter.',
    },
  ];

  return (
    <div className="relative w-full h-[540px] sm:h-[640px] bg-[#080A0C] border border-[#242C33] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge & Model Tabs */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C7F464]" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C7F464] font-bold">
              3D Cinematic Anatomy Experience
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#F4F5F3] font-display">
            {activeModel === 'court'
              ? 'THE ANATOMY OF A COURT'
              : activeModel === 'shuttle'
              ? 'THE ANATOMY OF A SHUTTLECOCK'
              : 'THE ANATOMY OF A CARBON RACKET'}
          </h3>
          <p className="text-xs text-[#9BA3A8] max-w-md">
            Drag to rotate 360° · Scrub the exploded-view slider to inspect internal layers.
          </p>
        </div>

        {/* Model Switcher Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#111519]/95 border border-[#242C33] p-1 rounded-2xl self-start sm:self-auto shadow-xl">
          <button
            onClick={() => setActiveModel('court')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeModel === 'court'
                ? 'bg-[#C7F464] text-[#080A0C] shadow-md'
                : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
            }`}
          >
            Championship Court
          </button>
          <button
            onClick={() => setActiveModel('shuttle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeModel === 'shuttle'
                ? 'bg-[#C7F464] text-[#080A0C] shadow-md'
                : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
            }`}
          >
            Aerosensa Shuttle
          </button>
          <button
            onClick={() => setActiveModel('racket')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeModel === 'racket'
                ? 'bg-[#C7F464] text-[#080A0C] shadow-md'
                : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
            }`}
          >
            Carbon Racket
          </button>

          {/* Inspiration video trigger button */}
          <button
            onClick={() => setShowVideoModal(true)}
            className="p-1.5 bg-[#191F24] text-[#C7F464] hover:bg-[#20272D] rounded-xl transition-colors ml-1"
            title="Watch 3D Showcase Inspiration Video"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Layer detail card when court model is active */}
      {activeModel === 'court' && (
        <div className="relative z-10 px-6 pointer-events-none hidden lg:block">
          <div className="max-w-md bg-[#111519]/95 border border-[#242C33] rounded-2xl p-4 shadow-xl pointer-events-auto space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#C7F464]">
                {layerDescriptions[selectedLayerIndex ?? 0].title}
              </span>
              <span className="text-[10px] text-[#9BA3A8] font-mono">BWF Standard</span>
            </div>
            <p className="text-[11px] font-mono text-[#F4F5F3]">
              {layerDescriptions[selectedLayerIndex ?? 0].spec}
            </p>
            <p className="text-xs text-[#9BA3A8] leading-relaxed">
              {layerDescriptions[selectedLayerIndex ?? 0].details}
            </p>
          </div>
        </div>
      )}

      {/* Unified Bottom Control Dock (Compliant with Three.js skill) */}
      <div className="relative z-20 p-4 sm:p-6 w-full flex flex-col items-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-3xl bg-[#111519]/95 border border-[#242C33] rounded-2xl p-4 shadow-2xl space-y-3 transition-all">
          {/* Header toggle for dock */}
          <div className="flex items-center justify-between border-b border-[#1E252C] pb-2 text-xs">
            <div className="flex items-center gap-2 text-[#9BA3A8]">
              <Sliders className="w-3.5 h-3.5 text-[#C7F464]" />
              <span className="font-semibold text-[#F4F5F3]">3D Kinematic Controls</span>
            </div>
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="text-[#9BA3A8] hover:text-[#F4F5F3] flex items-center gap-1 text-[11px]"
            >
              {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isDockCollapsed ? 'Expand Dock' : 'Collapse'}</span>
            </button>
          </div>

          {!isDockCollapsed && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center text-xs">
              {/* Exploded View Slider */}
              <div className="sm:col-span-6 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#9BA3A8] font-medium">Exploded View Separation</span>
                  <span className="text-[#C7F464] font-mono font-bold">
                    {Math.round(explosionAmount * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explosionAmount}
                  onChange={(e) => setExplosionAmount(parseFloat(e.target.value))}
                  className="w-full accent-[#C7F464] cursor-pointer"
                />
              </div>

              {/* Lighting Presets */}
              <div className="sm:col-span-4 space-y-1.5">
                <span className="text-[11px] text-[#9BA3A8] block">Arena Lighting Mode</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setLightPreset('tournament')}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      lightPreset === 'tournament'
                        ? 'bg-[#191F24] text-[#C7F464] border border-[#C7F464]/40'
                        : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                    }`}
                  >
                    1,200 Lux
                  </button>
                  <button
                    onClick={() => setLightPreset('cinematic')}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      lightPreset === 'cinematic'
                        ? 'bg-[#191F24] text-[#C7F464] border border-[#C7F464]/40'
                        : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                    }`}
                  >
                    Rim Light
                  </button>
                  <button
                    onClick={() => setLightPreset('night')}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      lightPreset === 'night'
                        ? 'bg-[#191F24] text-[#C7F464] border border-[#C7F464]/40'
                        : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                    }`}
                  >
                    Night
                  </button>
                </div>
              </div>

              {/* Auto-Rotation & Zoom Controls */}
              <div className="sm:col-span-2 flex sm:justify-end items-center gap-1.5 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => adjustCameraZoom(-1.5)}
                  className="p-1.5 rounded-xl border bg-[#151A20] text-[#9BA3A8] hover:text-[#F4F5F3] border-[#242C33] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustCameraZoom(1.5)}
                  className="p-1.5 rounded-xl border bg-[#151A20] text-[#9BA3A8] hover:text-[#F4F5F3] border-[#242C33] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    autoRotate
                      ? 'bg-[#C7F464]/10 text-[#C7F464] border-[#C7F464]/30'
                      : 'bg-[#151A20] text-[#9BA3A8] border-[#242C33]'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span>Spin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal to watch the inspiration reference video */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111519] border border-[#242C33] rounded-3xl max-w-2xl w-full p-6 text-left shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-[#242C33] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C7F464]" />
                <h3 className="text-base font-bold text-[#F4F5F3]">
                  3D Animation & Exploded View Reference
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-[#9BA3A8] hover:text-[#F4F5F3] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black border border-[#242C33] aspect-video flex items-center justify-center">
              <video
                controls
                autoPlay
                className="w-full h-full object-contain"
                src="/assets/aistudio/I_Built_a__10_000_3D_Website_with_FREE_AI_Tools_in_5_Minutes_____coding__vibecoding__3danimation_360p__73cff7af.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <p className="text-xs text-[#9BA3A8] leading-relaxed">
              Demonstrating the exact MotionSites luxury 3D exploded structure adapted for badminton court layers, precision equipment, and cinematic lighting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
