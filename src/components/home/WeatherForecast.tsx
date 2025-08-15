import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";




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

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    weatherSection: {
        marginTop: 20,
        marginBottom: 24,
    },
    weatherContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    weatherCard: {
        flex: 1,
        height: 80,
        backgroundColor: '#e8e3f0',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weatherCardSmall: {
        width: 80,
        height: 80,
        backgroundColor: '#e8e3f0',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weatherIcon: {
        alignItems: 'center',
        gap: 4,
    },
});


export default WeatherForecast