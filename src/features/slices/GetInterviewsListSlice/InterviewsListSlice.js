import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";


const initialState = {
    InterviewsList: {
        status:'idle',
        data: [],
        error: null
    }
}


export  const GetInterviewsList = createAsyncThunk(
      "InterviewsList/GetInterviewsList",
      async (payloads , {rejectWithValue}) => {
          try {
            let response = await axios.post(`${config.API_URL}getInterviewCandidateList` , payloads , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                return response.data.data;
            }else {
                return response.data
            }
          } catch (error) {
             console.log(error);
             return rejectWithValue(error.response.data)
          }
      }
)


const interviewListSlice = createSlice({
    name:'interviewListSlice',
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
         .addCase(GetInterviewsList.pending , (state) => {
               state.InterviewsList.status = 'loading';
         })
         .addCase(GetInterviewsList.fulfilled , (state , action) => {
               state.InterviewsList.status = 'success';
               state.InterviewsList.data = action.payload;
         })
         .addCase(GetInterviewsList.rejected , (state , action) => {
            state.InterviewsList.status = 'failed';
            state.InterviewsList.error = action.payload;
         })
    }
})

export default interviewListSlice.reducer;