import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config'; 
import { apiHeaderToken } from '../../config/api_header';

const initialState = {
    department: [],
    single_department: [], 
    department_ddl: [],  
    error: null
};


export const fetchDepartmentDropDownList = createAsyncThunk('department/fetchDepartment', async( params , { getState , rejectWithValue} )=>{
 
    const { userLogin } = getState().auth;
    // const token = userLogin.token;
    const payload = {
      page_no: 1,
      per_page_record: 500,
      scope_fields: ["_id", "name"],
    };
 
    try{
        const response = await axios.post( `${config.API_URL}getDepartmentList`, payload,  apiHeaderToken( config.API_TOKEN ) );
        return response.data;
    }catch( error ){
        return rejectWithValue(error.message);
    }
});

export const FetchDepartmentListDropDown = createAsyncThunk(
    'department/FetchDepartmentListDropDown',
    async (params, { rejectWithValue }) => {
        try {
            const payload = {
                page_no: 1,
                keyword:params,
                per_page_record: 10,
                scope_fields: ["_id", "name"],
            };
            const response = await axios.post( `${config.API_URL}getDepartmentList`, payload,  apiHeaderToken( config.API_TOKEN ) );
            if(response.status === 200){
                return response.data.data?.map((item , key) => {
                    return {
                        value: item._id,
                        label: item.name
                    }
                })
            }else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)


const departmentSlice = createSlice({
    name: 'department',
    initialState,
    reducers: {},
    extraReducers : ( builder ) => {
        builder
        .addCase( fetchDepartmentDropDownList.pending , (state) => { 
                state.error = null;
        })
        .addCase( fetchDepartmentDropDownList.fulfilled, (state, action )=>{ 
                state.status = 'succeeded'; 
                state.department_ddl = action.payload.status ? action.payload.data : []; 
        })
        .addCase( fetchDepartmentDropDownList.rejected, ( state, action )=>{ 
                state.error = typeof action.payload?.message === 'undefined' ? action.payload?.message : action.error?.message;
        });
     }
}); 

export default departmentSlice.reducer;