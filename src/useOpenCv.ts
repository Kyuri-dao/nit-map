import { useState, useEffect } from "react";

export function useOpenCv(): boolean {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // OpenCV.jsが既にロード済みかチェック
        const checkOpenCV = () => {
            return window.cv && window.cv.Mat !== undefined;
        };

        // OpenCV.jsのロード完了を監視
        const handleLoad = () => {
            console.log("OpenCV.js loaded successfully!");
            setIsLoaded(true);
        };

        if (checkOpenCV()) {
            console.log("OpenCV.js is already loaded");
            handleLoad();
            return;
        }

        console.log("Waiting for OpenCV.js to load...");

        // Module.onRuntimeInitializedでロード完了を検知
        if (!window.Module) {
            window.Module = {};
        }
        window.Module.onRuntimeInitialized = handleLoad;

        // フォールバック: ポーリングでチェック
        const interval = setInterval(() => {
            if (checkOpenCV()) {
                console.log("OpenCV.js detected via polling");
                clearInterval(interval);
                handleLoad();
            }
        }, 100);

        // タイムアウト: 10秒経っても読み込めなかったらエラー
        const timeout = setTimeout(() => {
            if (!checkOpenCV()) {
                console.error("Failed to load OpenCV.js after 10 seconds");
                clearInterval(interval);
            }
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return isLoaded;
}