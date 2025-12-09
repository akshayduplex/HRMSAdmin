import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";


const initialState = {
    employeeList: {
        data: [],
        status: 'idle',
        error: null
    },
    addManager:{
        data:[],
        status: 'idle',
        error: null
    },
    DeleteManagerList:{
        data: [],
        status: 'idle',
        error:null
    },
    getDesignationEmployeeList: {
        data: [],
        status: 'idle',
        error: null
    }
}


export const GetEmployeeListDropDown = createAsyncThunk(
    'employeeList/getEmployeeListDropDown',
    async (input, { rejectWithValue }) => {
        try {
            let payloads = {
                "keyword": input,
                "page_no": "1",
                "per_page_record":"10",
                "scope_fields": ["employee_code", "name", "email", "mobile_no", "_id" , 'designation'],
                "profile_status": "Active",
            }
            let response = await axios.post(`${config.API_URL}getEmployeeList` , payloads , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                 return response.data?.data?.map((key) => {
                    return {
                        label: `${key?.name} (${key?.employee_code})`,
                        value: key._id,
                        emp_code:key?.employee_code,
                        designation:key?.designation
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

export const GetEmployeeListDropDownScroll = createAsyncThunk(
    'employeeList/getEmployeeListDropDown',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getEmployeeList` , payloads , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                 return response.data?.data?.map((key) => {
                    return {
                        label: `${key?.name} (${key?.employee_code})`,
                        value: key._id,
                        emp_code:key?.employee_code,
                        designation:key?.designation,
                        email:key?.email,
                        name:key?.name
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

// Add manger List DropDown -> 
export const AddManagerList = createAsyncThunk(
    'employeeList/addManagerList',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}updateReportingManagerData` , payloads , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                return response.data;
            }else{
                return response.data;
            }
            
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
export const DeleteManagerList = createAsyncThunk(
    'employeeList/DeleteManagerList',
    async (payloads, { rejectWithValue }) => {
        try {

            let response = await axios.post(`${config.API_URL}deleteReportingManagerData` , payloads , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                return response.data;
            }else{
                return response.data;
            }
            
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
export const GetDesignationWiseEmployeeList = createAsyncThunk(
     "getDesignationEmployeeList/GetDesignationWiseEmployeeList",
     async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getDesignationWiseEmployeeList` , payloads , apiHeaderToken(config.API_TOKEN))
            if(response.status === 200){
                return response.data;
            }else {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
     }
)


//  Here create a slice data from the Employee List Dropdown ->   
const employeeListSlice = createSlice({
    name: 'employeeList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(GetEmployeeListDropDown.pending , (state) => {
            state.employeeList.status = 'loading'
        })
        .addCase(GetEmployeeListDropDown.fulfilled , (state , action) => {
            state.employeeList.status = 'succeeded'
            state.employeeList.data = action.payload
        })
        .addCase(GetEmployeeListDropDown.rejected , (state , action) => {
            state.employeeList.status = 'failed'
            state.employeeList.error = action.payload
        })
        .addCase(GetDesignationWiseEmployeeList.pending , (state) => {
            state.getDesignationEmployeeList.status = 'Pending'
        })
        .addCase(GetDesignationWiseEmployeeList.fulfilled , (state , action) => {
            state.getDesignationEmployeeList.status = 'succeeded'
            state.getDesignationEmployeeList.data = action.payload
            state.getDesignationEmployeeList.error = null
        })
        .addCase(GetDesignationWiseEmployeeList.rejected , (state , action) => {
            state.getDesignationEmployeeList.status = 'failed'
            state.getDesignationEmployeeList.error = action.payload
        })
    }
})


export default employeeListSlice.reducer