import React, { useEffect, useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
import FormControl from "@mui/material/FormControl";
import Form from "react-bootstrap/Form";
import { IoSearchOutline } from "react-icons/io5";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { useDispatch } from "react-redux";
import { FetchProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { changeJobTypeLabel } from "../../utils/common";
import moment from "moment";


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

export default function Appraisal() {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [appraisalList, setAppraisalList] = useState([]);
  const dispatch = useDispatch();
  const [projectListOption, setProjectOptions] = useState([]);
  const [option, setOptions] = useState([]);
  const [search, setSearch] = useState('')
  const [loader, setLoader] = useState(false);


  /********************* Job Type *******************/

  const jobTypes = [
    { label: "On Role", value: "onRole" },
    { label: "On Consultance", value: "onContract" },
  ];

  const handleJobTypeChange = (option) => {
    setSelectedOption(option);
  };

  /********************* Project List Dropdown *******************/
  const projectLoadOption = async (input) => {
    const result = await dispatch(FetchProjectListDropDown(input)).unwrap();
    return result;
  }
  const projectMenuOpen = async () => {
    const result = await dispatch(FetchProjectListDropDown('')).unwrap();
    setOptions(result);
  }
  const handleProjectChanges = (option) => {
    setProjectOptions(option);
  }

  const handleGetAppraisal = async () => {
    setLoader(true)
    const payload = {
      keyword: "",
      page_no: "1",
      per_page_record: "1000",
      scope_fields: [],
      profile_status: "",
      type: "appraisalDue"
    };
    try {
      setLoader(true)
      const response = await axios.post(
        `${config.API_URL}getEmployeeAllList`,
        payload,
        apiHeaderToken(config.API_TOKEN)
      );
      setAppraisalList(response.data.data);
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
      field: "type",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (
        <div className="projectInfo">
          <p>{ changeJobTypeLabel( params.row?.type )}</p>
        </div>
      )
    },
    {
      field: "department",
      headerName: "Department",
      width: 250,
      renderCell: (params) => (
        <div className="projectInfo lineBreack">
          <p>{params.row?.department}</p>
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
      field: "date",
      headerName: "Join In Date",
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
          <Link to="#" className="color-blue">Send To Candidate</Link>
          <Link to="#" className="color-blue">Send To HOD</Link>
        </div>
      ),
    },
  ];

  const rows = appraisalList?.length !== 0
    ? appraisalList.map((appraisal, index) => ({
      id: index + 1,
      ID: appraisal?.employee_code,
      name: appraisal?.name,
      type: appraisal?.employee_type,
      department: appraisal?.department,
      date: appraisal?.joining_date,
      action: "Send To Candidate",
      project_name:appraisal?.project_name
    }))
    : [];

  const filteredRows = rows.filter((row) =>
    row?.name?.toLowerCase().includes(search.toLowerCase() || '') ||
    row?.ID?.toLowerCase().includes(search.toLowerCase() || '') ||
    row?.department?.toLowerCase().includes(search.toLowerCase() || '') ||
    row?.type?.toLowerCase().includes(search.toLowerCase() || '') ||
    row?.project_name?.toLowerCase().includes(search.toLowerCase() || '') 
  );

  /************** Apply filter here search*********************/

  const handleFilter = async (e) => {
    e.preventDefault();
    try {

      let payloads = {
        "keyword": "",
        "page_no": "1",
        "per_page_record": "1000",
        "scope_fields": [],
        "project_id": projectListOption?.value,
        "status": selectedOption?.value,
        "type": "appraisalDue"
      }
      setLoader(true)
      let response = await axios.post(`${config.API_URL}getEmployeeAllList`, payloads, apiHeaderToken(config.API_TOKEN))
      setLoader(false)
      if (response.status === 200) {
        setAppraisalList(response.data.data)
      } else {
        setAppraisalList([])
      }
    } catch (error) {
      setAppraisalList([])
      setLoader(false)
    }

  }

  /************** Apply filter here Reset*********************/
  const handleReset = async () => {
    setProjectOptions('');
    setSelectedOption('');
    try {
      let payloads = {
        "keyword": "",
        "page_no": "1",
        "per_page_record": "1000",
        "scope_fields": [],
        "profile_status": "",
        "type": "appraisalDue"
      }
      setLoader(true);
      let response = await axios.post(`${config.API_URL}getEmployeeAllList`, payloads, apiHeaderToken(config.API_TOKEN))
      setLoader(false);
      if (response.status === 200) {
        setAppraisalList(response.data.data)
      } else {
        setAppraisalList([])
      }
    } catch (error) {
      setLoader(false);
      setAppraisalList([])
    }
  }


  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex justify-content-start align-items-start flex-column ">
            <h2>Due For Appraisal</h2>
            <span>Employees appraisal due list</span>
            <div className="row mt-4 w-100">
              <div className="col-lg-4 mb-4">
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
                    styles={customStyles}
                  />
                </FormControl>
              </div>
              <div className="col-lg-4 mb-4">
                <FormControl fullWidth>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="jobType"
                    options={jobTypes}
                    value={selectedOption}
                    onChange={handleJobTypeChange}
                    placeholder="Select Job Type"
                    styles={customStyles}
                    isSearchable
                  />
                </FormControl>
              </div>
              <div className="col-lg-4 mb-4">
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
              </div>
              <div className="col-lg-2 mb-4">
                <div class="read-btn">
                  <button class="px-2 btn" onClick={handleFilter}>Search</button>
                </div>
              </div>
              <div className="col-lg-2 mb-4">
                <div class="read-btn">
                  <button class="px-2 btn" onClick={handleReset}>Reset</button>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-2 w-100 align-items-center">
              <Form.Check
                label="Bulk action"
                id="radio1"
                checked={isChecked}
                onChange={() => setIsChecked((prev) => !prev)}
              />
              <div className="d-flex flex-row gap-2">
                <button className="btn apprbtn" disabled={!isChecked}>
                  Send To Candidate
                </button>
                <button className="btn apprbtn" disabled={!isChecked}>
                  Send To HOD
                </button>
              </div>
            </div>


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
    </>
  );
}