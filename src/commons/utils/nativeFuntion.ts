import { PermissionsAndroid, Platform } from 'react-native';
import { NativeModules } from 'react-native';
import { Location, PredictionResultOnDevice } from '../types/MyTypes';
const { OnnxModule, GoogleSignInModule, LocationModule, FacebookLogin } = NativeModules;


function predictImage(uri: string): Promise<PredictionResultOnDevice> {
    return OnnxModule.predict(uri);
}

const signInWithGoogle = async (webClientId: String) => {
    try {
        const user = await GoogleSignInModule.signIn(webClientId);
        console.log('User info:', user);
        return user;
    } catch (err) {
        console.error('Sign-in error', err);
        throw err;
    }
};

const loginFaceBook = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
        FacebookLogin.login(["public_profile", "email"])
            .then((res: any) => resolve(res))
            .catch((err: any) => reject(err));
    });
};

const logoutFacebook = async (): Promise<void> => {
    return FacebookLogin.logout();
};

const getLocation = async (): Promise<Location | null> => {
    if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn("Không được phép truy cập vị trí");
            return null;
        }
    }

    try {
        const location = await LocationModule.getCurrentLocation() as Location;
        return location;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export { predictImage, getLocation, signInWithGoogle, loginFaceBook, logoutFacebook }