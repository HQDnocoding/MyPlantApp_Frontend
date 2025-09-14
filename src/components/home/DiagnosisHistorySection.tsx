import { useEffect, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { Icon, MD2Colors, Text } from "react-native-paper";
import { DiagnosisHistory } from "../../commons/types/MyTypes";
import { styles } from "./DiagnosisHistorySectionStyle";
import { useAppSelector } from "../../commons/hooks";
import { authAPI, endpoints } from "../../myapis/APIs";
import { isNotEmptyString } from "../../commons/utils/stringUtils";
import { useNavigation } from "@react-navigation/native";

type Props = {
    setIsGo: React.Dispatch<React.SetStateAction<boolean>>;
    refreshing: boolean
}

export const DiagnosisHistorySection: React.FC<Props> = ({ setIsGo, refreshing }) => {
    const [history, setHistory] = useState<DiagnosisHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { accessToken } = useAppSelector((state) => state.auth);
    const navigation = useNavigation<any>();


    const loadHistory = async () => {
        const res = await authAPI(accessToken || "").get(endpoints['getHistory'](0));
        return res.data;
    };
    const handlGoDetail = (item: DiagnosisHistory) => {
        navigation.navigate("DiagnosisItemInfo", { info: item });
    }

    const handleLoadHistory = () => {
        setIsLoading(true);

        loadHistory()
            .then((data) => {
                setHistory(data.content ?? []);
            })
            .catch((err) => {
                console.error("Error loading history:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (isNotEmptyString(accessToken || "")) {
            handleLoadHistory();
            console.log("acc", accessToken);

        }

    }, [accessToken]);

    useEffect(() => {
        if (accessToken !== null && refreshing === true) {
            handleLoadHistory();
        }
    }, [refreshing])

    return (
        accessToken &&
        <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
                <Text style={styles.sectionTitle}>Các ảnh đã chẩn đoán</Text>
                <TouchableOpacity onPress={() => { setIsGo(true) }}>
                    <Text style={styles.seeAllText}>Tất cả</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />
                    <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
                </View>
            ) : (
                <>
                    {history.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => handlGoDetail(item)}>
                            <View style={styles.historyImageContainer}>
                                {item.predictedImage ? (
                                    <Image
                                        source={{ uri: item.predictedImage }}
                                        style={{ width: 64, height: 64, borderRadius: 8 }}
                                    />
                                ) : (
                                    <View style={styles.historyImagePlaceholder}>
                                        <Icon source="image" size={24} color="#999" />
                                    </View>
                                )}
                            </View>

                            <View style={styles.historyContent}>
                                <Text style={styles.historyDate}>{item.createAt}</Text>
                                <Text style={styles.historyTitle}>
                                    {item.treatment?.diseaseName ?? "Không xác định"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </>
            )}
        </View>
    );
};
