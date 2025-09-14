import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Asset } from "react-native-image-picker";



interface DiagnosisStep {
    id: number;
    title: string;
    isCompleted: boolean;
    isActive: boolean;
    icon: string,
}

interface DiagnosisHistory {
    id: string;
    predictedImage: string;
    createAt: string;
    treatment: Treatment
}


interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

type HomeStackParamList = {
    Home: undefined;
    Conclusion: { asset: Asset, isOnDevice: boolean };
    Login: undefined;
    DiagnosisHistoryList: undefined;
    DiagnosisItemInfo: { info: DiagnosisHistory }
};

type HistoryParamList = {
    DiagnosisHistoryList: undefined;
    DiagnosisItemInfo: { info: DiagnosisHistory }
}

type AuthStackParamList = {
    Login: undefined;
};

type Error = {
    message: String;
}

type Treatment = {
    id: number;
    dosePerAcre: string;
    instruction: string;
    diseaseName: string;
    pesticideName: string;
    pesticideDes: string;
    diseaseDescription: string
}



interface PredictionResult {
    predictedClass: string;
    confidence: number;
    processingTimeMs: number;
    description?: string;
    treatment?: Array<{
        id?: number;
        dosePerAcre?: string;
        instruction?: string;
        diseaseName?: string;
        pesticideName?: string;
        pesticideDes?: string;
        diseaseDescription?: string

    }>;
}

interface CurrentWeather {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    name: string;
}

interface ForecastItem {
    dt: number;
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    dt_txt: string;
}

interface ForecastData {
    list: ForecastItem[];
    city: {
        name: string;
    };
}

interface Location { latitude: number; longitude: number }

type PredictionResultOnDevice = {
    predictedClass: string;
    confidence: number;
    processingTimeMs: number;
};

type HomeScreenNavigationProp = NativeStackScreenProps<HomeStackParamList, 'Home'>;
type ConclusionScreenNavigationProp = NativeStackScreenProps<HomeStackParamList, 'Conclusion'>;
type LoginScreenNavigationProp = NativeStackScreenProps<HomeStackParamList, 'Login'>;
type DiagnosisHistoryListProp = NativeStackScreenProps<HomeStackParamList, 'DiagnosisHistoryList'>;
type DiagnosisItemInfoProp = NativeStackScreenProps<HomeStackParamList, 'DiagnosisItemInfo'>;


export type {
    HomeScreenNavigationProp, ConclusionScreenNavigationProp, LoginScreenNavigationProp, DiagnosisHistoryListProp, DiagnosisItemInfoProp,
    Error, AuthStackParamList, HomeStackParamList, DiagnosisHistory, DiagnosisStep, PredictionResult, HistoryParamList,
    PageResponse, Location, PredictionResultOnDevice, CurrentWeather, ForecastData, ForecastItem
}