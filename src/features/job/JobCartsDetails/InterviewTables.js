import React, { memo, useCallback, useEffect, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { useSelector } from 'react-redux';
import moment from 'moment';
import { BsEye } from "react-icons/bs";
import { RiFeedbackLine } from "react-icons/ri";
import { Button, InputGroup, OverlayTrigger, Table } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FaRegClock } from 'react-icons/fa';
import { FaRegThumbsUp } from "react-icons/fa";
import axios from "axios";
import { apiHeaderToken } from "../../../config/api_header";
import { toast } from "react-toastify";
import config from "../../../config/config";
import { FetchAppliedCandidateDetailsCount, FetchAppliedCandidateDetailsCountPagination, FetchAppliedCandidateDetailsWithServerPagination } from '../../slices/AppliedJobCandidates/JobAppliedCandidateSlice';
import { DeleteAndRemoved } from '../../slices/JobSortLIstedSlice/SortLIstedSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaFileContract } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModel';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { CiCircleRemove } from 'react-icons/ci';
import Select from 'react-select';
import { debounce } from 'lodash';
import { IconButton } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

// import { FetchCandidatesListById } from '../../slices/AppliedJobCandidates/JobAppliedCandidateSlice';


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

// Input validation function
const validateInput = (value, type) => {
    if (type === 'workingDays') {
        if (value.length > 3) {
            return { isValid: false, message: 'Working days should not exceed 3 digits' };
        }
        if (!/^\d+$/.test(value)) {
            return { isValid: false, message: 'Working days should be a number' };
        }
    }
    return { isValid: true, message: '' };
};

function InterviewTable({ PageStatus, filterText, setCandidatesDetials }) {
    const [visible, setVisible] = useState(false);
    const filterJobDetails = useSelector((state) => state.appliedJobList.selectedJobList);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [selectedData, setSelectedData] = useState(null);
    const [HoverId, setHover] = useState(1);
    const [RecommendationData, SetRecommendationData] = useState(null);
    const [offerModel, setOfferModel] = useState(false);
    const [offerData, setOfferData] = useState(null);
    const [offerDate, setOfferDate] = useState(null);
    const [offerValidDate, setOfferValidDate] = useState(null);
    const [offerDesignation, setOfferDesignation] = useState('');
    const [offerCTC, setOfferCTC] = useState('');
    const getUserDetails = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};
    const [showOther, setShowOther] = useState(false);
    const [showApprovalNote, setShowApprovalNote] = useState(false);
    const [approvalNotesData, setApprovalNOtesData] = useState(null);
    // handle recommendation models
    const [showRecommendation, setRecommendation] = useState(false);
    const [jobStatus, setJobStatus] = useState('');
    const [recommendation, CommentRecommendation] = useState('');

    // confirmation models
    const [confirm, setConfirm] = useState(false);
    const [option, setOption] = useState(null);
    const [pen, setPen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null)
    const [addPeriority, setAddPriority] = useState('')
    const [offerApproveMember, setMember] = useState(null)
    const [loadingApproval, setLodingApproval] = useState(false);
    const [offerAmount, setOfferAmount] = useState(false);
    const [openRatingModal, setOpenRatingModal] = useState(false);
    const [employeement_type, setEmployeement_type] = useState("");
    const [jobLocation, setJobLocation] = useState(null);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [paytype, setPaytype] = useState('')
    const [esci, setESCI] = useState('No')
    const navigation = useNavigate();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const AppliedCandidateServer = useSelector((state) => state.appliedJobList.AppliedCandidateServer)
    const totalCount = useSelector((state) => state.appliedJobList.AppliedCandidateServerPagination);
    const [QueryParams] = useSearchParams();
    const type = QueryParams.get('type');
    const [working_days, setWorking_days] = useState("0")

    // setOffer Status ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [OfferAmountStatus, setOfferAmountStatus] = useState("")


    useEffect(() => {
        let payloads = {
            id: id || filterJobDetails?.value || "",
            form_status: PageStatus,
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            keyword: filterText || '',
        };
        dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
    }, [PageStatus, paginationModel, filterText, id, filterJobDetails, dispatch]);

    useEffect(() => {
        let payloads = {
            id: id || filterJobDetails?.value || "",
            form_status: PageStatus,
            keyword: filterText || '',
        };
        dispatch(FetchAppliedCandidateDetailsCountPagination(payloads));
    }, [PageStatus, filterText, id, filterJobDetails, dispatch]);

    // handle pagination model change
    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    // close the recommendation dropdown
    const handleRecommendationClose = () => setRecommendation(false);
    // handle close confirmation
    const handleConfirmClose = () => {
        setConfirm(false)
    };

    const handleSaveConfirmation = () => {

        if (option) {
            let payloads = {
                "candidate_id": option?.candidateInfo.candidate_id,
                "applied_job_id": option?.candidateInfo.applied_job_id,
                "status": "Rejected"
            }
            dispatch(DeleteAndRemoved(payloads))
                .unwrap()
                .then((response) => {
                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };
                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }))
                    setConfirm(false)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    /**
     * @description show the Rating Modal - 
     * @param {*} e 
     * @param {*} data 
     */

    const OpenShowFeedBackModal = (e, data) => {
        e.preventDefault();
        setSelectedData(data);
        setOpenRatingModal(true);
    };

    const filterJobsByPageStatus = (jobs) => {
        return jobs.filter((job) => {
            return job
        });
    };

    const mapJobToRow = (job, index) => {
        const appliedJob = job?.applied_jobs?.find((item) => item?.job_id === (id || filterJobDetails?.value || job?.job_id)) || {};
        const formattedInterviewers = appliedJob?.interviewer?.slice(0, 2).map((interviewer) => interviewer?.employee_name).join(', ') || '';
        return {
            id: index + 1 + paginationModel.page * paginationModel.pageSize,
            candidateInfo: {
                // name: job?.name?.length > 25 ? job?.name?.slice(0, 25) + '...' : job?.name,
                name: job?.name,
                id: job._id,
                status: job?.interview_shortlist_status ? job?.interview_shortlist_status : 'N/A',
                recommendation: appliedJob?.recommendation || 'N/A',
                candidate_id: job._id,
                applied_job_id: appliedJob?._id || 'N/A'
            },
            value: job,
            interviewerInfo: {
                interviewers: formattedInterviewers
            },
            interviewSelectStatus: job?.interview_shortlist_status || null,
            feedBack: {
                data: []
            },
            "Interview Date": appliedJob?.interview_date ? moment(appliedJob.interview_date).format("DD/MM/YYYY") : 'N/A',
            // "Interviewer": (appliedJob?.interviewer?.map((interviewer) => interviewer?.employee_name).join(', ') || '').slice(0, 15) + '....',
            "Interviewer": appliedJob?.interviewer,
            "Round": appliedJob?.stage || 'N/A',
            "Rating": job?.profile_avg_rating ?? 0,
            "Notice Period": job.notice_period || 'N/A',
            "project_name": job?.project_name || 'N/A',
        };
    };

    /**
     * @description This Function is change the Status of Job Profile -:
     */

    const haringStatus = (e, data, status) => {
        e.preventDefault();
        let paylods = {
            "candidate_id": data?._id,
            "applied_job_id": data?.applied_jobs?.find((item) => item?.job_id === (id || filterJobDetails?.value || data?.job_id))?._id,
            "hiring_status": status,
            "add_by_name": getUserDetails?.name,
            "add_by_mobile": getUserDetails?.mobile_no,
            "add_by_designation": getUserDetails?.designation,
            "add_by_email": getUserDetails?.email
        }

        axios.post(`${config.API_URL}updateHireStatus`, paylods, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };
                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }))
                    return toast.success(response.data.message)
                }
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }

    const rows = AppliedCandidateServer.status === 'success' && AppliedCandidateServer.data.length !== 0
        ? filterJobsByPageStatus(AppliedCandidateServer.data, PageStatus).map(mapJobToRow)
        : [];

    const handleNavigationOnProfile = (e, url) => {

        if (!id && !filterJobDetails) {
            return toast.warn('Please Select the Job')
        }

        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            window.open(url, "_blank", "noopener,noreferrer");
        } else {
            navigation(url)
        }
    }


    const commonIconButtonStyle = {
        width: '28px',
        height: '28px',
        padding: '6px',
        borderRadius: '6px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-2px)',
        }
    }

    const columns = [
        { field: "id", headerName: "Sno.", width: 50 },
        {
            field: 'Action',
            headerName: 'Action',
            width: 140, // Increased width to accommodate all icons
            renderCell: (params) => (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '3px',
                    padding: '6px',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Feedback Icon */}
                    <Tooltip
                        title="Feedback"
                        arrow
                        placement="bottom"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: '#1976d2',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    '& .MuiTooltip-arrow': {
                                        color: '#1976d2',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            onClick={() => window.location.href = `/candidate-profile/${params.row?.candidateInfo?.id}`}
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                }
                            }}
                        >
                            <RiFeedbackLine style={{ color: '#1976d2' }} />
                        </IconButton>
                    </Tooltip>

                    {/* Recommendation Icon */}
                    <Tooltip
                        title="Recommendation"
                        arrow
                        placement="bottom"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: '#2e7d32',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    '& .MuiTooltip-arrow': {
                                        color: '#2e7d32',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            onClick={(e) => handleRecomtationModel(e, params.row)}
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(46, 125, 50, 0.15)',
                                }
                            }}
                        >
                            <FaRegThumbsUp style={{ color: '#2e7d32' }} />
                        </IconButton>
                    </Tooltip>

                    {/* Set Offer Amount Icon */}
                    <Tooltip
                        title="Set Offer Amount"
                        arrow
                        placement="bottom"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: '#9c27b0',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    '& .MuiTooltip-arrow': {
                                        color: '#9c27b0',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            onClick={(e) => SendOfferAmountForApproval(e, params?.row?.value)}
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(156, 39, 176, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(156, 39, 176, 0.15)',
                                }
                            }}
                        >
                            <FaFileContract style={{ color: '#9c27b0' }} />
                        </IconButton>
                    </Tooltip>

                    {/* Offer Send/Approval Note Icon - Only show if PageStatus is 'approval' */}
                    {['approval'].includes(PageStatus) && (
                        <Tooltip
                            title={params?.row?.value?.applied_jobs?.some(
                                (item) => item.job_id === params?.row?.value?.job_id &&
                                    item.final_job_offer_approval_status === 'No'
                            ) ? "Approval Note" : "Offer Send"}
                            arrow
                            placement="bottom"
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: '#ed6c02',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        '& .MuiTooltip-arrow': {
                                            color: '#ed6c02',
                                        },
                                    },
                                },
                            }}
                        >
                            <IconButton
                                onClick={(e) => {
                                    const isFinalApprovalNo = params?.row?.value?.applied_jobs?.some(
                                        (item) => item.job_id === params?.row?.value?.job_id &&
                                            item.final_job_offer_approval_status === 'No'
                                    );
                                    if (isFinalApprovalNo) {
                                        // handleShowApprovalNotes(e, params?.row?.value)
                                    } else {
                                        handleShowOfferModel(e, params?.row?.value)
                                    }
                                }}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    backgroundColor: 'rgba(237, 108, 2, 0.08)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(237, 108, 2, 0.15)',
                                    }
                                }}
                            >
                                <FaFileContract style={{ color: '#ed6c02' }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Reject Icon */}
                    <Tooltip
                        title="Reject"
                        arrow
                        placement="bottom"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: '#d32f2f',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    '& .MuiTooltip-arrow': {
                                        color: '#d32f2f',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            onClick={(e) => handleReject(e, params.row)}
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                }
                            }}
                        >
                            {/* give me cross buttton */}
                            <FaTimes style={{ color: '#d32f2f' }} />
                            {/* <GrSubtractCircle style={{ color: '#d32f2f' }} /> */}
                        </IconButton>
                    </Tooltip>

                    {!['Approved', 'Hold'].includes(params?.row?.value?.hiring_status) && (
                        <>
                            <Tooltip
                                title="Approve"
                                arrow
                                placement="bottom"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#2e7d32', // Green
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            '& .MuiTooltip-arrow': {
                                                color: '#2e7d32',
                                            },
                                        },
                                    },
                                }}
                            >
                                <IconButton
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                        '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.15)' }
                                    }}
                                    onClick={(e) => haringStatus(e, params?.row?.value, 'Approved')}
                                >
                                    <CheckCircleIcon fontSize='9px' sx={{ color: '#2e7d32' }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title="Hold"
                                arrow
                                placement="bottom"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#ffc107', // Yellow
                                            color: '#333',
                                            fontSize: '0.75rem',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            '& .MuiTooltip-arrow': {
                                                color: '#ffc107',
                                            },
                                        },
                                    },
                                }}
                            >
                                <IconButton
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(255, 193, 7, 0.08)',
                                        '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.15)' }
                                    }}
                                    onClick={(e) => haringStatus(e, params?.row?.value, 'Hold')}
                                >
                                    <PauseCircleIcon sx={{ color: '#ffc107' }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </div>
            )
        },
        {
            field: "candidateName",
            headerName: "Candidate Name",
            width: 160,
            renderCell: (params) => (
                <p style={{ cursor: 'pointer' }} onClick={(e) => handleNavigationOnProfile(e, `/candidate-profile/${params.row?.candidateInfo?.id}?job_id=${id || filterJobDetails?.value}`)} className="color-blue overflow-hidden text-elipses">{params.row?.candidateInfo?.name}</p>
            ),
        },
        {
            field: "Interview Date",
            headerName: "Interview Date",
            width: 140,
        },
        {
            field: "Interviewer",
            headerName: "Interviewer(s)",
            width: 250,
            renderCell: (params) => {
                const raw = params.row?.Interviewer || [];
                // keep only interviewers with a valid name
                const interviewers = raw.filter(i => i && i.employee_name && i.employee_name.trim());

                // If there are no valid interviewers, show "N/A"
                if (interviewers.length === 0) {
                    return (
                        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                            N/A
                        </span>
                    );
                }

                const firstFour = interviewers.slice(0, 4);
                const remaining = interviewers.slice(4);
                const tooltipTitle = remaining.length > 0 ? remaining.map(i => i.employee_name).join(", ") : "";

                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                            whiteSpace: "normal",
                            lineHeight: "18px",
                            padding: "4px 0"
                        }}
                    >
                        {firstFour.map((inter, index) => (
                            <span
                                key={index}
                                style={{
                                    fontSize: "0.85rem",
                                    fontWeight: 500
                                }}
                            >
                                {inter.employee_name}
                            </span>
                        ))}

                        {remaining.length > 0 && (
                            <Tooltip
                                title={tooltipTitle}
                                arrow
                                placement="top"
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: "#34209b",
                                            color: "white",
                                            fontSize: "0.75rem",
                                            padding: "8px 12px",
                                            borderRadius: "4px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                            "& .MuiTooltip-arrow": {
                                                color: "#34209b"
                                            }
                                        }
                                    }
                                }}
                            >
                                <span
                                    style={{
                                        cursor: "pointer",
                                        color: "#34209b",
                                        fontWeight: "bold",
                                        fontSize: "0.85rem"
                                    }}
                                >
                                    +{remaining.length} more
                                </span>
                            </Tooltip>
                        )}
                    </div>
                );
            }
        },
        {
            field: "project_name",
            headerName: "Project Name",
            width: 250,
            // flex: 1,
            renderCell: (params) => {
                const combined = [params.row?.project_name].filter(Boolean).join('');
                return (
                    <div style={{
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        width: '100%',
                        fontSize: 14,
                        lineHeight: 1.5,
                    }}>
                        {combined || <span style={{ color: '#aaa' }}>N/A</span>}
                    </div>
                );
            }
        },
        {
            field: "applied_for",
            headerName: "Applied For",
            width: 250,
            // flex: 1,
            renderCell: (params) => {
                const combined = [params.row?.value?.job_title].filter(Boolean).join('');
                return (
                    <div style={{
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        width: '100%',
                        fontSize: 14,
                        lineHeight: 1.5,
                    }}>
                        {combined || <span style={{ color: '#aaa' }}>N/A</span>}
                    </div>
                );
            }
        },
        {
            field: "Round",
            headerName: "Round",
            type: "number",
            width: 120,
        },
        {
            field: "Rating",
            headerName: "Rating",
            type: "text",
            width: 120,
            renderCell: (params) => {
                return (
                    <>
                        <div className='d-flex gap-4'>
                            <span>{params.row?.Rating ?? 0}</span>
                            {
                                params.row?.Rating > 0 && (
                                    <span onClick={(e) => OpenShowFeedBackModal(e, params?.row?.value)}><BsEye color='green' size={18} /></span>
                                )
                            }
                        </div>
                    </>
                );
            }
        },
        {
            field: "Recommendation",
            headerName: "Recommendation",
            type: "number",
            width: 150,
            renderCell: (params) => (
                <div className="recomd_tag" style={{ cursor: 'pointer' }}>
                    <span className={`recomnded_tag ${(params.row?.candidateInfo?.recommendation) === 'Further Interview' ? 'bg_purple' : (params.row?.candidateInfo?.recommendation) === 'No Hire' ? 'bg_redlt' : 'bg_greenlt'}`}>{params.row?.candidateInfo?.recommendation === '' ? "No Comment added" : params.row?.candidateInfo?.recommendation}</span>
                </div>
            ),
        },
        {
            field: "Status",
            headerName: "Status",
            type: "number",
            width: 130,
            renderCell: (params) => (
                <span className={`${(params.row?.candidateInfo?.status) === 'Rejected' ? 'color-red' : ''}`}>
                    {params.row?.candidateInfo?.status}
                </span>
            ),
        },
        {
            field: "Feedback By",
            headerName: "Feedback By",
            type: "number",
            width: 250,
            renderCell: (params) => (
                <>
                    <div className="feedbackwrap lineBreack">
                        <span>{params.row?.interviewerInfo?.interviewers}</span>
                        <span onMouseEnter={() => {
                            setVisible(true)
                            setHover(params.row?.id)
                        }} onMouseLeave={() => setVisible(false)}><FaInfoCircle /></span>
                    </div>
                    <div className="tooltip-containerr lineBreack">
                        {(visible && (params.row?.id) === HoverId) &&
                            <div className="tooltipp lineBreack">
                                {/* <p>{params.row?.interviewerInfo?.Interviewer_1 + params.row?.feedBack?.comment_1 + params.row?.interviewerInfo?.Interviewer_2 + params.row?.feedBack?.comment_2}</p> */}
                                <p>
                                    {/* <span>Arun: “Interpersonal skill are great. Technically sound.”</span>
                                    <span>Sameer: “Matching the skill sets we required. Considering for CEO round”</span> */}
                                    {
                                        params.row?.value?.applied_jobs?.find((item) => item?.job_id === (id || filterJobDetails?.value))?.interviewer
                                            ?.filter((interviewer) => interviewer?.feedback_status === 'Approved') // Filter approved feedback
                                            ?.slice(0, 2) // Limit to the first two records
                                            ?.map((interviewer) => (
                                                <span key={interviewer?.employee_name}>
                                                    {interviewer?.employee_name}: "{interviewer?.comment}"
                                                </span>
                                            ))
                                    }

                                </p>
                            </div>}
                    </div>
                </>
            ),
        },
        // {
        //     field: "Hiring Status",
        //     headerName: "Hiring Status",
        //     type: "text",
        //     width: 130,
        //     renderCell: (params) => {
        //         return (
        //             <>

        //                 {!['Approved', 'Hold'].includes(params?.row?.value?.hiring_status) &&
        //                     <>
        //                         <span
        //                             className='offerbtn'
        //                             onClick={(e) => {
        //                                 haringStatus(e, params?.row?.value, 'Approved');
        //                             }}
        //                         >
        //                             Approve
        //                         </span>

        //                         <span
        //                             className='offerbtn ms-2'
        //                             onClick={(e) => {
        //                                 haringStatus(e, params?.row?.value, 'Hold');
        //                             }}
        //                         >
        //                             Hold
        //                         </span>
        //                     </>

        //                 }
        //             </>
        //         )
        //     }
        // },
    ];

    /**
     * @description Send Offer Amount For Approval - Modal Open Action Perform
     * @param {*} e 
     * @param {*} data 
     */
    const SendOfferAmountForApproval = (e, data) => {

        if (!id && !filterJobDetails) {
            return toast.warn('Please Select the Job');
        }
        setOfferAmount(true);
        setApprovalNOtesData(data)
        setOfferDesignation(data?.designation)
        setOfferCTC(data?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?.offer_ctc || "")
        setOfferDate(
            moment(data?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?.onboard_date).format('YYYY-MM-DD') || ""
        );
        setOfferValidDate(
            moment(data?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?.job_valid_till).format('YYYY-MM-DD') || ""
        );
        setOfferAmountStatus(data?.interview_shortlist_status || "")
        setEmployeement_type(data?.job_type)
        setSelectedLocationId({ label: data?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?.proposed_location || "", value: data?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?.proposed_location_id || "" })
        getJobDetialsById(data?.job_id)
        setESCI(data?.esic_status)
        setPaytype(data?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?.payment_type || "annum")
        setWorking_days(data?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?.working_days || "0")
    }

    /**
     * @description Get Job Details By Id
     * @param {*} jonId 
     */
    const getJobDetialsById = async (jonId) => {

        try {
            let Payloads = {
                _id: jonId,
                scope_fields: ["location"]
            }
            let response = await axios.post(`${config.API_URL}getJobById`, Payloads, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setJobLocation(response?.data?.data);
            }

        } catch (error) {

            console.log(error.message)

        }

    }

    /**
     * @description Send Offer Amout For Approval - Modal Close Action Perform
     * @returns closed the Modal 
     */
    const handleClose = () => setOfferAmount(false);
    /**
     * @description handleRecomtationModel - Modal Open Action Perform
     * @param {*} e 
     * @param {*} data 
     */
    const handleRecomtationModel = (e, data) => {
        e.preventDefault();
        setRecommendation(true)
        SetRecommendationData(data)
    }

    const handleReject = (e, data) => {
        setConfirm(true);
        e.preventDefault();
        setOption(data)
    }
    // handleSubmit recommendation
    const hanldeSubmitRecommendation = (e) => {
        if (!id && !filterJobDetails) {
            return toast.warn('Please Select the Job');
        }
        e.preventDefault()
        let payloads = {
            "candidate_id": RecommendationData?.value?._id,
            "applied_job_id": RecommendationData?.value?.applied_jobs?.find((item) => item?.job_id === (id || filterJobDetails?.value))?._id,
            "recommendation": recommendation,
            "interview_status": jobStatus
        }
        axios.post(`${config.API_URL}saveRecommendationStatus`, payloads, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                    setJobStatus('');
                    CommentRecommendation('')
                    handleRecommendationClose();
                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };
                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }))

                }
            })
            .catch((err) => {
                toast.error(err.response.data.message)
            })
    }


    // handle show the offer later models
    const handleShowOfferModel = (e, data) => {
        e.preventDefault();
        setOfferModel(true);
        setOfferData(data)
        setOfferDesignation(data?.designation)
        setOfferCTC()
        setOfferCTC(data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.offer_ctc || "")
        setOfferDate(
            moment(data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.onboard_date).format('YYYY-MM-DD') || ""
        );
        setOfferValidDate(
            moment(data?.applied_jobs?.filter((item) => item.job_id === data?.job_id)[0]?.job_valid_till).format('YYYY-MM-DD') || ""
        );
    }

    const [docId, setDocId] = useState(null);

    const handleCloseOfferModels = () => setOfferModel(false);

    /**
     * @description Handle Close Approval Modal --------------
     */

    const handleCloseApprovalModels = () => {
        setShowOther(false)
        setShowApprovalNote(false)
        setOfferCTC()
        setOfferDate();
        setOfferValidDate();
    };

    /**
     * @description This Methods is Handle to Send Offer Latter -:
     * @param {Object} e - Event Object
     * @url {String} url - /offerJob
     */

    const handleSendOfferLatter = () => {

        let payloads = {
            "candidate_id": offerData?._id,
            "applied_job_id": offerData?.applied_jobs?.find((item) => item?.job_id === offerData?.job_id)?._id,
            "onboard_date": offerDate,
            "offer_ctc": offerCTC
        }

        axios.post(`${config.API_URL}offerJob`, payloads, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    setOfferCTC('');
                    setOfferDate(null);
                    handleCloseOfferModels();
                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };
                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }))
                    return toast.success(response.data.message)
                }
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }

    /**************** Set Update Offer Amount Sumbit Fn  ******************************/

    const UpdateJobOfferAmount = () => {
        if (!OfferAmountStatus) {
            return toast.warn("Please Select the Offer Amount Status")
        }
        if (!employeement_type) {
            return toast.warn("Please Select the Employment type")
        }

        if (!selectedLocationId) {
            return toast.warn("Please Select the Proposed Location")
        }
        // if (!esci) {
        //     return toast.warn("Please choose the ESCI")
        // }

        let payloads = {
            "candidate_id": approvalNotesData?._id,
            "applied_job_id": approvalNotesData?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?._id,
            "onboard_date": offerDate,
            "offer_ctc": offerCTC,
            "job_valid_till": offerValidDate,
            "interview_shortlist_status": OfferAmountStatus,
            "project_id": approvalNotesData?.project_id,
            "candidate_name": approvalNotesData?.name,
            "add_by_name": getUserDetails?.name,
            "add_by_mobile": getUserDetails?.mobile_no,
            "add_by_designation": getUserDetails?.designation,
            "add_by_email": getUserDetails?.email,
            "job_type": employeement_type,
            "proposed_location": selectedLocationId?.label,
            "esic_status": ['OnRole', 'onrole', 'onRole'].includes(employeement_type) ? esci : 'No',
            "proposed_location_id": selectedLocationId?.value,
            "payment_type": paytype,
            "working_days": working_days || "0"
        }

        axios.post(`${config.API_URL}updateJobOfferAmount`, payloads, apiHeaderToken(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };
                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }))
                    setOfferAmount(false)
                    setApprovalNOtesData(null)
                    setOfferDesignation(null)
                    setOfferCTC(null)
                    setOfferDate(
                        null
                    );
                    setOfferValidDate(
                        null
                    );
                    setOfferAmountStatus(null)
                    return toast.success(response.data.message)
                }
            })
            .catch(err => {
                toast.error(err.response.data.message || err.message || "Someting went wrong");
            })
    }

    /******************  Get the member List in that Data  *****************************/

    // Get the member List in that Data 
    const getMemberList = async (input = '') => {
        try {
            let payloads = {
                "keyword": input,
                "page_no": "1",
                "per_page_record": "10",
                "scope_fields": ["employee_code", "name", "email", "mobile_no", "_id", "designation"],
                "profile_status": "Active",
            }
            let response = await axios.post(`${config.API_URL}getEmployeeList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data?.data?.map((key) => {
                    return {
                        label: `${key?.name} (${key?.employee_code})`,
                        value: key._id,
                        emp: key
                    }
                })
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    /******************  Fetch the Candidate Records to Open Select Drop Down  *****************************/
    const handleMenuOpen = () => {
        setPen(true);
        getMemberList("")
            .then((res) => {
                setPen(false)
                setOption(res)
            })
            .catch(err => {
                setPen(false)
                setOption([])
            })
    }

    /******************  For the debounced For Fetch the Candidate Records From In this List  *****************************/
    const debouncedFetch = useCallback(
        debounce((input) => {
            getMemberList(input)
                .then((res) => {
                    setPen(false)
                    setOption(res);
                })
                .catch((err) => {
                    setOption([]);
                });
        }, 500), // Adjust the delay (in milliseconds) as needed
        []
    );

    /******************  For First Render show the Candidate Records In DropDown  *****************************/
    useEffect(() => {
        getMemberList("")
            .then((res) => {
                setPen(false)
                setOption(res)
            })
            .catch(err => {
                setPen(false)
                setOption([])
            })
    }, [])

    /******************  Candidate Select Input Search Changes  *****************************/

    const handleInputChange = (input) => {
        if (input) {
            setPen(true);
            debouncedFetch(input);
        } else {
            setPen(false);
            setOption([]);
        }
    };

    /**
     * @description : handle the selected candidate
     * @param {*} option 
     * 
     */

    const handleChange = (option) => {
        setSelectedMember(option)
    }

    // Add member  -
    const addMember = () => {
        if (!selectedMember) {
            return toast.warn("Please Select the Member");
        }
        if (!addPeriority) {
            return toast.warn("Please Add Priority");
        }
        let newData = {
            employee_id: selectedMember?.emp?._id,
            employee_code: selectedMember?.emp?.employee_code,
            designation: selectedMember?.emp?.designation,
            name: selectedMember?.label,
            email: selectedMember?.emp?.email,
            status: '',
            priority: addPeriority
        };

        // Called the here Api After that update the member =;
        let payload = offerApproveMember?.map((item) => {
            if (item?.employee_id === 'NA') {
                return {
                    id: item?.employee_id,
                    priority: 0
                }
            }
            return {
                id: item?.employee_id,
                priority: item.priority
            }
        })
        memberAction([...payload, { id: selectedMember?.emp?._id, priority: parseInt(addPeriority) }])
            .then((res) => {
                if (res.status === 200) {
                    getOfferApprovalMemberList()
                    setSelectedMember(null)
                    setAddPriority("")
                }
            })
    };

    // handle Get the Member List 
    const getOfferApprovalMemberList = async () => {
        try {
            let payloads = {
                "candidate_id": approvalNotesData?._id,
                "applied_job_id": approvalNotesData?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?._id,
            }
            let response = await axios.post(`${config.API_URL}getJobOfferApprovalMemberList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setMember(response.data?.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    // handle input changes 
    const handlePriorityChange = (index, newPriority) => {
        const updatedMembers = offerApproveMember?.map((member, i) =>
            i === index ? { ...member, priority: newPriority } : member
        );
        setMember(updatedMembers);
    };

    // Send Approval
    const sendOfferApproval = async (item) => {
        try {
            setLodingApproval(true)
            let payloads = {
                "candidate_id": approvalNotesData?._id,
                "applied_job_id": approvalNotesData?.applied_jobs?.filter((item) => item.job_id === (id || filterJobDetails?.value))[0]?._id,
                "employee_id": item?.employee_id,
                "add_by_name": getUserDetails?.name,
                "add_by_mobile": getUserDetails?.mobile_no,
                "add_by_designation": getUserDetails?.designation,
                "add_by_email": getUserDetails?.email
            }
            let response = await axios.post(`${config.API_URL}sendJobOfferApprovalMailToMember`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message);
                getOfferApprovalMemberList()
                setLodingApproval(false)
            } else {
                toast.error(response.data.message);
                setLodingApproval(false)
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || 'Someting Went Wrong');
            setLodingApproval(false)
        }
    }

    // changes the Status of users 
    const getActionButtonByPriority = (item) => {
        const validMembers = offerApproveMember?.filter(member => member?.priority != null);
        const sortedMembers = validMembers?.sort((a, b) => a.priority - b.priority);
        const lowestPriorityMember = sortedMembers?.find(
            (member) => member.approval_status === "Approved"
        );
        const secondLowestMember = sortedMembers?.find(
            (member) => member.priority > (lowestPriorityMember?.priority || 0) && (member.approval_status === "" || member.approval_status === "Pending")
        );
        if (item?.priority === secondLowestMember?.priority && (item?.approval_status === "" || item?.approval_status === "Pending")) {
            return (
                <Button
                    type="button"
                    className="btn btn-success"
                    style={{ height: '40px', fontSize: '10px', color: 'white' }}
                    onClick={() => sendOfferApproval(item)}
                    disabled={loadingApproval}
                >
                    {loadingApproval ? "Sending Approval.." : "Send Mail"}
                </Button>
            );
        }
        if (item?.approval_status === "Approved") {
            return <span>Already Approved</span>;
        }
        return <span>No Actions Available</span>;
    };

    // handle Member Delete
    const handleRemove = (item) => {
        let deletedItem = offerApproveMember?.filter((data) => data?._id !== item?._id)?.map((item) => {
            if (item?.employee_id === 'NA') {
                return {
                    id: item?.employee_id,
                    priority: 0
                }
            }
            return {
                id: item?.employee_id,
                priority: item.priority
            }
        })
        // Delete the member 
        memberAction(deletedItem)
            .then((res) => {
                if (res.status === 200) {
                    setMember(offerApproveMember?.filter((data) => data?._id !== item?._id))
                    // getOfferApprovalMemberList()
                }
            })
    }
    // handle Member Action
    const memberAction = async (memberList) => {
        try {
            // docId
            let paylods = {
                "approval_note_doc_id": docId,
                "employee_ids": memberList,
                "add_by_name": getUserDetails?.name,
                "add_by_mobile": getUserDetails?.mobile_no,
                "add_by_designation": getUserDetails?.designation,
                "add_by_email": getUserDetails?.email
            }

            // {"approval_note_doc_id": "676ea89cccc1ad824e8be9ab","employee_ids":[{"id":"66c03f16a7361b6a0dca0fe6","priority":"1"},{"id":"66c03f16a7361b6a0dca0fea","priority":"2"}, {"id":"66cc5ac0fa2035264257c9fc","priority":"3"}] }
            let response = await axios.post(`${config.API_URL}addJobOfferApprovalMember`, paylods, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response.data?.message)
                return response
            } else {
                toast.error(response.data?.message)
                return response
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || 'Someting Went Wrong');
            return error?.response.data?.message || error.message || 'Someting Went Wrong';
        }
    }

    /**
     * @description Hanlde Update Member
     * @param {Object} item
     */
    const handleUpdateMember = async () => {
        let payload = offerApproveMember?.map((item) => {
            if (item?.employee_id === 'NA') {
                return {
                    id: item?.employee_id,
                    priority: 0
                }
            }
            return {
                id: item?.employee_id,
                priority: item.priority
            }
        })
        await memberAction(payload)
        // getOfferApprovalMemberList()
    }

    /************** Handle The Select CheckBox  *********************************/
    /**
     * @description Handle The Select CheckBox
     * @param {*} selectionModel 
     */

    const handleSelectionChange = (selectionModel) => {

        const selectedData = selectionModel.map((id) =>
            rows.find((row) => row.id === id)
        );
        setCandidatesDetials(selectedData);
    };


    return (
        <>
            <div className="w-100">
                {/* Mui X Data Table */}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    headerClassName="custom-header-class"
                    rowCount={totalCount?.status === 'success' && totalCount?.data?.interviewed || 0}
                    pageSizeOptions={[10, 20, 30, 50, 75, 100]}
                    rowHeight={100}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    filterMode="server"
                    loading={AppliedCandidateServer.status === 'loading'}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange} // Updated method name    
                    isRowSelectable={(params) => params.row.Rating > 0 && ['Waiting', 'Selected'].includes(params?.row.candidateInfo?.status)}
                />
            </div>

            {/* add recomentation model */}
            <Modal
                show={showRecommendation}
                onHide={handleRecommendationClose}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Recommendation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <div className="col-sm-12">
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 ratetxtarea" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Add Recommendation</Form.Label>
                                        <Form.Control as="textarea" aria-label="With textarea" value={recommendation} onChange={(e) => {
                                            CommentRecommendation(e.target.value);
                                        }} placeholder="Enter Comment" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 custom-select" controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Set Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={jobStatus}
                                            onChange={(e) => setJobStatus(e.target.value)}
                                            className="custom-select-class" // Add your custom class here
                                        >
                                            <option value="">Choose...</option>
                                            <option value={'Pending'}>Pending</option>
                                            <option value={'Confirmed'}>Confirmed</option>
                                            <option value={'Rejected'}>Rejected</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="text-center " onClick={hanldeSubmitRecommendation}>
                            <button type="button" class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon /> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* confirmation models */}
            <ConfirmationModal
                open={confirm}
                onClose={handleConfirmClose}
                onConfirm={handleSaveConfirmation}
                title="Reject Confirmation"
                content="Are you sure you want Reject this Candidate?"
            />

            {/* Offer models */}
            <Modal
                show={offerModel}
                onHide={handleCloseOfferModels}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Send Offer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <div className="col-sm-12">
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Date of Onboarding</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaRegClock />
                                            </InputGroup.Text>
                                            <Form.Control type="date" placeholder="Select a date" value={offerDate} onChange={(e) => {
                                                setOfferDate(e.target.value)
                                            }} />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 custom-select" controlId="exampleForm.ControlSelect1">
                                        <Form.Label> Designation </Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={offerDesignation}
                                            onChange={(e) => setOfferDesignation(e.target.value)}
                                            readOnly
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                        <Form.Label>CTC Per annum</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <LiaRupeeSignSolid />
                                            </InputGroup.Text>
                                            <Form.Control type="text" placeholder="Please choose the CTC" value={offerCTC} onChange={(e) => {
                                                const value = e.target.value;
                                                // Regular expression to match digits only
                                                const regex = /^\d*$/;
                                                // Check if the value matches the regular expression
                                                if (regex.test(value)) {
                                                    setOfferCTC(value);
                                                }
                                            }} />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="text-center " onClick={handleSendOfferLatter}>
                            <button type="button" class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon /> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* show Extended Offer Notes  - */}
            <Modal
                show={showApprovalNote}
                onHide={handleCloseApprovalModels}
                size={"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Set Offer Amount For Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-sm-12">
                        <Row>
                            <Col sm={4}>
                                <Select
                                    options={option}
                                    placeholder="Select Member"
                                    isSearchable
                                    value={selectedMember}
                                    onChange={handleChange}
                                    onInputChange={handleInputChange}
                                    onMenuOpen={handleMenuOpen}
                                    isLoading={pen}
                                    styles={customStyles}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Priority"
                                    value={addPeriority}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (/^\d*$/.test(newValue)) {
                                            setAddPriority(newValue) // Parse or fallback to empty
                                        }
                                    }}
                                    className="form-control"
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                    <button type="button" class="sitebtn btn btn-primary ratebtn" onClick={addMember}> <CheckCircleIcon /> Add Member </button>
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    <>
                        <div className="modaltbl mt-3">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Sno.</th>
                                        <th>Panel Member</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Send Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        offerApproveMember && offerApproveMember?.length > 0 ?
                                            offerApproveMember?.map((item, index) => {
                                                return (
                                                    <tr key={item?.employee_doc_id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className='d-flex flex-column align-items-start gap-1'>
                                                                <span>{item?.employee_code}</span>
                                                                <span>{item?.name}</span>
                                                                <span>{item?.designation}</span>
                                                            </div>
                                                        </td>
                                                        <td width={'18%'}>
                                                            <Form.Control
                                                                type="text"
                                                                value={item?.priority}
                                                                readOnly={(item?.approval_status === "Approved" || item?.approval_status === "Pending")}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value;
                                                                    if (/^\d*$/.test(newValue)) {
                                                                        handlePriorityChange(index, parseInt(newValue, 10) || ""); // Parse or fallback to empty
                                                                    }
                                                                }}
                                                                className="form-control w-50"
                                                            />
                                                        </td>
                                                        <td>{item?.status || "-"}</td>
                                                        <td>{item?.send_mail_date ? moment(item?.send_mail_date).format('DD/MM/YYYY') : 'N/A'}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <span className="" style={{ height: '44px' }}>{getActionButtonByPriority(item)}</span>
                                                                {
                                                                    item?.status === "" &&
                                                                    <OverlayTrigger
                                                                        placement="top" // Tooltip position: 'top', 'bottom', 'left', or 'right'
                                                                        overlay={
                                                                            <Tooltip id={`tooltip-delete-${item.id || Math.random()}`}>
                                                                                Delete Member
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <span onClick={() => handleRemove(item)} style={{ cursor: 'pointer' }}>
                                                                            <CiCircleRemove size={25} color="red" />
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr className='text-center'>
                                                <td colSpan={6} className='text-center'>No Record Found</td>
                                            </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>
                        <div className="col-sm-12 text-center">
                            <button style={{ marginTop: '36px' }} type="button" class="sitebtn btn btn-primary ratebtn" onClick={handleUpdateMember}> <CheckCircleIcon /> Update </button>
                        </div>
                    </>
                </Modal.Body>
            </Modal>

            {/* Set Offer Amount Modal  */}

            <Modal
                show={offerAmount}
                onHide={handleClose}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Set Offer Amount For Approval</Modal.Header>
                <Modal.Body>
                    <div className="col-sm-12">
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Date of Onboarding</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaRegClock />
                                            </InputGroup.Text>
                                            <Form.Control type="date" placeholder="Select a date" value={offerDate} onChange={(e) => {
                                                setOfferDate(e.target.value)
                                            }} />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Contract End Date</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaRegClock />
                                            </InputGroup.Text>
                                            <Form.Control type="date" placeholder="Select a date" value={offerValidDate} onChange={(e) => {
                                                setOfferValidDate(e.target.value)
                                            }} />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlSelect122">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={OfferAmountStatus}
                                            // defaultValue={OfferAmountStatus}
                                            onChange={(e) => setOfferAmountStatus(e.target.value)}
                                        >
                                            <option value="">Select Status</option> {/* Placeholder option */}
                                            <option value="Waiting">Wait List</option>
                                            <option value="Selected">Selected</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlSelect145fuckyou3000">
                                        <Form.Label>Job Type</Form.Label>
                                        <Form.Select
                                            value={employeement_type}
                                            onChange={(e) => setEmployeement_type(e.target.value)}
                                        >
                                            <option value="">Select Job type</option> {/* Placeholder option */}
                                            <option value="OnRole">On Role</option>
                                            <option value="OnContract">On Consultant</option>
                                            <option value="empanelled">Empanelled</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {
                                !['OnRole', 'onrole', 'onRole'].includes(employeement_type) && (
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlSelect145">
                                                <Form.Label>Working Days (Optional)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Please Enter the Working Days"
                                                    value={working_days || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // const validation = validateInput(value, 'workingDays');
                                                        if (/^\d*$/.test(value)) {
                                                            setWorking_days(value);
                                                        }

                                                    }}
                                                    onKeyPress={(e) => {
                                                        const charCode = e.which ? e.which : e.keyCode;
                                                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                            e.preventDefault();
                                                        }
                                                        // Prevent input if it would exceed max length
                                                        if (working_days?.length >= 3) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    maxLength="3"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )
                            }

                            {

                                ['OnRole', 'onrole', 'onRole'].includes(employeement_type) && (
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3">
                                                <Form.Label>ESIC Status</Form.Label>
                                                <div className='d-flex gap-3'>
                                                    {["Yes", "No"].map((type) => (
                                                        <Form.Check
                                                            key={type}
                                                            type="radio"
                                                            label={type === 'Yes' ? 'ESIC' : 'No-ESIC'} // Capitalize first letter
                                                            name="esci"
                                                            value={type}
                                                            checked={esci === type}
                                                            onChange={(e) => {
                                                                setESCI(e.target.value);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                )

                            }

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Pay Type</Form.Label>
                                        <div className='d-flex gap-3'>
                                            {["annum", "month", "daily/visit"].map((type) => (
                                                <Form.Check
                                                    key={type}
                                                    type="radio"
                                                    label={type.charAt(0).toUpperCase() + type.slice(1)} // Capitalize first letter
                                                    name="payType"
                                                    value={type}
                                                    checked={paytype === type}
                                                    onChange={(e) => {
                                                        setPaytype(e.target.value);
                                                        setOfferCTC(""); // Reset offer CTC on change
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput12332fuckyou">
                                        <Form.Label>CTC Per {paytype ? paytype : "annum"}</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <LiaRupeeSignSolid />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Please Enter the CTC"
                                                value={offerCTC}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                        setOfferCTC(value); // Update only if the value contains digits only
                                                    }
                                                }}
                                                onKeyPress={(e) => {
                                                    // Prevent any non-digit key presses
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlSelect1fuckyou2">
                                        <Form.Label>Proposed Location</Form.Label>
                                        <Select
                                            value={selectedLocationId}
                                            onChange={(option) => setSelectedLocationId(option)}
                                            options={jobLocation?.location?.map((item) => ({
                                                value: item?.loc_id,
                                                label: item?.name,
                                            }))}
                                            placeholder="Select Posted Job Location"
                                            isClearable
                                            isSearchable
                                            menuPlacement="top"
                                        />

                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="text-center" >
                            <button type="button" onClick={UpdateJobOfferAmount} class="sitebtn mt-4 btn btn-primary ratebtn"> <CheckCircleIcon /> Submit </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal For the show the Review when Clicked the Jon Id */}

            <Modal
                show={openRatingModal}
                onHide={() => setOpenRatingModal(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Rating and Feedback
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-sm-12">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Sno.</th>
                                    <th>Interviewer Name</th>
                                    <th>JOb Match(5)</th>
                                    <th>Job Knowledge(10)</th>
                                    <th>Creative Problem Solving Capacity(10)</th>
                                    <th>Team Player(5)</th>
                                    <th>Communication Skill(10)</th>
                                    <th>Exposure to Job Profile(10)	</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    selectedData?.applied_jobs
                                        ?.find((item) => item?.job_id === id || filterJobDetails?.value)
                                        ?.interviewer
                                        ?.filter((interviewer) => interviewer?.feedback_status === 'Approved')
                                        ?.map((interviewer, index) => (
                                            <tr key={interviewer?.employee_name}>
                                                <td>{index + 1}</td>
                                                <td className="text-wrap">
                                                    <span>{interviewer?.employee_name}</span>
                                                    <span className="text-wrap">{interviewer?.designation}</span>
                                                </td>
                                                <td>{interviewer?.job_match}</td>
                                                <td>{interviewer?.job_knowledge}</td>
                                                <td>{interviewer?.creative_problem_solving}</td>
                                                <td>{interviewer?.team_player}</td>
                                                <td>{interviewer?.communication_skill}</td>
                                                <td>{interviewer?.exposure_to_job_profile}</td>
                                                <td>{interviewer?.total}</td>
                                            </tr>
                                        )) || (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                No Records Found
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default memo(InterviewTable)
