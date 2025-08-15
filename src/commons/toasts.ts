import { ToastAndroid } from "react-native";

const showToast = (content: string) => {
    ToastAndroid.show(content, ToastAndroid.SHORT);
};

const showToastWithGravity = (content: string) => {
    ToastAndroid.showWithGravity(
        content,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
    );
};

const showToastWithGravityAndOffset = (content: string) => {
    ToastAndroid.showWithGravityAndOffset(
        content,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
    );
};


export { showToast, showToastWithGravity, showToastWithGravityAndOffset }