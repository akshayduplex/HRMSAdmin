// TemplatePreviewPage.jsx - Simplified Print Only Version
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BiArrowBack, BiPrinter } from 'react-icons/bi';

// Import templates
import { ConsultantLetter } from './ConsultantLetterTemp';
import { AppointmentLetter } from './AppointmentLetterTemp';
import { GetEmployeeListDropDownScroll } from '../slices/EmployeeSlices/EmployeeSlice';
import { useDispatch } from 'react-redux';
import SalaryBreakupModal from './SalaryCalculationModal';
import { numberToWords } from '../../utils/common';

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
    const [salaryOpen, setSalaryOpen] = useState(false);
    const [totalSalaryBreakup, setTotalSalaryBreakup] = useState(null);
    const [salaryUpdateTrigger, setSalaryUpdateTrigger] = useState(0);
    const [salaryConfirmed, setSalaryConfirmed] = useState(false);
    const [description, setDescription] = useState('');
    const templateType = searchParams.get('type') || 'offer';
    const templateRef = useRef(null);
    const dispatch = useDispatch()
    const handleSalarySave = (data) => {
        setTotalSalaryBreakup({ ...data });
        setSalaryUpdateTrigger(prev => prev + 1);
        setSalaryConfirmed(true);
        setSalaryOpen(false);
        toast.success("Salary structure saved successfully!");
    };
    const jobTypeLower = candidateData?.job_type || '';

    // Show Salary Structure button for both "On Role" and "Consultant" types
    const showSalaryStructureBtn =
        jobTypeLower === 'OnRole' ||
        jobTypeLower === 'OnContract'

    const formatMoney = useCallback((v) => {
        const n = Number(v);
        const value = Number.isFinite(n) ? n : 0;
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    }, []);
    const generateSalaryTableHtml = useCallback((salaryData, formatMoney) => {
        if (!salaryData) return '';

        let rowsHtml = '';

        if (salaryData.isEmpanelledOrConsultant) return '';

        const addRow = (component, value, suffix = '') => {
            if (value > 0) {
                rowsHtml += `
                <tr style="background:#fff;font-weight:400;">
                    <td style="padding:10px 12px;font-weight:400;border:1px solid #dddddd;">${component}</td>
                    <td style="min-width:160px;padding:10px 12px;text-align:right;font-weight:400;border:1px solid #dddddd;">${Number(value).toFixed(0)} ${suffix}</td>
                </tr>
      `;
            }
        };

        addRow('Basic', salaryData.basic);
        addRow('HRA', salaryData.hra);
        addRow('Children AI', salaryData.childrenHostelAI);
        addRow('Transport', salaryData.transport);
        addRow('Medical', salaryData.medical);
        addRow('Special', salaryData.special);
        addRow('Gross Monthly', salaryData.grossMonthly);

        if (salaryData.isEmpanelledOrConsultant) addRow('Monthly Salary / Per Visit', salaryData.monthlySalary);
        if (salaryData.isEmpanelledOrConsultant) addRow('TDS Percentage', salaryData.tdsPercent);
        if (salaryData.isEmpanelledOrConsultant) addRow('TDS Amount', salaryData.tds);
        if (salaryData.isEmpanelledOrConsultant) addRow('Gross', salaryData.takeHomeMonthly);

        // Employer Contributions
        // employer benefit (could be ESIC / Mediclaim / Workmen / Others)
        if (salaryData && Number(salaryData.employerBenefitAmount) > 0) {
            const t = salaryData.employerBenefitType || 'others';
            const label = t === 'esic' ? 'ESIC (Employer)' : t === 'mediclaim' ? 'Mediclaim' : t === 'workmen' ? 'Workmen Compensation' : (salaryData.employerBenefitTitle || 'Other Benefit');
            addRow(label, salaryData.employerBenefitAmount);
        }
        addRow('Gratuity', salaryData.gratuity);
        addRow('PF (Employer)', salaryData.pfEmployer);
        // addRow('Take Home', salaryData.takeHomeMonthly);
        addRow('CTC (Monthly)', salaryData.ctcMonthly);
        // Reimbursements
        addRow('Reimbursements (Monthly)', salaryData.reimbursementsMonthly);
        addRow('Reimbursements (Annual)', salaryData.reimbursementsAnnual);

        // Totals
        addRow('Total CTO (Monthly)', salaryData.totalCTOMonthly);
        addRow('Annual Gross', salaryData.totalCTOAnnual, '(Round Off)');

        let headerHtml

        if (salaryData.isEmpanelledOrConsultant) {
            headerHtml = ``;
        } else {
            headerHtml = `
            <thead>
                <tr style="background:#f2f2f2;font-weight:600;">
                    <th scope="col" style="text-align:left;padding:10px 12px;border:1px solid #dddddd;">Monthly Component</th>
                    <th scope="col" style="text-align:right;padding:10px 12px;min-width:160px;border:1px solid #dddddd;">Amount (in Rs.)</th>
                </tr>
            </thead>
        `;
        }



        return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; border:1px solid #dddddd;">
                ${headerHtml}
                <tbody>
                ${rowsHtml}
                </tbody>
            </table>
        `;
    }, []);
    const generateAdditionalBenefitsHtml = useCallback((salaryData, formatMoney) => {
        if (!salaryData) return '';
        const pfPercent = (salaryData && salaryData.basic && salaryData.pfEmployer) ? ((Number(salaryData.pfEmployer) / Number(salaryData.basic) * 100).toFixed(2)) : '12';
        const pfAnnual = formatMoney((Number(salaryData.pfEmployer) || 0) * 12);

        let employerBenefitHtml = '';
        const ebAmt = Number(salaryData?.employerBenefitAmount) || 0;
        const ebType = salaryData?.employerBenefitType || '';
        const ebTitle = salaryData?.employerBenefitTitle || '';
        if (ebAmt > 0) {
            const ann = formatMoney(ebAmt * 12);
            if (ebType === 'esic') employerBenefitHtml = `<li>ESIC (Employer) Annual Contribution…………………........................................ Rs. ${ann}</li>`;
            else if (ebType === 'mediclaim') employerBenefitHtml = `<li>Mediclaim Annual Premium…………………........................................ Rs. ${ann}</li>`;
            else if (ebType === 'workmen') employerBenefitHtml = `<li>Workmen Compensation Annual Premium…………………........................................ Rs. ${ann}</li>`;
            else employerBenefitHtml = `<li>${ebTitle || 'Other Employer Benefit'} Annual Amount…………………........................................ Rs. ${ann}</li>`;
        }

        const gratuityPercent = (salaryData && salaryData.basic && salaryData.gratuity) ? ((Number(salaryData.gratuity) / Number(salaryData.basic) * 100).toFixed(2)) : '0.00';
        const gratuityAnnual = formatMoney((Number(salaryData.gratuity) || 0) * 12);

        // Check if empanelled/consultant for different Additional Benefits display
        if (salaryData.isEmpanelledOrConsultant) {
            return `
                            <div style="">
                                <span>
                                    <p style="font-style: bold; font-weight: bold;">Consultancy fee</p>
                                    <p>The party shall be paid a consultancy fee of Rs. ${salaryData.monthlySalary}/- (${numberToWords(salaryData.monthlySalary)}) per day/month against submission of invoice and Time Sheet. The month being defined as minimum of ----- working days per calendar month.</p>
                                    <p style="font-style: bold; font-weight: bold;">TDS</p>
                                    <p>The Trust shall deduct income tax at source (TDS) as per Income Tax Act, which shall be deposited from the remuneration of the Party.</p>
                                </span>
                            </div>
                `;
        } else {
            return `
                    <div class="additional-benefits">
                        <div style="margin-top:20px;">
                            <h4 style="margin:0 0 10px 0;">Additional Benefits:</h4>
                            <div style="">
                                <ul style="margin:0;padding-left:18px;">
                                    <li>Company's Contribution towards PF (per annum) @ ${pfPercent}% … Rs. ${pfAnnual}</li>
                                    ${employerBenefitHtml}
                                    <li>Gratuity @ ${gratuityPercent || '4.81'}% of Basic (Per annum) - Notional Pay … Rs. ${gratuityAnnual}</li>
                                    <li>Total Annual Impact (CTC) … Rs. ${formatMoney(salaryData.totalCTOAnnual)}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
        }
    }, []);
    useEffect(() => {
        if (!totalSalaryBreakup) return;
        if (totalSalaryBreakup) {
            const salaryTableHtml = generateSalaryTableHtml(totalSalaryBreakup, formatMoney);
            const addlHtml = generateAdditionalBenefitsHtml(totalSalaryBreakup, formatMoney);
            setDescription(prevDescription => {
                let prev = prevDescription || '';

                // First, handle tokens if present
                const hasSalaryToken = prev.includes('{#salary_structure}');
                const hasBenefitsToken = prev.includes('{#additional_benefits}');
                if (hasSalaryToken) prev = prev.replace('{#salary_structure}', salaryTableHtml);
                if (hasBenefitsToken) prev = prev.replace('{#additional_benefits}', addlHtml);

                // If tokens handled both, return immediately
                if (hasSalaryToken || hasBenefitsToken) return prev;

                // Otherwise, replace existing table/figure or append salary table
                const figureTableRegex = /<figure[^>]*class=["']?table["']?[^>]*>[\s\S]*?<\/figure>/i;
                const tableBlockRegex = /<table[^>]*>[\s\S]*?<\/table>/i;
                if (figureTableRegex.test(prev)) {
                    prev = prev.replace(figureTableRegex, salaryTableHtml);
                } else if (tableBlockRegex.test(prev)) {
                    prev = prev.replace(tableBlockRegex, salaryTableHtml);
                } else {
                    prev = prev + salaryTableHtml;
                }

                // Handle Additional Benefits placement/update
                const addlDivFirst = /<div[^>]*class=["']additional-benefits["'][^>]*>[\s\S]*?<\/div>/i;
                const addlDivAll = /<div[^>]*class=["']additional-benefits["'][^>]*>[\s\S]*?<\/div>/gi;
                const legacyBlock = /<h[46][^>]*>\s*Additional\s+Benefits:\s*<\/h[46]>\s*(<div[^>]*>[\s\S]*?<\/div>\s*)?(<ul[\s\S]*?<\/ul>)/i;
                const legacyBlockAll = /<h[46][^>]*>\s*Additional\s+Benefits:\s*<\/h[46]>\s*(<div[^>]*>[\s\S]*?<\/div>\s*)?(<ul[\s\S]*?<\/ul>)/gi;
                if (addlDivFirst.test(prev)) {
                    // Replace first managed block and drop any duplicates
                    let replaced = false;
                    prev = prev.replace(addlDivAll, () => {
                        if (!replaced) { replaced = true; return addlHtml; }
                        return '';
                    });
                    // Also remove legacy duplicates if any remain
                    prev = prev.replace(legacyBlockAll, '');
                } else if (legacyBlock.test(prev)) {
                    // Replace legacy h4/ul block with managed block
                    prev = prev.replace(legacyBlock, addlHtml);
                    // Remove any further legacy duplicates
                    prev = prev.replace(legacyBlockAll, '');
                } else {
                    // No managed or legacy block -> append
                    prev = prev + addlHtml;
                }
                return prev;
            });
        } else {
            setDescription(prevDescription => {
                const newDescription = stripAdditionalBenefits(prevDescription || '')
                    .replace(/<table[^>]*>[\s\S]*?<\/table>/g, '')
                    .replace('{#salary_structure}', '')
                    .replace('{#additional_benefits}', '');
                return newDescription;
            });
        }
    }, [salaryUpdateTrigger, generateSalaryTableHtml, generateAdditionalBenefitsHtml, formatMoney, totalSalaryBreakup])
    // Fetch web settings
    useEffect(() => {
        const getConfigData = async () => {
            try {
                let response = await axios.get(`${config.API_URL}getAllSettingData`, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    console.log("websetting", response?.data?.data)
                    setWebSettingData(response?.data?.data);
                }
            } catch (error) {
                console.error('Error fetching web settings:', error);
            }
        };
        getConfigData();
    }, []);
    // Dedicated generator for Additional Benefits block (outside the table)
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800, // md size (600px)
        maxWidth: '95vw',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto',
        // position: 'relative'
    };

    // Remove any existing Additional Benefits sections from rich text
    const stripAdditionalBenefits = useCallback((html) => {
        if (!html) return '';
        let out = html;
        // Remove our wrapped block
        out = out.replace(/<div[^>]*class=("|')additional-benefits\1[\s\S]*?<\/div>\s*/gi, '');
        // Remove pattern: <p>Additional Benefits:</p><ul>...</ul>
        out = out.replace(/<p[^>]*>\s*Additional\s+Benefits:\s*<\/p>\s*(<ul[\s\S]*?<\/ul>)?/gi, '');
        // Remove pattern: <h6>/<h4> Additional Benefits followed by common containers
        out = out.replace(/<h6[^>]*>\s*Additional\s+Benefits:\s*<\/h6>\s*((<div[\s\S]*?<\/div>)|(<ul[\s\S]*?<\/ul>)|((<p[\s\S]*?<\/p>){1,10}))/gi, '');
        out = out.replace(/<h4[^>]*>\s*Additional\s+Benefits:\s*<\/h4>\s*((<div[\s\S]*?<\/div>)|(<ul[\s\S]*?<\/ul>)|((<p[\s\S]*?<\/p>){1,10}))/gi, '');
        // Remove any ULs that contain known Additional Benefits lines even without a heading
        out = out.replace(/<ul[^>]*>[\s\S]*?(Company\'s\s+Contribution\s+towards\s+PF|ESIC\s*\(Employer\)|Gratuity\s*@)[\s\S]*?<\/ul>/gi, '');
        return out;
    }, []);
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
            options: result,
            hasMore: result.length >= 10,
            additional: { page: page + 1 }
        };
    };
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
                    console.log("approvalData", approvalData)
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
            const templateData = prepareTemplateData(candidateData, approvalData, totalSalaryBreakup);
            setTemplateData(templateData);
        }
    }, [candidateData, approvalData, webSettingData, totalSalaryBreakup]); // Add totalSalaryBreakup dependency

    // In TemplatePreviewPage.jsx
    const prepareTemplateData = (candidate, approval, salaryBreakup = null) => {
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
            ecNumber: approval.ec_number || '',

            // Add salary breakdown data if available
            salaryBreakup: salaryBreakup || null,
            isConsultant: isConsultant
        };

        // If salary breakdown is provided, use those values
        if (salaryBreakup) {
            if (isConsultant) {
                const feeAmount = salaryBreakup.monthlySalary || candidate.offer_ctc || 0;
                return {
                    ...baseData,
                    feeAmount: feeAmount.toString(),
                    feeAmountWords: convertToWords(feeAmount),
                    workingDays: candidate.working_days || '26',
                    dailyRate: Math.round(feeAmount / (26 * 12)).toString(),
                    probationPeriod: 'N/A',
                    totalCTC: feeAmount.toString(),
                    salaryBreakup: salaryBreakup
                };
            } else {
                const annualGross = salaryBreakup.totalCTOAnnual || candidate.offer_ctc || 0;
                const monthlyGross = salaryBreakup.totalCTOMonthly || Math.round((candidate.offer_ctc || 0) / 12);
                const basicSalary = salaryBreakup.basic || Math.round((candidate.offer_ctc || 0) * 0.4);

                return {
                    ...baseData,
                    probationPeriod: candidate.probation_period || 'Six months',
                    annualGrossSalary: annualGross.toString(),
                    annualGrossSalaryWords: convertToWords(annualGross),
                    basicSalary: basicSalary.toString(),
                    monthlyGross: monthlyGross.toString(),
                    annualGross: annualGross.toString(),
                    pfAmount: salaryBreakup.pfEmployer || calculatePF(basicSalary).toString(),
                    workmenComp: salaryBreakup.workmenComp || calculateWorkmenComp(annualGross).toString(),
                    gratuity: salaryBreakup.gratuity || calculateGratuity(basicSalary).toString(),
                    totalCTC: annualGross.toString(),
                    salaryBreakup: salaryBreakup
                };
            }
        } else {
            // Original logic without salary breakdown
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
                    totalCTC: feeAmount.toString()
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
                    totalCTC: candidate.offer_ctc ? candidate.offer_ctc.toString() : '0'
                };
            }
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
    const handleSend = async (event) => {
        event?.preventDefault();

        if (!salaryConfirmed) {
            toast.warning("Please confirm the salary structure before generating the letter.");
            return;
        }

        try {
            setLoading(true);

            const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) || {};
            const isApproved = candidateData?.appointment_letter_verification_status?.status === 'Complete' ||
                candidateData?.document_status?.status === 'approved';

            let url = '';
            let payload = {};
            let isMultipart = false;
            let headers = apiHeaderToken(config.API_TOKEN);

            const basePayload = {
                candidate_doc_id: candidateId,
                approval_note_doc_id: approvalId,
                add_by_name: loginUsers?.name || '',
                add_by_designation: loginUsers?.designation || '',
                add_by_mobile: loginUsers?.mobile_no || '',
                add_by_email: loginUsers?.email || '',
            };

            /* ---------- After approval (send only) ---------- */
            if (templateType === 'appointment' && isApproved) {
                url = `${config.API_URL}sendAppointmentLetterToCandidateAfterApproval`;
                payload = {
                    ...basePayload,
                    email_subject: `Appointment Letter - ${candidateData?.name}`,
                };
            }
            /* ---------- Generate + send (with content & salary) ---------- */
            else {
                url = `${config.API_URL}send_approval_mail`;
                const formData = new FormData();

                formData.append("contents", description);
                formData.append("approval_note_id", approvalId);
                formData.append("candidate_id", candidateId);
                formData.append("email_subject", `Appointment Letter - ${candidateData?.name}`);
                formData.append("add_by_name", loginUsers?.name || '');
                formData.append("add_by_mobile", loginUsers?.mobile_no || '');
                formData.append("add_by_designation", loginUsers?.designation || '');
                formData.append("add_by_email", loginUsers?.email || '');

                // Attach salary structure if confirmed
                if (totalSalaryBreakup) {
                    formData.append('salary_structure', JSON.stringify(totalSalaryBreakup));
                }

                payload = formData;
                isMultipart = true;
                headers = { ...apiHeaderTokenMultiPart(config.API_TOKEN) };
            }

            const response = await axios.post(url, payload, headers);

            if (response.status === 200) {
                toast.success(response.data?.message || "Letter generated and sent successfully!");
            } else {
                toast.error(response.data?.message || "Failed to send letter");
            }

        } catch (error) {
            console.error("Error in handleSend:", error);
            toast.error(error?.response?.data?.message || "Failed to generate/send letter");
        } finally {
            setLoading(false);
        }
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
            opacity: 0.08,
WebkitPrintColorAdjust: 'exact',
printColorAdjust: 'exact',
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
                <Row className="mb-4 align-items-center">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate(-1)}
                                className="d-flex align-items-center"
                            >
                                <BiArrowBack className="me-2" />
                                Back to Approval
                            </Button>

                            <div className="d-flex gap-3 align-items-center">
                                {/* Salary Structure Button - Only for On Role */}
                                {showSalaryStructureBtn && (
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setSalaryOpen(true)}
                                        disabled={loading}
                                    >
                                        Salary Structure
                                    </Button>
                                )}

                                {/* Generate Button - Only shown after salary confirmed */}
                                {showSalaryStructureBtn && salaryConfirmed && (
                                    <Button
                                        variant="success"
                                        onClick={handleSend}
                                        disabled={loading}
                                        className="d-flex align-items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Generating...
                                            </>
                                        ) : (
                                            'Generate'
                                        )}
                                    </Button>
                                )}

                                {/* Print Button - Always available */}
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

            {/* Salary Modal */}
            {templateType === 'appointment' && showSalaryStructureBtn && (
                <SalaryBreakupModal
                    show={salaryOpen}
                    onHide={() => setSalaryOpen(false)}
                    offer_ctc={candidateData?.offer_ctc}
                    payment_type={candidateData?.payment_type}
                    initialValues={totalSalaryBreakup || {}}
                    saveDataToValue={handleSalarySave}
                    candidate_details={candidateData}
                />
            )}

            {/* Template Preview */}
            <div ref={templateRef} className="print-content">
                {isConsultant ? (
                    <ConsultantLetter data={templateData} />
                ) : (
                    <AppointmentLetter
                        data={{
                            ...templateData,
                            description: description, // Pass updated HTML with salary table
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default TemplatePreviewPage;