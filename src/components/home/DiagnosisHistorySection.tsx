import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { DiagnosisHistory } from "../../commons/types/MyTypes";


const DiagnosisHistorySection: React.FC = () => {
    const [history] = useState<DiagnosisHistory[]>([
        // {
        //     id: '1',
        //     date: '7 th 7',
        //     title: 'Bệnh thán thư',
        //     image: require('./assets/plant-sample.jpg'), // Placeholder
        // },
        // {
        //     id: '2',
        //     date: '7 th 7',
        //     title: 'Bệnh thán thư',
        //     image: require('./assets/plant-sample.jpg'), // Placeholder
        // },
    ]);

    return (
        <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
                <Text style={styles.sectionTitle}>Các ảnh đã chẩn đoán</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>Tất cả</Text>
                </TouchableOpacity>
            </View>
            {history.map((item) => (
                <TouchableOpacity key={item.id} style={styles.historyItem}>
                    <View style={styles.historyImageContainer}>
                        <View style={styles.historyImagePlaceholder}>
                            <Icon source="image" size={24} color="#999" />
                        </View>
                    </View>
                    <View style={styles.historyContent}>
                        <Text style={styles.historyDate}>{item.date}</Text>
                        <Text style={styles.historyTitle}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            ))}
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

export default DiagnosisHistorySection;