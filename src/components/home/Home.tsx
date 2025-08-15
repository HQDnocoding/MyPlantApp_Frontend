import { Button, Text } from "react-native-paper";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from "react-native";
import { HomeScreenNavigationProp, HomeStackParamList } from "../../commons/types/MyTypes";
import WeatherForecast from "./WeatherForecast";
import DiagnosisSteps from "./DiagnosisSteps";
import DiagnosisHistorySection from "./DiagnosisHistorySection";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { showToastWithGravityAndOffset } from "../../commons/toasts";
import { isNotEmptyString } from "../../commons/utils/stringUtils";
import { Asset } from "react-native-image-picker";




const Home: React.FC<{ navigation: HomeScreenNavigationProp }> = ({ navigation }) => {

    const [image, setImage] = useState<Asset>({});


    const handleToConclusion = () => {
        navigation.navigate('Conclusion', { asset: image })
    }

    useEffect(() => {
        if (isNotEmptyString(image?.uri)) {
            navigation.navigate('Conclusion', { asset: image });
            showToastWithGravityAndOffset(image?.uri?.toString() || "");
            console.log("ok", image);

        }

    }, [image])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            {/* <Header /> */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <WeatherForecast />
                <DiagnosisSteps setImage={setImage} />
                <DiagnosisHistorySection />
                <Button onPress={() => handleToConclusion()}>ConClusion</Button>
            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 10
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
})

export default Home;