import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import FormControl from "@mui/material/FormControl";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IoClose } from "react-icons/io5";
// import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { FetchProjectListDropDown, FetchDesignationListForJob, FetchProjectStateDropDown, FetchProjectLocationDropDown, FetchProjectDivisionDropDown, FetchProjectRegionDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { FetchDepartmentListDropDown } from "../slices/departmentSlice";
import AsyncSelect from 'react-select/async';
import AllHeaders from "../partials/AllHeaders";
import Select from 'react-select';
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import GoBackButton from "../goBack/GoBackButton";


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

export default function AssessmentList() {
    const [data , setData] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function fetchDataList() {
            await fetchData();
        }
        fetchDataList()
    } , [])

    let rows = data && data?.length > 0  ? data?.map((item, index) => {
        return {
            id: index + 1, // Incremental ID
            assessment_id:item?._id,
            department: item?.department ? item?.department : 'N/A' , // Static value
            assessmentType: item.content_type || 'Technical', // From the object or fallback
            noOfAttempts: item.no_of_attempts, // From the object
            duration: item.duration, // From the object
            minPassingMarks: item.min_passing, // From the object
            noOfDisplayQuestions: item.no_of_display_questions, // From the object
            status: item.status, // From the object
            addDate: item.add_date, // From the object
            updateDate: item.updated_on // From the object
        };
    }) : [];

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            let payload = {
                "_id": id,
            };
            let response = await axios.post(`${config.API_URL}deleteAssessmentById`, payload, apiHeaderToken(config.API_TOKEN));
            console.log(response);
            if (response.status === 200) {
                toast.success(response?.data?.message);
                await fetchData();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };
    
    const fetchData = async () => {
        try {
            setLoading(true);
            let payloads = {
                "keyword": '',
                "page_no": "1",
                "per_page_record": "100000",
            };
            let response = await axios.post(`${config.API_URL}getAssessmentList`, payloads, apiHeaderToken(config.API_TOKEN));
            console.log(response);
            if (response.status === 200) {
                setData(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
      
    const columns = [
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'assessmentType', headerName: 'Assessment Type', width: 180 },
        { field: 'noOfAttempts', headerName: 'No Of Attempts', type: 'number', width: 150 },
        { field: 'duration', headerName: 'Duration (mins)', type: 'number', width: 140 },
        { field: 'minPassingMarks', headerName: 'Minimum Passing Marks (%)', type: 'number', width: 210 },
        { field: 'noOfDisplayQuestions', headerName: 'No Of Display Questions', type: 'number', width: 200 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'addDate', headerName: 'Add Date', width: 180 },
        { field: 'updateDate', headerName: 'Update Date', width: 180 },
        {
          field: 'action',
          headerName: 'Action',
          width: 150,
          renderCell: (params) => (
            <Button className="primary" onClick={(e) =>  handleDelete(e , params?.row?.assessment_id)}>Delete</Button>
          ),
        },
    ];
      



    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                   <GoBackButton />
                    <div className="hrhdng">
                        <h2 className="">Assessment List</h2>
                    </div>
                    <div className={"w-100 mainprojecttable"}>
                        <Box sx={{ minHeight: 300 }}>
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
                                // loading={isLoading}  // Set loading based on actual loading state
                                components={{
                                    NoRowsOverlay: CustomNoRowsOverlay,
                                    LoadingOverlay: CustomSkeletonOverlay,
                                }}
                                disableColumnSelector
                                disableDensitySelector
                                disableColumnFilter={false} // Enable column filtering   
                                slots={{ toolbar: GridToolbar }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                    },
                                }}
                                sx={{
                                    minHeight: 400,
                                }}
                                loading={loading}
                            />
                        </Box>
                    </div>
                </div>
            </div>
         
        </>
    );
}
