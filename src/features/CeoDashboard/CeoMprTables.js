import React, { useCallback, useEffect, useState } from 'react';
import { PiDownloadSimpleFill } from "react-icons/pi";
import { ManPowerAcquisitionsSliceCard } from '../slices/JobSortLIstedSlice/SortLIstedSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import config from '../../config/config';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ReSendMprProject from './ReSendModalMPR';
// import AlertDialogSlide from './CeoConfirmatioModal'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, Button as MuiButton } from '@mui/material';
import { AiOutlinePrinter } from 'react-icons/ai';
import { changeJobTypeLabel } from '../../utils/common';


export default function RequisitionTableCeo({ searchParamsInput, setSelectedRows }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [searchParams] = useSearchParams()
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('admin_role_user')) || {}
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 9 });
    const [hasMoreStatus, setHasMoreStatus] = useState(false)
    // const [noReload , setNoReloads] = useState()
    const [firstLoading, setFirstLoading] = useState(true); // <-- add this

    const { ManPowerRequisitionCard } = useSelector((state) => state.shortList)

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
                const sortedData = [...nonCEOs, ...ceos];

                return sortedData.map((item, newIndex) => `
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

        // // Create a new window
        // const printWindow = window.open('', '_blank', 'width=800,height=600');
        // // Write the content to the new window
        // printWindow.document.open();
        // printWindow.document.write(htmlContent);
        // printWindow.document.close();

        // // Wait for the content to load, then trigger print
        // printWindow.onload = () => {
        //     printWindow.print();
        // };
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
    };

    // Styled MUI Tooltip with custom colors
    const StyledTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#29166f', // slate-800
            color: '#ffffff',
            fontSize: 12,
            borderRadius: 6,
            boxShadow: theme.shadows[3],
            maxWidth: 300,
            whiteSpace: 'pre-wrap'
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: '#1f2937',
        },
    }));

    // DataGrid columns configuration
    const columns = [
        {
            field: 'title',
            headerName: 'MPR No',
            width: 150,
            renderCell: (params) => (
                <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                    {params.value || 'N/A'}
                </span>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    {params.row.status === 'Pending' && (
                        <Tooltip title="Approve MPR" placement="top">
                            <MuiButton
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRedirectOnApprovalPage(e, params.row.rawData || params.row);
                                }}
                                sx={{
                                    minWidth: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    backgroundColor: '#1976d2'
                                }}
                            >
                                <CheckCircleIcon sx={{ fontSize: 16 }} />

                            </MuiButton>
                        </Tooltip>
                    )}

                    {params.row.status === 'Pending' && (
                        <Tooltip title="Print MPR" placement="top">
                            <MuiButton
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadPdf(params.row.rawData || params.row);
                                }}
                                sx={{
                                    minWidth: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    backgroundColor: '#1976d2'
                                }}
                            >
                                <FaEye size={16} />

                            </MuiButton>
                        </Tooltip>
                    )}

                    {!(params.row.requisition_form?.includes('undefined')) && (
                        <>
                            <Tooltip title="Download Document" placement="top">
                                <MuiButton
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const link = document.createElement('a');
                                        link.href = params.row.requisition_form;
                                        link.download = true;
                                        link.target = '_blank';
                                        link.rel = 'noopener noreferrer';
                                        link.click();
                                    }}
                                    sx={{
                                        minWidth: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        padding: 0,
                                        borderColor: '#1976d2',
                                        color: '#1976d2'
                                    }}
                                >
                                    <PiDownloadSimpleFill size={16} />
                                </MuiButton>
                            </Tooltip>
                            <Tooltip title="Preview Document" placement="top">
                                <MuiButton
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenPreviewImage(e, params.row.requisition_form);
                                    }}
                                    sx={{
                                        minWidth: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        padding: 0,
                                        backgroundColor: '#1976d2'
                                    }}
                                >
                                    {/* <FaEye size={16} /> */}
                                    <AiOutlinePrinter sx={{ fontSize: 16 }} />

                                </MuiButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
            )
        },
        {
            field: 'raised_on',
            headerName: 'Date of Request',
            width: 130,
            renderCell: (params) => params.row.raised_on || 'N/A'
        },
        {
            field: 'project_details',
            headerName: 'Project / Department / Designation',
            width: 250,
            renderCell: (params) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minHeight: '60px', justifyContent: 'center' }}>
                    <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        lineHeight: '1.2',
                        wordBreak: 'break-word',
                        color: '#333',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                    }}
                        title={params.row.project_name}
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
                        title={params.row.department_name}
                    >
                        {params.row.department_name}
                    </span>
                    <span style={{
                        fontSize: '11px',
                        color: '#888',
                        lineHeight: '1.1',
                        wordBreak: 'break-word',
                        opacity: 0.8,
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                    }}
                        title={params.row.designation_name}
                    >
                        {params.row.designation_name}
                    </span>
                </div>
            )
        },
        {
            field: 'project_duration',
            headerName: 'Duration',
            width: 120
        },
        {
            field: 'type_of_opening',
            headerName: 'Type',
            width: 130,
            renderCell: (params) => {
                const typeMap = {
                    'new': 'New Opening',
                    'replacement': 'Replacement',
                    'planned_addition': 'Planned Addition'
                };
                return typeMap[params.value] || params.value;
            }
        },
        {
            field: 'no_of_vacancy',
            headerName: 'Vacancies',
            width: 100,
            type: 'number'
        },
        {
            field: 'place_of_posting',
            headerName: 'Place of Posting',
            width: 220,
            renderCell: (params) => {
                const locations = params.value?.map(p => `${p.location_name}${p.state_name ? `, ${p.state_name}` : ''}`) || [];
                const firstLocation = locations[0];
                const remainingLocations = locations.slice(1).join('; ');

                return (
                    <span>
                        {firstLocation}
                        {locations.length > 1 && (
                            <StyledTooltip title={remainingLocations} placement="bottom" arrow>
                                <span
                                    style={{ color: '#1976d2', cursor: 'help', marginLeft: 6 }}
                                >
                                    ...View more
                                </span>
                            </StyledTooltip>
                        )}
                    </span>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'Pending' ? 'warning' : 'default'}
                    size="small"
                />
            )
        }
    ];

    useEffect(() => {

        if (ManPowerRequisitionCard?.status === 'success') {
            setFirstLoading(false)
        }

    }, [ManPowerRequisitionCard?.status])

    useEffect(() => {
        const isPendingByCeo = searchParams.get('type') === 'PendingByCeo';
        let Payloads = {
            "keyword": "",
            page_no: isPendingByCeo ? 1 : paginationModel.page + 1,
            per_page_record: isPendingByCeo ? 1000 : paginationModel.pageSize, // Fetch all data for table view
            "scope_fields": [],
            "status": "",
            "filter_type": searchParams.get('type') ? searchParams.get('type') : '',
            "filter_keyword": searchParamsInput,
            "project_name": searchParams.get('project_name') ? searchParams.get('project_name') : '',
            "project_id": searchParams.get('project_id') ? searchParams.get('project_id') : ''
        }
        dispatch(ManPowerAcquisitionsSliceCard(Payloads))
    }, [dispatch, paginationModel.page, paginationModel.pageSize, searchParams, searchParamsInput])

    const hasMore = () => {
        setPaginationModel({ pageSize: paginationModel.pageSize + 9 })
    }


    useEffect(() => {
        if (ManPowerRequisitionCard.status === 'success') {
            let total = ManPowerRequisitionCard.data?.length
            if (paginationModel.pageSize <= total) {
                setHasMoreStatus(true)
            } else {
                setHasMoreStatus(false)
            }
        }
    }, [ManPowerRequisitionCard.status, ManPowerRequisitionCard.data, paginationModel.pageSize])

    const handleOpenPreviewImage = (e, data) => {
        setOpen(true)
        setImageUrl(data)
    }

    const handleRedirectOnApprovalPage = (e, data) => {
        e.preventDefault();
        const CombineString = `${data._id}|CEO|CEO|${userDetails?.token}|CEO|NA`;
        const encodedToken = btoa(CombineString);
        setTimeout(() => {
            navigate(`/mprFrm/${encodedToken}?goback=yes`)
        }, 1000);
    };

    // Create separate row instances for DataGrid
    const createDataGridRows = () => {
        if (!ManPowerRequisitionCard?.data) return [];

        return ManPowerRequisitionCard.data.map((item, index) => ({
            id: item._id || index,
            _id: item._id,
            title: item.title,
            raised_on: item.raised_on,
            project_name: item.project_name,
            department_name: item.department_name,
            designation_name: item.designation_name,
            project_duration: item.project_duration,
            type_of_opening: item.type_of_opening,
            no_of_vacancy: item.no_of_vacancy,
            place_of_posting: item.place_of_posting,
            status: item.status,
            requisition_form: item.requisition_form,
            // Add any other fields you need
            rawData: item // Keep reference to original data
        }));
    };

    const isPendingByCeoView = searchParams.get('type') === 'PendingByCeo';

    return (
        <>
            {
                firstLoading && ManPowerRequisitionCard?.status === 'loading' ?
                    <div className="d-flex align-content-center justify-content-center">
                        <InfinitySpin
                            visible={true}
                            width="200"
                            color="#4fa94d"
                            ariaLabel="infinity-spin-loading"
                        />
                    </div> :

                    isPendingByCeoView ? (
                        // DataGrid Table View for PendingByCeo
                        <Box sx={{ height: 600, width: '100%' }}>

                            <DataGrid
                                rows={createDataGridRows()}
                                columns={columns}
                                disableRowSelectionOnClick={false}
                                pageSize={10}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[5, 10, 20, 40, 50]}
                                rowHeight={80}
                                checkboxSelection
                                onRowSelectionModelChange={(newSelection) => {
                                    setSelectedRows(newSelection);
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
                    ) : (
                        // Original Card View
                        <Row xs={1} md={2} lg={3} className="g-4 mt-0">
                            {
                                ManPowerRequisitionCard?.data?.length > 0 && ManPowerRequisitionCard?.data?.map((key, idx) => {
                                    const locations = key.place_of_posting.map(p => `${p.location_name}${p.state_name ? `, ${p.state_name}` : ''}`);
                                    const firstLocation = locations[0];
                                    const remainingLocations = locations.slice(1).join('; ');
                                    return (
                                        <>
                                            <Col key={key._id || idx}>
                                                <Card className="h-100 mprcards">
                                                    <Card.Body>
                                                        <Card.Title className="mb-2"> <span className='colorbluesite'>MPR No:</span> <span className='text-sitecolor'>{key.title || 'N/A'}</span> </Card.Title>
                                                        <div className='cardtxt'>
                                                            <p><strong>Date of Request:</strong> <span>{key.raised_on}</span></p>
                                                            <p><strong>Project Name:</strong> <span className='projctname'>{key.project_name}</span></p>
                                                            <p><strong>Department:</strong> <span>{key.department_name}</span></p>
                                                            <p><strong>Designation:</strong><span> {key.designation_name}</span> </p>
                                                            <p> <strong>Project Duration:</strong> <span>{key.project_duration}</span> </p>
                                                            <p> <strong>Type:</strong> <span>{key.type_of_opening === 'new' ? 'New Opening' :
                                                                key.type_of_opening === 'replacement' ? 'Replacement' :
                                                                    'Planned Addition'}</span> </p>
                                                            <p> <strong>No. of Vacancies:</strong><span> {key.no_of_vacancy}</span> </p>
                                                            <p> <strong>Place of Posting:</strong>
                                                                <span>
                                                                    {firstLocation}
                                                                    {locations.length > 1 && (
                                                                        <StyledTooltip title={remainingLocations} placement="bottom" arrow>
                                                                            <span
                                                                                className="view-more"
                                                                                style={{ color: '#1976d2', cursor: 'help', marginLeft: 6 }}
                                                                            >
                                                                                ...View more
                                                                            </span>
                                                                        </StyledTooltip>
                                                                    )}
                                                                </span>
                                                            </p>
                                                            <p> <strong>Status:</strong> <span>{key?.status}</span> </p>
                                                            <p className='d-flex align-items-center'> <strong>MPR Doc:</strong>
                                                                <div className='d-flex gap-2 align-items-center justify-content-evenly'>
                                                                    {
                                                                        !(key?.requisition_form?.includes('undefined')) && (
                                                                            <>
                                                                                <a
                                                                                    href={key?.requisition_form}
                                                                                    download
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    <button className="downlddoc mprdwnld">
                                                                                        <PiDownloadSimpleFill size={20} />
                                                                                    </button>
                                                                                </a>

                                                                                <div
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={(e) => handleOpenPreviewImage(e, key?.requisition_form)}
                                                                                >
                                                                                    <AiOutlinePrinter size={20} />

                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }
                                                                    <button className="downlddoc mprdwnld" onClick={() => handleDownloadPdf(key)}>
                                                                        <FaEye size={20} />
                                                                    </button>
                                                                </div>
                                                            </p>
                                                            {
                                                                key?.status === 'Pending' &&
                                                                <Button className='crdbtnbg' onClick={(e) => handleRedirectOnApprovalPage(e, key)}>
                                                                    Approve
                                                                </Button>
                                                            }
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </>
                                    )
                                })
                            }

                            {
                                hasMoreStatus && (
                                    <Col sm={12} className='apprvloadmrbtn w-100 text-center mb-4'>
                                        <Button type='button' onClick={hasMore}>
                                            View More
                                        </Button>
                                    </Col>
                                )
                            }
                        </Row>
                    )
            }
            <Modal show={open} onHide={() => setOpen(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Document Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className='h-auto'>
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
        </>
    )
}

