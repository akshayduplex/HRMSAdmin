
// import React, { useState, useMemo, useEffect, useCallback } from "react";
// import {
//     Tabs, Tab, Box, Fade,
//     IconButton, TextField, InputAdornment
// } from "@mui/material";
// import {
//      CheckCircle, Pending, Search,
//     Clear,
//     Today,
//     Upcoming
// } from "@mui/icons-material";
// import axios from "axios";
// import JoiningCandidateDataDataGrid from "./JoiningCandidateTable";
// import { apiHeaderToken } from "../../config/api_header";
// import GoBackButton from "../goBack/GoBackButton";
// import config from "../../config/config";

// // Custom TabPanel component with animation
// function TabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`tabpanel-${index}`}
//             aria-labelledby={`tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Fade in={true} timeout={300}>
//                     <Box sx={{ pt: 2 }}>{children}</Box>
//                 </Fade>
//             )}
//         </div>
//     );
// }

// const useDeBouncing = (input) => {
//     const [debouncedValue, setDebouncedValue] = useState('');

//     useEffect(() => {
//         const timer = setTimeout(() => {

//             setDebouncedValue(input)

//         }, 400);

//         return () => clearTimeout(timer);

//     }, [input])

//     return debouncedValue
// }


// const JoiningCandidateList = () => {
//     const [tabValue, setTabValue] = useState('Today');
//     const [searchTerm, setSearchTerm] = useState("");
//     const [approvalRecords, setApprovalListRecords] = useState(null);
//     const debouncingInput = useDeBouncing(searchTerm);
//     const [isFetching, setIsFetching] = useState(false);


//     const handleTabChange = (event, newValue) => {
//         setApprovalListRecords(null)
//         setTabValue(newValue);
//     };

//     const userDetails = useMemo(() => {
//         return JSON.parse(localStorage.getItem('employeeLogin')) || {};
//     }, [])

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     const FetchApprovalListRecords = useCallback(async () => {

//         try {

//             let payloads = {
//                 "employee_id": userDetails?._id,
//                 "job_id": "",
//                 "page_no": 1,
//                 "per_page_record": 100,
//                 "scope_fields": [],
//                 "status": tabValue,
//                 "project_id": "",
//                 "keyword": debouncingInput || "",
//             }

//             setIsFetching(true);
 

//             let response = await axios.post(`${config.API_URL}joiningCandidateList`, payloads, apiHeaderToken(config.API_TOKEN))
//             if (response.status === 200) {
//                 setApprovalListRecords(response.data.data)
//             } else {
//                 setApprovalListRecords(null)
//             }
//         } catch (error) {
//             console.log(error)
//             setApprovalListRecords(null)
//         } finally {
//             setIsFetching(false);
//         }

//     }, [userDetails, tabValue, debouncingInput])

//     useEffect(() => {

//         if (tabValue) {
//             FetchApprovalListRecords()
//         }

//     }, [tabValue, userDetails, FetchApprovalListRecords])

//     return (
//         <div className="maincontent">
//             <div className="container">
//                 <GoBackButton />
//                 <div className="mb-4">
//                     <h3>Candidate Onboarding List</h3>
//                 </div>

//                 {/* Search and Filter Section */}
//                 {/* <div className="mb-4">
//                     <div className="d-flex align-items-center mb-3">
//                         <TextField
//                             fullWidth
//                             variant="outlined"
//                             placeholder="Search by Approval Number, Project, Department..."
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Search />
//                                     </InputAdornment>
//                                 ),
//                                 endAdornment: searchTerm && (
//                                     <InputAdornment position="end">
//                                         <IconButton size="small" onClick={() => setSearchTerm("")}>
//                                             <Clear fontSize="small" />
//                                         </IconButton>
//                                     </InputAdornment>
//                                 )
//                             }}
//                             sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                     borderRadius: '50px',
//                                     backgroundColor: '#fff',
//                                     boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
//                                 }
//                             }}
//                         />
//                     </div>
//                 </div> */}

//                 {/* Tabs */}
//                 <div>
//                     <Tabs
//                         value={tabValue}
//                         onChange={handleTabChange}
//                         indicatorColor="primary"
//                         textColor="primary"
//                         variant="fullWidth"
//                         sx={{
//                             '& .MuiTabs-indicator': {
//                                 height: 4,
//                                 borderRadius: '4px 4px 0 0'
//                             }
//                         }}
//                     >
//                         <Tab
//                             label={
//                                 <div className="d-flex align-items-center">
//                                     <Today fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
//                                     <span>Today</span>
//                                 </div>
//                             }
//                             sx={{ fontWeight: 'bold' }}
//                             value={"Today"}
//                         />
//                         <Tab
//                             label={
//                                 <div className="d-flex align-items-center">
//                                     <Upcoming fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
//                                     <span>Upcoming</span>
//                                 </div>
//                             }
//                             sx={{ fontWeight: 'bold' }}
//                             value={"Upcoming"}
//                         />
//                     </Tabs>

//                     {
//                         tabValue === "Today" && (
//                             <TabPanel value={tabValue} index={tabValue}>
//                                 <JoiningCandidateDataDataGrid ApprovalData={approvalRecords} status={tabValue} loading={isFetching} />
//                             </TabPanel>

//                         )
//                     }

//                     {
//                         tabValue === "Upcoming" && (

//                             <TabPanel value={tabValue} index={tabValue}>
//                                 <JoiningCandidateDataDataGrid ApprovalData={approvalRecords} status={tabValue} loading={isFetching} />
//                             </TabPanel>

//                         )
//                     }

//                 </div>
//             </div>
//         </div>
//     );
// }

// export default JoiningCandidateList;


// Add this to the top of your file
import { motion } from 'framer-motion';
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    Tabs, Tab, Box, Fade,
    IconButton, TextField, InputAdornment
} from "@mui/material";
import {
    CheckCircle, Pending, Search,
    Clear,
    Today,
    Upcoming
} from "@mui/icons-material";
import axios from "axios";
import JoiningCandidateDataDataGrid from "./JoiningCandidateTable";
import { apiHeaderToken } from "../../config/api_header";
import GoBackButton from "../goBack/GoBackButton";
import config from "../../config/config";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <motion.div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
            initial={{ opacity: 0 }}
            animate={{ opacity: value === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
        >
            {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
        </motion.div>
    );
}

const useDeBouncing = (input) => {
    const [debouncedValue, setDebouncedValue] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(input);
        }, 400);
        return () => clearTimeout(timer);
    }, [input]);
    return debouncedValue;
};

const JoiningCandidateList = () => {
    const [tabValue, setTabValue] = useState('Today');
    const [searchTerm, setSearchTerm] = useState("");
    const [approvalRecords, setApprovalListRecords] = useState(null);
    const debouncingInput = useDeBouncing(searchTerm);
    const [isFetching, setIsFetching] = useState(false);

    const handleTabChange = (event, newValue) => {
        setApprovalListRecords(null);
        setTabValue(newValue);
    };

    const userDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem('employeeLogin')) || {};
    }, []);

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
            };
            setIsFetching(true);
            let response = await axios.post(`${config.API_URL}joiningCandidateList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setApprovalListRecords(response.data.data);
            } else {
                setApprovalListRecords(null);
            }
        } catch (error) {
            console.log(error);
            setApprovalListRecords(null);
        } finally {
            setIsFetching(false);
        }
    }, [userDetails, tabValue, debouncingInput]);

    useEffect(() => {
        if (tabValue) {
            FetchApprovalListRecords();
        }
    }, [tabValue, userDetails, FetchApprovalListRecords]);

    const animatedTitle = "Candidate Onboarding List".split(" ").map((word, idx) => (
        <motion.span
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            style={{ marginRight: 8 }}
        >
            {word}
        </motion.span>
    ));

    return (
        <div className="maincontent">
            <div className="container">
                <GoBackButton />
                <div className="mb-4">
                    <motion.h3
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ display: 'flex', flexWrap: 'wrap' }}
                    >
                        {animatedTitle}
                    </motion.h3>
                </div>

                {/* Tabs */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
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
                                <motion.div whileHover={{ scale: 1.1 }} className="d-flex align-items-center">
                                    <Today fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                                    <span>Today</span>
                                </motion.div>
                            }
                            sx={{ fontWeight: 'bold' }}
                            value={"Today"}
                        />
                        <Tab
                            label={
                                <motion.div whileHover={{ scale: 1.1 }} className="d-flex align-items-center">
                                    <Upcoming fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                                    <span>Upcoming</span>
                                </motion.div>
                            }
                            sx={{ fontWeight: 'bold' }}
                            value={"Upcoming"}
                        />
                    </Tabs>

                    {tabValue === "Today" && (
                        <TabPanel value={tabValue} index={tabValue}>
                            <JoiningCandidateDataDataGrid
                                ApprovalData={approvalRecords}
                                status={tabValue}
                                loading={isFetching}
                            />
                        </TabPanel>
                    )}

                    {tabValue === "Upcoming" && (
                        <TabPanel value={tabValue} index={tabValue}>
                            <JoiningCandidateDataDataGrid
                                ApprovalData={approvalRecords}
                                status={tabValue}
                                loading={isFetching}
                            />
                        </TabPanel>
                    )}
                    
                </motion.div>
            </div>
        </div>
    );
};

export default JoiningCandidateList;
