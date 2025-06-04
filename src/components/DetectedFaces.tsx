import React from 'react';
import { useCameraContext } from '../context/CameraContext';
import { useThemeContext } from '../context/ThemeContext';

const DetectedFaces: React.FC = () => {
  const { detectedFaces } = useCameraContext();
  const { isDarkMode } = useThemeContext();

  if (detectedFaces.length === 0) return null;

  return (
    <div className={`mt-8 p-6 rounded-lg ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      <h3 className={`text-xl font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Captured Faces ({detectedFaces.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {detectedFaces.map((face, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            } shadow-lg`}
          >
            <img
              src={face.imageUrl}
              alt={`Captured face ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Captured at: {face.timestamp}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectedFaces;