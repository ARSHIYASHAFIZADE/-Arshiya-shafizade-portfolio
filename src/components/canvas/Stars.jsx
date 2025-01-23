import React from 'react';
import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => {
    const positions = random.inSphere(new Float32Array(5000), { radius: 1.2 });

    // Check for NaN values in the positions array
    for (let i = 0; i < positions.length; i++) {
      if (isNaN(positions[i])) {
        console.error(`Invalid position value at index ${i}:`, positions[i]);
      }
    }

    // Filter out NaN values
    const validPositions = positions.filter((value) => !isNaN(value));

    if (validPositions.length !== positions.length) {
      console.error(
        "Invalid positions detected in sphere array. Filtering out NaN values."
      );
    }

    // If no valid positions, use a fallback array
    if (validPositions.length === 0) {
      console.error("No valid positions found. Using fallback positions.");
      return new Float32Array([0, 0, 0, 1, 1, 1, -1, -1, -1]); // Example fallback
    }

    return validPositions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="w-full h-auto absolute inset-0 z-[-1]">
        <Canvas
          camera={{ position: [0, 0, 1] }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <Stars />
          </Suspense>
          <Preload all />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

export default StarsCanvas;
