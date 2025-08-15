import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    headTitle: {
        paddingStart: 10,
        color: 'black',
        fontSize: 20,
        fontWeight: 800,
        paddingVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    resultCard: {
        marginBottom: 8,
        elevation: 4,
        backgroundColor: '#FFFFFF'
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 16,
    },
    resultInfo: {
        flex: 1,
    },
    diseaseTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    diseaseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196f3',
        marginBottom: 4,
    },
    confidence: {
        fontSize: 14,
        color: '#4caf50',
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: "#f5f5f5",
        marginBottom: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
        paddingBottom: 8,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        textAlign: 'justify',
    },
    treatment: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        textAlign: 'justify',
    },
    medicationItem: {
        marginBottom: 16,
    },
    medicationName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: 6,
    },
    medicationDetail: {
        fontSize: 14,
        color: '#555',
        marginBottom: 3,
        lineHeight: 20,
    },
    medicationNotes: {
        fontSize: 14,
        color: '#ff9800',
        marginTop: 4,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    label: {
        fontWeight: '600',
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 12,
    },
    warningCard: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffc107',
        borderWidth: 1,
        marginTop: 20,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#856404',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
        lineHeight: 20,
        textAlign: 'justify',
    },
    noResultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    noResultText: {
        fontSize: 16,
        color: '#666',
    },
})
