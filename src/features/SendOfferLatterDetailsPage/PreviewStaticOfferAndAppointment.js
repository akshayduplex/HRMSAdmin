// TemplatePreviewPage.jsx - Simplified Print Only Version
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BiArrowBack, BiPrinter } from 'react-icons/bi';

// Import templates
import { ConsultantLetter } from './ConsultantLetterTemp';
import { AppointmentLetter } from './AppointmentLetterTemp';

// Date formatting helper functions
export const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
        // If it's already a formatted date string (DD/MM/YYYY), return it
        if (typeof dateString === 'string' && dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            return dateString;
        }

        // If it's a Date object or ISO string
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

// Get current date in DD/MM/YYYY format
export const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
};

const TemplatePreviewPage = () => {
    const { candidateId, approvalId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [approvalData, setApprovalData] = useState(null);
    const [candidateData, setCandidateData] = useState(null);
    const [templateData, setTemplateData] = useState({});
    const [webSettingData, setWebSettingData] = useState(null);

    const templateType = searchParams.get('type') || 'offer';
    const templateRef = useRef(null);

    // Fetch web settings
    useEffect(() => {
        const getConfigData = async () => {
            try {
                let response = await axios.get(`${config.API_URL}getAllSettingData`, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    setWebSettingData(response?.data?.data);
                }
            } catch (error) {
                console.error('Error fetching web settings:', error);
            }
        };
        getConfigData();
    }, []);

    // Fetch candidate and approval data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch approval data
                const approvalResponse = await axios.post(
                    `${config.API_URL}getAppraisalNoteById`,
                    { approval_note_doc_id: approvalId },
                    apiHeaderToken(config.API_TOKEN)
                );

                if (approvalResponse.status === 200) {
                    const approvalData = approvalResponse.data.data;
                    setApprovalData(approvalData);

                    // Find the specific candidate
                    const candidate = approvalData.candidate_list?.find(
                        cand => cand.cand_doc_id === candidateId
                    );

                    if (candidate) {
                        setCandidateData(candidate);
                    } else {
                        toast.error('Candidate not found in approval data');
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
                setLoading(false);
            }
        };

        if (candidateId && approvalId) {
            fetchData();
        }
    }, [candidateId, approvalId]);

    useEffect(() => {
        if (candidateData && approvalData && webSettingData) {
            const templateData = prepareTemplateData(candidateData, approvalData);
            setTemplateData(templateData);
        }
    }, [candidateData, approvalData, webSettingData]);

    const prepareTemplateData = (candidate, approval) => {
        const currentDate = getCurrentDate();

        // Determine template type based on job_type and job_designation
        const jobType = candidate.job_type || '';
        const jobDesignation = approval.job_designation || '';

        // Check if it's consultant based on job_type or job_designation
        const isConsultant = jobType.toLowerCase().includes('consultant') ||
            jobDesignation.toLowerCase().includes('consultant') ||
            jobType === 'OnContract';

        // Base data structure
        const baseData = {
            employeeName: candidate.name || '',
            email: candidate.email || '',
            jobType: candidate.job_type || '',
            designation: approval.job_designation || '',
            location: candidate.proposed_location || '',
            projectName: approval.project_name || '',
            joiningDate: formatDate(candidate.onboarding_date),
            contractExpiryDate: formatDate(candidate.job_valid_date),
            currentDate: currentDate,
            address: candidate.address || '',
            relativeName: candidate.emergency_contact_name || '',
            ctcAmount: candidate.offer_ctc ? candidate.offer_ctc.toString() : '0',
            paymentType: candidate.payment_type || '',
            reportingTo: 'Project Manager',
            candidateId: candidate.cand_doc_id || candidateId,
            approvalNoteId: approval.approval_note_id || '',
            projectId: approval.project_id || '',
            webSettingData: webSettingData || {},
            jobTitle: approval.job_title || '',
            mprOfferType: approval.mpr_offer_type || '',
            mprFundType: approval.mpr_fund_type || '',
            addByDetails: approval.add_by_details || {},
            ecNumber: approval.ec_number || ''
        };

        if (isConsultant) {
            const feeAmount = candidate.offer_ctc || 0;
            const workingDays = candidate.working_days || 26;
            const dailyRate = Math.round(feeAmount / (workingDays * 12));

            return {
                ...baseData,
                feeAmount: feeAmount.toString(),
                feeAmountWords: convertToWords(feeAmount),
                workingDays: workingDays.toString(),
                dailyRate: dailyRate.toString(),
                probationPeriod: 'N/A',
                annualGrossSalary: '0',
                annualGrossSalaryWords: 'Zero',
                basicSalary: '0',
                monthlyGross: '0',
                annualGross: '0',
                pfAmount: '0',
                workmenComp: '0',
                gratuity: '0',
                totalCTC: feeAmount.toString(),
                isConsultant: true
            };
        } else {
            const basicSalary = Math.round((candidate.offer_ctc || 0) * 0.4);
            const monthlyGross = Math.round((candidate.offer_ctc || 0) / 12);
            const annualGross = candidate.offer_ctc || 0;

            return {
                ...baseData,
                probationPeriod: candidate.probation_period || 'Six months',
                annualGrossSalary: annualGross.toString(),
                annualGrossSalaryWords: convertToWords(annualGross),
                basicSalary: basicSalary.toString(),
                monthlyGross: monthlyGross.toString(),
                annualGross: annualGross.toString(),
                pfAmount: calculatePF(basicSalary).toString(),
                workmenComp: calculateWorkmenComp(annualGross).toString(),
                gratuity: calculateGratuity(basicSalary).toString(),
                totalCTC: candidate.offer_ctc ? candidate.offer_ctc.toString() : '0',
                isConsultant: false
            };
        }
    };

    const convertToWords = (num) => {
        if (num === 0 || num === '0') return 'Zero';
        if (!num) return '';

        const number = parseInt(num, 10);
        if (isNaN(number)) return '';

        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
            'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const n = ('000000000' + number).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return '';

        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' ' : '';

        return str.trim() + ' Rupees Only';
    };

    const calculatePF = (basic) => basic ? Math.round((basic * 12) / 100) : 0;
    const calculateGratuity = (basic) => basic ? Math.round((basic * 12 * 4.81) / 100) : 0;
    const calculateWorkmenComp = (annualGross) => annualGross ? Math.round(annualGross * 0.02) : 0;

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Loading template data...</span>
            </div>
        );
    }

    if (!candidateData || !approvalData) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>Unable to load candidate or approval data.</p>
                    <Button variant="outline-danger" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Alert>
            </Container>
        );
    }

    const isConsultant = templateData.isConsultant;
    const templateTitle = isConsultant ? 'Consultant Agreement' : 'Appointment Letter';

    return (
        <div className="maincontent">
            {/* Print Styles */}
            <style type="text/css" media="print">
                {`
        /* Remove ALL browser-added headers and footers (date, URL, page title, page numbers) */
        @page {
            size: A4;
            margin: 0; /* We control margins via padding in the letter */
        }

        /* Critical: Hide browser default header/footer */
        @page :first { margin-top: 0; }
        @page :left { margin-left: 0; }
        @page :right { margin-right: 0; }
.print-page {
    page-break-inside: avoid;
    break-inside: avoid;
}

        html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }

        /* Hide everything except the actual letter content */
        body * {
            visibility: hidden !important;
        }

        .print-content,
        .print-content * {
            visibility: visible !important;
        }

        .print-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
        }

        /* Hide buttons, navbar, debug info, etc. */
        .no-print {
            display: none !important;
        }
        /* Extra safety: remove any browser pseudo-elements */
        body::before,
        body::after {
            display: none !important;
        }
    `}
            </style>

            <Container fluid className="py-4 no-print">
                {/* Header with navigation and actions - Hidden during print */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate(-1)}
                                className="d-flex align-items-center"
                            >
                                <BiArrowBack className="me-2" />
                                Back to Approval
                            </Button>

                            <div className="d-flex gap-3">
                                <Button
                                    variant="primary"
                                    onClick={handlePrint}
                                    className="d-flex align-items-center"
                                >
                                    <BiPrinter className="me-2" />
                                    Print Document
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Template Preview - Only this content will print */}
            <div ref={templateRef} className="print-content">
                {isConsultant ? (
                    <ConsultantLetter data={templateData} />
                ) : (
                    <AppointmentLetter data={templateData} />
                )}
            </div>
        </div>
    );
};

export default TemplatePreviewPage;