interface OpenCVMat {
    delete(): void;
    rows: number;
    cols: number;
    data32S: Int32Array;
    type(): number;
    channels(): number;
}

// ArUco関連の型定義
interface ArucoDictionary {
    delete?(): void;
}

interface ArucoDetectorParameters {
    delete?(): void;
}

interface ArucoRefineParameters {
    delete?(): void;
}

interface ArucoDetector {
    detectMarkers(image: OpenCVMat, corners: MatVector, ids: OpenCVMat): void;
    delete(): void;
}

interface MatVector {
    delete(): void;
    size(): number;
}

interface OpenCV {
    getBuildInformation?: () => string;
    getBuildInfomation?: () => string; // typo in OpenCV.js
    
    // Mat class
    Mat: new (...args: unknown[]) => OpenCVMat;
    
    // Video capture
    VideoCapture: new (video: HTMLVideoElement) => {
        read(mat: OpenCVMat): void;
        delete(): void;
    };
    
    // ArUco detection
    MatVector: new () => MatVector;
    
    // ArUco classes
    aruco_Dictionary: new () => ArucoDictionary;
    aruco_DetectorParameters: new () => ArucoDetectorParameters;
    aruco_RefineParameters: new (minRepDistance: number, errorCorrectionRate: number, checkAllOrders: boolean) => ArucoRefineParameters;
    aruco_ArucoDetector: new (dictionary: ArucoDictionary, parameters: ArucoDetectorParameters, refineParameters?: ArucoRefineParameters) => ArucoDetector;
    
    // ArUco functions
    getPredefinedDictionary: (dictionaryId: number) => ArucoDictionary;
    
    // Color conversion
    cvtColor: (src: OpenCVMat, dst: OpenCVMat, code: number) => void;
    
    // Image data conversion
    matFromImageData: (imageData: ImageData) => OpenCVMat;
    
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
    DICT_ARUCO_ORIGINAL: number;
}

declare interface Window {
    cv: OpenCV;
    Module?: {
        onRuntimeInitialized?: () => void;
    };
}