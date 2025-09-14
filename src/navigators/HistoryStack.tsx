import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HistoryParamList } from "../commons/types/MyTypes";
import DiagnosisItemInfo from "../components/history/DiagnosisItemInfo";
import { DiagnosisHistoryList } from "../components/history/DiagnosisHistoryList";


const HistoryStack = createNativeStackNavigator<HistoryParamList>()


const HistoryStackNavigator: React.FC = () => {
    return (
        <HistoryStack.Navigator initialRouteName="DiagnosisHistoryList">
            <HistoryStack.Screen name="DiagnosisHistoryList" component={DiagnosisHistoryList} />
            <HistoryStack.Screen name="DiagnosisItemInfo" component={DiagnosisItemInfo} />
        </HistoryStack.Navigator >
    )
}

export default HistoryStackNavigator;