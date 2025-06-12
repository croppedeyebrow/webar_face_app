// src/utils/loadModels.js
import * as faceapi from "face-api.js";

export const loadModels = async () => {
  const MODEL_URL = import.meta.env.BASE_URL + "/models";
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(
      `${MODEL_URL}/tiny_face_detector_model`
    ),
    faceapi.nets.faceLandmark68Net.loadFromUri(
      `${MODEL_URL}/face_landmark_68_model`
    ),
  ]);
};

// faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
// 얼굴이 영상에 있는지 감지 (탐지)
// 즉, 프레임 안에 얼굴이 어디 있는지를 찾아주는 기능.

// faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
// 감지된 얼굴 위의 주요 포인트(landmarks)를 예측
// 예: 눈, 코, 입, 턱, 눈썹, 광대뼈 등 총 68개의 좌표
