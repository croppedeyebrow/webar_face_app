// src/components/Overlay.jsx
import React from "react";
import styled from "styled-components";

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
  pointer-events: none;
`;

const ARItem = styled.div`
  position: absolute;
  width: 100px;
  height: 60px;
  background-image: url("../../public/assets/sunglasses.png");
  background-size: contain;
  background-repeat: no-repeat;
  transform: translate(-50%, -50%);
`;

function Overlay({ detections }) {
  if (!detections || detections.length === 0) return null;

  return (
    <OverlayContainer>
      {detections.map((det, idx) => {
        const { x, y, width } = det.box; // face-api의 detection.box 기준
        return (
          <ARItem
            key={idx}
            style={{
              left: `${x + width / 2}px`,
              top: `${y + width * 0.35}px`, // 눈 부위 위로 조정
            }}
          />
        );
      })}
    </OverlayContainer>
  );
}

export default Overlay;
