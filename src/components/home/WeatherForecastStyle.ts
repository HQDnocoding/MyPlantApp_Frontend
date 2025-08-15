import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
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

