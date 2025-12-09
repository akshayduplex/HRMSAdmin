import React, { useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { FaCircleInfo } from "react-icons/fa6";
import AllHeaders from "../partials/AllHeaders";

const AttendanceIndex = ()=> {
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <>
    <AllHeaders/>
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex justify-content-between reload-btn">
            <div className="d-flex flex-row gap-3 align-items-center">
              <h3>Attendance</h3>
              <Box sx={{ minWidth: 300 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Project
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Select Project"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Project 1</MenuItem>
                    <MenuItem value={20}>Project 2</MenuItem>
                    <MenuItem value={30}>Project 3</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
            <Link to="/time-sheet">
              <button className="btn hrtop_btns">
                Go To Timesheet
               <FaCircleInfo />
              </button>
            </Link>
          </div>
          <div className="row mt-2 gy-3">
            <div className="col-lg-4">
              <div className="card attend_card rounded-3 card-border">
                <div className="card-body pb-4">
                  <div className="d-flex flex-column gap-4 justify-content-start align-items-start">
                    <span>Total Employee Count</span>
                    <h2><CountUp end={1000} duration={5} /></h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card attend_card rounded-3 card-border">
                <div className="card-body pb-4">
                  <div className="d-flex flex-column gap-4 justify-content-start align-items-start">
                    <span>On leave Today</span>
                    <h2><CountUp end={55} duration={5}/></h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card attend_card rounded-3 card-border">
                <div className="card-body pb-4">
                  <div className="d-flex flex-column gap-4 justify-content-start align-items-start">
                    <span>On Duty Today</span>
                    <h2><CountUp end={945} duration={5}/></h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card attend_card rounded-3 card-border">
                <div className="card-body pb-4">
                  <div className="d-flex flex-column gap-4 justify-content-start align-items-start">
                    <span>Total Sick Leave Today</span>
                    <h2><CountUp end={10} duration={5}/></h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card attend_card rounded-3 card-border">
                <div className="card-body pb-4">
                  <div className="d-flex flex-column gap-4 justify-content-start align-items-start">
                    <span>Total Casual Leave Today</span>
                    <h2><CountUp end={20} duration={5}/></h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card attend_card rounded-3 card-border">
                <div className="card-body pb-4">
                  <div className="d-flex flex-column gap-4 justify-content-start align-items-start">
                    <span>Today Optional Leave Today</span>
                    <h2><CountUp end={5} duration={5}/></h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card attend_card rounded-3 card-border">
                <div className="card-body pb-4">
                  <div className="d-flex flex-column gap-4 justify-content-start align-items-start">
                    <span>Total Earned Leave Today</span>
                    <h2><CountUp end={20} duration={5}/></h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AttendanceIndex;