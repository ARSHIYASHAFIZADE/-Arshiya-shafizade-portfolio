import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Preload } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "framer-motion";
import Loader from "../Loader";

const AstronautModel = () => {
  const { scene } = useGLTF("/astronaut.glb");
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.004;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.18;
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={2.2}
      position={[0, -0.3, 0]}
    />
  );
};

const AstronautCanvas = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "100px" });

  return (
    <ErrorBoundary fallback={<div />}>
      <div ref={containerRef} className="w-full h-full relative">
        <Canvas
          frameloop={isInView ? "always" : "demand"}
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 6, 4]}  intensity={1.4} color="#c4b5fd" />
            <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#38bdf8" />
            <pointLight position={[0, 4, 2]} intensity={1.0} color="#a78bfa" distance={10} />
            <AstronautModel />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Suspense>
          <Preload all />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

useGLTF.preload("/astronaut.glb");

export default AstronautCanvas;
