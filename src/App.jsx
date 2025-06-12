import { useEffect, useState, useCallback } from "react";
import { useWebcam } from "./hooks/useWebcam.jsx";
import { useFaceDetection } from "./hooks/useFaceDetection.jsx";
import { FilterControls } from "./components/FilterControls";
import { renderFilter } from "./utils/filterRenderer";

function App() {
  const { videoRef, error: webcamError, isStreamReady } = useWebcam();

  const { canvasRef, isModelLoaded, detections, startFaceDetection } =
    useFaceDetection(videoRef);

  const [selectedFilter, setSelectedFilter] = useState("none");

  useEffect(() => {
    if (isStreamReady && isModelLoaded) {
      console.log("얼굴 감지 시작");
      const cleanup = startFaceDetection();
      return cleanup;
    }
  }, [isStreamReady, isModelLoaded, startFaceDetection]);

  const renderFilters = useCallback(async () => {
    if (!canvasRef.current) {
      console.log("캔버스가 준비되지 않음");
      return;
    }

    if (!detections) {
      console.log("감지된 얼굴 없음");
      return;
    }

    if (!detections.length) {
      console.log("감지된 얼굴 배열이 비어있음");
      return;
    }

    console.log("필터 렌더링 시작:", {
      selectedFilter,
      detectionsCount: detections.length,
      canvasSize: {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      },
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 필터가 선택된 경우에만 캔버스를 클리어
    if (selectedFilter !== "none") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try {
        await Promise.all(
          detections.map((detection) =>
            renderFilter(ctx, detection, selectedFilter)
          )
        );
        console.log("필터 렌더링 완료");
      } catch (error) {
        console.error("필터 렌더링 중 오류:", error);
      }
    }
  }, [detections, selectedFilter]);

  useEffect(() => {
    renderFilters();
  }, [renderFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                WebAR Face Filter
              </h1>

              {webcamError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8">
                  <p className="font-medium">웹캠 접근 오류: {webcamError}</p>
                  <p className="text-sm mt-1">카메라 권한을 확인해주세요.</p>
                </div>
              )}

              {!isModelLoaded && (
                <div className="text-center mb-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
                  <p className="text-gray-600 mt-2">모델 로딩 중...</p>
                </div>
              )}

              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute top-0 left-0 w-full h-full object-contain"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>

              {isStreamReady && isModelLoaded && (
                <div className="mt-8">
                  <FilterControls
                    selectedFilter={selectedFilter}
                    onFilterChange={setSelectedFilter}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
