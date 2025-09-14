import React from "react";
import { Alert, SafeAreaView, View, StyleSheet } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../../commons/hooks";
import { loginWithGoogle, loginWithFacebook } from "../../redux/slices/authSlice";
import { CommonActions } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../../commons/types/MyTypes";
// có sẵn trong react-native-paper

const Login: React.FC<LoginScreenNavigationProp> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state) => state.auth);

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle())
      .unwrap()
      .then(() => {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "HomeStack" }] })
        );
      })
      .catch((err) => {
        Alert.alert("Lỗi đăng nhập Google", err);
      });
  };

  const handleFacebookLogin = () => {
    dispatch(loginWithFacebook())
      .unwrap()
      .then(() => {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "HomeStack" }] })
        );
      })
      .catch((err) => {
        Alert.alert("Lỗi đăng nhập Facebook", err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chào mừng bạn</Text>
      <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

      {!user ? (
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleGoogleLogin}
            disabled={loading}
            style={[styles.button, { backgroundColor: "#DB4437" }]}
            icon={() => <Icon source="google" size={20} color="white" />}
          >
            {loading ? "Đang đăng nhập..." : "Tiếp tục với Google"}
          </Button>

          <Button
            mode="contained"
            onPress={handleFacebookLogin}
            disabled={loading}
            style={[styles.button, { backgroundColor: "#4267B2" }]}
            icon={() => <Icon source="facebook" size={20} color="white" />}
          >
            {loading ? "Đang đăng nhập..." : "Tiếp tục với Facebook"}
          </Button>
        </View>
      ) : (
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Home" as never)}
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
        >
          Vào Home
        </Button>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 100, alignItems: "center", paddingHorizontal: 20, backgroundColor: "white" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 24 },
  buttonContainer: { width: "100%", gap: 16 },
  button: { borderRadius: 8, paddingVertical: 4 },
});

export default Login;
