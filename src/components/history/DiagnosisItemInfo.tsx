import { Image, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { DiagnosisItemInfoProp } from "../../commons/types/MyTypes"
import { Text, Card } from "react-native-paper"
import { useRef } from "react";
import { styles } from "../conclusion/ConclusionStyle";



const DiagnosisItemInfo: React.FC<DiagnosisItemInfoProp> = ({ route, navigation }) => {

    const isLoading = useRef(true);

    const history = route.params.info;


    return (
        <SafeAreaView style={styles.container}>


            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
                {/* Kết quả dự đoán */}
                <Text style={styles.headTitle}>1. Kết quả chẩn đoán:</Text>
                <Card style={styles.resultCard}>
                    <Card.Content>
                        <View style={styles.resultHeader}>
                            <Image
                                source={{ uri: history?.predictedImage || "" }}
                                style={styles.resultImage}
                            />
                            <View style={styles.resultInfo}>
                                <Text style={styles.diseaseTitle}>Bệnh được dự đoán:</Text>
                                {/* <Text style={styles.diseaseName}>{result.treatment && result.treatment[0]?.diseaseName || "Không có bệnh"}</Text> */}
                                <Text style={styles.diseaseName}>{history.treatment.diseaseName || "Không tải được tên bệnh"}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>


                <>
                    <Text style={styles.headTitle}>2. Mô tả bệnh:</Text>
                    <Card style={styles.infoCard}>
                        <Card.Content>

                            <Text style={styles.description}>{history.treatment.diseaseDescription}</Text>
                        </Card.Content>
                    </Card>
                </>

                <>
                    <Text style={styles.headTitle}>3. Thuốc điều trị:</Text>
                    <Card style={styles.infoCard}>
                        <Card.Content>
                            <View key={history.treatment.id} style={styles.medicationItem}>
                                <Text style={styles.medicationName}>
                                    {history.treatment?.pesticideName}
                                </Text>
                                {history.treatment.pesticideName && (
                                    <Text style={styles.medicationDetail}>
                                        <Text style={styles.label}>Thuốc: </Text>
                                        {history.treatment?.pesticideName}
                                    </Text>
                                )}
                                {history.treatment.dosePerAcre && (
                                    <Text style={styles.medicationDetail}>
                                        <Text style={styles.label}>Liều lượng: </Text>
                                        {history.treatment?.dosePerAcre}
                                    </Text>
                                )}
                                {history.treatment.instruction && (
                                    <Text style={styles.medicationDetail}>
                                        <Text style={styles.label}>Cách dùng: </Text>
                                        {history.treatment?.instruction}
                                    </Text>
                                )}
                                {history.treatment.pesticideDes && (
                                    <Text style={styles.medicationNotes}>
                                        <Text style={styles.label}>Thông tin: </Text>
                                        {history.treatment?.pesticideDes}
                                    </Text>
                                )}

                            </View>
                        </Card.Content>
                    </Card>
                </>

                <Card style={[styles.infoCard, styles.warningCard]}>
                    <Card.Content>
                        <Text style={styles.warningTitle}>⚠️ Lưu ý quan trọng</Text>
                        <Text style={styles.warningText}>
                            Kết quả này chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến chuyên gia để có chẩn đoán chính xác và phương pháp điều trị phù hợp.
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>

        </SafeAreaView>
    )
}

export default DiagnosisItemInfo