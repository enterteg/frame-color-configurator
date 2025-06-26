import React from 'react';
import Image from 'next/image';
import { TrashIcon, ArrowUpIcon, ArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { TextureImage } from '../../../types/bike';

interface ImageRowProps {
  image: TextureImage;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onClick?: () => void;
  showColor?: boolean;
  onColorClick?: () => void;
  onReplace?: () => void;
}

const ImageRow: React.FC<ImageRowProps> = ({
  image,
  onDelete,
  onMoveUp,
  onMoveDown,
  onClick,
  showColor = true,
  onColorClick,
  onReplace,
}) => (
  <div
    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
    onClick={onClick}
  >
    {(image.url || image.blobUrl) && (
      <div className="w-10 h-10 rounded border border-gray-300 bg-gray-100 flex-shrink-0 overflow-hidden">
        <Image
          src={image.url || image.blobUrl || ''}
          alt={image.name || 'Image'}
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
      {showColor && (
        <div className="text-xs font-medium text-gray-800 truncate">
          {image.color?.code || 'No color'}
        </div>
      )}
    </div>
    <div className="flex items-center gap-1">
      {showColor && (
        <button
          onClick={e => {
            e.stopPropagation();
            if (onColorClick) onColorClick();
          }}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          style={{ display: showColor ? undefined : 'none' }}
        >
          <div
            className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
            style={{ backgroundColor: image.color?.hex || '#ccc' }}
          />
        </button>
      )}
      {onMoveDown && (
        <button
          onClick={e => {
            e.stopPropagation();
            onMoveDown();
          }}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          title="Move down"
        >
          <ArrowDownIcon className="h-4 w-4 text-gray-500" />
        </button>
      )}
      {onMoveUp && (
        <button
          onClick={e => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          title="Move up"
        >
          <ArrowUpIcon className="h-4 w-4 text-gray-500" />
        </button>
      )}
      <button
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
        title="Delete image"
      >
        <TrashIcon className="h-4 w-4 text-gray-500" />
      </button>
      {onReplace && (
        <button
          onClick={e => {
            e.stopPropagation();
            onReplace();
          }}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          title="Replace image"
        >
          <ArrowPathIcon className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  </div>
);

export default ImageRow; 