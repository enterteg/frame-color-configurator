import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface LogoCanvasProps {
  imageUrl: string;
  onTextureChange: (texture: THREE.Texture) => void;
  repeatX: number; setRepeatX: (v: number) => void;
  repeatY: number; setRepeatY: (v: number) => void;
  offsetX: number; setOffsetX: (v: number) => void;
  offsetY: number; setOffsetY: (v: number) => void;
  onImageChange?: (url: string) => void;
}

const LogoCanvas: React.FC<LogoCanvasProps> = ({
  imageUrl,
  onTextureChange,
  repeatX, setRepeatX,
  repeatY, setRepeatY,
  offsetX, setOffsetX,
  offsetY, setOffsetY,
  onImageChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UV map size
  const UV_WIDTH = 1024;
  const UV_HEIGHT = 1024;

  // canvas size
  const CANVAS_WIDTH = 512;
  const CANVAS_HEIGHT = UV_HEIGHT / UV_WIDTH * CANVAS_WIDTH;

  // Load image
  useEffect(() => {
    const image = new window.Image();
    image.src = imageUrl;
    image.onload = () => setImg(image);
  }, [imageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (onImageChange) {
          onImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw image on canvas and update texture
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    // Fill background with white
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, UV_WIDTH, UV_HEIGHT);
    // Draw the image with scale and offset
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    const offsetU = offsetX * (UV_WIDTH - drawWidth);
    const offsetV = offsetY * (UV_HEIGHT / 8 - drawHeight);
    ctx.drawImage(
      img,
      offsetU,
      offsetV,
      drawWidth,
      drawHeight
    );
    // Create/update THREE.Texture
    const texture = new THREE.Texture(canvasRef.current);
    texture.flipY = false;
    texture.needsUpdate = true;
    onTextureChange(texture);
  }, [img, scale, offsetX, offsetY, onTextureChange]);

  return (
    <div
      style={{
        margin: "2rem auto",
        maxWidth: 540,
        background: "#fafbfc",
        borderRadius: 12,
        boxShadow: "0 2px 8px #0001",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 8, fontWeight: 600 }}>
        Logo Texture Editor
      </div>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Import Texture
        </button>
      </div>
      <div
        style={{
          width: CANVAS_WIDTH, 
          height: CANVAS_HEIGHT / 10,
          overflow: "hidden",
          border: "1px solid #ccc",
          margin: "0 auto",
          position: "relative"
        }}
      >
        <canvas
          ref={canvasRef}
          width={UV_WIDTH}
          height={UV_HEIGHT}
          style={{
            border: "1px solid #ccc",
            background: "#fff",
            display: "block",
            margin: "0 auto",
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 16,
        }}
      >
        <label>
          Scale
          <input
            type="range"
            min={0.1}
            max={2}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </label>
        <label>
          Offset X
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={offsetX}
            onChange={(e) => setOffsetX(Number(e.target.value))}
          />
        </label>
        <label>
          Offset Y
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={offsetY}
            onChange={(e) => setOffsetY(Number(e.target.value))}
          />
        </label>
        <label>
          Repeat X
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.01}
            value={repeatX}
            onChange={(e) => setRepeatX(Number(e.target.value))}
          />
        </label>
        <label>
          Repeat Y
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.01}
            value={repeatY}
            onChange={(e) => setRepeatY(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default LogoCanvas; 