import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

// Vite 환경에서는 public 폴더의 경로를 사용
const MODEL_URL = "/models";

export const useFaceDetection = (videoRef) => {
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detections, setDetections] = useState(null);
  const previousTimeRef = useRef();
  const animationFrameRef = useRef();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const detectionsRef = useRef(detections);

  // 디바운스 함수
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // 디바운스된 setDetections
  const debouncedSetDetections = useCallback(
    debounce((newDetections) => {
      if (
        JSON.stringify(detectionsRef.current) !== JSON.stringify(newDetections)
      ) {
        detectionsRef.current = newDetections;
        setDetections(newDetections);
      }
    }, 100),
    []
  );

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("모델 로드 시도...");

        // 모델 파일 경로 확인
        const modelPaths = {
          tinyFaceDetector: `${MODEL_URL}/tiny_face_detector/model.json`,
          faceLandmark68: `${MODEL_URL}/face_landmark_68/model.json`,
        };

        console.log("모델 파일 경로:", modelPaths);

        // 모델 로드 전에 이미 로드되었는지 확인
        if (faceapi.nets.tinyFaceDetector.isLoaded) {
          console.log("TinyFaceDetector가 이미 로드되어 있음");
        }
        if (faceapi.nets.faceLandmark68Net.isLoaded) {
          console.log("FaceLandmark68Net이 이미 로드되어 있음");
        }

        // 모델 로드
        await Promise.all([
          faceapi.nets.tinyFaceDetector.load(MODEL_URL),
          faceapi.nets.faceLandmark68Net.load(MODEL_URL),
        ]);

        // 모델 로드 확인
        const isTinyFaceDetectorLoaded = faceapi.nets.tinyFaceDetector.isLoaded;
        const isFaceLandmarkLoaded = faceapi.nets.faceLandmark68Net.isLoaded;

        console.log("TinyFaceDetector 로드 상태:", isTinyFaceDetectorLoaded);
        console.log("FaceLandmark68 로드 상태:", isFaceLandmarkLoaded);

        if (isTinyFaceDetectorLoaded && isFaceLandmarkLoaded) {
          setIsModelLoaded(true);
          console.log("모든 모델 로드 완료");
        } else {
          console.error("일부 모델이 로드되지 않음");
        }
      } catch (error) {
        console.error("모델 로드 오류:", error);
        console.log("시도한 모델 경로:", MODEL_URL);
      }
    };

    loadModels();
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;

    console.log("비디오 메타데이터 로드됨");
    const video = videoRef.current;
    const newDisplaySize = {
      width: video.videoWidth,
      height: video.videoHeight,
    };
    console.log("비디오 크기:", newDisplaySize);

    setDisplaySize(newDisplaySize);
    setIsVideoReady(true);

    // 캔버스 크기도 여기서 설정
    if (canvasRef.current) {
      canvasRef.current.width = newDisplaySize.width;
      canvasRef.current.height = newDisplaySize.height;
      faceapi.matchDimensions(canvasRef.current, newDisplaySize);
      console.log("캔버스 크기 설정 완료");
    }
  }, [videoRef]);

  const handleResize = useCallback(() => {
    if (videoRef.current && videoRef.current.videoWidth) {
      handleLoadedMetadata();
    }
  }, [handleLoadedMetadata]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    window.addEventListener("resize", handleResize);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      window.removeEventListener("resize", handleResize);
    };
  }, [videoRef, handleLoadedMetadata, handleResize]);

  const detectFace = useCallback(
    async (video, canvas, currentTime) => {
      if (!video || !canvas || video.readyState !== 4) return false;

      // 프레임 제한 (60fps)
      if (
        previousTimeRef.current &&
        currentTime - previousTimeRef.current < 16.7
      ) {
        return false;
      }

      try {
        // TinyFaceDetector 옵션 조정
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 320, // 기본값 160에서 증가
          scoreThreshold: 0.3, // 기본값 0.5에서 감소
        });

        const detectedFaces = await faceapi
          .detectAllFaces(video, options)
          .withFaceLandmarks();

        console.log("감지된 얼굴 수:", detectedFaces.length);

        if (detectedFaces && detectedFaces.length > 0) {
          const resizedDetections = faceapi.resizeResults(
            detectedFaces,
            displaySize
          );
          debouncedSetDetections(resizedDetections);
        }
      } catch (error) {
        console.error("얼굴 감지 오류:", error);
      }

      previousTimeRef.current = currentTime;
      return true;
    },
    [displaySize, debouncedSetDetections]
  );

  const startFaceDetection = useCallback(() => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !isModelLoaded ||
      !isVideoReady
    ) {
      console.log("얼굴 감지 시작 조건이 충족되지 않음");
      console.log({
        videoReady: !!videoRef.current,
        canvasReady: !!canvasRef.current,
        modelLoaded: isModelLoaded,
        videoStreamReady: isVideoReady,
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const animate = async (currentTime) => {
      await detectFace(video, canvas, currentTime);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isModelLoaded, isVideoReady, detectFace]);

  return {
    canvasRef,
    isModelLoaded,
    detections,
    startFaceDetection,
    isVideoReady,
    displaySize,
  };
};
