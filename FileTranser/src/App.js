import React ,{ useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import AOS from 'aos';
import store from './store/store';
import {setUser} from './features/auth/authSlice';
import Login from './features/auth/Login';
import VerifyOtp from './features/auth/VerifyOtp';


import Dashboard from './features/dashboard/Dashboard';
import Analytics from './features/analytics/Analytics';
import UserList from './features/user/UserList';
import UserForm from './features/user/UserForm';
import AlertBox from './features/alert/AlertBox';

import ProjectsList from './features/projects/ProjectsList';
import AddProjectData from './features/projects/AddProjectData';
import CloseProject from './features/projects/CloseProject';

import Ats from './features/ats/Ats';
import CandidateListing from './features/ats/CandidateListing';
import CreateJob from './features/job/CreateJob';
import JobList from './features/job/JobList';

import EmployeeList from './features/employee/EmployeeList';
import EmployeeProfile from './features/employee/EmployeeProfile';
import EmployeeExtension from './features/employee/EmployeeExtension';
import EmployeeAppraisal from './features/employee/EmployeeAppraisal';
import EmployeeContractClosure from './features/employee/EmployeeContractClosure'
import AttendanceIndex from './features/attendance/AttendanceIndex';
import TimeSheet from './features/attendance/TimeSheet';
import AttendanceDetails from './features/attendance/AttendanceDetails';
import JobDetails from './features/job/JobDetails/JobDetails';
import JobCardDetails from './features/job/JobCartsDetails/JobsCartsDetails';
import CandidateProfile from './features/Candidates/profile/CandidateProfile';
import ScheduleInterview from './features/scheduleInterview/ScheduleInterview';
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import ManageAssessment from './features/ats/ManageAssessment'
import ManageAssessment from './features/job/ManageAssessment';
import Interviews from './features/Interviewer/Interviewer';
import PayrollIndex from './features/payroll/PayrollIndex';
const RequireAuth = ({ children }) => {
  //const user = useSelector((state) => state.auth.userLogin);
  const existingSession = localStorage.getItem('admin_role_user');
  const dispatch = useDispatch();
  
      
      useEffect(() => { 
        if( existingSession ){
          dispatch(setUser( JSON.parse( existingSession) )); 
        }
      }, [dispatch,existingSession]);
     
  //return user ? children : <Navigate to="/login" />;
  return existingSession ? children : <Navigate to="/login" />;
  //return  children;
};
 

// const clearCacheData = () => {
//   caches.keys().then((names) => {
//       names.forEach((name) => {
//           caches.delete(name);
//       });
//   });
//   alert("Complete Cache Cleared");
// };


const App = () => {
  // clearCacheData();
  useEffect(() => {
    AOS.init({
        duration: 800,  
        once: true, 
    });
  }, []); 

  return (
    <Provider store={store}>
      <AlertBox /> 
      <ToastContainer
       position="top-right"
       autoClose={5000}
       theme="light"       
      />
      <Router> 
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/verify-otp" element={<VerifyOtp />} />
          <Route exact path="/dashboard"  element={ <RequireAuth><Dashboard /></RequireAuth>} />
          <Route exact path="/analytics"  element={ <RequireAuth><Analytics /></RequireAuth>} />
          <Route exact path="/projects"  element={ <RequireAuth><ProjectsList /></RequireAuth>} />
          <Route exact path="/add-project"  element={ <RequireAuth><AddProjectData /></RequireAuth>} />
          <Route exact path="/close-project"  element={ <RequireAuth><CloseProject /></RequireAuth>} />
          <Route exact path="/ats"  element={ <RequireAuth><Ats /></RequireAuth>} />
          <Route exact path="/candidate-listing"  element={ <RequireAuth><CandidateListing /></RequireAuth>} />
          <Route exact path="/create-job"  element={ <RequireAuth><CreateJob /></RequireAuth>} />
          <Route exact path="/employee-list"  element={ <RequireAuth><EmployeeList /></RequireAuth>} />
          <Route exact path="/employee-profile"  element={ <RequireAuth><EmployeeProfile /></RequireAuth>} />
          <Route exact path="/employee-extension"  element={ <RequireAuth><EmployeeExtension /></RequireAuth>} />
          <Route exact path="/employee-appraisal"  element={ <RequireAuth><EmployeeAppraisal /></RequireAuth>} />
          <Route exact path="/contract-closure"  element={ <RequireAuth><EmployeeContractClosure /></RequireAuth>} />
          <Route exact path="/attendance-index"  element={ <RequireAuth><AttendanceIndex /></RequireAuth>} />
          <Route exact path="/time-sheet"  element={ <RequireAuth><TimeSheet /></RequireAuth>} />
          <Route exact path="/attendance-details"  element={ <RequireAuth><AttendanceDetails /></RequireAuth>} />
          <Route exact path="/job-details/:id" element={<RequireAuth><JobDetails /></RequireAuth> } />
          <Route exact path='/job-cards-details/:id' element={<RequireAuth><JobCardDetails /></RequireAuth>}/>
          <Route exact path="/candidate-profile/:id" element={<RequireAuth> <CandidateProfile /> </RequireAuth> } />
          <Route exact path="/schedule-interview/:id" element={<RequireAuth> <ScheduleInterview /> </RequireAuth>} />
          <Route exact path="/assessment"  element={ <RequireAuth><ManageAssessment /></RequireAuth>} />
          <Route exact path="/interviews"  element={ <RequireAuth><Interviews /></RequireAuth>} />
          {/* Payroll page */}
          <Route exact path="/payroll" element={<RequireAuth><PayrollIndex /></RequireAuth>} />
          {/* <Route exact path="/run-payroll" element={<Run_payroll />} /> */}

          <Route exact path="/job-list"  element={ <RequireAuth><JobList /></RequireAuth>} />
          <Route exact path="/users" element={ <RequireAuth> <UserList /> </RequireAuth> } />
          <Route exact path="/user/new" element={ <RequireAuth> <UserForm /> </RequireAuth> } />
          <Route exact path="/user/:id/edit" element={ <RequireAuth> <UserForm /> </RequireAuth> } />
          <Route exact path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
