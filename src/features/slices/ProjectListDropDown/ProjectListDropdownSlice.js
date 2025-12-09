import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";


const initialState = {
    ProjectDropDown:{
        ProjectList:[],
        ProjectListLoading:'idle',
        ProjectListError:null
    },
    closeProject: {
        CloseProjectList: [],
        CloseProjectListLoading: 'idle',
        CloseProjectListError: null
    },
    projectsData: {
        status: 'idle',
        error: null,
        data: []
    },
    projectDesignation:{
        data:[],
        status:'idle',
        error:null
    },
    projectStateDropdown : {
        data:[],
        status:'idle',
        error:null
    },
    projectLocationDropdown : {
        data:[],
        status:'idle',
        error:null
    },
    projectDivisionDropdown: {
        data:[],
        status:'idle',
        error:null
    },
    projectRegionDropdown: {
        data:[],
        status:'idle',
        error:null
    }
}

export const FetchProjectListDropDown = createAsyncThunk(
    'ProjectDropDown/FetchProjectListDropDown',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":"10"
                ,"scope_fields":["_id" , "title" , "budget_estimate_list" , "location"],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getProjectList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key._id,
                    label: key.title,
                    budget_estimate_list:key.budget_estimate_list,
                    location:key.location
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const FetchProjectListDropDownOnScroll = createAsyncThunk(
    'ProjectDropDown/FetchProjectListDropDownScroll',
    async (Payloads, { rejectWithValue }) => {
        try {
            // const Payloads ={
            //     "keyword":inputValue,
            //     "page_no":"1",
            //     "per_page_record":"10"
            //     ,"scope_fields":["_id" , "title" , "budget_estimate_list" , "location"],
            //     "status":'Active'
            // }
            const response = await axios.post(
                `${config.API_URL}getProjectList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key._id,
                    label: key.title,
                    budget_estimate_list:key.budget_estimate_list,
                    location:key.location
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const FetchClosedProjectListDropDown = createAsyncThunk(
    'ProjectDropDown/FetchClosedProjectListDropDown',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":"10"
                ,"scope_fields":["_id" , "title" , "budget_estimate_list" , "location"],
                // "status":"Closed"
            }
            const response = await axios.post(
                `${config.API_URL}getProjectList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key._id,
                    label: key.title,
                    budget_estimate_list:key.budget_estimate_list,
                    location:key.location
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const FetchProjectList = createAsyncThunk(
    'projectsData/FetchProjectListAllList',
    async (filter , {rejectWithValue}) => {
        try {
            const Payloads ={
                "keyword":filter?.text ? filter?.text : '' ,
                "page_no":"1",
                "per_page_record":"1000",
                "project_id":filter?.projectId ? filter?.projectId : ''
                ,"scope_fields":[],
                "state_id" :filter?.state_id ? filter?.state_id : '',
                "location_id":  `${filter?.location_id ? filter?.location_id : '' }`,
                "status":'Active',
                "end_date":filter?.end_date ? filter?.end_date : '' 
            }
            const response = await axios.post(
                `${config.API_URL}getProjectList`,
                Payloads,
                filter?.token ? 
                apiHeaderToken(filter?.token)
                :apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            return error.response.data
        }
    }
);

export const  CloseProjects = createAsyncThunk(
    'closeProject/CloseProject',
    async (payload , {rejectWithValue}) => {
        try {
              let response = await axios.post(`${config.API_URL}closeProject` , payload , apiHeaderToken(config.API_TOKEN))

              console.log(response , 'this is Clised project response');
              if(response.status === 200){
                 return response.data;
              }else {
                 return [];
              }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const FetchDesignationListForJob = createAsyncThunk(
            "projectDesignation/FetchDesignationListForJob",
            async ( payloads , {rejectWithValue} ) => {
                try {
                    let response = await axios.post(`${config.API_URL}getProjectEmploymentList` , payloads , apiHeaderToken( config.API_TOKEN ));
                    if( response.status === 200 ){
                        return response.data.data;
                    }else {
                        return [];
                    }
                } catch (error) {
                    return rejectWithValue(error.response.data);
                }
            }
)

export const FetchProjectStateDropDown = createAsyncThunk(
    'projectStateDropdown/FetchProjectStateDropDown',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":"10"
                ,"scope_fields":["_id" , "name"],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getStateList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key._id,
                    label: key.name,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const FetchProjectLocationDropDown = createAsyncThunk(
    'projectLocationDropdown/FetchProjectLocationDropDown',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":"10"
                ,"scope_fields":["_id" , "name" , "state" , "state_id"],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getLocationList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key._id,
                    label: `${key.name} , ${key?.state}`,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const FetchProjectLocationStateVise = createAsyncThunk(
    'projectLocationDropdown/FetchProjectLocationDropDown',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":config.size
                ,"scope_fields":[],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getLocationWithStateList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const FetchProjectDivisionDropDown = createAsyncThunk(
    'projectDivisionDropdown/FetchProjectDivisionDropDown',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":"10"
                ,"scope_fields":["_id" , "name"],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getDivisionList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key._id,
                    label: key.name,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const FetchProjectRegionDropDown = createAsyncThunk(
    'projectRegionDropdown/FetchProjectRegionDropDown',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":"10"
                ,"scope_fields":["_id" , "name"],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getRegionList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key._id,
                    label: key.name,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const FetchGradeListDropdown = createAsyncThunk(
    'gradeList/FetchGradeListDropdown',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":"10"
                ,"scope_fields":["_id" , "name"],
                "status":'Active'
            }
            const response = await axios.post(
                `${config.API_URL}getGradeList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key._id,
                    label: key.name,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const ProjectDropDownSlice = createSlice({
    name:'ProductDropDown',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(FetchProjectListDropDown.pending , (state) => {
            state.ProjectDropDown.ProjectListLoading = 'pending';
            state.ProjectDropDown.ProjectListError = null;
        })
        .addCase(FetchProjectListDropDown.fulfilled , (state,action) => {
            state.ProjectDropDown.ProjectListLoading = 'succeeded';
            state.ProjectDropDown.ProjectList = action.payload;
            state.ProjectDropDown.ProjectListError = null;
        })
        .addCase(FetchProjectListDropDown.rejected , (state , action) => {
            state.ProjectDropDown.ProjectListLoading = 'failed';
            state.ProjectDropDown.ProjectList = [];
        })
        .addCase(CloseProjects.pending , (state) => {
            state.closeProject.CloseProjectListLoading = 'loading';
            state.closeProject.CloseProjectListError = null
        })
        .addCase(CloseProjects.rejected , (state , action) => {
            state.closeProject.CloseProjectListLoading = 'failed';
            state.closeProject.CloseProjectListError = action.payload;
        })
        .addCase(CloseProjects.fulfilled , (state , action) => {
            state.closeProject.CloseProjectListLoading = 'succeeded';
            state.closeProject.CloseProjectList = action.payload;
        })
        .addCase(FetchProjectList.pending , (state) => {
            state.projectsData.status = 'loading'
        })
        .addCase(FetchProjectList.fulfilled , (state , action) => {
            state.projectsData.status = "success";
            state.projectsData.data = action.payload;
        })
        .addCase(FetchProjectList.rejected , (state , action) => {
            state.projectsData.status = "failed";
            state.projectsData.data = action.payload;
        })
        .addCase(FetchDesignationListForJob.pending , (state) => {
            state.projectDesignation.status = 'loading'
        })
        .addCase(FetchDesignationListForJob.fulfilled , (state , action) => {
            state.projectDesignation.status = 'success'
            state.projectDesignation.data = action.payload
        })
        .addCase(FetchDesignationListForJob.rejected , (state , action) => {
            state.projectDesignation.status = 'failed';
            state.projectDesignation.error = action.payload;
        })
        .addCase(FetchProjectStateDropDown.pending , (state) => {
            state.projectStateDropdown.status = 'loading';
            state.projectStateDropdown.error = null;
        })
        .addCase(FetchProjectStateDropDown.fulfilled , (state , action) => {
            state.projectStateDropdown.status = 'success';
            state.projectStateDropdown.error = null;
            state.projectStateDropdown.data = action.payload;
        })
        .addCase(FetchProjectStateDropDown.rejected , (state , action) => {
            state.projectStateDropdown.status = 'failed';
            state.projectStateDropdown.error = action.payload;
        })
        .addCase(FetchProjectLocationDropDown.pending , (state) => {
            state.projectLocationDropdown.status = 'loading';
        })
        .addCase(FetchProjectLocationDropDown.fulfilled , (state , action) => {
            state.projectLocationDropdown.status = 'loading';
            state.projectLocationDropdown.data = action.payload;
        })
        .addCase(FetchProjectLocationDropDown.rejected , (state , action) => {
            state.projectLocationDropdown.status = 'loading';
            state.projectLocationDropdown.data   = action.payload;
            state.projectLocationDropdown.error = action.error; 
        })
        .addCase(FetchProjectDivisionDropDown.pending , (state) => {
            state.projectDivisionDropdown.status = 'loading';
        })
        .addCase(FetchProjectDivisionDropDown.fulfilled , (state , action) => {
            state.projectDivisionDropdown.status = 'success';
            state.projectDivisionDropdown.data = action.payload
        })
        .addCase(FetchProjectDivisionDropDown.rejected , (state , action) => {
            state.projectDivisionDropdown.status = 'Failed';
            state.projectDivisionDropdown.data = action.payload;
            state.projectDivisionDropdown.error = action.error
        })
        .addCase(FetchProjectRegionDropDown.pending , (state) => {
            state.projectRegionDropdown.status = 'loading';
        })
        .addCase(FetchProjectRegionDropDown.fulfilled , (state , action) => {
            state.projectRegionDropdown.status = 'success';
            state.projectRegionDropdown.data = action.payload;
        })
        .addCase(FetchProjectRegionDropDown.rejected , (state , action) => {
            state.projectRegionDropdown.status = 'Failed';
            state.projectRegionDropdown.data = action.payload;
            state.projectRegionDropdown.error = action.error;
        })
    }
})

export default ProjectDropDownSlice.reducer;