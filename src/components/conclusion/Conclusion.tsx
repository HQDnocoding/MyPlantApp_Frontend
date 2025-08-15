import { Image, ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ConclusionScreenNavigationProp, HomeScreenNavigationProp } from "../../commons/types/MyTypes"
import { ActivityIndicator, MD2Colors, Text, Card } from "react-native-paper"
import { useEffect, useState } from "react";
import APIs, { authMultipartAPI, endpoints } from "../../myapis/APIs";
import { showToastWithGravityAndOffset } from "../../commons/toasts";
import { Asset } from "react-native-image-picker";
import { isNotEmptyString } from "../../commons/utils/stringUtils";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

type Props = {
    navigation: ConclusionScreenNavigationProp;
    route: { params: { asset?: Asset } };
};

interface PredictionResult {
    predictedClass: string;
    confidence: number;
    processingTimeMs: number;
    description?: string;
    treatment?: Array<{
        dosePerAcre?: string;
        instruction?: string;
        diseaseName?: string;
        pesticideName?: string;
        pesticideDes?: string;
        diseaseDescription?: string

    }>;
}

const Conclusion: React.FC<Props> = ({ navigation, route }) => {

    const asset = route.params.asset;
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<null | PredictionResult>(null);

    useEffect(() => {
        console.log(asset?.uri);
    }, [])

    const handlePredict = async () => {
        setIsLoading(true);
        const form = new FormData();
        const imageUri = asset?.uri;
        const imageName = asset?.fileName || 'image.jpg';
        const type = asset?.type || 'image/jpeg';
        form.append('image', {
            uri: imageUri, name: imageName, type: type
        });

        try {
            const response = await authMultipartAPI().post(endpoints['predictDiseaseApi'], form);
            if (response.status == 200) {
                setResult(response.data);
            } else {
                showToastWithGravityAndOffset(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            showToastWithGravityAndOffset("Có lỗi xảy ra khi dự đoán bệnh");
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isNotEmptyString(asset?.uri)) {
            handlePredict();
        }
    }, [asset])

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />
                    <Text style={styles.loadingText}>Đang phân tích hình ảnh...</Text>
                </View>
            )}

            {!isLoading && result && (
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
                    {/* Kết quả dự đoán */}
                    <Text style={styles.headTitle}>1. Kết quả chẩn đoán:</Text>
                    <Card style={styles.resultCard}>
                        <Card.Content>
                            <View style={styles.resultHeader}>
                                <Image
                                    source={asset?.uri ? { uri: asset.uri } : undefined}
                                    style={styles.resultImage}
                                />
                                <View style={styles.resultInfo}>
                                    <Text style={styles.diseaseTitle}>Bệnh được dự đoán:</Text>
                                    <Text style={styles.diseaseName}>{result.treatment && result.treatment[0]?.diseaseName || "Không có bệnh"}</Text>

                                    <Text style={styles.confidence}>
                                        Độ tin cậy: {(result.confidence * 100).toFixed(1)}%
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Mô tả bệnh */}
                    {(result.treatment &&
                        <>
                            <Text style={styles.headTitle}>2. Mô tả bệnh:</Text>
                            <Card style={styles.infoCard}>
                                <Card.Content>

                                    <Text style={styles.description}>{result.treatment && result.treatment[0]?.diseaseDescription || ""}</Text>
                                </Card.Content>
                            </Card>
                        </>

                    )}



                    {/* Danh sách thuốc */}
                    {result.treatment && result.treatment.length > 0 && (
                        <>
                            <Text style={styles.headTitle}>3. Thuốc điều trị:</Text>
                            <Card style={styles.infoCard}>

                                <Card.Content>

                                    {result.treatment.map((medication, index) => (
                                        <View key={index} style={styles.medicationItem}>
                                            <Text style={styles.medicationName}>
                                                {index + 1}. {medication.pesticideName}
                                            </Text>
                                            {medication.pesticideName && (
                                                <Text style={styles.medicationDetail}>
                                                    <Text style={styles.label}>Thuốc: </Text>
                                                    {medication.pesticideName}
                                                </Text>
                                            )}
                                            {medication.dosePerAcre && (
                                                <Text style={styles.medicationDetail}>
                                                    <Text style={styles.label}>Liều lượng: </Text>
                                                    {medication.dosePerAcre}
                                                </Text>
                                            )}
                                            {medication.instruction && (
                                                <Text style={styles.medicationDetail}>
                                                    <Text style={styles.label}>Cách dùng: </Text>
                                                    {medication.instruction}
                                                </Text>
                                            )}
                                            {medication.pesticideDes && (
                                                <Text style={styles.medicationNotes}>
                                                    <Text style={styles.label}>Thông tin: </Text>
                                                    {medication.pesticideDes}
                                                </Text>
                                            )}
                                            {index < result.treatment!.length - 1 && (
                                                <View style={styles.separator} />
                                            )}
                                        </View>
                                    ))}
                                </Card.Content>
                            </Card>
                        </>

                    )}

                    {/* Lưu ý chung */}
                    <Card style={[styles.infoCard, styles.warningCard]}>
                        <Card.Content>
                            <Text style={styles.warningTitle}>⚠️ Lưu ý quan trọng</Text>
                            <Text style={styles.warningText}>
                                Kết quả này chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến bác sĩ
                                chuyên khoa để có chẩn đoán chính xác và phương pháp điều trị phù hợp.
                            </Text>
                        </Card.Content>
                    </Card>
                </ScrollView>
            )}

            {!isLoading && !result && (
                <View style={styles.noResultContainer}>
                    <Text style={styles.noResultText}>Không có kết quả để hiển thị</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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

export default Conclusion