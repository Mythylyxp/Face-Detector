import React, { useEffect } from 'react';
import { useCameraContext } from '../context/CameraContext';
import { Camera as CameraIcon, Loader2 } from 'lucide-react';

const Camera: React.FC = () => {
  const { 
    videoRef, 
    canvasRef, 
    isCameraOn, 
    toggleCamera, 
    isModelLoaded, 
    faceDetected,
    isLoading 
  } = useCameraContext();

  useEffect(() => {
    const handleVideoPlay = () => {
      console.log('Video is playing');
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('play', handleVideoPlay);
    }

    return () => {
      if (video) {
        video.removeEventListener('play', handleVideoPlay);
      }
    };
  }, [videoRef]);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-gray-700">
        {!isCameraOn && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 z-10">
            <CameraIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Camera is turned off</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Click the camera button to enable face detection
            </p>
            <button
              onClick={toggleCamera}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors flex items-center space-x-2"
            >
              <CameraIcon className="w-5 h-5" />
              <span>Turn on camera</span>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
              <p className="text-gray-300">
                {isModelLoaded ? 'Starting camera...' : 'Loading face detection models...'}
              </p>
            </div>
          </div>
        )}

        {/* Status indicator (mobile only) */}
        {isCameraOn && (
          <div className="absolute top-2 right-2 sm:hidden flex items-center space-x-1 bg-gray-900 bg-opacity-70 px-2 py-1 rounded-full z-20">
            <div className={`h-2 w-2 rounded-full ${faceDetected ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
            <span className="text-xs text-gray-300">
              {faceDetected ? 'Face Detected' : 'No Face'}
            </span>
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ display: isCameraOn ? 'block' : 'none' }}
        />

        {/* Canvas overlay for drawing face detection */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ display: isCameraOn ? 'block' : 'none' }}
        />
      </div>

      {isCameraOn && (
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            {isModelLoaded 
              ? 'Face detection is active. Look at the camera to detect your face.' 
              : 'Loading face detection models...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Camera;