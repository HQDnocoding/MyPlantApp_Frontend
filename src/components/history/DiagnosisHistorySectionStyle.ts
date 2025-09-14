import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    historySection: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // hiệu ứng đổ bóng Android
    },
    historyImageContainer: {
        marginRight: 12,
    },
    historyImagePlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
    },
    historyContent: {
        flex: 1,
    },
    historyDate: {
        fontSize: 12,
        color: "#888",
        marginBottom: 4,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    loadingContainer: {
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
    },
});
