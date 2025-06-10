import React, { useRef } from "react";
import WebcamFeed from "../components/WebcamFeed.jsx";
import Overlay from "../components/Overlay.jsx";
import CaptureButton from "../components/CaptureButton.jsx";

const FaceARPage = () => {
  const webcamRef = useRef(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        // 다운로드 방식 or 상태로 저장
        const link = document.createElement("a");
        link.href = screenshot;
        link.download = "face_capture.png";
        link.click();
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <WebcamFeed webcamRef={webcamRef} />
      <Overlay />
      <CaptureButton onCapture={handleCapture} />
    </div>
  );
};

export default FaceARPage;
