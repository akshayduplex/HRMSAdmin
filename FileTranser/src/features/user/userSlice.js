import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const response = await axios.get('/api/users');
  return response.data;
});

export const addUser = createAsyncThunk('user/addUser', async (user) => {
  const response = await axios.post('/api/users', user);
  return response.data;
});

export const updateUser = createAsyncThunk('user/updateUser', async (user) => {
  const response = await axios.put(`/api/users/${user.id}`, user);
  return response.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (userId) => {
  await axios.delete(`/api/users/${userId}`);
  return userId;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
