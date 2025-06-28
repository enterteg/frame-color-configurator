import React from 'react';
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, ChevronUpIcon, ChevronRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { TabType, TextureImage } from '../../../types/bike';
import { useBikeStore } from '../../../store/useBikeStore';
import { loadImageAndGetScale } from '../../../hooks/useLogoImageActions';
import { getContrastTextColor } from '@/utils/colorUtils';
import GradientControls from '../GradientControls';
import GradientPreview from './GradientPreview';

interface FrameSelectorProps {
  activeTab: TabType;
  frameColor: { hex: string; code: string };
  setActiveTab: (tab: TabType) => void;
  openColorSelection: (type: 'frame' | 'fork' | 'logo') => void;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({ 
  activeTab, 
  frameColor, 
  setActiveTab, 
  openColorSelection 
}) => {
  const {
    frameTexture,
    removeFrameTextureImage,
    reorderFrameTextureImages,
    updateFrameTextureImage,
    setSelectionPanelType,
    setShowBottomPanel,
    setFrameGradient,
    closeColorSelection
  } = useBikeStore();

  const handleFrameClick = () => {
    if (activeTab === 'frame') {
      if (frameTexture.gradient?.enabled) {
        setActiveTab(null);
        closeColorSelection();
      } else {
        setActiveTab(null);
      }
    } else {
      if (frameTexture.gradient?.enabled) {
        setActiveTab('frame');
      } else {
        setActiveTab('frame');
        openColorSelection('frame');
      }
    }
  };

  const handleColorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (frameTexture.gradient?.enabled) {
      setActiveTab('frame');
    } else {
      openColorSelection('frame');
    }
  };

  const handleTextureImageSelect = () => {
    setActiveTab('frame');
    setShowBottomPanel(true);
  };

  const handleTextureImageDelete = (imageId: string) => {
    removeFrameTextureImage(imageId);
  };

  const handleReplaceImage = (imageId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const blobUrl = URL.createObjectURL(file);
        const aspectRatio = frameTexture.aspectRatio || 1;
        loadImageAndGetScale(blobUrl, aspectRatio, (scale) => {
          updateFrameTextureImage(imageId, {
            name: file.name,
            file,
            blobUrl,
            scaleX: scale,
            scaleY: scale,
          });
        }, 0.8);
      }
    };
    input.click();
  };

  const handleUploadTexture = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectionPanelType('image');
  };

  return (
    <>
      <div
        className={`w-full cursor-pointer flex items-center justify-between px-4 py-4 border-b border-gray-100 transition-all duration-200 ${
          activeTab === "frame"
            ? "bg-gray-200 text-blue-700 border-l-4"
            : "hover:bg-gray-50"
        }`}
        style={
          activeTab === "frame" ? { borderLeftColor: "#4B2E19" } : undefined
        }
      >
        <div 
          className="flex-1 text-left cursor-pointer"
          onClick={handleFrameClick}
        >
          <div className="font-medium text-gray-800">FRAME</div>
        </div>
        <div className="flex items-center gap-2">
          {/* Show solid color only when gradient is not enabled */}
          {!frameTexture.gradient?.enabled && (
            <button
              onClick={handleColorClick}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <div
                className="w-12 h-12 rounded-full cursor-pointer border border-gray-300 shadow-md flex items-center justify-center"
                style={{ backgroundColor: frameColor.hex }}
              >
                <span
                  className="text-[10px] font-bold"
                  style={{ color: getContrastTextColor(frameColor.hex) }}
                >
                  {frameColor.code.replace("RAL ", "")}
                </span>
              </div>
            </button>
          )}
          
          {/* Show gradient preview if gradient is enabled */}
          {frameTexture.gradient?.enabled && (
            <div 
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              onClick={handleColorClick}
            >
              <GradientPreview 
                gradient={frameTexture.gradient} 
                size={48}
                className="cursor-pointer"
              />
            </div>
          )}
          
          <div 
            className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={handleFrameClick}
          >
            {activeTab === "frame" ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
      </div>
      <div
        className={`bg-gray-50 border-b border-gray-100 transition-max-height ${
          activeTab === "frame" ? "expanded" : "collapsed"
        }`}
        style={{
          maxHeight: activeTab === "frame" ? "1000px" : "0",
          opacity: activeTab === "frame" ? 1 : 0,
        }}
        aria-hidden={activeTab !== "frame"}
      >
        {activeTab === "frame" && (
          <div className="border-b border-gray-100">
            {/* Gradient Controls */}
            <GradientControls
              gradient={frameTexture.gradient}
              onGradientChange={setFrameGradient}
              autoExpand={activeTab === 'frame'}
            />
            <div className="border-b border-gray-200">
              <div 
                onClick={() => {
                  if (frameTexture.images.length > 0) {
                    setShowBottomPanel(true);
                  }
                }}
                className="px-6 py-3 bg-white cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 flex flex-row min-w-0 justify-between items-center">
                  <div className="text-sm font-medium text-gray-900">
                    Textures
                  </div>
                  <button
                    onClick={handleUploadTexture}
                    className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="bg-white px-4">
                {frameTexture.images.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {frameTexture.images.map(
                      (image: TextureImage, idx: number) => (
                        <div
                          key={image.id}
                          onClick={() => handleTextureImageSelect()}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                        >
                          {(image.url || image.blobUrl) && (
                            <div className="w-10 h-10 rounded border border-gray-300 bg-gray-100 flex-shrink-0 overflow-hidden">
                              <Image
                                src={image.url || image.blobUrl || ""}
                                alt={image.name || "Frame texture"}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                                unoptimized={!!image.blobUrl}
                              />
                            </div>
                          )}
                          <div className="flex-1 flex flex-col min-w-0">
                            <div className="text-xs font-medium text-gray-800 truncate">
                              {image.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {frameTexture.images.length > 1 && (
                              <>
                                {idx < frameTexture.images.length - 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newImages = [
                                        ...frameTexture.images,
                                      ];
                                      [newImages[idx], newImages[idx + 1]] = [
                                        newImages[idx + 1],
                                        newImages[idx],
                                      ];
                                      reorderFrameTextureImages(newImages);
                                    }}
                                    className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                    title="Move down"
                                  >
                                    <ArrowDownIcon className="h-4 w-4 text-gray-500" />
                                  </button>
                                )}
                                {idx > 0 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newImages = [
                                        ...frameTexture.images,
                                      ];
                                      [newImages[idx], newImages[idx - 1]] = [
                                        newImages[idx - 1],
                                        newImages[idx],
                                      ];
                                      reorderFrameTextureImages(newImages);
                                    }}
                                    className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                    title="Move up"
                                  >
                                    <ArrowUpIcon className="h-4 w-4 text-gray-500" />
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTextureImageDelete(image.id);
                              }}
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <TrashIcon className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReplaceImage(image.id);
                              }}
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Replace image"
                            >
                              <ArrowPathIcon className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .transition-max-height {
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s;
          overflow: hidden;
        }
        .collapsed {
          max-height: 0 !important;
          opacity: 0 !important;
        }
        .expanded {
          max-height: 1000px !important;
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
};

export default FrameSelector; 