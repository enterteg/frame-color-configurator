import React, { useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface UploadImageButtonProps {
  onFile: (file: File) => void;
  accept?: string;
  className?: string;
  title?: string;
  iconClassName?: string;
  onClick?: () => void;
}

const UploadImageButton: React.FC<UploadImageButtonProps> = ({ onFile, accept = 'image/*', className = '', title = 'Upload image', iconClassName, onClick }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFile(file);
    }
    // Reset input so the same file can be selected again
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button
        type="button"
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${className}`}
        title={title}
        onClick={handleClick}
      >
        <PlusIcon className={`${iconClassName || 'h-5 w-5'} text-brand-brown-700`} />
      </button>
    </>
  );
};

export { UploadImageButton as default };

 