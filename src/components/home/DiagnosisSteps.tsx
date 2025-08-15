import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { DiagnosisStep } from "../../commons/types/MyTypes";
import { Asset, CameraOptions, ImageLibraryOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from "react-native-image-picker";
import { requestCameraPermission, requestStoragePermission } from "../../commons/requestPermissions/commonPermissions";

interface DiagnosisStepsProps {
    setImage: React.Dispatch<React.SetStateAction<Asset>>;
}

const DiagnosisSteps: React.FC<DiagnosisStepsProps> = ({ setImage }) => {
    const [steps] = useState<DiagnosisStep[]>([
        { id: 1, title: 'Chụp lá', isCompleted: true, isActive: true, icon: "camera" },
        { id: 2, title: 'Bệnh trên lá', isCompleted: true, isActive: true, icon: "leaf" },
        { id: 3, title: 'Đề xuất trị bệnh', isCompleted: true, isActive: true, icon: "auto-fix" },
    ]);


    //Pick a image/ shoot a picture
    const openCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            console.warn('Không có quyền sử dụng camera');
            return;
        }

        const options: CameraOptions = {
            mediaType: 'photo',
            saveToPhotos: true,
            cameraType: 'back',
        };

        launchCamera(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.error('Camera error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset: Asset = response.assets[0];
                setImage(asset || "");
            }
        });
    };


    const handlePickImage = async () => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            console.warn('Không có quyền truy cập kho lưu trữ');
            return;
        }

        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1, // chỉ chọn 1 ảnh
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('Người dùng đã huỷ chọn ảnh');
            } else if (response.errorCode) {
                console.error('Lỗi khi chọn ảnh: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset: Asset = response.assets[0];
                console.log('Đường dẫn ảnh:', asset.uri);
                setImage(asset || ""); // set vào state của bạn
            }
        });
    };






    return (
        <View style={styles.diagnosisSection}>
            <Text style={styles.sectionTitle}>Chẩn đoán sâu bệnh</Text>
            <View style={styles.stepsContainer}>
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <View style={styles.stepContainer}>
                            <View style={[
                                styles.stepCircle,
                                step.isCompleted && styles.stepCircleCompleted,
                                step.isActive && styles.stepCircleActive
                            ]}>
                                {step.isCompleted && (
                                    <Icon source={step.icon} size={20} color="white" />
                                )}
                            </View>
                            <Text style={styles.stepText}>{step.title}</Text>
                        </View>
                        {index < steps.length - 1 && (
                            <View style={styles.stepConnector}>
                                <Icon source="arrow-right-thin" size={20} color="#999" />
                            </View>
                        )}
                    </React.Fragment>
                ))}
            </View>
            <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
                <Text style={styles.captureButtonText}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.captureButton, { marginTop: 12 }]} onPress={handlePickImage}>
                <Text style={styles.captureButtonText}>Chọn ảnh từ thư viện</Text>
            </TouchableOpacity>
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

export default DiagnosisSteps;