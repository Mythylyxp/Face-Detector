import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as faceapi from 'face-api.js';
import { format } from 'date-fns';

interface DetectedFace {
  timestamp: string;
  imageUrl: string;
}

interface CameraContextType {
  isCameraOn: boolean;
  toggleCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isModelLoaded: boolean;
  faceDetected: boolean;
  isLoading: boolean;
  detectedFaces: DetectedFace[];
  faceCount: number;
  captureFace: () => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraContext must be used within a CameraProvider');
  }
  return context;
};

interface CameraProviderProps {
  children: ReactNode;
}

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [faceCount, setFaceCount] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        ]);
        setIsModelLoaded(true);
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const imageUrl = canvas.toDataURL('image/jpeg');
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    setDetectedFaces(prev => [...prev, { timestamp, imageUrl }]);
  };

  useEffect(() => {
    let detectionInterval: number | null = null;

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current || !isModelLoaded || !isCameraOn) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) return;
      
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      try {
        const detections = await faceapi.detectAllFaces(
          video, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks();

        const hasDetections = detections.length > 0;
        setFaceDetected(hasDetections);
        setFaceCount(detections.length);

        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        if (resizedDetections.length > 0) {
          resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { 
              boxColor: '#10b981', 
              lineWidth: 2,
              drawLabelOptions: {
                anchorPosition: 'BOTTOM_CENTER',
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                fontColor: 'white',
                fontSize: 14,
                padding: 5
              }
            });
            drawBox.draw(canvas);
          });
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    };

    if (isCameraOn && isModelLoaded) {
      detectionInterval = window.setInterval(detectFaces, 100) as unknown as number;
    }

    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, [isCameraOn, isModelLoaded]);

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraOn(false);
      setFaceDetected(false);
      setFaceCount(0);
    } else {
      try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsCameraOn(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const value = {
    isCameraOn,
    toggleCamera,
    videoRef,
    canvasRef,
    isModelLoaded,
    faceDetected,
    isLoading,
    detectedFaces,
    faceCount,
    captureFace
  };

  return <CameraContext.Provider value={value}>{children}</CameraContext.Provider>;
};