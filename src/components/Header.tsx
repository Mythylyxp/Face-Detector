import React from 'react';
import { Camera, CameraOff, Loader2, Sun, Moon } from 'lucide-react';
import { useCameraContext } from '../context/CameraContext';
import { useThemeContext } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { isCameraOn, toggleCamera, faceDetected, isLoading, faceCount } = useCameraContext();
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <header className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 p-2 rounded-full">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            FaceTrack Pro
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Face count */}
          {isCameraOn && (
            <div className="text-sm">
              <span className="font-semibold">{faceCount}</span> {faceCount === 1 ? 'face' : 'faces'} detected
            </div>
          )}
          
          {/* Face detection status indicator */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${faceDetected ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
            <span className="text-sm">
              {faceDetected ? 'Face Detected' : 'No Face Detected'}
            </span>
          </div>
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          {/* Camera toggle button */}
          <button
            onClick={toggleCamera}
            disabled={isLoading}
            className={`p-2 rounded-full flex items-center justify-center transition-colors ${
              isCameraOn 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-emerald-500 hover:bg-emerald-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            ) : isCameraOn ? (
              <CameraOff className="h-5 w-5 text-white" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;