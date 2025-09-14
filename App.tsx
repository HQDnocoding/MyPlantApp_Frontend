/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicatorComponent, AppState, Image, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { ActivityIndicator, MD2Colors, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import StackNavigator from './src/navigators/StackNavigator';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import authSlice, { checkAccessToken, checkRefreshToken, loadUserFromStorage, logout, refreshAccessToken } from './src/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from './src/commons/hooks';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.WEB_CLIENT_ID,
    });
  }, []);


  const dispatch = useAppDispatch();
  const { accessToken, refreshToken } = useAppSelector((states) => states.auth);

  const handleTokenValidation = async () => {
    try {

      await dispatch(loadUserFromStorage());

      const accessTokenValid = await dispatch(checkAccessToken());

      if (!accessTokenValid.payload) {
        const refreshTokenValid = await dispatch(checkRefreshToken());

        if (refreshTokenValid.payload) {
          console.log('Access token expired, refreshing...');
          const a = await dispatch(refreshAccessToken());

        } else {
          console.log('Both tokens expired, logging out...');
          await dispatch(logout());
        }
      } else {
        console.log('Access token is still valid');
      }
    } catch (error) {
      console.error('Error during token validation:', error);
      await dispatch(logout());
    }
  };

  useEffect(() => {
    setIsInitializing(true)
    handleTokenValidation().finally(() => {
      setIsInitializing(false)
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && !isInitializing) {
        handleTokenValidation();
      }
    });

    return () => subscription.remove();
  }, [isInitializing]);


  return (
    <PaperProvider>
      <SafeAreaProvider>
        <>
          {isInitializing ? (
            <View style={[styles.container, styles.centerContent]}>
              <ActivityIndicator animating={true} color={MD2Colors.white} size="large" />
            </View>
          ) : (
            <View style={styles.container}>
              <NavigationContainer>
                <StackNavigator />
              </NavigationContainer>
            </View>
          )}
        </>


      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
