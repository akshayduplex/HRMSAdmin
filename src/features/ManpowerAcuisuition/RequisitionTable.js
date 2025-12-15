import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Link } from 'react-router-dom';
import { PiDownloadSimpleFill } from "react-icons/pi";
import ApprovalModal from "./ApprovalModal"
import { ManPowerAcquisitionsSingleRecords, ManPowerAcquisitionsSlice } from '../slices/JobSortLIstedSlice/SortLIstedSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import config from '../../config/config';
import { FaEye } from 'react-icons/fa';
import Slide from '@mui/material/Slide';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import axios from 'axios';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import { toast } from 'react-toastify';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import ReSendMprProject from './ReSendModalMPR';
import AlertDialogSlide from './CeoConfirmatioModal';
import {
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/FileDownload';
import { changeJobTypeLabel } from '../../utils/common';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import EmployeeReplacementModal from './EmpReplacementModal';
import LocationEditModal from './EditLocation';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const CustomToolbar = ({ csvOptions }) => (
    <GridToolbarContainer>
        <GridToolbarExport csvOptions={csvOptions} />
        <GridToolbarQuickFilter />
    </GridToolbarContainer>
);


export default function RequisitionTable({ filterRecords }) {
    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [searchParams] = useSearchParams()
    const [imageUrl, setImageUrl] = useState(null);
    const [projectDetails, setProjectDetials] = useState(null);

    const [confirmation, setOpenConfirmation] = React.useState(false);
    const [formData, setFormData] = useState(null);
    const [reSendOpen, setReSendOpen] = useState(false);
    const userDetails = JSON.parse(localStorage.getItem('admin_role_user')) || {}
    const [loading, setAllSendLoading] = useState(false)
    const [mprDocId, setMPRdocId] = useState(null)
    const [confirm, setConfirm] = useState(false);
    const [getReqisitionDataToSendEmailForCEO, setCEOData] = useState(null);
    const [fetchRecordLoading, setFetchRecordLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [total, setTotalRecords] = useState(0);
    const [openReplaceModal, setOpenReplaceModal] = useState(false);
    const [selectModalData, setSelectedModalData] = useState(false);
    const [locationEditOpen, setLocationEditOpen] = useState(false);
    const [currentMprData, setCurrentMprData] = useState(null);
    const loginUserDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem('admin_role_user')) || {}
    }, [])
    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleOpenReplaceApprovalMemberModal = async (data) => {
        // let response = await dispatch(ManPowerAcquisitionsSlice(Payloads)).unwrap()
        let payloads = { "_id": data?._id }
        let response = await dispatch(ManPowerAcquisitionsSingleRecords(payloads)).unwrap()

        if (response) {
            setSelectedModalData(response);
            setOpenReplaceModal(true);
        }
    }
    const handleSaveLocation = async (updatedData) => {
        try {
            const payload = {
                _id: updatedData._id,
                place_of_posting: updatedData.place_of_posting
            };

            const response = await axios.post(
                `${config.API_URL}editRequisitionData`,
                payload,
                apiHeaderTokenMultiPart(config.API_TOKEN)
            );

            if (response.status === 200) {
                toast.success('Posting locations updated successfully');

                const Payloads = {
                    keyword: "",
                    page_no: paginationModel.page + 1,
                    per_page_record: paginationModel.pageSize,
                    scope_fields: [],
                    filter_keyword: filterModel?.quickFilterValues?.join(" ").toLowerCase(),
                    project_name: searchParams.get('project_name') || '',
                    project_id: searchParams.get('project_id') || '',
                };

                // add status ONLY if required
                if (searchParams.get('type') === 'pending') {
                    Payloads.status = 'Pending';
                }

                dispatch(ManPowerAcquisitionsSlice(Payloads));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update locations');
        }
    };


    // Update the handleOpenLocationEdit function
    const handleOpenLocationEdit = (data) => {
        setCurrentMprData(data);
        setLocationEditOpen(true);
    };
    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel);
    };

    const handleClickOpen = (data) => {
        setOpenConfirmation(true);
        setFormData(data)
    };

    const handleClose = () => {
        setOpenConfirmation(false);
    };


    const { ManPowerRequisition } = useSelector((state) => state.shortList)


    useEffect(() => {
        let Payloads = {
            "keyword": "",
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            "scope_fields": [],
            "status": searchParams.get('type') === 'pending' ? 'Pending' : '',
            "filter_keyword": filterModel?.quickFilterValues?.join(" ").toLowerCase(),
            "project_name": filterRecords?.projectName ? filterRecords?.projectName : searchParams.get('project_name') ? searchParams.get('project_name') : '',
            "project_id": filterRecords?.projectId ? filterRecords?.projectId : searchParams.get('project_id') ? searchParams.get('project_id') : '',
            "designation_id": filterRecords?.designationId ? filterRecords?.designationId : ''
        }
        dispatch(ManPowerAcquisitionsSlice(Payloads))
    }, [dispatch, searchParams, filterModel, paginationModel.page, paginationModel.pageSize, filterRecords])

    useEffect(() => {
        let Payloads = {
            "keyword": "",
            page_no: 1,
            "per_page_record": "1000", "scope_fields": [],
            isTotalCount: 'yes',
            "status": searchParams.get('type') === 'pending' ? 'Pending' : '',
            "filter_keyword": filterModel?.quickFilterValues?.join(" ").toLowerCase(),
            "project_name": filterRecords?.projectName ? filterRecords?.projectName : searchParams.get('project_name') ? searchParams.get('project_name') : '',
            "project_id": filterRecords?.projectId ? filterRecords?.projectId : searchParams.get('project_id') ? searchParams.get('project_id') : '',
            "designation_id": filterRecords?.designationId ? filterRecords?.designationId : ''
        }
        dispatch(ManPowerAcquisitionsSlice(Payloads)).unwrap()
            .then((response) => {
                if (response?.count === 'yes') {
                    setTotalRecords(response?.total)
                }
            })
    }, [dispatch, searchParams, filterModel, filterRecords])

    const handleDownloadPdf = async (passData) => {
        const htmlContent = `
            <html>
            <head>
            <meta charset="UTF-8">
            <style>
                /* Global Styles */
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 8mm;
                    font-size: 10pt;
                    color: #000;
                }
                
                /* Header Styles */
                .header {
                    display: flex;
                    align-items: flex-start;
                    page-break-after: avoid;
                }
                .logo {
                    height: 27mm;
                    width: 45mm;
                    margin-right: 5mm;
                }
                .header-text {
                    flex: 1;
                }
                .header-text h1 {
                    font-size: 12pt;
                    margin: 24mm 0 2mm 10mm;
                    text-align: left;
                }
                
                /* Table Styles */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 3mm 0;
                    font-size: 9pt;
                    page-break-inside: auto;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 2mm;
                    text-align: left;
                    vertical-align: top;
                }
                th {
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
                .candidates-table th,
                .candidates-table td {
                    padding: 1mm 2mm;
                }
                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
                
                /* Job Description Styles */
                .job-description {
                    margin: 4mm 0;
                }
                .job-description ol {
                    margin: 2mm 0;
                    padding-left: 5mm;
                }
                .job-description li {
                    margin-bottom: 1.5mm;
                }
                
                /* Signature Section */
                .signature-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    justify-content: space-between;
                    margin-top: 5mm;
                    font-size: 9pt;
                    page-break-inside: avoid;
                }
                .signature-box {
                    width: 50%;
                }
                .ceo-section {
                    text-align: right;
                    margin-top: 25mm;
                }
                .logo-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                
                /* Fallback for missing images */
                .logo-fallback {
                    width: 100%;
                    height: 100%;
                    background-color: #f0f0f0;
                    border: 1px dashed #ccc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 9pt;
                    color: #666;
                }

                .job-description-content {
                    font-family: Arial, sans-serif;
                    font-size: 9pt;
                    line-height: 1.4;
                }

                .job-description-content * {
                    margin: 0 0 1mm 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: inherit;
                    font-size: inherit;
                    color: inherit;
                    line-height: inherit;
                }

                .job-description-content ol,
                .job-description-content ul {
                    margin-left: 5mm;
                    padding-left: 3mm;
                }

                .job-description-content li {
                margin-bottom: 1mm;
                }

                .job-description-content p {
                    margin-bottom: 0.5mm;
                }

                .job-description-content img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 2mm auto;
                }
                
                /* Page Break Control */
                .page-break {
                    page-break-before: always;
                }
                .avoid-break {
                    page-break-inside: avoid;
                }
                
                /* Utilities */
                .bold {
                    font-weight: bold;
                }
                .mt-1 { margin-top: 3mm; }
                .mb-1 { margin-bottom: 3mm; }
                .text-right { text-align: right; }
                .signature-wrapper {
                    display: inline-block;
                    min-width: 100px;
                }
            </style>
            </head>
            <body>
            <!-- Header with Logo -->
            <div class="header avoid-break">
                <div class="logo">
                    ${config.LOGO_PATH ?
                `<img src="${config.LOGO_PATH}" class="logo-img" alt="Company Logo">` :
                `<div class="logo-fallback">[Company Logo]</div>`
            }
                </div>
                <div class="header-text">
                    <h1>Manpower Requisition Request</h1>
                </div>
            </div>
            
            <div class="avoid-break">
                <p>This requisition is to formally request for your approval for the position of <span class="bold">${passData.designation_name || '[Position Name]'}</span> to support our <span class="bold">${passData.project_name}</span> as raised by the HOD / Project Head.</p>
            </div>

            <!-- Candidates Table -->
            <table class="candidates-table avoid-break">
                <thead>
                <tr>
                    <th width="15%">Sr. No.</th>
                    <th width="35%">NAME</th>
                    <th width="50%">DESIGNATION</th>
                </tr>
                </thead>
                <tbody>
                    ${passData?.activity_data?.length > 0 ?
                passData.activity_data
                    .filter(item => item?.designation !== 'CEO' && item?.type !== 'raised')
                    .map((item, index) => `
                            <tr>
                                <td>${index + 1}.</td>
                                <td>${item?.name || 'N/A'}</td>
                                <td>${item?.type === 'raised' ?
                            item?.designation :
                            (item?.employee_designation && item?.employee_designation !== 'CEO' ?
                                `${item.designation === 'HR' ? "Corporate HR" : item?.designation}` :
                                item?.designation) || 'N/A'}</td>
                            </tr>
                        `).join('') :
                `<tr><td colspan="3">Records Not Found</td></tr>`
            }
                </tbody>
            </table>
            
            <!-- Manpower Requisition Details -->
            <h3 class="avoid-break">Manpower Requisition Details</h3>
            <table class="avoid-break">
                <thead>
                <tr>
                    <th width="10%">MPR No.</th>
                    <th width="15%">Designation</th>
                    <th width="15%">Type of Opening</th>
                    <th width="12%">Budget</th>
                    <th width="12%">Location</th>
                    <th width="12%">Mode of Employment</th>
                    <th width="12%">Experience</th>
                    <th width="12%">Positions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="bold">${passData.title || 'MPR12345'}</td>
                    <td>${passData.designation_name || 'RPO'}</td>
                    <td>${passData.type_of_opening || 'New Position/Replacement'}</td>
                    <td>${passData.ctc_per_annum + " (Annum)" || '1,50,000/- Monthly'}</td>
                    <td>${passData?.place_of_posting?.map(item => item?.location_name).join(', ') || 'Noida'}</td>
                    <td>${changeJobTypeLabel(passData.mode_of_employment) || 'Consultant'}</td>
                    <td>${passData.maximum_experience || '5 Yrs.'}</td>
                    <td>${passData.no_of_vacancy || '0'}</td>
                </tr>
                </tbody>
            </table>
            
            <!-- Reporting & Grade -->
            <div class="mt-1 avoid-break">
                <p><span class="bold">Generated By:</span> ${passData?.activity_data?.find(item => item?.type === 'raised')?.name || '' || 'Associate National Lead'}</p>
                <p><span class="bold">Reporting:</span> ${passData.project_name || 'Associate National Lead'}</p>
                <p><span class="bold">Grade:</span> ${passData.grade || '5'}</p>
            </div>


            
            <!-- Job Description -->
            <div class="job-description">
                <h3 class="avoid-break">Job Description</h3>
                <div class="job-description-content">
                    ${passData?.job_description || ``}
                </div>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                ${passData?.activity_data?.length > 0 &&
            (() => {
                // Separate non-CEOs and CEOs
                const nonCEOs = passData.activity_data.filter(item => item?.designation !== 'CEO' && item?.type !== 'raised');
                const ceos = passData.activity_data.filter(item => item?.designation === 'CEO');
                const sortedData = [...nonCEOs, ...ceos]; return sortedData.map((item, newIndex) => `
                            <div class="signature-box" style="width: 100%; text-align: ${newIndex % 2 === 0 ? 'start' : 'end'}; margin-bottom: 10px;">
                                <div style="
                                    width: 80px; 
                                    height: 50px; 
                                    overflow: hidden;
                                    display: ${item?.signature && item?.status !== 'Pending' ? 'inline-block' : 'none'};
                                    text-align: ${newIndex % 2 === 0 ? 'left' : 'right'};
                                ">
                                    <img 
                                        src="${config.IMAGE_PATH + (item?.signature || 'placeholder.jpg')}" 
                                        alt="Signature" 
                                        style="
                                            width: 100%;
                                            height: 100%;
                                            object-fit: contain;
                                            object-position: center;
                                            display: block;
                                        "
                                    >
                                </div>
                                <p style="display: ${item?.type === 'raised' ? "none" : 'block'}">${item?.name}</p>
                                <p>
                                    ${item?.designation === 'HR'
                        ? "Corporate HR"
                        : item?.designation === 'HOD'
                            ? item?.designation
                            : item?.employee_designation
                                ? `${item.employee_designation}`
                                : item?.designation
                    }
                                </p>
                            </div>
                        `).join('');
            })()
            }
            </div>
            </body>
            </html>
        `;

        // Create a new window
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        // Write the content to the new window
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for the content to load, then trigger print
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    const handleShow = (e, data) => {
        e.preventDefault()
        setShow(true)
        setVisible(data);
    };

    const handleOpenPreviewImage = (e, data) => {
        setOpen(true)
        setImageUrl(data)
    }

    const changeTypeOfOpening = (type) => {
        if (type === 'new') {
            return 'New Opening'
        } else if (type === 'replacement') {
            return 'Replacement'
        } else if (type === 'plant_non_budgeted') {
            return 'Planned Addition budgeted/Non-budgeted'
        }
    }

    const handleDeleteRequisition = async () => {
        try {
            let Payloads = {
                "_id": formData?.value?._id,
                "filename": formData?.value?.requisition_form
            }
            let response = await axios.post(`${config.API_URL}deleteRequisitionDataById`, Payloads, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                handleClose();
                let Payloads = {
                    "keyword": "",
                    "page_no": "1",
                    "per_page_record": "1000", "scope_fields": [],
                    "status": "",
                    "project_name": searchParams.get('project_name') ? searchParams.get('project_name') : '',
                    "project_id": searchParams.get('project_id') ? searchParams.get('project_id') : ''
                }
                dispatch(ManPowerAcquisitionsSlice(Payloads))
                toast.success(response?.data?.message)
            } else {
                toast.error(response?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const rows = ManPowerRequisition.status === 'success' && Array.isArray(ManPowerRequisition.data?.data)
        ? ManPowerRequisition.data?.data.map((key, index) => {
            return {
                id: index + 1 + paginationModel.page * paginationModel.pageSize,
                fID: index + 1 + paginationModel.page * paginationModel.pageSize,
                projectDepartment: {
                    name: key?.project_name,
                    department: key?.department_name,
                },
                placeofPosting: {
                    places: key?.place_of_posting?.map((item) =>
                        `${item.location_name}, ${item?.state_name ? item?.state_name : ''}`).join(','),
                },
                Posting_Location: key?.place_of_posting?.map((item) =>
                    `${item.location_name}, ${item?.state_name ? item?.state_name : ''}`).join(','),
                status: {
                    value1: key?.status,
                    value2: 'CEO Approval Pending',
                    value3: 'HOD Approval Pending',
                },
                feedBack: {
                    comment_1: "Interpersonal skills are great. Technically sound",
                    comment_2: "Matching the skill sets we required. Considering for CEO round",
                },
                value: key,
                dateofRequest: key?.raised_on && moment.utc(key.raised_on).isValid()
                    ? moment.utc(key.raised_on).format('DD/MM/YYYY')
                    : moment.utc().format('DD/MM/YYYY'),
                designation: key?.designation_name,
                type: changeTypeOfOpening(key?.type_of_opening),
                timeFrame: key?.vacancy_frame,
                noofVacancies: key?.no_of_vacancy,
                NoticePeriod: key?.vacancy_frame,
                Title: key?.title ? key?.title : 'N/A',
                Project_Name: key?.project_name,
                Department: key?.department_name,
                Status: key?.status,
                Filename: key?.requisition_form,
                "project_duration": key?.project_duration
            };
        }) : [];

    // Get Single Project By Id Base in the Requision for Data ->>>
    const getSingleProjectById = async (id) => {
        try {

            let paylods = {
                "_id": id,
                "scope_fields": ["in_charge_list", "manager_list", "_id"]
            }
            setFetchRecordLoading(true)

            let response = await axios.post(`${config.API_URL}getProjectById`, paylods, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setProjectDetials(response.data?.data)
                setFetchRecordLoading(false)
            } else {
                toast.error(response?.data?.message)
                setFetchRecordLoading(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Someting went wrong");
            setFetchRecordLoading(false)
        }
    }

    const handleResendMPR = async (data, GetmprData = null) => {

        // Open the modal in case of HOD
        if (GetmprData && GetmprData?.project_id && data?.designation === 'HOD') {
            getSingleProjectById(GetmprData?.project_id)
            setMPRdocId(GetmprData?._id)
            setReSendOpen(true);
        }
        // Send the Email if the Case Are CEO
        else if (GetmprData && GetmprData?.project_id && data?.designation === 'CEO') {
            setConfirm(true);
            setCEOData(GetmprData)
        }
    }

    // Re-send Mpr Email To CEO  
    const handleSendMPRToEmailToCEO = useCallback(async (data = '') => {
        if (!data) {
            return;
        }
        try {
            setAllSendLoading(true)
            let Payloads = {
                "mpr_doc_id": data?._id,
                "project_id": data?.project_id,
                "add_by_name": userDetails?.name,
                "add_by_mobile": userDetails?.mobile_no,
                "add_by_designation": userDetails?.designation,
                "add_by_email": userDetails?.email
            }
            let response = await axios.post(`${config.API_URL}sendRequisitionApprovalEmailToCeo`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message);
                setConfirm(false)
            } else {
                toast.error(response.data.message);
            }
            setAllSendLoading(false)
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Someting Went Wrong");
            setAllSendLoading(false)
        }
    }, [userDetails?.designation, userDetails?.email, userDetails?.mobile_no, userDetails?.name])


    const commonIconButtonStyle = {
        width: '35px',
        height: '35px',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-2px)',
        }
    }

    const getTooltipStyle = (color) => ({
        sx: {
            bgcolor: color,
            color: 'white',
            fontSize: '0.75rem',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '& .MuiTooltip-arrow': {
                color: color,
            },
        },
    });

    const handleSaveAndClose = async (hasClosed = '', updatedData) => {
        try {

            if (!selectModalData) return toast.error('Something Went Wrong');
            let payloadsForMPRSave = {
                mpr_doc_id: updatedData?._id,
                employee_list: updatedData?.activity_data?.filter((item) => item?.type !== 'raised' && item?.designation !== 'CEO')?.reduce((acc, item) => {
                    let data = [];
                    if (item?.employee_doc_id) {
                        data.push({
                            id: item?.employee_doc_id,
                            designation: item?.designation,
                            priority: item?.priority || 0
                        })
                    }
                    // if (item?.designation === 'CEO') {
                    //     data.push({
                    //         id: "NA",
                    //         designation: item?.designation,
                    //         priority: item?.priority || 0
                    //     })
                    // }
                    if (data.length > 0) {
                        acc.push(...data);
                    }
                    return acc;
                }, []),
                "add_by_name": loginUserDetails?.name,
                "add_by_mobile": loginUserDetails?.mobile_no,
                "add_by_designation": loginUserDetails?.designation,
                "add_by_email": loginUserDetails?.email,
            }

            let response = await axios.post(`${config.API_URL}assignEmployeeOnMPRForApproval`, payloadsForMPRSave, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                toast.success(response.data.message);
                let payloads = { "_id": selectModalData?._id }
                let updatedResult = await dispatch(ManPowerAcquisitionsSingleRecords(payloads)).unwrap()
                let Payloads = {
                    "keyword": "",
                    page_no: paginationModel.page + 1,
                    per_page_record: paginationModel.pageSize,
                    "scope_fields": [],
                    "status": searchParams.get('type') === 'pending' ? 'Pending' : '',
                    "filter_keyword": filterModel?.quickFilterValues?.join(" ").toLowerCase(),
                    "project_name": searchParams.get('project_name') ? searchParams.get('project_name') : '',
                    "project_id": searchParams.get('project_id') ? searchParams.get('project_id') : ''
                }
                dispatch(ManPowerAcquisitionsSlice(Payloads))

                if (updatedResult) {
                    setSelectedModalData(updatedResult);
                }
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error?.response.data.message || error.message || "Something Went Wrong");
        } finally {
            if (hasClosed !== 'NO') {
                setOpenReplaceModal(false)
            }
        }
    }

    const columns = [
        {
            field: "fID",
            headerName: "ID",
            width: 50,
            renderCell: (params) => (
                <>
                    <p className="color-blue">{params.row?.fID}</p>
                </>

            ),
        },
        {
            field: 'Action',
            headerName: 'Action',
            width: 180,
            renderCell: (params) => {
                const status = params.row?.value?.status;

                return (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '6px',
                        padding: '4px',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Download & View Icons */}
                        {!(params.row?.value?.requisition_form?.includes('undefined')) && (
                            <>
                                <Tooltip title="Download MPR" arrow placement="top" componentsProps={{
                                    tooltip: getTooltipStyle('#1976d2')
                                }} >
                                    <IconButton
                                        href={params.row?.value?.requisition_form}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        sx={{
                                            ...commonIconButtonStyle,
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            boxShadow: '0 2px 4px rgba(25, 118, 210, 0.15)',
                                            padding: '6px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.25)',
                                            }
                                        }}
                                    >
                                        <PiDownloadSimpleFill style={{ fontSize: '1.1rem', color: '#1976d2' }} />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip
                                    title="Preview MPR"
                                    arrow placement="top"
                                    componentsProps={{
                                        tooltip: getTooltipStyle('#2e7d32')
                                    }}
                                >
                                    <IconButton
                                        onClick={(e) => handleOpenPreviewImage(e, params.row?.value?.requisition_form)}
                                        size="small"
                                        sx={{
                                            ...commonIconButtonStyle,
                                            backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                            boxShadow: '0 2px 4px rgba(46, 125, 50, 0.15)',
                                            padding: '6px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(46, 125, 50, 0.12)',
                                                boxShadow: '0 4px 8px rgba(46, 125, 50, 0.25)',
                                            }
                                        }}
                                    >
                                        <FaEye style={{ fontSize: '1.1rem', color: '#2e7d32' }} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}

                        {/* Approve Button */}
                        {['Active', 'Pending'].includes(status) && (
                            <Tooltip
                                title="Approve MPR"
                                arrow placement="bottom"
                                componentsProps={{
                                    tooltip: getTooltipStyle('#9c27b0')
                                }}
                            >
                                <IconButton
                                    onClick={(e) => handleShow(e, params.row?.value)}
                                    size="small"
                                    sx={{
                                        ...commonIconButtonStyle,
                                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                                        boxShadow: '0 2px 4px rgba(156, 39, 176, 0.15)',
                                        padding: '6px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(156, 39, 176, 0.12)',
                                            boxShadow: '0 4px 8px rgba(156, 39, 176, 0.25)',
                                        }
                                    }}
                                >
                                    <CheckCircleIcon style={{ fontSize: '1.1rem', color: '#9c27b0' }} />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* Edit Button */}
                        {['Active', 'Pending'].includes(status) && (
                            <Tooltip
                                title="Edit MPR"
                                arrow placement="bottom"
                                componentsProps={{
                                    tooltip: getTooltipStyle('#ed6c02')
                                }}
                            >
                                <IconButton
                                    component={Link}
                                    to={`/manpower-acquisition?id=${params.row?.value._id}`}
                                    size="small"
                                    sx={{
                                        ...commonIconButtonStyle,
                                        backgroundColor: 'rgba(237, 108, 2, 0.08)',
                                        boxShadow: '0 2px 4px rgba(237, 108, 2, 0.15)',
                                        padding: '6px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(237, 108, 2, 0.12)',
                                            boxShadow: '0 4px 8px rgba(237, 108, 2, 0.25)',
                                        }
                                    }}
                                >
                                    <EditIcon style={{ fontSize: '1.1rem', color: '#ed6c02' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {['Active', 'Pending'].includes(status) && (
                            <Tooltip title="Edit Location" arrow placement="bottom" componentsProps={{ tooltip: getTooltipStyle('#7b1fa2') }}>
                                <IconButton
                                    onClick={() => handleOpenLocationEdit(params.row?.value)}
                                    size="small"
                                    sx={{
                                        ...commonIconButtonStyle,
                                        backgroundColor: 'rgba(123, 31, 162, 0.08)', // purple shade
                                        '&:hover': {
                                            backgroundColor: 'rgba(123, 31, 162, 0.12)',
                                            boxShadow: '0 4px 8px rgba(123, 31, 162, 0.25)',
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="none" stroke="#7b1fa2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                                    </svg>
                                </IconButton>
                            </Tooltip>
                        )}
                        {/* Delete Button */}
                        {['Pending'].includes(status) && (
                            <Tooltip
                                title="Delete MPR"
                                arrow placement="bottom"
                                componentsProps={{
                                    tooltip: getTooltipStyle('#d32f2f')
                                }}
                            >
                                <IconButton
                                    onClick={() => handleClickOpen(params.row)}
                                    size="small"
                                    sx={{
                                        ...commonIconButtonStyle,
                                        backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                        boxShadow: '0 2px 4px rgba(211, 47, 47, 0.15)',
                                        padding: '6px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(211, 47, 47, 0.12)',
                                            boxShadow: '0 4px 8px rgba(211, 47, 47, 0.25)',
                                        }
                                    }}
                                >
                                    <DeleteIcon style={{ fontSize: '1.1rem', color: '#d32f2f' }} />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip
                            title="Download MPR Format"
                            arrow
                            placement="bottom"
                            componentsProps={{
                                tooltip: getTooltipStyle('#1976d2') // blue
                            }}
                        >
                            <IconButton
                                onClick={() => handleDownloadPdf(params.row?.value)}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    padding: '6px',
                                    '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                    },
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    color: '#1976d2'
                                }}
                            >
                                <DownloadIcon fontSize="small" style={{ color: '#1976d2' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            title="Replace Member"
                            arrow
                            placement="bottom"
                            componentsProps={{
                                tooltip: getTooltipStyle('#f57c00') // orange
                            }}
                        >
                            <IconButton
                                onClick={() => handleOpenReplaceApprovalMemberModal(params.row?.value)}
                                size="small"
                                sx={{
                                    ...commonIconButtonStyle,
                                    padding: '6px',
                                    '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                    },
                                    backgroundColor: 'rgba(245, 124, 0, 0.08)', // light orange background
                                    color: '#f57c00'
                                }}
                            >
                                <SwapHorizIcon fontSize="small" style={{ color: '#f57c00' }} />
                            </IconButton>
                        </Tooltip>


                    </div>
                );
            }
        },
        {
            field: "Title",
            headerName: "MPR Number",
            width: 160,
        },
        {
            field: 'Filename',
            headerName: 'Filename',
            width: 100,
        },
        {
            field: 'Project_Name',
            headerName: 'Project_Name',
            width: 100,
        },
        {
            field: 'Status',
            headerName: 'Status',
            width: 100,
        },
        {
            field: 'Posting_Location',
            headerName: 'Posting_Location',
            width: 100,
        },
        {
            field: 'Department',
            headerName: 'Department',
            width: 100,
        },
        {
            field: "dateofRequest",
            headerName: "Date of Request",
            width: 140,
        },
        {
            field: "projectDepartment",
            headerName: "Project/Department", // this i dont wanna in export file
            width: 160,
            renderCell: (params) => (
                <div className='projectinfo empinfo lineBreack p-0'>
                    <p>{params.row?.projectDepartment?.name},</p>
                    <p>{params.row?.projectDepartment?.department}</p>
                </div>
            ),
        },
        {
            field: "designation",
            headerName: "Designation",
            width: 300,
        },
        {
            field: "project_duration",
            headerName: "Project Duration",
            width: 150,
        },
        {
            field: "type",
            headerName: "Type",
            type: "number",
            width: 180,
            renderCell: (params) => (
                <div className="recomd_tag lineBreack p-0">
                    <span className="">{params.row?.type}</span>
                </div>
            ),
        },
        {
            field: "timeFrame",
            headerName: "Time Frame(In Days)",
            type: "number",
            width: 150,

        },
        {
            field: "noofVacancies",
            headerName: "No. of Vacancies",
            type: "number",
            width: 150,

        },
        {
            field: "placeofPosting",
            headerName: "Place of Posting",
            type: "number",
            width: 150,
            renderCell: (params) => {
                const text = params.row?.placeofPosting?.places || '';
                const isLongText = text.length > 150;
                const displayText = isLongText ? `${text.slice(0, 150)}...` : text;
                return (
                    <Tooltip title={isLongText ? text : ''} placement="top" arrow>
                        <div className="recomd_tag lineBreack p-0">
                            <span>{displayText}</span>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            field: "status",
            headerName: "Status", // also i wanna stutus 
            type: "number",
            width: 250,
            renderCell: (params) => (
                <div className='stats_txt lineBreack p-0'>
                    <h6 className='stats_hdng'>
                        {params.row?.status?.value1} ,
                    </h6>
                    {
                        params.row?.value?.activity_data?.length !== 0 &&
                        params.row?.value?.activity_data?.map((item, index) => {
                            return (
                                <span key={index}>
                                    <div className='d-flex'>
                                        <p>{`${item?.name} ${item?.status}, `}</p>
                                        {/* {(item?.designation === 'CEO' || item?.designation === 'HOD') && item?.status !== 'Approved' && item?.status !== 'Reject' && (
                                            <Button
                                                className="apprvbtn"
                                                onClick={() => handleResendMPR(item, params.row?.value)}
                                                type='button'
                                                style={{ marginLeft: "5px", marginBottom: '5px', fontSize: '8px' }}
                                            >
                                                Send Email
                                            </Button>
                                        )} */}
                                    </div>
                                </span>
                            );
                        })
                    }
                </div>
            ),
        },
    ];

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        Project_Name: false,
        Department: false,
        Posting_Location: false,
        Status: false,
        Filename: false,
        Title: true,
    });


    const exportableColumns = ["fID", "Title", "dateofRequest", "Project_Name", "designation", "Department", "type", "noofVacancies", "Posting_Location", 'NoticePeriod', "timeFrame", 'Status', 'Filename'];

    return (
        <>
            <div className="mainprojecttable requstntable">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={150}
                    initialState={{
                        columns: {
                            columnVisibilityModel: columnVisibilityModel
                        },
                    }}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) => {
                        setColumnVisibilityModel(newModel);
                    }}
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    paginationMode="server"
                    filterMode="server"
                    pageSizeOptions={[10, 20, 50, 75, 100]}
                    loading={ManPowerRequisition.status === 'loading'}
                    rowCount={total}
                    disableColumnSelector
                    disableDensitySelector
                    disableColumnFilter={false}
                    filterModel={filterModel}
                    onFilterModelChange={handleFilterModelChange}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    slotProps={{
                        toolbar: {
                            csvOptions: {
                                fields: exportableColumns,
                                fileName: 'requisition-data',
                            },
                        },
                    }}
                    sx={{
                        height: '800px',
                    }}
                />
            </div>

            <ApprovalModal show={show} onHide={() => setShow(false)} data={visible} />
            {/* Document Review - Modal */}
            <Modal show={open} onHide={() => setOpen(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Document Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: '100%', overflow: 'auto' }}>
                        {(() => {
                            // Check if the file is a PDF
                            const fileExtension = imageUrl && imageUrl?.split('.').pop().toLowerCase();
                            if (fileExtension === 'pdf') {
                                return (
                                    <embed
                                        src={imageUrl}
                                        type="application/pdf"
                                        width="100%"
                                        height="600px"
                                        style={{ borderRadius: '5px' }}
                                    />
                                );
                            }

                            // Check if the file is a DOC or DOCX
                            if (fileExtension === 'doc' || fileExtension === 'docx') {
                                return (
                                    <iframe
                                        src={`https://docs.google.com/viewer?url=${imageUrl}&embedded=true`}
                                        title="Document Preview"
                                        style={{ width: '100%', height: '400px' }}
                                    />

                                );
                            }

                            // Handle other file types or unknown formats
                            return (
                                <p>Unsupported file format. Please <a href={config.IMAGE_PATH + imageUrl} download>download the file</a>.</p>
                            );
                        })()}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Delete Confirmation Modal - */}
            <Dialog
                open={confirmation}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete Requisition Form?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-requisition-description">
                        Are you sure ? you want to delete {formData && formData?.Title} requisition form.
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className='apprvbtn' onClick={handleClose}>Disagree</button>
                    <button className='danderBtb' onClick={handleDeleteRequisition}>Agree</button>
                </DialogActions>
            </Dialog>
            {/* Edit Location Modal */}
            <LocationEditModal
                open={locationEditOpen}
                setOpen={setLocationEditOpen}
                currentMprData={currentMprData}
                onSave={handleSaveLocation}
            />
            {/* Re-send Modal */}
            <ReSendMprProject open={reSendOpen} setOpenClosed={setReSendOpen} Data={projectDetails} mprDocId={mprDocId} setProjectDetials={setProjectDetials} loadingToFetch={fetchRecordLoading} />
            {/* alert Diolods Alert Site ---- */}
            <AlertDialogSlide open={confirm} setConfirmNoConfirm={setConfirm} handleSendMPRToEmailToCEO={handleSendMPRToEmailToCEO} getReqisitionDataToSendEmailForCEO={getReqisitionDataToSendEmailForCEO} />
            {/* Employee Replacement Modal */}
            <EmployeeReplacementModal open={openReplaceModal} setOpen={setOpenReplaceModal} data={selectModalData} setModalData={setSelectedModalData} handleSaveAndClose={handleSaveAndClose} />
        </>
    )
}

