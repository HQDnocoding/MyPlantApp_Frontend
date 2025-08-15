import { getAuth, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert, SafeAreaView, View } from "react-native"
import { Button, Text } from "react-native-paper";
import Config from 'react-native-config';
import { useEffect } from "react";
import auth from '@react-native-firebase/auth'
import { useAppDispatch, useAppSelector } from "../../commons/hooks";
import { loginWithGoogle } from "../../redux/slices/authSlice";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginWithGoogle())
      .unwrap()
      .then((res) => {
        console.log("Login thành công:", res);
      })
      .catch((err) => {
        console.error("Login thất bại:", err);
        Alert.alert("Lỗi đăng nhập", err);
      });
  };



  return (
    <SafeAreaView>
      <Button onPress={handleLogin} disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
      </Button>
    </SafeAreaView>
  );
}

export default Login