import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const Overlay = ({
  videoRef,
  detections,
  captureTrigger,
  setCaptureTrigger,
  videoWidth,
  videoHeight,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || !detections) return;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🟢 랜드마크 점 찍기
    detections.landmarks.positions.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 255, 0, 0.6)";
      ctx.fill();
    });

    // 🎭 AR 요소 예시: 눈 위에 안경 이미지 등 렌더링 (임시 예시)
    // const leftEye = detections.landmarks.getLeftEye(); // 필요 시

    // 📸 캡처 트리거 처리
    if (captureTrigger) {
      const snapshot = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = snapshot;
      link.download = "face_ar_capture.png";
      link.click();

      // 트리거 리셋
      setCaptureTrigger(false);
    }
  }, [
    detections,
    captureTrigger,
    videoWidth,
    videoHeight,
    setCaptureTrigger,
    videoRef,
  ]);

  return <Canvas ref={canvasRef} />;
};

export default Overlay;
