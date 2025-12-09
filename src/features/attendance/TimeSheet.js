import React, { useState } from "react"; // Ensure useState is imported
import GoBackButton from "../goBack/GoBackButton";
import { IoSearchOutline } from "react-icons/io5";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom"
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { DataGrid } from "@mui/x-data-grid";
import { FiMinusCircle } from "react-icons/fi";
import Select from "@mui/material/Select";
//import { FaCheckCircle } from "react-icons/fa";
import Box from "@mui/material/Box";

import { IoDocumentAttachOutline } from "react-icons/io5";
import { TbFileImport } from "react-icons/tb";

import AllHeaders from "../partials/AllHeaders";
import TimePeriod from "./TimePeriod";
import { Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import AsyncSelect from 'react-select/async';
// import Ex
import ExcelModal from './ExcelModal'
import { useDispatch } from "react-redux";
import { FetchClosedProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";




// const TimeSheet = ()=> {

//   const [modalShow, setModalShow] = useState(false);

//   //const [showFirstIcon, setShowFirstIcon] = useState(true);

//   const handleFirstIconClick = () => {
//     //setShowFirstIcon(false);
//   };
//   const initialRows = [
//     {
//       id: 1,
//       ID: "EID100100",

//       candidateInfo: {
//         Name: "Anshul Awasthi",
//         Designation: "Engineer",
//         email: "john@example.com",
//         phone: "1234567890",
//       },
//       ARD: "20 days",
//       Type: "On-role",
//       Overtime: "2 hours",
//       SickLeaves: "2 Days",
//       PTO: "-",
//       PaidHoliday: "1 Day",
//       TotalDays: "20 Days",
//       Status: "false",
//     },
//     {
//       id: 2,
//       ID: "EID100101",
//       candidateInfo: {
//         Name: "Anshul Awasthi",
//         Designation: "Engineer",
//         email: "john@example.com",
//         phone: "1234567890",
//       },
//       ARD: "20 days",
//       Type: "On-role",
//       Overtime: "2 hours",
//       SickLeaves: "2 Days",
//       PTO: "-",
//       PaidHoliday: "1 Day",
//       TotalDays: "20 Days",
//       Status: "false",
//     },
//     {
//       id: 3,
//       ID: "EID100102",
//       candidateInfo: {
//         Name: "Anshul Awasthi",
//         Designation: "Engineer",
//         email: "john@example.com",
//         phone: "1234567890",
//       },
//       ARD: "20 days",
//       Type: "On-role",
//       Overtime: "2 hours",
//       SickLeaves: "2 Days",
//       PTO: "-",
//       PaidHoliday: "1 Day",
//       TotalDays: "20 Days",
//       Status: "true",
//     },
//     {
//       id: 4,
//       ID: "EID100103",

//       candidateInfo: {
//         Name: "Anshul Awasthi",
//         Designation: "Engineer",
//         email: "john@example.com",
//         phone: "1234567890",
//       },
//       ARD: "20 days",
//       Type: "On-role",
//       Overtime: "2 hours",
//       SickLeaves: "2 Days",
//       PTO: "-",
//       PaidHoliday: "1 Day",
//       TotalDays: "20 Days",
//       Status: "true",
//     },
//     {
//       id: 5,
//       ID: "EID100104",

//       candidateInfo: {
//         Name: "Anshul Awasthi",
//         Designation: "Engineer",
//         email: "john@example.com",
//         phone: "1234567890",
//       },
//       ARD: "20 days",
//       Type: "On-role",
//       Overtime: "2 hours",
//       SickLeaves: "2 Days",
//       PTO: "-",
//       PaidHoliday: "1 Day",
//       TotalDays: "20 Days",
//       Status: "true",
//     },
//   ];
//   const [age, setAge] = useState("");
//   const [rows, setRows] = useState(initialRows);

//   const handleChangeValue = (event) => {
//     setAge(event.target.value);
//   };


//   setTimeout(()=>{
//     setRows(initialRows);
//   },10);

//   const columns = [
//     { field: "ID", headerName: "ID", flex: 0.6 },
//     {
//       field: "Name",
//       headerName: "Name",
//       renderCell: (params) => (
//         <div className="candinfo">
//           <Link to="/attendance-details">
//             <p className="color-blue"> {params.row.candidateInfo.Name}</p>
//           </Link>
//           <span>
//             {params.row.candidateInfo.Designation}
//           </span>
//         </div>
//       ),
//       flex: 0.8,
//     },
//     { field: "Type", headerName: "Type", flex: 0.7 },
//     { field: "ARD", headerName: "ARD", flex: 0.7 },
//     { field: "Overtime", headerName: "Overtime", flex: 0.6 },
//     { field: "SickLeaves", headerName: "Sick Leaves", flex: 0.6 },
//     { field: "PTO", headerName: "PTO", flex: 0.4 },
//     { field: "PaidHoliday", headerName: "Paid Holiday", flex: 0.6 },
//     { field: "TotalDays", headerName: "Total Days", flex: 0.6 },
//     {
//       field: "actions",
//       headerName: "Actions",

//       renderCell: (params) => (
//         <div className="d-flex flex-column justify-content-end align-items-center">
//           <div className="time_action" style={{ cursor: "pointer" }}>
//               <div className="timesht_noaction">
//                 <FiMinusCircle
//                   size={20}
//                   onClick={handleFirstIconClick}
//                   className="text-secondary"
//                 />
//               </div>

//           </div>
//         </div>
//       ),
//     },
//   ];
//   return (
//     <>
//       <AllHeaders/>
//       <div className="maincontent">
//         <div className="container" data-aos="fade-in" data-aos-duration="3000">
//           <GoBackButton />
//           <div className="d-flex flex-row gap-3 align-items-center flex-70 reload-btn justify-content-between ">
//             <h3 className="d-inline">Time Sheet & Attendance</h3>
//             <TimePeriod />
//             <div className="pagelink_btn">
//               <button className="btn hrtop_btns">
//                              Create Report
//                 <IoDocumentAttachOutline />
//               </button>
//             </div>
//           </div>
//           <div className="mt-4 d-flex justify-content-between">
//             <div className="d-flex flex-row gap-2 align-items-center">
//               <Box sx={{ minWidth: 190 }}>
//                 <FormControl fullWidth>
//                   <InputLabel id="demo-simple-select-label">
//                     Select Project
//                   </InputLabel>
//                   <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     value={age}
//                     label="Select Project"
//                     onChange={handleChangeValue}
//                   >
//                     <MenuItem value={10}>Ten</MenuItem>
//                     <MenuItem value={20}>Twenty</MenuItem>
//                     <MenuItem value={30}>Thirty</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>
//               <div className="position-relative srchemployee">
//                 <Form.Control
//                   type="text"
//                   className="w-100 ps-4 ms-2 form-control fs-6"
//                   placeholder="Search Employee"
//                 />
//                 <div className="srchicon">
//                   <IoSearchOutline size={"16px"} />
//                 </div>
//               </div>
//             </div>
//             <div className="d-flex flex-row gap-2 align-items-center">
//               <button className="site_tbtn d-flex align-items-center gap-2" onClick={() => setModalShow(true)}>
//                 <TbFileImport />
//                 Import Excel
//               </button>
//               <div className="attendence_btn">
//                 <button className="bgblue_btn">Remind Approver</button>
//               </div>
//               <button className="sitebtn sendpayroll_btn">Send To Payroll</button>
//             </div>
//           </div>
//           <div className="mt-4">
//             <div className="w-100 hide-check mt-3">
//               <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 disableRowSelectionOnClick
//                 initialState={{
//                   pagination: {
//                     paginationModel: { page: 0, pageSize: 10 },
//                   },
//                 }}
//                 pageSizeOptions={[10, 20]}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <ExcelModel show={modalShow} onHide={() => setModalShow(false)} />
//     </>
//   );
// }

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
    '&:hover': {
      borderColor: '#D2C9FF',
    },
    width: '270px',
    height: '44px',
  }),
  menu: (provided) => ({
    ...provided,
    borderTop: '1px solid #D2C9FF',
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #D2C9FF',
    color: state.isSelected ? '#fff' : '#000',
    backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
    '&:hover': {
      backgroundColor: '#80CBC4',
      color: '#fff',
    },
  }),
};


const TimeSheet = () => {

  const [modalShow, setModalShow] = useState(false);
  const [option, setOptions] = useState(null)
  const [projectListOption, setProjectOptions] = useState(null);
  const dispatch = useDispatch();


  const [showFirstIcon, setShowFirstIcon] = useState(true);

  const handleFirstIconClick = () => {
    setShowFirstIcon(false);
  };
  const initialrows = [
    {
      id: 1,
      projectInfo: {
        Name: "HLFPPT",
      },
      totalEmployees: "20",
      totalDays: "20 days",
      Payout: "500k",
      monthYear: "April 2024",
      creditDate: "15 April 2024",
      Status: "false",
    },
    {
      id: 2,
      projectInfo: {
        Name: "HLFPPT",
      },
      totalEmployees: "20",
      totalDays: "20 days",
      Payout: "500k",
      monthYear: "April 2024",
      creditDate: "15 April 2024",
      Status: "false",
    },
    {
      id: 3,
      projectInfo: {
        Name: "HLFPPT",
      },
      totalEmployees: "20",
      totalDays: "20 days",
      Payout: "500k",
      monthYear: "April 2024",
      creditDate: "15 April 2024",
      Status: "false",
    },
    {
      id: 4,
      projectInfo: {
        Name: "HLFPPT",
      },
      totalEmployees: "20",
      totalDays: "20 days",
      Payout: "500k",
      monthYear: "April 2024",
      creditDate: "15 April 2024",
      Status: "false",
    },
    {
      id: 5,
      projectInfo: {
        Name: "HLFPPT",
      },
      totalEmployees: "20",
      totalDays: "20 days",
      Payout: "500k",
      monthYear: "April 2024",
      creditDate: "15 April 2024",
      Status: "false",
    },
    {
      id: 6,
      projectInfo: {
        Name: "HLFPPT",
      },
      totalEmployees: "20",
      totalDays: "20 days",
      Payout: "500k",
      monthYear: "April 2024",
      creditDate: "15 April 2024",
      Status: "false",
    },


  ];

  const [age, setAge] = useState("");
  const [rows, setRows] = useState(initialrows);

  const handleChangeValue = (event) => {
    setAge(event.target.value);
  };


  const columns = [
    {
      field: "projectInfo",
      headerName: "Project Name",
      renderCell: (params) => (
        <div className="candinfo">
          <Link to="/">
            <p className="color-blue"> {params.row.projectInfo.Name}</p>
          </Link>
        </div>
      ),
      flex: 0.8,
    },
    { field: "totalEmployees", headerName: "Total Employees", flex: 0.7 },
    { field: "totalDays", headerName: "Total Days", flex: 0.7 },
    { field: "Payout", headerName: "Payout", flex: 0.6 },
    { field: "monthYear", headerName: "Month/Year", flex: 0.4 },
    { field: "creditDate", headerName: "Credit Date", flex: 0.4 },

    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div className="d-flex flex-column justify-content-end align-items-center">
          <div className="h-100 buttnner">
            <Dropdown className="tbl_dropdown">
              <Dropdown.Toggle>
                <BsThreeDotsVertical className="fs-5" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="py-2 min-widther mt-2">
                <Dropdown.Item>
                  <div className="d-flex">
                    <span>Import Credit Report</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item href="/view-salary">
                  <div className="d-flex">
                    <span>View Salary</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div className="d-flex">
                    <span>View Attendance</span>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      ),


    },
  ];

  /********************** Project List Dropdown ********************/
  const projectLoadOption = async (input) => {
    const result = await dispatch(FetchClosedProjectListDropDown(input)).unwrap();
    return result;
  }
  const projectMenuOpen = async () => {
    const result = await dispatch(FetchClosedProjectListDropDown('')).unwrap();
    setOptions(result);
  }
  const handleProjectChanges = (option) => {
    setProjectOptions(option);
  }


  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex flex-row gap-3 align-items-center flex-70 reload-btn justify-content-between ">
            <h3 className="d-inline">Time Sheet & Attendance</h3>
            <div className="pagelink_btn">
              <button className="btn hrtop_btns">
                Create Report
                <IoDocumentAttachOutline />
              </button>
            </div>
          </div>
          <div className="mt-4 d-flex justify-content-between">
            <div className="d-flex flex-row gap-2 align-items-center">
              <Box sx={{ minWidth: 190 }}>
                <FormControl fullWidth>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    defaultValue={option}
                    loadOptions={projectLoadOption}
                    value={projectListOption}
                    onMenuOpen={projectMenuOpen}
                    placeholder="Select Project"
                    onChange={handleProjectChanges}
                    classNamePrefix="react-select"
                    isSearchable
                    styles={customStyles}
                  />
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 320 }}>
                <FormControl fullWidth>
                  <TimePeriod />
                </FormControl>
              </Box>
            </div>
            <div className="d-flex flex-row gap-2 align-items-center">
              <button className="site_tbtn d-flex align-items-center gap-2" onClick={() => setModalShow(true)}>
                <TbFileImport />
                Import Excel
              </button>
              <div className="attendence_btn">
                <button className="bgblue_btn">Remind Approver</button>
              </div>
              <button className="sitebtn sendpayroll_btn">Send To Payroll</button>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-100 hide-check mt-3">
              <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 20]}
              />
            </div>
          </div>
        </div>
      </div>
      <ExcelModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}


export default TimeSheet;
