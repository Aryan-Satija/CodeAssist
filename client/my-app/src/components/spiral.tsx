import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Planet: React.FC = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (planetRef.current) planetRef.current.rotation.y += 0.002;
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.001;
      ringRef.current.rotation.x += 0.001;
    }
  });
  return (
    <>
      <mesh ref={planetRef} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4A90E2" roughness={1} metalness={0} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 8, 0, 0]}>
        <meshStandardMaterial color="#D2B48C" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
    </>
  );
};

const SpaceScene: React.FC = () => (
  <>
    <ambientLight intensity={0.5} />
    <directionalLight position={[5, 5, 5]} intensity={1} />
    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    <Planet />
    <OrbitControls />
  </>
);
export default SpaceScene;
