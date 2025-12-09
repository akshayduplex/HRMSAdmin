import React, { useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
//import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
///import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { IoSearchOutline } from "react-icons/io5";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import AllHeaders from "../partials/AllHeaders";

const columns = [
  { field: "ID", headerName: "Employee ID", flex: 1 },
  { field: "Name", headerName: "Employee Name", flex: 1 },
  { field: "Type", headerName: "Type", flex: 1 },
  { field: "Department", headerName: "Department", type: "number", flex: 1 },
  { field: "Date", headerName: "Join In Date", flex: 1 },
  {
    field: "Action",
    headerName: "Action",
    flex: 2,
    renderCell: (params) => (
      <div className="d-flex gap-4 tbllinks">
        <Link to="#" className="color-blue">Send To Candidate</Link>
        <Link to="#" className="color-blue">Send To HOD</Link>
      </div>
    ),
  },
];

const rows = [
  {
    id: 1,
    ID: "EID10110110",
    Name: "Jai Prakash",
    Type: "On-role",
    Department: "Engineering",
    Date: "12/02/2023",
    Action: "Send To Candidate",
  },
  {
    id: 2,
    ID: "EID10110110",
    Name: "Jai Prakash",
    Type: "On-role",
    Department: "Engineering",
    Date: "12/02/2023",
    Action: "Send To Candidate",
  },
  {
    id: 3,
    ID: "EID10110110",
    Name: "Jai Prakash",
    Type: "On-role",
    Department: "Engineering",
    Date: "12/02/2023",
    Action: "Send To Candidate",
  },
  {
    id: 4,
    ID: "EID10110110",
    Name: "Jai Prakash",
    Type: "On-role",
    Department: "Engineering",
    Date: "12/02/2023",
    Action: "Send To Candidate",
  },

];

export default function Appraisal() {
  const [isChecked, setIsChecked] = useState(false);
  const [age, setAge] = React.useState("");
  const [employee, setEmployee] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleChangeEmployee = (event) => {
    setEmployee(event.target.value);
  };
  
  return (
    <>
    <AllHeaders/>
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex justify-content-start align-items-start flex-column ">
            <h2 >Due For Appraisal</h2>
            <span>Employees appraisal due list</span>

            <div className="row mt-4 w-100">
              <div className="col-lg-3">
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
              </div>
              <div className="col-lg-3">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Employee Type On-role
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={employee}
                    label="Employee Type On-role"
                    onChange={handleChangeEmployee}
                  >
                    <MenuItem value={10}>Employee 1</MenuItem>
                    <MenuItem value={20}>Employee 2</MenuItem>
                    <MenuItem value={30}>Employee 3</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-lg-3">
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
            </div>
            <div className="d-flex justify-content-between mt-4 w-100 align-items-center">
              <Form.Check
                label="Bulk action"
                id="radio1"
                checked={isChecked}
                onChange={() => setIsChecked((prev) => !prev)}
              />
              <div className="d-flex flex-row gap-2">
                {isChecked === false ? (
                  <>
                    <button class="btn apprbtn" disabled>
                      Send To Candidate
                    </button>

                    <button class="btn apprbtn" disabled>
                      Send To HOD
                    </button>
                  </>
                ) : (
                  <>
                    <button class="btn apprbtn">
                      Send To Candidate
                    </button>
                    <button class="btn apprbtn">
                      Send To HOD
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 w-100">
              <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100 smalldata infobox remfooter">
                <DataGrid
                  rows={rows}
                  className="w-100"
                  columns={columns}
                  pagination
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  checkboxSelection
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
