import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceWarp: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);
  const starCount = 5000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = Math.random() * -50;

      colors[i3] = colors[i3 + 1] = colors[i3 + 2] = 1;
    }

    return [positions, colors];
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      const positionAttribute = starsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const positionArray = positionAttribute.array as Float32Array;

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        positionArray[i3 + 2] += 0.5;

        if (positionArray[i3 + 2] > 0) {
          positionArray[i3 + 2] = -50;
        }
      }

      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <>
      <color attach="background" args={['black']} />
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors />
      </points>
    </>
  );
};

export default SpaceWarp;
