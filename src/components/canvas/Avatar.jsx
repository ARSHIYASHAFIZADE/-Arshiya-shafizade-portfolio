import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
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
  const { scene } = useGLTF("./Avatar/6756e17a1aa3af1c627b3bec.glb");
  const modelRef = useRef();
  const headRef = useRef();

  // Notify parent when model loads
  useEffect(() => {
    if (scene) {
      onModelLoaded?.();
    }
  }, [scene, onModelLoaded]);

  // Check for model loading errors
  if (!scene) {
    console.warn("Avatar model failed to load, using fallback.");
    return null;
  }

  scene.traverse((node) => {
    if (node.isMesh && node.material && node.material.map) {
      // Three.js r152+: colorSpace instead of encoding
      node.material.map.colorSpace = THREE.SRGBColorSpace;
    }
  });

  // Scale: bigger on desktop, smaller on mobile
  const scale = isMobile ? [1.5, 1.5, 1.5] : [1.3, 1.3, 1.3];
  const modelY = isMobile ? -1.6 : -1.5;

  // Set initial rotation to look left when loaded
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = 1;
    }
  }, []);

  // Add lip-sync animation (no rotation - model stays still)
  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.scale.set(...scale);

      // Simple lip-sync animation (jaw movement)
      if (viseme > 0 && headRef.current) {
        const jawOpen = Math.sin(clock.getElapsedTime() * 15) * 0.05 + 0.08;
        headRef.current.position.y = THREE.MathUtils.lerp(
          headRef.current.position.y || 0,
          jawOpen * 0.5,
          0.2
        );
      } else if (headRef.current) {
        headRef.current.position.y = THREE.MathUtils.lerp(
          headRef.current.position.y || 0,
          0,
          0.1
        );
      }
    }
  });

  return (
    <mesh ref={modelRef}>
      <primitive
        object={scene}
        position={[0, modelY, 0]}
        rotation={[-0.01, 0, 0]}
        material={{ color: "#FFFFFF" }}
        scale={scale}
        ref={headRef}
      />
      <meshStandardMaterial attach="shadow" color="#000000" />
    </mesh>
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
        dpr={[1, 2]}
        camera={{
          position: isMobile ? [0, 0.2, 3.5] : [0, 0.2, 3.2],
          fov: isMobile ? 35 : 30
        }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        className="z-10 w-full h-screen"
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        {/* Boosted lighting so the model isn't too dark */}
        <ambientLight intensity={2.5} />
        <pointLight position={[10, 10, 10]} intensity={600} />
        <pointLight position={[-10, 5, -5]} intensity={300} color="#b0c4ff" />
        <directionalLight position={[0, 10, 5]} intensity={1.5} />

        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            target={[0, 0.2, 0]}
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
