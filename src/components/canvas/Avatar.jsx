import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import CanvasLoader from "../Loader";
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

  useEffect(() => {
    if (scene) onModelLoaded?.();
  }, [scene, onModelLoaded]);

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
      }
    });

    [headBone, neckBone, spineBone, leftArmBone, rightArmBone, leftShoulderBone, rightShoulderBone, jawBone, leftForearmBone, rightForearmBone, leftHandBone, rightHandBone].forEach((r) => {
      if (r.current) initialRotations.current.set(r.current.uuid, r.current.rotation.clone());
    });

    const setArmPose = (upperArm, forearm, hand, isLeft) => {
      if (!upperArm) return;

      const direction = isLeft ? 1 : -1;

      upperArm.rotation.x = 1.57;
      upperArm.rotation.y = 0;
      upperArm.rotation.z = 0.2 * direction;

      if (forearm) {
        forearm.rotation.x = 0;
        forearm.rotation.y = 0;
        forearm.rotation.z = 0;
        initialRotations.current.set(forearm.uuid, forearm.rotation.clone());
      }

      if (hand) {
        hand.rotation.x = 0;
        hand.rotation.y = 0;
        hand.rotation.z = 0;
        initialRotations.current.set(hand.uuid, hand.rotation.clone());
      }

      initialRotations.current.set(upperArm.uuid, upperArm.rotation.clone());
    };

    setArmPose(leftArmBone.current, leftForearmBone.current, leftHandBone.current, true);
    setArmPose(rightArmBone.current, rightForearmBone.current, rightHandBone.current, false);

    if (animations && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current = mixer;

      const action = animations[0];
      const clip = mixer.clipAction(action);
      clip.setLoop(THREE.LoopOnce);
      clip.clampWhenFinished = true;
      clip.timeScale = 1.5;

      clip.play();

      const onFinished = () => {
        onModelLoaded?.();
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
  const modelY = isMobile ? -1.35 : -1.25;

  const visemeRef = useRef(viseme);
  useEffect(() => { visemeRef.current = viseme; }, [viseme]);

  useFrame(({ clock }) => {
    if (mixerRef.current && !actionPlayed) {
      mixerRef.current.update(clock.getDelta());
    }
    const t = clock.getElapsedTime();

    if (actionPlayed) {
      if (spineBone.current) {
        const init = initialRotations.current.get(spineBone.current.uuid);
        if (init) {
          spineBone.current.rotation.x = init.x + Math.sin(t * 1.2) * 0.012;
          spineBone.current.rotation.z = init.z + Math.sin(t * 0.6) * 0.008;
        }
      }

      const targetYaw = mouse.x * 0.4 + Math.sin(t * 0.4) * 0.04;
      const targetPitch = -mouse.y * 0.25 + Math.sin(t * 0.7) * 0.02;

      if (neckBone.current) {
        const init = initialRotations.current.get(neckBone.current.uuid);
        if (init) {
          neckBone.current.rotation.y = THREE.MathUtils.lerp(neckBone.current.rotation.y, init.y + targetYaw * 0.35, 0.06);
          neckBone.current.rotation.x = THREE.MathUtils.lerp(neckBone.current.rotation.x, init.x + targetPitch * 0.35, 0.06);
        }
      }

      if (headBone.current) {
        const init = initialRotations.current.get(headBone.current.uuid);
        const currentViseme = visemeRef.current;
        const speakBob = currentViseme > 0.01 ? Math.sin(t * 10) * currentViseme * 0.025 : 0;
        const speakTilt = currentViseme > 0.01 ? Math.sin(t * 6) * currentViseme * 0.02 : 0;

        headBone.current.rotation.y = THREE.MathUtils.lerp(
          headBone.current.rotation.y,
          init.y + targetYaw * 0.55 + speakTilt,
          0.08
        );
        headBone.current.rotation.x = THREE.MathUtils.lerp(
          headBone.current.rotation.x,
          init.x + targetPitch * 0.55 + speakBob,
          0.08
        );
      }

      if (jawBone.current) {
        const init = initialRotations.current.get(jawBone.current.uuid);
        const currentViseme = visemeRef.current;
        const target = currentViseme > 0.01 ? init.x + currentViseme * 0.3 : init.x;
        jawBone.current.rotation.x = THREE.MathUtils.lerp(jawBone.current.rotation.x, target, 0.35);
      }

      const gentleSway = (bone, init, offsetA, offsetB) => {
        if (!bone || !init) return;
      bone.rotation.z = init.z + Math.sin(t * offsetA) * 0.01;
      bone.rotation.x = init.x + Math.sin(t * offsetB) * 0.008;
    };

      if (leftArmBone.current) {
        gentleSway(leftArmBone.current, initialRotations.current.get(leftArmBone.current.uuid), 0.7, 1.1);
      }
      if (rightArmBone.current) {
        gentleSway(rightArmBone.current, initialRotations.current.get(rightArmBone.current.uuid), 0.8, 1.15);
      }

      blinkTimer.current.next -= 1 / 60;
      let blinkValue = 0;
      if (blinkTimer.current.next <= 0) {
        blinkTimer.current.progress += 1 / 60;
        blinkValue = blinkTimer.current.progress < 0.07 ? blinkTimer.current.progress / 0.07
                   : blinkTimer.current.progress < 0.14 ? 1 - (blinkTimer.current.progress - 0.07) / 0.07
                   : 0;
        if (blinkTimer.current.progress >= 0.14) {
          blinkTimer.current.progress = 0;
          blinkTimer.current.next = 2.5 + Math.random() * 3.5;
        }
      }

      const currentViseme = visemeRef.current;
      const baseMouth = currentViseme > 0.01 ? currentViseme * 0.65 : 0;
      const microOpen = currentViseme > 0.05 ? Math.sin(t * 18) * currentViseme * 0.12 : 0;
      const mouthTarget = Math.max(0, Math.min(0.85, baseMouth + microOpen));

    for (const mesh of morphMeshes.current) {
      const dict = mesh.morphTargetDictionary;
      const infl = mesh.morphTargetInfluences;

      if (dict.mouthOpen !== undefined) {
        const rate = mouthTarget > infl[dict.mouthOpen] ? 0.5 : 0.25;
        infl[dict.mouthOpen] = THREE.MathUtils.lerp(infl[dict.mouthOpen], mouthTarget, rate);
      }

      if (dict.jawOpen !== undefined) {
        infl[dict.jawOpen] = THREE.MathUtils.lerp(infl[dict.jawOpen], mouthTarget * 0.7, 0.3);
      }

      if (dict.mouthFunnel !== undefined) {
        infl[dict.mouthFunnel] = THREE.MathUtils.lerp(infl[dict.mouthFunnel], mouthTarget * 0.4, 0.2);
      }

      if (dict.mouthPucker !== undefined) {
        infl[dict.mouthPucker] = THREE.MathUtils.lerp(infl[dict.mouthPucker], mouthTarget * 0.35, 0.2);
      }

      if (dict.mouthSmile !== undefined) {
        const smileTarget = currentViseme < 0.05 ? 0.12 : 0;
        infl[dict.mouthSmile] = THREE.MathUtils.lerp(infl[dict.mouthSmile], smileTarget, 0.03);
      }

      if (dict.eyesClosed !== undefined) infl[dict.eyesClosed] = blinkValue;
      if (dict.eyeBlinkLeft !== undefined) infl[dict.eyeBlinkLeft] = blinkValue;
      if (dict.eyeBlinkRight !== undefined) infl[dict.eyeBlinkRight] = blinkValue;
    }
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

      <AvatarChat onVisemeUpdate={setViseme} />
    </ErrorBoundary>
  );
};

export default ComputersCanvas;
