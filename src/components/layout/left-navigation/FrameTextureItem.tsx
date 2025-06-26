import React from 'react';
import { useBikeStore } from '@/store/useBikeStore';
import UploadImageButton from '@/components/layout/UploadImageButton';
import { loadImageAndGetScale } from '@/hooks/useLogoImageActions';
import ImageRow from './ImageRow';

const FrameTextureItem: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setShowBottomPanel,
    addFrameTextureImage,
    frameTexture,
    removeFrameTextureImage,
    reorderFrameTextureImages,
    updateFrameTextureImage,
  } = useBikeStore();

  const handleReplaceImage = (imageId: string) => {
    // Create a hidden file input
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

  return (
    <>
      <div
        className={`w-full cursor-pointer flex items-center justify-between px-4 py-4 border-b border-gray-100 transition-all duration-200 ${
          activeTab === 'frameTexture'
            ? 'bg-gray-200 text-blue-700 border-l-4'
            : 'hover:bg-gray-50'
        }`}
        style={activeTab === 'frameTexture' ? { borderLeftColor: '#4B2E19' } : undefined}
      >
        <button
          className="flex-1 text-left cursor-pointer focus:outline-none"
          onClick={() => {
            setActiveTab('frameTexture');
            setShowBottomPanel(true);
          }}
          tabIndex={-1}
        >
          <div className="font-medium text-gray-800">FRAME TEXTURE</div>
        </button>
        <UploadImageButton
          onFile={file => {
            const blobUrl = URL.createObjectURL(file);
            const aspectRatio = frameTexture.aspectRatio || 1;
            loadImageAndGetScale(blobUrl, aspectRatio, (scale, canvasWidth, canvasHeight) => {
              addFrameTextureImage({
                name: file.name,
                file,
                blobUrl,
                x: canvasWidth / 2,
                y: canvasHeight / 2,
                scaleX: scale,
                scaleY: scale,
                rotation: 0,
                zIndex: 0,
              });
              setShowBottomPanel(true);
            }, 0.8);
          }}
          onClick={() => setActiveTab('frameTexture')}
          accept="image/*"
          title="Add Frame Texture"
          className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors ml-2"
          iconClassName="h-4 w-4"
        />
      </div>
      {frameTexture.images.length > 0 && (
        <div className="bg-white px-4 py-2 border-b border-gray-100">
          <div className="space-y-2 mb-3">
            {frameTexture.images.map((image, idx) => (
              <ImageRow
                key={image.id}
                image={image}
                onDelete={() => removeFrameTextureImage(image.id)}
                onMoveUp={idx > 0 ? () => {
                  const newImages = [...frameTexture.images];
                  [newImages[idx], newImages[idx - 1]] = [newImages[idx - 1], newImages[idx]];
                  reorderFrameTextureImages(newImages);
                } : undefined}
                onMoveDown={idx < frameTexture.images.length - 1 ? () => {
                  const newImages = [...frameTexture.images];
                  [newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
                  reorderFrameTextureImages(newImages);
                } : undefined}
                onClick={() => {
                  setActiveTab('frameTexture');
                  setShowBottomPanel(true);
                }}
                showColor={false}
                onReplace={() => handleReplaceImage(image.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FrameTextureItem; 