import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { useOpenCv } from "./useOpenCv";

const ArUcoReader: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isCvInitialized = useOpenCv();
  const [message, setMessage] = useState("Loading OpenCV...");

  useEffect(() => {
    if (!isCvInitialized) return;
    
    console.log("OpenCV initialized, starting ArUco detection");
    setMessage("OpenCV loaded, waiting for camera...");

    const detectArUco = () => {
      if (!webcamRef.current || !canvasRef.current) return;

      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!video || !ctx) return;

      // OpenCVで画像を取得
      const src = new window.cv.Mat(video.videoHeight, video.videoWidth, window.cv.CV_8UC4);
      const cap = new window.cv.VideoCapture(video);

      cap.read(src);

      // グレースケール変換
      const gray = new window.cv.Mat();
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

      // ArUco検出
      const dictionary = new window.cv.Dictionary(window.cv.DICT_6X6_250);
      const parameters = new window.cv.DetectorParameters();
      const markerCorners = new window.cv.MatVector();
      const markerIds = new window.cv.Mat();

      window.cv.detectMarkers(gray, dictionary, markerCorners, markerIds, parameters);

      // 検出結果を描画
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (markerIds.rows > 0) {
        window.cv.drawDetectedMarkers(src, markerCorners, markerIds);
        setMessage(`Detected markers: ${markerIds.rows}`);
      } else {
        setMessage("No markers detected");
      }

      // メモリ解放
      src.delete();
      gray.delete();
      markerCorners.delete();
      markerIds.delete();
    };

    const interval = setInterval(detectArUco, 100);

    return () => clearInterval(interval);
  }, [isCvInitialized]);

  return (
    <div>
      <Webcam ref={webcamRef} style={{ width: "100%", height: "auto" }} />
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
      <p>{message}</p>
    </div>
  );
};

export default ArUcoReader;