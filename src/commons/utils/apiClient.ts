import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../myapis/APIs';
import { store } from '../../redux/store';
import { clearAuth, refreshToken } from '../../redux/slices/authSlice';



export const apiClient = {
    async request(url: string, options: RequestInit = {}) {
        let accessToken = await AsyncStorage.getItem('accessToken');

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
        };

        let response = await fetch(`${BASE_URL}${url}`, config);

        if (response.status === 401) {
            try {
                await store.dispatch(refreshToken()).unwrap();
                accessToken = await AsyncStorage.getItem('accessToken');
                config.headers = {
                    ...(config.headers || {}),
                    Authorization: `Bearer ${accessToken}`,
                };
                response = await fetch(`${BASE_URL}${url}`, config);
            } catch {
                store.dispatch(clearAuth());
                await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
                throw new Error('Session expired');
            }
        }

        return response;
    },
    get(url: string, options?: RequestInit) {
        return this.request(url, { ...options, method: 'GET' });
    },
    post(url: string, data: unknown, options?: RequestInit) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
