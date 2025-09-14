import { useEffect, useState, useCallback, useRef } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, TouchableOpacity, View } from "react-native";
import { Icon, MD2Colors, Text } from "react-native-paper";
import { DiagnosisHistory, DiagnosisHistoryListProp, PageResponse } from "../../commons/types/MyTypes";
import { useAppSelector } from "../../commons/hooks";
import { authAPI, endpoints } from "../../myapis/APIs";
import { styles } from "./DiagnosisHistorySectionStyle";
import DeleteHistoryItemButton from "./DeleteHistoryItemButton";

export const DiagnosisHistoryList: React.FC<DiagnosisHistoryListProp> = ({ navigation, route }) => {
    const { accessToken } = useAppSelector((state) => state.auth);
    console.log(navigation.getState());
    const [history, setHistory] = useState<DiagnosisHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Sử dụng ref để track page và avoid stale closure
    const pageRef = useRef(0);
    const hasMoreRef = useRef(true);
    const isLoadingRef = useRef(false);
    const isInitialLoadRef = useRef(false);

    // Loại bỏ hasMore và isLoading khỏi dependencies
    const loadHistory = useCallback(async (pageToLoad: number) => {
        console.log("pagetoload:", pageToLoad);

        // Kiểm tra bằng ref thay vì state
        if (!hasMoreRef.current || isLoadingRef.current) return;

        setIsLoading(true);
        isLoadingRef.current = true;

        try {
            const res = await authAPI(accessToken || "").get<PageResponse<DiagnosisHistory>>(
                endpoints["getHistory"](pageToLoad)
            );

            const data = res.data;
            console.log("loaded page:", data.number);

            setHistory((prev) => {
                // Nếu load page 0, replace thay vì append
                if (pageToLoad === 0) {
                    return data.content;
                }
                return [...prev, ...data.content];
            });

            pageRef.current = data.number + 1;
            hasMoreRef.current = data.number + 1 < data.totalPages;
            setHasMore(hasMoreRef.current);

        } catch (err) {
            console.error("Error loading history:", err);
        } finally {
            setIsLoading(false);
            isLoadingRef.current = false;
        }
    }, [accessToken]);


    useEffect(() => {
        if (!isInitialLoadRef.current && accessToken) {
            isInitialLoadRef.current = true;
            loadHistory(0);
        }
    }, [accessToken, loadHistory]);


    const handleLoadMore = useCallback(() => {
        if (hasMoreRef.current && !isLoadingRef.current) {
            loadHistory(pageRef.current);
        }
    }, [loadHistory]);


    const handlGoDetail = (item: DiagnosisHistory) => {
        navigation.navigate('DiagnosisItemInfo', { info: item })
    }

    const handleReFresh = async () => {
        setRefreshing(true);   // dùng refreshing cho RefreshControl
        pageRef.current = 0;
        hasMoreRef.current = true;

        await loadHistory(0);

        setRefreshing(false);  // tắt sau khi load xong
    };

    const renderItem = ({ item }: { item: DiagnosisHistory }) => (
        <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => { handlGoDetail(item) }}>
            <View style={styles.historyImageContainer}>
                {item.predictedImage ? (
                    <Image
                        source={{ uri: item.predictedImage }}
                        style={{ width: 64, height: 64, borderRadius: 8 }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.historyImagePlaceholder}>
                        <Icon source="image" size={24} color="#999" />
                    </View>
                )}
            </View>

            <View style={styles.historyContent}>
                <Text style={styles.historyDate}>{item.createAt}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.historyTitle}>
                        {item.treatment?.diseaseName ?? "Không xác định"}
                    </Text>
                    <DeleteHistoryItemButton id={item.id} />
                </View>

            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.historySection}>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5} // Giảm xuống 0.5 để tránh trigger quá sớm
                ListFooterComponent={
                    isLoading ? (
                        <ActivityIndicator
                            style={{ marginVertical: 12 }}
                            animating={true}
                            color={MD2Colors.red800}
                        />
                    ) : <></> // Sử dụng null thay vì <></>
                }
                // Thêm các props này để cải thiện performance
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                initialNumToRender={10}
                windowSize={10}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleReFresh}></RefreshControl>
                }
            />
        </View>
    );
};