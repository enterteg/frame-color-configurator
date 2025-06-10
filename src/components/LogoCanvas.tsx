import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import Konva from 'konva';
import * as THREE from 'three';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PNG } from 'pngjs';

interface LogoCanvasProps {
  imageUrl: string;
  onTextureChange: (texture: THREE.Texture) => void;
  onColorChangeRequest?: (imageId: string) => void; // Callback to request color selection
  selectedColor?: string; // Color selected from RAL palette
  externalSelectedImageId?: string; // ID of the image that should receive the color from parent
}

interface ImageItem {
  id: string;
  src: string;
  image: HTMLImageElement;
  originalData?: ArrayBuffer; // Store original file data for direct pngjs processing
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  color: string;
}

const LogoCanvas: React.FC<LogoCanvasProps> = ({
  imageUrl,
  onTextureChange,
  onColorChangeRequest,
  selectedColor,
  externalSelectedImageId
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const imageLayerRef = useRef<Konva.Layer>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [processedImages, setProcessedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  
  // Debouncing for color changes
  const colorChangeTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Canvas dimensions - actual canvas is 1024x100 (1:1 with texture)
  const CANVAS_WIDTH = 1024;   // Actual canvas width
  const CANVAS_HEIGHT = 100;   // Actual canvas height
  const DISPLAY_WIDTH = 512;   // How wide it displays (50% scale)
  const DISPLAY_HEIGHT = 50;   // How tall it displays (50% scale)
  const TEXTURE_SIZE = 1024;   // Final texture is 1024x1024

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to recolor an image using pngjs for PNG handling
  const recolorImage = (originalImage: HTMLImageElement, color: string, originalData?: ArrayBuffer): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      // Require original PNG data - no more canvas fallback
      if (!originalData) {
        console.warn('No original PNG data available - cannot recolor image');
        resolve(originalImage);
        return;
      }

      try {
        const uint8Array = new Uint8Array(originalData);
        const png = PNG.sync.read(Buffer.from(uint8Array));
        
        // Parse target color
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Process each pixel (RGBA format)
        for (let i = 0; i < png.data.length; i += 4) {
          const alpha = png.data[i + 3];
          
          // If pixel has any opacity (not fully transparent), recolor it
          if (alpha > 0) {
            png.data[i] = r;     // Red
            png.data[i + 1] = g; // Green
            png.data[i + 2] = b; // Blue
            // Force full opacity for recolored pixels
            png.data[i + 3] = 255; // Full opacity
          }
        }
        
        // Encode back to PNG
        const pngBuffer = PNG.sync.write(png);
        
        // Create blob and object URL
        const pngBlob = new Blob([pngBuffer], { type: 'image/png' });
        const url = URL.createObjectURL(pngBlob);
        
        // Create new image
        const newImage = new Image();
        newImage.onload = () => {
          URL.revokeObjectURL(url); // Clean up
          resolve(newImage);
        };
        newImage.src = url;
        
      } catch (error) {
        console.error('PNG processing failed:', error);
        resolve(originalImage);
      }
    });
  };

  // Load initial image
  useEffect(() => {
    if (imageUrl) {
      loadImage(imageUrl, 'default');
    }
  }, [imageUrl]);

  const loadImage = (src: string, id: string) => {
    // First fetch the image as ArrayBuffer for PNG processing
    fetch(src)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        // Also load as Image for display
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const newImage: ImageItem = {
            id,
            src,
            image: img,
            originalData: arrayBuffer, // Now default images also have original PNG data
            x: CANVAS_WIDTH / 2 - img.width / 2, // Center in 1024px space
            y: CANVAS_HEIGHT / 2 - img.height / 2, // Center in 100px space
            scaleX: 0.6,
            scaleY: 0.6,
            rotation: 0,
            color: '#000000'
          };
          
          setImages(prev => {
            const existing = prev.find(item => item.id === id);
            if (existing) {
              return prev.map(item => item.id === id ? newImage : item);
            } else {
              return [...prev, newImage];
            }
          });
          
          // Process with original PNG data (same method for all images)
          recolorImage(img, '#000000', arrayBuffer).then(processedImg => {
            setProcessedImages(prev => new Map(prev).set(id, processedImg));
          });
        };
        img.src = src;
      })
      .catch(error => {
        console.warn('Failed to fetch image as ArrayBuffer:', error);
        // Fallback to original method if fetch fails
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const newImage: ImageItem = {
            id,
            src,
            image: img,
            originalData: undefined,
            x: CANVAS_WIDTH / 2 - img.width / 2,
            y: CANVAS_HEIGHT / 2 - img.height / 2,
            scaleX: 0.6,
            scaleY: 0.6,
            rotation: 0,
            color: '#000000'
          };
          
          setImages(prev => {
            const existing = prev.find(item => item.id === id);
            if (existing) {
              return prev.map(item => item.id === id ? newImage : item);
            } else {
              return [...prev, newImage];
            }
          });
          
          recolorImage(img, '#000000', undefined).then(processedImg => {
            setProcessedImages(prev => new Map(prev).set(id, processedImg));
          });
        };
        img.src = src;
      });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store original file data for direct pngjs processing
      file.arrayBuffer().then((arrayBuffer) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const id = generateUUID();
          
          // Load image with original data
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const newImage: ImageItem = {
              id,
              src: result,
              image: img,
              originalData: arrayBuffer, // Store original file data
              x: CANVAS_WIDTH / 2 - img.width / 2,
              y: CANVAS_HEIGHT / 2 - img.height / 2,
              scaleX: 0.6,
              scaleY: 0.6,
              rotation: 0,
              color: '#000000'
            };
            
            setImages(prev => [...prev, newImage]);
            
            // Process with original data for maximum efficiency
            recolorImage(img, '#000000', arrayBuffer).then(processedImg => {
              setProcessedImages(prev => new Map(prev).set(id, processedImg));
            });
          };
          img.src = result;
        };
        reader.readAsDataURL(file);
      });
    }
    
    // Clear the file input to allow importing the same file again
    event.target.value = '';
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(item => item.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  // Generate 1024x1024 texture - DIRECT COPY, no scaling!
  const generateTexture = useCallback(() => {
    if (isClient && imageLayerRef.current) {
      try {
        // Get the 1024x100 canvas (actual size)
        const sourceCanvas = imageLayerRef.current.toCanvas();
        
        // Create final 1024x1024 texture
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = TEXTURE_SIZE;
        textureCanvas.height = TEXTURE_SIZE;
        const textureCtx = textureCanvas.getContext('2d', { 
          alpha: true,
          colorSpace: 'srgb', // Force sRGB color space
          willReadFrequently: false
        });
        
        if (textureCtx) {
          // Set explicit color space and composition mode
          textureCtx.imageSmoothingEnabled = false; // No smoothing for pixel-perfect copy
          
          // Clear to transparent
          textureCtx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
          
          // DIRECT COPY - no scaling needed! 1024x100 → 1024x100 at top
          textureCtx.drawImage(
            sourceCanvas,
            0, 0, sourceCanvas.width, sourceCanvas.height, // Source: full 1024x100
            0, 0, sourceCanvas.width, sourceCanvas.height  // Target: same size at top
          );
          
          // Create THREE.js texture with proper color space settings
          const texture = new THREE.Texture(textureCanvas);
          texture.flipY = false;
          texture.needsUpdate = true;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          
          // Fix color space issues - ensure sRGB color space
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.format = THREE.RGBAFormat;
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          onTextureChange(texture);
        }
      } catch (error) {
        console.warn('Error generating texture:', error);
      }
    }
  }, [onTextureChange, isClient]);

  // Update texture when images or processed images change
  useEffect(() => {
    generateTexture();
  }, [images, processedImages, onTextureChange, isClient, generateTexture]);

  // Handle selection
  const handleImageClick = (id: string) => {
    setSelectedImageId(id);
  };

  // Update transformer when selection changes
  useEffect(() => {
    if (transformerRef.current && selectedImageId && stageRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedImageId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedImageId]);

  const handleTransform = (id: string, newAttrs: Partial<ImageItem>) => {
    setImages(prev => prev.map(item => 
      item.id === id ? { ...item, ...newAttrs } : item
    ));
  };

  // Real-time update during drag
  const handleDrag = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newAttrs = {
      x: e.target.x(),
      y: e.target.y()
    };
    handleTransform(id, newAttrs);
    // Generate texture immediately during drag
    setTimeout(generateTexture, 0);
  };

  // Real-time update during transform
  const handleTransformChange = (id: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const newAttrs = {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation()
    };
    handleTransform(id, newAttrs);
    // Generate texture immediately during transform
    setTimeout(generateTexture, 0);
  };

  // Handle external color changes from RAL palette
  useEffect(() => {
    const targetImageId = externalSelectedImageId || selectedImageId;
    if (selectedColor && targetImageId) {
      // Update the images state first
      setImages(prev => {
        const updated = prev.map(item => 
          item.id === targetImageId ? { ...item, color: selectedColor } : item
        );
        
        // Clear any existing timeout for this image
        const existingTimeout = colorChangeTimeouts.current.get(targetImageId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        
        // Debounce the actual image reprocessing
        const timeout = setTimeout(() => {
          const imageItem = updated.find(item => item.id === targetImageId);
          if (imageItem) {
            recolorImage(imageItem.image, selectedColor, imageItem.originalData).then(processedImg => {
              setProcessedImages(prev => new Map(prev).set(targetImageId, processedImg));
            });
          }
          colorChangeTimeouts.current.delete(targetImageId);
        }, 60);
        
        colorChangeTimeouts.current.set(targetImageId, timeout);
        
        return updated;
      });
    }
  }, [selectedColor, externalSelectedImageId]); // Removed selectedImageId and images from dependencies

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      colorChangeTimeouts.current.forEach(timeout => clearTimeout(timeout));
      colorChangeTimeouts.current.clear();
    };
  }, []);

  // Simple UUID generator
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Don't render until we're on the client side
  if (!isClient) {
    return (
      <div
        style={{
          margin: "2rem auto",
          maxWidth: 600,
          background: "#fafbfc",
          borderRadius: 12,
          boxShadow: "0 2px 8px #0001",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16, fontWeight: 600 }}>
          Logo Texture Editor
        </div>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        margin: "2rem auto",
        maxWidth: 600,
        background: "#fafbfc",
        borderRadius: 12,
        boxShadow: "0 2px 8px #0001",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 16, fontWeight: 600 }}>
        Logo Texture Editor
      </div>

      {/* Import Controls */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png"
          onChange={handleFileImport}
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 auto",
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Import PNG Image
        </button>
      </div>

      {/* Konva Stage */}
      <div
        style={{
          border: "1px solid #ccc",
          margin: "0 auto 16px",
          borderRadius: "8px",
          overflow: "visible", // Allow full canvas to show
          width: `${DISPLAY_WIDTH}px`, // Display container - 512px
          height: `${DISPLAY_HEIGHT}px`, // Display container - 50px
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // Transparent checkerboard pattern background
          backgroundImage: `
            linear-gradient(45deg, #d0d0d0 25%, transparent 25%),
            linear-gradient(-45deg, #d0d0d0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #d0d0d0 75%),
            linear-gradient(-45deg, transparent 75%, #d0d0d0 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        <div
          style={{
            transform: "scale(0.5)",
            transformOrigin: "center center",
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
          }}
        >
          <Stage
            width={CANVAS_WIDTH} // Actual canvas: 1024px
            height={CANVAS_HEIGHT} // Actual canvas: 100px
            ref={stageRef}
            pixelRatio={1} // Force 1:1 pixel ratio to ensure exact dimensions
            style={{
              width: `${CANVAS_WIDTH}px`, // Full canvas size
              height: `${CANVAS_HEIGHT}px`, // Full canvas size
              display: "block",
            }}
            onClick={(e) => {
              // Deselect when clicking on empty area
              if (e.target === e.target.getStage()) {
                setSelectedImageId(null);
              }
            }}
          >
            {/* Image Layer - used for texture generation */}
            <Layer ref={imageLayerRef}>
              {images.map((imageItem) => {
                const processedImage = processedImages.get(imageItem.id);
                if (!processedImage) return null;
                
                return (
                  <KonvaImage
                    key={imageItem.id}
                    id={imageItem.id}
                    image={processedImage}
                    x={imageItem.x}
                    y={imageItem.y}
                    scaleX={imageItem.scaleX}
                    scaleY={imageItem.scaleY}
                    rotation={imageItem.rotation}
                    draggable
                    onClick={() => handleImageClick(imageItem.id)}
                    onTap={() => handleImageClick(imageItem.id)}
                    onDragMove={(e) => handleDrag(imageItem.id, e)}
                    onDragEnd={(e) => {
                      handleTransform(imageItem.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransform={(e) => handleTransformChange(imageItem.id, e)}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      handleTransform(imageItem.id, {
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                      });
                    }}
                    filters={[]}
                  />
                );
              })}
            </Layer>

            {/* Transformer Layer - separate from image layer */}
            <Layer>
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize
                  if (newBox.width < 10 || newBox.height < 10) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>
      <div
        style={{
          marginTop: "16px",
          paddingBottom: "20px",
          background: "#f0f9ff",
          borderRadius: "6px",
        }}
      >
        <div style={{ color: "#0369a1", fontSize: "14px", fontWeight: 500 }}>
          💡 Tip: Drag to move, click to select and use corner handles to resize and rotate the
          selected image
        </div>
      </div>
      {/* Image List and Controls */}
      {images.length > 0 && (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <h4
            style={{ color: "#374151", fontWeight: 500, marginBottom: "8px" }}
          >
            Images ({images.length})
          </h4>
          {images.map((imageItem) => (
            <div
              key={imageItem.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px",
                background:
                  selectedImageId === imageItem.id ? "#e3f2fd" : "#f9f9f9",
                borderRadius: "6px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(imageItem.id)}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundImage: `url(${imageItem.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {imageItem.id.startsWith("imported_")
                    ? "Imported Image"
                    : "Default Logo"}
                </div>
                <div style={{ color: "#6b7280", fontSize: "12px" }}>
                  {Math.round(imageItem.scaleX * 100)}% scale
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => {
                    setSelectedImageId(imageItem.id);
                    onColorChangeRequest?.(imageItem.id);
                  }}
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    padding: "0",
                    background: imageItem.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Select RAL color"
                >
                  <span style={{ fontSize: "8px", color: "white", textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>RAL</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(imageItem.id);
                  }}
                  style={{
                    padding: "4px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Remove image"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoCanvas; 