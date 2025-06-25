import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../../store/useBikeStore';

interface TireProps {
  mesh: THREE.Mesh;
}

const getTireWallColor = (tireWallColor: string) => {
  switch (tireWallColor) {
    case "black":
      return 0x1a1a1a;
    case "brown":
      return 0x754936;
    case "white":
      return 0x888888;
    case "light_brown":
      return 0x9e8d59; 
    default:
      return 0x1a1a1a;
  }
};

export function Tire({ mesh }: TireProps) {
  const tireWallColor = useBikeStore((s) => s.tireWallColor);
  const [rubberNormalMap, setRubberNormalMap] = useState<THREE.Texture | null>(null);
  const [rubberRoughnessMap, setRubberRoughnessMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // Only load textures on the client side
    if (typeof window !== 'undefined') {
      const loader = new THREE.TextureLoader();
      const rubberNormalMap = loader.load("/textures/rubber-normal.png");
      const rubberRoughnessMap = loader.load("/textures/rubber-roughness.png");
      
      rubberNormalMap.wrapS = rubberRoughnessMap.wrapS = THREE.RepeatWrapping;
      rubberNormalMap.wrapT = rubberRoughnessMap.wrapT = THREE.RepeatWrapping;
      rubberNormalMap.repeat.set(10, 10);
      rubberRoughnessMap.repeat.set(10, 10);
      
      setRubberNormalMap(rubberNormalMap);
      setRubberRoughnessMap(rubberRoughnessMap);
    }
  }, []);

  const materialName = mesh.material instanceof THREE.Material ? mesh.material.name.toLowerCase() : '';
  const isTanWall = materialName.includes("tan_wall");
  
  const material = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughnessMap: rubberRoughnessMap,
    roughness: 1,
    normalMap: rubberNormalMap,
    normalScale: new THREE.Vector2(1, 0.3),
    color: isTanWall ? getTireWallColor(tireWallColor) : 0x1a1a1a,
  });

  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      position={mesh.position}
      scale={mesh.scale}
      castShadow
    />
  );
} 