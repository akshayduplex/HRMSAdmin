import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../../config/config";
import { apiHeaderToken } from "../../../config/api_header";
import axios from "axios";


const initialState = {
    cities: {
        data:[],
        status:'idle',
        error:null
    },
    salary_range: {
        data: [],
        status:'idle',
        error: null
    },
    tabsList: {
        data:[],
        status:'idle',
        error:null
    },
    benefitsListApi: {
        data:[],
        status:'idle',
        error:null
    },
    educationList: {
        data: [],
        status:'idle',
        error:null
    }
}

export const fetchCitySuggestions = createAsyncThunk(
    'cities/fetchCitySuggestions',
    async (inputValue, { rejectWithValue }) => {
        if (inputValue.length === 0) return [];
        try {
            const Payloads = {
                keyword: inputValue,
                page_no: '1',
                per_page_record: '10',
            };
            const response = await axios.post(
                `${config.API_URL}getLocationList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key.name,
                    label: key.name,
                    id:key._id,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// handle the salary range
export const fetchSalaryRangeSuggestions = createAsyncThunk(
    'salary_range/fetchSalaryRangeSuggestions',
    async (inputValue, { rejectWithValue }) => {
        if (inputValue.length === 0) return [];
        try {
            const Payloads = {
                keyword: inputValue,
                page_no: '1',
                per_page_record: '10',
                scope_fields:[
                    "label",
                    "from",
                    "to"
                ],
                status:'Active'
            };
            // {"keyword":"3 lpa","page_no":"1","per_page_record":"11","scope_fields":["label","from","to"], "status":"Active" }

            const response = await axios.post(
                `${config.API_URL}getSalaryRangeList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key.label,
                    label: key.label,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



export const fetchTagListSuggestions = createAsyncThunk(
    'tabsList/fetchTagListSuggestions',
    async () => {
        try {
            const Payloads = {
                keyword: '',
                page_no: '1',
                per_page_record: '10',
                scope_fields:[
                    "name",
                    "_id",
                ],
                status:'Active'
            };
            // {"keyword":"3 lpa","page_no":"1","per_page_record":"11","scope_fields":["label","from","to"], "status":"Active" }

            const response = await axios.post(
                `${config.API_URL}getTagList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map((key) => {
                    return key.name
                });
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
);

// benefits list api
export const fetchBenefitsListSuggestions = createAsyncThunk(
    'benefitsListApi/fetchBenefitsListSuggestions',
    async () => {
        try {
            const Payloads = {
                keyword: '',
                page_no: '1',
                per_page_record: '10',
                scope_fields:[
                    "name",
                    "_id",
                ],
                status:'Active'
            };
            // {"keyword":"3 lpa","page_no":"1","per_page_record":"11","scope_fields":["label","from","to"], "status":"Active" }

            const response = await axios.post(
                `${config.API_URL}getBenefitList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map((key) => {
                    return key.name
                });
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
);

// education api list
export const fetchEducationListSuggestions = createAsyncThunk(
    'educationList/fetchEducationListSuggestions',
    async () => {
        try {
            const Payloads = {
                keyword: '',
                page_no: '1',
                per_page_record: '10',
                scope_fields:[
                    "name",
                    "_id",
                ],
                status:'Active'
            };
            // {"keyword":"3 lpa","page_no":"1","per_page_record":"11","scope_fields":["label","from","to"], "status":"Active" }

            const response = await axios.post(
                `${config.API_URL}getEducationList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            console.log( response ,'education List api');
            if (response.data.status) {
                return response.data.data.map((key) => {
                    return key.name
                });
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
);



const cityListDataGloble = createSlice({
    name:'cityList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCitySuggestions.pending , (state , action) => {
            state.cities.status ='loading';
            state.cities.data = [];
        })
        .addCase(fetchCitySuggestions.fulfilled , (state , action) => {
            state.cities.status ='success';
            state.cities.data = action.payload;
        })
        .addCase(fetchCitySuggestions.rejected , (state , action) => {
             state.cities.status ='failed';
             state.cities.error = action.payload;
        })
        .addCase(fetchSalaryRangeSuggestions.pending , (state , action) => {
            state.salary_range.status ='loading';
            state.salary_range.data = [];
        })
        .addCase(fetchSalaryRangeSuggestions.fulfilled , (state , action) => {
            state.salary_range.status ='success';
            state.salary_range.data = action.payload;
        })
        .addCase(fetchSalaryRangeSuggestions.rejected , (state , action) => {
             state.salary_range.status ='failed';
             state.salary_range.error = action.payload;
        })
        .addCase(fetchTagListSuggestions.pending , (state , action) => {
            state.tabsList.status ='loading';
            state.tabsList.data = [];
        })
        .addCase(fetchTagListSuggestions.fulfilled , (state , action) => {
            state.tabsList.status ='success';
            state.tabsList.data = action.payload;
        })
        .addCase(fetchTagListSuggestions.rejected , (state , action) => {
             state.tabsList.status ='failed';
             state.tabsList.error = action.payload;
        })
        .addCase(fetchBenefitsListSuggestions.pending , (state , action) => {
            state.benefitsListApi.status ='loading';
            state.benefitsListApi.data = [];
        })
        .addCase(fetchBenefitsListSuggestions.fulfilled , (state , action) => {
            state.benefitsListApi.status ='success';
            state.benefitsListApi.data = action.payload;
        })
        .addCase(fetchBenefitsListSuggestions.rejected , (state , action) => {
             state.benefitsListApi.status ='failed';
             state.benefitsListApi.error = action.payload;
        })
        .addCase(fetchEducationListSuggestions.pending , (state , action) => {
            state.educationList.status ='loading';
            state.educationList.data = [];
        })
        .addCase(fetchEducationListSuggestions.fulfilled , (state , action) => {
            state.educationList.status ='success';
            state.educationList.data = action.payload;
        })
        .addCase(fetchEducationListSuggestions.rejected , (state , action) => {
             state.educationList.status ='failed';
             state.educationList.error = action.payload;
        })
    }
})

export default cityListDataGloble.reducer;

