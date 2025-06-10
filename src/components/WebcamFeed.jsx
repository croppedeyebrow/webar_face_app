import React from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

const VideoContainer = styled.div`
  width: 100%;
  height: auto;
  position: relative;
`;

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const WebcamFeed = ({ webcamRef }) => {
  return (
    <VideoContainer>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
        style={{
          width: "100%",
          borderRadius: "10px",
        }}
      />
    </VideoContainer>
  );
};

export default WebcamFeed;
