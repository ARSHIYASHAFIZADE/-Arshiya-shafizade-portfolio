import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CanvasLoader from "../Loader";

const Model = () => {
  const { scene } = useGLTF("./Phone/scene.gltf");

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.geometry?.attributes?.position) {
        const position = child.geometry.attributes.position;
        const array = position.array;
        let hasNaN = false;
        for (let i = 0; i < array.length; i++) {
          if (isNaN(array[i])) {
            array[i] = 0; // Replace NaN values
            hasNaN = true;
          }
        }
        if (hasNaN) {
          child.geometry.computeBoundingSphere();
        }
      }
    }
  });

  // Rotate the model slightly to the right
  return <primitive object={scene} scale={2} position={[0, -1, 0]} rotation={[0, Math.PI / 6, 0]} />;
};

const SceneCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, alpha: true }}
      style={{ background: "transparent" }}
      camera={{
        fov: 50,
        near: 0.1,
        far: 500,
        position: [0, 10, 30],
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 5]} intensity={1.5} castShadow />

      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false} 
          autoRotate={false}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 3}
          minDistance={10}
          maxDistance={50}
        />
        <Model />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default SceneCanvas;
