import { NativeModules } from 'react-native';
const { OnnxModule } = NativeModules;

type PredictionResult = {
    predictedClass: string;
    confidence: number;
    processingTimeMs: number;
};

export function predictImage(uri: string): Promise<PredictionResult> {
    return OnnxModule.predict(uri);
}