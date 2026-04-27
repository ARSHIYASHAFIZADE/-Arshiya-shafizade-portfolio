import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Environment, ContactShadows, useProgress } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "framer-motion";
import AvatarChat from "./AvatarChat";
import * as THREE from "three";

const WebGLFallback = ({ error }) => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg">
    <div className="text-center px-8 py-12">
      <div className="text-6xl mb-4 opacity-50"></div>
      <p className="text-white/70 text-sm max-w-md leading-relaxed">
        3D graphics not supported on this device.
      </p>
      {error && (
        <div className="mt-4 p-4 bg-red-500/20 rounded-lg">
          <p className="text-red-200 text-xs font-mono mb-2">Error details:</p>
          <p className="text-white/90 text-sm break-all">{error}</p>
          <p className="text-white/70 text-xs mt-3">
            Possible fixes:
          </p>
          <ul className="text-left text-white/80 text-sm space-y-1">
            <li>• Try Chrome, Edge, or Safari on desktop</li>
            <li>• Enable hardware acceleration in browser settings</li>
            <li>• Update GPU drivers if outdated</li>
          </ul>
        </div>
      )}
    </div>
  </div>
);

const CanvasErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="w-full h-screen flex items-center justify-center z-50">
    <div className="text-center px-8 py-12 bg-red-500/20 rounded-xl max-w-md mx-4">
      <div className="text-4xl mb-2">⚠️</div>
      <p className="text-white font-medium mb-3">3D Scene Error</p>
      <p className="text-white/80 text-sm mb-4">
        {error?.message || "Something went wrong with the 3D scene."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-red-600 font-medium transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const Computers = ({ isMobile, viseme, onModelLoaded }) => {
  const { scene, animations } = useGLTF("./Avatar/model.glb");
  const { mouse } = useThree();
  const modelRef = useRef();
  const headBone = useRef(null);
  const neckBone = useRef(null);
  const spineBone = useRef(null);
  const leftArmBone = useRef(null);
  const rightArmBone = useRef(null);
  const leftShoulderBone = useRef(null);
  const rightShoulderBone = useRef(null);
  const leftForearmBone = useRef(null);
  const rightForearmBone = useRef(null);
  const leftHandBone = useRef(null);
  const rightHandBone = useRef(null);
  const jawBone = useRef(null);
  const morphMeshes = useRef([]);
  const initialRotations = useRef(new Map());
  const [actionPlayed, setActionPlayed] = useState(false);
  const mixerRef = useRef(null);
  const blinkTimer = useRef({ next: 2 + Math.random() * 3, progress: 0 });
  const transitionRef = useRef({ alpha: 0 });
  const actionPlayedRef = useRef(false);
  // Arm pose tracked independently so mixer.update() can't drag arms back toward T-pose
  const armPose = useRef({ lx: null, lz: null, rx: null, rz: null });

  useEffect(() => {
    if (!scene) return;
    morphMeshes.current = [];
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.frustumCulled = false;
        const mat = node.material;
        if (mat) {
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.anisotropy = 16;
          }
          if (mat.normalMap) mat.normalMap.anisotropy = 16;
          if (mat.roughnessMap) mat.roughnessMap.anisotropy = 16;
          mat.envMapIntensity = 0.5;
          mat.needsUpdate = true;
        }
      }
      if (node.isBone || node.type === "Bone") {
        const n = node.name.toLowerCase();
        if (!headBone.current && n === "head") headBone.current = node;
        if (!neckBone.current && n === "neck") neckBone.current = node;
        if (!spineBone.current && n === "spine") spineBone.current = node;
        if (!leftShoulderBone.current && (n === "leftshoulder" || n === "left_shoulder")) leftShoulderBone.current = node;
        if (!rightShoulderBone.current && (n === "rightshoulder" || n === "right_shoulder")) rightShoulderBone.current = node;
        if (!leftArmBone.current && (n === "leftarm" || n === "left_arm" || n === "leftupperarm")) leftArmBone.current = node;
        if (!rightArmBone.current && (n === "rightarm" || n === "right_arm" || n === "rightupperarm")) rightArmBone.current = node;
        if (!leftForearmBone.current && (n === "leftforearm" || n === "left_forearm")) leftForearmBone.current = node;
        if (!rightForearmBone.current && (n === "rightforearm" || n === "right_forearm")) rightForearmBone.current = node;
        if (!leftHandBone.current && (n === "lefthand" || n === "left_hand")) leftHandBone.current = node;
        if (!rightHandBone.current && (n === "righthand" || n === "right_hand")) rightHandBone.current = node;
        if (!jawBone.current && (n === "jaw" || n.includes("jaw"))) jawBone.current = node;
      }
      if (node.isMesh && node.morphTargetInfluences && node.morphTargetDictionary) {
        morphMeshes.current.push(node);
        console.log("Found morph targets:", node.name, node.morphTargetDictionary);
      }
    });

    // Capture bind pose BEFORE the animation runs — this is the natural idle target
    [headBone, neckBone, spineBone, leftArmBone, rightArmBone, leftShoulderBone,
     rightShoulderBone, jawBone, leftForearmBone, rightForearmBone, leftHandBone, rightHandBone
    ].forEach((r) => {
      if (r.current) initialRotations.current.set(r.current.uuid, r.current.rotation.clone());
    });

    if (animations && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current = mixer;

      const action = animations[0];
      const clip = mixer.clipAction(action);
      clip.setLoop(THREE.LoopOnce);
      clip.clampWhenFinished = true;   // hold final frame so fadeOut can blend from it
      clip.timeScale = 2.0;

      clip.play();

      const onFinished = () => {
        onModelLoaded?.();
        // Smooth 1.5s fade: mixer blends all bones (legs, hips, spine, arms) from
        // the held final frame back toward bind pose — no snapping anywhere
        clip.fadeOut(1.5);
        setActionPlayed(true);
      };

      mixer.addEventListener('finished', onFinished);
      return () => mixer.removeEventListener('finished', onFinished);
    } else {
      onModelLoaded?.();
      setActionPlayed(true);
    }
  }, [scene, animations]);

  if (!scene) return null;

  const scale = isMobile ? [0.95, 0.95, 0.95] : [0.85, 0.85, 0.85];
  const modelY = isMobile ? -0.95 : -0.85;

  const visemeRef = useRef(viseme);
  useEffect(() => { visemeRef.current = viseme; }, [viseme]);

  useFrame((state, delta) => {
    // Always update — mixer needs this to process the fadeOut after action ends
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    const t = state.clock.getElapsedTime();

    if (!actionPlayed) return;

    // Ramp up a settle factor over ~1.5s matching the fadeOut duration.
    // Starts at 0.04 (slow pull) and rises to 0.1 (firm pull) so the
    // stand-up feels organic — not a snap, not a crawl.
    if (!actionPlayedRef.current) {
      actionPlayedRef.current = true;
      transitionRef.current = { alpha: 0 };
    }
    transitionRef.current.alpha = Math.min(1, transitionRef.current.alpha + delta / 1.2);
    const settle = 0.06 + transitionRef.current.alpha * 0.14;

    // Spine breathing — gentle bob in/out with subtle sway + speech lean
    if (spineBone.current) {
      const init = initialRotations.current.get(spineBone.current.uuid);
      if (init) {
        const v = visemeRef.current;
        const speechLean = v > 0.1 ? Math.sin(t * 3) * v * 0.04 : 0;
        spineBone.current.rotation.x = THREE.MathUtils.lerp(
          spineBone.current.rotation.x, init.x + Math.sin(t * 1.1) * 0.015 + speechLean, settle);
        spineBone.current.rotation.z = THREE.MathUtils.lerp(
          spineBone.current.rotation.z, init.z + Math.cos(t * 0.5) * 0.012, settle * 0.7);
        spineBone.current.rotation.y = THREE.MathUtils.lerp(
          spineBone.current.rotation.y, init.y + Math.sin(t * 0.3) * 0.008, settle * 0.5);
      }
    }

    // Head and neck follow the mouse with slight lag and micro-sways + speech emphasis
    const yaw   = mouse.x * 0.35 + Math.sin(t * 0.35) * 0.035;
    const pitch = -mouse.y * 0.22 + Math.cos(t * 0.65) * 0.018;

    if (neckBone.current) {
      const init = initialRotations.current.get(neckBone.current.uuid);
      if (init) {
        const v = visemeRef.current;
        const speechEmphasis = v > 0.05 ? Math.sin(t * 5) * v * 0.03 : 0;
        neckBone.current.rotation.y = THREE.MathUtils.lerp(
          neckBone.current.rotation.y, init.y + yaw * 0.3, settle);
        neckBone.current.rotation.x = THREE.MathUtils.lerp(
          neckBone.current.rotation.x, init.x + pitch * 0.3 + speechEmphasis, settle);
      }
    }

    if (headBone.current) {
      const init = initialRotations.current.get(headBone.current.uuid);
      if (init) {
        const v = visemeRef.current;
        const bob  = v > 0.01 ? Math.sin(t * 10) * v * 0.025 : 0;
        const tilt = v > 0.01 ? Math.sin(t * 6)  * v * 0.02  : 0;
        const speakSway = v > 0.05 ? Math.cos(t * 4) * v * 0.02 : 0;
        headBone.current.rotation.y = THREE.MathUtils.lerp(
          headBone.current.rotation.y, init.y + yaw * 0.5 + tilt + speakSway, settle);
        headBone.current.rotation.x = THREE.MathUtils.lerp(
          headBone.current.rotation.x, init.x + pitch * 0.5 + bob,  settle);
      }
    }

    // Jaw driven by viseme
    if (jawBone.current) {
      const init = initialRotations.current.get(jawBone.current.uuid);
      if (init) {
        const v = visemeRef.current;
        const target = v > 0.01 ? init.x + v * 0.3 : init.x;
        jawBone.current.rotation.x = THREE.MathUtils.lerp(jawBone.current.rotation.x, target, 0.35);
      }
    }

    // Arms — relaxed posture with slight elbow bend
    const ARM_DOWN_X = 1.15; // Slightly less than 1.3 for more relaxed hang
    const ARM_OUT_Z = 0.08;   // Slight outward angle
    const ELBOW_BEND = 0.15;  // Subtle bend at elbows

    const leftInit  = initialRotations.current.get(leftArmBone.current?.uuid);
    const rightInit = initialRotations.current.get(rightArmBone.current?.uuid);

    if (leftArmBone.current && leftInit) {
      if (armPose.current.lx === null) {
        armPose.current.lx = leftArmBone.current.rotation.x;
        armPose.current.lz = leftArmBone.current.rotation.z;
      }
      armPose.current.lx = THREE.MathUtils.lerp(
        armPose.current.lx, leftInit.x + ARM_DOWN_X + Math.sin(t * 1.05) * 0.01, settle);
      armPose.current.lz = THREE.MathUtils.lerp(
        armPose.current.lz, leftInit.z - ARM_OUT_Z + Math.cos(t * 0.6) * 0.012, settle);
      leftArmBone.current.rotation.x = armPose.current.lx;
      leftArmBone.current.rotation.z = armPose.current.lz;
    }

    if (rightArmBone.current && rightInit) {
      if (armPose.current.rx === null) {
        armPose.current.rx = rightArmBone.current.rotation.x;
        armPose.current.rz = rightArmBone.current.rotation.z;
      }
      armPose.current.rx = THREE.MathUtils.lerp(
        armPose.current.rx, rightInit.x + ARM_DOWN_X + Math.sin(t * 1.12) * 0.01, settle);
      armPose.current.rz = THREE.MathUtils.lerp(
        armPose.current.rz, rightInit.z + ARM_OUT_Z + Math.sin(t * 0.75) * 0.012, settle);
      rightArmBone.current.rotation.x = armPose.current.rx;
      rightArmBone.current.rotation.z = armPose.current.rz;
    }

    // Apply elbow bend for more natural pose
    if (leftForearmBone.current) {
      const init = initialRotations.current.get(leftForearmBone.current.uuid);
      if (init) {
        leftForearmBone.current.rotation.z = THREE.MathUtils.lerp(
          leftForearmBone.current.rotation.z, init.z - ELBOW_BEND, settle);
      }
    }
    if (rightForearmBone.current) {
      const init = initialRotations.current.get(rightForearmBone.current.uuid);
      if (init) {
        rightForearmBone.current.rotation.z = THREE.MathUtils.lerp(
          rightForearmBone.current.rotation.z, init.z + ELBOW_BEND, settle);
      }
    }

    // Blink
    blinkTimer.current.next -= delta;
    let blinkValue = 0;
    if (blinkTimer.current.next <= 0) {
      blinkTimer.current.progress += delta;
      blinkValue = blinkTimer.current.progress < 0.07
        ? blinkTimer.current.progress / 0.07
        : blinkTimer.current.progress < 0.14
        ? 1 - (blinkTimer.current.progress - 0.07) / 0.07
        : 0;
      if (blinkTimer.current.progress >= 0.14) {
        blinkTimer.current.progress = 0;
        blinkTimer.current.next = 2.5 + Math.random() * 3.5;
      }
    }

    // Mouth morphs driven by viseme — amplified for visibility
    const v = visemeRef.current;
    const baseMouth  = v > 0.01 ? v * 0.95 : 0; // Increased from 0.65
    const microOpen  = v > 0.05 ? Math.sin(t * 20) * v * 0.15 : 0;
    const mouthTarget = Math.max(0, Math.min(1.0, baseMouth + microOpen));

    for (const mesh of morphMeshes.current) {
      const dict = mesh.morphTargetDictionary;
      const infl = mesh.morphTargetInfluences;

      const setMorph = (names, val, lerpIn = 0.6, lerpOut = 0.3) => {
        for (const name of names) {
          if (dict[name] !== undefined) {
            infl[dict[name]] = THREE.MathUtils.lerp(
              infl[dict[name]], val, val > infl[dict[name]] ? lerpIn : lerpOut);
          }
        }
      };

      // Primary mouth open / jaw motion
      setMorph(["mouthOpen", "viseme_aa", "viseme_AA", "MouthOpen", "JawOpen"], mouthTarget);
      
      // Secondary shapes for more natural speech
      setMorph(["jawOpen", "viseme_O", "viseme_o", "JawOpen"], mouthTarget * 0.85, 0.4);
      setMorph(["mouthFunnel", "viseme_U", "viseme_u"], mouthTarget * 0.5, 0.3);
      setMorph(["mouthPucker", "viseme_oo", "viseme_OO"], mouthTarget * 0.45, 0.3);
      setMorph(["mouthSmile", "MouthSmile"], v < 0.05 ? 0.15 : 0.1, 0.05);

      // Blink and eyes
      if (dict.eyesClosed    !== undefined) infl[dict.eyesClosed]    = blinkValue;
      if (dict.eyeBlinkLeft  !== undefined) infl[dict.eyeBlinkLeft]  = blinkValue;
      if (dict.eyeBlinkRight !== undefined) infl[dict.eyeBlinkRight] = blinkValue;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[0, modelY, 0]}
      rotation={[-0.01, 0, 0]}
      scale={scale}
    />
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [viseme, setViseme] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const { progress } = useProgress();
  
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "100px" });

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const supported = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("webgl2"))
    );
    setWebglSupported(supported);

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-screen flex items-center justify-center z-10">
        <WebGLFallback />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={CanvasErrorFallback}>
      <div ref={containerRef} className="w-full h-screen relative">
        <Canvas
          frameloop={isInView ? "always" : "demand"}
          shadows
          dpr={[1, 2]} // Performance: Cap at 2 instead of 3
          camera={{
            position: isMobile ? [0, 0.1, 4.8] : [0, 0.1, 4.2],
            fov: isMobile ? 42 : 36
          }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
          className="z-10 w-full h-screen"
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.75;
          }}
        >
          <ambientLight intensity={0.25} />
          <directionalLight
            castShadow
            position={[3, 5, 4]}
            intensity={1.0}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#b0c4ff" />
          <directionalLight position={[0, 2, -5]} intensity={0.2} color="#ffd1a6" />

          <Suspense fallback={null}>
            <Environment preset="apartment" background={false} />
            <ContactShadows
              position={[0, isMobile ? -0.95 : -0.85, 0]}
              opacity={0.45}
              scale={6}
              blur={2.4}
              far={4}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              target={[0, 0.1, 0]}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
              rotateSpeed={0.5}
            />
            <Computers isMobile={isMobile} viseme={viseme} onModelLoaded={() => setModelLoaded(true)} />
          </Suspense>
          <Preload all />
        </Canvas>

        {(!modelLoaded && progress < 100) && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-1.5 pointer-events-none">
            <div className="relative w-11 h-11">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="3"
                />
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke="rgba(146,248,243,0.75)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
                  style={{ transition: "stroke-dashoffset 0.35s ease" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white/55 text-[10px] font-medium tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}
        {modelLoaded && <AvatarChat onVisemeUpdate={setViseme} />}
      </div>
    </ErrorBoundary>
  );
};

export default ComputersCanvas;
