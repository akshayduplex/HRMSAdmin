
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { TextField, FormControl } from "@mui/material";
import { CiCalendar } from "react-icons/ci";
import Form from "react-bootstrap/Form";
import SanctionedPositionModal from "./SanctionedPositionModal";
import ProjectLocationModal from "./ProjectLocationModal";
import AllHeaders from "../partials/AllHeaders";
import { FetchProjectStateDropDown , FetchProjectLocationDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { useDispatch, useSelector } from "react-redux";

import { FetchProjectList , FetchProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import moment from "moment";
import { DaysDiff } from "../../utils/common";
import AsyncSelect from "react-select/async";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff !important',
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
        color: state.isSelected ? '#fff' : '#000000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9e9e9e', // Make sure the color is visible
    }),

};

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


export default function ProjectTracker() {
    const [project, setProject] = useState([]);

    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [ProjectBudgets, setProjectBudgets] = useState([]);
    const [projectListDropDown , setProjectListDropDown] = useState([]);
    const [projectStateData , setProjectState] = useState([]);
    const [location , setLocation] = useState([]);
    const [searchText, setSearchText] = useState({
        project_name: "",
        project_id: "",
        state_id:'',
        location_id:""
    });
    const [endDate, setEndDate] = useState('');

    const handleShow = (e, data) => {
        e.preventDefault();
        setProjectBudgets(data);
        setShow(true);
    };

    const handleShow1 = (e, data) => {
        e.preventDefault();
        setProjectBudgets(data);
        setShow1(true);
    };

    const dispatch = useDispatch();

    const { projectsData } = useSelector((state) => state.projectListDropdown);

    useEffect(() => {
        dispatch(FetchProjectList());
    }, [dispatch]);

    const loadOptions = async (inputValue) => {
        const result = await dispatch(FetchProjectList({ text: inputValue })).unwrap()
        return result.map(option => ({
            value: option._id,
            label: option.title,
        }));
    };

    const handleChangesProject = (obj) => {
        setSearchText(prev => ({
            ...prev,
            ...obj
        }));
    };

    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchProjectStateDropDown(input)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }

    // open menu drop down list project list state list dropdown ->...
    const handleMenuOpenstateDropdown = async () => {
        const result = await dispatch(FetchProjectStateDropDown('')).unwrap();
        setProject(result);
    };

    // handle changes project state filter -> 
    const handleProjectStateChange = (option) => {
        setProjectState(option);
        handleChangesProject({"state_id":option?.value})
    }

    const projectLocationLoadOption = async (input) => {
        const result = await dispatch(FetchProjectLocationDropDown(input)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }

    // open menu drop down list project list state list dropdown ->...
    const handleMenuOpenLocationDropdown = async () => {
        const result = await dispatch(FetchProjectLocationDropDown('')).unwrap();
        setProject(result);
    };

    // handle changes project state filter -> 
    const handleProjectLocationChange = (option) => {
        setLocation(option);
        handleChangesProject({"location_id":option?.value})
    }


    // handle the open changes =>  
    const handleShowMenu = async () => {
       let result = dispatch(FetchProjectListDropDown('')).unwrap();
       setProject(result)
    }

    const handleFilterProjectLIst = (e) => {
        e.preventDefault();
        dispatch(FetchProjectList({ text: '', end_date: endDate, projectId: searchText.project_id , state_id:searchText.state_id , location_id:searchText.location_id }));
    }

    const rows =
        projectsData.status === "success" && projectsData.data.length !== 0
            ? projectsData.data.map((value, index) => ({
                id: index + 1,
                projectInfo: {
                    name: value?.title,
                    remainingDays:
                        value?.status === "Active"
                            ? DaysDiff(moment(), value?.end_date)
                            : 0,
                    sanctionedBudget: value?.project_budget?.sanctioned,
                    utilizedBudget: value?.project_budget?.utilized,
                    availableBudget: value?.project_budget?.available,
                    projectLocation: value?.location[0]?.name,
                },
                value: value,
                sanctionedPosition: value?.budget_estimate_list?.reduce(
                    (acc, item) => {
                        return acc + item?.no_of_positions;
                    },
                    0
                ),
                totalHired: value?.budget_estimate_list?.reduce(
                    (acc, item) => {
                        return acc + item?.hired;
                    },
                    0
                ),
                totalVacant: value?.budget_estimate_list?.reduce(
                    (acc, item) => {
                        return acc + item?.available_vacancy;
                    },
                    0
                ),
                "Project Start Date": moment(value?.start_date).format("DD/MM/YYYY"),
                "Project End Date": moment(value?.end_date).format("DD/MM/YYYY"),
            }))
            : [];

    // const rows = [
    //     {
    //         id: 1,
    //         projectInfo: {
    //             name: "Corporate",
    //             remainingDays: 552,
    //             sanctionedBudget: "40,00,000.00",
    //             utilizedBudget: "40,00,000.00",
    //             availableBudget: "40,00,000.00",
    //             projectLocation: "Noida,Arunachal Pradesh,Assam",
    //         },
    //         "sanctionedPosition": 40,
    //         "totalHired": 40,
    //         "totalVacant": 9,
    //         "Project Start Date": "12/08/2024",
    //         "Project End Date": "12/08/2024",
    //     },
    //     {
    //         id: 2,
    //         projectInfo: {
    //             name: "Corporate",
    //             remainingDays: 10,
    //             sanctionedBudget: "40,00,000.00",
    //             utilizedBudget: "40,00,000.00",
    //             availableBudget: "40,00,000.00",
    //             projectLocation: "Noida",
    //         },
    //         "sanctionedPosition": 40,
    //         "totalHired": 40,
    //         "totalVacant": 9,
    //         "Project Start Date": "12/08/2024",
    //         "Project End Date": "12/08/2024",
    //     },
    //     {
    //         id: 3,
    //         projectInfo: {
    //             name: "Corporate",
    //             remainingDays: 252,
    //             sanctionedBudget: "40,00,000.00",
    //             utilizedBudget: "40,00,000.00",
    //             availableBudget: "40,00,000.00",
    //             projectLocation: "Noida",
    //         },
    //         "sanctionedPosition": 40,
    //         "totalHired": 40,
    //         "totalVacant": 9,
    //         "Project Start Date": "12/08/2024",
    //         "Project End Date": "12/08/2024",
    //     },
    //     {
    //         id: 4,
    //         projectInfo: {
    //             name: "Corporate",
    //             remainingDays: 30,
    //             sanctionedBudget: "40,00,000.00",
    //             utilizedBudget: "40,00,000.00",
    //             availableBudget: "40,00,000.00",
    //             projectLocation: "Noida",
    //         },
    //         "sanctionedPosition": 40,
    //         "totalHired": 40,
    //         "totalVacant": 9,
    //         "Project Start Date": "12/08/2024",
    //         "Project End Date": "12/08/2024",
    //     },
    //     {
    //         id: 5,
    //         projectInfo: {
    //             name: "Corporate",
    //             remainingDays: 552,
    //             sanctionedBudget: "40,00,000.00",
    //             utilizedBudget: "40,00,000.00",
    //             availableBudget: "40,00,000.00",
    //             projectLocation: "Noida",
    //         },
    //         "sanctionedPosition": 40,
    //         "totalHired": 40,
    //         "totalVacant": 9,
    //         "Project Start Date": "12/08/2024",
    //         "Project End Date": "12/08/2024",
    //     },
    //     {
    //         id: 6,
    //         projectInfo: {
    //             name: "Corporate",
    //             remainingDays: 552,
    //             sanctionedBudget: "40,00,000.00",
    //             utilizedBudget: "40,00,000.00",
    //             availableBudget: "40,00,000.00",
    //             projectLocation: "Noida",
    //         },
    //         "sanctionedPosition": 40,
    //         "totalHired": 40,
    //         "totalVacant": 9,
    //         "Project Start Date": "12/08/2024",
    //         "Project End Date": "12/08/2024",
    //     },
    //     {
    //         id: 7,
    //         projectInfo: {
    //             name: "Corporate",
    //             remainingDays: 552,
    //             sanctionedBudget: "40,00,000.00",
    //             utilizedBudget: "40,00,000.00",
    //             availableBudget: "40,00,000.00",
    //             projectLocation: "Noida",
    //         },
    //         "sanctionedPosition": 40,
    //         "totalHired": 40,
    //         "totalVacant": 9,
    //         "Project Start Date": "12/08/2024",
    //         "Project End Date": "12/08/2024",
    //     },

    // ];

    const columns = [
        {
            field: "Project Name",
            headerName: "Project Name",
            width: 240,
            renderCell: (params) => (
                <div className="projectinfo lineBreack">
                    <p>{params.row?.projectInfo?.name}</p>
                    <span className="daystag bglgreen">
                        Remaining Days: {params.row?.projectInfo?.remainingDays}
                    </span>
                </div>
            ),
        },
        {
            field: "Sanctioned Position",
            headerName: "Sanctioned Position",
            width: 200,
            renderCell: (params) => (
                <div className="">
                    <p
                        className="color-blue"
                        onClick={(e) => handleShow(e, params.row?.value)}
                        style={{cursor:'pointer'}}
                    >
                        {params.row?.sanctionedPosition}
                    </p>
                </div>
            ),
        },
        {
            field: "Total Hired",
            headerName: "Total Hired",
            width: 130,
            renderCell: (params) => (
                <p className="color-blue">{params.row?.totalHired}</p>
            ),
        },
        {
            field: "Total Vacant",
            headerName: "Total Vacant",
            width: 150,
            renderCell: (params) => (
                <p className="color-blue">{params.row?.totalVacant}</p>
            ),
        },
        {
            field: "Project Location",
            headerName: "Project Location",
            width: 140,
            renderCell: (params) => (
                <p className="prjlocationss">
                    {params.row?.projectInfo?.projectLocation}{" "}
                    <span
                        className="color-blue"
                        onClick={(e) => handleShow1(e, params.row?.value)}
                    >
                        <span style={{cursor:'pointer'}}>View More</span>
                    </span>
                </p>
            ),
        },
        {
            field: "Sanctioned Budget",
            headerName: "Sanctioned Budget(In INR)",
            width: 120,
            renderCell: (params) => (
                <p className="">{params.row?.projectInfo?.sanctionedBudget}</p>
            ),
        },

        {
            field: "Utilized Budget",
            headerName: "Utilized Budget(In INR)",
            width: 120,
            renderCell: (params) => (
                <p className="">{params.row?.projectInfo?.utilizedBudget}</p>
            ),
        },
        {
            field: "Available Budget",
            headerName: "Available Budget(In INR)",
            width: 120,
            renderCell: (params) => (
                <p className="">{params.row?.projectInfo?.availableBudget}</p>
            ),
        },
        {
            field: "Project Start Date",
            headerName: "Project Start Date",
            type: "number",
            width: 120,
        },
        {
            field: "Project End Date",
            headerName: "Project End Date",
            type: "number",
            width: 120,
        },
    ];

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div
                    className="container hrdashboard"
                    data-aos="fade-in"
                    data-aos-duration="3000"
                >
                    <div className="d-flex justify-content-start align-items-start flex-row gap-4 my-3">
                        <div className="hrhdng">
                            <h2 className="">Project Tracker</h2>
                        </div>
                    </div>
                    <div className="d-flex justify-content-start align-items-start flex-row gap-4 mb-4 mt-3">
                        <Box sx={{ minWidth: 320 }}>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    // placeholder="Select Project"
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                    onMenuOpen={handleShowMenu}
                                    defaultValue={project}
                                    onChange={(option) => {
                                        const value = option ? option.value : null;
                                        setProjectListDropDown(option)
                                        handleChangesProject({ project_id: option.value, project_name: option.label })
                                    }}
                                    value={projectListDropDown}
                                    onInputChange={(inputValue) => {
                                        return inputValue;
                                    }}
                                    placeholder="Select Project"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 320 }}>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    // placeholder="Select Project"
                                    cacheOptions
                                    loadOptions={projectLoadOption}
                                    defaultOptions
                                    onMenuOpen={handleMenuOpenstateDropdown}
                                    defaultValue={project}
                                    onChange={ (option) =>  handleProjectStateChange(option)}
                                    value={projectStateData}
                                    onInputChange={(inputValue) => {
                                        return inputValue;
                                    }}
                                    placeholder="Select State"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 320 }}>
                            <FormControl fullWidth>
                                <AsyncSelect
                                    // placeholder="Select Project"
                                    cacheOptions
                                    loadOptions={projectLocationLoadOption}
                                    defaultOptions
                                    onMenuOpen={handleMenuOpenLocationDropdown}
                                    defaultValue={project}
                                    onChange={(option) =>handleProjectLocationChange(option)}
                                    value={location}
                                    onInputChange={(inputValue) => {
                                        return inputValue;
                                    }}
                                    placeholder="Select Distinct"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </FormControl>
                        </Box>
                    </div>
                    <div className="d-flex enddatebtn gap-4 mb-4 mt-2">
                        <div className="projct_date">
                            <Form.Group className="enddate_project" controlId="formGridEmail">
                                <Form.Label>Choose Project End Date</Form.Label>
                                <div className="position-relative">
                                    <Form.Control type="date" placeholder="dd/mm/yyyy" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                    <CiCalendar />
                                </div>
                            </Form.Group>
                        </div>
                        <div class="read-btn" onClick={handleFilterProjectLIst}>
                            <button class="px-5 btn">Search</button>
                        </div>
                        <div
                            class="read-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                setEndDate('');
                                setSearchText("");
                                setProjectState("");
                                setProjectListDropDown("");
                                setLocation("")
                                dispatch(FetchProjectList());
                            }}
                        >
                            <button class="px-5 btn">Reset</button>
                        </div>
                    </div>
                    <div className="w-100 mainprojecttable">
                        <Box sx={{ height: projectsData.status === 'loading' ? 600 : 'auto', width: '100%' }}>
                            <DataGrid
                                rows={rows}  // Make sure rows is populated
                                columns={columns}
                                headerClassName="custom-header-class"
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                rowHeight={100}
                                pageSizeOptions={[10, 20]}
                                loading={projectsData.status === 'loading'} 
                                components={{
                                    NoRowsOverlay: CustomNoRowsOverlay,
                                    // LoadingOverlay: CustomSkeletonOverlay,
                                }}
                                sx={{
                                    minHeight: 400,
                                }}
                            />
                        </Box>
                    </div>
                </div>
            </div>
            <SanctionedPositionModal
                ProjectBudgets={ProjectBudgets}
                show={show}
                onHide={() => setShow(false)}
            />
            <ProjectLocationModal
                ProjectLocation={ProjectBudgets}
                show={show1}
                onHide={() => setShow1(false)}
            />
        </>
    );
}
