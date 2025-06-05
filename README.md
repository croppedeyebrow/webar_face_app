# 👁️‍🗨 얼굴 감지 AR 웹앱 (Face Detection AR Web App)

React 기반으로 웹 브라우저에서 실시간 얼굴을 감지하고, 얼굴 위에 AR 이펙트를 렌더링하며, 자동으로 캡처 기능까지 제공하는 프로젝트입니다.

<br/>

## 🚀 프로젝트 개요

| 항목        | 내용                                               |
| ----------- | -------------------------------------------------- |
| 프로젝트명  | 얼굴 감지 AR 웹앱                                  |
| 핵심 기능   | 웹캠 기반 얼굴 인식 + 실시간 AR 이펙트 + 자동 캡처 |
| 기술 스택   | React (Vite), face-api.js, styled-components       |
| 대상 플랫폼 | Web (크로스 브라우징)                              |
| 목적        | 웹 브라우저만으로 얼굴 필터 및 AR 효과 제공        |

<br/>

## 🧩 주요 기능

- ✅ 웹캠을 통한 실시간 얼굴 인식
- ✅ 감지된 얼굴에 AR 요소 렌더링 (이미지, 이펙트 등)
- ✅ 10초 자동 타이머 후 얼굴 캡처 기능
- ✅ 캡처된 이미지 다운로드 또는 미리보기
- ✅ 반응형 UI 지원 (모바일/PC)

<br/>

## 🗂️ 폴더 구조

├── public/
│ └── models/ # face-api.js 모델 파일들
├── src/
│ ├── assets/ # 정적 자산 (이미지, 아이콘 등)
│ ├── components/ # 재사용 가능한 컴포넌트
│ │ ├── WebcamFeed.jsx # 웹캠 처리 + 얼굴 감지
│ │ ├── Overlay.jsx # AR 요소 렌더링
│ │ └── CaptureButton.jsx # 타이머 + 캡처 UI
│ ├── hooks/
│ │ └── useFaceDetection.jsx # 얼굴 인식 커스텀 훅
│ ├── utils/
│ │ └── loadModels.js # face-api 모델 로더
│ ├── styles/
│ │ └── GlobalStyle.jsx # 전역 스타일 정의
│ ├── App.jsx # 앱 메인 컴포넌트
│ └── main.jsx # 진입점
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── yarn.lock

<br/>

## ⚙️ 기술 스택

| 기술                  | 설명                                 |
| --------------------- | ------------------------------------ |
| **React + Vite**      | 빠른 빌드 환경 및 컴포넌트 기반 개발 |
| **styled-components** | CSS-in-JS로 컴포넌트별 스타일 관리   |
| **face-api.js**       | 경량화된 얼굴 인식 라이브러리        |
| **MediaDevices API**  | 브라우저에서 웹캠 접근 제어          |

<br/>

## 📸 캡처 기능 플로우

```plaintext
1. 사용자 웹캠 권한 허용
2. face-api.js로 얼굴 감지
3. 얼굴 좌표 기반 AR 이미지 렌더링
4. 얼굴 감지되면 10초 타이머 시작
5. 타이머 종료 시 자동 화면 캡처
6. 캡처된 이미지 다운로드 가능



## 💡 MVP 기능

| 기능                | 상태           |
| ----------------- | ------------ |
| 웹캠 실시간 스트리밍       | ✅            |
| 얼굴 Landmark 기반 인식 | ✅            |
| AR 이미지/효과 오버레이    | ✅            |
| 10초 타이머 후 자동 캡처   | ✅            |
| 이미지 다운로드 기능       | ✅            |
| 반응형 레이아웃          | ✅            |
| 사용자 선택 필터 UI      | ❌ (2차 버전 고려) |


## 📦 모델 파일 설정

아래 모델 파일을 수동으로 다운로드하고 public/models/ 경로에 배치해야 합니다.

- tiny_face_detector_model

- face_landmark_68_model

- face_recognition_model 등

🔗 공식 모델 다운로드 링크
<link>https://github.com/justadudewhohacks/face-api.js-models</link>


## 🛠️ 설치 및 실행 방법

### local.

1. 프로젝트 클론


git clone https://github.com/croppedeyebrow/webar_face_app.git
cd webar_face_app
```

2. 패키지지 설치

yarn install

```

3. 개발 서버 실행행


yarn dev
```

### 추후 배포 : Vercel?
