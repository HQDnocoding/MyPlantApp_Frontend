import { ActivityIndicator, NativeModules, ScrollView, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { getLocation } from "../../commons/utils/nativeFuntion";
import { MD2Colors } from "react-native-paper";
import { CurrentWeather, ForecastData, ForecastItem, Location } from "../../commons/types/MyTypes";
import { styles } from "./WeatherForecastStyle";
import Config from "react-native-config";

const API_KEY = Config.WEATHER_API_KEY;

type Prop = {

    refreshing: boolean
}


const WeatherForecast: React.FC<Prop> = ({ refreshing }) => {
    const [coords, setCoords] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const dailyForecast = useRef<ForecastItem[]>([]);

    useEffect(() => {
        dailyForecast.current = forecast ? getDailyForecast(forecast) : [];
    }, [forecast]);
    useEffect(() => {
        if (refreshing === true)
            dailyForecast.current = forecast ? getDailyForecast(forecast) : [];
    }, [refreshing])



    // Hàm lấy thời tiết hiện tại
    const fetchCurrentWeather = async (location: Location) => {
        try {
            console.log(location);

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=vi`
            );
            if (!response.ok) throw new Error('Không thể lấy dữ liệu thời tiết hiện tại');
            const data = await response.json();
            setCurrentWeather(data);
        } catch (err) {
            console.error('Error fetching current weather:', err);
            setError('Lỗi khi lấy thời tiết hiện tại');
        }
    };

    // Hàm lấy dự báo 5 ngày
    const fetchForecast = async (location: Location) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=vi`
            );
            if (!response.ok) throw new Error('Không thể lấy dữ liệu dự báo');
            const data = await response.json();
            setForecast(data);
        } catch (err) {
            console.error('Error fetching forecast:', err);
            setError('Lỗi khi lấy dự báo thời tiết');
        }
    };

    // Hàm format thời gian
    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('vi-VN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatHour = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Lọc dự báo theo ngày (lấy 1 item/ngày vào lúc 12:00)
    const getDailyForecast = (forecastData: ForecastData) => {
        const dailyData: ForecastItem[] = [];
        const processedDates = new Set<string>();

        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();

            if (!processedDates.has(date)) {
                dailyData.push(item);
                processedDates.add(date);
            }
        });

        return dailyData.slice(0, 5); // Lấy 5 ngày đầu
    };

    useEffect(() => {
        getLocation()
            .then(async (location) => {
                setCoords(location);
                if (location !== null)
                    await Promise.all([
                        fetchCurrentWeather(location as Location),
                        fetchForecast(location as Location)
                    ]);
            })
            .catch(err => {
                console.log("Error: ", err);
                setError('Không thể lấy vị trí');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    style={{ marginVertical: 12 }}
                    animating={true}
                    color={MD2Colors.blue800}
                />
                <Text style={styles.loadingText}>Đang lấy thông tin thời tiết...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Thời tiết hiện tại */}
            {currentWeather && (
                <View style={styles.currentWeatherContainer}>
                    <View style={styles.currentHeader}>
                        <Text style={styles.locationText}>{currentWeather.name}</Text>
                        <Text style={styles.currentTemp}>{Math.round(currentWeather.main.temp)}°C</Text>
                    </View>
                    <View style={styles.currentDetails}>
                        <Image
                            source={{
                                uri: `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`
                            }}
                            style={styles.weatherIcon}
                        />
                        <View style={styles.currentInfo}>
                            <Text style={styles.weatherDescription}>
                                {currentWeather.weather[0].description}
                            </Text>
                            <Text style={styles.feelsLike}>
                                Cảm giác như {Math.round(currentWeather.main.feels_like)}°C
                            </Text>
                            <View style={styles.additionalInfo}>
                                <Text style={styles.infoText}>
                                    Độ ẩm: {currentWeather.main.humidity}%
                                </Text>
                                <Text style={styles.infoText}>
                                    Gió: {currentWeather.wind.speed} m/s
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Dự báo 5 ngày */}
            {forecast && (
                <View style={styles.forecastContainer}>
                    <Text style={styles.forecastTitle}>Dự báo 5 ngày</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {dailyForecast.current.map((item, index) => (
                            <View key={index} style={styles.forecastItem}>
                                <Text style={styles.forecastDate}>
                                    {formatTime(item.dt)}
                                </Text>
                                <Image
                                    source={{
                                        uri: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`
                                    }}
                                    style={styles.forecastIcon}
                                />
                                <Text style={styles.forecastTemp}>
                                    {Math.round(item.main.temp)}°C
                                </Text>
                                <Text style={styles.forecastDesc}>
                                    {item.weather[0].description}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Dự báo theo giờ (24h tới) */}
            {forecast && (
                <View style={styles.hourlyContainer}>
                    <Text style={styles.forecastTitle}>24 giờ tới</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {forecast.list.slice(0, 8).map((item, index) => (
                            <View key={index} style={styles.hourlyItem}>
                                <Text style={styles.hourlyTime}>
                                    {formatHour(item.dt_txt)}
                                </Text>
                                <Image
                                    source={{
                                        uri: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`
                                    }}
                                    style={styles.hourlyIcon}
                                />
                                <Text style={styles.hourlyTemp}>
                                    {Math.round(item.main.temp)}°
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};


export default WeatherForecast;