import React from 'react';
import { Camera, CameraOff, RefreshCw, Camera as CameraIcon } from 'lucide-react';
import { useCameraContext } from '../context/CameraContext';
import { useThemeContext } from '../context/ThemeContext';

const Controls: React.FC = () => {
  const { isCameraOn, toggleCamera, isLoading, captureFace } = useCameraContext();
  const { isDarkMode } = useThemeContext();

  return (
    <div className="flex justify-center space-x-4 mt-6">
      <button
        onClick={toggleCamera}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
          isCameraOn 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {isCameraOn ? (
              <>
                <CameraOff className="w-5 h-5" />
                <span>Stop Camera</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Start Camera</span>
              </>
            )}
          </>
        )}
      </button>

      {isCameraOn && (
        <button
          onClick={captureFace}
          className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
            isDarkMode 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          <CameraIcon className="w-5 h-5" />
          <span>Capture Face</span>
        </button>
      )}
    </div>
  );
};

export default Controls;