import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";



const initialState = {
    status:'idle',
    error:null,
    data:[]
}

export const GetDesignationList = createAsyncThunk(
    'designation/GetDesignationList',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":config.size
                ,"scope_fields":["_id" , "name"],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getDesignationList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key.name,
                    label: key.name,
                    id:key._id
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// export const GetLocationListDropDown = createAsyncThunk(
//     'designation/GetDesignationList',
//     async (inputValue, { rejectWithValue }) => {
//         if (inputValue.length === 0) return [];
//         try {
//             const Payloads ={
//                 "keyword":inputValue,
//                 "page_no":"1",
//                 "per_page_record":"5"
//                 ,"scope_fields":["_id" , "name"],
//                 "status":'Active'
//             }
//             const response = await axios.post(
//                 `${config.API_URL}getDesignationList`,
//                 Payloads,
//                 apiHeaderToken(config.API_TOKEN)
//             );
//             if (response.data.status) {
//                 return response.data.data.map(key => ({
//                     value: key.name,
//                     label: key.name,
//                 }));
//             } else {
//                 return [];
//             }
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );


const DesignationSlices = createSlice({
    name:'DesignationSlice',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(GetDesignationList.pending, (state, action) => {
              state.status = 'loading'
        })
        .addCase(GetDesignationList.fulfilled, (state, action) => {
              state.status = 'success'
              state.data = action.payload;
        })
        .addCase(GetDesignationList.rejected, (state, action) => {
              state.status = 'Failed'
              state.error = action.payload;
        })

    }
})

export default DesignationSlices.reducer;