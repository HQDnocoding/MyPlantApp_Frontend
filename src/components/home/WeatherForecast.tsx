import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { styles } from "./WeatherForecastStyle";




const WeatherForecast: React.FC = () => {
    return (
        <View style={styles.weatherSection}>
            <Text style={styles.sectionTitle}>Dự báo thời tiết</Text>
            <View style={styles.weatherContainer}>
                <View style={styles.weatherCard}>
                    <View style={styles.weatherIcon}>
                        <Icon source="cloud" size={24} color="#999" />
                        <Icon source="home" size={16} color="#999" />
                    </View>
                </View>
                <View style={styles.weatherCardSmall}>
                    <View style={styles.weatherIcon}>
                        <Icon source="cloud" size={20} color="#999" />
                        <Icon source="home" size={12} color="#999" />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default WeatherForecast