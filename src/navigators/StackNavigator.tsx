import React from "react"
import Login from "../components/login/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeStack from "./HomeStackNavigator";
import { StackParamList } from "./StackParamList";



const Stack = createNativeStackNavigator<StackParamList>()


const StackNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="HomeStack">
            <Stack.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    )
}

export default StackNavigator