import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config'; 
import { apiHeaderToken } from '../../config/api_header';

const initialState = {
    designations: [],
    pageNo: 1,
    perPageRecord: 12,
    hasMore: true,
    single_designations: [],  
    status: 'pending',
    total: 0,
    error: null
};


export const fetchDesignationList = createAsyncThunk('project/fetchDesignation', async( params , { getState , rejectWithValue} )=>{

    const { pageNo, perPageRecord } = getState().project;
    const { userLogin } = getState().auth;
    const token = userLogin.token;
    const payload = {
      page_no: pageNo.toString(),
      per_page_record: typeof params.per_page_record !== 'undefined' ? params.per_page_record : perPageRecord.toString(),
      scope_fields: typeof params.scope_fields !== 'undefined' ? params.scope_fields : ["_id", "name"],
    };
 
    try{
        const response = await axios.post( `${config.API_URL}getDesignationList`, payload,  apiHeaderToken( token ) ); 
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});




const designationSlice = createSlice({
    name: 'designation',
    initialState,
    reducers: {
        incrementPageNo(state) {
          state.pageNo += 1;
        },
    },
    extraReducers : ( builder ) => {
        builder
        .addCase( fetchDesignationList.pending , (state) => { 
                state.error = null;
        })
        .addCase( fetchDesignationList.fulfilled, (state, action )=>{ 
                state.status = 'succeeded'; 
                state.designations = action.payload.status ? action.payload.data : []; 
        })
        .addCase( fetchDesignationList.rejected, ( state, action )=>{ 
                state.error = action.payload ? action.payload.message : action.error.message;
        });
     }
});

export const { incrementPageNo } = designationSlice.actions;

export default designationSlice.reducer;