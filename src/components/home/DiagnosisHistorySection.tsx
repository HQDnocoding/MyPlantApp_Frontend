import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { DiagnosisHistory } from "../../commons/types/MyTypes";
import { styles } from "./DiagnosisHistorySectionStyle";


export const DiagnosisHistorySection: React.FC = () => {
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

