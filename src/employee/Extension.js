import React, { useState } from "react";
import GoBackButton from "./Goback";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "react-bootstrap/Table";

export default function Extension() {
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
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex justify-content-start align-items-start flex-column">
            <div class="hrhdng">
              <h2 >Employee Extension</h2>
              <p>Employee Extension Request lists</p>
            </div>
            <div className="d-flex justify-content-start align-items-start flex-row gap-4 mt-4">
              <Box sx={{ minWidth: 320 }}>
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
              <Box sx={{ minWidth: 320 }}>
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
              </Box>
            </div>
            <div className="sitecard rounded-0 pr-0 h-100 pt-0 ps-0 w-100 mt-4">
              <div className="d-flex flex-column gap-2 scroller-content w-100 smalldata infobox">
                <Table className="candd_table" hover>
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      <th>Designation</th>
                      <th>HOD</th>
                      <th>Service Expiry Date</th>
                      <th>Extension Request Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                    <tr>
                      <td>EID10110110</td>
                      <td>Anuja Shukla</td>
                      <td>Assistant Manager</td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">Amit Kheda</p>
                          <p className="m-0"> Team Lead</p>
                          <p className="m-0"> EID0001010</p>
                        </div>
                      </td>

                      <td>28/05/2024</td>
                      <td>28/11/2024</td>
                      <td>
                        <button className="extntbtn color-blue">Send for Approval</button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
