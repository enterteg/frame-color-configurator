import React from 'react';
import { TireWallColor } from '../../../types/bike';

interface TireWallSelectorProps {
  tireWallColor: TireWallColor;
  setTireWallColor: (color: TireWallColor) => void;
}

const TireWallSelector: React.FC<TireWallSelectorProps> = ({ tireWallColor, setTireWallColor }) => {
  return (
    <div className="border-b border-gray-100">
      <div className="w-full flex items-center justify-between px-4 py-4 transition-all duration-200 hover:bg-gray-50">
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-800">TIRE WALL</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTireWallColor('black')}
            className={`w-8 h-8 rounded-full border-2 ${
              tireWallColor === 'black' ? 'border-brand-brown-500' : 'border-gray-300'
            }`}
            style={{ backgroundColor: '#000000' }}
          />
          <button
            onClick={() => setTireWallColor('brown')}
            className={`w-8 h-8 rounded-full border-2 ${
              tireWallColor === 'brown' ? 'border-brand-brown-500' : 'border-gray-300'
            }`}
            style={{ backgroundColor: '#8b4513' }}
          />
          <button
            onClick={() => setTireWallColor('light_brown')}
            className={`w-8 h-8 rounded-full border-2 ${
              tireWallColor === 'light_brown' ? 'border-brand-brown-500' : 'border-gray-300'
            }`}
            style={{ backgroundColor: '#f2dc8c' }}
          />
          <button
            onClick={() => setTireWallColor('white')}
            className={`w-8 h-8 rounded-full border-2 ${
              tireWallColor === 'white' ? 'border-brand-brown-500' : 'border-gray-300'
            }`}
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TireWallSelector; 