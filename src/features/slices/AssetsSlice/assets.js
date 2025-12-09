import { createSlice, asyncThunkCreator, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";
import axios from "axios";
import { toast } from "react-toastify";


const initialState = {
    assetsTypeList: {
        data: [],
        status: 'idle',
        error: null
    },
    addAssets: {
        data: [],
        status: 'idle',
        error: null,
    },
    totalCount: {
        total: 0,
        status: 'idle'
    },
    assignCount: {
        total: 0,
        status: 'idle'
    },
    unassignCount: {
        total: 0,
        status: 'idle'
    },
    assetsRecord: {
        data:[],
        status: 'idle',
        error:null
    },
    editAssets: {
        data: [],
        status: 'idle',
        error: null,
    },
    empAssets: {
        data:[],
        status:'idle',
        error:null
    }
}


export const getAssetsTypeList = createAsyncThunk(
    'assetsType/getAssetsTypeList',
    async (input, { rejectWithValue }) => {
        try {
            let payloads = {
                "keyword": input,
                "page_no": "1",
                "per_page_record": "10",
                "scope_fields": ["name", "_id"],
                "profile_status": "Active",
            }
            let response = await axios.post(`${config.API_URL}getAssetTypeList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data?.data?.map((key) => {
                    return {
                        label: `${key?.name}`,
                        value: key.name,
                    }
                })
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const addAsstsInAll = createAsyncThunk(
    'addAssets/addAsstsInAll',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}addAssetItem`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data?.message)
                return response.data
            } else {
                toast.error(response.data?.message)
                return response.data
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || "Someting went wrong");
            rejectWithValue(error?.response.data?.message || error.message || "Someting went wrong")
        }
    }
)

export const EditAsstsInAll = createAsyncThunk(
    'editAssets/EditAsstsInAll',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}editAssetItem`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data?.message)
                return response.data
            } else {
                toast.error(response.data?.message)
                return response.data
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || "Someting went wrong");
            rejectWithValue(error?.response.data?.message || error.message || "Someting went wrong")
        }
    }
)

export const DeleteAssetsById = createAsyncThunk(
    'DeleteAssets/DeleteAssets',
    async (payloads, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}deleteAssetItemById`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data?.message)
                return payloads
            } else {
                toast.error(response.data?.message)
                return response.data
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || "Someting went wrong");
            rejectWithValue(error?.response.data?.message || error.message || "Someting went wrong")
        }
    }
)

// Fetch total count
export const fetchTotalAssets = createAsyncThunk(
    "assets/fetchTotalAssets",
    async (payload, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getAssetItemList`, payload, apiHeaderToken(config.API_TOKEN));
            return response.data; // Assuming the API returns `{ total: number }`
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch assigned count
export const fetchAssignAssets = createAsyncThunk(
    "assets/fetchAssignAssets",
    async (payload, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getAssetItemList`, payload, apiHeaderToken(config.API_TOKEN));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch unassigned count
export const fetchUnassignAssets = createAsyncThunk(
    "assets/fetchUnassignAssets",
    async (payload, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getAssetItemList`, payload, apiHeaderToken(config.API_TOKEN));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAssetsRecords = createAsyncThunk(
    "assetsRecord/fetchAssetsRecords",
    async (payload, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getAssetItemList`, payload, apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                return response.data.data;
            }else {
                return []
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

export const fetchEmployeeAssetsRecords = createAsyncThunk(
    "assetsRecord/fetchEmployeeAssetsRecords",
    async (payload, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.API_URL}getEmployeeAssets`, payload, apiHeaderToken(config.API_TOKEN));
            if(response.status === 200){
                return response.data.data;
            }else {
                return []
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);


const AssetsSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addAsstsInAll.pending, (state, action) => {
            state.addAssets.status = 'loading';
        })
            .addCase(addAsstsInAll.fulfilled, (state) => {
                state.addAssets.status = 'success';
            })
            .addCase(addAsstsInAll.rejected, (state) => {
                state.addAssets.status = 'reject'
            })
            .addCase(fetchTotalAssets.pending, (state) => {
                state.totalCount.status = "loading";
            })
            .addCase(fetchTotalAssets.fulfilled, (state, action) => {
                state.totalCount.total = action.payload;
                state.totalCount.status = "success";
            })
            .addCase(fetchTotalAssets.rejected, (state) => {
                state.totalCount.status = "failed";
            });
        // Assigned count
        builder
            .addCase(fetchAssignAssets.pending, (state) => {
                state.assignCount.status = "loading";
            })
            .addCase(fetchAssignAssets.fulfilled, (state, action) => {
                state.assignCount.total = action.payload;
                state.assignCount.status = "success";
            })
            .addCase(fetchAssignAssets.rejected, (state) => {
                state.assignCount.status = "failed";
            });

        // Unassigned count
        builder
            .addCase(fetchUnassignAssets.pending, (state) => {
                state.unassignCount.status = "loading";
            })
            .addCase(fetchUnassignAssets.fulfilled, (state, action) => {
                state.unassignCount.total = action.payload;
                state.unassignCount.status = "success";
            })
            .addCase(fetchUnassignAssets.rejected, (state) => {
                state.unassignCount.status = "failed";
            });
        // fetch records of Assets
        builder
         .addCase(fetchAssetsRecords.pending , (state) => {
            state.assetsRecord.status ='loading';
         })
         .addCase(fetchAssetsRecords.fulfilled , (state , action) => {
             state.assetsRecord.status = 'success';
             state.assetsRecord.data = action.payload;
         })
         .addCase(fetchAssetsRecords.rejected , (state , action)  => {
             state.assetsRecord.status = 'failed';
             state.assetsRecord.error = action.error
         })
        //  Edit Assets In All sets ->   
        builder
         .addCase(EditAsstsInAll.pending , (state) => {
            state.editAssets.status ='loading';
         })
         .addCase(EditAsstsInAll.fulfilled , (state , action) => {
             state.editAssets.status = 'success';
             // I want to Update the Add assets part here is that possible ?
         })
         .addCase(EditAsstsInAll.rejected , (state , action)  => {
             state.editAssets.status = 'failed';
         })

        builder
         .addCase(DeleteAssetsById.fulfilled , (state , action) => {
             let id = action.payload?._id;
             state.assetsRecord.data = state.assetsRecord.data?.filter( item => item?._id !== id );
         })

        // Get Employee Assign Assets List ->
        builder 
           .addCase(fetchEmployeeAssetsRecords.pending , (state , action) => {
                state.empAssets.status = 'loading';
           })
           .addCase(fetchEmployeeAssetsRecords.fulfilled , (state , action) => {
                state.empAssets.status = 'success';
                state.empAssets.data = action.payload
           })
           .addCase(fetchEmployeeAssetsRecords.rejected , (state , action) => {
               state.empAssets.status = 'failed';
               state.empAssets.error = action.error;
           })
    }
})

export default AssetsSlice.reducer