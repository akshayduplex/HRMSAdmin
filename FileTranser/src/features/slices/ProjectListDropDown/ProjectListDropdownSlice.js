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
    }
}

export const FetchProjectListDropDown = createAsyncThunk(
    'ProjectDropDown/FetchProjectListDropDown',
    async (inputValue, { rejectWithValue }) => {
        if (inputValue.length === 0) return [];
        try {
            const Payloads ={
                "keyword":inputValue,
                "page_no":"1",
                "per_page_record":"5"
                ,"scope_fields":["_id" , "title"],
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
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
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
    }
})

export default ProjectDropDownSlice.reducer;