import { createSlice , createAsyncThunk  } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";


const initialState = {
    TemplateList: {
        status:'idle',
        data: [],
        error: null
    }
}

export const JobTemplateList = createAsyncThunk(
    'TemplateList/JobTemplateList',
    async (payloads , { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getJobsTemplateList` , payloads , apiHeaderToken( config.API_TOKEN ));
            if(response.status === 200){
                return response.data;
            }else {
                return response.data
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }
    }
)

export const AddJobTemplate = createAsyncThunk(
    'AddJobTemplate',
    async (payloads , { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}addJobsTemplate` , payloads , apiHeaderToken( config.API_TOKEN ));
            if(response.status === 200){
                return response.data;
            }else {
                return response.data
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


const JobTemplateSlice = createSlice(
    {
        name: 'TemplateList',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
             .addCase(JobTemplateList.pending , (state , action) => {
                 state.TemplateList.status ='loading'
             })
             .addCase(JobTemplateList.fulfilled , (state , action) => {
                state.TemplateList.status = 'success'
                state.TemplateList.data = action.payload
             })
             .addCase(JobTemplateList.rejected , (state , action) => {
                state.TemplateList.status = 'failed'
                state.TemplateList.error = action.payload;
             })
        }
    }
)

export default JobTemplateSlice.reducer;