import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";


const initialState = {
    AppliedCandidate:{
        status:'idle',
        error:null,
        data:[],
    },
    AppliedCandidateList:{
        status:'idle',
        error:null,
        message:'',
        data:[],
    },
    candidateCounter: {
        status: 'idle',
        error: null,
        data: [],
    }
}


// Get the All record from the Job status whether Candidate applied or reject for the Jobs

export const FetchAppliedCandidateDetails = createAsyncThunk(
    "AppliedCandidate/FetchAppliedCandidateDetails",
    async (id , {rejectWithValue}) => {
        try {
            let Payloads = {
                keyword:'',
                job_id: id ? id : '',
                page_no:'1',
                per_page_record:"100",
                scope_fields:[
                    "_id",
                    "job_id",
                    "job_title",
                    "job_type",
                    "project_id",
                    "project_name",
                    "department",
                    "name",
                    "email",
                    "mobile_no",
                    "designation",
                    "total_experience",
                    "relevant_experience",
                    "location",
                    "current_ctc",
                    "notice_period",
                    "expected_ctc",
                    "resume_file",
                    "current_employer",
                    "current_employer_mobile",
                    "last_working_day",
                    "applied_from",
                    "form_status",
                    "applied_jobs",
                    "complete_profile_status"
                ]
            }

            let response = await axios.post(`${config.API_URL}getAppliedJobList` , Payloads , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                return response.data.data;
            }else {
                return [];
            }

        } catch (error) {
            console.log(error.message);
            return rejectWithValue(error.message);
        }
    }
)

export const FetchCandidatesListById = createAsyncThunk(
    'AppliedCandidateList/FetchCandidatesListById',
    async (id , {rejectWithValue}) => {
        try {
            let Payloads = {
                _id:id,
                scope_fields:[]
            }
            let response = await axios.post(`${config.API_URL}getCandidateById` , Payloads , apiHeaderToken(config.API_TOKEN))
            console.log(response.data , 'this is candidate response here');
            if(response.status === 200){
                return response.data;
            }else {
                return response.data;
            }
        } catch (error) {
            console.log(error.message);
            return rejectWithValue(error.message);
            
        }
    }
)

// export const FetchAppliedCandidateDetails = createAsyncThunk(
//     "AppliedCandidate/FetchAppliedCandidateDetails",
//     async (id , {rejectWithValue}) => {
//         try {
//             let Payloads = {
//                 keyword:'',
//                 job_id: id ? id : '',
//                 page_no:'1',
//                 per_page_record:"100",
//                 scope_fields:[
//                     "_id",
//                     "job_id",
//                     "job_title",
//                     "job_type",
//                     "project_id",
//                     "project_name",
//                     "department",
//                     "name",
//                     "email",
//                     "mobile_no",
//                     "designation",
//                     "total_experience",
//                     "relevant_experience",
//                     "location",
//                     "current_ctc",
//                     "notice_period",
//                     "expected_ctc",
//                     "resume_file",
//                     "current_employer",
//                     "current_employer_mobile",
//                     "last_working_day",
//                     "applied_from",
//                     "form_status",
//                     "applied_jobs",
//                 ]
//             }

//             let response = await axios.post(`${config.API_URL}getAppliedJobList` , Payloads , apiHeaderToken(config.API_TOKEN));
//             if(response.status === 200){
//                 return response.data.data;
//             }else {
//                 return [];
//             }

//         } catch (error) {
//             console.log(error.message);
//             return rejectWithValue(error.message);
//         }
//     }
// )





// create a slice for the Get Job applied 
const JobAppliedCandidateSlice = createSlice({
    name:"JobAppliedCandidateSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(FetchAppliedCandidateDetails.pending , (state) => {
             state.AppliedCandidate.status = 'loading';
         })
         .addCase(FetchAppliedCandidateDetails.fulfilled , (state , action) => {
            state.AppliedCandidate.data = action.payload;
            state.AppliedCandidate.status = 'success'
         })
         .addCase(FetchAppliedCandidateDetails.rejected , (state , action) => {
             state.AppliedCandidate.error = action.error;
             state.AppliedCandidate.status = 'failed'
         })
         .addCase(FetchCandidatesListById.pending , (state) => {
            state.AppliedCandidateList.status = 'loading';
         })
         .addCase(FetchCandidatesListById.fulfilled , (state , action) => {
             state.AppliedCandidateList.data = action.payload?.data;
             state.AppliedCandidateList.message = action.payload?.message
             state.AppliedCandidateList.status = 'success'
         })
         .addCase(FetchCandidatesListById.rejected , (state , action) => {
             state.AppliedCandidateList.error = action.payload?.message
             state.AppliedCandidateList.status = 'failed';
         })
    }
})


export default JobAppliedCandidateSlice.reducer;