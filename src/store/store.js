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
import DesignationSlices from '../features/slices/DesignationDropDown/designationDropDown';
import InterviewsListSlice from '../features/slices/GetInterviewsListSlice/InterviewsListSlice';
import LeaveSlices from '../features/slices/LeaveSlices/LeaveSlices';
import EmployeeSlice from '../features/slices/EmployeeSlices/EmployeeSlice';
import JobTemplateSlice from '../features/slices/TemplateSlice/Template'
import AssetsSlice from '../features/slices/AssetsSlice/assets';
import ImportCandidateSlice from '../features/slices/ImportCandidateSlice/ImportCandidate'

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
    projectListDropdown:ProjectListDropdownSlice,
    designationDropDown:DesignationSlices,
    interviewList: InterviewsListSlice,
    leave:LeaveSlices,
    employee:EmployeeSlice,
    template: JobTemplateSlice,
    assets:AssetsSlice,
    import:ImportCandidateSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check
  }),

});

export default store;
