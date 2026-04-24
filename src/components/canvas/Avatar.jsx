import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import CanvasLoader from "../Loader";
import AvatarChat from "./AvatarChat";
import * as THREE from "three";

// Fallback component when WebGL is not available
const WebGLFallback = ({ error }) => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg">
    <div className="text-center px-8 py-12">
      <div className="text-6xl mb-4 opacity-50">🎨</div>
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
            <li>• Disable browser extensions that might block WebGL</li>
          </ul>
        </div>
      )}
    </div>
  </div>
);

// Canvas error fallback
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
  const { scene } = useGLTF("./Avatar/avaturn.glb");
  const { mouse } = useThree();
  const modelRef = useRef();
  const headBone = useRef(null);
  const neckBone = useRef(null);
  const spineBone = useRef(null);
  const leftArmBone = useRef(null);
  const rightArmBone = useRef(null);
  const leftShoulderBone = useRef(null);
  const rightShoulderBone = useRef(null);
  const jawBone = useRef(null);
  const morphMeshes = useRef([]);
  const initialRotations = useRef(new Map());
  const blinkTimer = useRef({ next: 2 + Math.random() * 3, progress: 0 });

  // Notify parent when model loads
  useEffect(() => {
    if (scene) onModelLoaded?.();
  }, [scene, onModelLoaded]);

  // Collect bones + morph meshes once
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
        if (!jawBone.current && (n === "jaw" || n.includes("jaw"))) jawBone.current = node;
      }
      if (node.isMesh && node.morphTargetInfluences && node.morphTargetDictionary) {
        morphMeshes.current.push(node);
      }
    });
    [headBone, neckBone, spineBone, leftArmBone, rightArmBone, leftShoulderBone, rightShoulderBone, jawBone].forEach((r) => {
      if (r.current) initialRotations.current.set(r.current.uuid, r.current.rotation.clone());
    });
    // Drop arms out of T-pose into a natural resting posture (Mixamo/Avaturn rig)
    // Mixamo arms point outward along +/- X; rotating Z brings them down along the body.
    if (leftArmBone.current) {
      leftArmBone.current.rotation.z += 1.15;
      leftArmBone.current.rotation.y += 0.05;
      initialRotations.current.set(leftArmBone.current.uuid, leftArmBone.current.rotation.clone());
    }
    if (rightArmBone.current) {
      rightArmBone.current.rotation.z -= 1.15;
      rightArmBone.current.rotation.y -= 0.05;
      initialRotations.current.set(rightArmBone.current.uuid, rightArmBone.current.rotation.clone());
    }
  }, [scene]);

  if (!scene) return null;

  const scale = isMobile ? [0.95, 0.95, 0.95] : [0.85, 0.85, 0.85];
  const modelY = isMobile ? -1.35 : -1.25;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Idle breathing sway on spine
    if (spineBone.current) {
      const init = initialRotations.current.get(spineBone.current.uuid);
      if (init) {
        spineBone.current.rotation.x = init.x + Math.sin(t * 1.2) * 0.015;
        spineBone.current.rotation.z = init.z + Math.sin(t * 0.7) * 0.01;
      }
    }

    // Head follows mouse + subtle idle
    const targetYaw = mouse.x * 0.5 + Math.sin(t * 0.5) * 0.05;
    const targetPitch = -mouse.y * 0.3 + Math.sin(t * 0.8) * 0.03;
    if (neckBone.current) {
      const init = initialRotations.current.get(neckBone.current.uuid);
      if (init) {
        neckBone.current.rotation.y = THREE.MathUtils.lerp(neckBone.current.rotation.y, init.y + targetYaw * 0.4, 0.08);
        neckBone.current.rotation.x = THREE.MathUtils.lerp(neckBone.current.rotation.x, init.x + targetPitch * 0.4, 0.08);
      }
    }
    if (headBone.current) {
      const init = initialRotations.current.get(headBone.current.uuid);
      if (init) {
        // Speech-driven head bob + tilt when viseme is active (substitute for missing mouth morphs)
        const speakBob = viseme > 0.01 ? Math.sin(t * 9) * viseme * 0.04 : 0;
        const speakTilt = viseme > 0.01 ? Math.sin(t * 5.3) * viseme * 0.025 : 0;
        headBone.current.rotation.y = THREE.MathUtils.lerp(headBone.current.rotation.y, init.y + targetYaw * 0.6 + speakTilt, 0.1);
        headBone.current.rotation.x = THREE.MathUtils.lerp(headBone.current.rotation.x, init.x + targetPitch * 0.6 + speakBob, 0.1);
      }
    }
    // If a jaw bone exists (some rigs), open it on viseme
    if (jawBone.current) {
      const init = initialRotations.current.get(jawBone.current.uuid);
      if (init) {
        const target = viseme > 0.01 ? init.x + viseme * 0.35 : init.x;
        jawBone.current.rotation.x = THREE.MathUtils.lerp(jawBone.current.rotation.x, target, 0.4);
      }
    }

    // Gentle arm sway — subtle, no exaggerated gestures
    if (leftArmBone.current) {
      const init = initialRotations.current.get(leftArmBone.current.uuid);
      if (init) {
        leftArmBone.current.rotation.z = init.z + Math.sin(t * 0.8) * 0.015;
        leftArmBone.current.rotation.x = init.x + Math.sin(t * 1.2 + 0.5) * 0.01;
      }
    }
    if (rightArmBone.current) {
      const init = initialRotations.current.get(rightArmBone.current.uuid);
      if (init) {
        rightArmBone.current.rotation.z = init.z + Math.sin(t * 0.9 + 0.5) * 0.015;
        rightArmBone.current.rotation.x = init.x + Math.sin(t * 1.3 + 1.2) * 0.01;
      }
    }

    // Lip-sync driven by viseme amplitude (pulsed per word from SpeechSynthesis onboundary).
    // Small hi-freq modulation on top so it doesn't look mechanical.
    const modulation =
      Math.sin(t * 22) * 0.15 +
      Math.sin(t * 13.7 + 0.6) * 0.1;
    const mouthTarget = viseme > 0.01
      ? Math.max(0, Math.min(0.9, viseme * 0.7 + modulation * viseme))
      : 0;
    // Blink via morph if available (eyesClosed), else skip
    blinkTimer.current.next -= 1 / 60;
    let blinkValue = 0;
    if (blinkTimer.current.next <= 0) {
      blinkTimer.current.progress += 1 / 60;
      blinkValue = blinkTimer.current.progress < 0.075 ? blinkTimer.current.progress / 0.075
                 : blinkTimer.current.progress < 0.15 ? 1 - (blinkTimer.current.progress - 0.075) / 0.075
                 : 0;
      if (blinkTimer.current.progress >= 0.15) {
        blinkTimer.current.progress = 0;
        blinkTimer.current.next = 2 + Math.random() * 4;
      }
    }

    for (const mesh of morphMeshes.current) {
      const dict = mesh.morphTargetDictionary;
      const infl = mesh.morphTargetInfluences;
      if (dict.mouthOpen !== undefined) {
        const rate = mouthTarget > infl[dict.mouthOpen] ? 0.45 : 0.2;
        infl[dict.mouthOpen] = THREE.MathUtils.lerp(infl[dict.mouthOpen], mouthTarget, rate);
      }
      ["jawOpen", "mouthFunnel", "mouthPucker"].forEach((k) => {
        if (dict[k] !== undefined) {
          infl[dict[k]] = THREE.MathUtils.lerp(infl[dict[k]], mouthTarget * 0.6, 0.3);
        }
      });
      if (dict.mouthSmile !== undefined && viseme < 0.01) {
        infl[dict.mouthSmile] = THREE.MathUtils.lerp(infl[dict.mouthSmile], 0.15, 0.02);
      }
      ["eyesClosed", "eyeBlinkLeft", "eyeBlinkRight"].forEach((k) => {
        if (dict[k] !== undefined) infl[dict[k]] = blinkValue;
      });
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

  useEffect(() => {
    // Check WebGL support
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

  // Show fallback if WebGL is not supported
  if (!webglSupported) {
    return (
      <div className="w-full h-screen flex items-center justify-center z-10">
        <WebGLFallback />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={CanvasErrorFallback}>
      <Canvas
        frameloop="always"
        shadows
        dpr={[1.5, 3]}
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
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 3));
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.75;
        }}
      >
        {/* Softer three-point lighting — muted, natural skin */}
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

        <Suspense fallback={<CanvasLoader />}>
          <Environment preset="apartment" background={false} />
          <ContactShadows
            position={[0, isMobile ? -1.35 : -1.25, 0]}
            opacity={0.45}
            scale={6}
            blur={2.4}
            far={2}
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

      {/* Avatar Chat UI - overlays the canvas */}
      <AvatarChat onVisemeUpdate={setViseme} />
    </ErrorBoundary>
  );
};

export default ComputersCanvas;
