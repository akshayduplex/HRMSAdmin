import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import GoBackButton from '../goBack/GoBackButton';
import Box from "@mui/material/Box";

// import JobCards from "./JobCards";
import JobCards from "../ats/JobCards";
// import JobCardsArchived from "./JobCardsArchived";
import JobCardsArchived from "../ats/JobCardsArchived";
import AllHeaders from "../partials/AllHeaders";
import { useSelector, useDispatch } from "react-redux";
import AsyncSelect from 'react-select/async';

import { GetJobList, AchievedJobList, ExpiredJobList, SendJobInNaukary } from "../slices/AtsSlices/getJobListSlice";
import { InfinitySpin } from 'react-loader-spinner'
import { FetchProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import FormControl from "@mui/material/FormControl";
import { GrPowerReset } from "react-icons/gr";
import { Button, Form } from "react-bootstrap";
import SearchInput from "../CeoDashboard/SearchBox";
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { FaDownload, FaCalendarAlt } from "react-icons/fa";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '40px',
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

const DeBouncingForSearch = (search) => {

    const [DebounceKey, setDeBounceKey] = useState('');

    useEffect(() => {

        let timer = setTimeout(() => {
            setDeBounceKey(search);

        }, 500);

        return () => {
            clearTimeout(timer);
        }

    }, [search])

    return DebounceKey
}

function JobList() {
    const dispatch = useDispatch();
    const PublishedJobList = useSelector((state) => state.getJobsList.getJobList)
    const { achievedJobList, expiredJobList, sendedJobInNaukary } = useSelector((state) => state.getJobsList)
    const [option, setOptions] = useState([]);
    const [projectListOption, setProjectOptions] = useState(null);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('first');
    const [isExporting, setIsExporting] = useState(false);
    const [jobStatus, setJobStatus] = useState('')

    // Date filter states
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const searchParams = DeBouncingForSearch(search)
    const [searchParamsUrl] = useSearchParams();

    const queryProjectId = searchParamsUrl.get("project_id");
    const queryProjectName = searchParamsUrl.get("project_name");

    // Helper function to format date for input
    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Set default dates (current date to one month past)
    // useEffect(() => {
    //     const today = new Date();
    //     const oneMonthAgo = new Date();
    //     oneMonthAgo.setMonth(today.getMonth() - 1);

    //     setToDate(formatDateForInput(today));
    //     setFromDate(formatDateForInput(oneMonthAgo));
    // }, []);
    useEffect(() => {
        if (queryProjectId && queryProjectName) {
            const selectedProject = {
                value: queryProjectId,
                label: decodeURIComponent(queryProjectName),
            };

            setProjectOptions(selectedProject);
            localStorage.setItem("allJobList", JSON.stringify(selectedProject));

            // 🔹 Fetch jobs with project_id
            const basePayload = {
                keyword: "",
                department: "",
                job_title: "",
                location: "",
                job_type: "",
                salary_range: "",
                page_no: "1",
                per_page_record: "100",
                project_id: queryProjectId,
                scope_fields: [
                    "_id",
                    "project_name",
                    "department",
                    "job_title",
                    "job_type",
                    "experience",
                    "location",
                    "salary_range",
                    "status",
                    "working",
                    "deadline",
                    "form_candidates",
                    "total_vacancy",
                    "available_vacancy",
                    "add_date",
                    "designation",
                    "naukari_job_data",
                    "requisition_form_opening_type",
                    "job_title_slug",
                ],
            };

            dispatch(GetJobList({ ...basePayload, status: "Published" }));
            dispatch(ExpiredJobList({ ...basePayload, status: "Expired" }));
            dispatch(AchievedJobList({ ...basePayload, status: "Archived" }));
        }
    }, [queryProjectId, queryProjectName, dispatch]);

    const handleResetOption = (e) => {
        e.preventDefault()
        // setRotateIcon(true);
        setProjectOptions('')
        let Payloads = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "page_no": "1",
            "status": "Published",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",
            ],
        }
        dispatch(GetJobList(Payloads)).unwrap()
        let PayloadsOFExpired = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "page_no": "1",
            "status": "Expired",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",


            ],
        }
        dispatch(ExpiredJobList(PayloadsOFExpired))

        let PayloadsOFArchived = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "project_id": "",
            "page_no": "1",
            "status": "Archived",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",

            ],
        }
        setSearch('')
        dispatch(AchievedJobList(PayloadsOFArchived))
    }

    useEffect(() => {

        let getSelectedList = JSON.parse(localStorage.getItem('allJobList'))

        if (getSelectedList) {
            setProjectOptions(getSelectedList);
        }
        let Payloads = {
            "keyword": searchParams ? searchParams : "",
            "filter_keyword": searchParams ? searchParams : "",
            "department": "",
            "job_title": '',
            "location": "",
            "job_type": "",
            "project_id": getSelectedList?.value || "",
            "salary_range": "",
            "page_no": "1",
            "per_page_record": "100",
            "status": "Published",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",
            ],
        }


        let PayloadsOFExpired = {
            "keyword": searchParams ? searchParams : "",
            "filter_keyword": searchParams ? searchParams : "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "project_id": getSelectedList?.value || "",
            "page_no": "1",
            "status": "Expired",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",

            ],
        }



        let PayloadsOFArchived = {
            "keyword": searchParams ? searchParams : "",
            "filter_keyword": searchParams ? searchParams : "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "project_id": getSelectedList?.value || "",
            "page_no": "1",
            "status": "Archived",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",

            ],
        }

        if (activeTab !== 'naukari') {
            dispatch(GetJobList(Payloads));
            dispatch(ExpiredJobList(PayloadsOFExpired))
            dispatch(AchievedJobList(PayloadsOFArchived))
        }

    }, [dispatch, searchParams]);


    const handleFilterData = useCallback((reset = false) => {
        // if (activeTab === 'naukari') {
        let getSelectedList = JSON.parse(localStorage.getItem('allJobList'))

        if (fromDate && toDate === '') {
            toast.error('Please select to date')
            return
        }

        if (toDate && fromDate === '') {
            toast.error('Please select from date')
            return
        }

        let PayloadsOfPosted = {
            "keyword": searchParams ? searchParams : "",
            "filter_keyword": searchParams ? searchParams : "",
            "department": "",
            "job_title": '',
            "location": "",
            "job_type": "",
            "project_id": projectListOption?.value || getSelectedList?.value || "",
            "salary_range": "",
            "page_no": "1",
            "per_page_record": "100",
            "status": reset ? '' : jobStatus,
            "from_date": reset ? '' : fromDate,
            "to_date": reset ? '' : toDate,
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",
            ],
        }
        dispatch(SendJobInNaukary(PayloadsOfPosted))
        // }
    }, [searchParams, toDate, fromDate, jobStatus, dispatch, projectListOption])


    useEffect(() => {
        // Auto-load data when activeTab changes to 'naukari' or searchParams change
        // if (activeTab === 'naukari') {
        handleFilterData();
        // }
    }, [searchParams, dispatch, projectListOption])

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

    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchProjectListDropDown(input)).unwrap();
        return addAllOptionIfMissing(result);
    }

    const projectMenuOpen = async () => {
        const result = await dispatch(FetchProjectListDropDown('')).unwrap();
        setOptions(addAllOptionIfMissing(result));
    }

    const handleProjectChanges = (option) => {
        setProjectOptions(option);

        localStorage.setItem("allJobList", JSON.stringify(option))

        let Payloads = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "page_no": "1",
            "status": "Published",
            "project_id": option?.value || "",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",
            ],
        }

        dispatch(GetJobList(Payloads));
        let PayloadsOFExpired = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "page_no": "1",
            "project_id": option?.value || "",
            "status": "Expired",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",
            ],
        }
        dispatch(ExpiredJobList(PayloadsOFExpired))

        let PayloadsOFArchived = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "job_type": "",
            "salary_range": "",
            "project_id": option?.value || "",
            "page_no": "1",
            "status": "Archived",
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation",
                "naukari_job_data",
                "requisition_form_opening_type",
                "job_title_slug",
            ],
        }
        dispatch(AchievedJobList(PayloadsOFArchived))
    }

    const handleTabSelect = (key) => {
        setActiveTab(key);
    };

    const exportToExcel = async () => {
        if (activeTab !== 'naukari') return;

        setIsExporting(true);
        try {
            let jobsData = sendedJobInNaukary.status === 'success' ?
                sendedJobInNaukary.data : [];

            // Filter by date range if dates are selected
            if (fromDate && toDate) {
                const fromDateTime = new Date(fromDate).getTime();
                const toDateTime = new Date(toDate).getTime();

                jobsData = jobsData.filter((job) => {
                    if (job.add_date) {
                        const jobDate = new Date(job.add_date).getTime();
                        return jobDate >= fromDateTime && jobDate <= toDateTime;
                    }
                    return true; // Include jobs without add_date
                });
            }

            if (jobsData.length === 0) {
                toast.warn('No jobs data available to export for the selected date range');
                return;
            }

            // Prepare data for Excel export
            const exportData = jobsData.map((job, index) => ({
                'S.No': index + 1,
                'Job Title': job.job_title || '',
                'Project Name': job.project_name || '',
                'Department': job.department || '',
                'Job Type': job.job_type || '',
                'Experience': job.experience || '',
                'Location': job.location || '',
                'Salary Range': job.salary_range || '',
                'Total Vacancy': job.total_vacancy || '',
                'Available Vacancy': job.available_vacancy || '',
                'Deadline': job.deadline ? new Date(job.deadline).toLocaleDateString() : '',
                'Status': job.status || '',
                'Working': job.working || '',
                'Designation': job.designation || '',
                'Published Date': job.naukari_job_data?.added_on ? new Date(job.naukari_job_data?.added_on).toLocaleDateString() : '',
                'Naukari Job ID': job.naukari_job_data?.publish_job_id || '',
                'Naukari Published code': job.naukari_job_data?.publish_code || '',
                "Naukari Posted URL": job.naukari_job_data?.publish_link || '',
                'Requisition Type': job.requisition_form_opening_type || ''
            }));

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);

            // Set column widths
            const colWidths = [
                { wch: 8 },   // S.No
                { wch: 25 },  // Job Title
                { wch: 20 },  // Project Name
                { wch: 15 },  // Department
                { wch: 12 },  // Job Type
                { wch: 12 },  // Experience
                { wch: 15 },  // Location
                { wch: 15 },  // Salary Range
                { wch: 12 },  // Total Vacancy
                { wch: 15 },  // Available Vacancy
                { wch: 12 },  // Deadline
                { wch: 10 },  // Status
                { wch: 10 },  // Working
                { wch: 15 },  // Designation
                { wch: 12 },  // Add Date
                { wch: 15 },  // Naukari Job ID
                { wch: 15 }   // Requisition Type
            ];
            ws['!cols'] = colWidths;

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Naukari Jobs');

            // Generate filename with current date and date range
            const currentDate = new Date().toISOString().split('T')[0];
            const dateRangeText = fromDate && toDate ? `_${fromDate}_to_${toDate}` : '';
            const filename = `Naukari_Jobs_${currentDate}${dateRangeText}.xlsx`;

            // Save file
            XLSX.writeFile(wb, filename);
            toast.success('Jobs data exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export jobs data');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="hrhdng">
                            <h2>Posted Jobs listing</h2>
                            <p className="mb-0 text-start">
                                Active and Archived job listing
                            </p>
                        </div>
                        <div className="hrhdng d-flex gap-2">

                            <div className='pb-3 cardsearch'>
                                <SearchInput
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClear={() => setSearch('')}
                                />
                            </div>

                            <Box sx={{ minWidth: 300, marginLeft: '10px' }}>
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
                                        isClearable
                                    />
                                </FormControl>
                            </Box>

                            <Button disabled={!projectListOption} className="p-2 text-center" style={{
                                height: '40px',
                            }} onClick={handleResetOption}>
                                <GrPowerReset size={20} />
                            </Button>
                        </div>
                    </div>
                    <div className="row mt-4 gap-4">
                        <div className="col-lg-12">
                            <div className="postedjobs">
                                <Tab.Container
                                    id="left-tabs-example"
                                    defaultActiveKey="first"
                                    activeKey={activeTab}
                                    onSelect={handleTabSelect}
                                    fill
                                >
                                    <Nav
                                        variant="pills"
                                        className="flex-row border-full d-flex justify-content-between align-items-end"
                                    >
                                        <div className="d-flex flex-row">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">Active Jobs ({PublishedJobList.status === 'success' && PublishedJobList.data.filter((job) => job.status === 'Published').length})</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">
                                                    Archieved Jobs ({achievedJobList.status === 'success' && achievedJobList.data.length})
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="third">
                                                    Expired Jobs ({expiredJobList.status === 'success' && expiredJobList.data.length})
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="naukari">Posted Jobs On Naukri ({sendedJobInNaukary.status === 'success' && sendedJobInNaukary.data?.length})</Nav.Link>
                                            </Nav.Item>
                                        </div>
                                        {activeTab === 'naukari' && (
                                            <div className="d-flex align-items-center mb-2 gap-2">
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    onClick={() => setShowDateFilter(!showDateFilter)}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    <FaCalendarAlt size={14} />
                                                    {showDateFilter ? 'Hide Filter' : 'Date Filter'}
                                                </Button>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={exportToExcel}
                                                    disabled={isExporting || sendedJobInNaukary.status === 'loading'}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    <FaDownload size={14} />
                                                    {isExporting ? 'Exporting...' : 'Export to Excel'}
                                                </Button>
                                            </div>
                                        )}
                                    </Nav>

                                    {activeTab === 'naukari' && showDateFilter && (
                                        <div className="bg-light p-3 mb-3 rounded border" style={{ position: 'relative' }}>
                                            <div className="row g-3">
                                                <div className="col-md-3" style={{ position: 'relative' }}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-bold">Job Status</Form.Label>
                                                        <Form.Select
                                                            value={jobStatus}
                                                            onChange={(e) => setJobStatus(e.target.value)}
                                                        >
                                                            <option value="">All</option>
                                                            <option value="CREATED">CREATED</option>
                                                            <option value="DELETED">DELETED</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-3" style={{ position: 'relative' }}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-bold">From Date</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={fromDate}
                                                            onChange={(e) => setFromDate(e.target.value)}
                                                        // size="sm"
                                                        />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-md-3" style={{ position: 'relative' }}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-bold">To Date</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={toDate}
                                                            onChange={(e) => setToDate(e.target.value)}
                                                        // size="sm"
                                                        />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-md-3 d-flex gap-1 align-items-end mb-1">
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => {
                                                            // const today = new Date();
                                                            // const oneMonthAgo = new Date();
                                                            // oneMonthAgo.setMonth(today.getMonth() - 1);
                                                            setToDate('');
                                                            setFromDate('');
                                                            setJobStatus('')
                                                            handleFilterData(true);
                                                        }}
                                                        className="d-flex align-items-center gap-2 w-100"
                                                    >
                                                        <GrPowerReset size={14} />
                                                        Reset
                                                    </Button>

                                                    <Button
                                                        variant="outline-success"
                                                        // disabled={toDate === '' && (fromDate === '' || jobStatus === '')}
                                                        onClick={() => {
                                                            handleFilterData();
                                                        }}
                                                    >
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* <div className="mt-2">
                                                <small className="text-muted">
                                                    <strong>Note:</strong> Export will include jobs added between {fromDate || "start"} and{" "}
                                                    {toDate || "end"} dates. Default range is last 1 month from today.
                                                </small>
                                            </div> */}
                                        </div>
                                    )}

                                    <Tab.Content className="contere">
                                        <Tab.Pane eventKey="first">
                                            <div className="d-flex flex-column gap-2 mt-1 scroller-content">
                                                {
                                                    PublishedJobList.status === 'loading' ?
                                                        <div className="d-flex align-content-center justify-content-center">
                                                            <InfinitySpin
                                                                visible={true}
                                                                width="200"
                                                                color="#4fa94d"
                                                                ariaLabel="infinity-spin-loading"
                                                            />
                                                        </div> :
                                                        PublishedJobList.status === 'success' &&
                                                        PublishedJobList.data.length !== 0 &&
                                                        PublishedJobList.data.map((value, index) => {
                                                            if (value?.status === 'Published') {
                                                                return (
                                                                    <JobCards value={value} />
                                                                )
                                                            }
                                                            return null;
                                                        })
                                                }
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                            <div className="d-flex flex-column gap-2 mt-1 scroller-content">
                                                {
                                                    achievedJobList.status === 'loading' ?
                                                        <div className="d-flex align-content-center justify-content-center">
                                                            <InfinitySpin
                                                                visible={true}
                                                                width="200"
                                                                color="#4fa94d"
                                                                ariaLabel="infinity-spin-loading"
                                                            />
                                                        </div> :
                                                        achievedJobList.status === 'success' &&
                                                        achievedJobList.data.length !== 0 &&
                                                        achievedJobList.data.map((value, index) => {
                                                            if (value?.status === 'Archived') {
                                                                return (
                                                                    <JobCardsArchived value={value} />
                                                                )
                                                            }
                                                            return null;
                                                        })
                                                }
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third">
                                            <div className="d-flex flex-column gap-2 mt-1 scroller-content">
                                                {
                                                    expiredJobList?.status === 'loading' ?
                                                        <div className="d-flex align-content-center justify-content-center">
                                                            <InfinitySpin
                                                                visible={true}
                                                                width="200"
                                                                color="#4fa94d"
                                                                ariaLabel="infinity-spin-loading"
                                                            />
                                                        </div> :
                                                        expiredJobList?.status === 'success' &&
                                                        expiredJobList.data.length !== 0 &&
                                                        expiredJobList.data.map((value, index) => {
                                                            return (
                                                                <JobCardsArchived value={value} />
                                                            )
                                                        })
                                                }
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="naukari">
                                            <div className="d-flex flex-column gap-2 mt-1 scroller-content">
                                                {
                                                    sendedJobInNaukary.status === 'loading' ?
                                                        <div className="d-flex align-content-center justify-content-center">
                                                            <InfinitySpin
                                                                visible={true}
                                                                width="200"
                                                                color="#4fa94d"
                                                                ariaLabel="infinity-spin-loading"
                                                            />
                                                        </div> :
                                                        sendedJobInNaukary.status === 'success' &&
                                                        sendedJobInNaukary.data.length !== 0 &&
                                                        sendedJobInNaukary.data.map((value, index) => {
                                                            return (
                                                                <JobCards value={value} />
                                                            )
                                                        })
                                                }
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default JobList;
