// import { createSlice  , createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import config from "../../../config/config";
// import { apiHeaderToken } from "../../../config/api_header";


// const initialState = {
//     attendance:{
//         status:'idle',
//         data:[],
//         error:null
//     }
// }

// export const GetEmployeeAttendanceList = (
//     'attendance/GetEmployeeAttendanceList',
//     async ( payload , {rejectWithValue} ) => {
//         try {

//             let response = await axios.post(`${config.API_URL}getAttendanceByEmployeeID` , payload , apiHeaderToken(config.API_TOKEN))

//             if(response.status === 200 ){
//                 return response.data
//             }else {
//                 return rejectWithValue(response.data)
//             }
            
//         } catch (error) {

//             rejectWithValue(error.response?.data?.message || error.message || "something went wrong")
            
//         }
//     }
// )



// const AttendanceSlice  =  createSlice({
//     name:"employee",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {

//         builder
//            .addCase(GetEmployeeAttendanceList.pending , (state , action) => {
//                   state.attendance.status = 'loading',
//                   state.attendance.data = [];
//                   state.attendance.error = null;
//            })

//     }

// })