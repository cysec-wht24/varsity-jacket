import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import ConfiguratorShirtModel from './shirtModel';

function CameraRig() {
  const { camera, scene } = useThree();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;
    const t = setTimeout(() => {
      const box = new THREE.Box3().setFromObject(scene);
      if (box.isEmpty()) return;
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const dist = (maxDim / 2) / Math.tan((40 * Math.PI / 180) / 2) * 1.6;
      camera.position.set(center.x, center.y, center.z + dist);
      camera.lookAt(center);
      camera.updateProjectionMatrix();
      fitted.current = true;
    }, 300);
    return () => clearTimeout(t);
  }, [camera, scene]);

  return null;
}

export default function ConfiguratorScene({
  color,
  autoRotate,
  onInteractionChange,
  selectedZoneId,
  logoTexture,
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 40, near: 0.01, far: 1000 }}
      gl={{ antialias: true, powerPreference: 'default', stencil: false, alpha: false }}
      dpr={[1, 2]}
      style={{ background: '#0d0b09', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.55} color="#f0ece4" />
      <directionalLight position={[-2.5, 3, 2.5]}  intensity={2.4} color="#fff8f0" />
      <directionalLight position={[3, 1, -1]}       intensity={0.8} color="#c4d4ff" />
      <directionalLight position={[0, 3.5, -3]}     intensity={1.1} color="#ffe8c0" />
      <directionalLight position={[0, -2.5, 1.5]}   intensity={0.3} color="#dde8ff" />

      <Suspense fallback={null}>
        <ConfiguratorShirtModel
          color={color}
          autoRotate={autoRotate}
          selectedZoneId={selectedZoneId}
          logoTexture={logoTexture}
        />
        <Environment preset="city" />
        <ContactShadows position={[0, -1.4, 0]} opacity={0.65} scale={10} blur={2.5} far={4} color="#000" />
      </Suspense>

      <CameraRig />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        minDistance={1}
        maxDistance={2}
        minPolarAngle={Math.PI * 0.05}
        maxPolarAngle={Math.PI * 0.95}
        rotateSpeed={0.65}
        onStart={() => onInteractionChange(true)}
        onEnd={() => onInteractionChange(false)}
        makeDefault
      />
    </Canvas>
  );
}
