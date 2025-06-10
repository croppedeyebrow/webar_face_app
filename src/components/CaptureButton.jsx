import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const Countdown = styled.div`
  position: absolute;
  bottom: 5.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: white;
  font-weight: bold;
  z-index: 10;
`;

const CaptureButton = ({ onCapture }) => {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      onCapture(); // 부모에게 캡처 트리거 신호 전달
      setCountdown(null); // 초기화
    }
    return () => clearTimeout(timer);
  }, [countdown, onCapture]);

  const handleClick = () => {
    setCountdown(10); // 10초 타이머 시작
  };

  return (
    <>
      {countdown !== null && <Countdown>{countdown}</Countdown>}
      <Button onClick={handleClick}>
        {countdown === null ? "📸 캡처 시작" : "⏱ 진행 중..."}
      </Button>
    </>
  );
};

export default CaptureButton;
