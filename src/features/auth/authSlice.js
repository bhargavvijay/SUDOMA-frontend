import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUser,
  loginUser,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
  fetchUser,
} from './authApi';

const initialState = {
  user: JSON.parse(localStorage.getItem("user"))||null, // Stores authenticated user data
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  mailSent: false, // Indicates if reset password email was sent successfully
  passwordReset: false, // Indicates if password was reset successfully
  userValid:false,
};

// Async thunk for checking session
export const checkAuthAsync = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    // Try to get user from localStorage first
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      // If user exists in localStorage, verify with backend
      try {
        await checkAuth(); // Just verify with backend
        return JSON.parse(cachedUser); // Return the cached user data
      } catch (error) {
        // If backend verification fails, clear localStorage
        localStorage.removeItem('user');
        throw error;
      }
    } else {
      // No user in localStorage, check session with backend
      const response = await checkAuth();
      // If backend says session is valid, save user to localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    return rejectWithValue('Session invalid or expired');
  }
});

// Async thunk for creating user
export const createUserAsync = createAsyncThunk('auth/createUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await createUser(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to register');
  }
});

// Async thunk for login
export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginUser(userData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); // Pass the error message to the reducer
    }
  }
);

// Async thunk for requesting password reset
export const resetPasswordRequestAsync = createAsyncThunk(
  'auth/resetPasswordRequest',
  async (email, { rejectWithValue }) => {
    try {
      const response = await resetPasswordRequest(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send password reset email');
    }
  }
);

export const fetchUserAsync = createAsyncThunk(
  'auth/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
)

// Async thunk for resetting password
export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);  
      const response = await resetPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null; // Clear user state
      state.status = 'idle'; // Reset status
      state.error = null; // Clear error state
      localStorage.removeItem('user'); // Clear localStorage on logout

    },
    resetMailSent: (state) => {
      state.mailSent = false;
    },
    resetPasswordState: (state) => {
      state.passwordReset = false;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.userValid = true;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.userValid = false;
      })
      // Create User
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Error while registering user
      })

      // Login User
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));

      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Reset Password Request
      .addCase(resetPasswordRequestAsync.pending, (state) => {
        state.status = 'loading';
        state.mailSent = false;
        state.error = null;
      })
      .addCase(resetPasswordRequestAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.mailSent = true; // Email sent successfully
      })
      .addCase(resetPasswordRequestAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = 'loading';
        state.passwordReset = false;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.passwordReset = true; // Password reset successfully
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, resetError, clearPasswordResetState, resetMailSent, resetPasswordState } = authSlice.actions;

export default authSlice.reducer;

export const selectMailSent = (state) => state.auth.mailSent;
export const selectError = (state) => state.auth.error;
export const selectStatus = (state) => state.auth.status;
export const selectPasswordReset = (state) => state.auth.passwordReset; 
export const selectIsUserChecked = (state) => state.auth.userValid;
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
