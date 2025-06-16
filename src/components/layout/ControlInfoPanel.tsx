import { 
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export const ControlInfoPanel = () => {
  return (
    <div className="fixed top-4 right-4 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[9999] pointer-events-none">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <ArrowPathIcon className="w-4 h-4" />
          <span>Click + drag to rotate</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <ArrowsPointingOutIcon className="w-4 h-4" />
          <span>Shift + drag to pan</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <MagnifyingGlassIcon className="w-4 h-4" />
          <span>Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};

export default ControlInfoPanel; 