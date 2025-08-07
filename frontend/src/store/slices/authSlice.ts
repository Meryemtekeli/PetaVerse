import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from '../../services/firebase';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profileImageUrl?: string;
  city?: string;
  country?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username?: string; email?: string; password: string }, { rejectWithValue }) => {
    try {
      // E-posta ile giriş
      const email = credentials.email || credentials.username;
      if (!email) throw new Error('E-posta gereklidir');
      const userCredential = await signInWithEmailAndPassword(auth, email, credentials.password);
      const user = userCredential.user;
      // Firebase token al
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      return {
        user: {
          id: user.uid,
          username: user.displayName || '',
          email: user.email || '',
          role: 'user',
        },
        token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Giriş başarısız');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: {
    username?: string;
    email: string;
    password: string;
    role?: string;
    firstName?: string;
    lastName?: string;
  }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      // Firestore'a kullanıcıyı rol ile kaydet
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: userData.username || '',
        email: user.email || '',
        role: userData.role || 'user',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        createdAt: new Date().toISOString(),
      });
      // Firebase token al
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      return {
        user: {
          id: user.uid,
          username: userData.username || '',
          email: user.email || '',
          role: userData.role || 'user',
        },
        token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kayıt başarısız');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    return null;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kullanıcı bilgileri alınamadı');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer; 