import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    historySection: {
        marginBottom: 100,
    },
    historySectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllText: {
        color: '#2196f3',
        fontSize: 14,
        fontWeight: '500',
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    historyImageContainer: {
        marginRight: 12,
    },
    historyImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyContent: {
        flex: 1,
    },
    historyDate: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    historyTitle: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
})