import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#333',
        marginBottom: 12,
    },
    diagnosisSection: {
        marginBottom: 24,
    },
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    stepContainer: {
        alignItems: 'center',
        flex: 1,
    },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    stepCircleCompleted: {
        backgroundColor: '#7c4dff',
    },
    stepCircleActive: {
        backgroundColor: '#7c4dff',
    },
    stepText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 16,
    },
    stepConnector: {
        paddingHorizontal: 8,
        paddingTop: 20,
    },
    captureButton: {
        backgroundColor: '#81c784',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    captureButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
})
