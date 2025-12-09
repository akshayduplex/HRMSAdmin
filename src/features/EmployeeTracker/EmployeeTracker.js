import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import FormControl from "@mui/material/FormControl";
import { DataGrid } from "@mui/x-data-grid";
import { IoClose } from "react-icons/io5";
// import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { FetchProjectListDropDown, FetchDesignationListForJob, FetchProjectStateDropDown, FetchProjectLocationDropDown, FetchProjectDivisionDropDown, FetchProjectRegionDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { FetchDepartmentListDropDown } from "../slices/departmentSlice";
import AsyncSelect from 'react-select/async';
import AllHeaders from "../partials/AllHeaders";
import EmployeeChildTracker from "./EmployeeChildTracker";
import { GetDesignationList } from "../slices/DesignationDropDown/designationDropDown";
import Select from 'react-select';
import EmployeeTableModal from "./InPlacePositionPopus";


// Custom Skeleton Loader Component
const CustomNoRowsOverlay = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '16px',
            color: 'gray',
            bgcolor: 'background.default',
        }}
    >
        <Typography>No Data Available</Typography>
    </Box>
);

const CustomSkeletonOverlay = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            bgcolor: 'background.paper',
        }}
    >
        <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>
);

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

export default function EmploymentTracker() {
    const [jobId, setJobId] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const dispatch = useDispatch();
    const { projectDesignation } = useSelector((state) => state.projectListDropdown);
    const [options, setOptions] = useState([]);
    const [stateData, setProjectState] = useState([]);
    const [location, setLocation] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [InPlaceData , setInPlaceData] = useState(null);
    const [designation, setDesignation] = useState([]);
    const [filterState, setFilterState] = useState({
        project: '',
        project_id: '',
        designation: '',
        state_id: '',
        location_id: '',
        division: '',
        region: '',
        department_id: "",
        job_type: "",
        department_name: "",
        job_label:"",
    })

    const [InPlaceOpen  , SetInPlaceOpen] = useState(false);

    const handleFilterState = (obj) => {
        setFilterState(prevState => ({
            ...prevState,
            ...obj
        }));
    };


    const [isClassAdded, setIsClassAdded] = useState(false);
    const [isInnerClassAdded, setIsInnerClassAdded] = useState(false);

    const handleClick = (e, data) => {
        e.preventDefault();
        setJobId(data?._id);
        setProjectTitle(data)
        setIsClassAdded(!isClassAdded);
        setIsInnerClassAdded(!isInnerClassAdded);
    };
    const handleClickChange = () => {
        setJobId('');
        setIsClassAdded(false);
        setIsInnerClassAdded(false);
    };

    const handleOpenPlacedDetails = (e, data) => {
        e.preventDefault();
        SetInPlaceOpen(true);
        setInPlaceData(data)
    }


    const rows = projectDesignation.status === 'success' && projectDesignation.data.length !== 0
        ? projectDesignation.data.map((value, index) => ({
            id: index + 1,
            employementInfo: {
                position: value?.designation,
                status: value?.status,
            },
            jobId: value?._id,
            value: value,
            "Projects": value?.title,
            "No. of Pos.": value?.no_of_positions,
            "Sanctioned Date": value?.sanction_date,
            "Max CTC": value?.total_ctc,
            "Hired": value?.hired,
            "Available Pos.": parseInt(value?.no_of_positions) - parseInt(value?.hired),
            "Vacant Date": value?.vacant_date ? value?.vacant_date : 'N/A',
        })) : [];

    const columns = [
        {
            field: "Sanctioned Designation",
            headerName: "Sanctioned Designation",
            width: 250,
            renderCell: (params) => (
                <div className="positioninfo lineBreack overflow-hidden">
                    <p className="color-blue" onClick={(e) => handleClick(e, params?.row?.value)}>{params.row?.employementInfo?.position}</p>
                </div>
            ),
        },
        {
            field: "Projects",
            headerName: "Projects",
            type: "number",
            width: 200,
            renderCell: (params) => (
                <div className="positioninfo lineBreack overflow-hidden">
                    <p className="" style={{ textAlign: 'center' }}>{params.row?.Projects ? params.row?.Projects : "N/A"}</p>
                </div>
            ),
        },
        {
            field: "Department",
            headerName: "Department",
            type: "number",
            width: 130,
            renderCell: (params) => (
                <div className="positioninfo lineBreack overflow-hidden">
                    <p className="" style={{ textAlign: 'center' }}>{params.row?.value?.department ? params.row?.value?.department : "N/A"}</p>
                </div>
            ),
        },
        {
            field: "Sanctioned Position",
            headerName: "Sanctioned Position",
            type: "number",
            width: 200,
            renderCell: (params) => (
                <div className="">
                    <p className="" style={{ textAlign: 'center' }}>{params.row?.value?.no_of_positions}</p>
                </div>
            ),
        },
        {
            field: "Sanctioned Date",
            headerName: "Sanctioned Date",
            type: "number",
            width: 150,
        },
        {
            field: "in Place",
            headerName: "in Place",
            width: 100,
            renderCell: (params) => (
                <div className="positioninfo" onClick={(e) => handleOpenPlacedDetails(e, params?.row?.value )}>
                    <p className="color-blue">{params.row?.value?.hired}</p>
                </div>
            ),
        },
        {
            field: "Available Pos.",
            headerName: "Vacant",
            type: "number",
            width: 120,
        },
        {
            field: "Vacant Date",
            headerName: "Vacant Date",
            type: "number",
            width: 150,
        },
        {
            field: "Max CTC",
            headerName: "CTC",
            type: "number",
            width: 120,
        },
    ];

    const loadOptions = useCallback(async (inputValue) => {
        const result = await dispatch(FetchProjectListDropDown(inputValue)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }, [dispatch]);
    const handleMenuOpen = async () => {
        const result = await dispatch(FetchProjectListDropDown('')).unwrap();
        setOptions(result);
    };

    const handleChangesProjectDropDown = (data) => {
        setSelectedProject(data)
        handleFilterState({ "project_id": `${data?.value}` })
    }

    useEffect(() => {
        let payloads = {
            "keyword": "",
            "page_no": "1",
            "per_page_record": "1000",
            "scope_fields": [],
            "status": "Active",
            "project_id": "",
            "state_id": "",
            "location_id": "",
            "end_date": "",
            "designation": "",
            "department": "",
        }
        dispatch(FetchDesignationListForJob(payloads))
    }, [dispatch])

    /********************* project state dropdown filer ***************************/
    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchProjectStateDropDown(input)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }

    // open menu drop down list project list state list dropdown ->...
    const handleMenuOpenstateDropdown = async () => {
        const result = await dispatch(FetchProjectStateDropDown('')).unwrap();
        setOptions(result);
    };

    // handle changes project state filter -> 
    const handleProjectStateChange = (option) => {
        setProjectState(option);
        handleFilterState({ "state_id": option?.value })
    }
    /********************* project location dropdown filer ***************************/
    const projectLocationLoadOption = async (input) => {
        const result = await dispatch(FetchProjectLocationDropDown(input)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }

    // open menu drop down list project list state list dropdown ->...
    const handleMenuOpenLocationDropdown = async () => {
        const result = await dispatch(FetchProjectLocationDropDown('')).unwrap();
        setOptions(result);
    };

    // handle changes project state filter -> 
    const handleProjectLocationChange = (option) => {
        setLocation(option);
        handleFilterState({ "location_id": option?.value })
    }

    /********************* project Designation dropdown filer ***************************/
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
        handleFilterState({ "designation": option?.value })
    }


    /***************** Handle Division Dropdown *************/
    const divisionLoadOption = async (input) => {
        const result = await dispatch(FetchProjectDivisionDropDown(input)).unwrap();
        return result;
    }

    const divisionMenuOpen = async () => {
        const result = await dispatch(FetchProjectDivisionDropDown('')).unwrap();
        setOptions(result);
    }

    const handleDivisionChanges = (option) => {
        handleFilterState({ division: option.label })
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
        handleFilterState({ region: option.label })
    }
    /********************** Get Department Dropdown ***********/
    const departmentLoadOption = async (input) => {
        const result = await dispatch(FetchDepartmentListDropDown(input)).unwrap();
        return result;
    }
    const departmentMenuOpen = async () => {
        const result = await dispatch(FetchDepartmentListDropDown('')).unwrap();
        setOptions(result);
    }
    const handleDepartmentChanges = (option) => {
        handleFilterState({ department_id: option.value, department_name: option.label })
    }

    /** Job type  */
    const jobTypes = [
        { label: "onRole", value: "onRole" },
        { label: "onConsultant", value: "onContract" },
    ];

    const JobTypeCahnges = (option) => {
        handleFilterState({ job_type: option.value , job_label:option.label })
    }






    /******************** handle filer  **************************/
    const handleSearchfilter = (e) => {
        e.preventDefault()
        let payloads = {
            "keyword": "",
            "page_no": "1",
            "per_page_record": "100",
            "scope_fields": [],
            "status": "Active",
            "project_id": `${filterState.project_id}`,
            "state_id": `${filterState.state_id}`,
            "location_id": `${filterState.location_id}`,
            "end_date": "",
            "designation": `${filterState.designation}`,
            "division": `${filterState.division}`,
            "region": filterState.region,
            "department_id": filterState.department_id,
            "employee_type":filterState.job_type
        }
        dispatch(FetchDesignationListForJob(payloads))
    }



    // reset filter 
    const resetFilter = (e) => {
        e.preventDefault();
        handleFilterState({ "project_id": ``, state_id: '', 'location_id': '', designation: '', division: "", region: '', department_id: '', department_name: '' , job_type:'' , job_label:'' })
        setProjectState(null);
        setDesignation(null);
        setSelectedProject(null);
        setLocation(null);
        let payloads = {
            "keyword": "",
            "page_no": "1",
            "per_page_record": "100",
            "scope_fields": [],
            "status": "Active",
            "project_id": ``,
            "state_id": "",
            "location_id": "",
            "end_date": "",
            "designation": "",
        }
        dispatch(FetchDesignationListForJob(payloads))
    }
    /******************** handle filer end **************************/

    const isLoading = projectDesignation.status === 'loading';

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <div className="hrhdng">
                        <h2 className="">Employment Tracker</h2>
                    </div>
                    <div className="d-flex justify-content-start align-items-start flex-row gap-4 mt-4 mb-3">
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
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
                        }
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <FormControl fullWidth>
                                    <AsyncSelect
                                        // cacheOptions
                                        defaultOptions
                                        defaultValue={options}
                                        loadOptions={projectLoadOption}
                                        value={stateData}
                                        onMenuOpen={handleMenuOpenstateDropdown} // Fetch options when menu opens
                                        placeholder="Select State"
                                        onChange={(option) => handleProjectStateChange(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </FormControl>
                            </Box>
                        }
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <FormControl fullWidth>
                                    <AsyncSelect
                                        // cacheOptions
                                        defaultOptions
                                        defaultValue={options}
                                        loadOptions={projectLocationLoadOption}
                                        value={location}
                                        onMenuOpen={handleMenuOpenLocationDropdown} // Fetch options when menu opens
                                        placeholder="District"
                                        onChange={(option) => handleProjectLocationChange(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </FormControl>
                            </Box>
                        }
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <FormControl fullWidth>
                                    <AsyncSelect
                                        placeholder="Designation"
                                        defaultOptions
                                        defaultValue={options}
                                        value={designation}
                                        loadOptions={projectDesignationLoadOption}
                                        onMenuOpen={handleMenuOpenDesignationDropdown}
                                        onChange={(option) => handleProjectDesignationChange(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </FormControl>
                            </Box>
                        }
                    </div>
                    {/* second tabs filter data */}
                    <div className="d-flex justify-content-start align-items-start flex-row gap-4 mt-4 mb-3">
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <FormControl fullWidth>
                                    <AsyncSelect
                                        placeholder="Division"
                                        defaultOptions
                                        defaultValue={options}
                                        value={filterState.division ? { value: filterState.division, label: filterState.division } : null}
                                        loadOptions={divisionLoadOption}
                                        onMenuOpen={divisionMenuOpen}
                                        onChange={(option) => handleDivisionChanges(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </FormControl>
                            </Box>
                        }
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <FormControl fullWidth>
                                    <AsyncSelect
                                        placeholder="Region"
                                        defaultOptions
                                        defaultValue={options}
                                        value={filterState.region ? { value: filterState.region, label: filterState.region } : null}
                                        loadOptions={regionLoadOption}
                                        onMenuOpen={regionMenuOpen}
                                        onChange={(option) => handleRegionChanges(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </FormControl>
                            </Box>
                        }
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <FormControl fullWidth>
                                    <AsyncSelect
                                        placeholder="Department"
                                        defaultOptions
                                        defaultValue={options}
                                        value={filterState.department_id ? { value: filterState.department_id, label: filterState.department_name } : null}
                                        loadOptions={departmentLoadOption}
                                        onMenuOpen={departmentMenuOpen}
                                        onChange={(option) => handleDepartmentChanges(option)}
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </FormControl>
                            </Box>
                        }
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <FormControl fullWidth>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="color"
                                        options={jobTypes} // Provide static options
                                        value={ filterState.job_type ? { value: filterState.job_type , label:filterState.job_label } : null } // Controlled input
                                        onChange={JobTypeCahnges} // Handle selection
                                        placeholder="Job type"
                                        styles={customStyles} // Apply custom styles
                                        isSearchable // Makes the dropdown searchable
                                    />
                                </FormControl>
                            </Box>
                        }
                    </div>
                    <div className="d-flex justify-content-start align-items-start flex-row gap-4 mt-4 mb-3">
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <div class="read-btn" onClick={handleSearchfilter}>
                                    <button class="px-5 btn">Search</button>
                                </div>
                            </Box>
                        }
                        {
                            !isClassAdded &&
                            <Box sx={{ width: 270 }}>
                                <div class="read-btn" onClick={resetFilter}>
                                    <button class="px-5 btn">Reset</button>
                                </div>
                            </Box>
                        }
                    </div>
                    <div className={isClassAdded ? "w-100 mainprojecttable hideparent" : "w-100 mainprojecttable"}>
                        <Box sx={{ height: isLoading ? 600 : 'auto', width: '100%' }}>
                            <DataGrid
                                rows={rows}  // Make sure rows is populated
                                columns={columns}
                                headerClassName="custom-header-class"
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[10, 20]}
                                loading={isLoading}  // Set loading based on actual loading state
                                components={{
                                    NoRowsOverlay: CustomNoRowsOverlay,
                                    LoadingOverlay: CustomSkeletonOverlay,
                                }}
                                rowHeight={80}
                                sx={{
                                    minHeight: 400,
                                }}
                            />
                        </Box>
                    </div>
                    <div className={isInnerClassAdded ? "innerdatawrap showdata" : "innerdatawrap"}>
                        <div className="closeinner_data">
                            <button onClick={handleClickChange}><IoClose /></button>
                        </div>
                        <EmployeeChildTracker id={jobId} projectListTitle={projectTitle} />
                        <EmployeeTableModal show={InPlaceOpen} SetInPlaceOpen={SetInPlaceOpen} Data={InPlaceData}/>
                    </div>
                </div>
            </div>
         
        </>
    );
}
