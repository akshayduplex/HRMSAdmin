import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const initialState = {
    getJobList: {
        status: 'idle',
        data: [],
        error: null
    },
    getJobListById: {
        status:'idle',
        data:[],
        error:null
    },
    changeJobStatus: {
       status:'idle',
       data:[],
       error:null,
       message:'',
    },
    cloneJob: {
        status:'idle',
        data:[],
        error:null,
        message:'',
    },
    getUpcomingJobList: {
        status:'idle',
        data:[],
        error:null,
        message:''
    }
}


// create a function to get the jobs List
export const GetJobList = createAsyncThunk(
    'getJobList/GetJobList',
    async (payload, { rejectWithValue }) => {
        try {
            // {"keyword":"","department":"","job_title":"General Manger","location":"","job_type":"Part Time","salary_range":"6 Lpa - 9 Lpa","page_no":"1","per_page_record":"1","scope_fields":["_id","project_name","department","job_title","job_type","experience","location","salary_range"], "status":"Published" }
            let response = await axios.post(`${config.API_URL}getJobList` , payload , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                return response.data.data;
            }else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const GetJobListById = createAsyncThunk(
    'getJobListById/GetJobListById',
    async (id , {rejectWithValue}) => {
        let Payloads = {
            _id:id,
            status:[]
        }
        try {
            let response = await axios.post(`${config.API_URL}getJobById` , Payloads ,  apiHeaderToken(config.API_TOKEN))
            console.log(response , 'this is direct response ');
            if(response.status === 200){
                return response.data.data;
            }else {
                return []
            }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// change the status of job list
export const changeStatusOfJob = createAsyncThunk(
    'changeJobStatus/changeStatusOfJob',
    async (payload, { rejectWithValue }) =>{
         try {
            let response = await axios.post(`${config.API_URL}changeJobStatus` , payload , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                toast.success(response.data?.message)
                return response.data
            }else {
                toast.warn(response.data?.message)
                return response.data
            }
         } catch (error) {
            toast.warn(error?.message)
            return rejectWithValue(error.message);
         }
    }
)

// clone job status 
export const CloneJobs = createAsyncThunk(
    'cloneJob/CloneJobs',
    async (payload, { rejectWithValue }) =>{
         try {
            let response = await axios.post(`${config.API_URL}cloneJob` , payload , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                toast.success(response.data?.message)
                return response.data
            }else {
                toast.warn(response.data?.message)
                return response.data
            }
         } catch (error) {
            toast.warn(error?.response?.data?.message)
            return rejectWithValue(error.message);
         }
    }
)

export const UpcomingListDetails = createAsyncThunk(
    'getUpcomingJobList/UpcomingListDetails',
    async ( payloads , {rejectWithValue} ) => {
        try {
            const response = await axios.post(`${config.API_URL}getUpcomingInterViewList` , payloads , apiHeaderToken(config.API_TOKEN))
            if(response.status === 200){
                return response.data.data;
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }

    }
)

const JobsSlices = createSlice({
    name:'jobSlices',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(GetJobList.pending , (state , action) => {
            state.getJobList.status = 'loading';
        })
        .addCase(GetJobList.fulfilled , (state  , action) => {
            state.getJobList.status = 'success';
            state.getJobList.data = action.payload;
        })
        .addCase(GetJobList.rejected , (state , action) => {
            state.getJobList.status = 'failed'
            state.getJobList.error = action.payload;
        })
        .addCase(GetJobListById.pending , (state) => {
            state.getJobListById.status = 'loading';
        })
        .addCase(GetJobListById.fulfilled , (state , action) => {
            state.getJobListById.status = 'success';
            state.getJobListById.data = action.payload;
        })
        .addCase(GetJobListById.rejected , (state , action) => {
            state.getJobListById.status = 'failed';
            state.getJobListById.error = action.payload;
        })
        .addCase(changeStatusOfJob.pending , (state) => {
            state.changeJobStatus.status = 'loading';
        })
        .addCase(changeStatusOfJob.fulfilled , (state , action) => {
            state.changeJobStatus.status = 'success';
            state.changeJobStatus.data = action.payload;
        })
        .addCase(changeStatusOfJob.rejected , (state , action) => {
            state.cloneJob.status = 'failed';
            state.changeJobStatus.error = action.payload;
        })
        .addCase(CloneJobs.pending , (state) => {
            state.cloneJob.status = 'loading';
        })
        .addCase(CloneJobs.fulfilled , (state , action) => {
            state.cloneJob.status = 'success';
            state.cloneJob.data = action.payload;
        })
        .addCase(CloneJobs.rejected , (state , action) => {
            state.cloneJob.status = 'failed';
            state.cloneJob.error = action.payload;
        })
        .addCase(UpcomingListDetails.pending , (state) => {
            state.getUpcomingJobList.status = 'loading'
        })
        .addCase(UpcomingListDetails.fulfilled , (state , action) => {
            state.getUpcomingJobList.status = 'success';
            state.getUpcomingJobList.data = action.payload;
        })
        .addCase(UpcomingListDetails.rejected , (state , action) => {
            state.getUpcomingJobList.status = 'failed'
            state.getUpcomingJobList.error = action.error;
        })
    }
})

export default JobsSlices.reducer;
