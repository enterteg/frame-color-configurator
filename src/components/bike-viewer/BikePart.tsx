import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../../store/useBikeStore';

interface BikePartProps {
  mesh: THREE.Mesh;
}

const getTireWallColor = (tireWallColor: string) => {
  switch (tireWallColor) {
    case "black":
      return 0x0a0a0a;
    case "brown":
      return 0x522906;
    case "white":
      return 0x777777;
    case "light_brown":
      return 0x9c621c; // or 0xc49e60 for a muted light brown
    default:
      return 0x0a0a0a;
  }
};

export function BikePart({ mesh }: BikePartProps) {
  const frameColor = useBikeStore((s) => s.frameColor);
  const forkColor = useBikeStore((s) => s.forkColor);
  const tireWallColor = useBikeStore((s) => s.tireWallColor);
  const headTubeTexture = useBikeStore((s) => s.logoTypes.HEAD_TUBE.texture);
  const downTubeLeftTexture = useBikeStore((s) => s.logoTypes.DOWN_TUBE_LEFT.texture);
  const downTubeRightTexture = useBikeStore((s) => s.logoTypes.DOWN_TUBE_RIGHT.texture);

  const [rubberNormalMap, setRubberNormalMap] = useState<THREE.Texture | null>(null);
  const [carbonNormalMap, setCarbonNormalMap] = useState<THREE.Texture | null>(null);
  const [rubberRoughnessMap, setRubberRoughnessMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // Only load textures on the client side
    if (typeof window !== 'undefined') {
      const loader = new THREE.TextureLoader();
      const rubberNormalMap = loader.load("/textures/rubber-normal.png");
      const rubberRoughnessMap = loader.load("/textures/rubber-roughness.png");
      const carbonNormalMap = loader.load("/textures/carbon-normal.png");
      rubberNormalMap.wrapS = rubberRoughnessMap.wrapS = carbonNormalMap.wrapS = THREE.RepeatWrapping;
      rubberNormalMap.wrapT = rubberRoughnessMap.wrapT = carbonNormalMap.wrapT = THREE.RepeatWrapping;
      rubberNormalMap.repeat.set(10, 10);
      rubberRoughnessMap.repeat.set(10, 10);
      carbonNormalMap.repeat.set(2, 2);
      
      setRubberNormalMap(rubberNormalMap);
      setRubberRoughnessMap(rubberRoughnessMap);
      setCarbonNormalMap(carbonNormalMap);
    }
  }, []);

  const objectName = mesh.name.toLowerCase();
  const materialName = mesh.material instanceof THREE.Material ? mesh.material.name.toLowerCase() : '';

  let material: THREE.Material;

  if (materialName.includes("tire") || materialName === "tan_wall") {
  const isTanWall = materialName === "tan_wall";
    material = new THREE.MeshPhysicalMaterial({
      metalness: 0.0,
      roughness: 1.3,
      envMapIntensity: 0,
      normalMap: rubberNormalMap,
      roughnessMap: rubberRoughnessMap,
      color: isTanWall ? getTireWallColor(tireWallColor) : 0x0a0a0a,
    });
  } else if (materialName.includes("rim")) {
    material = new THREE.MeshStandardMaterial({
      metalness: 0,
      roughness: 0.5,
      envMapIntensity: 1,
      color: 0x111111,
      normalMap: carbonNormalMap,
    });
  } else if (objectName.includes("frame") || objectName.includes("fork")) {
    material = new THREE.MeshPhysicalMaterial({
      metalness: 0.65,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0,
      envMapIntensity: 2,
      color: objectName.includes("frame") ? frameColor.hex : forkColor.hex
    });
  } else {
    material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  }

  // Handle logo textures
  if (
    material.name === "TOP_TUBE" && headTubeTexture ||
    material.name === "DOWN_TUBE_LEFT" && downTubeLeftTexture ||
    material.name === "DOWN_TUBE_RIGHT" && downTubeRightTexture
  ) {
    // Use MeshPhysicalMaterial for clearcoat
    const texture =
      material.name === "TOP_TUBE" ? headTubeTexture :
      material.name === "DOWN_TUBE_LEFT" ? downTubeLeftTexture :
      downTubeRightTexture;

    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    const newMaterial = new THREE.MeshPhysicalMaterial({
      map: texture,
      metalness: 0.55,
      roughness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      polygonOffset: true,
      polygonOffsetFactor: -10,
      transparent: true,
      alphaTest: 0.5,
      envMapIntensity: 2,
    });

    material = newMaterial;
  }

  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      position={mesh.position}
      scale={mesh.scale}
      receiveShadow
    />
  );
} 