import * as faceapi from 'face-api.js';

// Load required face-api.js models
export const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    ]);
    return true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    return false;
  }
};

// Detect faces in video stream
export const detectFaces = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): Promise<boolean> => {
  if (!video || !canvas || video.paused || video.ended) {
    return false;
  }

  // Make sure video dimensions are set
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    return false;
  }

  // Set canvas dimensions to match video
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  try {
    // Detect faces
    const detections = await faceapi.detectAllFaces(
      video, 
      new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 320,
        scoreThreshold: 0.5
      })
    ).withFaceLandmarks();

    // Clear previous drawings
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw detections
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    // Draw face boxes with custom style
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
        
        // Draw face landmarks
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      });
      
      return true; // Face detected
    }
    
    return false; // No face detected
  } catch (error) {
    console.error('Face detection error:', error);
    return false;
  }
};