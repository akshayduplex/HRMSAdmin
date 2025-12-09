import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config/config'; 
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';


const initialState = {
    projects: [],
    pageNo: 1,
    perPageRecord: 30,
    hasMore: true,
    single_project: [],
    holidays: [], 
    status: 'pending',
    projects_dropdown: [],
    total: 0,
    error: null,
    projectList: {
        status:'idle',
        data:[],
        error:null
    }
};

export const fetchProjects = createAsyncThunk('project/fetchProjects', async( keyword = '' , { getState , rejectWithValue} )=>{

    const { pageNo, perPageRecord } = getState().project;
    // const { userLogin } = getState().auth;
    // const token = userLogin.token;
    const payload = {
      keyword,
      page_no: pageNo.toString(),
      per_page_record: perPageRecord.toString(),
      scope_fields: ["_id", "title", "duration", "location", "logo","extend_date_list","extend_budget_list","budget_estimate_list","start_date","end_date" , 'status' , 'project_budget'],
    };
 
    try{
        const response = await axios.post( `${config.API_URL}getProjectList`, payload,  apiHeaderToken( config.API_TOKEN ) ); 
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});

export const fetchProjectById = createAsyncThunk('project/details', async({ params, token }, {rejectWithValue} )=>{
    try{
        const response = await axios.post( `${config.API_URL}getProjectById`, params,  apiHeaderToken( config.API_TOKEN ) );
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});

export const addProject = createAsyncThunk( 'project/Add', async( { formData, token } , {rejectWithValue})=>{
    try{ 
        const response = await axios.post( `${config.API_URL}addProject`, formData , apiHeaderTokenMultiPart( config.API_TOKEN ) ); 
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});

export const updateProject = createAsyncThunk('project/Update', async( { formData, token } , {rejectWithValue})=>{
    try{
        const response = await axios.post( `${config.API_URL}editProject`, formData , apiHeaderTokenMultiPart( config.API_TOKEN ) );
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});

export const deleteProject = createAsyncThunk( 'project/Delete', async( { payload, token }, {rejectWithValue})=>{
    try{
        const response = await axios.post( `${config.API_URL}deleteProject`, payload , apiHeaderToken( config.API_TOKEN ) );
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});

export const fetchLocation = createAsyncThunk('project/Location', async( { params, token } , {rejectWithValue} )=>{
    try{ 
        const response = await axios.post( `${config.API_URL}getLocationList`, params, apiHeaderToken( config.API_TOKEN )  ); 
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});

export const fetchHolidayList = createAsyncThunk('project/HolidayList', async( { params, token } , {rejectWithValue} )=>{ 
        try{  
        const response = await axios.post( `${config.API_URL}getHolidayListByDateRange`, params, apiHeaderToken( config.API_TOKEN )  ); 
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});

export const extendProjectDuration = createAsyncThunk('project/extendDuration', async( { params, token } , {rejectWithValue} )=>{ 
    try{  
    const response = await axios.post( `${config.API_URL}extendProjectDuration`, params, apiHeaderToken( config.API_TOKEN )  ); 
    return response.data;
}catch( error ){
    return rejectWithValue(error.response.data);
}
});

export const saveProjectBudget = createAsyncThunk('project/saveBudget', async( { params, token } , {rejectWithValue} )=>{  
    try{
    const response = await axios.post( `${config.API_URL}extendProjectBudget`, params, apiHeaderToken( config.API_TOKEN )  ); 
    return response.data;
}catch( error ){
    return rejectWithValue(error.response.data);
}
});

export const fetchProjectsDropDown = createAsyncThunk('project/projectDropDown', async( _ , { getState , rejectWithValue} )=>{

    const { userLogin } = getState().auth;
    const token = userLogin.token;
    const payload = {
      page_no: 1,
      per_page_record: 500,
      status:'Active',
      scope_fields: ["_id", "title" , "location" , "budget_estimate_list"],
    };
 
    try{
        const response = await axios.post( `${config.API_URL}getProjectList`, payload,  apiHeaderToken( config.API_TOKEN ) ); 
        return response.data;
    }catch( error ){
        return rejectWithValue(error.response.data);
    }
});


const projectsSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        incrementPageNo(state) {
          state.perPageRecord += 30;
        },
    },
    extraReducers : ( builder ) => {
        builder
        .addCase( fetchProjects.pending, (state) => { 
                state.projectList.error = null;
                state.projectList.status = 'loading';
        })
        .addCase( fetchProjects.fulfilled, ( state, action ) => { 
                state.projectList.status = 'succeeded';
                state.status = 'succeeded';
                if (action.payload?.data?.length < state.perPageRecord) {
                    state.hasMore = false;
                }
                state.projectList.data = action.payload.data;
                state.projects =  action.payload.data;
        })
        .addCase( fetchProjects.rejected , ( state, action ) => { 
                state.projectList.status = 'failed';
                state.projectList.error = action.payload ? action.payload.message : action.error.message;
        })
        .addCase( addProject.pending , (state) => { 
                state.error = null;
        })
        .addCase( addProject.fulfilled, (state, action )=>{ 
                state.status = 'succeeded';
                //state.projects.push( action.payload );
        })
        .addCase( addProject.rejected, ( state, action )=>{ 
                state.error = action.payload ? action.payload.message : action.error.message;
        })
        .addCase( updateProject.pending , (state) => { 
                state.error = null;
        })
        .addCase( updateProject.fulfilled, (state, action )=>{ 
                state.status = 'succeeded';
                //state.projects.push( action.payload );
        })
        .addCase( updateProject.rejected, ( state, action )=>{ 
                state.error = action.payload ? action.payload.message : action.error.message;
        })
        .addCase( deleteProject.pending , (state) => { 
                state.error = null;
                state.status = 'loading';
        })
        .addCase( deleteProject.fulfilled, (state, action )=>{ 
                state.status = 'succeeded';
                state.error = action.payload ? action.payload.message : action.error.message;
        })
        .addCase( deleteProject.rejected, ( state, action )=>{
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
        })
        .addCase( fetchLocation.pending , (state) => { 
            state.error = null; 
        })
        .addCase( fetchLocation.fulfilled, (state, action )=>{  
                state.status = 'succeeded';
                state.locations = action.payload.status ? action.payload.data : []; 
        })
        .addCase( fetchLocation.rejected, ( state, action )=>{
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
        })
        .addCase( fetchHolidayList.pending , (state) => { 
                state.error = null;
        })
        .addCase( fetchHolidayList.fulfilled, (state, action )=>{  
                state.status = 'succeeded';
                state.holidays = action.payload.status ? action.payload.data : [];
        })
        .addCase( fetchHolidayList.rejected, ( state, action )=>{
                state.status = 'failed';
                state.error = null;
        })
        .addCase( fetchProjectById.pending , (state) => { 
                state.error = null;
        })
        .addCase( fetchProjectById.fulfilled, (state, action )=>{  
                state.status = 'succeeded';
                state.single_project = action.payload.status ? action.payload.data : [];
        })
        .addCase( fetchProjectById.rejected, ( state, action )=>{
                state.status = 'failed';
                state.error = null;
        })
        .addCase( extendProjectDuration.pending, ( state ) => {
            state.error = null;
        })
        .addCase( extendProjectDuration.fulfilled, (state, action ) => {
            state.error = null;
            state.status = 'succeeded'; 
            if( action.payload.status ){
                state.projects = state.projects.map(item => 
                    item._id === action.payload.data._id ? action.payload.data : item
                ); 
            }
        })
        .addCase( extendProjectDuration.rejected, ( state, action ) => {
            state.error = null;
        })
        .addCase( saveProjectBudget.pending, ( state ) => {
            state.error = null;
        })
        .addCase( saveProjectBudget.fulfilled, (state, action ) => {
            state.error = null;
            state.status = 'succeeded';
            if( action.payload.status && action.payload.data ){ 
                state.projects = state.projects.map(item => 
                    item._id === action.payload.data._id ? action.payload.data : item
                ); 
            }
        })
        .addCase( saveProjectBudget.rejected, ( state, action ) => {
            state.error = null;
        })
        .addCase( fetchProjectsDropDown.pending, (state) => { 
            state.error = null;
            state.status = 'loading';
        })
        .addCase( fetchProjectsDropDown.fulfilled, ( state, action ) => { 
                state.status = 'succeeded';             
                if( action.payload.status && action.payload.data ){ 
                    const combinedProjects = [...state.projects_dropdown, ...action.payload.data]; 
                    const uniqueProjects = combinedProjects.reduce((acc, current) => {
                        const x = acc.find(item => item._id === current._id);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);
        
                    state.projects_dropdown = uniqueProjects;
                }
        })
        .addCase( fetchProjectsDropDown.rejected , ( state, action ) => { 
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
        });
     }
});

export const { incrementPageNo , resetPageParRecords } = projectsSlice.actions;

export default projectsSlice.reducer;
