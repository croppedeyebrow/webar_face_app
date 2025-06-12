import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const TimerText = styled.div`
  margin-top: 8px;
  font-size: 1rem;
  color: #333;
  text-align: center;
`;

const CaptureButton = ({ onCapture }) => {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    let timerId;

    if (countdown !== null && countdown > 0) {
      timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      onCapture();
      setCountdown(null);
    }

    return () => clearTimeout(timerId);
  }, [countdown, onCapture]);

  const handleClick = () => {
    if (countdown === null) {
      setCountdown(10); // 10초 타이머 시작
    }
  };

  return (
    <>
      <Button onClick={handleClick} disabled={countdown !== null}>
        {countdown === null ? "Capture in 10s" : `Capturing in ${countdown}s`}
      </Button>
      {countdown !== null && (
        <TimerText>사진이 {countdown}초 후에 캡처됩니다.</TimerText>
      )}
    </>
  );
};

export default CaptureButton;
