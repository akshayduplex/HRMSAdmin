import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config'; 
import { apiHeaderToken } from '../../config/api_header';


const initialState = {
    locations: [],
    locations_dropdown: [],
    pageNo: 1,
    perPageRecord: 12, 
    single_location: [],  
    status: 'pending',
    error: null
};

export const searchLocation = createAsyncThunk('location/searchLocation', async( { params, token } , {rejectWithValue} )=>{
    try{ 
        const response = await axios.post( `${config.API_URL}getLocationList`, params, apiHeaderToken( config.API_TOKEN )  ); 
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});

const locationsSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        incrementPageNo(state) {
          state.pageNo += 1;
        },
    },
    extraReducers : ( builder ) => {
        builder 
        .addCase( searchLocation.pending , (state) => { 
                state.error = null; 
        })
        .addCase( searchLocation.fulfilled, (state, action )=>{  
                state.status = 'succeeded';
                state.locations_dropdown = action.payload.status ? action.payload.data : []; 
        })
        .addCase( searchLocation.rejected, ( state, action )=>{
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
        });
     }
});

export const { incrementPageNo } = locationsSlice.actions;

export default locationsSlice.reducer;
