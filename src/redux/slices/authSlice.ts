// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { endpoints } from "../../myapis/APIs";
import axios from "axios";
import { loginFaceBook, signInWithGoogle } from "../../commons/utils/nativeFuntion";
import Config from "react-native-config";

const initialState: {
    user: any | null,
    accessToken: string | null,
    refreshToken: string | null,
    expiresAt: number | null,
    refreshTokenExpiresAt: number | null,
    loading: boolean,
    error: string | null,
} = {
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: 0,
    refreshTokenExpiresAt: 0,
    loading: false,
    error: null,
};

interface LoginResponse {
    accessToken: string | null;
    refreshToken: string | null,
    expiresAt: number | null,
    refreshTokenExpiresAt: number | null
    user: any | null;
}

/* ---------------- GOOGLE LOGIN ---------------- */
export const loginWithGoogle = createAsyncThunk<
    LoginResponse,
    void,
    { rejectValue: string }
>(
    "auth/loginWithGoogle",
    async (_, { rejectWithValue }) => {
        try {
            const user = await signInWithGoogle(Config.WEB_CLIENT_ID || "");

            if (!user.idToken) {
                return rejectWithValue("Không lấy được ID token từ Google");
            }

            // Gửi token lên backend để verify
            const apiRes = await APIs.post(endpoints["authGoogleToken"], {
                token: user.idToken,
            });


            await saveResponseLogin(apiRes.data.accessToken, apiRes.data.refreshToken, apiRes.data.expiresIn
                , apiRes.data.refreshTokenExpiresIn, user
            )

            return {
                accessToken: apiRes.data.accessToken,
                refreshToken: apiRes.data.refreshToken,
                expiresAt: Date.now() + apiRes.data.expiresIn,
                refreshTokenExpiresAt: Date.now() + apiRes.data.refreshTokenExpiresIn,
                user: user,
            };
        } catch (err: unknown) {
            let errorMessage = "Đăng nhập Google thất bại";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage += `: ${err.message}`;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

/* ---------------- FACEBOOK LOGIN ---------------- */
export const loginWithFacebook = createAsyncThunk<
    LoginResponse,
    void,
    { rejectValue: string }
>(
    "auth/loginWithFacebook",
    async (_, { rejectWithValue }) => {
        try {
            // Gọi native module login facebook
            const fbUser = await loginFaceBook();
            console.log("fb", fbUser);


            if (!fbUser.accessToken) {
                return rejectWithValue("Không lấy được access token từ Facebook");
            }

            // Gửi token lên backend để verify với Graph API
            const apiRes = await APIs.post(endpoints["authFacebookToken"], {
                accessToken: fbUser.accessToken,
            });
            await saveResponseLogin(apiRes.data.accessToken, apiRes.data.refreshToken, apiRes.data.expiresIn
                , apiRes.data.refreshTokenExpiresIn, fbUser
            )
            return {
                accessToken: apiRes.data.accessToken,
                refreshToken: apiRes.data.refreshToken,
                expiresAt: Date.now() + apiRes.data.expiresIn,
                refreshTokenExpiresAt: Date.now() + apiRes.data.refreshTokenExpiresIn,
                user: fbUser,
            };
        } catch (err: unknown) {
            let errorMessage = "Đăng nhập Facebook thất bại";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage += `: ${err.message}`;
            }
            return rejectWithValue(errorMessage);
        }
    }
);


export const refreshAccessToken = createAsyncThunk<
    LoginResponse,
    void,
    { rejectValue: string }
>(
    "auth/refreshAccessToken",
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = await AsyncStorage.getItem("refreshToken");

            if (!refreshToken) {
                return rejectWithValue("Không có refresh token");
            }

            const apiRes = await APIs.post(endpoints["authRefresh"], {
                refreshToken: refreshToken
            });
            console.log(apiRes);

            // Lưu lại token mới
            await saveResponseLogin(
                apiRes.data.accessToken, null,
                apiRes.data.expiresIn, null, null
            );

            return {
                accessToken: apiRes.data.accessToken,
                refreshToken: null,
                expiresAt: Date.now() + apiRes.data.expiresIn,
                refreshTokenExpiresAt: null,
                user: null,
            };
        } catch (err: unknown) {
            let errorMessage = "Làm mới token thất bại";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const checkAccessToken = createAsyncThunk<
    boolean,
    void,
    { rejectValue: string }
>(
    "auth/checkAccessToken",
    async (_, { rejectWithValue }) => {
        try {
            const expiresInStr = await AsyncStorage.getItem("expiresAt");
            console.log("expiresInStr", expiresInStr);


            if (!expiresInStr) return false;

            if (parseInt(expiresInStr, 10) > Date.now()) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
);


export const checkRefreshToken = createAsyncThunk<
    boolean,
    void,
    { rejectValue: string }
>(
    "auth/checkRefreshToken",
    async (_, { rejectWithValue }) => {
        try {
            const refreshTokenExpiresAt = await AsyncStorage.getItem("refreshTokenExpiresAt");


            if (!refreshTokenExpiresAt) return false;

            if (parseInt(refreshTokenExpiresAt, 10) > Date.now()) {
                return true; // còn hạn
            } else {
                return false; // hết hạn
            }
        } catch (err) {
            return false;
        }
    }
);

/* ---------------- LOAD USER ---------------- */
export const loadUserFromStorage = createAsyncThunk<
    LoginResponse,
    void,
    { rejectValue: string }
>(
    "auth/loadUserFromStorage",
    async (_, { rejectWithValue }) => {
        try {
            const accessToken = await AsyncStorage.getItem("accessToken");
            const refreshToken = await AsyncStorage.getItem("refreshToken");
            const expiresAt = await AsyncStorage.getItem("expiresAt");
            const refreshTokenExpiresAt = await AsyncStorage.getItem("refreshTokenExpiresAt");
            const user = await AsyncStorage.getItem("user");

            console.log("stos", refreshToken);

            if (accessToken && refreshToken && user && expiresAt && refreshTokenExpiresAt) {
                const expiresAtNum = Number(expiresAt);
                const refreshTokenExpiresAtNum = Number(refreshTokenExpiresAt);
                return {
                    accessToken,
                    refreshToken,
                    expiresAt: expiresAtNum,
                    refreshTokenExpiresAt: refreshTokenExpiresAtNum,
                    user: JSON.parse(user),
                };
            }

            return {
                accessToken: null, refreshToken: null, expiresAt: null, refreshTokenExpiresAt: null, user: null
            }; // chưa login
        } catch (err) {
            return rejectWithValue("Lỗi khi kiểm tra token");
        }
    }
);


const saveResponseLogin = async (accessToken: string | null, refreshToken: string | null, expiresIn: number | null, refreshTokenExpiresIn: number | null, user: any | null) => {
    if (accessToken) {
        console.log("save acc", refreshAccessToken);

        await AsyncStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
        console.log("save ref", refreshAccessToken);

        await AsyncStorage.setItem("refreshToken", refreshToken);
    }
    if (expiresIn) {
        const expiresAt = Date.now() + expiresIn;
        await AsyncStorage.setItem("expiresAt", expiresAt.toString());
    }
    if (refreshTokenExpiresIn) {
        const refreshTokenExpiresAt = Date.now() + refreshTokenExpiresIn;
        await AsyncStorage.setItem("refreshTokenExpiresAt", refreshTokenExpiresAt.toString());
    }
    if (user)
        await AsyncStorage.setItem("user", JSON.stringify(user));
}



export const logout = createAsyncThunk("auth/logout", async () => {
    await AsyncStorage.clear();
    return null;
});

/* ---------------- SLICE ---------------- */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Google
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
                state.refreshToken = action.payload.refreshToken;
                state.expiresAt = action.payload.expiresAt;
                state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Đăng nhập thất bại";
            })

            // Facebook
            .addCase(loginWithFacebook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithFacebook.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
                state.refreshToken = action.payload.refreshToken;
                state.expiresAt = action.payload.expiresAt;
                state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt
            })
            .addCase(loginWithFacebook.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Đăng nhập Facebook thất bại";
            })

            // Storage
            .addCase(loadUserFromStorage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.accessToken = action.payload.accessToken;
                    state.user = action.payload.user;
                    state.refreshToken = action.payload.refreshToken;
                    state.expiresAt = action.payload.expiresAt ? (action.payload.expiresAt as any) as number : 0;
                    state.refreshTokenExpiresAt = action.payload.refreshTokenExpiresAt ? (action.payload.refreshTokenExpiresAt as any) as number : 0
                }
            })
            .addCase(logout.fulfilled, (state) => {
                state.accessToken = null;
                state.user = null;
                state.refreshToken = null;
                state.expiresAt = null;
                state.refreshTokenExpiresAt = null;
                state.error = null;
                state.loading = false;
            })

            //refreshtoken
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.expiresAt = action.payload.expiresAt;
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            //checkValidToken
            .addCase(checkAccessToken.fulfilled, (state, action) => {

            })
            .addCase(checkAccessToken.rejected, (state, action) => {

            })
            .addCase(checkRefreshToken.fulfilled, (state, action) => {
                if (!action.payload) {
                    state.accessToken = null;
                    state.refreshToken = null;
                }
            })
            .addCase(checkRefreshToken.rejected, (state, action) => {
                state.error = (action.payload as string)
            });
    },
});

export default authSlice;
