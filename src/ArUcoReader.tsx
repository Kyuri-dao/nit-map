import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { useOpenCv } from "./useOpenCv";

const ArUcoReader: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const isCvInitialized = useOpenCv();
  const [message, setMessage] = useState("Loading OpenCV...");
  const detectedDictTypeRef = useRef<number | null>(null); // 検出できた辞書タイプを記憶

  useEffect(() => {
    if (!isCvInitialized) {
      setMessage("Loading OpenCV...");
      return;
    }
    
    console.log("OpenCV initialized, starting ArUco detection");
    
    console.log("OpenCV initialized with ArUco support");
    
    setMessage("OpenCV loaded, waiting for camera...");

    const detectArUco = () => {
      if (!webcamRef.current) {
        console.log("webcamRef not ready");
        return;
      }

      const video = webcamRef.current.video;

      if (!video) {
        console.log("video element not ready");
        return;
      }

      // videoがまだ準備できていない場合はスキップ
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        console.log("video not ready, readyState:", video.readyState);
        return;
      }

      // videoのサイズが取得できない場合はスキップ
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.log("video size is 0");
        return;
      }

      console.log("Starting ArUco detection...");

      try {
        // 一時的なcanvasを作成（表示はしない）
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const ctx = tempCanvas.getContext('2d');
        
        if (!ctx) {
          console.error("Failed to get canvas context");
          return;
        }
        
        // ビデオフレームをcanvasに描画
        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // canvasからOpenCV Matを作成
        const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const src = window.cv.matFromImageData(imageData);
        
        console.log("Image loaded:", {
          width: src.cols,
          height: src.rows,
          type: src.type(),
          channels: src.channels()
        });
        
        // グレースケール変換
        const gray = new window.cv.Mat();
        window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
        
        console.log("Gray image:", {
          width: gray.cols,
          height: gray.rows,
          type: gray.type(),
          channels: gray.channels()
        });

        // ArUco検出（複数の辞書タイプを試す）
        const dictTypes = [
          { name: 'DICT_4X4_50', value: window.cv.DICT_4X4_50 },
          { name: 'DICT_4X4_100', value: window.cv.DICT_4X4_100 },
          { name: 'DICT_4X4_250', value: window.cv.DICT_4X4_250 },
          { name: 'DICT_5X5_50', value: window.cv.DICT_5X5_50 },
          { name: 'DICT_5X5_100', value: window.cv.DICT_5X5_100 },
          { name: 'DICT_5X5_250', value: window.cv.DICT_5X5_250 },
          { name: 'DICT_6X6_50', value: window.cv.DICT_6X6_50 },
          { name: 'DICT_6X6_100', value: window.cv.DICT_6X6_100 },
          { name: 'DICT_6X6_250', value: window.cv.DICT_6X6_250 },
          { name: 'DICT_7X7_50', value: window.cv.DICT_7X7_50 },
          { name: 'DICT_7X7_100', value: window.cv.DICT_7X7_100 },
          { name: 'DICT_7X7_250', value: window.cv.DICT_7X7_250 },
          { name: 'DICT_ARUCO_ORIGINAL', value: window.cv.DICT_ARUCO_ORIGINAL }
        ];

        // 既に検出できた辞書タイプがあればそれを使用、なければ全て試す
        const typesToTry = detectedDictTypeRef.current 
          ? [{ name: 'Detected', value: detectedDictTypeRef.current }]
          : dictTypes;

        let foundMarkers = false;
        const detectedIds: number[] = [];
        let usedDictName = '';

        for (const dictType of typesToTry) {
          try {
            const dictionary = window.cv.getPredefinedDictionary(dictType.value);
            const parameters = new window.cv.aruco_DetectorParameters();
            
            let detector;
            try {
              detector = new window.cv.aruco_ArucoDetector(dictionary, parameters);
            } catch {
              const refineParams = new window.cv.aruco_RefineParameters(10, 3.0, true);
              detector = new window.cv.aruco_ArucoDetector(dictionary, parameters, refineParams);
            }
            
            const markerCorners = new window.cv.MatVector();
            const markerIds = new window.cv.Mat();

            detector.detectMarkers(gray, markerCorners, markerIds);
            
            if (markerIds.rows > 0) {
              // マーカーが検出された
              foundMarkers = true;
              usedDictName = dictType.name;
              
              // 初回検出時に辞書タイプを記憶
              if (!detectedDictTypeRef.current) {
                detectedDictTypeRef.current = dictType.value;
                console.log(`Dictionary type detected: ${dictType.name}`);
              }
              
              const data32S = markerIds.data32S;
              for (let i = 0; i < markerIds.rows; i++) {
                detectedIds.push(data32S[i]);
              }
              
              markerCorners.delete();
              markerIds.delete();
              detector.delete();
              break;
            }
            
            markerCorners.delete();
            markerIds.delete();
            detector.delete();
          } catch (e) {
            console.error(`Error with ${dictType.name}:`, e);
          }
        }

        if (foundMarkers) {
          setMessage(`検出されたマーカー (${usedDictName}): ${detectedIds.join(", ")}`);
          console.log("Detected marker IDs:", detectedIds);
        } else {
          setMessage("マーカーが検出されませんでした");
        }

        // メモリ解放
        src.delete();
        gray.delete();
      } catch (error) {
        console.error("Error in ArUco detection:", error);
        setMessage(`エラー: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    const interval = setInterval(detectArUco, 100);

    return () => clearInterval(interval);
  }, [isCvInitialized]);

  const videoConstraints = {
    facingMode: "enviroment",
  }

  return (
    <div className="text-white">
      <Webcam ref={webcamRef} style={{ width: "100%", height: "auto" }} videoConstraints={videoConstraints} audio={false} />
      <p className="text-center font-black">{message}</p>
    </div>
  );
};

export default ArUcoReader;