import React from 'react';
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
      return 0x6b3410;
    case "white":
      return 0xe6e6e6;
    case "light_brown":
      return 0xb5884a; // or 0xc49e60 for a muted light brown
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

  const objectName = mesh.name.toLowerCase();
  const materialName = mesh.material instanceof THREE.Material ? mesh.material.name.toLowerCase() : '';

  let material: THREE.Material;

  if (materialName === "tire" || materialName === "tan_wall") {
    material = new THREE.MeshStandardMaterial({
      metalness: 0.0,
      roughness: 0.9,
      envMapIntensity: 0.05,
      color:
        materialName === "tan_wall"
          ? getTireWallColor(tireWallColor)
          : 0x0a0a0a,
    });
  } else if (materialName.includes("rim")) {
    material = new THREE.MeshStandardMaterial({
      metalness: 0.5,
      roughness: 0.5,
      envMapIntensity: 1,
      color: 0x333333
    });
  } else if (objectName.includes("frame") || objectName.includes("fork")) {
    material = new THREE.MeshPhysicalMaterial({
      metalness: 0.6,
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
      metalness: 0.6,
      roughness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      polygonOffset: true,
      polygonOffsetFactor: -10,
      transparent: true,
      alphaTest: 0.5,
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