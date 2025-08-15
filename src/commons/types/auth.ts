export interface User {
  id?: string;
  name: string;
  email: string;
  //   avatar?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;
}
