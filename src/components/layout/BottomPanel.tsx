'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import Konva from 'konva';
import * as THREE from 'three';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBikeStore } from '../../store/useBikeStore';

interface BottomPanelProps {
  isOpen: boolean;
  baseTextureUrl: string;
}

export default function BottomPanel({ isOpen, baseTextureUrl }: BottomPanelProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const imageLayerRef = useRef<Konva.Layer>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [isClient, setIsClient] = useState(false);
  const [processedImages, setProcessedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const {
    selectedLogoType,
    logoTypes,
    selectedLogoImageId,
    setSelectedLogoImageId,
    updateLogoImage,
    setLogoTexture,
    setShowBottomPanel
  } = useBikeStore();

  // Canvas dimensions - actual canvas is 1024x100 (for texture)
  const CANVAS_WIDTH = 1024;
  const CANVAS_HEIGHT = 100;
  const DISPLAY_WIDTH = 1000;  // 50% scale for display
  const DISPLAY_HEIGHT = 100;
  const TEXTURE_SIZE = 1024;

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current images for the selected logo type
  const currentImages = selectedLogoType ? logoTypes[selectedLogoType].images : [];

  // Process images with color changes
  useEffect(() => {
    if (!isClient || currentImages.length === 0) return;

    const processImagesAsync = async () => {
      const newProcessedImages = new Map<string, HTMLImageElement>();

      for (const imageItem of currentImages) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageItem.url;
          });

          // Create canvas for color processing with original dimensions (preserve resolution)
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Apply color change if needed
          if (imageItem.color !== '#000000') {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Parse target color
            const targetColor = {
              r: parseInt(imageItem.color.slice(1, 3), 16),
              g: parseInt(imageItem.color.slice(3, 5), 16),
              b: parseInt(imageItem.color.slice(5, 7), 16)
            };

            // Replace colors
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0) { // If not transparent
                data[i] = targetColor.r;     // Red
                data[i + 1] = targetColor.g; // Green
                data[i + 2] = targetColor.b; // Blue
              }
            }

            ctx.putImageData(imageData, 0, 0);
          }

          // Create processed image
          const processedImg = new Image();
          await new Promise((resolve) => {
            processedImg.onload = resolve;
            processedImg.src = canvas.toDataURL();
          });

          newProcessedImages.set(imageItem.id, processedImg);
        } catch (error) {
          console.warn('Error processing image:', imageItem.name, error);
        }
      }

      setProcessedImages(newProcessedImages);
    };

    processImagesAsync();
  }, [currentImages, isClient]);

  // Generate texture from Konva stage
  const generateTexture = useCallback(() => {
    if (isClient && imageLayerRef.current && selectedLogoType) {
      try {
        const layer = imageLayerRef.current;
        
        // Create a temporary canvas for the full texture
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = TEXTURE_SIZE;
        textureCanvas.height = TEXTURE_SIZE;
        const textureCtx = textureCanvas.getContext('2d');
        
        if (textureCtx) {
          const createAndSetTexture = () => {
            // Get the layer canvas and draw it centered
            const layerCanvas = layer.toCanvas();
            const offsetX = (TEXTURE_SIZE - CANVAS_WIDTH) / 2;
            const offsetY = (TEXTURE_SIZE - CANVAS_HEIGHT) / 2;
            
            textureCtx.drawImage(layerCanvas, offsetX, offsetY);
            
            // Create Three.js texture
            const texture = new THREE.CanvasTexture(textureCanvas);
            texture.needsUpdate = true;
            texture.flipY = true;
            
            setLogoTexture(selectedLogoType, texture);
            console.log('Texture updated for', selectedLogoType); // Debug log
          };

          // For DOWN_TUBE, load and use the base texture, for others use white background
          if (selectedLogoType === 'DOWN_TUBE') {
            // Load the base texture image
            const baseImage = new Image();
            baseImage.crossOrigin = 'anonymous';
            baseImage.onload = () => {
              // Draw the base texture
              textureCtx.drawImage(baseImage, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
              createAndSetTexture();
            };
            baseImage.onerror = () => {
              console.warn('Failed to load base texture, using white background');
              textureCtx.fillStyle = 'white';
              textureCtx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
              createAndSetTexture();
            };
            baseImage.src = baseTextureUrl;
          } else {
            // For HEAD_TUBE and others, use white background
            textureCtx.fillStyle = 'white';
            textureCtx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
            createAndSetTexture();
          }
        }
      } catch (error) {
        console.warn('Error generating texture:', error);
      }
    }
  }, [isClient, selectedLogoType, setLogoTexture, baseTextureUrl]);

  // Update texture when processed images are ready
  useEffect(() => {
    if (processedImages.size > 0) {
      // Add a small delay to ensure Konva has finished rendering
      const timeoutId = setTimeout(() => {
        generateTexture();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [processedImages.size, generateTexture]);

  // Handle selection
  const handleImageClick = (id: string) => {
    setSelectedLogoImageId(id);
  };

  // Update transformer when selection changes
  useEffect(() => {
    if (transformerRef.current && selectedLogoImageId && stageRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedLogoImageId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedLogoImageId]);

  const handleTransform = (id: string, newAttrs: Partial<{ x: number; y: number; scaleX: number; scaleY: number; rotation: number }>) => {
    if (selectedLogoType) {
      updateLogoImage(selectedLogoType, id, newAttrs);
    }
  };

  // Real-time update during drag
  const handleDrag = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newAttrs = {
      x: e.target.x(),
      y: e.target.y()
    };
    handleTransform(id, newAttrs);
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
    setTimeout(generateTexture, 0);
  };

  const handleClose = () => {
    setSelectedLogoImageId(null);
    setShowBottomPanel(false);
  };

  if (!isOpen || !isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[200px] bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-gray-800">
            Logo Editor - {selectedLogoType?.replace('_', ' ')}
          </h3>
          {selectedLogoImageId && (
            <div className="text-xs text-gray-500">
              Selected: {currentImages.find(img => img.id === selectedLogoImageId)?.name}
            </div>
          )}
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <Stage
            ref={stageRef}
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            scaleX={DISPLAY_WIDTH / CANVAS_WIDTH}
            scaleY={DISPLAY_HEIGHT / CANVAS_HEIGHT}
            onClick={(e) => {
              // Deselect when clicking on empty area
              if (e.target === e.target.getStage()) {
                setSelectedLogoImageId(null);
              }
            }}
          >
            <Layer ref={imageLayerRef}>
              {currentImages.map((imageItem) => {
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
                  />
                );
              })}
            </Layer>

            {/* Transformer Layer - separate from image layer */}
            <Layer>
              <Transformer
                ref={transformerRef}
                borderEnabled={false}
                anchorStroke="#0066CC"
                anchorFill="#0066CC"
                anchorSize={6}
                borderStroke="#0066CC"
                borderStrokeWidth={1}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
} 