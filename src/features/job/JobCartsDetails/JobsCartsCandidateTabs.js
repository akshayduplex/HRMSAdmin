import React, { useCallback, useEffect, useMemo, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { CiFilter, CiSearch } from "react-icons/ci";
import JobCandidateTable from "./JobCandidatePanel.js";
import InterviewTable from "./InterviewTables.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { ShortListCandidates } from "../../slices/JobSortLIstedSlice/SortLIstedSlice.js";
import { FetchAppliedCandidateDetails, FetchAppliedCandidateDetailsCountPagination, FetchAppliedCandidateDetailsWithServerPagination } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice.js";
import { useParams, useSearchParams } from "react-router-dom";
import Offer_table from "./OfferHireRejectTables.js";
import AsyncCreatableSelect from 'react-select/async-creatable';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from "axios";
import config from "../../../config/config.js";
import { apiHeaderToken } from "../../../config/api_header.js";
import { IconButton, Button as MuiButton, Tooltip } from '@mui/material';
import ApprovalIcon from '@mui/icons-material/Approval';
import ApprovalTable from "./ApprovalNoteTables/ApprovalTable.js";
import ApprovalModalApprovalCandidate from "./ApprovalNoteTables/ApprovalModal.js";
import moment from "moment";
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { AsyncPaginate } from "react-select-async-paginate";
import { GetEmployeeListDropDownScroll } from "../../slices/EmployeeSlices/EmployeeSlice.js";
import { FiFilter, FiXCircle } from "react-icons/fi";
import AppliedFilterModal from "./AppliedFilterModal.js";

const customStylesForEmp = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '44px',
        width: '250px'
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
        width: '200px'
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#e0e0e0' : '#fff', // Focused option styling
        color: state.isFocused ? '#000' : '#333',
        cursor: 'pointer',
        padding: 10,
        fontWeight: state.isFocused ? 'bold' : 'normal',
        border: state.isFocused ? '1px solid #007bff' : 'none',
        textAlign: 'center',
        borderRadius: '4px',
        backgroundColor: state.isFocused ? '#007bff' : '#fff', // Button-like style
        color: state.isFocused ? '#fff' : '#007bff',           // Button-like text color
    }),
};

export default function JobCardsCandidateTabs() {
    const [QueryParams] = useSearchParams();
    const [batchId, setBatchId] = useState(null);
    const type = QueryParams.get('type');
    const [activeTab, setActiveTab] = useState(type === 'new' ? 'first' : type === 'upcomming' ? 'third' : type === 'Shortlisted' ? 'second' : type === 'Interview' ? "third" : type === 'Rejected' ? 'six' : type === 'Hired' ? 'five' : type === 'Offered' ? 'four' : type === 'approval-total' || type === 'approval-pending' ? "approval" : 'zero');
    const AppliedCandidateServer = useSelector((state) => state.appliedJobList.AppliedCandidateServer)
    const AppliedCandidateListCount = useSelector((state) => state.appliedJobList.AppliedCandidateListCount)
    const filterJobDetails = useSelector((state) => state.appliedJobList.selectedJobList);
    const resetTheValue = useSelector((state) => state.appliedJobList.resetTheValue);
    const getEmployeeRecords = JSON.parse(localStorage.getItem('admin_role_user') ?? {})
    const [CandidatesDetials, setCandidatesDetials] = useState([]);
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const [BatchId, setNewBatchId] = useState('')
    const [isActive, setIsActive] = useState(true);
    const { id } = useParams();
    const [memberData, setMember] = useState(null);
    const [openMemberList, setOpenMemberList] = useState(false);
    const [approvalNotes, setListApproval] = useState(null);
    const [searchApprovalNode, setSearchApprovalNode] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [paginationModelApproval, setPaginationApprovalModel] = useState({ page: 0, pageSize: 10 });
    const [approvalNoteLoading, setApprovalHistoryLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bulkSchedule, setBulkSchedule] = useState(null);
    const [options, setOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterData, setFilterData] = useState(null);

    const handlePaginationModelChange = useCallback((newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    }, []);

    const handlePaginationApprovalModelChange = useCallback((newPaginationModel) => {
        setPaginationApprovalModel(newPaginationModel);
    }, []);

    const handleClose = () => setShowModal(false);

    const getStatus = (key) => {
        switch (key) {
            case 'first': return 'Applied';
            case 'zero': return '';
            case 'second': return 'Shortlisted';
            case 'third': return 'Interview';
            case 'four': return 'Offer';
            case 'five': return 'Hired';
            case 'six': return 'Rejected';
            case 'approval': return 'approval';
            default: return '';
        }
    };

    const commonIconButtonStyle = useMemo(() => ({
        width: '45px',
        height: '42px',
        padding: '6px',
        borderRadius: '6px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-2px)',
        }
    }), []);

    const getTooltipStyle = (bgColor) => ({
        tooltip: {
            sx: {
                fontSize: '0.75rem',
                padding: '8px 12px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontWeight: 500,
                bgcolor: bgColor,
                '& .MuiTooltip-arrow': {
                    color: bgColor
                }
            }
        }
    });

    const handleApplyFilter = (filters) => {
        setFilterData(filters);
        setShowFilterModal(false);
        // TODO: Implement filter logic, e.g., update the candidate list based on filters
    };

    const handleResetFilter = () => {
        setFilterData(null);
    };

    const handleClearFilter = () => {
        setFilterData(null);
    };

    const handleCreateOption = (inputValue) => {
        if (/^\d+$/.test(inputValue)) {
            const newOption = { label: inputValue, value: inputValue };
            setBatchId(newOption);
            setNewBatchId(inputValue)
            setShowModal(true);
        } else {
            toast.warn("Invalid input, only numbers are allowed.")
        }
    };

    const GetBatchId = async (input) => {
        try {
            let payloads = { "keyword": input ? input : '', "page_no": "1", "per_page_record": "10", "scope_fields": ["_id", "batch_id"] };
            let response = await axios.post(`${config.API_URL}getBatchIDList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data?.data.map((item) => ({
                    value: item._id,
                    label: `${item.batch_id}`,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    };

    const loadOptions = async (inputValue, callback) => {
        const fetchedOptions = await GetBatchId(inputValue);
        callback(fetchedOptions); // Provide the options to the select component
    };

    const handleMenuOpen = async () => {
        const fetchedOptions = await GetBatchId('');
        setOptions(fetchedOptions);
    }

    const handleExportToExcel = async () => {
        try {
            // Create payload based on active tab
            let candidate_ids = CandidatesDetials?.map((item) => item?.candidateInfo?.candidate_id)

            const payload = {
                job_id: id || filterJobDetails?.value,
                form_status: status,
                page_no: 1,
                per_page_record: 1000000, // Adjust as needed
                candidate_ids: candidate_ids
            };

            setDownloading(true);

            // Make API call to get data
            const response = await axios.post(
                `${config.API_URL}getAppliedJobList`,
                payload,
                apiHeaderToken(config.API_TOKEN)
            );

            if (response.status === 200) {
                const data = response.data.data;
                // Transform data for Excel
                const excelData = data.map((item, index) => ({
                    'Sr. No.': index + 1,
                    'Candidate Name': item.name || '',
                    'Email': item.email || '',
                    'Mobile': item.mobile_no || '',
                    'Project': item?.applied_jobs?.[0]?.project_name || '',
                    'Current Designation': item?.applied_jobs?.[0]?.job_designation || '',
                    'Job Title': item?.applied_jobs?.[0]?.job_title || '',
                    'Current Location': item?.applied_jobs?.[0]?.job_location || '',
                    'Applied From': item?.applied_from ? item?.applied_from + ` ${item.applied_from && item?.applied_jobs?.[0]?.naukri_ref_id ? '(Portal)' : ['Outgrow', 'Devnet', 'Naukri'].includes(item.applied_from) ? '(Import)' : ''}` : 'N/A',
                    'Applied Date': moment(item?.applied_jobs?.[0]?.add_date).format('DD/MM/YYYY') || '',
                    'Total Experience': item.total_experience || '',
                    'Current CTC': item.current_ctc || '',
                    'Expected CTC': item.expected_ctc || '',
                    'Current/Last Org': item.current_employer || 'N/A',
                    'current employer Mobile No': item.current_employer_mobile || 'N/A',
                    'Notice Period': item.notice_period || ''
                }));
                // Create workbook and worksheet
                const ws = XLSX.utils.json_to_sheet(excelData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Candidates');

                // Generate filename
                const fileName = `Candidates_${status || 'All'}_${moment().format('DD-MM-YYYY')}.xlsx`;

                // Save file
                XLSX.writeFile(wb, fileName);
                toast.success('Export successful!');
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        } finally {
            setDownloading(false);
        }
    };

    const handleSelect = useCallback((key) => {
        setActiveTab(key);
        setPaginationModel({ page: 0, pageSize: 10 });
        setFilterInterview(null);
    }, []);

    const formatCreateLabel = (inputValue) => {
        return `➕ Add Batch ID: "${inputValue}"`;
    };

    const handleAddBatchId = async (e) => {
        e.preventDefault();
        try {
            if (!BatchId) {
                return toast.warn('Please Select the Batch id');
            }
            setLoading(true);
            let payloads = { "batch_id": BatchId, "status": "Active" }
            let response = await axios.post(`${config.API_URL}addBatchID`, payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                setLoading(false)
                toast.success(response.data?.message)
                handleClose();
                setBatchId([]);
            } else {
                toast.error(response.data?.message)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.response.data.message)
            setLoading(false)
        }
    }

    const ScheduleBulkInterview = (e) => {
        e.preventDefault();
        if (!id && !filterJobDetails) {
            setBulkSchedule('')
            return toast.warning('Please select job first');
        }

        if (CandidatesDetials.length === 0) {
            setBulkSchedule('')
            return toast.warning('No Candidates Selected to Schedule Interview')
        }

        if (e.target.value && e.target.value === 'interview') {
            let candidateIds = [];
            let appliedJobIds = [];

            CandidatesDetials.forEach((value) => {
                if (value?.candidateInfo) {
                    candidateIds.push(value.candidateInfo.candidate_id);
                    appliedJobIds.push(value.candidateInfo.applied_job_id);
                }
            });

            let url = `/schedule-interview/${id || filterJobDetails?.value}?userId=${candidateIds}&applied-job-id=${appliedJobIds}&project_id=${CandidatesDetials[0]?.project_id}`

            setTimeout(() => {
                // navigation(url)
                window.location.href = url; // Redirects to the given URL

            }, 1000);
        }
        setBulkSchedule(e.target.value)
    }

    const handleBulkSortListed = (e) => {
        if (!batchId) {
            return toast.error('Please select batch first');
        }

        if (!id && !filterJobDetails) {
            return toast.warning('Please select job first');
        }
        e.preventDefault()
        if (CandidatesDetials.length === 0 && e.target.value === 'Shortlisted') {
            return toast.warning('No Candidates Selected to Shortlist')
        }
        if (e.target.value && e.target.value === 'Shortlisted') {
            let candidateDetails = CandidatesDetials.reduce((acc, value) => {
                if (value?.candidateInfo) {
                    acc.push({
                        candidate_id: value?.candidateInfo?.candidate_id,
                        applied_job_id: value?.candidateInfo?.applied_job_id,
                    }, [paginationModel.page, paginationModel.pageSize, type])
                }
                return acc
            }, [])
            let payloads = {
                "role_user_id": getEmployeeRecords?._id,
                "candidate_ids": candidateDetails,
                "status": "Shortlisted",
                "batch_id": batchId?.label,
                "added_by_name": getEmployeeRecords?.name,
                "added_by_mobile": getEmployeeRecords?.mobile_no,
                "added_by_designation": getEmployeeRecords?.designation,
                "added_by_email": getEmployeeRecords?.email
            }
            dispatch(ShortListCandidates(payloads))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        dispatch(FetchAppliedCandidateDetails(id || filterJobDetails?.value));
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const handleBulkMarkAsSelectedOrWait = (e) => {
        if (!id && !filterJobDetails) {
            return toast.warning('Please select job first');
        }

        if (CandidatesDetials.length === 0) {
            return toast.warning('No Candidates Selected to Shortlist')
        }

        let candidateDetails = CandidatesDetials.reduce((acc, value) => {
            if (value?.candidateInfo) {
                acc.push(value?.candidateInfo?.candidate_id)
            }
            return acc
        }, [])

        let payload = {
            "approval_note_doc_id": "",
            "job_id": id ? id : filterJobDetails?.value,
            "project_id": id ? AppliedCandidateServer?.data?.[0]?.applied_jobs[0]?.project_id : filterJobDetails?.project_id,
            "candidate_ids": candidateDetails,
            "add_by_name": getEmployeeRecords?.name,
            "add_by_mobile": getEmployeeRecords?.mobile_no,
            "add_by_designation": getEmployeeRecords?.designation,
            "add_by_email": getEmployeeRecords?.email
        }

        axios.post(`${config.API_URL}getJobOfferApprovalMemberList`, payload, apiHeaderToken(config.API_TOKEN))
            .then((res) => {
                if (res.status === 200) {
                    setMember(res.data?.data)
                    setOpenMemberList(true);
                    if (filterJobDetails?.value) {
                        getApprovalListByJobId(filterJobDetails?.value)
                    }
                    if (id) {
                        getApprovalListByJobId(id)
                    }
                } else {
                    toast.error(res.data?.message)
                }
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || err?.message || "Someting Went Wrong");
            })
    }

    const status = useMemo(() => {
        return getStatus(activeTab)
    }, [activeTab]);

    const getApprovalListByJobId = useCallback(async (jobId = '') => {
        // const [approvalNotes , setListApproval] = useState(null);
        let payload = {
            "job_id": jobId,
            "page_no": paginationModelApproval.page + 1,
            "per_page_record": paginationModelApproval.pageSize,
            "scope_fields": [],
            "keyword": searchApprovalNode,
            "status": type === 'approval-pending' ? 'Inprogress' : ''
        }

        setApprovalHistoryLoading(true)

        try {
            let response = await axios.post(`${config.API_URL}getApprovalNoteFromList`, payload, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setListApproval(response.data?.data);
            } else {
                setListApproval([]);
            }
        } catch (error) {
            setListApproval([]);
        } finally {
            setApprovalHistoryLoading(false)
        }

    }, [paginationModelApproval.page, paginationModelApproval.pageSize, type, searchApprovalNode]);

    let jobFilter = JSON.parse(localStorage.getItem('jobFilter'))

    useEffect(() => {
        if (filterJobDetails?.value && status === 'approval') {
            getApprovalListByJobId(filterJobDetails?.value || jobFilter?.value)
            // dispatch(FetchAppliedCandidateDetailsCount(filterJobDetails?.value));
        }
        else if (id && status === 'approval') {
            getApprovalListByJobId(id || jobFilter?.value)
            // dispatch(FetchAppliedCandidateDetailsCount(id));
        } else if (status === 'approval') {
            getApprovalListByJobId(jobFilter?.value || '')
            // dispatch(FetchAppliedCandidateDetailsCount());
        }
    }, [filterJobDetails, getApprovalListByJobId, id , status]);

    useEffect(() => {

        if (resetTheValue) {
            setListApproval([])
        }

    }, [resetTheValue])

    /*********************************** Interview Filter Section *****************************/
    const [filterInterview, setFilterInterview] = useState(null)

    const EmployeeListDropDownPagination = async (inputValue, loadedOptions, { page }) => {

        let payloads = {
            "keyword": inputValue,
            "page_no": page.toString(),
            "per_page_record": "10",
            "scope_fields": ["employee_code", "name", "email", "mobile_no", "_id", 'designation'],
            "profile_status": "Active",
        }

        const result = await dispatch(GetEmployeeListDropDownScroll(payloads)).unwrap();

        return {
            options: page === 1
                ? [
                    { label: 'All', value: null, emp_code: null, designation: null },
                    ...result
                ]
                : result,
            hasMore: result.length >= 10,
            additional: { page: page + 1 }
        };
    };

    useEffect(() => {
        let payloads = {
            id: id || filterJobDetails?.value || "",
            form_status: status,
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            keyword: search || '',
            interviewer_id: filterInterview?.value || '',
            city: filterData?.city || '',
            state: filterData?.state || '',
            education: filterData?.education || '',
            experience: filterData?.experience || '',
        };

        dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
    }, [paginationModel, search, id, filterJobDetails?.value, status, dispatch, filterInterview, filterData]);

    useEffect(() => {
        let payloads = {
            id: id || filterJobDetails?.value || "",
            form_status: status,
            keyword: search || '',
            interviewer_id: filterInterview?.value || '',
            city: filterData?.city || '',
            state: filterData?.state || '',
            education: filterData?.education || '',
            experience: filterData?.experience || '',
        };
        dispatch(FetchAppliedCandidateDetailsCountPagination(payloads));
    }, [search, id, filterJobDetails, status, dispatch, filterInterview, filterData]);

    return (
        <>
            <Tab.Container id="left-tabs-example" className="" defaultActiveKey={type === 'new' ? 'first' : type === 'upcomming' ? 'third' : type === 'Shortlisted' ? 'second' : type === 'Interview' ? "third" : type === 'Rejected' ? 'six' : type === 'Hired' ? 'five' : type === 'Offered' ? 'four' : type === 'approval-total' || type === 'approval-pending' ? "approval" : 'zero'} onSelect={handleSelect}>
                <Nav variant="pills" className="flex-row postedjobs border-full mb-4 widthcomp widthfuller">
                    <Nav.Item>
                        <Nav.Link eventKey="zero">Total Candidates ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.all})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="first">New Candidates ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.applied})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="second">Shortlisted ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.shortlist})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="third">Interview ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.interviewed})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="approval">Approval Note ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.approval_note})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="four">Offer ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.offered})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="five">Hired ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.hired})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="six">Rejected ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.rejected})</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    {
                        activeTab === 'zero' && (
                            <Tab.Pane eventKey="zero">
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div className="tbl_hdng">
                                        <h6>{AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.all} Candidates</h6>
                                    </div>

                                    <div className="d-flex flex-row gap-3">
                                        {
                                            filterData && (
                                                <Tooltip
                                                    title="Clear Filter"
                                                    arrow
                                                    placement="top"
                                                    componentsProps={getTooltipStyle('#c62828')} // Red
                                                >
                                                    <IconButton
                                                        onClick={handleResetFilter}
                                                        size="small"
                                                        sx={{
                                                            ...commonIconButtonStyle,
                                                            backgroundColor: 'rgba(198, 40, 40, 0.08)',
                                                            '&:hover': { backgroundColor: 'rgba(198, 40, 40, 0.15)' }
                                                        }}
                                                    >
                                                        <FiXCircle style={{ color: '#c62828' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }



                                        {/* give me here filter icons with tooltips  */}
                                        <Tooltip
                                            title="Apply Filter"
                                            arrow
                                            placement="top"
                                            componentsProps={getTooltipStyle('#1565c0')} // Blue
                                        >
                                            <IconButton
                                                onClick={() => setShowFilterModal(true)}
                                                size="small"
                                                sx={{
                                                    ...commonIconButtonStyle,
                                                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                                    '&:hover': { backgroundColor: 'rgba(21, 101, 192, 0.15)' }
                                                }}
                                            >
                                                <FiFilter style={{ color: '#1565c0' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <MuiButton
                                            variant="outlined"
                                            onClick={handleExportToExcel}
                                            disabled={downloading}
                                            sx={{
                                                borderColor: '#34209b',
                                                color: '#34209b',
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                position: 'relative', // Add this
                                                '&:hover': {
                                                    borderColor: '#34209b',
                                                    backgroundColor: 'rgba(52, 32, 155, 0.08)',
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {downloading ? (
                                                <>
                                                    <FileDownloadIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'inherit',
                                                            animation: 'moveDown 1s infinite',
                                                            '@keyframes moveDown': {
                                                                '0%': {
                                                                    transform: 'translateY(-5px)',
                                                                    opacity: 0
                                                                },
                                                                '50%': {
                                                                    transform: 'translateY(0)',
                                                                    opacity: 1
                                                                },
                                                                '100%': {
                                                                    transform: 'translateY(5px)',
                                                                    opacity: 0
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <FileDownloadIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: 'inherit',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </MuiButton>

                                        <InputGroup className="searchy-input">
                                            <InputGroup.Text id="basic-addon1" className="border-0">
                                                <CiSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Search Candidate or Project Name"
                                                aria-label="Username"
                                                value={search}
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize }); // Reset pagination on search
                                                }}
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                                <JobCandidateTable PageStatus={status} setCandidatesDetials={setCandidatesDetials} filterText={search}
                                    handlePaginationModelChange={handlePaginationModelChange}
                                    paginationModel={paginationModel} />
                            </Tab.Pane>
                        )
                    }

                    {
                        activeTab === 'first' && (
                            <Tab.Pane eventKey="first">
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div className="tbl_hdng">
                                        <h6>{AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.applied} Candidates</h6>
                                    </div>
                                    <div className="d-flex flex-row gap-3">

                                        {
                                            filterData && (
                                                <Tooltip
                                                    title="Clear Filter"
                                                    arrow
                                                    placement="top"
                                                    componentsProps={getTooltipStyle('#c62828')} // Red
                                                >
                                                    <IconButton
                                                        onClick={handleResetFilter}
                                                        size="small"
                                                        sx={{
                                                            ...commonIconButtonStyle,
                                                            backgroundColor: 'rgba(198, 40, 40, 0.08)',
                                                            '&:hover': { backgroundColor: 'rgba(198, 40, 40, 0.15)' }
                                                        }}
                                                    >
                                                        <FiXCircle style={{ color: '#c62828' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }



                                        {/* give me here filter icons with tooltips  */}
                                        <Tooltip
                                            title="Apply Filter"
                                            arrow
                                            placement="top"
                                            componentsProps={getTooltipStyle('#1565c0')} // Blue
                                        >
                                            <IconButton
                                                onClick={() => setShowFilterModal(true)}
                                                size="small"
                                                sx={{
                                                    ...commonIconButtonStyle,
                                                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                                    '&:hover': { backgroundColor: 'rgba(21, 101, 192, 0.15)' }
                                                }}
                                            >
                                                <FiFilter style={{ color: '#1565c0' }} />
                                            </IconButton>
                                        </Tooltip>

                                        <MuiButton
                                            variant="outlined"
                                            onClick={handleExportToExcel}
                                            disabled={downloading}
                                            sx={{
                                                borderColor: '#34209b',
                                                color: '#34209b',
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                position: 'relative',
                                                '&:hover': {
                                                    borderColor: '#34209b',
                                                    backgroundColor: 'rgba(52, 32, 155, 0.08)',
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {downloading ? (
                                                <>
                                                    <FileDownloadIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'inherit',
                                                            animation: 'moveDown 1s infinite',
                                                            '@keyframes moveDown': {
                                                                '0%': {
                                                                    transform: 'translateY(-5px)',
                                                                    opacity: 0
                                                                },
                                                                '50%': {
                                                                    transform: 'translateY(0)',
                                                                    opacity: 1
                                                                },
                                                                '100%': {
                                                                    transform: 'translateY(5px)',
                                                                    opacity: 0
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <FileDownloadIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: 'inherit',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </MuiButton>

                                        <InputGroup className="searchy-input">
                                            <InputGroup.Text id="basic-addon1" className="border-0">
                                                <CiSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Search Candidate"
                                                aria-label="Username"
                                                value={search}
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize }); // Reset pagination on search
                                                }}
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-start bulkaction_btn mb-3">
                                    <div className="d-flex flex-row gap-3 me-2">
                                        <AsyncCreatableSelect
                                            isClearable
                                            defaultOptions={options}
                                            value={batchId}
                                            loadOptions={loadOptions}
                                            onChange={(newValue) => setBatchId(newValue)}
                                            onCreateOption={handleCreateOption}
                                            placeholder="Select or create..."
                                            onMenuOpen={handleMenuOpen}
                                            formatCreateLabel={formatCreateLabel}
                                            styles={customStyles}
                                        />
                                    </div>
                                    <Form.Select aria-label="Default select example" onChange={handleBulkSortListed}>
                                        <option value={null}>Bulk Action</option>
                                        <option value="Shortlisted">Shortlist</option>
                                    </Form.Select>
                                </div>
                                <JobCandidateTable
                                    PageStatus={status}
                                    setCandidatesDetials={setCandidatesDetials}
                                    filterText={search}
                                    handlePaginationModelChange={handlePaginationModelChange}
                                    paginationModel={paginationModel}
                                />
                            </Tab.Pane>
                        )
                    }

                    {
                        activeTab === 'second' && (
                            <Tab.Pane eventKey="second">
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div className="tbl_hdng">
                                        <h6>{AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.shortlist} Candidates</h6>
                                    </div>
                                    <div className="d-flex flex-row gap-3">

                                        {/* reset applied Filter */}

                                        {
                                            filterData && (
                                                <Tooltip
                                                    title="Clear Filter"
                                                    arrow
                                                    placement="top"
                                                    componentsProps={getTooltipStyle('#c62828')} // Red
                                                >
                                                    <IconButton
                                                        onClick={handleResetFilter}
                                                        size="small"
                                                        sx={{
                                                            ...commonIconButtonStyle,
                                                            backgroundColor: 'rgba(198, 40, 40, 0.08)',
                                                            '&:hover': { backgroundColor: 'rgba(198, 40, 40, 0.15)' }
                                                        }}
                                                    >
                                                        <FiXCircle style={{ color: '#c62828' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }

                                        {/* give me here filter icons with tooltips  */}
                                        <Tooltip
                                            title="Apply Filter"
                                            arrow
                                            placement="top"
                                            componentsProps={getTooltipStyle('#1565c0')} // Blue
                                        >
                                            <IconButton
                                                onClick={() => setShowFilterModal(true)}
                                                size="small"
                                                sx={{
                                                    ...commonIconButtonStyle,
                                                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                                    '&:hover': { backgroundColor: 'rgba(21, 101, 192, 0.15)' }
                                                }}
                                            >
                                                <FiFilter style={{ color: '#1565c0' }} />
                                            </IconButton>
                                        </Tooltip>

                                        {/* Downloads Candidate Details */}

                                        <MuiButton
                                            variant="outlined"
                                            onClick={handleExportToExcel}
                                            disabled={downloading}
                                            sx={{
                                                borderColor: '#34209b',
                                                color: '#34209b',
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                position: 'relative',
                                                '&:hover': {
                                                    borderColor: '#34209b',
                                                    backgroundColor: 'rgba(52, 32, 155, 0.08)',
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {downloading ? (
                                                <>
                                                    <FileDownloadIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'inherit',
                                                            animation: 'moveDown 1s infinite',
                                                            '@keyframes moveDown': {
                                                                '0%': {
                                                                    transform: 'translateY(-5px)',
                                                                    opacity: 0
                                                                },
                                                                '50%': {
                                                                    transform: 'translateY(0)',
                                                                    opacity: 1
                                                                },
                                                                '100%': {
                                                                    transform: 'translateY(5px)',
                                                                    opacity: 0
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <FileDownloadIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: 'inherit',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </MuiButton>

                                        <InputGroup className="searchy-input">
                                            <InputGroup.Text id="basic-addon1" className="border-0">
                                                <CiSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Search Candidate"
                                                aria-label="Username"
                                                value={search}
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize }); // Reset pagination on search
                                                }}
                                            />
                                        </InputGroup>

                                    </div>
                                </div>
                                <div className="d-flex justify-content-start bulkaction_btn mb-3">
                                    <Form.Select aria-label="Default select example" value={bulkSchedule} onChange={ScheduleBulkInterview}>
                                        <option value={null}>Bulk Action</option>
                                        <option value="interview">Schedule Bulk Interview</option>
                                    </Form.Select>
                                </div>
                                <JobCandidateTable
                                    PageStatus={status}
                                    setCandidatesDetials={setCandidatesDetials}
                                    filterText={search}
                                    handlePaginationModelChange={handlePaginationModelChange}
                                    paginationModel={paginationModel}
                                />
                            </Tab.Pane>
                        )
                    }

                    {
                        activeTab === 'third' && (
                            <Tab.Pane eventKey="third">
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div className="d-flex gap-4">
                                        <h5 className="m-0">
                                            <span className="text-nowrap">
                                                {AppliedCandidateListCount.status === 'success' &&
                                                    AppliedCandidateListCount.data?.interviewed}{' '}
                                                Candidates
                                            </span>
                                        </h5>
                                        <MuiButton
                                            variant="contained"
                                            color="success" // Set the button color to 'success'
                                            startIcon={<ApprovalIcon />}
                                            onClick={() => handleBulkMarkAsSelectedOrWait()}
                                            disabled={CandidatesDetials.length === 0}
                                        >
                                            Approval Note
                                        </MuiButton>
                                    </div>
                                    <div className="d-flex flex-row gap-3">
                                        {
                                            filterData && (
                                                <Tooltip
                                                    title="Clear Filter"
                                                    arrow
                                                    placement="top"
                                                    componentsProps={getTooltipStyle('#c62828')} // Red
                                                >
                                                    <IconButton
                                                        onClick={handleResetFilter}
                                                        size="small"
                                                        sx={{
                                                            ...commonIconButtonStyle,
                                                            backgroundColor: 'rgba(198, 40, 40, 0.08)',
                                                            '&:hover': { backgroundColor: 'rgba(198, 40, 40, 0.15)' }
                                                        }}
                                                    >
                                                        <FiXCircle style={{ color: '#c62828' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }

                                        {/* give me here filter icons with tooltips  */}
                                        <Tooltip
                                            title="Apply Filter"
                                            arrow
                                            placement="top"
                                            componentsProps={getTooltipStyle('#1565c0')} // Blue
                                        >
                                            <IconButton
                                                onClick={() => setShowFilterModal(true)}
                                                size="small"
                                                sx={{
                                                    ...commonIconButtonStyle,
                                                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                                    '&:hover': { backgroundColor: 'rgba(21, 101, 192, 0.15)' }
                                                }}
                                            >
                                                <FiFilter style={{ color: '#1565c0' }} />
                                            </IconButton>
                                        </Tooltip>

                                        <MuiButton
                                            variant="outlined"
                                            onClick={handleExportToExcel}
                                            disabled={downloading}
                                            sx={{
                                                borderColor: '#34209b',
                                                color: '#34209b',
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                position: 'relative', // Add this
                                                '&:hover': {
                                                    borderColor: '#34209b',
                                                    backgroundColor: 'rgba(52, 32, 155, 0.08)',
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {downloading ? (
                                                <>
                                                    <FileDownloadIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'inherit',
                                                            animation: 'moveDown 1s infinite',
                                                            '@keyframes moveDown': {
                                                                '0%': {
                                                                    transform: 'translateY(-5px)',
                                                                    opacity: 0
                                                                },
                                                                '50%': {
                                                                    transform: 'translateY(0)',
                                                                    opacity: 1
                                                                },
                                                                '100%': {
                                                                    transform: 'translateY(5px)',
                                                                    opacity: 0
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <FileDownloadIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: 'inherit',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </MuiButton>

                                        {/* Here Search Feature To be Added By changes --- */}
                                        {/* <div> */}
                                        <AsyncPaginate
                                            placeholder="Select Interviewer Name"
                                            value={filterInterview}
                                            loadOptions={EmployeeListDropDownPagination}
                                            onChange={(option) => setFilterInterview(option)}
                                            debounceTimeout={300}
                                            isClearable
                                            styles={customStylesForEmp}
                                            additional={{
                                                page: 1
                                            }}
                                            classNamePrefix="react-select"
                                        />
                                        {/* </div> */}

                                        <InputGroup className="searchy-input" style={{ minWidth: '250px' }}>
                                            <InputGroup.Text id="basic-addon1" className="border-0">
                                                <CiSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Search Candidate"
                                                aria-label="Username"
                                                value={search}
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize }); // Reset pagination on search
                                                }}
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                                <InterviewTable PageStatus={status} filterText={search} setCandidatesDetials={setCandidatesDetials} />
                            </Tab.Pane>
                        )
                    }

                    {
                        activeTab === 'approval' && (

                            <Tab.Pane eventKey="approval">
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div className="d-flex gap-4">
                                        <h5 className="m-0">
                                            <span className="text-nowrap">
                                                {AppliedCandidateListCount.status === 'success' &&
                                                    AppliedCandidateListCount.data?.approval_note} {" "}
                                                Approval Note
                                            </span>
                                        </h5>
                                    </div>
                                    <div className="d-flex flex-row gap-3">
                                        <InputGroup className="searchy-input">
                                            <InputGroup.Text id="basic-addon1" className="border-0">
                                                <CiSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Search Approval Note"
                                                aria-label="Username"
                                                value={searchApprovalNode}
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => {
                                                    setSearchApprovalNode(e.target.value);
                                                    setPaginationApprovalModel({
                                                        ...paginationModelApproval,
                                                        page: 0
                                                    });
                                                }}
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                                <ApprovalTable
                                    approvalNotes={approvalNotes}
                                    setMember={setMember}
                                    setOpenMemberList={setOpenMemberList}
                                    setListApproval={setListApproval}
                                    getApprovalListByJobId={getApprovalListByJobId}
                                    handlePaginationModelChange={handlePaginationApprovalModelChange}
                                    paginationModel={paginationModelApproval}
                                    approvalNoteLoading={approvalNoteLoading}
                                />
                            </Tab.Pane>
                        )
                    }

                    {
                        activeTab === 'four' && (
                            <Tab.Pane eventKey="four">
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div className="tbl_hdng">
                                        <h6>{AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.offered} Candidates</h6>
                                    </div>
                                    <div className="d-flex flex-row gap-3">
                                        {
                                            filterData && (
                                                <Tooltip
                                                    title="Clear Filter"
                                                    arrow
                                                    placement="top"
                                                    componentsProps={getTooltipStyle('#c62828')} // Red
                                                >
                                                    <IconButton
                                                        onClick={handleResetFilter}
                                                        size="small"
                                                        sx={{
                                                            ...commonIconButtonStyle,
                                                            backgroundColor: 'rgba(198, 40, 40, 0.08)',
                                                            '&:hover': { backgroundColor: 'rgba(198, 40, 40, 0.15)' }
                                                        }}
                                                    >
                                                        <FiXCircle style={{ color: '#c62828' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }

                                        {/* give me here filter icons with tooltips  */}
                                        <Tooltip
                                            title="Apply Filter"
                                            arrow
                                            placement="top"
                                            componentsProps={getTooltipStyle('#1565c0')} // Blue
                                        >
                                            <IconButton
                                                onClick={() => setShowFilterModal(true)}
                                                size="small"
                                                sx={{
                                                    ...commonIconButtonStyle,
                                                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                                    '&:hover': { backgroundColor: 'rgba(21, 101, 192, 0.15)' }
                                                }}
                                            >
                                                <FiFilter style={{ color: '#1565c0' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <MuiButton
                                            variant="outlined"
                                            onClick={handleExportToExcel}
                                            disabled={downloading}
                                            sx={{
                                                borderColor: '#34209b',
                                                color: '#34209b',
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                position: 'relative', // Add this
                                                '&:hover': {
                                                    borderColor: '#34209b',
                                                    backgroundColor: 'rgba(52, 32, 155, 0.08)',
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {downloading ? (
                                                <>
                                                    <FileDownloadIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'inherit',
                                                            animation: 'moveDown 1s infinite',
                                                            '@keyframes moveDown': {
                                                                '0%': {
                                                                    transform: 'translateY(-5px)',
                                                                    opacity: 0
                                                                },
                                                                '50%': {
                                                                    transform: 'translateY(0)',
                                                                    opacity: 1
                                                                },
                                                                '100%': {
                                                                    transform: 'translateY(5px)',
                                                                    opacity: 0
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <FileDownloadIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: 'inherit',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </MuiButton>

                                        <InputGroup className="searchy-input">
                                            <InputGroup.Text id="basic-addon1" className="border-0">
                                                <CiSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Search Candidate"
                                                aria-label="Username"
                                                value={search}
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize }); // Reset pagination on search
                                                }}
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                                <Offer_table
                                    PageStatus={status}
                                    setCandidatesDetials={setCandidatesDetials}
                                    filterText={search}
                                    handlePaginationModelChange={handlePaginationModelChange}
                                    paginationModel={paginationModel}
                                />
                            </Tab.Pane>
                        )
                    }

                    {
                        activeTab === 'five' && (
                            <Tab.Pane eventKey="five">
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div className="tbl_hdng">
                                        <h6>{AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.hired} Candidates</h6>
                                    </div>
                                    <div className="d-flex flex-row gap-3">
                                        {
                                            filterData && (
                                                <Tooltip
                                                    title="Clear Filter"
                                                    arrow
                                                    placement="top"
                                                    componentsProps={getTooltipStyle('#c62828')} // Red
                                                >
                                                    <IconButton
                                                        onClick={handleResetFilter}
                                                        size="small"
                                                        sx={{
                                                            ...commonIconButtonStyle,
                                                            backgroundColor: 'rgba(198, 40, 40, 0.08)',
                                                            '&:hover': { backgroundColor: 'rgba(198, 40, 40, 0.15)' }
                                                        }}
                                                    >
                                                        <FiXCircle style={{ color: '#c62828' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }

                                        {/* give me here filter icons with tooltips  */}
                                        <Tooltip
                                            title="Apply Filter"
                                            arrow
                                            placement="top"
                                            componentsProps={getTooltipStyle('#1565c0')} // Blue
                                        >
                                            <IconButton
                                                onClick={() => setShowFilterModal(true)}
                                                size="small"
                                                sx={{
                                                    ...commonIconButtonStyle,
                                                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                                    '&:hover': { backgroundColor: 'rgba(21, 101, 192, 0.15)' }
                                                }}
                                            >
                                                <FiFilter style={{ color: '#1565c0' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <MuiButton
                                            variant="outlined"
                                            onClick={handleExportToExcel}
                                            disabled={downloading}
                                            sx={{
                                                borderColor: '#34209b',
                                                color: '#34209b',
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                position: 'relative', // Add this
                                                '&:hover': {
                                                    borderColor: '#34209b',
                                                    backgroundColor: 'rgba(52, 32, 155, 0.08)',
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {downloading ? (
                                                <>
                                                    <FileDownloadIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'inherit',
                                                            animation: 'moveDown 1s infinite',
                                                            '@keyframes moveDown': {
                                                                '0%': {
                                                                    transform: 'translateY(-5px)',
                                                                    opacity: 0
                                                                },
                                                                '50%': {
                                                                    transform: 'translateY(0)',
                                                                    opacity: 1
                                                                },
                                                                '100%': {
                                                                    transform: 'translateY(5px)',
                                                                    opacity: 0
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <FileDownloadIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: 'inherit',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </MuiButton>

                                        <InputGroup className="searchy-input">
                                            <InputGroup.Text id="basic-addon1" className="border-0">
                                                <CiSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Search Candidate"
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                value={search}
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize }); // Reset pagination on search
                                                }}
                                            />
                                        </InputGroup>

                                    </div>
                                </div>

                                <Offer_table
                                    PageStatus={status}
                                    setCandidatesDetials={setCandidatesDetials}
                                    filterText={search}
                                    handlePaginationModelChange={handlePaginationModelChange}
                                    paginationModel={paginationModel}
                                />

                            </Tab.Pane>
                        )
                    }

                    {
                        activeTab === 'six' && (
                            <Tab.Pane eventKey="six">
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <div className="tbl_hdng">
                                        <h6>{AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.rejected} Candidates</h6>
                                    </div>
                                    <div className="d-flex flex-row gap-3">
                                        {
                                            filterData && (
                                                <Tooltip
                                                    title="Clear Filter"
                                                    arrow
                                                    placement="top"
                                                    componentsProps={getTooltipStyle('#c62828')} // Red
                                                >
                                                    <IconButton
                                                        onClick={handleResetFilter}
                                                        size="small"
                                                        sx={{
                                                            ...commonIconButtonStyle,
                                                            backgroundColor: 'rgba(198, 40, 40, 0.08)',
                                                            '&:hover': { backgroundColor: 'rgba(198, 40, 40, 0.15)' }
                                                        }}
                                                    >
                                                        <FiXCircle style={{ color: '#c62828' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }

                                        {/* give me here filter icons with tooltips  */}
                                        <Tooltip
                                            title="Apply Filter"
                                            arrow
                                            placement="top"
                                            componentsProps={getTooltipStyle('#1565c0')} // Blue
                                        >
                                            <IconButton
                                                onClick={() => setShowFilterModal(true)}
                                                size="small"
                                                sx={{
                                                    ...commonIconButtonStyle,
                                                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                                                    '&:hover': { backgroundColor: 'rgba(21, 101, 192, 0.15)' }
                                                }}
                                            >
                                                <FiFilter style={{ color: '#1565c0' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <MuiButton
                                            variant="outlined"
                                            onClick={handleExportToExcel}
                                            disabled={downloading}
                                            sx={{
                                                borderColor: '#34209b',
                                                color: '#34209b',
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                position: 'relative', // Add this
                                                '&:hover': {
                                                    borderColor: '#34209b',
                                                    backgroundColor: 'rgba(52, 32, 155, 0.08)',
                                                },
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {downloading ? (
                                                <>
                                                    <FileDownloadIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'inherit',
                                                            animation: 'moveDown 1s infinite',
                                                            '@keyframes moveDown': {
                                                                '0%': {
                                                                    transform: 'translateY(-5px)',
                                                                    opacity: 0
                                                                },
                                                                '50%': {
                                                                    transform: 'translateY(0)',
                                                                    opacity: 1
                                                                },
                                                                '100%': {
                                                                    transform: 'translateY(5px)',
                                                                    opacity: 0
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <FileDownloadIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: 'inherit',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </MuiButton>

                                        <InputGroup className="searchy-input">
                                            <InputGroup.Text id="basic-addon1" className="border-0">
                                                <CiSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Search Candidate"
                                                aria-label="Username"
                                                value={search}
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize }); // Reset pagination on search
                                                }}
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                                <Offer_table
                                    PageStatus={status}
                                    setCandidatesDetials={setCandidatesDetials}
                                    filterText={search}
                                    handlePaginationModelChange={handlePaginationModelChange}
                                    paginationModel={paginationModel}
                                />
                            </Tab.Pane>
                        )
                    }
                </Tab.Content>
            </Tab.Container>


            {/* Show the Add Batch Id Models here */}
            {/* Modal for adding a batch */}
            {/* Modal for adding a batch */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Batch ID</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Input for Batch ID */}
                        <Form.Group controlId="batchId">
                            <Form.Label>Batch ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={BatchId}
                                onChange={(e) => setNewBatchId(e.target.value)}
                                placeholder="Enter Batch ID"
                            />
                        </Form.Group>

                        {/* Checkbox for Status */}
                        <Form.Group controlId="batchStatus" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="Active"
                                checked={isActive}
                                readOnly
                            />
                            <Form.Text className="text-muted">
                                Uncheck to set as Inactive.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {
                        loading ?
                            <Button variant="primary">
                                <Spinner animation="border" variant="primary" />
                            </Button>
                            :
                            <Button variant="primary" onClick={handleAddBatchId}>
                                Add Batch ID
                            </Button>
                    }
                </Modal.Footer>
            </Modal>

            {/* setOpen Member List to send Email and Update the Existing member with Modla - */}
            <ApprovalModalApprovalCandidate open={openMemberList} setOpen={setOpenMemberList} memberListData={memberData} approvalNotes={approvalNotes} />
            <AppliedFilterModal
                show={showFilterModal}
                onHide={() => setShowFilterModal(false)}
                onApplyFilter={handleApplyFilter}
                onResetFilter={handleResetFilter}
            />
        </>
    )
}

