import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";
import { toast } from "react-toastify";
const initialState = {
       shortList: {
        status:'idle',
        error:null,
        data:[],
       },
       removedCandidate: {
          status:'idle',
          error:null,
          data:[]
       }
}


export const ShortListCandidates = createAsyncThunk(
    'shortlistCandidates/shortlistCandidates',
    async (payloads , {rejectWithValue}) => {
        try {
            let response = await axios.post(`${config.API_URL}/shortListCandidates` , payloads ,apiHeaderToken(config.API_TOKEN) );
            if(response.status === 200){
                toast.success(response.data.message)
                return response.data;
            }else {
                return response.data
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const DeleteAndRemoved = createAsyncThunk(
    'removedCandidate/DeleteAndRemoved',
    async (payloads , {rejectWithValue}) => {
        try {
            let response = await axios.post(`${config.API_URL}/rejectDeleteInterview` , payloads ,apiHeaderToken(config.API_TOKEN) );
            if(response.status === 200){
                toast.success(response.data.message)
                return response.data;
            }else {
                return response.data
            }
        } catch (error) {
            console.log(error , 'this is some issue related tow the data');
            console.log(error.response.data.message)
            return rejectWithValue(error.response.data.message);
        }
    }
)


const shortListSlice = createSlice({
    name:'shortList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
           .addCase(ShortListCandidates.pending , (state) => {
                   state.shortList.status = 'loading';
           })
           .addCase(ShortListCandidates.fulfilled , (state , action) => {
                   state.shortList.status = 'success'
                   state.shortList.data = action.payload;
           })
           .addCase(ShortListCandidates.rejected , (state , action) => {
                  state.shortList.status = 'rejected'
                  state.shortList.error = action.error
           })
           .addCase(DeleteAndRemoved.pending , (state) => {
                 state.removedCandidate.status = 'loading'
           })
           .addCase(DeleteAndRemoved.fulfilled , (state , action) => {
                 state.removedCandidate.status = 'success'
                 state.removedCandidate.data = action.payload
           })
           .addCase(DeleteAndRemoved.rejected , (state , action) => {
                 state.removedCandidate.status = 'rejected'
                 state.removedCandidate.error = action.error
           })
    }
})

export default shortListSlice.reducer;