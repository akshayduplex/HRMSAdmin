import React, { useState, useEffect, useCallback } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoMdSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { InfinitySpin } from 'react-loader-spinner'
import GoBackButton from "../goBack/GoBackButton";
import EmployeeTable from "./EmployeeTable";
import AllHeaders from "../partials/AllHeaders";
import { getEmployeeAllList, getEmployeeRecordsForFilter } from "../../employee/helper/Api_Helper";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import AsyncSelect from 'react-select/async';
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { apiHeaderToken } from "../../config/api_header";
import axios from "axios";
import config from "../../config/config";

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

const EmployeeList = () => {
  const [openLoader, setOpenLoader] = useState(false)
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const dispatch = useDispatch();
  const [option, setOption] = useState([]);
  const [projectList, setProjectOptions] = useState(null);
  const [searchParams] = useSearchParams();
  const [EmployeeCount, setEmployeeCount] = useState({})
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("first");
  const [employeeRecords, setEmployeeRecords] = useState([]);

  useEffect(() => {
    if (searchParams.get('project_id') && searchParams.get('project_name')) {
      setProjectOptions({ value: searchParams.get('project_id'), label: searchParams.get('project_name') })
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployeeAllList('', searchQuery, searchParams.get('type'), projectList, searchParams.get('project_id'));
        if (response.status) {
          const employees = response.data ?? {};
          setEmployeeCount(employees)
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchData();
  }, [searchQuery, projectList, searchParams]);

  useEffect(() => {
    localStorage.removeItem("clfFormData");
    localStorage.removeItem("onBoardingId");
    localStorage.removeItem("PfInfoFormData");
    localStorage.removeItem("residenceFormData");
    localStorage.removeItem("employeeFormData");
    localStorage.removeItem("onBoardingId");
    localStorage.removeItem("permanentFormData");
    localStorage.removeItem("residenceFormData");
    localStorage.removeItem("onBoardingbudget_estimate_list");
    localStorage.removeItem("onBoardingLocation");
    localStorage.removeItem("onBoardingId");
  })

  // handle Pagination mode changes 
  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const ALL_OPTION = {
    value: null,
    label: "All",
    budget_estimate_list: null,
    location: null,
  };

  const addAllOptionIfMissing = (options) => {
    if (Array.isArray(options) && options?.length > 0) {
      return [ALL_OPTION, ...options];
    }
    return options;
  };

  /********************** Project List Dropdown ********************/
  const projectLoadOption = async (input) => {
    const result = await dispatch(FetchProjectListDropDown(input)).unwrap();
    return addAllOptionIfMissing(result);
  }
  const projectMenuOpen = async () => {
    const result = await dispatch(FetchProjectListDropDown('')).unwrap();
    setOption(addAllOptionIfMissing(result));
  }
  const handleProjectChanges = (option) => {
    setProjectOptions(option);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleNewOnBoard = () => {
    localStorage.removeItem('onBoardingbudget_estimate_list')
    localStorage.removeItem('onBoardingLocation')
    localStorage.removeItem('clfFormData')
    localStorage.removeItem('employeeFormData')
    localStorage.removeItem('PfInfoFormData')
    navigate('/onboarding')
  }

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return isNaN(date) ? '' :
      `${String(date.getDate()).padStart(2, '0')}/` +
      `${String(date.getMonth() + 1).padStart(2, '0')}/` +
      date.getFullYear();
  };
  /**
   * 
   * @param {*} data 
   * @returns 
   */
  const flattenEmployeeData = (data) => {
    return data.map((employee, index) => ({
      srn: index + 1,
      employee_code: employee.employee_code || '',
      name: employee.name || '',
      email: employee.email || '',
      mobile_no: employee.mobile_no || '',
      alt_mobile_no: employee.alt_mobile_no || '',
      date_of_birth: formatDate(employee.date_of_birth),
      project_name: employee.project_name || '',
      designation: employee.designation || '',
      department: employee.department || '',
      employee_type: employee.employee_type || '',
      batch_id: employee.batch_id || '',
      father_name: employee.father_name || '',
      gender: employee.gender || '',
      marital_status: employee.marital_status || '',
      joining_date: formatDate(employee.joining_date),
      branch: Array.isArray(employee.branch) ? employee.branch.join(', ') : '',
      occupation: employee.occupation || '',
      division: employee.division || '',
      region: employee.region || '',
      grade: employee.grade || '',
      esi_number: employee.esi_number || '',
      pf_number: employee.pf_number || '',
      esi_dispensary: employee.esi_dispensary || '',
      uan_number: employee.uan_number || '',
      bank_name: employee.bank_name || '',
      pan_number: employee.pan_number || '',
      bank_branch: employee.bank_branch || '',
      ifsc_code: employee.ifsc_code || '',
      bank_account_type: employee.bank_account_type || '',
      total_experience: employee.total_experience || ''
    }));
  };
  /**
   * 
   * @returns {Array} - Array of objects with employee data
   */
  const handleGenerateEmployeeExcelData = async () => {
    let data = await getEmployeeRecordsForFilter('', searchQuery, searchParams.get('type'), projectList, searchParams.get('project_id'))
    if (!data?.data?.length) {
      console.error('No employee data found');
      return;
    }

    try {
      // Flatten the data structure
      const flatData = flattenEmployeeData(data?.data);

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(flatData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `employee_data_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };

  const handleFetchEmployeeRecords = useCallback(async () => {
    try {

      setOpenLoader(true);

      const response = await axios.post(
        `${config.API_URL}getEmployeeAllList`,
        {
          keyword: searchQuery,
          page_no: paginationModel.page + 1,
          per_page_record: paginationModel.pageSize,
          scope_fields: ["employee_code", "name", "email", 'mobile_no', 'alt_mobile_no', 'joining_date', 'project_name', 'branch', 'designation', 'department', 'employee_type', 'batch_id', 'profile_status', 'add_date'],
          status: activeTab === 'first' ? "" : activeTab,
          type: searchParams.get('type') || "",
          project_id: projectList?.value ? projectList?.value || "" : searchParams.get('project_id') || "",
          project_name: projectList?.label || "",
        },
        apiHeaderToken(config.API_TOKEN)
      );

      if (response.status === 200) {
        console.log(response.data)
        setEmployeeRecords(response.data?.data)
      } else {
        setEmployeeRecords([])
      }

    } catch (error) {
      console.error('Error fetching location list', error);
      setEmployeeRecords([])
    } finally {
      setOpenLoader(false);
    }
  }, [searchQuery, paginationModel.page, paginationModel.pageSize, activeTab, searchParams, projectList?.value, projectList?.label])

  useEffect(() => {

    if (activeTab) {
      handleFetchEmployeeRecords()
    }

  }, [activeTab, handleFetchEmployeeRecords])

  useEffect(() => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, [activeTab]);

  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container" >
          <GoBackButton />
          <div className="hrhdng">

            <div className="d-flex justify-content-between">

              <div>
                <h2>People</h2>
                <p>Add Employee and Contractors</p>
              </div>

              <div>
                <Link to='/import-employee' className="create-job btn" style={{
                  // width: '140px',
                  // height: '44px',
                  // fontSize: '12px',
                  // fontWeight: '500',
                  // textAlign:'center'
                }}> <span style={{
                  height: '44px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  Import Employee
                  </span> </Link>
              </div>
            </div>

            <div className="d-flex justify-content-between my-3">
              <Box sx={{ width: 300 }}>
                <FormControl fullWidth>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    defaultValue={option}
                    loadOptions={projectLoadOption}
                    value={projectList}
                    onMenuOpen={projectMenuOpen}
                    placeholder="Select Project"
                    onChange={handleProjectChanges}
                    classNamePrefix="react-select"
                    styles={customStyles}
                  />
                </FormControl>
              </Box>
              <InputGroup className="input-width" style={{
                height: "40px"
              }}>
                <InputGroup.Text
                  id="basic-addon1"
                  className="bg-gray-light pe-0 "
                >
                  <IoMdSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search name, email or employee ID"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  className="bg-gray-light bor-left ps-1 height-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>


              <button onClick={handleNewOnBoard} className="btn onboard d-flex flex-row gap-1 align-items-center rounded-1 px-2" style={{
                // width:'140px',
                height: '44px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                <span>Onboard New</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <rect width="16" height="16" fill="#BFE7FA" />
                  <path
                    d="M8 1C6.61553 1 5.26216 1.41054 4.11101 2.17971C2.95987 2.94888 2.06266 4.04213 1.53285 5.32122C1.00303 6.6003 0.86441 8.00776 1.13451 9.36563C1.4046 10.7235 2.07129 11.9708 3.05026 12.9497C4.02922 13.9287 5.2765 14.5954 6.63437 14.8655C7.99224 15.1356 9.3997 14.997 10.6788 14.4672C11.9579 13.9373 13.0511 13.0401 13.8203 11.889C14.5895 10.7378 15 9.38447 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1ZM8 4C8.14834 4 8.29334 4.04399 8.41668 4.1264C8.54002 4.20881 8.63615 4.32594 8.69291 4.46299C8.74968 4.60003 8.76453 4.75083 8.73559 4.89632C8.70665 5.0418 8.63522 5.17544 8.53033 5.28033C8.42544 5.38522 8.29181 5.45665 8.14632 5.48559C8.00083 5.51453 7.85004 5.49968 7.71299 5.44291C7.57595 5.38614 7.45881 5.29001 7.3764 5.16668C7.29399 5.04334 7.25 4.89834 7.25 4.75C7.25 4.55109 7.32902 4.36032 7.46967 4.21967C7.61033 4.07902 7.80109 4 8 4ZM10 12.0625H6V10.9375H7.4375V8.0625H6.5V6.9375H8.5625V10.9375H10V12.0625Z"
                    fill="#155674"
                  />
                </svg>
              </button>

              <button onClick={handleGenerateEmployeeExcelData} className="btn onboard d-flex flex-row gap-1 align-items-center rounded-1 px-2" style={{
                // width:'160px',
                height: '44px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                <span>Export Employees</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#BFE7FA">
                  <path d="M19 12v7h-14v-7h-2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-7-8.5l5.5 5.5h-4.5v6h-2v-6h-4.5l5.5-5.5z" fill="currentColor" />
                  <title>Export Employees</title>
                </svg>
              </button>

            </div>
            <Tab.Container
              id="left-tabs-example "
              className=" "
              defaultActiveKey={activeTab}
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key)}
            >
              <Nav
                variant="pills"
                className="flex-row postedjobs widthcomp widthfuller w-100 border-full"
              >
                <Nav.Item>
                  <Nav.Link eventKey="first">Active Employee(s) ({EmployeeCount?.active_profiles || 0})</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="onRole">On-Role ({EmployeeCount?.on_role || 0})</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="onContract">On-Consultant ({EmployeeCount?.on_contract || 0})</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="empaneled">Empaneled ({EmployeeCount?.empaneled || 0})</Nav.Link>
                </Nav.Item>
                {/* ['onRole','onContract','emPanelled','Closed','Inactive'] */}
                <Nav.Item>
                  <Nav.Link eventKey="Closed">Dismissed ({EmployeeCount?.inactive_profiles || 0})</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Inactive">Pending ({EmployeeCount?.kyc_pending || 0})</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="w-100">
                {(
                  <>
                    {
                      activeTab === 'first' &&
                      <Tab.Pane eventKey="first">
                        <EmployeeTable formData={'Active'} searchQuery={employeeRecords} paginationModel={paginationModel} handlePaginationModelChange={handlePaginationModelChange} totalCount={EmployeeCount?.active_profiles} openLoader={openLoader} />
                      </Tab.Pane>
                    }

                    {
                      activeTab === 'onRole' &&
                      <Tab.Pane eventKey="onRole">
                        <EmployeeTable formData={'On-role'} searchQuery={employeeRecords} paginationModel={paginationModel} handlePaginationModelChange={handlePaginationModelChange} totalCount={EmployeeCount?.on_role} openLoader={openLoader} />
                      </Tab.Pane>
                    }

                    {
                      activeTab === 'onContract' &&
                      <Tab.Pane eventKey="onContract">
                        <EmployeeTable formData={'On-Contract'} searchQuery={employeeRecords} paginationModel={paginationModel} handlePaginationModelChange={handlePaginationModelChange} totalCount={EmployeeCount?.on_contract} openLoader={openLoader} />
                      </Tab.Pane>
                    }

                    {
                      activeTab === 'empaneled' &&
                      <Tab.Pane eventKey="empaneled">
                        <EmployeeTable formData={'empaneled'} searchQuery={employeeRecords} paginationModel={paginationModel} handlePaginationModelChange={handlePaginationModelChange} totalCount={EmployeeCount?.on_contract} openLoader={openLoader} />
                      </Tab.Pane>
                    }

                    {
                      activeTab === 'Closed' &&
                      <Tab.Pane eventKey="Closed">
                        <EmployeeTable formData={'Dismissed'} searchQuery={employeeRecords} paginationModel={paginationModel} handlePaginationModelChange={handlePaginationModelChange} totalCount={EmployeeCount?.inactive_profiles} openLoader={openLoader} />
                      </Tab.Pane>
                    }

                    {
                      activeTab === 'Inactive' &&
                      <Tab.Pane eventKey="Inactive">
                        <EmployeeTable formData={'Pending'} searchQuery={employeeRecords} paginationModel={paginationModel} handlePaginationModelChange={handlePaginationModelChange} totalCount={EmployeeCount?.kyc_pending} openLoader={openLoader} />
                      </Tab.Pane>
                    }

                  </>
                )}
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeList;
