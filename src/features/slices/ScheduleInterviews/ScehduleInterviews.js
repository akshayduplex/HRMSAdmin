import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";

const initialState = {
      interviewDuration:'15 min',
      interviewTime:'',
      interviewDate:new Date(),
      interviewLocation:'',
      interviewType:'Online',
      interviewStatus:'',
      interviewLink:'',
      interviewStage:'1st Round',
      interviewHost:'One-To-One',
      interviewers:[],
      venueLocation:'',
      getInterviewerList:{
          status:'idle',
          error:null,
          data:[]
      },
      getJobDetailsList: {
        status: 'idle',
        error: null,
        data: []
      },
      userDetails: {
        status:'idle',
        error:null,
        data:[]
      }
}

export const GetEmployeeList = createAsyncThunk(
    'getInterviewerList/getEmployeeList',
    async () => {
       try {
        let payloads = {"keyword":"","page_no":"1","per_page_record":"100","scope_fields":[], "profile_status":"Active" }
        let response = await axios.post(`${config.API_URL}getEmployeeList` , payloads , apiHeaderToken(config.API_TOKEN));
        if(response.status === 200){
            return response.data.data
        }else {
            return response.data.data
        }
       } catch (error) {
          console.log(error);
       }
    }
)

export const getJobDetails = createAsyncThunk(
     "getJobDetailsList/getJobDetails",
     async (payload , {rejectWithValue}) => {
         try {
            let response = await axios.post(`${config.API_URL}getAppliedJobById` , payload , apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                return response.data.data
            }else {
                return response.data.data
            }
         } catch (error) {
            return rejectWithValue(error.response.data);
         }
     }
)

export const getUsersDetailsByIds = createAsyncThunk(
     "getUsersDetailsByIds/getBulkCandidateListByJobId",
     async (payload , {rejectWithValue}) => {
         try {
            let response = await axios.post(`${config.API_URL}getBulkCandidateListByJobId` , payload , apiHeaderToken(config.API_TOKEN));

            console.log( response , 'this is Response Data with Status' );

            if(response.status === 200){
                return response.data.data
            }else {
                return response.data.data
            }
         } catch (error) {
            return rejectWithValue(error.response.data);
         }
     }
)

const interviewSlice = createSlice(
    {
        name:'interview',
        initialState,
        reducers:{
            setInterviewDuration: (state,action) => {
                state.interviewDuration = action.payload;
            },
            setInterviewVenueLocation: (state,action) => {
                state.venueLocation = action.payload;
            },
            setInterviewTime: (state,action) => {
                state.interviewTime = action.payload;
            },
            setInterviewDate: (state,action) => {
                state.interviewDate = action.payload;
            },
            setInterviewLocation: (state,action) => {
                state.interviewLocation = action.payload;
            },
            setInterviewType: (state,action) => {
                state.interviewType = action.payload;
            },
            setInterviewStatus: (state,action) => {
                state.interviewStatus = action.payload;
            },
            setInterviewLink: (state,action) => {
                state.interviewLink = action.payload;
            },
            setInterviewStage: (state,action) => {
                state.interviewStage = action.payload;
            },
            setInterviewHost: (state,action) => {
                state.interviewHost = action.payload;
            },
            setInterviewers: (state, action) => {
                // const interviewerExists = state.interviewers.some(
                //     interviewer => interviewer.employee_id === action.payload.employee_id
                // );
            
                // if (!interviewerExists) {
                    state.interviewers = action.payload;
                // }
            },            
            removeInterviewer: (state,action) => {
                state.interviewers = state.interviewers.filter((item, index) => item?.employee_name !== action.payload )
            }
        },
        extraReducers: (builder) => {
            builder
             .addCase(GetEmployeeList.pending , (state) => {
                  state.getInterviewerList.status = 'loading'
             })
             .addCase(GetEmployeeList.fulfilled , (state , action) => {
                state.getInterviewerList.status = 'success'
                state.getInterviewerList.data = action.payload
             })
             .addCase(GetEmployeeList.rejected , (state , action) => {
                state.getInterviewerList.status = 'failed'
                state.getInterviewerList.error = action.payload
             })
             .addCase(getJobDetails.pending , (state) => {
                state.getJobDetailsList.status = 'loading'
             })
             .addCase(getJobDetails.fulfilled , (state , action) => {
                state.getJobDetailsList.status = 'success'
                state.getJobDetailsList.data = action.payload;
             })
             .addCase(getJobDetails.rejected , (state , action) => {
                state.getJobDetailsList.status = 'failed'
                state.getJobDetailsList.data = action.payload
             })
             .addCase(getUsersDetailsByIds.pending , (state , action) => {
                state.userDetails.status = 'loading'
             } )
             .addCase(getUsersDetailsByIds.fulfilled , (state , action) => {
                state.userDetails.status = 'success'
                state.userDetails.data = action.payload;
             } )
             .addCase(getUsersDetailsByIds.rejected , (state , action) => {
                state.userDetails.status = 'failed'
                state.userDetails.data = [];
                state.userDetails.error = action.payload;
             } )
        }
    }
)
 


export const { setInterviewDuration, setInterviewTime, setInterviewDate, setInterviewLocation , removeInterviewer , setInterviewHost , setInterviewLink , setInterviewStage , setInterviewStatus , setInterviewType , setInterviewers , setInterviewVenueLocation  }  = interviewSlice.actions;
export default interviewSlice.reducer