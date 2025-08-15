import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Asset } from "react-native-image-picker";



export interface DiagnosisStep {
    id: number;
    title: string;
    isCompleted: boolean;
    isActive: boolean;
    icon: string,
}

export interface DiagnosisHistory {
    id: string;
    date: string;
    title: string;
    image: any;
}

export type HomeStackParamList = {
    Home: undefined;
    Conclusion: { asset: Asset };
    Login: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
};

export type Error = {
    message: String;
}


export type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
export type ConclusionScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Conclusion'>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Login'>;
