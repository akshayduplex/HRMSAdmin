import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";

const initialState = {
    file:null,
    extractedData:null
}



const ImportCandidateSlice = createSlice(
    {
        name:'ImportCandidate',
        initialState,
        reducers:{
            uploadsFiles : (state , action) => {
                state.file = action.payload;
            },
            JsonDataParsed: (state , action) => {
                state.extractedData = action.payload;
            }
        },
        extraReducers: (builder) => {

        }
    }
)
 


export const {  uploadsFiles , JsonDataParsed }  = ImportCandidateSlice.actions;
export default ImportCandidateSlice.reducer