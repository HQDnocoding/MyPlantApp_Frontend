import { Alert, TouchableOpacity, View } from "react-native"
import { IconButton, MD3Colors } from "react-native-paper"
import { authAPI, endpoints } from "../../myapis/APIs"
import { useAppSelector } from "../../commons/hooks"


type Prop = {
    id: string
}

const DeleteHistoryItemButton: React.FC<Prop> = ({ id }) => {
    const { accessToken } = useAppSelector((state) => state.auth);

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa lịch sử này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            console.log("id", id);

                            const res = await authAPI(accessToken || "").delete(endpoints['deleteHistory'](id));
                            if (res.status !== 200) {
                                console.error("Fail", res);
                            }
                        } catch (error) {
                            console.error("Lỗi khi xóa:", error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };


    return (
        <TouchableOpacity onPress={handleDelete}>
            <IconButton icon="delete" size={20} iconColor={MD3Colors.error50} />
        </TouchableOpacity>
    )

}

export default DeleteHistoryItemButton;