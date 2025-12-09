
// import React, { useEffect} from "react";
// import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom';
// import Login from "./Login";
// import UpcomingInterview from "./components/UpcomingInterview";
// import TodayInterview from "./components/TodayInterview";
// import MyComponent from "./components/MyComponent";
// import CandidateProfile from "./components/CandidateProfile";
// import RescheduleInterview from "./components/RescheduleInterview";
// import MyProfile from "./components/MyProfile";
// import AOS from 'aos';
// import 'aos/dist/aos.css';


// function App() {
//   useEffect(() => {
//     AOS.init({
//       duration: 800, // animation duration
//       once: true, // whether animation should happen only once - while scrolling down
//     });
//   }, []);

//   const RequireAuth = ({ children }) => {
//     const employeeLogin = JSON.parse(window.sessionStorage.getItem("employeeLogin"));
//     const userId = employeeLogin ? employeeLogin._id : null;
//     return userId ? children : <Navigate to="/login" />;
//   };

//   return (
//     <>
//       <BrowserRouter>
//         <MyComponent />
//         <Routes>
//           <Route exact path='/' element={<Login />} />
//           <Route exact path='/login' element={<Login />} />
//           <Route exact path='/upcoming' element={<RequireAuth><UpcomingInterview /></RequireAuth>} />
//           <Route exact path='/today-interview' element={<RequireAuth><TodayInterview /></RequireAuth> } />
//           <Route exact path='/candidate-profile/:_id' element={<RequireAuth><CandidateProfile /></RequireAuth>} />
//           <Route exact path='/reschedule/:_id' element={<RequireAuth><RescheduleInterview /></RequireAuth>} />
//           <Route exact path='/profile' element={<RequireAuth><MyProfile/></RequireAuth>} />
//           <Route exact path='*' element={<Navigate to="/login" />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

