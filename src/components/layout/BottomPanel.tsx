'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Rect } from 'react-konva';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBikeStore, useActiveTexture } from '../../store/useBikeStore';
import { TextureImage } from '@/types/bike';
import { useBottomPanelResize } from '../../hooks/useBottomPanelResize';
import { useKonvaTransformer } from '../../hooks/useKonvaTransformer';
import { useCanvasCalculations } from '../../hooks/useCanvasCalculations';
import { useGradientImage } from '../../hooks/useGradientImage';

export default function BottomPanel() {
  const [isClient, setIsClient] = useState(false);

  const {
    showBottomPanel: isOpen,
    selectedLogoImageId,
    setSelectedLogoImageId,
    updateTextureImage,
    bottomPanelHeight,
    setBottomPanelHeight,
    clearLogoSelection,
    setShowBottomPanel,
    selectionPanelType,
    activeTab,
    frameColor
  } = useBikeStore();
  
  const activeTexture = useActiveTexture();
  const aspectRatio = activeTexture ? activeTexture.aspectRatio : 1;
  const currentImages = useMemo(() => activeTexture ? activeTexture.images : [], [activeTexture]);

  // Custom hooks
  const { handleMouseDown } = useBottomPanelResize({
    setBottomPanelHeight,
    minPanelHeight: 200
  });

  const canvasCalculations = useCanvasCalculations({
    aspectRatio,
    bottomPanelHeight
  });

  // Generate gradient image for frame textures
  const { gradientImage } = useGradientImage({
    gradient: activeTab === 'frameTexture' ? activeTexture?.gradient : undefined,
    width: canvasCalculations.LOGICAL_CANVAS_WIDTH,
    height: canvasCalculations.LOGICAL_CANVAS_HEIGHT
  });

  const {
    stageRef,
    transformerRef,
    handleDrag,
    handleTransform,
    handleTransformChange,
    handleImageClick
  } = useKonvaTransformer({
    selectedLogoImageId,
    activeTexture,
    updateTextureImage,
    debouncedTextureUpdate: () => {}, // No-op since texture processing is handled centrally
    setSelectedLogoImageId
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-select first image when no image is selected
  useEffect(() => {
    if (
      currentImages.length > 0 &&
      !selectedLogoImageId &&
      selectionPanelType !== 'image'
    ) {
      setSelectedLogoImageId(currentImages[0].id);
    }
  }, [currentImages, selectedLogoImageId, setSelectedLogoImageId, selectionPanelType]);

  const handleClose = () => {
    setShowBottomPanel(false);
    clearLogoSelection();
  };

  if (!isClient) {
    return null;
  }

  const shouldShow = isOpen;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ${
        shouldShow ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ height: `${bottomPanelHeight}px` }}
    >
      {/* Resize handle */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gray-300 cursor-row-resize hover:bg-gray-400 transition-colors"
        onMouseDown={handleMouseDown}
      />

      <div className="flex items-center justify-between px-4 py-3 mt-1">
        <div className="text-sm font-bold text-gray-500">
          {activeTab === 'frameTexture' ? 'Frame Texture' : 'Logo Texture'}
        </div>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <XMarkIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center p-4"
        style={{ height: `${bottomPanelHeight - 60}px` }}
      >
        <div className='flex flex-col items-start justify-start'>
          <div className="py-1">
            <span className="text-xs text-gray-400 font-mono">
              Texture: {canvasCalculations.LOGICAL_CANVAS_WIDTH}x{canvasCalculations.LOGICAL_CANVAS_HEIGHT} px
            </span>
          </div>

          <div
            className="border border-gray-300 rounded-lg overflow-hidden shadow-sm mb-8"
            style={{
              width: `${canvasCalculations.VISUAL_DISPLAY_WIDTH}px`,
              height: `${canvasCalculations.VISUAL_DISPLAY_HEIGHT}px`,
              maxWidth: "100%",
              maxHeight: "100%",
              aspectRatio: `${canvasCalculations.STAGE_WIDTH} / ${canvasCalculations.STAGE_HEIGHT}`,
            }}
          >
            <div
              style={{
                transform: `scale(${canvasCalculations.visualScale})`,
                transformOrigin: "top left",
                width: `${canvasCalculations.STAGE_WIDTH}px`,
                height: `${canvasCalculations.STAGE_HEIGHT}px`,
              }}
            >
              <Stage
                ref={stageRef}
                width={canvasCalculations.STAGE_WIDTH}
                height={canvasCalculations.STAGE_HEIGHT}
              >
                {/* Background layer with texture capture area */}
                <Layer>
                  {/* Checkerboard background for the entire stage */}
                  {(() => {
                    const size = 32;
                    const stageCols = Math.ceil(canvasCalculations.STAGE_WIDTH / size);
                    const stageRows = Math.ceil(canvasCalculations.STAGE_HEIGHT / size);
                    const rects = [];
                    for (let y = 0; y < stageRows; y++) {
                      for (let x = 0; x < stageCols; x++) {
                        const isDark = (x + y) % 2 === 0;
                        rects.push(
                          <Rect
                            key={`stage-bg-${x}-${y}`}
                            x={x * size}
                            y={y * size}
                            width={size}
                            height={size}
                            fill={isDark ? '#f3f4f6' : '#ffffff'}
                          />
                        );
                      }
                    }
                    return rects;
                  })()}
                  
                  {/* Texture capture area overlay */}
                  {activeTab === 'frameTexture' ? (
                    <>
                      {/* Frame color background */}
                      <Rect
                        x={canvasCalculations.TEXTURE_OFFSET_X}
                        y={canvasCalculations.TEXTURE_OFFSET_Y}
                        width={canvasCalculations.LOGICAL_CANVAS_WIDTH}
                        height={canvasCalculations.LOGICAL_CANVAS_HEIGHT}
                        fill={frameColor.hex}
                      />
                      {/* Gradient overlay if enabled */}
                                              {gradientImage && (
                          <KonvaImage
                            x={canvasCalculations.TEXTURE_OFFSET_X}
                            y={canvasCalculations.TEXTURE_OFFSET_Y}
                            width={canvasCalculations.LOGICAL_CANVAS_WIDTH}
                            height={canvasCalculations.LOGICAL_CANVAS_HEIGHT}
                            image={gradientImage}
                            globalCompositeOperation={
                              activeTexture?.gradient?.blendMode === 'multiply' ? 'multiply' :
                              activeTexture?.gradient?.blendMode === 'screen' ? 'screen' :
                              activeTexture?.gradient?.blendMode === 'overlay' ? 'overlay' :
                              activeTexture?.gradient?.blendMode === 'soft-light' ? 'soft-light' :
                              activeTexture?.gradient?.blendMode === 'hard-light' ? 'hard-light' :
                              'source-over'
                            }
                            opacity={activeTexture?.gradient?.opacity || 1}
                          />
                        )}
                    </>
                  ) : (
                    // Darker checkerboard pattern for logo texture capture area
                    (() => {
                      const size = 24; // Smaller squares for better visibility
                      const cols = Math.ceil(canvasCalculations.LOGICAL_CANVAS_WIDTH / size);
                      const rows = Math.ceil(canvasCalculations.LOGICAL_CANVAS_HEIGHT / size);
                      const rects = [];
                      for (let y = 0; y < rows; y++) {
                        for (let x = 0; x < cols; x++) {
                          const isDark = (x + y) % 2 === 0;
                          rects.push(
                            <Rect
                              key={`texture-bg-${x}-${y}`}
                              x={canvasCalculations.TEXTURE_OFFSET_X + (x * size)}
                              y={canvasCalculations.TEXTURE_OFFSET_Y + (y * size)}
                              width={size}
                              height={size}
                              fill={isDark ? '#d1d5db' : '#e5e7eb'} // Darker pattern
                            />
                          );
                        }
                      }
                      return rects;
                    })()
                  )}
                  
                  {/* Prominent texture boundary outline */}
                  <Rect
                    x={canvasCalculations.TEXTURE_OFFSET_X}
                    y={canvasCalculations.TEXTURE_OFFSET_Y}
                    width={canvasCalculations.LOGICAL_CANVAS_WIDTH}
                    height={canvasCalculations.LOGICAL_CANVAS_HEIGHT}
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dash={[12, 6]}
                  />
                </Layer>
                
                <Layer>
                  {currentImages.map((imageItem: TextureImage) => {
                    const processedImage = activeTexture?.processedImages[imageItem.id];
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
                        onTransform={(e) =>
                          handleTransformChange(imageItem.id, e)
                        }
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
                    anchorStrokeWidth={2 / canvasCalculations.visualScale}
                    anchorSize={8 / canvasCalculations.visualScale}
                    borderStroke="#0066CC"
                    borderStrokeWidth={2 / canvasCalculations.visualScale}
                    borderDash={[4 / canvasCalculations.visualScale, 4 / canvasCalculations.visualScale]}
                    keepRatio={false}
                    enabledAnchors={[
                      "top-left",
                      "top-center",
                      "top-right",
                      "middle-right",
                      "bottom-right",
                      "bottom-center",
                      "bottom-left",
                      "middle-left",
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
    </div>
  );
}