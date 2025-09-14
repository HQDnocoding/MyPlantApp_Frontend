import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        margin: 8,
    },
    loadingText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
    errorText: {
        textAlign: 'center',
        color: '#dc3545',
        fontSize: 14,
        fontWeight: '500',
    },
    currentWeatherContainer: {
        backgroundColor: '#4a90e2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    currentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    currentTemp: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
    },
    currentDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherIcon: {
        width: 60,
        height: 60,
        marginRight: 12,
    },
    currentInfo: {
        flex: 1,
    },
    weatherDescription: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textTransform: 'capitalize',
        marginBottom: 4,
    },
    feelsLike: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 8,
    },
    additionalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    forecastContainer: {
        marginBottom: 16,
    },
    forecastTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    forecastItem: {
        backgroundColor: 'white',
        padding: 12,
        marginRight: 8,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    forecastDate: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
        marginBottom: 4,
    },
    forecastIcon: {
        width: 40,
        height: 40,
        marginBottom: 4,
    },
    forecastTemp: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    forecastDesc: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    hourlyContainer: {
        marginBottom: 16,
    },
    hourlyItem: {
        backgroundColor: 'white',
        padding: 8,
        marginRight: 6,
        borderRadius: 6,
        alignItems: 'center',
        minWidth: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    hourlyTime: {
        fontSize: 11,
        fontWeight: '500',
        color: '#666',
        marginBottom: 4,
    },
    hourlyIcon: {
        width: 32,
        height: 32,
        marginBottom: 4,
    },
    hourlyTemp: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
});
