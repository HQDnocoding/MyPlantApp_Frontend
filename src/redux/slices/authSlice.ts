// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../commons/utils/apiClient";
import APIs, { endpoints } from "../../myapis/APIs";
import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";

const initialState: {
    user: any | null,
    accessToken: string | null,
    loading: boolean,
    error: string | null,
} = {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
};

interface LoginResponse {
    accessToken: string;
    user: any;
}



export const loginWithGoogle = createAsyncThunk<
    LoginResponse,
    void,
    { rejectValue: string }
>(
    "auth/loginWithGoogle",
    async (_, { rejectWithValue }) => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            const googleRes = await GoogleSignin.signIn();
            console.log(googleRes.data?.idToken);

            if (!googleRes.data?.idToken) {
                return rejectWithValue("Không lấy được ID token từ Google");
            }

            const apiRes = await APIs.post(endpoints["authGoogleToken"], {
                "token": googleRes.data.idToken
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            await AsyncStorage.setItem("accessToken", apiRes.data.accessToken);
            await AsyncStorage.setItem("user", JSON.stringify(apiRes.data.user));

            return {
                accessToken: apiRes.data.accessToken,
                user: apiRes.data.user
            };
        } catch (err: unknown) {
            let errorMessage = 'Đăng nhập thất bại';

            // Nếu là lỗi từ Axios và backend có trả message
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage += `: ${err.message}`;
            }

            return rejectWithValue(errorMessage);
        }
    }
);

// Load dữ liệu từ AsyncStorage khi app khởi động
export const loadUserFromStorage = createAsyncThunk(
    "auth/loadUserFromStorage",
    async () => {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const user = await AsyncStorage.getItem("user");
        if (accessToken && user) {
            return { accessToken, user: JSON.parse(user) };
        }
        return null;
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("user");
    return null;
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Đăng nhập thất bại";
            })
            .addCase(loadUserFromStorage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.accessToken = action.payload.accessToken;
                    state.user = action.payload.user;
                }
            })
            .addCase(logout.fulfilled, (state) => {
                state.accessToken = null;
                state.user = null;
                state.error = null;
                state.loading = false;
            });
    },
});

export default authSlice;
