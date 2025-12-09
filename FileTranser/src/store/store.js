import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import alertReducer from '../features/alert/alertSlice';
import projectSlice from '../features/slices/projectSlice';
import designationSlice from '../features/slices/designationSlice';
import locationsSlice from '../features/slices/locationsSlice';
import holidaysSlice from '../features/slices/holidaysSlice';
import departmentSlice from '../features/slices/departmentSlice';
import jobTypesSlice from '../features/slices/jobTypesSlice';
import cityListDataGloble from '../features/masters/locations/locationSliceGloble' 
import createJobSubmitSlice from '../features/masters/jobtypes/JobSumitSlice';
import JobsSlices from '../features/slices/AtsSlices/getJobListSlice'
import JobAppliedCandidateSlice from '../features/slices/AppliedJobCandidates/JobAppliedCandidateSlice';
import interviewSlice from '../features/slices/ScheduleInterviews/ScehduleInterviews'
import shortListSlice from '../features/slices/JobSortLIstedSlice/SortLIstedSlice';
import ProjectListDropdownSlice from '../features/slices/ProjectListDropDown/ProjectListDropdownSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectSlice,
    designation: designationSlice,
    location: locationsSlice,
    holiday: holidaysSlice,
    alert: alertReducer,
    department: departmentSlice,
    job_type:jobTypesSlice,
    city_list_globle:cityListDataGloble,
    job_submit:createJobSubmitSlice,
    getJobsList:JobsSlices,
    appliedJobList:JobAppliedCandidateSlice,
    interview: interviewSlice,
    shortList:shortListSlice,
    projectListDropdown:ProjectListDropdownSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check
  }),

});

export default store;
