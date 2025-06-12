import { useEffect, useRef, useState } from "react";

export const useWebcam = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isStreamReady, setIsStreamReady] = useState(false);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        console.log("웹캠 스트림 요청 시작...");

        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
            frameRate: { ideal: 30 },
          },
        };

        console.log("웹캠 제약 조건:", constraints);

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        console.log("웹캠 스트림 획득 성공");
        console.log("스트림 설정:", {
          width: stream.getVideoTracks()[0].getSettings().width,
          height: stream.getVideoTracks()[0].getSettings().height,
          frameRate: stream.getVideoTracks()[0].getSettings().frameRate,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .then(() => {
              console.log("비디오 재생 시작");
              setIsStreamReady(true);
            })
            .catch((err) => {
              console.error("비디오 재생 실패:", err);
              setError("비디오 재생 중 오류가 발생했습니다.");
            });
        }
      } catch (err) {
        console.error("웹캠 스트림 획득 실패:", err);
        setError(
          err.name === "NotAllowedError"
            ? "카메라 접근 권한이 거부되었습니다."
            : "웹캠을 시작하는 중 오류가 발생했습니다."
        );
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        console.log("웹캠 스트림 정리 중...");
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
          console.log("트랙 정지됨:", track.kind);
        });
        videoRef.current.srcObject = null;
        setIsStreamReady(false);
      }
    };
  }, []);

  return { videoRef, error, isStreamReady };
};
