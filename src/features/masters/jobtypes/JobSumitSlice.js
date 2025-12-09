import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../../config/config";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../../../config/api_header";
import axios from "axios";


const initialState = {
    loading:'idle',
    message:null,
    data:[]
}

export const JobSubmit = createAsyncThunk(
    'createJobSubmitSlice',
    async (formData, { rejectWithValue }) => {
         try {
            let response = await axios.post(`${config.API_URL}addJob` , formData , apiHeaderToken(config.API_TOKEN))
            if(response.status === 200){
                return response.data.data;
            }else {
                return [];
            }
         } catch (error) {
            console.log(error , 'this is error')
            return rejectWithValue(error.response.data)
         }
    }
)

export const EditJob = createAsyncThunk(
    'createJobSubmitSlice',
    async (formData, { rejectWithValue }) => {
         try {
            let response = await axios.post(`${config.API_URL}editJob` , formData , apiHeaderToken(config.API_TOKEN))
            if(response.status === 200){
                return response.data;
            }else {
                return response.data;
            }
         } catch (error) {
            console.log(error , 'this is error')
            return rejectWithValue(error.response.data)
         }
    }
)

const createJobSubmitSlice = createSlice({
    name:'JobSubmit',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(JobSubmit.pending, (state, action) => {
            state.loading = 'loading';
        })
        .addCase(JobSubmit.fulfilled , (state , action) => {
            state.loading = 'success';
            state.data = action.payload;
            state.message = action.payload?.message
        })
        .addCase(JobSubmit.rejected , (state , action) => {
            state.loading = 'failed';
            state.message = action.payload?.message
        })
    }
})

export default createJobSubmitSlice.reducer
