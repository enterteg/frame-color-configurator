import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function Plate() {
    const [rubberNormalMap, setRubberNormalMap] =
      useState<THREE.Texture | null>(null);
    const [rubberRoughnessMap, setRubberRoughnessMap] =
      useState<THREE.Texture | null>(null);

    useEffect(() => {
      // Only load textures on the client side
      if (typeof window !== "undefined") {
        console.log("Loading textures");
        const loader = new THREE.TextureLoader();
        const rubberNormalMap = loader.load("/textures/rubber-normal.png");
        const rubberRoughnessMap = loader.load(
          "/textures/rubber-roughness.png"
        );

        rubberNormalMap.wrapS = rubberRoughnessMap.wrapS = THREE.RepeatWrapping;
        rubberNormalMap.wrapT = rubberRoughnessMap.wrapT = THREE.RepeatWrapping;
        rubberNormalMap.repeat.set(10, 10);
        rubberRoughnessMap.repeat.set(10, 10);

        setRubberNormalMap(rubberNormalMap);
        setRubberRoughnessMap(rubberRoughnessMap);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeof window !== "undefined"]);


  return (
    <mesh position={[0, -0.45, 0]} receiveShadow>
      <cylinderGeometry args={[1, 1, 0.05, 120]} />
      <meshPhysicalMaterial
        color="#aaa"
        roughness={1}
        metalness={0}
        normalMap={rubberNormalMap}
        roughnessMap={rubberRoughnessMap}
        normalScale={new THREE.Vector2(3,3)}
      />
    </mesh>
  );
} 