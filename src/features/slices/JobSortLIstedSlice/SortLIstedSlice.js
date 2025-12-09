import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";
import { toast } from "react-toastify";
const initialState = {
    shortList: {
        status: 'idle',
        error: null,
        data: [],
    },
    removedCandidate: {
        status: 'idle',
        error: null,
        data: []
    },
    ManPowerRequisition: {
        status: 'idle',
        error: null,
        isTotal: 0,
        data: [],
    },
    ManPowerRequisitionCard: {
        status: 'idle',
        error: null,
        data: [],
    },
    ManPowerRequisitionCardHod: {
        status: 'idle',
        error: null,
        data: [],
    }
}
 
 
export const ShortListCandidates = createAsyncThunk(
    'shortlistCandidates/shortlistCandidates',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}shortListCandidates`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message)
                return response.data
 
            } else {
                toast.error(response.data.message)
                return response.data
            }
        } catch (error) {
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data.message);
        }
    }
)
 
export const DeleteAndRemoved = createAsyncThunk(
    'removedCandidate/DeleteAndRemoved',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}rejectDeleteInterview`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message)
                return response.data;
            } else {
                return response.data
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const MarkAsInterviewCompleted = createAsyncThunk(
    'markAsInterviewCompleted/interviewCompleted',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}updateInterviewDoneStatus`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message)
                return response.data;
            } else {
                return response.data
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)
 
 
export const ManPowerAcquisitionsSlice = createAsyncThunk(
    'ManPowerAcquisitions/ManPowerAcquisitionsSlice',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getRequisitionDataList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                if (payloads.isTotalCount === 'yes') {
                    return {
                        count: payloads.isTotalCount,
                        total: response.data.data.length
                    }
                }
                return {
                    count: 'No',
                    data: response.data.data
                };
            } else {
                return {
                    count: 'No',
                    data: []
                };
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)
 
export const ManPowerAcquisitionsSliceCard = createAsyncThunk(
    'ManPowerAcquisitionsSliceCard/ManPowerRequisitionCard',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getRequisitionDataList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const ManPowerAcquisitionsSliceCardHod = createAsyncThunk(
    'ManPowerAcquisitionsSliceCardHod/ManPowerRequisitionCard',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getRequisitionDataList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)
 
export const ManPowerAcquisitionsSingleRecords = createAsyncThunk(
    'ManPowerAcquisitionsSingleRecords/ManPowerAcquisitionsSingleRecords',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}/getRequisitionDataById`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data.data;
            } else {
                return response.data.data
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)
 
 
const shortListSlice = createSlice({
    name: 'shortList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ShortListCandidates.pending, (state) => {
                state.shortList.status = 'loading';
            })
            .addCase(ShortListCandidates.fulfilled, (state, action) => {
                state.shortList.status = 'success'
                state.shortList.data = action.payload;
            })
            .addCase(ShortListCandidates.rejected, (state, action) => {
                state.shortList.status = 'rejected'
                state.shortList.error = action.error
            })
            .addCase(DeleteAndRemoved.pending, (state) => {
                state.removedCandidate.status = 'loading'
            })
            .addCase(DeleteAndRemoved.fulfilled, (state, action) => {
                state.removedCandidate.status = 'success'
                state.removedCandidate.data = action.payload
            })
            .addCase(DeleteAndRemoved.rejected, (state, action) => {
                state.removedCandidate.status = 'rejected'
                state.removedCandidate.error = action.error
            })
            .addCase(ManPowerAcquisitionsSlice.pending, (state) => {
                state.ManPowerRequisition.status = 'loading'
                state.ManPowerRequisition.error = null;
            })
            .addCase(ManPowerAcquisitionsSlice.fulfilled, (state, action) => {
                state.ManPowerRequisition.status = 'success';
                if (action.payload?.count === 'yes') {
                    state.ManPowerRequisition.isTotal = action.payload.total;
                    return;
                }
                state.ManPowerRequisition.data = action.payload;
            })
            .addCase(ManPowerAcquisitionsSlice.rejected, (state, action) => {
                state.ManPowerRequisition.status = 'failed';
                state.ManPowerRequisition.error = action.error;
            })
            .addCase(ManPowerAcquisitionsSliceCard.pending, (state) => {
                state.ManPowerRequisitionCard.status = 'loading'
                state.ManPowerRequisitionCard.error = null;
                // state.ManPowerRequisitionCard.data = [];
            })
            .addCase(ManPowerAcquisitionsSliceCard.fulfilled, (state, action) => {
                state.ManPowerRequisitionCard.status = 'success';
                state.ManPowerRequisitionCard.data = action.payload;
            })
            .addCase(ManPowerAcquisitionsSliceCard.rejected, (state, action) => {
                state.ManPowerRequisitionCard.status = 'failed';
                state.ManPowerRequisitionCard.error = action.error;
                state.ManPowerRequisitionCard.data = [];
            })
            .addCase(ManPowerAcquisitionsSliceCardHod.pending, (state) => {
                state.ManPowerRequisitionCardHod.status = 'loading'
                state.ManPowerRequisitionCardHod.error = null;
                // state.ManPowerRequisitionCard.data = [];
            })
            .addCase(ManPowerAcquisitionsSliceCardHod.fulfilled, (state, action) => {
                state.ManPowerRequisitionCardHod.status = 'success';
                state.ManPowerRequisitionCardHod.data = action.payload;
            })
            .addCase(ManPowerAcquisitionsSliceCardHod.rejected, (state, action) => {
                state.ManPowerRequisitionCardHod.status = 'failed';
                state.ManPowerRequisitionCardHod.error = action.error;
                state.ManPowerRequisitionCardHod.data = [];
            })
    }
})
 
export default shortListSlice.reducer;
 