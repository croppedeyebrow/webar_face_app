const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("이미지 로드 실패:", src, e);
      reject(e);
    };
    img.src = src;
  });
};

export const renderFilter = async (ctx, detection, filterId) => {
  if (!detection) return;

  const landmarks = detection.landmarks;
  const positions = landmarks.positions;

  // 얼굴 회전 각도 계산
  const calculateRotation = (point1, point2) => {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
  };

  // 얼굴 크기에 따른 스케일 계산
  const calculateScale = (width, baseScale = 1) => {
    return (width / 200) * baseScale; // 200은 기준 얼굴 너비
  };

  switch (filterId) {
    case "sunglass": {
      try {
        const glassesImg = await loadImage("/ar_items/sunglass.png");

        // 눈의 랜드마크 포인트
        const leftEyePoints = positions.slice(36, 42);
        const rightEyePoints = positions.slice(42, 48);

        // 눈의 중심점 계산
        const leftEyeCenter = {
          x: leftEyePoints.reduce((sum, p) => sum + p.x, 0) / 6,
          y: leftEyePoints.reduce((sum, p) => sum + p.y, 0) / 6,
        };
        const rightEyeCenter = {
          x: rightEyePoints.reduce((sum, p) => sum + p.x, 0) / 6,
          y: rightEyePoints.reduce((sum, p) => sum + p.y, 0) / 6,
        };

        // 눈 사이의 거리와 회전 각도 계산
        const eyeDistance = Math.sqrt(
          Math.pow(rightEyeCenter.x - leftEyeCenter.x, 2) +
            Math.pow(rightEyeCenter.y - leftEyeCenter.y, 2)
        );
        const angle = calculateRotation(leftEyeCenter, rightEyeCenter);

        // 스케일 계산
        const scale = calculateScale(eyeDistance, 2.2);
        const glassesWidth = eyeDistance * scale;
        const glassesHeight =
          (glassesWidth * glassesImg.height) / glassesImg.width;

        // 안경 위치 (눈의 중심점 기준)
        const centerX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
        const centerY = (leftEyeCenter.y + rightEyeCenter.y) / 2;

        // 안경 그리기
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.drawImage(
          glassesImg,
          -glassesWidth / 2,
          -glassesHeight / 2,
          glassesWidth,
          glassesHeight
        );
        ctx.restore();
      } catch (error) {
        console.error("선글라스 이미지 로드 실패:", error);
      }
      break;
    }

    case "hat": {
      try {
        const hatImg = await loadImage("/ar_items/hat.png");

        // 얼굴 상단 포인트들
        const leftTemple = positions[0]; // 왼쪽 관자놀이
        const rightTemple = positions[16]; // 오른쪽 관자놀이
        const topHead = positions[24]; // 머리 상단

        // 얼굴 너비와 회전 각도 계산
        const faceWidth = Math.sqrt(
          Math.pow(rightTemple.x - leftTemple.x, 2) +
            Math.pow(rightTemple.y - leftTemple.y, 2)
        );
        const angle = calculateRotation(leftTemple, rightTemple);

        // 스케일 계산
        const scale = calculateScale(faceWidth, 1.5);
        const hatWidth = faceWidth * scale;
        const hatHeight = (hatWidth * hatImg.height) / hatImg.width;

        // 모자 위치 계산 (이마 위 지점 기준)
        const offsetY = hatHeight * 0.7; // 모자가 이마 위로 올라가는 정도

        // 모자 그리기
        ctx.save();
        ctx.translate(topHead.x, topHead.y - offsetY);
        ctx.rotate(angle);
        ctx.drawImage(
          hatImg,
          -hatWidth / 2,
          -hatHeight / 2,
          hatWidth,
          hatHeight
        );
        ctx.restore();
      } catch (error) {
        console.error("모자 이미지 로드 실패:", error);
      }
      break;
    }

    default:
      break;
  }
};
