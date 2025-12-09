import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import AllHeaders from "../partials/AllHeaders";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { GetDesignationList } from "../slices/DesignationDropDown/designationDropDown";
import { useDispatch } from "react-redux";
import { FetchProjectDivisionDropDown  , FetchProjectRegionDropDown , FetchProjectLocationDropDown , FetchProjectStateDropDown , FetchProjectListDropDown , FetchClosedProjectListDropDown} from "../slices/ProjectListDropDown/ProjectListDropdownSlice";



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


export default function AlumniTracker() {
    const [project, setProject] = useState("");
    const [EmployeeList, setEmployeeList] = useState([]);
    let navigation = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [profileStatus, setStatus] = useState(null);
    const [designation, setDesignation] = useState(null);
    const [option, setOptions] = useState([]);
    const [projectDivision, setProjectDivision] = useState(null);
    const [projectDivisionList, setDivisionOptions] = useState([]);
    const [projectRegion, setRegionOptions] = useState([]);
    const [projectLocation, setDistrict] = useState([]);
    const [projectState ,setStateOptions] = useState([]);
    const [projectListOption, setProjectOptions] = useState([]);
    const [loader , setLoader] = useState(false);
    const dispatch = useDispatch();

    const jobTypes = [
        { label: "On Role", value: "onRole" },
        { label: "On Consultant", value: "onContract" },
    ];
    const status = [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Closed", value: "Closed" },
    ];

    const JobTypeCahnges = (option) => {
        setSelectedOption(option); // Update state with selected option
    };



    const EmployeeData = async () => {

        try {
            setLoader(true)
            let payloads = { 
                "keyword": "",
                "page_no": "1",
                "per_page_record": "1000",
                "scope_fields":["employee_code","name","email","mobile_no","employee_type","gender","department","designation","branch","grade","joining_date","valid_till","ctc_pa","job_status","joining_date","valid_till"],
                 "type":"alumni",
                 "profile_status": "Closed"
                }
            let response = await axios.post(`${config.API_URL}getEmployeeList`, payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                setEmployeeList(response.data.data)
                setLoader(false);
            } else {
                setEmployeeList([])
                setLoader(false);
            }
        } catch (error) {
            setEmployeeList([])
            setLoader(false);
        }
    }

    useEffect(() => {
        EmployeeData()
    }, [])


    /******************* Get Designation List here  *****************/
    const projectDesignationLoadOption = async (input) => {
        const result = await dispatch(GetDesignationList(input)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }

    // open menu drop down list project list state list dropdown ->...
    const handleMenuOpenDesignationDropdown = async () => {
        const result = await dispatch(GetDesignationList('')).unwrap();
        setOptions(result);
    };

    // handle changes project state filter -> 
    const handleProjectDesignationChange = (option) => {
        setDesignation(option);
    }

    /********************** Get the Division List DropDown ***********/
    const divisionLoadOption = async (input) => {
        const result = await dispatch(FetchProjectDivisionDropDown(input)).unwrap();
        return result;
    }

    const divisionMenuOpen = async () => {
        const result = await dispatch(FetchProjectDivisionDropDown('')).unwrap();
        setOptions(result);
    }

    const handleDivisionChanges = (option) => {
        setDivisionOptions(option);
    }
    /********************** Get the Region  List DropDown ***********/
    const regionLoadOption = async (input) => {
        const result = await dispatch(FetchProjectRegionDropDown(input)).unwrap();
        return result;
    }
    const regionMenuOpen = async () => {
        const result = await dispatch(FetchProjectRegionDropDown('')).unwrap();
        setOptions(result);
    }
    const handleRegionChanges = (option) => {
        setRegionOptions(option);
    }

    /********************* Get the District List DropDown ******************/
    const districtLoadOption = async (input) => {
        const result = await dispatch(FetchProjectLocationDropDown(input)).unwrap();
        return result;
    }
    const districtMenuOpen = async () => {
        const result = await dispatch(FetchProjectLocationDropDown('')).unwrap();
        setOptions(result);
    }
    const handleDistrictChanges = (option) => {
        setDistrict(option)
    }

    /************************** Get State List DropDown ********************/
    const stateLoadOption = async (input) => {
        const result = await dispatch(FetchProjectStateDropDown(input)).unwrap();
        return result;
    }
    const stateMenuOpen = async () => {
        const result = await dispatch(FetchProjectStateDropDown('')).unwrap();
        setOptions(result);
    }
    const handleStateChanges = (option) => {
        setStateOptions(option);
    }
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

    /************** Apply filter here *********************/
    const handlefilter =async (e) => {
        e.preventDefault();
        try {
            let payloads = { 
                "keyword": "",
                "page_no": "1",
                "per_page_record": "1000", 
                "scope_fields":["employee_code","name","email","mobile_no","employee_type","gender","department","designation","branch","grade","joining_date","valid_till","ctc_pa","job_status","joining_date","valid_till"],
                "profile_status": "Closed",
                "region":projectRegion?.label,
                "project_id":projectListOption?.value,
                "employee_type":selectedOption?.value,
                "division":projectDivisionList?.label,
                "designation":designation?.label,
                "location_id":projectLocation?.value,
                "state_id":projectState?.value ,
                "type":"alumni"
            }
            setLoader(true);
            let response = await axios.post(`${config.API_URL}getEmployeeList`, payloads, apiHeaderToken(config.API_TOKEN))
            setLoader(false);
            if (response.status === 200) {
                setEmployeeList(response.data.data)
            } else {
                setEmployeeList([])
            }
        } catch (error) {
            setLoader(false)

            setEmployeeList([])
        }
    }

    const handleReset = async () => {
        setRegionOptions('');
        setProjectOptions('');
        setSelectedOption('');
        setStatus('');
        setDesignation('')
        setStateOptions('')
        setDistrict('')
        setDivisionOptions('')
        try {
            let payloads = { 
                "keyword": "",
                "page_no": "1",
                "per_page_record": "1000", 
                "scope_fields": [], 
                "profile_status": "Closed",
                "type":"alumni"
            }
            setLoader(true);
            let response = await axios.post(`${config.API_URL}getEmployeeList`, payloads, apiHeaderToken(config.API_TOKEN))
            setLoader(false);
            if (response.status === 200) {
                setEmployeeList(response.data.data)
            } else {
                setEmployeeList([])
            }
        } catch (error) {
            setLoader(false);
            setEmployeeList([])
        }
    }

    const handleStatusChange = (event) => {
        setStatus(event);
    };


    const rows =
        EmployeeList?.length !== 0
            ? EmployeeList?.map((value, index) => (
                {
                    id: index + 1,
                    employeeId: value?.employee_code,
                    employeeInfo: {
                        name: value?.name,
                        email: value?.email,
                        phone: value?.mobile_no,
                        type: value?.employee_type,
                        gender: value?.gender
                    },
                    department: value?.department,
                    designation: value?.designation,
                    projectName: value?.project_name,
                    projectLocation: value?.branch?.map((item) => item).join(','),
                    sanctionedPosition: 1,
                    value: value,
                    grade: value?.grade,
                    contractInfo: {
                        start: value?.joining_date,
                        end: value?.valid_till,
                    },
                    salaryStructure: value?.ctc_pa,
                    status: value?.job_status,
                    category: "Category A",
                    doj: value?.joining_date,
                    lwd: value?.valid_till,
                }
            ))
            : [];


    const columns = [
        {
            field: "employeeId",
            headerName: "Employee Id",
            width: 120,
            renderCell: (params) => (
                <p className="color-blue" style={{cursor:'pointer'}} onClick={(e) => {
                    e.preventDefault();
                    localStorage.setItem('onBoardingId', params.row?.value?._id)
                    navigation('/people-profile')
                }}>{params.row?.employeeId}</p>
            ),
        },
        {
            field: "employeeInfo",
            headerName: "Employee Detail",
            width: 160,
            renderCell: (params) => (
                <div className="projectinfo empinfo">
                    <p>{params.row?.employeeInfo?.name}</p>
                    <p>{params.row?.employeeInfo?.email}</p>
                    <p>{params.row?.employeeInfo?.phone}</p>
                    <p>{params.row?.employeeInfo?.type}</p>
                    <p>{params.row?.employeeInfo?.gender}</p>
                </div>
            ),
        },
        {
            field: "projectName",
            headerName: "Project Name",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo">
                    <p>{params.row?.projectName}</p>
                </div>
            ),
        },
        {
            field: "projectLocation",
            headerName: "Location",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo">
                    <p>{params.row?.projectLocation}</p>
                </div>
            ),
        },
        {
            field: "department",
            headerName: "Department",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo lineBreack">
                    <p>{params.row?.department}</p>
                </div>
            ),
        },

        {
            field: "designation",
            headerName: "Designation",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo lineBreack">
                    <p>{params.row?.designation}</p>
                </div>
            ),
        },

        {
            field: "grade",
            headerName: "Grade",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo">
                    <p>{params.row?.grade}</p>
                </div>
            ),
        },
        {
            field: "contractInfo",
            headerName: "Contract Timeline",
            width: 160,
            renderCell: (params) => (
                <div className="contra_dates lineBreack">
                    <p>{params.row?.contractInfo?.start}</p>
                    <p>{params.row?.contractInfo?.end}</p>
                </div>
            ),
        },
        {
            field: "salaryStructure",
            headerName: "Salary Structure",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo">
                    <p>{params.row?.salaryStructure}</p>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo">
                    <p>{params.row?.status}</p>
                </div>
            ),
        },
        {
            field: "category",
            headerName: "Category",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo">
                    <p>{params.row?.category}</p>
                </div>
            ),
        },
        {
            field: "doj",
            headerName: "DOJ",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo lineBreack">
                    <p>{params.row?.doj}</p>
                </div>
            ),
        },
        {
            field: "lwd",
            headerName: "Last Working day",
            width: 160,
            renderCell: (params) => (
                <div className="projectInfo lineBreack">
                    <p>{params.row?.lwd}</p>
                </div>
            ),
        },

    ];


    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <div className="d-flex justify-content-start align-items-start flex-row gap-4 my-3">
                        <div className="hrhdng">
                            <h2 className="">Employee Alumni Tracker</h2>
                        </div>
                    </div>
                    <div className="d-flex justify-content-start align-items-start gap-4 mb-4 mt-3 selectfiltrs_wrap">
                        <Box sx={{ width: 300 }}>
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
                        </Box>
                        <Box sx={{ width: 300 }}>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    defaultValue={option}
                                    loadOptions={stateLoadOption}
                                    value={projectState}
                                    onMenuOpen={stateMenuOpen}
                                    placeholder="State"
                                    onChange={handleStateChanges}
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ width: 300 }}>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    defaultValue={option}
                                    loadOptions={districtLoadOption}
                                    value={projectLocation}
                                    onMenuOpen={districtMenuOpen}
                                    placeholder="Distinct"
                                    onChange={handleDistrictChanges}
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 300 }}>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    defaultValue={option}
                                    loadOptions={regionLoadOption}
                                    value={projectRegion}
                                    onMenuOpen={regionMenuOpen}
                                    placeholder="Region"
                                    onChange={(option) => handleRegionChanges(option)}
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 300 }}>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    // cacheOptions
                                    defaultOptions
                                    defaultValue={option}
                                    loadOptions={divisionLoadOption}
                                    value={projectDivisionList}
                                    onMenuOpen={divisionMenuOpen}
                                    placeholder="division"
                                    onChange={handleDivisionChanges}
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 300 }}>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    placeholder="Designation"
                                    defaultOptions
                                    defaultValue={option}
                                    value={designation}
                                    loadOptions={projectDesignationLoadOption}
                                    onMenuOpen={handleMenuOpenDesignationDropdown}
                                    onChange={(option) => handleProjectDesignationChange(option)}
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 300 }}>
                            <FormControl fullWidth>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="color"
                                    options={jobTypes} // Provide static options
                                    value={selectedOption} // Controlled input
                                    onChange={JobTypeCahnges} // Handle selection
                                    placeholder="Job type"
                                    styles={customStyles} // Apply custom styles
                                    isSearchable // Makes the dropdown searchable
                                />
                            </FormControl>
                        </Box>
                        <div class="read-btn" onClick={handlefilter}>
                            <button class="px-5 btn">Search</button>
                        </div>
                        <div class="read-btn" onClick={handleReset}>
                            <button class="px-5 btn">Reset</button>
                        </div>
                    </div>

                    <div className="w-100 mainprojecttable alumnitable">
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            headerClassName="custom-header-class"
                            loading={loader}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                            }}
                            rowHeight={80}
                            pageSizeOptions={[10, 20]}
                            sx={{
                                minHeight:500
                            }}
                        />
                    </div>

                </div>
            </div>

        </>
    )
}