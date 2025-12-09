import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config'; 
import { apiHeaderToken } from '../../config/api_header';


const initialState = { 
    holidays: [],
    status: 'pending',
    holidays_dropdown: [],
    error: null
};


export const fetchHolidayListByDateRange = createAsyncThunk('project/HolidayList', async( { params, token } , {rejectWithValue} )=>{ 
        try{  
        const response = await axios.post( `${config.API_URL}getHolidayListByDateRange`, params, apiHeaderToken( config.API_TOKEN )  ); 
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});


const holidaysSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {},
    extraReducers : ( builder ) => {
        builder 
        .addCase( fetchHolidayListByDateRange.pending , (state) => { 
                state.error = null;
        })
        .addCase( fetchHolidayListByDateRange.fulfilled, (state, action )=>{  
                state.status = 'succeeded';
                state.holidays_dropdown = action.payload.status ? action.payload.data : [];
        })
        .addCase( fetchHolidayListByDateRange.rejected, ( state, action )=>{
                state.status = 'failed';
                state.error = null;
        });
     }
});


export default holidaysSlice.reducer;
