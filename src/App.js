import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import AOS from 'aos';
import store from './store/store';
import { setUser } from './features/auth/authSlice';
import Login from './features/auth/Login';
import VerifyOtp from './features/auth/VerifyOtp';
import CandidateDetail from './features/attendance/CandidateDetail';
import Dashboard from './features/dashboard/Dashboard';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageAssessment from './features/job/ManageAssessment';
import Interviews from './features/Interviewer/Interviewer';
import PayrollIndex from './features/payroll/PayrollIndex';
import EmploymentTracker from './features/EmployeeTracker/EmployeeTracker';
import ProjectTrackers from './features/ProjectTracker/ProjectTracker';
import AlumniTracker from './features/EmployeeAlumniTracker/EmployeeAlumniTracker';

import AnalyticsDashboard from "./AnalyticiDashboard-files/AnalyticsDashboard"

import All from "./employee/all";
import Empaneled from "./employee/Empaneled";
import Contract from "./employee/Contract";
import Onboarding from "./employee/onboarding";
import Define from "./employee/define";
import People from "./employee/People";
import Appraisal from "./employee/Appraisal";
import Extension from "./employee/Extension";
import FullnFinal from "./employee/FnF";

// manish import

import Division from './features/division/Division';
import Region from './features/region/Region';
import Bank from './features/bank/Bank';
import Occupation from './features/occupation/Occupation';
import Dispensary from './features/dispensary/Dispensary';
import Tags from './features/tags/Tags';
import Education from './features/education/Education';
import AddLocation from './features/location/AddLocation';
import AddDesignation from './features/designation/AddDesignation';
import Duration from './features/duration/Duration';
import Department from './features/department/Department';
import State from './features/state/State'
import Benefits from './features/benefits/Benefits';
import Holiday from './features/holiday/Holiday';
import Cms from './features/cms/Cms';
import SalaryRange from './features/salaryRange/SalaryRange';
import Leave from './features/leave/Leave';
import GradeList from './features/GradeList/GradeList';
import ManPowerAcquisitions from './features/ManpowerAcuisuition/AddManPowers';
import ListManpowerRequisition from './features/ManpowerAcuisuition/ListofManPowers';
import MprFormValidation from './features/mprFormValidattion/mprForm';
import AssessmentList from './features/AssesmentLIst/AssesmentList';
import RQFormData from './features/ApprovedRQForm/RqFrom';

// Candidate Profile Data  ->>>>>>>>>>>>>>>>>>>>>>>>>>
import UpcomingInterview from "./candidate_pannel/src/components/UpcomingInterview";
import TodayInterview from "./candidate_pannel/src/components/TodayInterview";
import MyComponent from "./candidate_pannel/src/components/MyComponent";
import CandidateProfiles from "./candidate_pannel/src/components/CandidateProfile";
import RescheduleInterview from "./candidate_pannel/src/components/RescheduleInterview";
import MyProfile from "./candidate_pannel/src/components/MyProfile";
import AddRoleUsers from './features/RoleUsers/AddRoleUsers';
import RoleUserListing from './features/RoleUsers/RoleUsersList';
import AssignMenus from './features/RoleUsers/AssignMenu';
import ViewSalary from './features/attendance/ViewSalary';
import RunPayroll from './features/payroll/RunPayroll';
import SystemSetting from './features/SystemSetting/SystemSetting';
import AddCurrency from './features/Currency/CurrencyMaster';
import AllHeaders from './features/partials/AllHeaders';
import BatchId from './features/Batch/AddBatchId';
import ExpiredAlert from './ExpiredAlert';
import AssetManagement from './features/Assets/AssetsListing';
import AssetsMaster from './features/AssetsMaster/assetsMaster';
import ApproveOfferValidation from './features/ApprovalOrRejectEmail/ApprovalEmail';
import AddCandidate from './features/ats/AddCandidateForm';
import ImportCandidate from './features/ImportCandidate/ImportCandidate';
import CeoDashboard from './features/CeoDashboard/CeoDashboard';
import ListManpowerRequisitionCeo from './features/CeoDashboard/ManpoweAccuzitionListCeo';
import ApprovalTableCeo from './features/CeoDashboard/CeoApprovalNote';
import ListOfInterviewedCandidateOfCeo from './features/CeoDashboard/CeoInterviewTables';
import ImportEmployee from './employee/ImportEmployee/ImportEmployee';
import ImportSalary from './employee/ImportSalary/ImportSalary';
import TemplateSetting from './features/template_setting/templateSetting';
import SendOfferLatterForApprovalCandidate from './features/SendOfferLatterDetailsPage/SendOfferLatterDetailsPage';
import AppliedFromMaster from './features/AppliedFromMaster/AppliedFromMaster';
import EmpApprovalNotes from './candidate_pannel/src/components/Feature/EmployeeApproval/EmployeeApr';
import MprApprovalDashboard from './candidate_pannel/src/components/Feature/EmployeeMpr/EmpMprListing';
import LeaveManagement from './candidate_pannel/src/components/Feature/AppliedLeave/EmpAppliedLeave';
import ReferenceCheck from './candidate_pannel/src/components/Feature/ReferenceCheck/ReferenceCheck';
import JoiningCandidateList from './features/JoiningCandidates/CandidateJoiningDetails';
import ApplicationFormListing from './features/ApplicationForms/ApplicationFormsListing';
import ReferenceCheckForm from './features/RefereanceCheckApproval/ReferealCheckApproval';
import ReferralCheckDetails from './features/ReferalCheckDetails/ReferalTabs';
import ScoreComparison from './features/ScoreCamparisionSheet/ScoreCamparision';
import AllInterviewListDetails from './candidate_pannel/src/components/Feature/AllInterviewList/AllIntertviewList';
import AppointmentApproval from './candidate_pannel/src/components/Feature/AppointmentLatterApproval/AppointmentLatter';
import PreviewOfferAndAppointment from './features/SendOfferLatterDetailsPage/PreviewOfferAndAppointment';
import AppointmentApprovalAdmin from './features/AppointmentPendingList/AppointPendindList';
import HodDesk from './features/HodDashboard/HodDesk';
import AppointmentApprovalHod from './features/HodDashboard/HodAppointmentLetter';
import ApprovalTableHod from './features/HodDashboard/ApprovalNoteHod';
import ListManpowerRequisitionHod from './features/HodDashboard/HodMprListing';
import ListOfInterviewedCandidateOfHod from './features/HodDashboard/HodInterviewListing';
import FeedBackOpenpage from './features/FeedbackOpen/FeedBackOpenpage';
import TemplatePreviewPage from './features/SendOfferLatterDetailsPage/PreviewStaticOfferAndAppointment';
const lazyLoad = lazy(() => import('./features/HodDashboard/HodInterviewListing'));
// import DataTableComponent from './features/test/testFeatures';


/**
 * 
 * @param {*} param 
 * @returns Navbar Components
 */
const NavbarHandler = ({ children }) => {
  return (
    <>
      <MyComponent />
      {children}
    </>
  )
}

/**
 * @description make verified the Access Role base Permission
 */
const hasAccess = (slug) => {
  let LoginUsersData = JSON.parse(localStorage.getItem('admin_role_user'));
  const route = LoginUsersData?.permissions?.find(route => route.slug === slug);
  return route ? true : false;
};

/**
 * @description check the Login uses
 * @param {*} param 
 * @returns 
 */
const RequireAuthEmployee = ({ children }) => {
  const employeeLogin = JSON.parse(window.sessionStorage.getItem("employeeLogin"));
  const employeewithLogin = JSON.parse(localStorage.getItem("employeeLogin"));
  const userId = employeeLogin ? employeeLogin._id : null;
  return userId || employeewithLogin ? children : <Navigate to="/login" />;
};

/**
 * @description Handle the Token Expiration
 * @returns 
 */
const HandleTokenExpiredAlert = () => {
  const location = useLocation();
  const excludedRoutes = ["/login", "/verify-otp", "/mprFrm", "/rqForm", "/offerApprovalForm", "/referenceCheck", '/interviewFeedback'];

  const isExcluded = excludedRoutes.some((route) =>
    location.pathname.includes(route)
  );
  return !isExcluded && <ExpiredAlert />;
};

// handle required auth from the Interviews Panel
const RequireAuth = ({ children }) => {
  const existingSession = localStorage.getItem('admin_role_user');
  const dispatch = useDispatch();
  useEffect(() => {
    if (existingSession) {
      dispatch(setUser(JSON.parse(existingSession)));
    }
  }, [dispatch, existingSession]);

  return existingSession ? children : <Navigate to="/login" />;
};


// const clearCacheData = () => {
//   caches.keys().then((names) => {
//       names.forEach((name) => {
//           caches.delete(name);
//       });
//   });
//   alert("Complete Cache Cleared");
// };

const HandleNavbar = () => {
  const location = useLocation();
  const str = location.pathname;
  if (!str) {
    return null;
  }
  if (
    str?.includes('/login') ||
    str?.includes('/mprFrm') ||
    str?.includes('/rqForm') ||
    str?.includes('/upcoming') ||
    str?.includes('/all-interview') ||
    str?.includes('/employee-approval') ||
    str?.includes('/employee-apply-leave') ||
    str?.includes('/employee-reference') ||
    str?.includes('/referenceCheck') ||
    str?.includes('/employee-mpr') ||
    str?.includes('/today-interview') ||
    str?.includes('/candidate-profiles') ||
    str?.includes('/reschedule') ||
    str?.includes('/profile') ||
    str?.includes('/verify-otp') ||
    str?.includes('/offerApprovalForm') ||
    str?.includes('/appointmentApproval') ||
    str?.includes('/interviewFeedback')
  ) {
    return null
  }
  return <AllHeaders />
}


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
        < HandleNavbar />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path='/mprFrm/:id' element={<MprFormValidation />} />
          <Route exact path='/rqForm/:id' element={<RQFormData />} />
          <Route exact path='/interviewFeedback/:id' element={<Suspense fallback={<div className="text-center">Loading...</div>}>
            <FeedBackOpenpage />
          </Suspense>} />
          <Route exact path='/offerApprovalForm/:id' element={<ApproveOfferValidation />} />
          <Route exact path='/referenceCheck/:id' element={<ReferenceCheckForm />} />
          <Route exact path='/upcoming' element={<RequireAuthEmployee> <NavbarHandler> <UpcomingInterview /> </NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/appointmentApproval' element={<RequireAuthEmployee> <NavbarHandler> <AppointmentApproval /> </NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/all-interview' element={<RequireAuthEmployee> <NavbarHandler> <AllInterviewListDetails /> </NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/employee-mpr' element={<RequireAuthEmployee> <NavbarHandler> <EmpApprovalNotes /> </NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/employee-approval' element={<RequireAuthEmployee> <NavbarHandler> <MprApprovalDashboard /> </NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/employee-apply-leave' element={<RequireAuthEmployee> <NavbarHandler> <LeaveManagement /> </NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/employee-reference' element={<RequireAuthEmployee> <NavbarHandler> <ReferenceCheck /> </NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/today-interview' element={<RequireAuthEmployee> <NavbarHandler><TodayInterview /></NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/candidate-profiles/:_id' element={<RequireAuthEmployee> <NavbarHandler> <CandidateProfiles /> </NavbarHandler> </RequireAuthEmployee>} />
          <Route exact path='/reschedule/:_id' element={<RequireAuthEmployee> <NavbarHandler>  <RescheduleInterview /> </NavbarHandler></RequireAuthEmployee>} />
          <Route exact path='/profile' element={<RequireAuthEmployee> <NavbarHandler>  <MyProfile /> </NavbarHandler></RequireAuthEmployee>} />

          <Route exact path="/verify-otp" element={<VerifyOtp />} />
          <Route exact path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route exact path="/analytics" element={hasAccess("analytics") ? (<RequireAuth><AnalyticsDashboard /></RequireAuth>) : (<Navigate to="/login" replace />)} />
          <Route exact path="/projects" element={hasAccess("projects") ? (<RequireAuth><ProjectsList /></RequireAuth>) : (<Navigate to="/login" replace />)} />
          <Route exact path="/add-project" element={hasAccess("add-project") ? (<RequireAuth><AddProjectData /></RequireAuth>) : (<Navigate to="/login" replace />)} />
          <Route exact path="/close-project" element={<RequireAuth><CloseProject /></RequireAuth>} />
          <Route
            exact
            path="/ats"
            element={
              hasAccess("ats") ? (
                <RequireAuth>
                  <Ats />
                </RequireAuth>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/template-preview/:candidateId/:approvalId" element={<TemplatePreviewPage />} />
          <Route exact path="/candidate-listing" element={<RequireAuth><CandidateListing /></RequireAuth>} />
          <Route exact path="/candidate-joining-listing" element={<RequireAuth><JoiningCandidateList /></RequireAuth>} />
          <Route exact path="/approval-candidate-list/:id" element={<RequireAuth><SendOfferLatterForApprovalCandidate /></RequireAuth>} />
          <Route exact path="/preview-letter" element={<RequireAuth><PreviewOfferAndAppointment /></RequireAuth>} />
          <Route exact path="/appointment-approval" element={<RequireAuth><AppointmentApprovalAdmin /></RequireAuth>} />
          <Route exact path="/appointment-approval-hod" element={<RequireAuth><AppointmentApprovalHod /></RequireAuth>} />
          <Route exact path="/referral-check-details/:id" element={<RequireAuth><ReferralCheckDetails /></RequireAuth>} />
          <Route exact path="/create-job" element={<RequireAuth><CreateJob /></RequireAuth>} />
          <Route exact path="/employee-list" element={<RequireAuth><EmployeeList /></RequireAuth>} />
          <Route exact path="/employee-profile" element={<RequireAuth><EmployeeProfile /></RequireAuth>} />
          <Route exact path="/employee-extension" element={<RequireAuth><EmployeeExtension /></RequireAuth>} />
          <Route exact path="/system-settings" element={<RequireAuth><SystemSetting /></RequireAuth>} />
          <Route exact path="/template-settings" element={<RequireAuth><TemplateSetting /></RequireAuth>} />
          <Route exact path="/currency" element={<RequireAuth><AddCurrency /></RequireAuth>} />
          <Route exact path="/add-candidate" element={<RequireAuth><AddCandidate /></RequireAuth>} />
          <Route exact path="/import-candidate" element={<RequireAuth><ImportCandidate /></RequireAuth>} />
          <Route exact path="/import-employee" element={<RequireAuth><ImportEmployee /></RequireAuth>} />
          <Route exact path="/import-salary" element={<RequireAuth><ImportSalary /></RequireAuth>} />
          <Route exact path="/hod-desk" element={<RequireAuth><HodDesk /></RequireAuth>} />
          <Route exact path="/hod-approval-note" element={<RequireAuth><ApprovalTableHod /></RequireAuth>} />
          <Route exact path="/hod-mpr-list" element={<RequireAuth><ListManpowerRequisitionHod /></RequireAuth>} />
          <Route exact path="/hod-interview-list" element={<RequireAuth><ListOfInterviewedCandidateOfHod /></RequireAuth>} />
          <Route exact path="/ceo-desk" element={hasAccess("ceo-desk") ? (
            <RequireAuth>
              <CeoDashboard />
            </RequireAuth>
          ) : (
            <Navigate to="/dashboard" replace />
          )} />
          <Route exact path="/ceo-mpr-list" element={<RequireAuth><ListManpowerRequisitionCeo /></RequireAuth>} />
          <Route exact path="/ceo-approval-note" element={<RequireAuth><ApprovalTableCeo /></RequireAuth>} />
          <Route exact path="/ceo-candidate-listing" element={<RequireAuth><ListOfInterviewedCandidateOfCeo /></RequireAuth>} />
          {/* <Route exact path="/ceo-approval-note" element={<ApprovalTableCeo />} /> */}
          <Route
            exact
            path="/employee-appraisal"
            element={
              hasAccess("employee-appraisal") ? (
                <RequireAuth>
                  <EmployeeAppraisal />
                </RequireAuth>
              ) : (
                <Navigate to="/login" replace /> // Redirect to /login if access is denied
              )
            }
          />
          <Route exact path="/contract-closure" element={hasAccess('contract-closure') ? (<RequireAuth><EmployeeContractClosure /></RequireAuth>) : <Navigate to={'/login'} replace />} />
          <Route exact path="/attendance-index" element={hasAccess('attendance-index') ? (<RequireAuth><AttendanceIndex /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/time-sheet" element={<RequireAuth><TimeSheet /></RequireAuth>} />
          <Route exact path="/attendance-details" element={hasAccess('attendance-details') ? (<RequireAuth><AttendanceDetails /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/interviews" element={<RequireAuth><Interviews /></RequireAuth>} />
          <Route exact path="/assign-menu/:id" element={<RequireAuth> <AssignMenus /></RequireAuth>} />
          <Route exact path="/candidate-detail" element={<RequireAuth> <CandidateDetail /> </RequireAuth>} />
          <Route exact path="/job-details/:id" element={<RequireAuth><JobDetails /></RequireAuth>} />
          <Route exact path="/score-comparison-sheet" element={<RequireAuth><ScoreComparison /></RequireAuth>} />
          <Route exact path='/job-cards-details/:id' element={<RequireAuth><JobCardDetails /></RequireAuth>} />
          <Route exact path="/candidate-profile/:id" element={<RequireAuth> <CandidateProfile /> </RequireAuth>} />
          <Route exact path="/schedule-interview/:id" element={<RequireAuth> <ScheduleInterview /> </RequireAuth>} />
          <Route exact path="/assessment" element={hasAccess('assessment') ? (<RequireAuth><ManageAssessment /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/employementtracker" element={hasAccess('employementtracker') ? (<RequireAuth><EmploymentTracker /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/project-tracker" element={hasAccess('project-tracker') ? (<RequireAuth><ProjectTrackers /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/employee-alumni-tracker" element={hasAccess('employee-alumni-tracker') ? (<RequireAuth><AlumniTracker /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/gradelist" element={hasAccess('gradelist') ? (<RequireAuth><GradeList /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/manpower-acquisition" element={hasAccess('manpower-acquisition') ? (<RequireAuth><ManPowerAcquisitions /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/manpower-acquisition-list" element={hasAccess('manpower-acquisition-list') ? (<RequireAuth><ListManpowerRequisition /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/assessment-list" element={hasAccess('assessment-list') ? (<RequireAuth><AssessmentList /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/add-role-user" element={hasAccess('add-role-user') ? (<RequireAuth><AddRoleUsers /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/role-users-list" element={hasAccess('role-users-list') ? (<RequireAuth><RoleUserListing /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />

          <Route exact path="/run-payroll" element={<RequireAuth> <RunPayroll /> </RequireAuth>} />
          <Route exact path="/applied-from" element={<RequireAuth> <AppliedFromMaster /> </RequireAuth>} />

          <Route exact path="/payroll" element={hasAccess('payroll') ? (<RequireAuth><PayrollIndex /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/peoples" element={hasAccess('People') ? (<RequireAuth><All /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/Empaneled" element={hasAccess('Empaneled') ? (<RequireAuth><Empaneled /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/fnf" element={hasAccess('fnf') ? (<RequireAuth><FullnFinal /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/Contract" element={hasAccess('Contract') ? (<RequireAuth><Contract /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/Appraisal" element={hasAccess('Appraisal') ? (<RequireAuth><Appraisal /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/Extension" element={hasAccess('Extension') ? (<RequireAuth><Extension /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />

          <Route exact path="/Onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
          <Route exact path="/salary" element={<RequireAuth><Define /></RequireAuth>} />
          <Route exact path="/people-profile" element={<RequireAuth><People /></RequireAuth>} />

          <Route exact path="/assets-managment" element={hasAccess('assets-managment') ? (<RequireAuth><AssetManagement /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          {/* <Route exact path="/application-form" element={hasAccess('assets-managment') ? (<RequireAuth><ApplicationFormListing /></RequireAuth>) : (<Navigate to={'/login'} replace />)} /> */}
          <Route exact path="/add-location" element={hasAccess('add-location') ? (<RequireAuth><AddLocation /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/add-designation" element={hasAccess('add-designation') ? (<RequireAuth><AddDesignation /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/duration" element={hasAccess('duration') ? (<RequireAuth><Duration /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/department" element={hasAccess('department') ? (<RequireAuth><Department /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/state" element={hasAccess('state') ? (<RequireAuth><State /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/division" element={hasAccess('division') ? (<RequireAuth><Division /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/region" element={hasAccess('region') ? (<RequireAuth><Region /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/bank" element={hasAccess('bank') ? (<RequireAuth>  <Bank /> </RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/dispensary" element={hasAccess('dispensary') ? (<RequireAuth><Dispensary /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/occupation" element={hasAccess('occupation') ? (<RequireAuth><Occupation /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/tags" element={hasAccess('tags') ? (<RequireAuth><Tags /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/education" element={hasAccess('education') ? (<RequireAuth><Education /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/benefits" element={hasAccess('benefits') ? (<RequireAuth><Benefits /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/holiday" element={hasAccess('holiday') ? (<RequireAuth><Holiday /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/cms" element={hasAccess('cms') ? (<RequireAuth><Cms /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/salary-range" element={hasAccess('salary-range') ? (<RequireAuth><SalaryRange /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/leave" element={hasAccess('leave') ? (<RequireAuth><Leave /></RequireAuth>) : (<Navigate to={'/login'} replace />)} />
          <Route exact path="/batch-id" element={<RequireAuth> <BatchId /></RequireAuth>} />
          <Route exact path='/view-salary' element={<RequireAuth>< ViewSalary /></RequireAuth>} />
          <Route exact path='/assets-master' element={<RequireAuth>< AssetsMaster /></RequireAuth>} />
          <Route exact path="/job-list" element={<RequireAuth><JobList /></RequireAuth>} />
          <Route exact path="/users" element={<RequireAuth> <UserList /> </RequireAuth>} />
          <Route exact path="/user/new" element={<RequireAuth> <UserForm /> </RequireAuth>} />
          <Route exact path="/user/:id/edit" element={<RequireAuth> <UserForm /> </RequireAuth>} />
          <Route exact path="*" element={<Navigate to="/dashboard" />} />
          {/* Interview Schedule and ReSchedule */}
        </Routes>
        <HandleTokenExpiredAlert />
      </Router>
    </Provider>
  );
};

export default App;
