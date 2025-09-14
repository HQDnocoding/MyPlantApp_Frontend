import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import Home from "../components/home/Home";
import Conclusion from "../components/conclusion/Conclusion";
import { HomeStackParamList } from "../commons/types/MyTypes";
import AvatarButton from "../ui/AvatarButton";
import DiagnosisItemInfo from "../components/history/DiagnosisItemInfo";
import HistoryStackNavigator from "./HistoryStack";


const HomeStack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackNavigator: React.FC = () => {


    return (
        <HomeStack.Navigator initialRouteName="Home" >
            <HomeStack.Screen name="Home" component={Home} options={{
                headerRight: () => {
                    return (
                        <AvatarButton />
                    )
                },
                headerLeft: () => {
                    return (
                        <View>
                            <IconButton onPress={() => { }} icon="menu" size={30} />
                        </View>
                    )
                }
            }} />
            <HomeStack.Screen component={Conclusion} name="Conclusion" />
            <HomeStack.Screen name="DiagnosisItemInfo" component={DiagnosisItemInfo} />
            <HomeStack.Screen component={HistoryStackNavigator} name="DiagnosisHistoryList" options={{ headerShown: false }} />
        </HomeStack.Navigator>
    )
}
export default HomeStackNavigator