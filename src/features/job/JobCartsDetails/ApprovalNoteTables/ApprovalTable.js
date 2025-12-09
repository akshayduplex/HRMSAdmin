import React, { memo, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import config from '../../../../config/config';
import { apiHeaderToken } from '../../../../config/api_header';
import html2pdf from 'html2pdf.js';
import { Modal } from 'react-bootstrap';
import RecordsModal from './ShowApprovalHistory';
import { CircularProgress } from '@mui/material';
import { CamelCases, changeJobTypeLabel, CustomChangesJobType, formatDateToWeekOf, validateTheJobPortal } from '../../../../utils/common';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the Delete icon
import DeleteConfirmationModal from './DeleteMprModal';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import SendIcon from '@mui/icons-material/Send';
import MailIcon from '@mui/icons-material/Mail';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';


function ApprovalTable({ approvalNotes, setMember, setOpenMemberList, setListApproval, getApprovalListByJobId, handlePaginationModelChange, paginationModel, approvalNoteLoading }) {
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState(null);
    const [openModalApprovalHistory, setApprovalHistory] = useState(false);
    const AppliedCandidateListCount = useSelector((state) => state.appliedJobList.AppliedCandidateListCount)
    const [pdfLoading, setPdfLoading] = useState(false)
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const location = useLocation();
    /**
     * @description This Fun has been deprecated
     * @deprecated  in this Update has been deprecated.
     */

    const handleMenuOpen = (event, params) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(params.row);
    };

    /**
     * @description This Fun has been deprecated
     * @deprecated  in this Update has been deprecated.
     */
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };



    let rows = approvalNotes && approvalNotes?.length > 0 ?
        approvalNotes?.map((item, index) => {
            return {
                id: index + 1 + paginationModel.page * paginationModel.pageSize,
                approvalId: item?.approval_note_id,
                addedDateTime: item?.add_date,
                numberOfCandidates: item?.no_of_candidates,
                approvalStatus: item?.status,
                project_name: item?.project_name,
                data: item
            }
        }) : []

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
        const Candidates = data?.candidate_list?.length > 0
            ? data.candidate_list.map((item, index) => `
            <tr>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${index + 1}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${item?.name}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${data?.job_designation || '-'}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">${item && item?.proposed_location ? item?.proposed_location : 'Noida'}</td>
                <td style="border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;">Rs. ${item?.offer_ctc || 'N/A'}/- per ${item?.payment_type ? item?.payment_type : "Annum"}</td>
                ${data.candidate_list?.some((item) => item?.working_days) ?
                    `<td style='border: 1px solid #000; font-size: 14px; padding: 8px; text-align: left; font-weight: 500;'>${item?.working_days || '-'}</td>`
                    :
                    ""
                }
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
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
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
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <p style="font-weight: 600; margin: 0;">
                        Approval Note ID: ${data && data?.approval_note_id}
                        </p>
                        <p style="font-weight: 600; margin: 0;">
                        Date: ${data && moment(data?.approval_date ? data?.approval_date : data?.add_date).format("MMMM DD, YYYY")}
                        </p>
                    </div>
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
                                        <td style="border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;">Proposed CTC per ${data?.candidate_list[0]?.payment_type ? data?.candidate_list[0]?.payment_type : "Annum"}</td>
                                        ${data?.candidate_list?.some((item) => item?.working_days) ?
                "<td style='border:1px solid #000;font-size:14px;padding:8px;text-align:left; font-weight:500;'>Working Days</td>"
                :
                ""
            }
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

    // generate Panel Member List

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
                                    ${item?.name === '' ? "Respected Sir" : item?.name}
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
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        // Write the content to the new window
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for the content to load, then trigger print
        printWindow.onload = () => {
            printWindow.print();
        };
    }


    const handleViewHistory = (data) => {
        setData(data)
        setApprovalHistory(true);
    };

    const handleClosedShowApprovalHistory = () => {
        setApprovalHistory(false);
        setData(null)
    }

    const handleResendApproval = (data) => {
        setMember({ approval_note_doc_id: JSON.parse(JSON.stringify(data))?._id })
        setOpenMemberList(true);
    };

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

    const handleSendOfferLetterOpenInNewTabs = (data) => {

        localStorage.setItem('approval_node_location', location.pathname + location.search)
        // let 
        window.open(`/approval-candidate-list/${data._id}`, '_blank');
    };


    const columns = [
        {
            field: 'id',
            headerName: 'Sr. No.',
            flex: 0.5,
            minWidth: 60,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'Action',
            headerName: 'Action',
            flex: 1,
            minWidth: 140,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '7px',
                    padding: '6px',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Common styles for IconButton */}

                    {/* Download Icon */}
                    <Tooltip
                        title="Download"
                        arrow placement="top"
                        componentsProps={getTooltipStyle('#1976d2')} // Primary blue
                    >
                        <IconButton
                            onClick={() => handleDownload(params.row.data)}
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.25)',
                                }
                            }}
                        >
                            <DownloadIcon sx={{ fontSize: '1.2rem', color: '#1976d2' }} />
                        </IconButton>
                    </Tooltip>

                    {/* View History Icon */}
                    <Tooltip
                        title="View History"
                        arrow placement="top"
                        componentsProps={getTooltipStyle('#2e7d32')} // Success green
                    >
                        <IconButton
                            onClick={() => handleViewHistory(params.row.data)}
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                boxShadow: '0 2px 4px rgba(46, 125, 50, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'rgba(46, 125, 50, 0.12)',
                                    boxShadow: '0 4px 8px rgba(46, 125, 50, 0.25)',
                                }
                            }}
                        >
                            <HistoryIcon sx={{ fontSize: '1.2rem', color: '#2e7d32' }} />
                        </IconButton>
                    </Tooltip>

                    {/* Resend Approval Icon */}
                    <Tooltip
                        title="Resend Approval"
                        arrow placement="bottom"
                        componentsProps={getTooltipStyle('#9c27b0')} // Purple
                    >
                        <IconButton
                            onClick={() => handleResendApproval(params.row.data)}
                            size="small"
                            sx={{
                                ...commonIconButtonStyle,
                                backgroundColor: 'rgba(156, 39, 176, 0.08)',
                                boxShadow: '0 2px 4px rgba(156, 39, 176, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'rgba(156, 39, 176, 0.12)',
                                    boxShadow: '0 4px 8px rgba(156, 39, 176, 0.25)',
                                }
                            }}
                        >
                            <SendIcon sx={{ fontSize: '1.2rem', color: '#9c27b0' }} />
                        </IconButton>
                    </Tooltip>



                    {/* Delete Icon */}
                    {params.row.data?.status === 'Inprogress' ? (
                        <Tooltip
                            title="Delete"
                            arrow placement="bottom"
                            componentsProps={getTooltipStyle('#d32f2f')} // Error red
                        >
                            <IconButton
                                onClick={() => handleOpenDeleteConfirmation(params.row.data)}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                    boxShadow: '0 2px 4px rgba(211, 47, 47, 0.15)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(211, 47, 47, 0.12)',
                                        boxShadow: '0 4px 8px rgba(211, 47, 47, 0.25)',
                                    }
                                }}
                            >
                                <DeleteIcon sx={{ fontSize: '1.2rem', color: '#d32f2f' }} />
                            </IconButton>
                        </Tooltip>
                    ) : null
                    }
                    {/* Send Offer Later for the new Topics to Handle Role Users -  */}
                    {params.row.data?.status === 'Completed' ? (
                        <Tooltip
                            title="Send Offer Letter"
                            arrow placement="bottom"
                            componentsProps={getTooltipStyle('#2196f3')} // Using blue for offer letter
                        >
                            <IconButton
                                onClick={() => handleSendOfferLetterOpenInNewTabs(params.row.data)}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                    boxShadow: '0 2px 4px rgba(33, 150, 243, 0.15)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 150, 243, 0.12)',
                                        boxShadow: '0 4px 8px rgba(33, 150, 243, 0.25)',
                                    }
                                }}
                            >
                                <MailIcon sx={{
                                    fontSize: '1.2rem',
                                    color: '#2196f3',
                                    transform: 'rotate(-15deg)'
                                }} />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <div />
                    )}
                </div>
            )
        },
        {
            field: 'approvalId',
            headerName: 'Approval Id',
            flex: 1.5,
            minWidth: 180,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <div style={{ width: '100%', padding: '8px 4px', marginTop: '15px' }}>
                        <span className="cell-with-ellipsis" style={{
                            fontWeight: '500',
                            width: '100%',
                            lineHeight: '1.2'
                        }}>
                            {params.value}
                        </span>
                        <span className="cell-with-ellipsis" style={{
                            fontSize: '0.85em',
                            color: '#666',
                            width: '100%',
                            lineHeight: '1.2'
                        }}>
                            {params.row.data?.mpr_offer_type === 'new' ? CamelCases(params.row.data?.mpr_offer_type) + ' Position' : CamelCases(params.row.data?.mpr_offer_type) || '-'}
                        </span>
                    </div>
                </Tooltip>
            ),
        },
        {
            field: 'project_name',
            headerName: 'Project / Designation',
            flex: 2,
            minWidth: 200,
            renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    padding: '4px',
                    width: '100%',
                    height: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'center'
                }}>
                    <span className="cell-with-ellipsis" style={{
                        fontWeight: '500',
                        width: '100%',
                        lineHeight: '1.2'
                    }}>
                        {params.row?.project_name}
                    </span>
                    <span className="cell-with-ellipsis" style={{
                        fontSize: '0.85em',
                        color: '#666',
                        width: '100%',
                        lineHeight: '1.2'
                    }}>
                        {params.row.data?.job_designation || '-'}
                    </span>
                </div>
            ),
        },
        {
            field: 'approvalStatus',
            headerName: 'Status',
            flex: 0.8,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'numberOfCandidates',
            headerName: 'Candidate(s)',
            flex: 0.8,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'addedDateTime',
            headerName: 'Added Date/Time',
            flex: 1,
            minWidth: 130,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <span className="cell-with-ellipsis">
                            {moment(params.value).format('DD/MM/YYYY')}
                        </span>
                    </div>
                </Tooltip>
            ),
        },
    ];

    const closedDelete = () => setOpenDelete(false);

    // Handle Open confirmation Modal to Delete the MPR Approval Form -
    const handleOpenDeleteConfirmation = (data) => {
        setDeleteData(data)
        setOpenDelete(true)
    }

    return (
        <>
            <div style={{ height: '100%', width: '100%' }}>
                <style>
                    {`
                    .cell-with-ellipsis {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: block;
                    }
                `}
                </style>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={AppliedCandidateListCount.status === 'success' ? AppliedCandidateListCount.data?.approval_note : 0}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    filterMode="server"
                    pageSizeOptions={[10, 20, 30, 50, 75, 99]}
                    loading={approvalNoteLoading}
                    rowHeight={80}
                    disableColumnMenu // Removes unnecessary column menu for a cleaner UI
                />
            </div>

            <RecordsModal openModalApprovalHistory={openModalApprovalHistory} handleClosedShowApprovalHistory={handleClosedShowApprovalHistory} data={data} setData={setData} getApprovalListByJobId={getApprovalListByJobId} />
            <DeleteConfirmationModal open={openDelete} handleClose={closedDelete} data={deleteData} rows={rows} setListApproval={setListApproval} approvalNotes={approvalNotes} />
        </>
    )
}

export default memo(ApprovalTable);
