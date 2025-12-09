import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import AllHeaders from "../partials/AllHeaders";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import GoBackButton from "../goBack/GoBackButton";
import { Grid, IconButton, Paper, Tab, Table, TableBody, TableCell, TableRow, Tabs } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { useParams, useSearchParams } from "react-router-dom";
import moment from "moment";

// Dynamic tab labels
const tabData = [
    { label: 'Referral A', id: 'refA' },
    { label: 'Referral B', id: 'refB' },
    { label: 'Referral C', id: 'refC' }
];

// Simulated referral details (null = no record)
const referralDetails = {
    refA: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        address: '123 Main Street, NY',
        phone: '555-1234'
    },
    refB: null,  // No record for Referral B
    refC: {
        name: 'Robert Brown',
        email: 'robert.brown@example.com',
        address: '789 Elm St, TX',
        phone: '555-9012'
    }
};



export default function ReferralCheckDetails() {

    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef();
    const [approvalData, setApprovalData] = useState(null);
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const approvalId = searchParams.get('approval_id');

    const GetApprovalNodeDetailsById = React.useCallback(async (id) => {
        if (!id) return;
        setLoading(true)
        try {
            let payload = {
                "approval_note_doc_id": id,
                "scope_fields": []
            }
            let response = await axios.post(`${config.API_URL}getAppraisalNoteById`, payload, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setApprovalData(response.data.data);
            }

            setLoading(false)

        } catch (error) {
            console.log(error?.message)
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        if (approvalId) {
            GetApprovalNodeDetailsById(approvalId)
        }
    }, [approvalId, GetApprovalNodeDetailsById])

    console.log("Approval Data:", approvalData);

    const CandidateDetails = useMemo(() => {

        return approvalData ? approvalData?.candidate_list?.find(c => c.cand_doc_id === id) : null;

    }, [approvalData, id]);


    const checks = useMemo(() => {

        return CandidateDetails?.reference_check?.filter(
            (i) => i?.verification_status === 'Complete'
        ) || [];

    }, [CandidateDetails]);


    // Handle tab change and simulate loading
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
        // setLoading(true);
        // setTimeout(() => setLoading(false), 1000);
    };

    // Print handler
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `Reference_Check_Details_${CandidateDetails?.name || 'N/A'}`,
        pageStyle: `
        @media print {
        body { margin: 0; font-family: Arial; -webkit-print-color-adjust: exact; }
        .print-logo {
            display: block !important;
        }
        .MuiPaper-root, .MuiBox-root, .MuiGrid-root, .MuiTable-root {
            box-shadow: none !important;
            padding: 1 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
        .MuiTableRow-root, .MuiTableCell-root {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
        .MuiBox-root {
            margin-bottom: 12px !important;
            min-height: 40px !important;
        }
        .MuiTypography-root {
            font-size: 14px !important;
            word-break: break-word !important;
        }
        .MuiGrid-root {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
        .MuiPaper-root {
            border: none !important;
            background: #fff !important;
        }
        @page {
            margin: 5mm;
        }
        }
  `
    });

    const currentCheck = checks[selectedTab];

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">

                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="hrhdng">
                        <h2 className="">Reference Check Details</h2>
                    </div>

                    <Box sx={{ mx: 'auto', mt: 4 }}>

                        <Tabs
                            value={selectedTab}
                            onChange={handleChange}
                            variant="fullWidth"
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            {loading ? (
                                Array.from({ length: 3 }).map((_, idx) => (
                                    <Skeleton
                                        key={idx}
                                        variant="rectangular"
                                        width="100%"
                                        height={48}
                                    />
                                ))
                            ) : checks.length > 0 ? (
                                checks.map((check, idx) => (
                                    <Tab
                                        key={check?._id}
                                        label={
                                            check?.referenceStatus === 'previous'
                                                ? 'TELEPHONIC'
                                                : check?.referenceStatus === 'current'
                                                    ? 'Email'
                                                    : 'HR Head'
                                        }
                                        id={`tab-${idx}`}
                                        aria-controls={`tabpanel-${idx}`}
                                    />
                                ))
                            ) : (
                                <Tab label="No Reference Checks" disabled />
                            )}
                        </Tabs>

                        {
                            checks.length > 0 ? (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <IconButton onClick={handlePrint} color="primary">
                                            <PrintIcon />
                                        </IconButton>
                                    </Box>

                                    <Paper elevation={3} ref={contentRef} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', position: 'relative', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                                        <Box textAlign="center" mb={2}>
                                            <Grid item xs={4}>
                                                <img
                                                    src='/logo512.png'
                                                    alt='hlfppt logo'
                                                    className="print-logo"
                                                    style={{
                                                        display: 'none', // hidden on screen
                                                        // height: 60,
                                                        margin: '0 auto',
                                                        pointerEvents: 'none',
                                                    }}
                                                />
                                            </Grid>
                                        </Box>

                                        <Typography variant="h5" align="center" sx={{
                                            fontWeight: 'bold', mb: 3, color: '#2c3e50', backgroundColor: '#f8f9fa', p: 1,
                                            borderRadius: '4px', borderBottom: '2px solid #3498db'
                                        }}>
                                            REFERENCE CHECK FORM - {currentCheck?.referenceStatus === 'previous' ? 'TELEPHONIC' : currentCheck?.referenceStatus === 'current' ? "Email" : "HR Head"}
                                        </Typography>

                                        <Table sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', width: '40%', borderRight: '1px solid #e0e0e0', backgroundColor: '#f5f7fa' }}>
                                                        Name of candidate:
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: '#fff' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                                            {CandidateDetails?.name || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', backgroundColor: '#f5f7fa' }}>
                                                        Date:
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: '#fff' }}>
                                                        <Typography variant="body1">
                                                            {moment(currentCheck?.add_date).format('DD/MM/YYYY')}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', backgroundColor: '#f5f7fa' }}>
                                                        Position applied for:
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: '#fff' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                                            {approvalData?.job_designation || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', backgroundColor: '#f5f7fa' }}>
                                                        Contact person name:
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: '#fff' }}>
                                                        <Typography variant="body1">
                                                            {currentCheck?.name || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', backgroundColor: '#f5f7fa' }}>
                                                        Organization Name:
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: '#fff' }}>
                                                        <Typography variant="body1">HLFPPT (Hindustan Latex Family Planning Promotion Trust)</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', backgroundColor: '#f5f7fa' }}>
                                                        Contact Number:
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: '#fff' }}>
                                                        <Typography variant="body1">
                                                            {currentCheck?.mobile || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0', backgroundColor: '#f5f7fa' }}>
                                                        Mode of reference check:
                                                    </TableCell>
                                                    <TableCell sx={{ backgroundColor: '#fff' }}>
                                                        <Typography variant="body1">{currentCheck?.referenceStatus === 'previous' ? 'TELEPHONIC' : currentCheck?.referenceStatus === 'current' ? "Email" : "HR Head"}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                1. How long you know him/her?{' '}
                                                <Box component="span" sx={{ fontWeight: 'bold', borderBottom: 2 }}>{currentCheck?.verification_data?.know_him || 'N/A'}</Box>
                                                {' '}In what capacity?{' '}
                                                <Box component="span" sx={{ fontWeight: 'bold', borderBottom: 2 }}>{currentCheck?.verification_data?.capacity || 'N/A'}</Box>
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                2. I understand that he/she worked with your organization as a{' '}
                                                <Box component="span" sx={{ fontWeight: 'bold', borderBottom: 2 }}>{currentCheck?.verification_data?.after_know_organization || 'N/A'}</Box>{' '}from{' '}
                                                <Box component="span" sx={{ fontWeight: 'bold', borderBottom: 2 }}>{currentCheck?.verification_data?.from || 'N/A'}</Box>{' '}and he/she left your employment due to{' '}
                                                <Box component="span" sx={{ fontWeight: 'bold', borderBottom: 2 }}>{currentCheck?.verification_data?.leave_reason || 'N/A'}</Box>
                                            </Typography>
                                        </Box>


                                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                What were his/her main responsibilities?
                                            </Typography>
                                            <Box p={2} border={0.5} borderColor="#000">
                                                {/* <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}> */}
                                                <Typography variant="body1">{currentCheck?.verification_data?.responsibilities || '—'}</Typography>
                                                {/* </Typography> */}
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                Overall work performance:
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {currentCheck?.verification_data?.performance || '—'}
                                            </Typography>
                                            <Box p={2} border={0.5} borderColor="#000">
                                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                    {currentCheck?.verification_data?.performance_remark || ' '}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                Areas excelled:
                                            </Typography>
                                            <Box p={2} border={0.5} borderColor="#000">
                                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                    {currentCheck?.verification_data?.excelled_work || ' '}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                Would re-employ?:
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {currentCheck?.verification_data?.give_opportunity || '—'}
                                            </Typography>
                                            <Box p={2} border={0.5} borderColor="#000">
                                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                    {currentCheck?.verification_data?.give_opportunity_reason || ' '}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                Comments:
                                            </Typography>
                                            <Box p={2} border={0.5} borderColor="#000">
                                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                    {currentCheck?.verification_data?.comments || ' '}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </>
                            ) : (
                                <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mt: 4 }}>
                                    No reference checks available for this candidate.
                                </Typography>
                            )
                        }

                    </Box>
                </div>
            </div>
        </>
    );
}
