import React, { useEffect, useState } from "react";
import GoBackButton from "../../employee/Goback";
import Table from "react-bootstrap/Table";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { CgNotes } from "react-icons/cg";
import { SiTicktick } from "react-icons/si";
import { CiEdit } from "react-icons/ci";
import { TiTick } from "react-icons/ti";
import Drawer from "@mui/material/Drawer";
import styled from "styled-components";
import SideAttendanceProfile from "./SideAttendanceProfile";
import TimePeriod from "./TimePeriod";
import AddTimeOff from "./AddTimeOff";
import Edit_manualtime from "./EditManualTime";
import AllHeaders from "../partials/AllHeaders";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeById } from "../slices/LeaveSlices/LeaveSlices";
import { useSearchParams } from "react-router-dom";
import { getRemainingWorkingDays } from "../../utils/common";




const Line = styled.div`
  width: ${(props) => props.width}%;
  height: 5px; // Example height
  background-color: #00B957; // Example color
  margin-bottom: 5px;
`;
const Line2 = styled.div`
  width: ${(props) => props.width}%;
  height: 5px; // Example height
  background-color: #FF2200; // Example color
  margin-bottom: 5px;
`;
const Line3 = styled.div`
  width: ${(props) => props.width}%;
  height: 5px; // Example height
  background-color: #AFAFAF; // Example color
  margin-bottom: 5px;
`;


export default function CandidateDetail() {
  const [selectedDates, setSelectedDates] = useState([]);

  const { Employee } = useSelector((state) => state.leave)

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");


  useEffect(() => {
    dispatch(getEmployeeById(id))
  }, [dispatch, id])

  const handleSelect = (date) => {
    setSelectedDates([...selectedDates, date]);
  };

  const [values, setValues] = useState([]);
  const totalItems = 22;
  const [approval, setApproval] = useState(false);

  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const approvalAccepted = () => {
    setApproval(true);
  };

  // Calculate the percentages for each line
  const firstLinePercent = (Employee.status === 'succeeded' && parseInt(Employee.data?.attendance) / totalItems) * 100;
  const secondLinePercent = (0 / totalItems) * 100;
  const thirdLinePercent = (1 / totalItems) * 100;

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const addTime = (newOpen) => () => {
    setOpenAdd(newOpen);
  };



  const initialrows = [
    {
      id: 1,
      Date: {
        Day: "Mon",
        Dates: "1 April 2024",
      },

      CheckIn: "09:30 am",
      CheckOut: "07:00 pm",
      WorkHour: "1",
      Overtime: "-",
      PTO: "-",
      Note: "1 Day",
      TotalDays: "20 Days",
      showCheck: false,
      approved: false,
    },
    {
      id: 2,
      Date: {
        Day: "Mon",
        Dates: "1 April 2024",
      },

      CheckIn: "09:30 am",
      CheckOut: "07:00 pm",
      WorkHour: "1",
      Overtime: "-",
      PTO: "-",
      Note: "1 Day",
      TotalDays: "20 Days",
      showCheck: false,
      approved: false,
    },
    {
      id: 3,
      Date: {
        Day: "Mon",
        Dates: "1 April 2024",
      },

      CheckIn: "09:30 am",
      CheckOut: "07:00 pm",
      WorkHour: "1",
      Overtime: "-",
      PTO: "-",
      Note: "1 Day",
      TotalDays: "20 Days",
      showCheck: false,
      approved: false,
    },
    {
      id: 4,
      Date: {
        Day: "Mon",
        Dates: "1 April 2024",
      },

      CheckIn: "09:30 am",
      CheckOut: "07:00 pm",
      WorkHour: "1",
      Overtime: "-",
      PTO: "-",
      Note: "1 Day",
      TotalDays: "20 Days",
      showCheck: false,
      approved: false,
    },
    {
      id: 5,
      Date: {
        Day: "Mon",
        Dates: "1 April 2024",
      },

      CheckIn: "09:30 am",
      CheckOut: "07:00 pm",
      WorkHour: "1",
      Overtime: "-",
      PTO: "-",
      Note: "1 Day",
      TotalDays: "20 Days",
      showCheck: false,
      approved: false,
    },
    {
      id: 6,
      Date: {
        Day: "Mon",
        Dates: "1 April 2024",
      },

      CheckIn: "09:30 am",
      CheckOut: "07:00 pm",
      WorkHour: "1",
      Overtime: "-",
      PTO: "-",
      Note: "1 Day",
      TotalDays: "20 Days",
      showCheck: false,
      approved: false,
    },
  ];
  
  const columns = [
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <div className="d-flex flex-row h-100 align-items-center">
          <span className=" border-sec px-3 rounded-3 lineheight32">
            {params.row.Date.Day}
          </span>
          <span className="text-secondary text-start lineheight">
            {params.row.Date.Dates}
          </span>
        </div>
      ),
    },

    { field: "CheckIn", headerName: "Check In", flex: 0.6 },
    { field: "CheckOut", headerName: "Check Out", flex: 0.6 },
    { field: "WorkHour", headerName: "Work Hour", flex: 0.6 },
    { field: "Overtime", headerName: "Overtime", flex: 0.6 },
    {
      field: "Note",
      headerName: "Note",
      flex: 0.4,
      renderCell: (params) => (
        <div className="d-flex flex-row h-100 align-items-center ms-2">
          <CgNotes />
        </div>
      ),
    },

    {
      field: "Approval",
      headerName: "Approval",
      flex: 0.6,
      renderCell: (params) => (
        <div className="d-flex flex-row h-100 align-items-center justify-content-between">
          {!params.row.approved ? (
            <>
              <SiTicktick
                className="text-success"
                onClick={() => changeAprrove(params.row.id)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect width="16" height="16" fill="white" />
                <path
                  d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14Z"
                  fill="#FF2200"
                />
                <path
                  d="M10.7 11.5L8 8.8L5.3 11.5L4.5 10.7L7.2 8L4.5 5.3L5.3 4.5L8 7.2L10.7 4.5L11.5 5.3L8.8 8L11.5 10.7L10.7 11.5Z"
                  fill="#FF2200"
                />
              </svg>
            </>
          ) : (
            <>
              <div>
                <div className="d-flex flex-row gap-1 align-items-center text-success">
                  <TiTick /> Approved
                </div>
              </div>
            </>
          )}
          <div>
            <CiEdit onClick={toggleDrawer(true)} />
          </div>
        </div>
      ),
    },
  ];

  const [rows, setRows] = useState(initialrows);
  const changeAprrove = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, approved: true } : row))
    );
  };

  const changeAprroveAll = () => {
    setRows((prevRows) => prevRows.map((row) => ({ ...row, approved: true })));
  };

  const handleChange = (dates) => {
    if (dates.length > 2) {
      dates.shift();
    }
    setValues(dates);
  };
  const daysBreakdown = {
    totalDays: 22,
    approved: 16,
    rejected: 2,
    pending: 4,
  };

  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="row">
            <div className="col-lg-3">
              <SideAttendanceProfile />
            </div>
            <div className="col-lg-9">
              <TimePeriod />
              <div className="d-flex justify-content-between mt-3 brkdown_row">
                <div className="d-flex flex-row gap-2 align-items-center">
                  <h6 className="mb-0">Days Breakdown</h6>
                  <div className="line-right"></div>
                  <b>{Employee.status === 'succeeded' && Employee.data?.attendance} Days</b>
                </div>
                <div className="d-flex gap-1 align-items-center brkdown_wrap">
                  <div className="brkd_appr brkdwn_box">
                    <p>Present:<span>0 Days</span></p>
                  </div>
                  <div className="brkd_reject brkdwn_box">
                    <p>Absent: <span>0 Days</span></p>
                  </div>
                  <div className="brkd_pend brkdwn_box">
                    <p>Remaining:<span>{getRemainingWorkingDays()}</span></p>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="d-flex flex-row gap-0 align-items-center">
                  <Line width={firstLinePercent}></Line>
                  <Line2 width={secondLinePercent}></Line2>
                  <Line3 width={thirdLinePercent}></Line3>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <div className="">
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch />}
                      label="Show only unapproved days"
                    />
                  </FormGroup>
                </div>
                <div className="d-flex flex-row gap-2">
                  <button className="time-off" onClick={addTime(true)}>
                    Add leave
                  </button>
                  <button className="reject-all">Reject All</button>
                  <button className="confirm" onClick={changeAprroveAll}>
                    Approve All
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-100 hide-check">
                  <Table className="payroll_tables timesheettbles header-white">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Days</th>
                        <th>Overtime</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
                        <td colSpan={6} style={{ textAlign: 'center' }}>
                          No Records Found
                        </td>
                      </tr> */}

                      <tr>
                        <td>
                          <div className="d-flex date_day">
                            <span className="border-sec rounded-5 lineheight32">
                              Mon
                            </span>
                            <span className="text-start lineheight">
                              1 April 2024
                            </span>
                          </div>
                        </td>
                        <td>09:30 am</td>
                        <td>07:00 pm</td>
                        <td>1</td>
                        <td>-</td>
                        <td>
                          <div className="text-end">
                            <CiEdit onClick={toggleDrawer(true)} />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex date_day">
                            <span className="border-sec rounded-5 lineheight32">
                              Tue
                            </span>
                            <span className="text-start lineheight">
                              2 April 2024
                            </span>
                          </div>
                        </td>
                        <td>09:30 am</td>
                        <td>07:00 pm</td>
                        <td>1</td>
                        <td>-</td>
                        <td>
                          <div className="text-end">
                            <CiEdit onClick={toggleDrawer(true)} />
                          </div>
                        </td>
                      </tr>
                      <tr className="leaves-app">
                        <td>
                          <div className="d-flex date_day">
                            <span className="border-sec rounded-5 lineheight32">
                              Wed
                            </span>
                            <span className="text-start lineheight">
                              3 April 2024
                            </span>
                          </div>
                        </td>
                        <td colSpan={2}>
                          <div className="d-flex flex-column gap-2 align-items-start">
                            <b>OD leave</b>
                            <span>Approved by Neha (HOD)</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-2 align-items-start">
                            <b>Type</b>
                            <span>Sick Leave</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-2 align-items-start">
                            <b>Approved on</b>
                            <span>7 April 2024</span>
                          </div>
                        </td>

                        <td colSpan={2}>
                          <div className="d-flex flex-column gap-2 align-items-start">
                            <b>Duration</b>
                            <span>24 Hours</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex date_day">
                            <span className="border-sec rounded-5 lineheight32">
                              Thu
                            </span>
                            <span className="text-start lineheight">
                              4 April 2024
                            </span>
                          </div>
                        </td>
                        <td>09:30 am</td>
                        <td>07:00 pm</td>
                        <td>1</td>
                        <td>-</td>
                        <td>
                          <div className="text-end">
                            <CiEdit onClick={toggleDrawer(true)} />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer open={open} anchor="right" onClose={toggleDrawer(false)}>
        <Edit_manualtime />
      </Drawer>
      <Drawer open={openAdd} anchor="right" onClose={addTime(false)}>
        <AddTimeOff emp={Employee} setOpenAdd={setOpenAdd}/>
      </Drawer>
    </>
  );
}
