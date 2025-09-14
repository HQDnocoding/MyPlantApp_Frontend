import { Switch, Text } from "react-native-paper";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    View,
    RefreshControl,
} from "react-native";
import { HomeScreenNavigationProp } from "../../commons/types/MyTypes";
import WeatherForecast from "./WeatherForecast";
import DiagnosisSteps from "./DiagnosisSteps";
import { useEffect, useState, useCallback } from "react";
import { isNotEmptyString } from "../../commons/utils/stringUtils";
import { Asset } from "react-native-image-picker";
import { styles } from "./HomeStyle";
import { DiagnosisHistorySection } from "./DiagnosisHistorySection";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home: React.FC<HomeScreenNavigationProp> = ({ navigation }) => {
    const [image, setImage] = useState<Asset>({});
    const [isGoHisList, setIsGoHisList] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    const onToggleSwitch = () => {
        AsyncStorage.setItem("isOnDevice", (!isSwitchOn).toString());
        setIsSwitchOn(!isSwitchOn);
    };

    const fetchToggle = async () => {
        const flag = await AsyncStorage.getItem("isOnDevice");
        setIsSwitchOn(flag !== null ? flag === "true" : true);
    };

    useEffect(() => {
        fetchToggle();
    }, []);

    useEffect(() => {
        if (isNotEmptyString(image?.uri)) {
            navigation.navigate("Conclusion", { asset: image, isOnDevice: isSwitchOn });
            console.log("ok", image);
        }
    }, [image]);

    useEffect(() => {
        if (isGoHisList) {
            navigation.navigate("DiagnosisHistoryList");
            setIsGoHisList(false);
        }
    }, [isGoHisList]);

    // Hàm xử lý refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchToggle();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <WeatherForecast refreshing={refreshing} />
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 1 }}>
                    <Text style={{ fontWeight: "500" }}>Xử lý trên điện thoại</Text>
                    <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                </View>
                <DiagnosisSteps setImage={setImage} />
                <DiagnosisHistorySection refreshing={refreshing} setIsGo={setIsGoHisList} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
