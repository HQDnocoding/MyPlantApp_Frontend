import { PermissionsAndroid, Platform } from "react-native";

const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
        if (Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                {
                    title: 'Yêu cầu quyền truy cập ảnh',
                    message: 'Ứng dụng cần quyền để truy cập thư viện ảnh.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Hủy',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Yêu cầu quyền truy cập ảnh',
                    message: 'Ứng dụng cần quyền để truy cập thư viện ảnh.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Hủy',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
};

const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Yêu cầu quyền truy cập Camera',
                message: 'Ứng dụng cần quyền sử dụng camera để chụp ảnh.',
                buttonNeutral: 'Hỏi lại sau',
                buttonNegative: 'Từ chối',
                buttonPositive: 'Đồng ý',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.warn(err);
        return false;
    }
};


export { requestCameraPermission, requestStoragePermission };