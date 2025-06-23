'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import Konva from 'konva';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBikeStore } from '../../store/useBikeStore';
import { processImageWithTransformations } from '../../utils/generateLogoTexture';
import { generateLogoTexture } from '../../utils/generateLogoTexture';
import { LogoImage } from '@/types/bike';

interface BottomPanelProps {
  isOpen: boolean;
}

export default function BottomPanel({ isOpen }: BottomPanelProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [isClient, setIsClient] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [maxPanelHeight, setMaxPanelHeight] = useState(300); // Fallback for SSR
  const [processedImages, setProcessedImages] = useState<Record<string, HTMLImageElement>>({});
  const textureUpdateTimeoutRef = useRef<NodeJS.Timeout|null>(null);
  const processingRef = useRef(false);
  const lastProcessedRef = useRef<Record<string, string>>({});

  const {
    selectedLogoType,
    logoTypes,
    selectedLogoImageId,
    setSelectedLogoImageId,
    updateLogoImage,
    bottomPanelHeight,
    setBottomPanelHeight,
    setLogoTexture,
    clearLogoSelection
  } = useBikeStore();

  // Constants
  const TEXTURE_SIZE = 1024; // Always 1024×1024 regardless of logo type
  const aspectRatio = selectedLogoType ? logoTypes[selectedLogoType].aspectRatio : 1;
  const LOGICAL_CANVAS_WIDTH = TEXTURE_SIZE;
  const LOGICAL_CANVAS_HEIGHT = TEXTURE_SIZE / aspectRatio;
  const availableHeight = bottomPanelHeight - 80;
  const availableWidth = Math.min(1000, typeof window !== 'undefined' ? window.innerWidth - 80 : 1200);
  
  // Calculate scale while maintaining aspect ratio
  const scaleByWidth = availableWidth / LOGICAL_CANVAS_WIDTH;
  const scaleByHeight = availableHeight / LOGICAL_CANVAS_HEIGHT;
  const visualScale = Math.min(scaleByWidth, scaleByHeight, 3);
  
  const VISUAL_DISPLAY_WIDTH = LOGICAL_CANVAS_WIDTH * visualScale;
  const VISUAL_DISPLAY_HEIGHT = LOGICAL_CANVAS_HEIGHT * visualScale;
  const MIN_PANEL_HEIGHT = 200;

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setMaxPanelHeight(window.innerHeight * 0.3);
      const handleResize = () => {
        setMaxPanelHeight(window.innerHeight * 0.3);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || typeof window === 'undefined') return;
    const newHeight = window.innerHeight - e.clientY;
    const constrainedHeight = Math.max(MIN_PANEL_HEIGHT, Math.min(maxPanelHeight, newHeight));
    setBottomPanelHeight(constrainedHeight);
  }, [isResizing, setBottomPanelHeight, MIN_PANEL_HEIGHT, maxPanelHeight]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (selectedLogoType && isClient) {
      const suggestedHeight = Math.min(VISUAL_DISPLAY_HEIGHT + 120, maxPanelHeight);
      const newHeight = Math.max(MIN_PANEL_HEIGHT, suggestedHeight);
      if (bottomPanelHeight === 520 || Math.abs(bottomPanelHeight - newHeight) > 200) {
        setBottomPanelHeight(newHeight);
      }
    }
  }, [selectedLogoType, isClient, VISUAL_DISPLAY_HEIGHT, bottomPanelHeight, setBottomPanelHeight, MIN_PANEL_HEIGHT, maxPanelHeight]);

  const currentImages = useMemo(() => selectedLogoType ? logoTypes[selectedLogoType].images : [], [selectedLogoType, logoTypes]);

  // Auto-select first image when autoSelectFirstImage is true and no image is selected
  useEffect(() => {
    if (currentImages.length > 0 && !selectedLogoImageId) {
      setSelectedLogoImageId(currentImages[0].id);
    }
  }, [currentImages, selectedLogoImageId, setSelectedLogoImageId]);

  // Process images when they change
  useEffect(() => {
    if (!selectedLogoType || processingRef.current) return;

    const processImages = async () => {
      try {
        processingRef.current = true;
        const newProcessedImages: Record<string, HTMLImageElement> = {};
        for (const image of logoTypes[selectedLogoType].images) {
          // Only process if the image hasn't been processed or if its color has changed
          const imageKey = `${image.id}_${image.color.hex}`;
          if (!lastProcessedRef.current[image.id] || lastProcessedRef.current[image.id] !== imageKey) {
            const processedImage = await processImageWithTransformations(image);
            newProcessedImages[image.id] = processedImage;
            lastProcessedRef.current[image.id] = imageKey;
          }
        }
        if (Object.keys(newProcessedImages).length > 0) {
          setProcessedImages(prev => ({ ...prev, ...newProcessedImages }));
        }
      } catch (error) {
        console.error('Error processing images:', error);
      } finally {
        processingRef.current = false;
      }
    };

    processImages();
  }, [selectedLogoType, logoTypes]);

  // Debounced texture update
  const debouncedTextureUpdate = useCallback(() => {
    if (textureUpdateTimeoutRef.current) {
      clearTimeout(textureUpdateTimeoutRef.current);
    }

    textureUpdateTimeoutRef.current = setTimeout(async () => {
      if (selectedLogoType) {
        try {
          const texture = await generateLogoTexture({
            width: TEXTURE_SIZE,
            height: TEXTURE_SIZE,
            images: logoTypes[selectedLogoType].images.map(img => ({
              ...img,
              processedImage: processedImages[img.id]
            }))
          });
          if (texture) {
            setLogoTexture(selectedLogoType, texture);
          }
        } catch (error) {
          console.error('Error generating texture:', error);
        }
      }
    }, 50); // 100ms debounce
  }, [selectedLogoType, logoTypes, processedImages, setLogoTexture]);

  // Update texture when processed images change
  useEffect(() => {
    debouncedTextureUpdate();
    return () => {
      if (textureUpdateTimeoutRef.current) {
        clearTimeout(textureUpdateTimeoutRef.current);
      }
    };
  }, [debouncedTextureUpdate]);

  // Update transformer when selection changes
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      if (selectedLogoImageId) {
        const selectedNode = stageRef.current.findOne(`#${selectedLogoImageId}`);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer()?.batchDraw();
        } else {
          transformerRef.current.nodes([]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      } else {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedLogoImageId]);

  // Handle logo transform
  const handleTransform = useCallback((id: string, newAttrs: Partial<{ x: number; y: number; scaleX: number; scaleY: number; rotation: number }>) => {
    if (!selectedLogoType) return;
    
    // Update the image in the store
    updateLogoImage(selectedLogoType, id, newAttrs);
    
    // Trigger debounced texture update
    debouncedTextureUpdate();
  }, [selectedLogoType, updateLogoImage, debouncedTextureUpdate]);

  // Handle logo drag
  const handleDrag = useCallback((id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newAttrs = {
      x: e.target.x(),
      y: e.target.y()
    };
    handleTransform(id, newAttrs);
  }, [handleTransform]);

  // Handle logo transform change
  const handleTransformChange = useCallback((id: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const newAttrs = {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation()
    };
    handleTransform(id, newAttrs);
  }, [handleTransform]);

  const handleImageClick = (id: string) => {
    setSelectedLogoImageId(id);
  };

  const handleClose = () => {
    clearLogoSelection();
  };

  if (!isClient) {
    return null;
  }

  const shouldShow = isOpen

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ${
        shouldShow ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ height: `${bottomPanelHeight}px` }}
    >
        {/* Resize handle */}
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gray-300 cursor-row-resize hover:bg-gray-400 transition-colors"
          onMouseDown={handleMouseDown}
        />
        
        <div className="flex items-center justify-between px-4 py-3 mt-1">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-gray-800">
              Logo Editor - {selectedLogoType?.replaceAll('_', ' ')}
            </h3>
            {selectedLogoImageId && (
              <div className="text-xs text-gray-500">
                Selected: {currentImages.find((img: LogoImage) => img.id === selectedLogoImageId)?.name}
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <XMarkIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4" style={{ height: `${bottomPanelHeight - 60}px` }}>
          <div 
            className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
            style={{ 
              width: `${VISUAL_DISPLAY_WIDTH}px`,
              height: `${VISUAL_DISPLAY_HEIGHT}px`,
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: `${LOGICAL_CANVAS_WIDTH} / ${LOGICAL_CANVAS_HEIGHT}`
            }}
          >
            <div
              style={{
                transform: `scale(${visualScale})`,
                transformOrigin: 'top left',
                width: `${LOGICAL_CANVAS_WIDTH}px`,
                height: `${LOGICAL_CANVAS_HEIGHT}px`
              }}
            >
              <Stage
                ref={stageRef}
                width={LOGICAL_CANVAS_WIDTH}
                height={LOGICAL_CANVAS_HEIGHT}
              >
                <Layer>
                  {currentImages.map((imageItem: LogoImage) => {
                    const processedImage = processedImages[imageItem.id];
                    return (
                      <KonvaImage
                        key={imageItem.id}
                        id={imageItem.id}
                        image={processedImage}
                        x={imageItem.x}
                        y={imageItem.y}
                        scaleX={imageItem.scaleX ?? 1}
                        scaleY={imageItem.scaleY ?? 1}
                        rotation={imageItem.rotation}
                        offsetX={processedImage ? processedImage.width / 2 : 0}
                        offsetY={processedImage ? processedImage.height / 2 : 0}
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
                <Layer>
                  <Transformer
                    ref={transformerRef}
                    borderEnabled={true}
                    anchorStroke="#0066CC"
                    anchorFill="#FFFFFF"
                    anchorStrokeWidth={2}
                    anchorSize={8}
                    borderStroke="#0066CC"
                    borderStrokeWidth={2}
                    borderDash={[4, 4]}
                    keepRatio={false}
                    enabledAnchors={[
                      'top-left',
                      'top-center', 
                      'top-right',
                      'middle-right',
                      'bottom-right',
                      'bottom-center',
                      'bottom-left',
                      'middle-left'
                    ]}
                    rotateEnabled={true}
                    rotationSnaps={[0, 90, 180, 270]}
                  />
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </div>
    );
  } 