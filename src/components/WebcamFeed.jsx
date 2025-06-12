import React, { useEffect } from "react";
import styled from "styled-components";

const Video = styled.video`
  width: 100%;
  height: auto;
  border-radius: 10px;
  background-color: black;
`;

const WebcamFeed = ({ videoRef }) => {
  useEffect(() => {
    const getWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    getWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoRef]);

  return <Video ref={videoRef} autoPlay muted playsInline />;
};

export default WebcamFeed;
