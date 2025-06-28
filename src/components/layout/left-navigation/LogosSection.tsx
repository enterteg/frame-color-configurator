import React from 'react';
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, ChevronUpIcon, ChevronRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useBikeStore } from '../../../store/useBikeStore';
import { TabType, LogoType, TextureImage } from "../../../types/bike";
import ColorPreview from '../ColorPreview';

interface LogosSectionProps {
  activeTab: TabType;
  selectedLogoType: LogoType | null;
  selectedLogoImageId: string | null;
  logoTypes: Record<LogoType, { images: TextureImage[] }>;
  setSelectedLogoType: (type: LogoType | null) => void;
  setSelectedLogoImageId: (id: string | null) => void;
  setActiveTab: (tab: TabType) => void;
  removeLogoImage: (logoType: LogoType, imageId: string) => void;
  setLogoTextureFromState: (logoType: LogoType) => void;
  updateLogoTypeImages: (logoType: LogoType, images: TextureImage[]) => void;
  openColorSelection: (section: 'frame' | 'fork' | 'logo') => void;
}

const logoTypes_CONFIG = [
  { id: 'DOWN_TUBE_RIGHT', name: 'Down Tube Right' },
  { id: 'DOWN_TUBE_LEFT', name: 'Down Tube Left' },
  { id: 'HEAD_TUBE', name: 'Head Tube' }
] as const;

const LogosSection: React.FC<LogosSectionProps> = ({
  activeTab,
  selectedLogoType,
  selectedLogoImageId,
  logoTypes,
  setSelectedLogoType,
  setSelectedLogoImageId,
  setActiveTab,
  removeLogoImage,
  setLogoTextureFromState,
  updateLogoTypeImages,
  openColorSelection
}) => {
  const { setSelectionPanelType } = useBikeStore();

  const handleImageSelect = (logoType: LogoType, imageId: string) => {
    setSelectedLogoType(logoType);
    setSelectedLogoImageId(imageId);
    setActiveTab('logos');
  };

  const handleImageDelete = (logoType: LogoType, imageId: string) => {
    removeLogoImage(logoType, imageId);
    if (selectedLogoType === logoType && selectedLogoImageId === imageId) {
      setSelectedLogoType(null);
      setSelectedLogoImageId(null);
    }
    setLogoTextureFromState(logoType);
  };

  const handleImageColorChange = (logoType: LogoType, imageId: string) => {
    setSelectedLogoType(logoType);
    setSelectedLogoImageId(imageId);
    openColorSelection('logo');
  };

  const handleLogoTypeClick = (logoType: LogoType) => {
    setSelectedLogoType(logoType);
    const images = logoTypes[logoType].images;
    if (images.length > 0) {
      setSelectedLogoImageId(images[0].id);
    } else {
      setSelectedLogoImageId(null);
    }
    setActiveTab('logos');
  };

  return (
    <>
      <button
        onClick={() => {
          if (activeTab === 'logos') {
            setActiveTab(null);
          } else {
            setActiveTab('logos');
          }
        }}
        className={`w-full cursor-pointer flex items-center justify-between px-4 py-4 border-b border-gray-100 transition-all duration-200 ${
          activeTab === "logos"
            ? "bg-gray-200 text-blue-700 border-l-4"
            : "hover:bg-gray-50"
        }`}
        style={activeTab === 'logos' ? { borderLeftColor: '#4B2E19' } : undefined}
      >
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-800">LOGOS</div>
        </div>
        <div className="p-1 rounded hover:bg-gray-100 transition-colors">
          {activeTab === 'logos' ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </button>
      <div
        className={`bg-gray-50 border-b border-gray-100 transition-max-height ${activeTab === 'logos' ? 'expanded' : 'collapsed'}`}
        style={{ maxHeight: activeTab === 'logos' ? '1000px' : '0', opacity: activeTab === 'logos' ? 1 : 0 }}
        aria-hidden={activeTab !== 'logos'}
      >
        {activeTab === 'logos' && (
          <div className="bg-gray-50 border-b border-gray-100">
            {logoTypes_CONFIG.map((logoType) => (
              <div
                key={logoType.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div
                  onClick={() => handleLogoTypeClick(logoType.id)}
                  className={`px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                    selectedLogoType === logoType.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex-1 flex flex-row min-w-0 justify-between items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {logoType.name}
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedLogoType(logoType.id);
                        setSelectedLogoImageId(null);
                        setSelectionPanelType('image');
                      }}
                      className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-white px-4 py-2">
                  {logoTypes[logoType.id].images.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {logoTypes[logoType.id].images.map((image: TextureImage) => (
                        <div
                          key={image.id}
                          onClick={() => handleImageSelect(logoType.id, image.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedLogoType === logoType.id &&
                            selectedLogoImageId === image.id
                              ? "bg-gray-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {(image.url || image.blobUrl) && (
                            <div className="w-10 h-10 rounded border border-gray-300 bg-gray-100 flex-shrink-0 overflow-hidden">
                              <Image
                                src={image.url || image.blobUrl || ""}
                                alt={image.name || "Logo image"}
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
                            <div className="text-xs font-medium text-gray-800 truncate">
                              {image.color?.code || 'No color'}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {image.color && (
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageColorChange(logoType.id, image.id);
                                }}
                                className="cursor-pointer"
                              >
                                <ColorPreview 
                                  color={image.color}
                                  size="medium"
                                />
                              </div>
                            )}
                            {logoTypes[logoType.id].images.length > 1 && (
                              <>
                                {logoTypes[logoType.id].images.findIndex(
                                  (img: TextureImage) => img.id === image.id
                                ) <
                                  logoTypes[logoType.id].images.length - 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const currentIndex = logoTypes[
                                        logoType.id
                                      ].images.findIndex(
                                        (img: TextureImage) => img.id === image.id
                                      );
                                      const newImages = [
                                        ...logoTypes[logoType.id].images,
                                      ];
                                      [
                                        newImages[currentIndex],
                                        newImages[currentIndex + 1],
                                      ] = [
                                        newImages[currentIndex + 1],
                                        newImages[currentIndex],
                                      ];
                                      updateLogoTypeImages(
                                        logoType.id,
                                        newImages
                                      );
                                      setLogoTextureFromState(logoType.id);
                                    }}
                                    className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                    title="Move up"
                                  >
                                    <ArrowDownIcon className="h-4 w-4 text-gray-500" />
                                  </button>
                                )}
                                {logoTypes[logoType.id].images.findIndex(
                                  (img: TextureImage) => img.id === image.id
                                ) > 0 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const currentIndex = logoTypes[
                                        logoType.id
                                      ].images.findIndex(
                                        (img: TextureImage) => img.id === image.id
                                      );
                                      const newImages = [
                                        ...logoTypes[logoType.id].images,
                                      ];
                                      [
                                        newImages[currentIndex],
                                        newImages[currentIndex - 1],
                                      ] = [
                                        newImages[currentIndex - 1],
                                        newImages[currentIndex],
                                      ];
                                      updateLogoTypeImages(
                                        logoType.id,
                                        newImages
                                      );
                                      setLogoTextureFromState(logoType.id);
                                    }}
                                    className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                    title="Move down"
                                  >
                                    <ArrowUpIcon className="h-4 w-4 text-gray-500" />
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageDelete(logoType.id, image.id);
                              }}
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <TrashIcon className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLogoType(logoType.id);
                                setSelectedLogoImageId(image.id);
                                setSelectionPanelType("image");
                              }}
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Replace image"
                            >
                              <ArrowPathIcon className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .transition-max-height {
          transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s;
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

export default LogosSection; 