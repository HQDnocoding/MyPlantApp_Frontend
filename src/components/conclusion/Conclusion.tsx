import { Image, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ConclusionScreenNavigationProp, HomeScreenNavigationProp } from "../../commons/types/MyTypes"
import { ActivityIndicator, MD2Colors, Text, Card } from "react-native-paper"
import { useEffect, useState } from "react";
import APIs, { authMultipartAPI, endpoints } from "../../myapis/APIs";
import { showToastWithGravityAndOffset } from "../../commons/toasts";
import { Asset } from "react-native-image-picker";
import { isNotEmptyString } from "../../commons/utils/stringUtils";
import { predictImage } from "../../commons/utils/nativeFuntion";
import { styles } from "./ConclusionStyle";

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

    const handlePredictOnDevice = async () => {
        if (!asset?.uri) return;

        setIsLoading(true);
        try {
            const nativeResult = await predictImage(asset.uri);

            console.log("class " + nativeResult.predictedClass);

            // const res =await 
            setResult({
                predictedClass: nativeResult.predictedClass,
                confidence: nativeResult.confidence,
                processingTimeMs: nativeResult.processingTimeMs,
                // description, treatment... có thể map từ predictedClass nếu có DB
            });
        } catch (error) {
            console.error("ONNX prediction error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isNotEmptyString(asset?.uri)) {
            // handlePredict();
            handlePredictOnDevice();
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
                                    {/* <Text style={styles.diseaseName}>{result.treatment && result.treatment[0]?.diseaseName || "Không có bệnh"}</Text> */}
                                    <Text style={styles.diseaseName}>{result.predictedClass || "Không có bệnh"}</Text>

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

export default Conclusion