import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config'; 
import { apiHeaderToken } from '../../config/api_header';

const initialState = {
    job_types: [],
    single_job_type: [], 
    job_type_ddl: [],  
    error: null,
    status:'idle'
};


export const fetchJobTypeDropDownList = createAsyncThunk('jobTypes/fetchJobTypes', async( _ , { getState , rejectWithValue} )=>{
 
    const { userLogin } = getState().auth;
    const token = userLogin.token;
    const payload = {
      page_no: 1,
      per_page_record: 10,
      scope_fields: ["_id", "name"],
      keyword:'',
      status:'Active'
    };
 
    try{
        const response = await axios.post( `${config.API_URL}getJobTypeList`, payload,  apiHeaderToken( token ) ); 
        if(response.status === 200){
            return response.data.data
        }else {
            return [];
        }
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});


const jobTypesSlice = createSlice({
    name: 'job_type',
    initialState,
    reducers: {},
    extraReducers : ( builder ) => {
        builder
        .addCase( fetchJobTypeDropDownList.pending , (state) => { 
                state.status = 'loading'
                state.error = null;
        })
        .addCase( fetchJobTypeDropDownList.fulfilled, (state, action )=>{ 
                state.status = 'succeeded'; 
                state.job_type_ddl = action.payload
        })
        .addCase( fetchJobTypeDropDownList.rejected, ( state, action )=>{ 
                state.error = action.error;
        });
     }
}); 

export default jobTypesSlice.reducer;