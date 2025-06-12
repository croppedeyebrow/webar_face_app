import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import WebcamFeed from "../components/WebcamFeed.jsx";
import Overlay from "../components/Overlay.jsx";
import CaptureButton from "../components/CaptureButton.jsx";
import useFaceDetection from "../hooks/userFaceDetection.jsx";

const Container = styled.div`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  margin: 0 auto;
  border: 2px solid #333;
  border-radius: 12px;
  overflow: hidden;
  background-color: #000;
`;

const FaceARPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState(null);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });
  const [captureTrigger, setCaptureTrigger] = useState(false);

  const faceDetections = useFaceDetection(videoRef);

  useEffect(() => {
    if (faceDetections) {
      setDetections(faceDetections);
    }
  }, [faceDetections]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setVideoSize({
          width: video.videoWidth || 640,
          height: video.videoHeight || 480,
        });
      };
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () =>
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }
  }, []);

  return (
    <>
      <Container width={videoSize.width} height={videoSize.height}>
        <WebcamFeed videoRef={videoRef} />
        <Overlay
          videoRef={videoRef}
          canvasRef={canvasRef}
          detections={detections}
          captureTrigger={captureTrigger}
          setCaptureTrigger={setCaptureTrigger}
        />
      </Container>
      <CaptureButton onCapture={() => setCaptureTrigger(true)} />
    </>
  );
};

export default FaceARPage;
