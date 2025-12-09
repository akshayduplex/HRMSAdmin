import React, { memo, useCallback, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IoCloseOutline, IoCloudUploadOutline, IoDocumentTextOutline } from "react-icons/io5";
import { FiUserCheck } from "react-icons/fi";
import { IoCalendarClearOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import config from "../../../config/config";
import { ShortListCandidates } from "../../slices/JobSortLIstedSlice/SortLIstedSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FetchAppliedCandidateDetailsCount, FetchAppliedCandidateDetailsWithServerPagination } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import { DeleteAndRemoved } from "../../slices/JobSortLIstedSlice/SortLIstedSlice";
import { useRef } from "react";
import axios from "axios";
import { apiHeaderTokenMultiPart } from "../../../config/api_header";
import { toast } from "react-toastify";
import CircularProgressWithLabel from "./CirculProgressBar";
import moment from "moment";
import { IconButton, Tooltip } from "@mui/material";


function JobCandidateTable({ PageStatus, setCandidatesDetials, filterText, handlePaginationModelChange, paginationModel }) {
    const dispatch = useDispatch();
    const { id } = useParams();
    const AppliedCandidateServer = useSelector((state) => state.appliedJobList.AppliedCandidateServer)
    const filterJobDetails = useSelector((state) => state.appliedJobList.selectedJobList);
    const navigation = useNavigate()
    const totalCount = useSelector((state) => state.appliedJobList.AppliedCandidateServerPagination);
    const fileInputRef = useRef({});
    const getEmployeeRecords = JSON.parse(localStorage.getItem('admin_role_user') ?? {})
    const [QueryParams] = useSearchParams();
    const type = QueryParams.get('type');

    const rows = useMemo(() => (
        AppliedCandidateServer.status === 'success' && AppliedCandidateServer.data.length !== 0
            ? AppliedCandidateServer.data
                ?.map((value, index) => {
                    return {
                        id: index + 1 + paginationModel.page * paginationModel.pageSize,
                        candidateInfo: {
                            candidate_id: value._id,
                            status: value?.applied_jobs?.find((item) => item?.job_id === id || filterJobDetails?.value || value?.job_id)?.form_status,
                            name: value?.name?.length > 25 ? value?.name.slice(0, 25) + "..." : value?.name,
                            email: value?.email,
                            phone: value?.mobile_no,
                            match_percent: parseInt(value.complete_profile_status),
                            resume: value?.resume_file,
                            job_id: value?.job_id,
                            applied_job_id: value?.applied_jobs?.find((item) => item?.job_id === id || filterJobDetails?.value || value?.job_id)?._id,
                            interviewer_id: value?.applied_jobs,
                        },
                        "currentDesignation": value.designation,
                        "Experience": value.total_experience,
                        "Location": value?.location ? value?.location : 'N/A',
                        "Current CTC": `${value.current_ctc ? value.current_ctc : 0} PA`,
                        "Expected CTC": `${value.expected_ctc ? value.expected_ctc : 0} PA`,
                        "Notice Period": `${value.notice_period ? value.notice_period : 0} Days`,
                        project_name: value?.project_name,
                        project_id: value?.project_id,
                        batch_id: value?.batch_id ? value?.batch_id : 'N/A',
                        applied_date: value?.add_date,
                        applied_from: value?.applied_from || "N/A",
                        applied_details: value?.applied_jobs?.find((item) => item?.job_id === id || filterJobDetails?.value || value?.job_id)
                    }
                })
            : []
    ), [AppliedCandidateServer, id, filterJobDetails, paginationModel.page, paginationModel.pageSize]);

    // shortListCandidate
    const handleSortListed = useCallback((e, data) => {

        if (!id && !filterJobDetails) {
            return toast.warn('Please Select the Job')
        }

        e.preventDefault();
        let candidateDetails = [
            {
                candidate_id: data?.candidateInfo.candidate_id,
                applied_job_id: data?.candidateInfo.applied_job_id
            }
        ]

        let payloads = {
            "role_user_id": getEmployeeRecords?._id,
            "candidate_ids": candidateDetails,
            "add_by_name": getEmployeeRecords?.name,
            "add_by_mobile": getEmployeeRecords?.mobile_no,
            "add_by_designation": getEmployeeRecords?.designation,
            "add_by_email": getEmployeeRecords?.email,
            "status": "Shortlisted"
        }
        dispatch(ShortListCandidates(payloads))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }));
                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };
                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [PageStatus, dispatch, filterJobDetails, filterText, getEmployeeRecords?._id, id, paginationModel.page, paginationModel.pageSize, type])

    const handleDelete = useCallback((e, data) => {

        if (!id && !filterJobDetails) {
            return toast.warn('Please Select the Job')
        }
        e.preventDefault();
        let payloads = {
            "candidate_id": data?.candidateInfo.candidate_id,
            "applied_job_id": data?.candidateInfo.applied_job_id,
            "status": "Deleted"
        }
        dispatch(DeleteAndRemoved(payloads))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }));
                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };
                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [id, filterJobDetails, dispatch, type, PageStatus, paginationModel.page, paginationModel.pageSize, filterText]);

    // Reject Candidate
    const handleReject = useCallback((e, data) => {

        if (!id && !filterJobDetails) {
            return toast.warn('Please Select the Job')
        }
        e.preventDefault();
        let payloads = {
            "candidate_id": data?.candidateInfo.candidate_id,
            "applied_job_id": data?.candidateInfo.applied_job_id,
            "status": "Rejected"
        }
        dispatch(DeleteAndRemoved(payloads))
            .unwrap()
            .then((response) => {

                if (response.status) {

                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }));

                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };

                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [PageStatus, dispatch, filterJobDetails, filterText, id, paginationModel.page, paginationModel.pageSize, type])

    const handleNavigationOnProfile = useCallback((e, url) => {

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

    }, [id, filterJobDetails, navigation]);

    const commonIconButtonStyle = useMemo(() => ({
        width: '28px',
        height: '28px',
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

    const handleFileChange = useCallback(async (event, candidate_id) => {
        const file = event.target.files[0];
        if (file) {
            let payloads = {
                "candidate_id": candidate_id,
                "old_resume_file": "",
                "filename": file
            }
            try {
                let response = await axios.post(`${config.API_URL}uploadResume`, payloads, apiHeaderTokenMultiPart(config.API_TOKEN))
                if (response.status === 200) {
                    toast.success(response?.data?.message)
                    dispatch(FetchAppliedCandidateDetailsCount({ id: id || filterJobDetails?.value, type: type }))
                    let payloads = {
                        id: id || filterJobDetails?.value || "",
                        form_status: PageStatus,
                        page_no: paginationModel.page + 1,
                        per_page_record: paginationModel.pageSize,
                        keyword: filterText || '',
                    };
                    dispatch(FetchAppliedCandidateDetailsWithServerPagination(payloads));
                } else {
                    toast.error(response?.data?.message)
                }
            } catch (error) {
                toast.error(error.response.data.message || error?.message);
            }
        }
    }, [dispatch, id, filterJobDetails?.value, type, PageStatus, paginationModel.page, paginationModel.pageSize, filterText]);

    const handleSendOfferLetterOpenInNewTabs = (id) => {
        window.open(`/approval-candidate-list/${id}`, '_blank');
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "Sno.", width: 50 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            renderCell: (params) => (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                }}>
                    {/* Shortlist Action */}
                    {params.row?.candidateInfo?.status === "Applied" && (
                        <Tooltip
                            title="Shortlist Candidate"
                            arrow placement="top"
                            componentsProps={getTooltipStyle('#2e7d32')} // Success green                        
                        >
                            <IconButton
                                onClick={(e) => handleSortListed(e, params.row)}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.15)' }
                                }}
                            >
                                <FiUserCheck style={{ color: '#2e7d32' }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip
                        title="Upload Resume"
                        arrow
                        placement="top"
                        componentsProps={getTooltipStyle('#1976d2')}
                    >
                        <IconButton
                            onClick={() => fileInputRef.current[params.row?.candidateInfo?.candidate_id].click()}
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' }
                            }}
                        >
                            <IoCloudUploadOutline style={{ color: '#1976d2' }} />
                        </IconButton>
                    </Tooltip>

                    {/* View Resume Action */}
                    <Tooltip
                        title="View Resume"
                        arrow
                        placement="top"
                        componentsProps={getTooltipStyle('#1976d2')}
                    >
                        <IconButton
                            href={`${config.IMAGE_PATH}${params.row?.candidateInfo?.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' }
                            }}
                        >
                            <IoDocumentTextOutline style={{ color: '#1976d2' }} />
                        </IconButton>
                    </Tooltip>

                    {/* Hidden file input for resume upload */}
                    <input
                        type="file"
                        ref={(el) => (fileInputRef.current[params.row?.candidateInfo?.candidate_id] = el)}
                        style={{ display: 'none' }}
                        onChange={(event) => handleFileChange(event, params.row?.candidateInfo?.candidate_id)}
                        accept="application/pdf, .doc, .docx"
                    />



                    {/* Schedule Interview Action */}
                    {params.row?.candidateInfo?.status === "Shortlisted" && (
                        <Tooltip
                            title="Schedule Interview"
                            arrow placement="top"
                            componentsProps={getTooltipStyle('#1976d2')} // Primary blue
                        >
                            <IconButton
                                component={Link}
                                to={`/schedule-interview/${id || filterJobDetails?.value}?userId=${params.row?.candidateInfo?.candidate_id}&applied-job-id=${params.row?.candidateInfo?.applied_job_id}`}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' }
                                }}
                            >
                                <IoCalendarClearOutline style={{ color: '#1976d2' }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Reject Action */}
                    {!['Rejected'].includes(params.row?.candidateInfo?.status) && (
                        <Tooltip
                            title="Reject Candidate"
                            arrow placement="bottom"
                            componentsProps={getTooltipStyle('#d32f2f')} // Error red
                        >
                            <IconButton
                                onClick={(e) => handleReject(e, params.row)}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' }
                                }}
                            >
                                {/* give me here cross button */}
                                <IoCloseOutline style={{ color: '#d52f2f' }} />
                                {/* <GrSubtractCircle style={{ color: '#d32f2f' }} /> */}
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Delete Action */}
                    {['Shortlisted', 'Applied', 'Rejected'].includes(params.row?.candidateInfo?.status) && (
                        <Tooltip
                            title="Delete Candidate"
                            arrow placement="bottom"
                            componentsProps={getTooltipStyle('#d32f2f')} // Error red
                        >
                            <IconButton
                                onClick={(e) => handleDelete(e, params.row)}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' }
                                }}
                            >
                                <RiDeleteBin6Line style={{ color: '#d32f2f' }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Onboard Action */}
                    {/* {['Hired'].includes(params.row?.candidateInfo?.status) && (
                        <Tooltip title="Onboard Candidate" arrow placement="bottom">
                            <IconButton
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.15)' }
                                }}
                            >
                                <FaUserPlus style={{ color: '#2e7d32' }} />
                            </IconButton>
                        </Tooltip>
                    )} */}
                </div>
            )
        },
        {
            field: "candidateName",
            headerName: "Candidate Name",
            width: 250,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p style={{ cursor: 'pointer' }} onClick={(e) => handleNavigationOnProfile(e,`/candidate-profile/${params.row?.candidateInfo?.candidate_id}?job_id=${id || filterJobDetails?.value}`)} className="color-blue overflow-hidden">{params.row?.candidateInfo?.name}</p>
                    <span className="statustag">{params?.row?.candidateInfo?.status}</span>
                    <div className="d-grid align-items-center gap-1 mt-1">
                        {
                            params?.row?.applied_details?.mpr_id &&
                            <span style={{ cursor: 'pointer', fontSize: '12px' }} className="color-blue overflow-hidden">{params?.row?.applied_details?.mpr_id}</span>
                        }
                        {
                            params?.row?.applied_details?.approval_note_data?.note_id &&
                            <span style={{ cursor: 'pointer', fontSize: '12px' }} onClick={(e) => {
                                e.stopPropagation();
                                handleSendOfferLetterOpenInNewTabs(params?.row?.applied_details?.approval_note_data?.doc_id)
                            }} className="color-blue overflow-hidden">{params?.row?.applied_details?.approval_note_data?.note_id || 'N/A'}</span>
                        }
                    </div>
                    {
                        PageStatus === 'Shortlisted' ? null :
                            <CircularProgressWithLabel percentage={params?.row?.candidateInfo?.match_percent} />
                    }
                </div>
            ),
        },
        {
            field: "Email & Phone Number",
            headerName: "Email & Phone Number",
            width: 250,
            renderCell: (params) => (
                <div className="candinfo">
                    <p className="overflow-hidden">{params.row?.candidateInfo?.email}</p>
                    <span>{params?.row?.candidateInfo?.phone}</span>
                </div>
            ),
        },
        // PageStatus === 'Applied' &&
        {
            field: "applied_date",
            headerName: "Applied Date | Applied From",
            width: 250,
            renderCell: (params) => (
                <div className="candinfo over d-flex flex-column gap-2">
                    <span>{moment(params?.row?.applied_date).format('DD/MM/YYYY')}</span>
                    <span>
                        <p>{['Outgrow', 'Devnet', 'Naukri'].includes(params?.row?.applied_from) ? params?.row?.applied_from : " Career Portal "}</p>
                        {
                            params?.row?.applied_from === 'Naukri' && params?.row?.applied_details?.naukri_ref_id ?
                                <p className="overflow-hidden" style={{ textOverflow: 'ellipsis', fontSize: '12px' }}> ( Portal  )</p>
                                :
                                ['Outgrow', 'Devnet', 'Naukri'].includes(params?.row?.applied_from) && <p className="overflow-hidden" style={{ textOverflow: 'ellipsis', fontSize: '12px' }}>( Import )</p>
                        }
                    </span>
                </div>
            ),
        },
        {
            field: "project_name",
            headerName: "Project Name",
            width: 250,
            // flex: 1,
            renderCell: (params) => {
                const { project_name, applied_details } = params.row;
                const jobTitle = applied_details?.job_title || '';
                const combined = [project_name].filter(Boolean).join(' | ');
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
            width: 200,
            // flex: 1,
            renderCell: (params) => {
                const {applied_details } = params.row;
                const jobTitle = applied_details?.job_title || '';
                const combined = [jobTitle].filter(Boolean).join(' | ');
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
            field: "batch_id",
            headerName: "Batch Id",
            type: "number",
            width: 100,
        },
        {
            field: "currentDesignation", // Ensure it matches your data field key
            headerName: "Current Designation",
            type: "string", // Use 'string' for text-based data
            width: 250, // Or use flex for dynamic resizing
            renderCell: (params) => (
                <span>
                    <p className="overflow-hidden" style={{ textOverflow: 'ellipsis' }}>{params?.row?.currentDesignation}</p>
                </span>
            ),
        },
        {
            field: "Experience",
            headerName: "Experience",
            type: "number",
            width: 150,
        },
        {
            field: "Location",
            headerName: "Location",
            type: "number",
            width: 120,
            renderCell: (params) => (
                <span>
                    <p className="overflow-hidden" style={{ textOverflow: 'ellipsis' }}>{params?.row?.Location}</p>
                </span>
            ),
        },
        {
            field: "Current CTC",
            headerName: "Current CTC",
            type: "string",
            width: 120,
        },
        {
            field: "Expected CTC",
            headerName: "Expected CTC",
            type: "string",
            width: 120,
        },
        {
            field: "Notice Period",
            headerName: "Notice Period",
            type: "string",
            width: 150,
        },
    ].filter(Boolean), [PageStatus, commonIconButtonStyle, id, filterJobDetails?.value, handleSortListed, handleFileChange, handleReject, handleDelete, handleNavigationOnProfile]);

    const total = useMemo(() => {
        if (totalCount.status !== 'success') return 0;
        return ({ Applied: totalCount.data.applied, Shortlisted: totalCount.data.shortlist }[PageStatus] || totalCount.data.all);
    }, [totalCount, PageStatus]);

    const handleSelectionChange = useCallback(selection => {
        const selectedRows = rows.filter(r => selection.includes(r.id));
        setCandidatesDetials(selectedRows);
    }, [rows, setCandidatesDetials]);

    return (
        <>
            <div className="w-100" >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={total}
                    rowHeight={100}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    filterMode="server"
                    pageSizeOptions={[10, 20, 50, 70, 80, 99]}
                    checkboxSelection={true}
                    onRowSelectionModelChange={handleSelectionChange}
                    loading={AppliedCandidateServer?.status === 'loading'}
                    sx={{ minHeight: 400 }}
                />
            </div>
        </>
    )
}

export default memo(JobCandidateTable)

