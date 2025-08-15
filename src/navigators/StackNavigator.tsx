import React from "react"
import { Image, TouchableOpacity, View } from "react-native";
import { Avatar, Icon, IconButton } from "react-native-paper";
import Login from "../components/login/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Conclusion from "../components/conclusion/Conclusion";
import HomeStack from "./HomeStackNavigator";
import { StackParamList } from "./StackParamList";



const Stack = createNativeStackNavigator<StackParamList>()


const StackNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    )
}

export default StackNavigator