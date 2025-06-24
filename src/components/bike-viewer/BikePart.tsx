import React from 'react';
import * as THREE from 'three';
import { FrameFork } from './FrameFork';
import { Tire } from './Tire';
import { Rim } from './Rim';
import { LogoTube } from './LogoTube';

interface BikePartProps {
  mesh: THREE.Mesh;
}



export function BikePart({ mesh }: BikePartProps) {
  const objectName = mesh.name.toLowerCase();
  const materialName = mesh.material instanceof THREE.Material ? mesh.material.name.toLowerCase() : '';

  // Check for logo textures first
  if (
    materialName === "top_tube" || 
    materialName === "down_tube_left" || 
    materialName === "down_tube_right"
  ) {
    return <LogoTube mesh={mesh} />;
  }

  // Check for tire parts
  if (materialName.includes("tire") || materialName === "tan_wall") {
    return <Tire mesh={mesh} />;
  }

  // Check for rim parts
  if (materialName.includes("rim")) {
    return <Rim mesh={mesh} />;
  }

  // Check for frame or fork parts
  if (objectName.includes("frame") || objectName.includes("fork")) {
    return <FrameFork mesh={mesh} />;
  }

  // Default fallback for other parts
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
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