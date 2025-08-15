/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import StackNavigator from './src/navigators/StackNavigator';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUserFromStorage } from './src/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from './src/commons/hooks';
import { store } from './src/redux/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.WEB_CLIENT_ID,
    });
  }, []);
  //redux
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
