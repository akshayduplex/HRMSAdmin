
import React, { useState, useMemo, useEffect, useCallback } from "react";
import GoBackButton from "../../Goback";
import {
    Tabs, Tab, Box, Fade,
    IconButton, TextField, InputAdornment
} from "@mui/material";
import {
     CheckCircle, Pending, Search,
    Clear
} from "@mui/icons-material";
import ApprovalDataDataGrid from "./ApprovalList";
import config from "../../../config/Config";
import { apiHeaderToken } from "../../../config/ApiHeaders";
import axios from "axios";

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

    }, [input])

    return debouncedValue
}


const MprApprovalDashboard = () => {
    const [tabValue, setTabValue] = useState('Pending');
    const [searchTerm, setSearchTerm] = useState("");
    const [approvalRecords, setApprovalListRecords] = useState(null);
    const debouncingInput = useDeBouncing(searchTerm);
    const [isFetching, setIsFetching] = useState(false);


    const handleTabChange = (event, newValue) => {
        setApprovalListRecords(null)
        setTabValue(newValue);
    };

    const userDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem('employeeLogin')) || {};
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const FetchApprovalListRecords = useCallback(async () => {

        try {

            let payloads = {
                "employee_id": userDetails?._id,
                "job_id": "",
                "page_no": 1,
                "per_page_record": 100,
                "scope_fields": [],
                "status": tabValue,
                "project_id": "",
                "keyword": debouncingInput || "",
            }

            setIsFetching(true);
 

            let response = await axios.post(`${config.API_URL}getApprovalNoteFromList`, payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                setApprovalListRecords(response.data.data)
            } else {
                setApprovalListRecords(null)
            }
        } catch (error) {
            console.log(error)
            setApprovalListRecords(null)
        } finally {
            setIsFetching(false);
        }

    }, [userDetails, tabValue, debouncingInput])

    useEffect(() => {

        if (tabValue) {
            FetchApprovalListRecords()
        }

    }, [tabValue, userDetails, FetchApprovalListRecords])

    return (
        <div className="maincontent">
            <div className="container">
                <GoBackButton />
                <div className="mb-4">
                    <h3>Approval Note</h3>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by Approval Number, Project, Department..."
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

                {/* Tabs */}
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
                            value={"Pending"}
                        />
                        <Tab
                            label={
                                <div className="d-flex align-items-center">
                                    <CheckCircle fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                                    <span>Approved</span>
                                </div>
                            }
                            sx={{ fontWeight: 'bold' }}
                            value={"Approved"}
                        />
                    </Tabs>

                    {
                        tabValue === "Pending" && (
                            <TabPanel value={tabValue} index={tabValue}>
                                <ApprovalDataDataGrid ApprovalData={approvalRecords} status={tabValue} loading={isFetching} />
                            </TabPanel>

                        )
                    }

                    {
                        tabValue === "Approved" && (

                            <TabPanel value={tabValue} index={tabValue}>
                                <ApprovalDataDataGrid ApprovalData={approvalRecords} status={tabValue} loading={isFetching} />
                            </TabPanel>

                        )
                    }

                </div>
            </div>
        </div>
    );
}

export default MprApprovalDashboard;