import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken , apiHeaderTokenMultiPart } from "../../../config/api_header";

const initialState = {
    LeaveCategory: {
        status:'idle',
        data: [],
        error: null
    },
    Employee: {
       status:'idle',
       data:[],
       error:null
    },
    HandOverFNF: {
        status:'idle',
        data:[],
        error:null
    }
}


export const LeaveCategoryDropDown = createAsyncThunk(
    'LeaveCategory/LeaveCategoryDropDown',
    async (input , {rejectWithValue}) => {
         try {
            let Payloads = { 
                "keyword": input,
                "page_no":"1",
                "per_page_record":"10",
                "scope_fields":["_id","name","sort_name"],
                "status":"Active"
            }
            let response = await axios.post(`${config.API_URL}getLeaveTypeList` , Payloads , apiHeaderToken(config.API_TOKEN) );
            if(response.status === 200){
                return response.data;
            }else {
                return response.data;
            }
         } catch (error) {
            return rejectWithValue(error.message);
         }
    }
)

export const getEmployeeById = createAsyncThunk(
      "Employee/getEmployeeById",
      async (input, { rejectWithValue }) => {
         try {
            let Payloads = {
                "_id":input,
                "scope_fields":[]
            }

            let response = await axios.post(`${config.API_URL}getEmployeeById` , Payloads , apiHeaderToken(config.API_TOKEN) );
            if(response.status === 200){
                return response.data.data;
            }else {
                return response.data;
            }
         } catch (error) {
            return rejectWithValue(error.message);
         }
      }
)

export const HandOverFNF = createAsyncThunk(
      "HandOverFNF/HandOverFNF",
      async ( payload , { rejectWithValue }) => {
         try {

            let response = await axios.post(`${config.API_URL}employeeFnf` , payload , apiHeaderTokenMultiPart(config.API_TOKEN) );
            if(response.status === 200){
                return response.data;
            }else {
                return response.data;
            }
         } catch (error) {
            return rejectWithValue(error.response);
         }
      }
)


const LeaveSlices = createSlice({
    name: 'LeaveSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(LeaveCategoryDropDown.pending , (state) => {
             state.LeaveCategory.status = 'loading';
             state.LeaveCategory.error = null;
         })
         .addCase(LeaveCategoryDropDown.fulfilled , (state , action) => {
            state.LeaveCategory.status = 'succeeded';
            state.LeaveCategory.data = action.payload;
         })
         .addCase(LeaveCategoryDropDown.rejected , (state , action) => {
            state.LeaveCategory.status = 'failed';
            state.LeaveCategory.error = action.payload;
         })
         .addCase(getEmployeeById.pending , (state , action) => {
            state.Employee.status = 'loading';
            state.Employee.error = null;
         })
         .addCase(getEmployeeById.fulfilled , (state , action) => {
            state.Employee.status = 'succeeded';
            state.Employee.data = action.payload;
         })
         .addCase(getEmployeeById.rejected , (state , action) => {
            state.Employee.status = 'Failed';
            state.Employee.error = action.error;
            state.Employee.data = action.payload;
         })
         .addCase(HandOverFNF.pending , (state) => {
            state.HandOverFNF.status = 'loading'
         })
         .addCase(HandOverFNF.fulfilled , (state , action) => {
            state.HandOverFNF.status = 'success';
            state.HandOverFNF.data = action.payload;
         })
         .addCase(HandOverFNF.rejected , (state , action) => {
            state.HandOverFNF.status = 'failed';
            state.HandOverFNF.error = action.error;
            state.HandOverFNF.data = action.payload
         })
    }
})

export default LeaveSlices.reducer;