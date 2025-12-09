import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";


const initialState = {
    AppliedCandidate: {
        status: 'idle',
        error: null,
        data: [],
    },
    AppliedCandidateAts: {
        status: 'idle',
        error: null,
        data: [],
    },
    AppliedCandidateServer: {
        status: 'idle',
        error: null,
        data: [],
    },
    AppliedCandidateList: {
        status: 'idle',
        error: null,
        message: '',
        data: [],
    },
    AppliedCandidateListCount: {
        status: 'idle',
        error: null,
        message: '',
        data: [],
    },
    AppliedCandidateServerPagination: {
        status: 'idle',
        error: null,
        total: 0,
        data: [],
    },
    candidateCounter: {
        status: 'idle',
        error: null,
        data: [],
    },
    selectedJobList: null,
    resetTheValue: false
}


// Get the All record from the Job status whether Candidate applied or reject for the Jobs

export const FetchAppliedCandidateDetails = createAsyncThunk(
    "AppliedCandidate/FetchAppliedCandidateDetails",
    async (id, { rejectWithValue }) => {
        try {
            let Payloads = {
                keyword: '',
                job_id: id ? id : '',
                page_no: '1',
                per_page_record: "1000000",
                scope_fields: [
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
                    "complete_profile_status",
                    "batch_id",
                    "add_date",
                    "interview_shortlist_status",
                    "profile_avg_rating",
                    "hiring_status"
                ]
            }

            let response = await axios.post(`${config.API_URL}getAppliedJobList`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data.data;
            } else {
                return [];
            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const FetchAppliedCandidateDetailsAtsEmp = createAsyncThunk(
    "AppliedCandidateAts/FetchAppliedCandidateDetailsAtsEmp",
    async (id, { rejectWithValue }) => {
        try {
            let Payloads = {
                keyword: '',
                job_id: id ? id : '',
                page_no: '1',
                per_page_record: "4",
                scope_fields: [
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
                    "complete_profile_status",
                    "batch_id",
                    "add_date",
                    "interview_shortlist_status",
                    "profile_avg_rating",
                    "hiring_status"
                ]
            }

            let response = await axios.post(`${config.API_URL}getAppliedJobList`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data.data;
            } else {
                return [];
            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const FetchAppliedCandidateDetailsWithServerPagination = createAsyncThunk(
    "AppliedCandidateServer/FetchAppliedCandidateDetailsWithServerPagination",
    async (payloads, { rejectWithValue }) => {
        try {
            let Payloads = {
                keyword: payloads?.keyword ? payloads.keyword : '',
                job_id: payloads?.id ? payloads.id : '',
                page_no: payloads?.page_no ? payloads.page_no : '1',
                per_page_record: payloads?.per_page_record ? payloads.per_page_record : "1000000",
                form_status: payloads?.form_status ? payloads.form_status : '',
                interviewer_id: payloads?.interviewer_id ? payloads.interviewer_id : '',
                filter_city: payloads?.city ? payloads.city : '',
                filter_state: payloads?.state ? payloads.state : '',
                filter_education: payloads?.education ? payloads.education : '',
                filter_experience: payloads?.experience ? payloads.experience : '',
                scope_fields: [
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
                    "complete_profile_status",
                    "batch_id",
                    "add_date",
                    "interview_shortlist_status",
                    "profile_avg_rating",
                    "hiring_status",
                    "esic_status",
                ]
            }

            let response = await axios.post(`${config.API_URL}getAppliedJobList`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data.data;
            } else {
                return [];
            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const FetchAppliedCandidateDetailsCount = createAsyncThunk(
    "AppliedCandidateListCount/FetchAppliedCandidateDetailsCount",
    async ({ id, type }, { rejectWithValue }) => {
        try {

            let Payloads = {
                keyword: '',
                job_id: id ? id : '',
                page_no: '1',
                per_page_record: "1000000",
                is_count: "yes",
                approval_filter: type === 'approval-pending' ? 'Inprogress' : '',
            }

            let response = await axios.post(`${config.API_URL}getAppliedJobList`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data.data;
            } else {
                return [];
            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const FetchAppliedCandidateDetailsCountPagination = createAsyncThunk(
    "AppliedCandidateServerPagination/FetchAppliedCandidateDetailsCountPagination",
    async (payloads, { rejectWithValue }) => {
        try {

            let Payloads = {
                keyword: payloads?.keyword ? payloads.keyword : '',
                job_id: payloads?.id ? payloads.id : '',
                page_no: payloads?.page_no ? payloads.page_no : '1',
                per_page_record: "1000000",
                form_status: payloads?.form_status ? payloads.form_status : '',
                interviewer_id: payloads?.interviewer_id ? payloads.interviewer_id : '',
                filter_city: payloads?.city ? payloads.city : '',
                filter_state: payloads?.state ? payloads.state : '',
                filter_education: payloads?.education ? payloads.education : '',
                filter_experience: payloads?.experience ? payloads.experience : '',
                is_count: "yes",
            }

            let response = await axios.post(`${config.API_URL}getAppliedJobList`, Payloads, apiHeaderToken(config.API_TOKEN));

            if (response.status === 200) {

                return response.data.data;

            } else {

                return [];

            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const FetchCandidatesListById = createAsyncThunk(
    'AppliedCandidateList/FetchCandidatesListById',
    async (id, { rejectWithValue }) => {
        try {
            let Payloads = {
                _id: id,
                scope_fields: []
            }
            let response = await axios.post(`${config.API_URL}getCandidateById`, Payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                return response.data;
            } else {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.message);

        }
    }
)

export const FetchCandidatesListByIdInterview = createAsyncThunk(
    'FetchCandidatesListByIdInterview/FetchCandidatesListByIdInterview',
    async ( paylaods , { rejectWithValue }) => {
        try {
            let Payloads = {
                _id: paylaods?._id,
                scope_fields: []
            }
            let response = await axios.post(`${config.API_URL}getCandidateById`, Payloads, apiHeaderToken(paylaods?.token))
            if (response.status === 200) {
                return response;
            } else {
                return response;
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

// create a slice for the Get Job applied 
const JobAppliedCandidateSlice = createSlice({
    name: "JobAppliedCandidateSlice",
    initialState,
    reducers: {
        setSelecteJobList: (state, action) => {
            state.selectedJobList = action.payload;
        },
        setReset: (state, action) => {
            state.resetTheValue = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchAppliedCandidateDetails.pending, (state) => {
                state.AppliedCandidate.status = 'loading';
            })
            .addCase(FetchAppliedCandidateDetails.fulfilled, (state, action) => {
                state.AppliedCandidate.data = action.payload;
                state.AppliedCandidate.status = 'success'
            })
            .addCase(FetchAppliedCandidateDetails.rejected, (state, action) => {
                state.AppliedCandidate.error = action.error;
                state.AppliedCandidate.status = 'failed'
            })
            .addCase(FetchAppliedCandidateDetailsAtsEmp.pending, (state) => {
                state.AppliedCandidateAts.status = 'loading';
            })
            .addCase(FetchAppliedCandidateDetailsAtsEmp.fulfilled, (state, action) => {
                state.AppliedCandidateAts.data = action.payload;
                state.AppliedCandidateAts.status = 'success'
            })
            .addCase(FetchAppliedCandidateDetailsAtsEmp.rejected, (state, action) => {
                state.AppliedCandidateAts.error = action.error;
                state.AppliedCandidateAts.status = 'failed'
            })
            .addCase(FetchAppliedCandidateDetailsWithServerPagination.pending, (state) => {
                state.AppliedCandidateServer.status = 'loading';
            })
            .addCase(FetchAppliedCandidateDetailsWithServerPagination.fulfilled, (state, action) => {
                state.AppliedCandidateServer.data = action.payload;
                state.AppliedCandidateServer.status = 'success'
            })
            .addCase(FetchAppliedCandidateDetailsWithServerPagination.rejected, (state, action) => {
                state.AppliedCandidateServer.error = action.error;
                state.AppliedCandidateServer.status = 'failed'
            })
            .addCase(FetchAppliedCandidateDetailsCountPagination.pending, (state) => {
                state.AppliedCandidateServerPagination.status = 'loading';
            })
            .addCase(FetchAppliedCandidateDetailsCountPagination.fulfilled, (state, action) => {
                state.AppliedCandidateServerPagination.data = action.payload;
                state.AppliedCandidateServerPagination.total = action.payload.length;
                state.AppliedCandidateServerPagination.status = 'success'
            })
            .addCase(FetchAppliedCandidateDetailsCountPagination.rejected, (state, action) => {
                state.AppliedCandidateServerPagination.error = action.error;
                state.AppliedCandidateServerPagination.status = 'failed'
            })
            .addCase(FetchCandidatesListById.pending, (state) => {
                state.AppliedCandidateList.status = 'loading';
            })
            .addCase(FetchCandidatesListById.fulfilled, (state, action) => {
                state.AppliedCandidateList.data = action.payload?.data;
                state.AppliedCandidateList.message = action.payload?.message
                state.AppliedCandidateList.status = 'success'
            })
            .addCase(FetchCandidatesListById.rejected, (state, action) => {
                state.AppliedCandidateList.error = action.payload?.message
                state.AppliedCandidateList.status = 'failed';
            })
            .addCase(FetchAppliedCandidateDetailsCount.pending, (state) => {
                state.AppliedCandidateListCount.status = 'loading';
            })
            .addCase(FetchAppliedCandidateDetailsCount.fulfilled, (state, action) => {
                state.AppliedCandidateListCount.data = action.payload;
                state.AppliedCandidateListCount.message = action.payload
                state.AppliedCandidateListCount.status = 'success'
            })
            .addCase(FetchAppliedCandidateDetailsCount.rejected, (state, action) => {
                state.AppliedCandidateListCount.error = action.payload
                state.AppliedCandidateListCount.status = 'failed';
            })
    }
})

export const { setSelecteJobList, setReset } = JobAppliedCandidateSlice.actions
export default JobAppliedCandidateSlice.reducer;