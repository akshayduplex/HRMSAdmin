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

import TimePeriod from "./TimePeriod";
import ExcelModel from "./ExcelModal";
import AllHeaders from "../partials/AllHeaders";




const TimeSheet = ()=> {

  const [modalShow, setModalShow] = useState(false);

  //const [showFirstIcon, setShowFirstIcon] = useState(true);

  const handleFirstIconClick = () => {
    //setShowFirstIcon(false);
  };
  const initialRows = [
    {
      id: 1,
      ID: "EID100100",

      candidateInfo: {
        Name: "Anshul Awasthi",
        Designation: "Engineer",
        email: "john@example.com",
        phone: "1234567890",
      },
      ARD: "20 days",
      Type: "On-role",
      Overtime: "2 hours",
      SickLeaves: "2 Days",
      PTO: "-",
      PaidHoliday: "1 Day",
      TotalDays: "20 Days",
      Status: "false",
    },
    {
      id: 2,
      ID: "EID100101",
      candidateInfo: {
        Name: "Anshul Awasthi",
        Designation: "Engineer",
        email: "john@example.com",
        phone: "1234567890",
      },
      ARD: "20 days",
      Type: "On-role",
      Overtime: "2 hours",
      SickLeaves: "2 Days",
      PTO: "-",
      PaidHoliday: "1 Day",
      TotalDays: "20 Days",
      Status: "false",
    },
    {
      id: 3,
      ID: "EID100102",
      candidateInfo: {
        Name: "Anshul Awasthi",
        Designation: "Engineer",
        email: "john@example.com",
        phone: "1234567890",
      },
      ARD: "20 days",
      Type: "On-role",
      Overtime: "2 hours",
      SickLeaves: "2 Days",
      PTO: "-",
      PaidHoliday: "1 Day",
      TotalDays: "20 Days",
      Status: "true",
    },
    {
      id: 4,
      ID: "EID100103",

      candidateInfo: {
        Name: "Anshul Awasthi",
        Designation: "Engineer",
        email: "john@example.com",
        phone: "1234567890",
      },
      ARD: "20 days",
      Type: "On-role",
      Overtime: "2 hours",
      SickLeaves: "2 Days",
      PTO: "-",
      PaidHoliday: "1 Day",
      TotalDays: "20 Days",
      Status: "true",
    },
    {
      id: 5,
      ID: "EID100104",

      candidateInfo: {
        Name: "Anshul Awasthi",
        Designation: "Engineer",
        email: "john@example.com",
        phone: "1234567890",
      },
      ARD: "20 days",
      Type: "On-role",
      Overtime: "2 hours",
      SickLeaves: "2 Days",
      PTO: "-",
      PaidHoliday: "1 Day",
      TotalDays: "20 Days",
      Status: "true",
    },
  ];
  const [age, setAge] = useState("");
  const [rows, setRows] = useState(initialRows);

  const handleChangeValue = (event) => {
    setAge(event.target.value);
  };


  setTimeout(()=>{
    setRows(initialRows);
  },10);

  const columns = [
    { field: "ID", headerName: "ID", flex: 0.6 },
    {
      field: "Name",
      headerName: "Name",
      renderCell: (params) => (
        <div className="candinfo">
          <Link to="/attendance-details">
            <p className="color-blue"> {params.row.candidateInfo.Name}</p>
          </Link>
          <span>
            {params.row.candidateInfo.Designation}
          </span>
        </div>
      ),
      flex: 0.8,
    },
    { field: "Type", headerName: "Type", flex: 0.7 },
    { field: "ARD", headerName: "ARD", flex: 0.7 },
    { field: "Overtime", headerName: "Overtime", flex: 0.6 },
    { field: "SickLeaves", headerName: "Sick Leaves", flex: 0.6 },
    { field: "PTO", headerName: "PTO", flex: 0.4 },
    { field: "PaidHoliday", headerName: "Paid Holiday", flex: 0.6 },
    { field: "TotalDays", headerName: "Total Days", flex: 0.6 },
    {
      field: "actions",
      headerName: "Actions",

      renderCell: (params) => (
        <div className="d-flex flex-column justify-content-end align-items-center">
          <div className="time_action" style={{ cursor: "pointer" }}>
              <div className="timesht_noaction">
                <FiMinusCircle
                  size={20}
                  onClick={handleFirstIconClick}
                  className="text-secondary"
                />
              </div>

          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <AllHeaders/>
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex flex-row gap-3 align-items-center flex-70 reload-btn justify-content-between ">
            <h3 className="d-inline">Time Sheet & Attendance</h3>
            <TimePeriod />
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
                  <InputLabel id="demo-simple-select-label">
                    Select Project
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Select Project"
                    onChange={handleChangeValue}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <div className="position-relative srchemployee">
                <Form.Control
                  type="text"
                  className="w-100 ps-4 ms-2 form-control fs-6"
                  placeholder="Search Employee"
                />
                <div className="srchicon">
                  <IoSearchOutline size={"16px"} />
                </div>
              </div>
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
      <ExcelModel show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default TimeSheet ;
