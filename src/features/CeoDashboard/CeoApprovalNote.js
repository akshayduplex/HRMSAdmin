import React, { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { Accordion, Card, Col, Modal, Row, Table } from 'react-bootstrap';
// import RecordsModal from './ShowApprovalHistory';
import RecordsModal from '../job/JobCartsDetails/ApprovalNoteTables/ShowApprovalHistory';
import { CircularProgress } from '@mui/material';
import { CamelCases, changeJobTypeLabel, CustomChangesJobType, formatDateToWeekOf, validateTheJobPortal } from '../../utils/common';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CeoNavbarComponent from './CeoNavbar';
import GoBackButton from '../goBack/GoBackButton';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner';
import SearchInput from './SearchBox';
import { TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa6';


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

function ApprovalTableCeo() {
    const [data, setData] = useState(null);
    const [openModalApprovalHistory, setApprovalHistory] = useState(false);
    const [getParams] = useSearchParams();
    const [pdfLoading, setPdfLoading] = useState(false)
    const [approvalNotes, setApprovalList] = useState(null)
    const [pagination, setPaginations] = useState(12);
    const [hasMoreStatus, setHasMoreStatus] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [loader, setLoader] = useState(true);
    const [viewCandidateModal, setViewCandidateModal] = useState(false);
    const [selectedCandidateData, setSelectedCandidateData] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [bulkApprovalModal, setBulkApprovalModal] = useState(false);
    const [bulkApprovalStatus, setBulkApprovalStatus] = useState('Approved');
    const [bulkApprovalFeedback, setBulkApprovalFeedback] = useState('');
    const [bulkApprovalLoading, setBulkApprovalLoading] = useState(false);
    const navigate = useNavigate()
    const searchParams = DeBouncingForSearch(search)
    let loginUser = JSON.parse(localStorage.getItem('admin_role_user')) || {}

    const getApprovalListByCeo = React.useCallback(async (filterType = '') => {
        try {
            let payloads = {
                "job_id": "",
                "page_no": "1",
                "per_page_record": pagination,
                "scope_fields": [],
                "keyword": searchParams,
                "filter_type": filterType
            }
            let response = await axios.post(`${config.API_URL}getApprovalNoteFromListCeo`, payloads, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setApprovalList(response.data?.data)
            } else {
                console.log(response.data)
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }
    }, [pagination, searchParams])

    const getApprovalNoteByTableView = React.useCallback(async (filterType = '') => {
        try {
            let payloads = {
                "job_id": "",
                "page_no": "1",
                "per_page_record": 1000,
                "scope_fields": [],
                "keyword": searchParams,
                "filter_type": filterType
            }
            let response = await axios.post(`${config.API_URL}getPendingCandidateApprovalNotesListForCeo`, payloads, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setTableData(response.data?.data)
            } else {
                console.log(response.data)
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }
    }, [searchParams])

    const hasMore = () => {
        let increasePageSize = pagination + 9
        setPaginations(increasePageSize)
    }

    useEffect(() => {
        if (getParams.get('type') === 'PendingByCeo') {

            getApprovalNoteByTableView(getParams.get('type'))

        }
    }, [getParams.get('type')])

    const rows = useMemo(() => {
        if (!tableData) return [];

        // Only apply filtering when type is 'PendingByCeo'
        if (getParams.get('type') === 'PendingByCeo' && searchParams) {
            return tableData
                .filter((item) => {
                    const searchLower = searchParams.toLowerCase();
                    return (
                        (item.candidate_name || '').toLowerCase().includes(searchLower) ||
                        (item.candidate_email || '').toLowerCase().includes(searchLower) ||
                        (item.job_designation || '').toLowerCase().includes(searchLower) ||
                        (item.project_name || '').toLowerCase().includes(searchLower) ||
                        (item.proposed_location || '').toLowerCase().includes(searchLower) ||
                        (item.approval_note_id || '').toLowerCase().includes(searchLower) ||
                        (item.offer_ctc || '').toString().toLowerCase().includes(searchLower) ||
                        (item.job_type || '').toLowerCase().includes(searchLower)
                    );
                })
                .map((item, index) => {
                    // Generate truly unique ID by combining multiple properties
                    const baseId = item?.cand_doc_id || item?._id || 'no_id';
                    const uniqueId = `${baseId}_${index}_${item?.candidate_name || ''}_${item?.project_name || ''}`.replace(/[^a-zA-Z0-9_]/g, '_');

                    return {
                        id: uniqueId,
                        candDocId: item?.cand_doc_id,
                        originalId: item?._id,
                        serialNumber: index + 1,
                        candidateName: item.candidate_name || 'N/A',
                        candidate_email: item.candidate_email || 'N/A',
                        designation: item.job_designation || 'N/A',
                        project_name: item.project_name || 'N/A',
                        jobLocation: item.proposed_location || 'N/A',
                        dateOfJoin: item.onboarding_date || 'N/A',
                        jobSalary: item.offer_ctc || 'N/A',
                        candidate_list: item.candidate_list || [],
                        employmentMode: item.job_type || 'N/A',
                        mpr_offer_type: item.mpr_offer_type || 'N/A',
                        job_start_date: item?.onboarding_date || 'N/A',
                        job_valid_date: item.job_valid_date || 'N/A',
                        approval_note_id: item.approval_note_id || 'N/A',
                        data: item
                    };
                });
        }

        return tableData.map((item, index) => {
            // Generate truly unique ID by combining multiple properties
            const baseId = item?.cand_doc_id || item?._id || 'no_id';
            const uniqueId = `${baseId}_${index}_${item?.candidate_name || ''}_${item?.project_name || ''}`.replace(/[^a-zA-Z0-9_]/g, '_');

            return {
                id: uniqueId,
                candDocId: item?.cand_doc_id,
                originalId: item?._id,
                serialNumber: index + 1,
                candidateName: item.candidate_name || 'N/A',
                candidate_email: item.candidate_email || 'N/A',
                designation: item.job_designation || 'N/A',
                project_name: item.project_name || 'N/A',
                jobLocation: item.proposed_location || 'N/A',
                dateOfJoin: item.onboarding_date || 'N/A',
                jobSalary: item.offer_ctc || 'N/A',
                candidate_list: item.candidate_list || [],
                employmentMode: item.job_type || 'N/A',
                mpr_offer_type: item.mpr_offer_type || 'N/A',
                job_start_date: item?.onboarding_date || 'N/A',
                job_valid_date: item.job_valid_date || 'N/A',
                approval_note_id: item.approval_note_id || 'N/A',
                data: item
            };
        });
    }, [tableData, searchParams, getParams]);

    // DataGrid columns configuration
    const columns = [
        { field: 'serialNumber', headerName: 'S.no', width: 50 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => {
                if (!params || !params.row) {
                    return null;
                }

                return (
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                    }}>
                        <Tooltip title="Approve" placement="top">
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => HandleRedirection(params.row.data)}
                                sx={{
                                    minWidth: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    backgroundColor: '#1976d2'
                                }}
                            >
                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Download PDF" placement="top">
                            <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => handleDownload(params.row.data)}
                                disabled={pdfLoading}
                                sx={{
                                    minWidth: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    borderColor: '#1976d2',
                                    color: '#1976d2'
                                }}
                            >
                                {pdfLoading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon sx={{ fontSize: 16 }} />}
                            </Button>
                        </Tooltip>
                        <Tooltip title="View History" placement="top">
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => handleViewHistory(params.row.data)}
                                sx={{
                                    minWidth: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    backgroundColor: '#1976d2'
                                }}
                            >
                                <VisibilityIcon sx={{ fontSize: 16 }} />
                            </Button>
                        </Tooltip>
                    </Box>
                );
            }
        },
        {
            field: 'approval_note_id',
            headerName: 'Approval Note ID',
            width: 220,
            renderCell: (params) => {
                if (!params || !params.row) return 'N/A';
                return (
                    <span
                        style={{
                            display: 'block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '13px',
                            color: '#333',
                            fontWeight: '500'
                        }}
                        title={params.row.approval_note_id} // Tooltip for overflow
                    >
                        {params.row.approval_note_id}
                    </span>
                );
            }
        },
        {
            field: 'candidateName',
            headerName: 'Name / Email',
            width: 180,
            renderCell: (params) => {
                if (!params || !params.row) return 'N/A';

                const handleViewClick = () => {
                    setSelectedCandidateData(params.row);
                    setViewCandidateModal(true);
                };

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '40px', justifyContent: 'center' }}>
                        <span
                            style={{
                                cursor: 'pointer',
                                color: '#1976d2',
                                fontWeight: '500',
                                lineHeight: '1.2',
                                wordBreak: 'break-word',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block'
                            }}
                            onClick={() => HandleRedirection(params.row.data)}
                            title={params.row.candidateName} // Tooltip for overflow
                        >
                            {params.row.candidateName}
                        </span>
                        <span style={{
                            fontSize: '11px',
                            color: '#666',
                            lineHeight: '1.1',
                            wordBreak: 'break-word',
                            opacity: 0.8,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                        }}
                            title={params.row.candidate_email} // Tooltip for overflow
                        >
                            {params.row.candidate_email}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 120,
            renderCell: (params) => {
                if (!params || !params.row) return 'N/A';
                const ctc = params.row.data?.offer_ctc;
                const paymentType = params.row.data?.payment_type;
                return ctc ? `₹${ctc}/${paymentType || 'month'}` : 'N/A';
            }
        },
        {
            field: 'project',
            headerName: 'Project / Designation',
            width: 180,
            renderCell: (params) => {
                if (!params || !params.row) return 'N/A';
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minHeight: '40px', justifyContent: 'center' }}>
                        <span style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            lineHeight: '1.2',
                            wordBreak: 'break-word',
                            color: '#333',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                        }}
                            title={params.row.project_name} // Tooltip for overflow
                        >
                            {params.row.project_name}
                        </span>
                        <span style={{
                            fontSize: '11px',
                            color: '#666',
                            lineHeight: '1.1',
                            wordBreak: 'break-word',
                            opacity: 0.9,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                        }}
                            title={params.row.designation} // Tooltip for overflow
                        >
                            {params.row.designation}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'jobLocation',
            headerName: 'Location',
            width: 150,
            renderCell: (params) => {
                if (!params || !params.row) return 'N/A';
                return (
                    <span
                        style={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            fontSize: '13px',
                            color: '#333',
                            fontWeight: '500'
                        }}
                        title={params.row.jobLocation} // Tooltip for overflow
                    >
                        {params.row.jobLocation}
                    </span>
                );
            }
        },
        {
            field: 'dateOfJoin',
            headerName: 'Date of join',
            width: 120,
            renderCell: (params) => {
                if (!params || !params.row) return 'N/A';
                const date = params.row.dateOfJoin;
                return date ? moment(date).format("DD/MM/YYYY") : 'N/A';
            }
        },
        {
            field: 'job_valid_date',
            headerName: 'Contract expiry',
            width: 130,
            renderCell: (params) => {
                if (!params || !params.row) return 'N/A';
                const date = params.row.job_valid_date;
                return date ? moment(date).format("DD/MM/YYYY") : 'N/A';
            }
        },
        {
            field: 'employmentMode',
            headerName: 'Mode of employment',
            width: 160,
            renderCell: (params) => {
                if (!params || !params.row) return 'N/A';
                const jobType = params.row.employmentMode;
                return jobType ? CamelCases(CustomChangesJobType(jobType)) : 'N/A';
            }
        }
    ];

    useEffect(() => {

        if (approvalNotes?.length) {
            setLoader(false)
        }

    }, [approvalNotes?.length])


    useEffect(() => {
        if (approvalNotes?.length) {
            let total = approvalNotes?.length
            if (pagination <= total) {
                setHasMoreStatus(true)
            } else {
                setHasMoreStatus(false)
            }
        }
    }, [approvalNotes?.length, pagination])


    useEffect(() => {

        if (getParams.get('type') && getParams.get('type') !== 'PendingByCeo') {

            getApprovalListByCeo(getParams.get('type'))

        }

    }, [getApprovalListByCeo, getParams, pagination])


    const handleDownload = (data) => {

        setPdfLoading(true)

        const rows = data?.interviewer_list?.length > 0
            ? [...new Map(data.interviewer_list.map(item => [item.emp_doc_id, item])).values()]
                .map((item, index) => `
                  <tr>
                      <td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">${index + 1}</td>
                      <td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">${item.name}</td>
                      <td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">${item.designation}</td>
                      <td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">${data.interview_type === 'Online' ? 'Virtual' : 'On-site'} Interview</td>
                  </tr>
              `).join('')
            : `<tr>
              <td colSpan="4" style="text-align:center;">Record Not Found</td>
           </tr>`;

        const Candidates = getParams.get('type') === 'PendingByCeo' && data ?
            // For PendingByCeo, use single candidate data directly
            `
            <tr>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${1}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${data?.candidate_name || 'N/A'}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${data?.job_designation || '-'}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${data?.proposed_location ? data?.proposed_location : 'Noida'}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">Rs. ${data?.offer_ctc || 'N/A'}/- per ${data?.payment_type ? data?.payment_type : "Annum"}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${formatDateToWeekOf(data?.onboarding_date) || '-'}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${moment(data?.job_valid_date).format("DD-MM-YYYY") || '-'} or till the completion of project</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${CamelCases(CustomChangesJobType(data?.job_type) || '-')}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${data?.interview_shortlist_status === 'Waiting' ? 'Waitlisted' : data?.interview_shortlist_status || '-'}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${data?.mpr_offer_type === 'new' ? CamelCases(data?.mpr_offer_type) + " " + "Position" : CamelCases(data?.mpr_offer_type) || '-'}</td>
            </tr>
        ` :
            // For other types, use candidate_list array
            data?.candidate_list?.length > 0
                ? data.candidate_list.map((item, index) => `
                <tr>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${index + 1}</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${item?.name}</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${data?.job_designation || '-'}</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${item && item?.proposed_location ? item?.proposed_location : 'Noida'}</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">Rs. ${item?.offer_ctc || 'N/A'}/- per ${item?.payment_type ? item?.payment_type : "Annum"}</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${formatDateToWeekOf(item?.onboarding_date) || '-'}</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${moment(item?.job_valid_date).format("DD-MM-YYYY") || '-'} or till the completion of project</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${CamelCases(CustomChangesJobType(item?.job_type) || '-')}</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${item?.interview_shortlist_status === 'Waiting' ? 'Waitlisted' : item?.interview_shortlist_status || '-'}</td>
                    <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${data?.mpr_offer_type === 'new' ? CamelCases(data?.mpr_offer_type) + " " + "Position" : CamelCases(data?.mpr_offer_type) || '-'}</td>
                </tr>
            `).join('')
                : `<tr>
                <td colspan="10" style="text-align: center; border: 1px solid #000;">Record Not Found</td>
               </tr>`

        const styledHtml = `<!DOCTYPE html>
        <html>
        <head>
        	<meta charset="utf-8">
        	<meta name="viewport" content="width=device-width, initial-scale=1">
        	<title>Approval Note</title>
        	<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Poppins', sans-serif; color: #000;">
        	<table style="width:700px; max-width:700px; margin: 0 auto;" center>
        		<tr>
        			<td>
        				<table style="padding:10px; width:100%; border-bottom:1px solid #34209B;">
        					<tr>
        						<td style="text-align: left; padding:10px;">
        							<img src="https://hlfppt.org/wp-content/themes/hlfppt/images/logo.png">
        						</td>

        						<td style="float: right;">
        							<table style="padding:0px; width:100%;">
        								<tr>
        									<td style="text-align:center;">
        									   <table style="border-collapse: collapse;">
        									   	  <tr>
        									   	  	<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Project</td>
        									   	  	<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;"> ${data && CamelCases(data?.mpr_fund_type)} </td>
        									   	  </tr>
        									   	  <tr>
        									   	  	<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;"> Job Portal </td>
        									   	  	<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">(${data && CamelCases(validateTheJobPortal(data?.applied_from)?.join(','))})</td>
        									   	  </tr>
        									   </table>
        									</td>
        								</tr>
        							 </table>
        						</td>
        					</tr>
        					<tr>
        						<td style="text-align:end; width:56%"> 
        							<h4 style="margin-top:0; width:100%; margin-bottom:0;">Approval Note</h4>
        						</td>
        					</tr>
        				 </table>
        			</td>
        		</tr>
        		<tr>
                    <td>
                        <p style="text-align: right; font-weight: 600;">
                            Date: ${data && moment(data?.add_date).format("MMMM DD, YYYY")}
                        </p>
                    </td>      		
                </tr>
        		<tr>
        			<td>
                        <p>
                          It has been proposed to appoint following candidate(s) is/are (selected by the undermentioned panel) as per the details given below:
                        </p>
        			</td>
        		</tr>
        		<tr>
        			<td>
        				<p style="text-decoration:underline;color: #000; font-weight:600">Interviewer Panel List</p>
        			</td>
        		</tr>
        		<tr>
        			<td>
        				<table style="width:100%;border-collapse: collapse;">
        							<tr>
        						  	  	<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Sr. No.</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Name</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Designation</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Mode of interview</td>
        							</tr>
                                   ${rows}
        				</table>
        			</td>
        		</tr>
                <tr>
                    <td>
                       <p>
                            The shortlisted candidate(s) was/ were also reviewed by CEO. Based on the evaluation of candidate(s) interviewed, the below mentioned candidate(s) is/ are proposed for selection.
                       </p>
                    </td>
                </tr>
        		<tr>
        			<td>
        				<p style="text-decoration:underline;color: #000; font-weight:600">Candidates List for the “${data && data?.project_name}” </p>
        			</td>
        		</tr>
        		<tr>
        			<td>
        					<table style="width:100%;border-collapse: collapse;">
        							<tr>
        						  	  	<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Sr. No.</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Name</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Designation</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Proposed Location</td>
                                        <td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Proposed CTC per ${getParams.get('type') === 'PendingByCeo' ? (data?.payment_type || 'Annum') : (data?.candidate_list[0]?.payment_type ? data?.candidate_list[0]?.payment_type : "Annum")}</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Proposed Date of joining</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Contract Period (UPTO)</td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Employment Nature </td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;"> Status </td>
        								<td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;"> Type of Position </td>
        							</tr>
                                     ${Candidates}
        					</table>
        			</td>
        		</tr>
        		<tr>
        			<td>
        				<p>Submitted for your kind approval, please</p>
        			</td>
        		</tr>
                 <tr> 
                    <td><strong style="text-decoration: underline;">Recommended By</strong></td>
                 </tr>
        		<tr>
        			<td style="">
        				${generatePanelMembersTable(data)}
        			</td>
        		</tr>	
                <tr> 
                      <td><strong style="text-decoration: underline;">Approved By</strong></td>
                </tr>
                <tr>
                    <td style="">
        				${generatePanelMembersTableCEO(data)}
        			</td>
                </tr>
        	</table>
        </body>
        </html>`;

        openPrintView(styledHtml)
    };

    const generatePanelMembersTable = (approvalDetails) => {
        if (!approvalDetails || !approvalDetails?.panel_members_list?.length) {
            return `<table style="padding: 20px 0; width: 100%;">
                            <tbody>
                                <tr>
                                    <td style="text-align: center; font-size: 14px; color: #000;">No Panel Members Found</td>
                                </tr>
                            </tbody>
                        </table>`;
        }

        const rows = approvalDetails.panel_members_list
            .filter((item) => item.designation !== 'CEO' && item.emp_doc_id !== 'NA')
            .sort((a, b) => a.priority - b.priority)
            .reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / 2);
                if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [];
                }
                resultArray[chunkIndex].push(item);
                return resultArray;
            }, [])
            .map((row, rowIndex) => `
                    <tr key=${rowIndex} style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                        ${row.map((item, colIndex) => `
                            <td style="padding: 10px 20px; text-align: start;">
                                ${item?.signature && !["", "Pending"].includes(item?.approval_status) ? `
                                    <span style="font-size: 15px; display: block; text-align: ${colIndex === 0 ? 'start' : 'end'};">
                                        <img src="${config.IMAGE_PATH + item?.signature}" alt="signature" height="50" width="100" />
                                    </span>` : `
                                    <span style="font-size: 15px; display: block; height: 50px; width: 60px; text-align: ${colIndex === 0 ? 'start' : 'end'};"></span>`
                }
                                <span style="font-size: 14px; color: #000; display: block; font-weight: 600; text-align: ${colIndex === 0 ? 'start' : 'end'};">
                                    ${item?.designation === 'CEO' ? "Sharad Agarwal" : item?.name}
                                </span>
                                <span style="font-size: 15px; display: inline-block; text-align: ${colIndex === 0 ? 'start' : 'end'};">
                                    ${item?.designation === 'CEO' ? "Chief Executive Officer" : item?.designation}
                                </span>
                            </td>
                        `).join('')}
                    </tr>
                `).join('');

        return `
                <table style="padding: 20px 0; width: 100%;">
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            `;
    };

    const generatePanelMembersTableCEO = (approvalDetails) => {
        if (!approvalDetails || !approvalDetails?.panel_members_list?.length) {
            return `<table style="padding: 20px 0; width: 100%;">
                            <tbody>
                                <tr>
                                    <td style="text-align: center; font-size: 14px; color: #000;">No Panel Members Found</td>
                                </tr>
                            </tbody>
                        </table>`;
        }

        const rows = approvalDetails.panel_members_list
            .filter((item) => item.designation === 'CEO' && item.emp_doc_id === 'NA')
            .reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / 2); // Two members per row
                if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [];
                }
                resultArray[chunkIndex].push(item);
                return resultArray;
            }, [])
            .map((row, rowIndex) => `
                    <tr key=${rowIndex} style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                        ${row.map((item, colIndex) => `
                            <td style="padding: 10px 20px; text-align: start;">
                               ${item?.signature && !["", "Pending"].includes(item?.approval_status) ? `
                                    <span style="font-size: 15px; display: block; text-align: ${colIndex === 0 ? 'start' : 'end'};">
                                        <img src="${config.IMAGE_PATH + item?.signature}" alt="signature" height="50" width="100" />
                                    </span>` : `
                                    <span style="font-size: 15px; display: block; height: 50px; width: 60px; text-align: ${colIndex === 0 ? 'start' : 'end'};"></span>`
                }
                                <span style="font-size: 14px; color: #000; display: block; font-weight: 600; text-align: ${colIndex === 0 ? 'start' : 'end'};">
                                    ${item?.designation === 'CEO' ? "Sharad Agarwal" : item?.name}
                                </span>
                                <span style="font-size: 15px; display: inline-block; text-align: ${colIndex === 0 ? 'start' : 'end'};">
                                    ${item?.designation === 'CEO' ? "Chief Executive Officer" : item?.designation}
                                </span>
                            </td>
                        `).join('')}
                    </tr>
                `).join('');

        return `
                <table style="padding: 20px 0; width: 100%;">
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            `;
    };

    function openPrintView(htmlContent) {
        // Create a new window
        setPdfLoading(false)
        // const printWindow = window.open('', '_blank', 'width=800,height=600');
        // // Write the content to the new window
        // printWindow.document.open();
        // printWindow.document.write(htmlContent);
        // printWindow.document.close();

        // // Wait for the content to load, then trigger print
        // printWindow.onload = () => {
        //     printWindow.print();
        // };

        // /ceo-approval-note
        const width = 900;
        const height = 650;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const printWindow = window.open(
            "",
            "_blank",
            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
        );

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }

    const HandleRedirection = (data) => {

        const CombineStringApprove = `${data?._id}|${'NA'}|${loginUser?.token}`;

        const encodedToken = btoa(CombineStringApprove);

        const redirectUrl = `${config.REACT_APP_API_DOMAIN}/offerApprovalForm/${encodedToken}`;

        setTimeout(() => {
            const url = `/offerApprovalForm/${encodedToken}?goback=no`;
            window.open(url, '_blank', 'noopener,noreferrer'); // new tab
        }, 1000);
    }

    const handleViewHistory = (data) => {
        setData(data)
        setApprovalHistory(true);
    };

    // Bulk action handler for selected rows
    const handleBulkApprove = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one approval note to approve.');
            return;
        }
        setBulkApprovalModal(true);
    };

    // Handle bulk approval submission
    const handleBulkApprovalSubmit = async () => {
        if (!bulkApprovalFeedback.trim()) {
            toast.error('Please provide feedback for the bulk approval.');
            return;
        }

        setBulkApprovalLoading(true);
        try {

            const selectedItems = selectedRows.map(row => row.data);

            const payload = {
                "employee_id": "NA",
                "candidate_ids": selectedItems.map(item => ({
                    "id": item.cand_doc_id,
                    "approval_note_doc_id": item._id
                })),
                "status": bulkApprovalStatus,
                "remark": bulkApprovalFeedback
            };

            let respose = await axios.post(`${config.API_URL}approveApprovalNoteByCeoSir`, payload, apiHeaderToken(config.API_TOKEN));

            if (respose.status === 200) {
                toast.success(`${bulkApprovalStatus} successfully!`);
                await getApprovalNoteByTableView(getParams.get('type'))
                setBulkApprovalFeedback('');
                setBulkApprovalStatus('Approved');
                setSelectedRows([]);
                setBulkApprovalModal(false);
            }

        } catch (error) {
            console.error('Bulk approval error:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
        } finally {
            setBulkApprovalLoading(false);
        }
    };

    return (
        <>
            {/* <CeoNavbarComponent /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='dflexbtwn'>
                        <div className='pagename'>
                            <h3>List of Approval(s) Note</h3>
                            <p>Approval Notes Raise Request Lisitng  </p>
                        </div>
                        <div className='d-flex justify-content-center align-item-center gap-2'>
                            {getParams.get('type') === 'PendingByCeo' && (
                                <div className='pb-3'>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="medium"
                                        onClick={handleBulkApprove}
                                        disabled={selectedRows.length === 0}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Bulk Approve ({selectedRows.length})
                                    </Button>
                                </div>
                            )}
                            <div className='pb-3 cardsearch'>
                                <SearchInput
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClear={() => setSearch('')}
                                />
                            </div>
                        </div>
                    </div>
                    {
                        getParams.get('type') !== 'PendingByCeo' && loader ? <div className="d-flex align-content-center justify-content-center">
                            <InfinitySpin
                                visible={true}
                                width="200"
                                color="#4fa94d"
                                ariaLabel="infinity-spin-loading"
                            /> </div> :

                            <Row xs={1} md={2} lg={3} className="g-4">
                                {
                                    getParams.get('type') !== 'PendingByCeo' && approvalNotes && approvalNotes?.length > 0 ? approvalNotes?.map((item, idx) => {
                                        return (
                                            <>
                                                <Col key={item._id || idx}>
                                                    <Card className="h-100 mprcards">
                                                        <Card.Body>
                                                            <Card.Title className="mb-2 h6"> <span className='colorbluesite'>Approval ID:</span> <span className='text-sitecolor'>{item?.approval_note_id}</span> </Card.Title>
                                                            <div className='cardtxt'>

                                                                <p><strong>Project Name:</strong> <span className='projctname'>{item?.project_name}</span></p>
                                                                <p><strong>Added Date/Time:</strong> <span>{moment(item?.add_date).format("DD/MM/YYYY")}</span></p>

                                                                <p><strong>Number of Candidates:</strong> <span>{item?.no_of_candidates}</span></p>
                                                                <p><strong>Approval Status:</strong> <span>{item?.status}</span></p>
                                                            </div>
                                                            <div className='d-flex apprvalbtns'>
                                                                {getParams.get('type') === 'PendingByCeo' &&
                                                                    <Button
                                                                        variant="contained"
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() => HandleRedirection(item)}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                }
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    color="primary"
                                                                    startIcon={pdfLoading ? <CircularProgress size={16} color="inherit" /> : <FaEye />}
                                                                    onClick={() => handleDownload(item)}
                                                                    disabled={pdfLoading}
                                                                >
                                                                    {pdfLoading ? "Dowloading...." : "View Approval"}
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => handleViewHistory(item)}
                                                                >
                                                                    View History
                                                                </Button>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </>
                                        )
                                    }) :
                                        getParams.get('type') !== 'PendingByCeo' && (
                                            <Col>
                                                <Card className="h-100 mprcards">
                                                    <Card.Body>
                                                        Records Not Found
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        )
                                }

                                {
                                    getParams.get('type') !== 'PendingByCeo' && hasMoreStatus && (
                                        <Col sm={12} className='apprvloadmrbtn w-100 text-center mb-4'>
                                            <Button type='button' onClick={hasMore}>
                                                View More
                                            </Button>
                                        </Col>
                                    )
                                }
                            </Row>
                    }

                    {
                        getParams.get('type') === 'PendingByCeo' && loader ? <div className="d-flex align-content-center justify-content-center">
                            <InfinitySpin
                                visible={true}
                                width="200"
                                color="#4fa94d"
                                ariaLabel="infinity-spin-loading"
                            /> </div> :

                            getParams.get('type') === 'PendingByCeo' && tableData && tableData?.length > 0 ?
                                <Box sx={{ width: '100%', marginTop: 2 }}>
                                    <DataGrid
                                        rows={rows || []}
                                        columns={columns}
                                        checkboxSelection
                                        disableRowSelectionOnClick={false}
                                        pageSize={10}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 10 },
                                            },
                                        }}
                                        pageSizeOptions={[5, 10, 20, 40, 50]}
                                        rowHeight={80}
                                        onRowSelectionModelChange={(newSelection) => {
                                            // Convert selected IDs to full row data objects
                                            const selectedRowData = rows.filter(row =>
                                                newSelection.includes(row.id)
                                            );
                                            setSelectedRows(selectedRowData);
                                        }}
                                        disableColumnFilter
                                        disableColumnSelector
                                        disableDensitySelector
                                        sx={{
                                            '& .MuiDataGrid-cell:focus': {
                                                outline: 'none',
                                            },
                                            '& .MuiDataGrid-row:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                        }}
                                    />
                                </Box>
                                :
                                getParams.get('type') === 'PendingByCeo' && (
                                    <Box sx={{ width: '100%', marginTop: 2, textAlign: 'center', padding: 4 }}>
                                        <Paper sx={{ padding: 3 }}>
                                            <strong>Records Not Found</strong>
                                        </Paper>
                                    </Box>
                                )
                    }
                </div>
            </div>

            {/* <RecordsModal openModalApprovalHistory={openModalApprovalHistory} handleClosedShowApprovalHistory={handleClosedShowApprovalHistory} data={data} setData={setData} getApprovalListByJobId={getApprovalListByJobId} /> */}

            {
                getParams.get('type') === 'PendingByCeo' ? (
                    <Modal show={openModalApprovalHistory} onHide={() => setApprovalHistory(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Approval History</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='h-auto'>
                            <Accordion defaultActiveKey="0" alwaysOpen>
                                {!data ? <h4 className='text-center'> No Records Found </h4> :
                                    <Accordion.Item eventKey='0' key='0'>
                                        <Accordion.Header>
                                            Candidate Name - {CamelCases(data?.candidate_name)}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Row className='mb-3'>
                                                <Col sm={3}>
                                                    <span> <strong style={{ fontSize: '14px', fontWeight: '640' }} >CTC Amount</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}>{data?.offer_ctc}</p> </span>
                                                </Col>
                                                <Col sm={3}>
                                                    <span> <strong style={{ fontSize: '14px', fontWeight: '640' }} >Onboarding Date</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}> {moment(data?.onboarding_date).format('DD-MM-YYYY')} </p>  </span>
                                                </Col>
                                                <Col sm={3}>
                                                    <span> <strong style={{ fontSize: '14px', fontWeight: '640' }}>Contract End Date</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}> {moment(data?.job_valid_date).format('DD-MM-YYYY')} </p>  </span>
                                                </Col>
                                                <Col sm={3}>
                                                    <span> <strong style={{ fontSize: '14px', fontWeight: '640' }}>Employment Nature</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}>{changeJobTypeLabel(data?.job_type)}</p> </span>
                                                </Col>
                                            </Row>

                                            <Table striped bordered hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Sr No.</th>
                                                        <th>Name</th>
                                                        <th>Designation</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                        <th>Remark</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data?.panel_members_list?.length > 0 ? (
                                                        data.panel_members_list?.filter((member) => member?.designation !== 'CEO').map((member, idx) => {
                                                            const memberDetails = data?.approval_history?.find(
                                                                (panelMember) => panelMember?.emp_doc_id === member?.emp_doc_id
                                                            );
                                                            return (
                                                                <tr key={idx}>
                                                                    <td>{idx + 1}</td>
                                                                    <td>{CamelCases(member?.name) || 'N/A'}</td>
                                                                    <td>{member?.designation || 'N/A'}</td>
                                                                    <td>{memberDetails?.approval_status || 'N/A'}</td>
                                                                    <td>
                                                                        {memberDetails?.approved_date
                                                                            ? moment(memberDetails?.approved_date).format('DD/MM/YYYY')
                                                                            : 'N/A'}
                                                                    </td>
                                                                    <td>{memberDetails?.remark || 'N/A'}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={6} className="text-center">
                                                                No Records Found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                }
                            </Accordion>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setApprovalHistory(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                ) : (
                    <Modal show={openModalApprovalHistory} onHide={() => setApprovalHistory(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Approval History</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='h-auto'>
                            <Accordion defaultActiveKey="0">
                                {data?.candidate_list?.length <= 0 ? <h4 className='text-center'> No Records Found </h4> : data?.candidate_list?.map((item, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index}>
                                        <Accordion.Header>
                                            Candidate Name - {CamelCases(item?.name)}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Row className='mb-3'>
                                                <Col sm={3}>
                                                    <span> <strong style={{ fontSize: '14px', fontWeight: '640' }} >CTC Amount</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}>{item?.offer_ctc}</p> </span>
                                                </Col>
                                                <Col sm={3}>
                                                    <span> <strong style={{ fontSize: '14px', fontWeight: '640' }} >Onboarding Date</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}> {moment(item?.onboarding_date).format('DD-MM-YYYY')} </p>  </span>
                                                </Col>
                                                <Col sm={3}>
                                                    <span> <strong style={{ fontSize: '14px', fontWeight: '640' }}>Contract End Date</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}> {moment(item?.job_valid_date).format('DD-MM-YYYY')} </p>  </span>
                                                </Col>
                                                <Col sm={3}>
                                                    <span> <strong style={{ fontSize: '14px', fontWeight: '640' }}>Employment Nature</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}>{changeJobTypeLabel(item?.job_type)}</p> </span>
                                                </Col>
                                            </Row>

                                            <Table striped bordered hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Sr No.</th>
                                                        <th>Name</th>
                                                        <th>Designation</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                        <th>Remark</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item?.approval_history?.length > 0 ? (
                                                        item.approval_history.map((member, idx) => {
                                                            const memberDetails = data?.panel_members_list?.find(
                                                                (panelMember) => panelMember?.emp_doc_id === member?.emp_doc_id
                                                            );
                                                            return (
                                                                <tr key={idx}>
                                                                    <td>{idx + 1}</td>
                                                                    <td>{CamelCases(memberDetails?.name) || 'N/A'}</td>
                                                                    <td>{memberDetails?.designation || 'N/A'}</td>
                                                                    <td>{member?.approval_status || 'N/A'}</td>
                                                                    <td>
                                                                        {member?.approved_date
                                                                            ? moment(member?.approved_date).format('DD/MM/YYYY')
                                                                            : 'N/A'}
                                                                    </td>
                                                                    <td>{member?.remark || 'N/A'}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={6} className="text-center">
                                                                No Records Found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>

                                            {/* <Box sx={{ display: 'flex', justifyContent: 'end', gap: 3, mt: 2 }}>
                    {item?.approval_history?.length > 0 && (
                      <>
                        <Button
                          color="success"
                          variant="contained"
                          startIcon={<CheckCircleIcon />}
                          onClick={(e) => haringStatus(e, item, 'Approved')}
                          disabled={loading === 'Approved'}
                        >
                          Approve
                        </Button>
                        <Button
                          color="warning"
                          variant="contained"
                          startIcon={<PauseCircleIcon />}
                          onClick={(e) => haringStatus(e, item, 'Hold')}
                          disabled={loading === 'Hold'}
                        >
                          Hold
                        </Button>
                      </>
                    )}
                    {['Inprogress'].includes(data?.status) && (
                      <Button
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={(e) => handleDeleteCandidate(e, item)}
                        disabled={loading === 'Hold'}
                      >
                        Delete
                      </Button>
                    )}
                  </Box> */}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setApprovalHistory(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )
            }



            {/* Candidate Details Modal */}
            <Modal show={viewCandidateModal} onHide={() => setViewCandidateModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Candidate Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCandidateData && (
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <strong>Name:</strong> {selectedCandidateData.candidateName}
                                </div>
                                <div className="mb-3">
                                    <strong>Email:</strong> {selectedCandidateData.candidate_email}
                                </div>
                                <div className="mb-3">
                                    <strong>Designation:</strong> {selectedCandidateData.designation}
                                </div>
                                <div className="mb-3">
                                    <strong>Project:</strong> {selectedCandidateData.project_name}
                                </div>
                                <div className="mb-3">
                                    <strong>Location:</strong> {selectedCandidateData.jobLocation}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <strong>Date of Joining:</strong> {selectedCandidateData.dateOfJoin ? moment(selectedCandidateData.dateOfJoin).format("DD/MM/YYYY") : 'N/A'}
                                </div>
                                <div className="mb-3">
                                    <strong>Contract Expiry:</strong> {selectedCandidateData.candidate_list?.[0]?.job_valid_date ? moment(selectedCandidateData.candidate_list[0].job_valid_date).format("DD/MM/YYYY") : 'N/A'}
                                </div>
                                <div className="mb-3">
                                    <strong>Employment Mode:</strong> {selectedCandidateData.candidate_list?.[0]?.job_type ? CamelCases(CustomChangesJobType(selectedCandidateData.candidate_list[0].job_type)) : 'N/A'}
                                </div>
                                <div className="mb-3">
                                    <strong>Salary:</strong> {selectedCandidateData.candidate_list?.[0]?.offer_ctc ? `₹${selectedCandidateData.candidate_list[0].offer_ctc}/${selectedCandidateData.candidate_list?.[0]?.payment_type || 'month'}` : 'N/A'}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setViewCandidateModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={bulkApprovalModal} onHide={() => setBulkApprovalModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Status *</label>
                        <div className="d-flex gap-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="bulkApprovalStatus"
                                    id="approved"
                                    value="Approved"
                                    checked={bulkApprovalStatus === 'Approved'}
                                    onChange={(e) => setBulkApprovalStatus(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="approved">
                                    Approve
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="bulkApprovalStatus"
                                    id="rejected"
                                    value="Rejected"
                                    checked={bulkApprovalStatus === 'Rejected'}
                                    onChange={(e) => setBulkApprovalStatus(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="rejected">
                                    Reject
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="bulkApprovalStatus"
                                    id="need_to_discusss"
                                    value="need_to_discusss"
                                    checked={bulkApprovalStatus === 'need_to_discusss'}
                                    onChange={(e) => setBulkApprovalStatus(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="need_to_discusss">
                                    Need to discuss
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Feedback *</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            style={{ height: 160 }}
                            placeholder="Enter your feedback for bulk approval..."
                            value={bulkApprovalFeedback}
                            onChange={(e) => setBulkApprovalFeedback(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() => setBulkApprovalModal(false)}
                            disabled={bulkApprovalLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="success"
                            variant="contained"
                            onClick={handleBulkApprovalSubmit}
                            disabled={bulkApprovalLoading || !bulkApprovalFeedback.trim()}
                        >
                            {bulkApprovalLoading ? 'Processing...' : 'Submit'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>

    )
}

export default ApprovalTableCeo;
