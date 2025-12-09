import React, { useCallback, useEffect, useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import AsyncSelect from 'react-select/async';
import { FetchProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import moment from "moment";
import { changeJobTypeLabel } from "../../utils/common";
import axios from "axios";
import { apiHeaderToken } from "../../config/api_header";
import config from "../../config/config";


/**
 * Add the Custome Styling Data
 * @returns 
 */
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
    '&:hover': {
      borderColor: '#D2C9FF',
    },
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


const EmployeeExtension = () => {
  const [employee, setEmployee] = useState("");
  const [options, setOptions] = useState("");
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);
  const [extensionEmployee, setExtensionEmp] = useState(null);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState(null)

  const handleChangeEmployee = (event) => {
    setEmployee(event.target.value);
  };

  /************ Project Changes Options ***************/
  const loadOptions = useCallback(async (inputValue) => {
    const result = await dispatch(FetchProjectListDropDown(inputValue)).unwrap();
    return result.slice(0, 10); // Limit to 10 records
  }, [dispatch]);
  /************ Project Changes Options **************/
  const handleMenuOpen = async () => {
    const result = await dispatch(FetchProjectListDropDown('')).unwrap();
    setOptions(result);
  };

  const handleChangesProjectDropDown = (data) => {
    setSelectedProject(data)
  }
  // Here Make the All Employee Changes
  const handleGetAppraisal = async () => {
    setLoader(true)
    const payload = {
      keyword: "",
      page_no: "1",
      per_page_record: "1000",
      scope_fields: [],
      profile_status: "",
      type: "extensionPending"
    };
    try {
      setLoader(true)
      const response = await axios.post(
        `${config.API_URL}getEmployeeAllList`,
        payload,
        apiHeaderToken(config.API_TOKEN)
      );
      setExtensionEmp(response.data.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching appraisal list:", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    handleGetAppraisal();
  }, []);

  const columns = [
    {
      field: "ID",
      headerName: "Employee ID",
      width: 150,
    },
    {
      field: "name",
      headerName: "Employee Name",
      width: 200,
      renderCell: (params) => (
        <div className="projectInfo">
          <p>{params.row?.name}</p>
        </div>
      )
    },
    {
      field: "project_name",
      headerName: "Project Name",
      width: 250,
      renderCell: (params) => (
        <div className="projectInfo lineBreack">
          <p>{params.row?.project_name}</p>
        </div>
      )
    },
    {
      field: "Designation",
      headerName: "Designation",
      width: 250,
      renderCell: (params) => (
        <div className="projectInfo lineBreack">
          <p>{params.row?.project_name}</p>
        </div>
      )
    },
    {
      field: "HOD",
      headerName: "HOD",
      width: 250,
      renderCell: (params) => (
        <div className="projectInfo lineBreack">
          <p>{params.row?.HOD ? params.row?.HOD :'N/A'}</p>
        </div>
      )
    },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (
        <div className="projectInfo">
          <p>{changeJobTypeLabel(params.row?.type)}</p>
        </div>
      )
    },
    {
      field: "date",
      headerName: "Service Expiry Date",
      width: 160,
      renderCell: (params) => (
        <div className="projectInfo lineBreack">
          <p className="mt-3">{moment(params.row?.date).format('DD/MM/YYY')}</p>
        </div>
      )
    },

    {
      field: "Action",
      headerName: "Action",
      width: 220,
      renderCell: () => (
        <div className="d-flex gap-4 tbllinks">
          <Link to="#" className="color-blue">Send For Approval</Link>
        </div>
      ),
    },
  ];

  const rows = extensionEmployee?.length !== 0
    ? extensionEmployee?.map((appraisal, index) => ({
      id: index + 1,
      ID: appraisal?.employee_code,
      name: appraisal?.name,
      type: appraisal?.employee_type,
      department: appraisal?.department,
      date: appraisal?.valid_till,
      action: "Send For Approval",
      project_name: appraisal?.project_name,
      Designation:appraisal?.designation,
      HOD:appraisal.reporting_manager ? appraisal?.reporting_manager?.map((item) => item?.manager_name).join(' | ') : 'N/A'
    }))
    : [];

  const filteredRows = rows && rows?.filter((row) =>
    row?.name?.toLowerCase().includes(search?.toLowerCase() || '') ||
    row?.ID?.toLowerCase().includes(search?.toLowerCase() || '') ||
    row?.department?.toLowerCase().includes(search?.toLowerCase() || '') ||
    row?.type?.toLowerCase().includes(search?.toLowerCase() || '') ||
    row?.project_name?.toLowerCase().includes(search?.toLowerCase() || '') ||
    row?.Designation?.toLowerCase().includes(search?.toLowerCase() || '') 
  );

  const handleFilter = () => {
      const filteredData = extensionEmployee && extensionEmployee.filter((row) =>
      row.project_name.toLowerCase().includes(selectedProject?.label.toLowerCase() || '' ) ||
      row.employee_type.toLowerCase().includes(employee.toLowerCase() || '' ) 
    );
    setExtensionEmp(filteredData)
  }

  const handleReset = () => {
     handleGetAppraisal();
     setSelectedProject(null)
     setSearch('')
     setEmployee('')
  }

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
            <div className="d-flex justify-content-start align-items-start flex-row gap-4 mt-4 w-100">
              <Box sx={{ minWidth: '30%' }}>
                <FormControl fullWidth>
                  <AsyncSelect
                    // cacheOptions
                    defaultOptions
                    defaultValue={options}
                    loadOptions={loadOptions}
                    value={selectedProject}
                    onMenuOpen={handleMenuOpen}
                    placeholder="Select Project"
                    onChange={(option) => handleChangesProjectDropDown(option)}
                    classNamePrefix="react-select"
                    styles={customStyles}
                  />
                </FormControl>
              </Box>
              <Box sx={{ minWidth: '30%' }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Employee Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={employee}
                    label="Employee Type On-role"
                    onChange={handleChangeEmployee}
                  >
                    <MenuItem value={"OnRole"}>On Role</MenuItem>
                    <MenuItem value={"On Contract"}>On Consultant</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: '30%' }}>
                <FormControl fullWidth>
                  <FormControl fullWidth>
                    <div className="position-relative srchemployee">
                      <Form.Control
                        type="text"
                        className="w-100 ps-4 ms-2 form-control fs-6"
                        placeholder="Search Employee"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <div className="srchicon">
                        <IoSearchOutline size={"16px"} />
                      </div>
                    </div>
                  </FormControl>
                </FormControl>
              </Box>
            </div>
            <div className="d-flex justify-content-start align-items-start flex-row gap-4 mt-4">
              <div className="col-lg-12 mb-4">
                <div class="read-btn">
                  <button class="px-2 btn" onClick={handleFilter} >Search</button>
                </div>
              </div>
              <div className="col-lg-12 mb-4">
                <div class="read-btn">
                  <button class="px-2 btn"  onClick={handleReset}>Reset</button>
                </div>
              </div>
            </div>
            <div className="sitecard rounded-0 pr-0 h-100 pt-0 ps-0 w-100 mt-4">
              {/* <Table className="candd_table" hover>
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
                </Table> */}

              <div className="d-flex gap-2 mt-4 w-100 ">
                <DataGrid
                  rows={filteredRows}
                  className="w-100"
                  loading={loader}
                  columns={columns}
                  headerClassName="custom-header-class"
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[10, 20]}
                  sx={{
                    minHeight: 500
                  }}
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

export default EmployeeExtension;