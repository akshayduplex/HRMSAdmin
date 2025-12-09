import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import GoBackButton from "../../Goback";
import {
    Tabs, Tab, Box, Table, TableBody, TableCell,
    TableHead, TableRow, Fade, Tooltip,
    IconButton, TextField, InputAdornment, styled
} from "@mui/material";
import {
    Visibility, CheckCircle, Pending, Search,
    Clear, FilterList,
    Delete
} from "@mui/icons-material";
import axios from "axios";
import config from "../../../config/Config";
import { apiHeaderToken } from "../../../config/ApiHeaders";
import PendingApprovalsDataGrid from "./PendingTables";

// Custom styled component for scrollable container
const ScrollableTableContainer = styled('div')(({ theme }) => ({
    maxHeight: '500px',
    overflow: 'auto',
    position: 'relative',
    paddingRight: '4px',

    // Custom scrollbar styling
    '&::-webkit-scrollbar': {
        width: '10px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
        transform: 'scale(1.05)',
    },

    // Firefox scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: '#888 #f1f1f1',
}));

// Custom TabPanel component with animation
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Fade in={true} timeout={300}>
                    <Box sx={{ pt: 2 }}>{children}</Box>
                </Fade>
            )}
        </div>
    );
}

const useDeBouncing = (input) => {
    const [debouncedValue, setDebouncedValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {

            setDebouncedValue(input)
            
        }, 400);

        return () => clearTimeout(timer);

    } , [input])

    return debouncedValue
}

const EmpApprovalNotes = () => {
    const [tabValue, setTabValue] = useState("Pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [approvalRecords, setApprovalListRecords] = useState(null);
    const debouncingInput = useDeBouncing(searchTerm);

    const userDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem('employeeLogin')) || {};
    }, [])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const FetchApprovalListRecords = useCallback(async () => {

        try {

            let payloads = {
                "employee_doc_id": userDetails?._id,
                "job_id": "",
                "page_no": 1,
                "per_page_record": 100,
                "scope_fields": [],
                "status": tabValue,
                "project_id": "",
                "filter_keyword": debouncingInput || "",
                "department_id": "",
                "designation_id": ""
            }

            let response = await axios.post(`${config.API_URL}getRequisitionDataList`, payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                setApprovalListRecords(response.data.data)
            } else {
                setApprovalListRecords(null)
            }
        } catch (error) {
            console.log(error)
            setApprovalListRecords(null)
        }

    }, [userDetails, tabValue , debouncingInput])

    useEffect(() => {

        if (tabValue) {
            FetchApprovalListRecords()
        }

    }, [tabValue, userDetails, FetchApprovalListRecords])


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="maincontent">
            <div className="container">
                <GoBackButton />
                <div className="mb-4">
                    <h3>MPR Approval(s)</h3>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by Approval ID, Project, Department..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm("")}>
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                                }
                            }}
                        />
                    </div>
                </div>

                <div>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: 4,
                                borderRadius: '4px 4px 0 0'
                            }
                        }}
                    >
                        <Tab
                            label={
                                <div className="d-flex align-items-center">
                                    <Pending fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                                    <span>Pending</span>
                                </div>
                            }
                            sx={{ fontWeight: 'bold' }}
                            value={'Pending'}
                        />
                        <Tab
                            label={
                                <div className="d-flex align-items-center">
                                    <CheckCircle fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                                    <span>Approved</span>
                                </div>
                            }
                            sx={{ fontWeight: 'bold' }}
                            value={'Approved'}
                        />
                    </Tabs>
                    {
                        tabValue === 'Pending' &&
                        (

                            <TabPanel value={tabValue} index={tabValue}>
                                <PendingApprovalsDataGrid approvalRecords={approvalRecords} onDelete={() => { }} onApprove={() => { }} status={tabValue} />
                            </TabPanel>
                        )
                    }

                    {
                        tabValue === 'Approved' &&
                        <TabPanel value={tabValue} index={tabValue}>
                            <PendingApprovalsDataGrid approvalRecords={approvalRecords} onDelete={() => { }} onApprove={() => { }} status={tabValue} />
                        </TabPanel>
                    }
                </div>
            </div>
            {/* <style jsx global>{`
                html {
                scroll-behavior: smooth;
                }
                .scrollable-container {
                scroll-behavior: smooth;
                }
      `}</style> */}
        </div>
    );
}

export default EmpApprovalNotes;