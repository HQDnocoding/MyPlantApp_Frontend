import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import Home from "../components/home/Home";
import Conclusion from "../components/conclusion/Conclusion";
import { HomeScreenNavigationProp, HomeStackParamList } from "../commons/types/MyTypes";
import AvatarButton from "../ui/AvatarButton";


const HomeStack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackNavigator: React.FC<{ navigation: HomeScreenNavigationProp }> = ({ navigation }) => {

    const handleToLogin = () => {
        navigation.navigate('Login');
    };


    return (
        <HomeStack.Navigator initialRouteName="Home" >
            <HomeStack.Screen name="Home" component={Home} options={{
                headerRight: () => { return (<AvatarButton />) },
                headerLeft: () => {
                    return (
                        <View>
                            <IconButton onPress={() => { }} icon="menu" size={30} />
                        </View>
                    )
                }
            }} />
            <HomeStack.Screen component={Conclusion} name="Conclusion" />
        </HomeStack.Navigator>
    )
}
export default HomeStackNavigator