import React from 'react';
import { CameraProvider } from './context/CameraContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Camera from './components/Camera';
import Controls from './components/Controls';
import DetectedFaces from './components/DetectedFaces';

function App() {
  return (
    <ThemeProvider>
      <CameraProvider>
        <div className="min-h-screen transition-colors duration-200 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:text-white bg-gradient-to-b from-gray-50 to-white text-gray-900">
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Real-time Face Detection</h2>
                <p className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto">
                  FaceTrack Pro uses advanced AI to detect faces in real-time. 
                  Enable your camera to see it in action.
                </p>
              </div>
              
              <Camera />
              <Controls />
              <DetectedFaces />
              
              <div className="mt-12 dark:bg-gray-800 bg-gray-100 rounded-lg p-6 shadow-lg dark:border dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-emerald-400">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="dark:bg-gray-900 bg-white p-4 rounded-lg">
                    <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <span className="font-bold text-white">1</span>
                    </div>
                    <h4 className="font-medium mb-2">Enable Camera</h4>
                    <p className="dark:text-gray-400 text-gray-600 text-sm">
                      Click the camera button to grant access to your device's camera
                    </p>
                  </div>
                  <div className="dark:bg-gray-900 bg-white p-4 rounded-lg">
                    <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <span className="font-bold text-white">2</span>
                    </div>
                    <h4 className="font-medium mb-2">Face Detection</h4>
                    <p className="dark:text-gray-400 text-gray-600 text-sm">
                      The app automatically detects faces in the video stream
                    </p>
                  </div>
                  <div className="dark:bg-gray-900 bg-white p-4 rounded-lg">
                    <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <span className="font-bold text-white">3</span>
                    </div>
                    <h4 className="font-medium mb-2">Real-time Tracking</h4>
                    <p className="dark:text-gray-400 text-gray-600 text-sm">
                      Green boxes highlight detected faces with real-time tracking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
          <footer className="dark:bg-gray-900 bg-gray-100 py-6 mt-12">
            <div className="container mx-auto px-4 text-center dark:text-gray-400 text-gray-600 text-sm">
              <p>© 2025 FaceTrack Pro. All processing happens locally in your browser for privacy.</p>
            </div>
          </footer>
        </div>
      </CameraProvider>
    </ThemeProvider>
  );
}

export default App;