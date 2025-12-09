import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Link, useParams } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { RiEyeLine } from "react-icons/ri";
import ViewofferModal from './OfferModlesViews';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaFileContract } from 'react-icons/fa6';



const OverflowTooltip = ({ children, text }) => {
    const ref = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        if (ref.current) {
            setIsOverflowing(ref.current.scrollWidth > ref.current.clientWidth);
        }
    }, [text]);

    return (
        <Tooltip title={isOverflowing ? text : ''} placement="top" arrow>
            <div
                ref={ref}
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {children}
            </div>
        </Tooltip>
    );
};

function Offer_table({
    PageStatus,
    setCandidatesDetials,
    filterText,
    handlePaginationModelChange,
    paginationModel
}) {
    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);
    const navigation = useNavigate();

    const { id } = useParams();

    const filterJobDetails = useSelector((state) => state.appliedJobList.selectedJobList);
    const AppliedCandidateServer = useSelector((state) => state.appliedJobList.AppliedCandidateServer);
    const totalCount = useSelector((state) => state.appliedJobList.AppliedCandidateServerPagination);

    const handleShow = useCallback((e, data) => {
        e.preventDefault();
        setShow(true);
        setData(data);
    }, []);

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

    const rows = useMemo(() => {
        if (AppliedCandidateServer.status !== 'success' || AppliedCandidateServer.data.length === 0) return [];

        return AppliedCandidateServer.data
            .filter(value => value?.applied_jobs?.some(item => item?.form_status === PageStatus))
            .map((value, index) => {
                const jobMatch = value?.applied_jobs?.find(item =>
                    item?.job_id === id || item?.job_id === filterJobDetails?.value
                );

                const jobStatus = value?.applied_jobs?.[0]?.form_status;

                return {
                    id: index + 1 + paginationModel.page * paginationModel.pageSize,
                    candidateInfo: {
                        name: value.name,
                        candidate_id: value._id,
                        id: value._id,
                        status: (!id && !filterJobDetails?.value) ? jobStatus : jobMatch?.form_status,
                        email: value.email,
                        phone: value.mobile_no,
                    },
                    value: value,
                    "Date of Onboarding": moment(jobMatch?.onboard_date).format('DD/MM/YYYY'),
                    "Designation": value?.designation,
                    "Project": value?.project_name,
                    "Location": value?.location,
                    "Notice Period": value.notice_period,
                    "Department": value?.department,
                    "Status": "",
                    applied_details: value?.applied_jobs?.find((item) => item?.job_id === id || filterJobDetails?.value || value?.job_id)
                };
            });
    }, [AppliedCandidateServer.status, AppliedCandidateServer.data, PageStatus, paginationModel.page, paginationModel.pageSize, id, filterJobDetails?.value]);

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

    const handleSendOfferLetterOpenInNewTabs = (approval_id) => {
        if (!approval_id) {
            return toast.warn('Approval Note Doc is Missing in Candidate Profile')
        }
        window.open(`/approval-candidate-list/${approval_id}`, '_blank');
    };

    const columns = useMemo(() => {
        const baseColumns = [
            { field: "id", headerName: "Sno.", width: 50 },
            {
                field: "candidateName",
                headerName: "Candidate Name",
                width: 200,
                renderCell: (params) => (
                    <OverflowTooltip text={params.row?.candidateInfo?.name}>
                        <p style={{ cursor: 'pointer' }} onClick={(e) => handleNavigationOnProfile(e, `/candidate-profile/${params?.row?.candidateInfo?.id}?job_id=${id || filterJobDetails?.value}`)} className="color-blue overflow-hidden text-elipses">{params.row?.candidateInfo?.name}</p>
                    </OverflowTooltip>
                ),
            },
            {
                field: "Email & Phone Number",
                headerName: "Email & Phone Number",
                width: 220,
                renderCell: (params) => (
                    <OverflowTooltip text={`${params.row?.candidateInfo?.email}, ${params.row?.candidateInfo?.phone}`}>
                        <div className="candinfo">
                            <p>{params.row?.candidateInfo?.email}</p>
                            <span>{params?.row?.candidateInfo?.phone}</span>
                        </div>
                    </OverflowTooltip>
                ),
            },
            {
                field: "Date of Onboarding",
                headerName: "Date of Onboarding",
                type: "number",
                width: 160,
            },
            {
                field: "Designation",
                headerName: "Designation",
                width: 200,
                renderCell: (params) => (
                    <OverflowTooltip text={params.row?.Designation}>
                        <p>{params.row?.Designation}</p>
                    </OverflowTooltip>
                ),
            },
            {
                field: "Project",
                headerName: "Project",
                width: 200,
            },
            {
                field: "Department",
                headerName: "Department",
                width: 200,
            },
            {
                field: "Location",
                headerName: "Location",
                width: 120,
                renderCell: (params) => (
                    <OverflowTooltip text={params.row?.Location}>
                        <p className="overflow-auto">{params.row?.Location}</p>
                    </OverflowTooltip>
                ),
            },
            {
                field: "Status",
                headerName: "Status",
                width: 120,
                renderCell: (params) => {
                    const status = params?.row?.candidateInfo?.status;
                    if (PageStatus === 'Rejected') {
                        return <div className="candinfo"><span className="statustag bgdred">{status}</span></div>;
                    } else if (PageStatus === 'Hired') {
                        return <div className="candinfo"><span className="statustag bgdgreen">{status}</span></div>;
                    }
                    return <div className="candinfo prcnt_bar"><span className="statustag">{status}</span></div>;
                },
            }
        ];

        if (!['Rejected', 'Hired'].includes(PageStatus)) {
            // baseColumns.push({
            //     field: "View Offer",
            //     headerName: "View Offer",
            //     width: 80,
            //     renderCell: (params) => (
            //         <div className="d-flex flex-column justify-content-end align-items-center">
            //             <div className="h-100" onClick={(e) => handleShow(e, params?.row?.value)}>
            //                 <RiEyeLine className="fs-5" />
            //             </div>
            //         </div>
            //     ),
            // });

            baseColumns?.splice(1, 0, {
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

                        {/* Set Offer Amount Icon */}
                        <Tooltip
                            title="View Offer Latter"
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
                                // onClick={(e) => SendOfferAmountForApproval(e, params?.row?.value)}
                                onClick={(e) => handleSendOfferLetterOpenInNewTabs(params?.row?.applied_details?.approval_note_data?.doc_id)
                                }
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
                    </div>
                )
            })
        }

        return baseColumns;
    }, [PageStatus, id, filterJobDetails, handleShow]);

    const total = useMemo(() => {
        if (totalCount?.status !== 'success') return 0;
        switch (PageStatus) {
            case 'Hired': return totalCount?.data?.hired || 0;
            case 'offer': return totalCount?.data?.offered || 0;
            default: return totalCount?.data?.rejected || 0;
        }
    }, [totalCount, PageStatus]);

    const handleSelectionChange = useCallback(selection => {
        const selectedRows = rows.filter(r => selection.includes(r.id));
        setCandidatesDetials(selectedRows);
    }, [rows, setCandidatesDetials]);

    return (
        <>
            <div className="w-100">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={AppliedCandidateServer?.status === 'loading'}
                    headerClassName="custom-header-class"
                    rowCount={total || totalCount?.data?.offered}
                    rowHeight={80}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    filterMode="server"
                    checkboxSelection={true}
                    onRowSelectionModelChange={handleSelectionChange}
                    pageSizeOptions={[10, 20]}
                />
            </div>
            <ViewofferModal show={show} onHide={() => setShow(false)} data={data} />
        </>
    );
}

export default memo(Offer_table)
