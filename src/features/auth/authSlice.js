import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config';

const initialState = {
  userLogin: null,
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => { 
    try {
      const response = await axios.post( `${config.API_URL}loginUserWithEmail`, credentials );
      localStorage.setItem('admin_check_login', JSON.stringify( response.data.data ));
      // sessionStorage.setItem('admin_check_login' , JSON.stringify( response.data.data ));
      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async (credentials, { rejectWithValue }) => { 
    try {
      const response = await axios.post( `${config.API_URL}loginUserWithEmail`, credentials ); 
      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
}); 


export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (credentials, { rejectWithValue }) => { 
  try {
    const response = await axios.post( `${config.API_URL}verifyLoginOtp`, credentials ); 
    return response.data;
  }catch(error){
    return rejectWithValue(error.response.data);
  }
});  


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userLogin = action.payload;
      localStorage.setItem('admin_role_user', JSON.stringify(action.payload));
      // Sets the Data In sesstion Storages ->   
      // sessionStorage.setItem('admin_role_user' , JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.userLogin = null;
      state.otpSent = false;
      state.otpVerified = false;
      localStorage.removeItem('admin_role_user');
    },
    clearAllAuth: (state) => {
      // Clear all localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      // Reset all auth state
      state.userLogin = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userLogin = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        console.log( action.payload );
        state.loading = false;
        state.error = action.payload ? action.payload.message : action.error.message;
      })
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : action.error.message;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state,action) => {
        state.loading = false;
        state.otpVerified = true;
        state.userLogin = action.payload.data ;
        state.error = null;
        // localStorage.clear();
        // window.sessionStorage.clear();
        if(action.payload.data?.user_type === 'employee'){
           window.sessionStorage.setItem('employeeLogin',JSON.stringify(action.payload.data))
           localStorage.setItem('employeeLogin',JSON.stringify(action.payload.data))
        }else {
          localStorage.setItem('admin_role_user', JSON.stringify(action.payload.data));
          // sessionStorage.setItem('admin_role_user' , JSON.stringify(action.payload))
        }

        localStorage.removeItem('admin_check_login');
        // sessionStorage.removeItem('admin_check_login')
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : action.error.message;
      });
  },
});

export const { setUser, logout , clearAllAuth } = authSlice.actions;
export default authSlice.reducer;
