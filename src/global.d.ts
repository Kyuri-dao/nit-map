interface OpenCVMat {
    delete(): void;
    rows: number;
    cols: number;
}

interface OpenCV {
    getBuildInformation?: () => string;
    getBuildInfomation?: () => string; // typo in OpenCV.js
    
    // Mat class
    Mat: new (...args: any[]) => OpenCVMat;
    
    // Video capture
    VideoCapture: new (video: HTMLVideoElement) => {
        read(mat: OpenCVMat): void;
        delete(): void;
    };
    
    // ArUco detection
    MatVector: new () => {
        delete(): void;
        size(): number;
    };
    Dictionary: new (type: number) => {
        delete(): void;
    };
    DetectorParameters: new () => {
        delete(): void;
    };
    
    // ArUco functions
    detectMarkers: (
        image: OpenCVMat,
        dictionary: any,
        corners: any,
        ids: OpenCVMat,
        parameters: any
    ) => void;
    drawDetectedMarkers: (
        image: OpenCVMat,
        corners: any,
        ids: OpenCVMat
    ) => void;
    
    // Color conversion
    cvtColor: (src: OpenCVMat, dst: OpenCVMat, code: number) => void;
    
    // Constants
    COLOR_RGBA2GRAY: number;
    CV_8UC4: number;
    DICT_6X6_250: number;
    DICT_4X4_50: number;
    DICT_4X4_100: number;
    DICT_4X4_250: number;
    DICT_4X4_1000: number;
    DICT_5X5_50: number;
    DICT_5X5_100: number;
    DICT_5X5_250: number;
    DICT_5X5_1000: number;
    DICT_6X6_50: number;
    DICT_6X6_100: number;
    DICT_6X6_1000: number;
    DICT_7X7_50: number;
    DICT_7X7_100: number;
    DICT_7X7_250: number;
    DICT_7X7_1000: number;
}

declare interface Window {
    cv: OpenCV;
    Module?: {
        onRuntimeInitialized?: () => void;
    };
}