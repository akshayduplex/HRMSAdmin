import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import {
    Modal, Box, Typography, TextField, Button,
    IconButton, Stack,
    CircularProgress, Grid,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    FormControl,
    InputLabel,
    MenuItem
} from '@mui/material';
import Checkbox from "@mui/material/Checkbox";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GridDeleteIcon } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import DocumentModal from './ViewDocuments';
import { AsyncPaginate } from 'react-select-async-paginate';
import { GetEmployeeListDropDownScroll } from '../slices/EmployeeSlices/EmployeeSlice';
import { useDispatch } from 'react-redux';
import SalaryBreakupModal from './SalaryCalculationModal';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import moment from 'moment';
import { numberToWords } from '../../utils/common';

// Using ReactQuill for rich text editing (already in project and working)


// const customStyles = {
//     control: (provided, state) => ({
//         ...provided,
//         backgroundColor: "#fff !important",
//         borderColor: state.isFocused
//             ? "#D2C9FF"
//             : state.isHovered
//                 ? "#80CBC4"
//                 : provided.borderColor,
//         boxShadow: state.isFocused ? "0 0 0 1px #D2C9FF" : "none",
//         "&:hover": {
//             borderColor: "#D2C9FF",
//         },
//         minHeight: "44px",
//     }),
//     menu: (provided) => ({
//         ...provided,
//         borderTop: "1px solid #D2C9FF",
//     }),
//     option: (provided, state) => ({
//         ...provided,
//         borderBottom: "1px solid #D2C9FF",
//         color: state.isSelected ? "#fff" : "#000000",
//         backgroundColor: state.isSelected
//             ? "#4CAF50"
//             : state.isFocused
//                 ? "#80CBC4"
//                 : provided.backgroundColor,
//         "&:hover": {
//             backgroundColor: "#80CBC4",
//             color: "#fff",
//         },
//     }),
// };
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#fff !important",
        borderColor: state.isFocused
            ? "#D2C9FF"
            : state.isHovered
                ? "#80CBC4"
                : provided.borderColor,
        boxShadow: state.isFocused ? "0 0 0 1px #D2C9FF" : "none",
        "&:hover": {
            borderColor: "#D2C9FF",
        },
        minHeight: "44px",
    }),

    menu: (provided) => ({
        ...provided,
        borderTop: "1px solid #D2C9FF",
        zIndex: 9999,          // ⭐ Make dropdown appear on top
    }),

    menuList: (provided) => ({
        ...provided,
        zIndex: 9999,          // (Optional) Ensures inner list also stays on top
    }),

    option: (provided, state) => ({
        ...provided,
        borderBottom: "1px solid #D2C9FF",
        color: state.isSelected ? "#fff" : "#000000",
        backgroundColor: state.isSelected
            ? "#4CAF50"
            : state.isFocused
                ? "#80CBC4"
                : provided.backgroundColor,
        "&:hover": {
            backgroundColor: "#80CBC4",
            color: "#fff",
        },
    }),
};


const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
        [{ align: [] }],
        ["code-block"],
    ],
};

const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "code-block",
];

export default function SendOfferJoiningModal({ open, setOpen, existingFileUrl, modalData, fetchAgainApprovalDetails, roleUserDetails }) {
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [templateData, setTemplateData] = useState(null);
    const { id } = useParams()
    const resetRef = useRef(null)
    const editorRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [filterInterview, setFilterInterview] = useState(null)
    const dispatch = useDispatch()
    const [salaryOpen, setSalaryOpen] = useState(false);
    const [totalSalaryBreakup, setTotalSalaryBreakup] = useState(null);
    const [salaryUpdateTrigger, setSalaryUpdateTrigger] = useState(0);
    const [emailSubject, setEmailSubject] = useState('')

    const [files, setFiles] = useState([]); // For multiple files
    const [openDocModal, setOpenDocumentModal] = useState(false)
    const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) ?? {}
    const closedDocumentModal = () => setOpenDocumentModal(false);
    const [skipLoading, setSkipLoading] = useState(false)
    const [selectedDocIds, setSelectedDocIds] = useState([]); // Store selected document IDs
    const [isInitialized, setIsInitialized] = useState(false); // Track if state is initialized

    const handleClose = useCallback(() => {
        setOpen(false)
        setFile(null)
        setFiles([])
        setDescription('')
        if (modalData?.modal_title === "Joining Intimation") {
            setEmailSubject('')
            setFilterInterview(null)
            setSelectedDocIds([])
            setOptionalDoc([])
            setMendetoryDoc([])
        }
        if (resetRef.current) {
            resetRef.current.value = null;
        }
    }, [setOpen, modalData?.modal_title]);

    const SkipReference = async (e) => {
        e.preventDefault();

        let payload = {
            "add_by_name": loginUsers?.name,
            "add_by_designation": loginUsers?.designation,
            "add_by_mobile": loginUsers?.mobile_no,
            "add_by_email": loginUsers?.email,
            "candidate_doc_id": modalData?.modal_data?.cand_doc_id,
            "approval_note_doc_id": id,
            "skip_status_for": modalData?.modal_title,
            "template_id": templateData?.template_id,
            "content": description,
        }

        try {
            setSkipLoading(true)
            let response = await axios.post(`${config.API_URL}skipOfferJoiningLetter`, payload, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                toast.success(response.data?.message)
                fetchAgainApprovalDetails()
                setOpen(false);
            } else {
                toast.error(response.data?.message)
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error?.message || "Something Went Wrong")
        } finally {
            setSkipLoading(false)
        }
    };

    const handleFileUpload = (idx, event) => {
        const files = Array.from(event.target.files);
        setFile(prev => ({
            ...prev,
            [idx]: files
        }));
    };

    const handleFileUploadMultiple = (event) => {
        const newFile = event.target.files[0];
        if (newFile) {
            setFiles((prev) => [...prev, newFile]);
        }
        if (resetRef.current) resetRef.current.value = null;
    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Normalize incoming HTML to reduce extra gaps from templates or pasted content
    const normalizeHtml = useCallback((html) => {
        if (!html) return '';
        let out = String(html);
        // Remove inline margin and line-height styles that cause big gaps
        out = out.replace(/margin(-[a-z]+)?\s*:\s*[^;"']+;?/gi, '');
        out = out.replace(/line-height\s*:\s*[^;"']+;?/gi, '');
        // Convert paragraphs that contain only nbsp/br/whitespace to truly empty paragraphs
        out = out.replace(/<p[^>]*>\s*(?:&nbsp;|<br\s*\/?\s*>)*\s<\/p>/gi, '<p></p>');
        // Collapse multiple empty paragraphs into a single one
        const emptyP = /<p[^>]*>\s*<\/p>/gi;
        // Iteratively collapse triples -> doubles -> single
        for (let i = 0; i < 5; i++) {
            out = out.replace(/(?:<p[^>]*>\s*<\/p>\s*){2,}/gi, '<p></p>');
        }
        // Trim leading/trailing empty paragraphs
        out = out.replace(/^(\s*<p[^>]*>\s*<\/p>\s*)+/i, '');
        out = out.replace(/(\s*<p[^>]*>\s*<\/p>\s*)+$/i, '');
        return out.trim();
    }, []);

    const [mendetoryDocument, setMendetoryDoc] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [optionalDoc, setOptionalDoc] = useState([]);

    const handleRemoveOptional = (doc) => {
        let removedDoc = mendetoryDocument.find(data => data._id === doc._id);
        setMendetoryDoc((prev) => prev.filter((d) => d._id !== doc._id));
        if (removedDoc?.is_remove) {
            delete removedDoc?.is_remove;
            setOptionalDoc((prev) => [...prev, removedDoc])
        }
    };


    const handleUpdateDocument = (e) => {
        setSelectedDoc(e.target.value)
        let selectedDocument = optionalDoc.find(doc => doc._id === e.target.value);
        let iterableAdded = { ...selectedDocument, is_remove: true };
        if (selectedDocument) {
            setMendetoryDoc(prev => [...prev, iterableAdded])
        }
        // update the id selection
        setSelectedDocIds(prev => [...prev, e.target.value])
        // remove selected document from optional document
        const updatedOptionalDoc = optionalDoc.filter(doc => doc._id !== e.target.value);
        setOptionalDoc(updatedOptionalDoc)
    }

    const getTemplateList = useCallback(async () => {

        try {

            let payload = {
                "approval_note_doc_id": id,
                "candidate_id": modalData?.modal_data?.cand_doc_id,
                "template_for": modalData?.modal_title
            }

            let response = await axios.post(`${config.API_URL}getTemplateSettingsByApprovalNote`, payload, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setTemplateData(response.data?.data)
                const templateHtml = response.data?.data?.template || '';
                setDescription(normalizeHtml(templateHtml))
                // Initialize selected document IDs with all document IDs
                let mendetoryDoctemp = response.data?.data?.attachments?.filter((item) => item?.is_optional === 'No');
                let optionalDocForTemplate = response.data?.data?.attachments?.filter((item) => item?.is_optional === 'Yes');
                setOptionalDoc(optionalDocForTemplate)
                setMendetoryDoc(mendetoryDoctemp)
                if (mendetoryDoctemp && Array.isArray(mendetoryDoctemp)) {
                    const allDocIds = mendetoryDoctemp?.map(doc => doc._id).filter(Boolean);
                    setSelectedDocIds(allDocIds);
                    setIsInitialized(true);
                }
            } else {
                setTemplateData(null)
            }
        } catch (error) {
            setTemplateData(null)
        }

    }, [id, modalData?.modal_data?.cand_doc_id, modalData?.modal_title, normalizeHtml])

    const getSavedTemplate = useCallback(async () => {
        try {

            let payload = {
                "approval_note_id": id,
                "candidate_id": modalData?.modal_data?.cand_doc_id,
                "doc_category": modalData?.modal_title
            }

            let response = await axios.post(`${config.API_URL}getCandidateEmailContent`, payload, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setTemplateData(response.data?.data)
                const templateHtml = response.data?.data?.content_data || '';
                setDescription(normalizeHtml(templateHtml))
            } else {
                setTemplateData(null)
            }
        } catch (error) {
            setTemplateData(null)
        }
    }, [id, modalData?.modal_data?.cand_doc_id, modalData?.modal_title])

    useEffect(() => {
        const approvedEmailAnotherView = modalData?.modal_data?.appointment_letter_verification_status?.status === 'Complete' || modalData?.modal_data?.document_status?.status === 'approved'

        // Skip saved template loading for "Joining Intimation"
        if (modalData?.modal_title === "Joining Intimation") {
            setDescription('');
            setTemplateData(null);
            return;
        }

        if (open && modalData?.modal_data?._id && id && approvedEmailAnotherView) {
            getSavedTemplate()
        }
    }, [open])

    useEffect(() => {
        const approvedEmailAnotherView = modalData?.modal_data?.appointment_letter_verification_status?.status === 'Complete' || modalData?.modal_data?.document_status?.status === 'approved'

        // Skip template loading for "Joining Intimation"
        if (modalData?.modal_title === "Joining Intimation") {
            setDescription('');
            setTemplateData(null);
            setMendetoryDoc([]);
            setOptionalDoc([]);
            setSelectedDocIds([]);
            return;
        }

        if (open && modalData?.modal_data?._id && id && !approvedEmailAnotherView) {
            getTemplateList()
        }
    }, [open, modalData, getTemplateList, id])

    const resetJoiningIntimationState = useCallback(() => {
        if (modalData?.modal_title === "Joining Intimation") {
            setDescription('');
            setTemplateData(null);
            setMendetoryDoc([]);
            setOptionalDoc([]);
            setSelectedDocIds([]);
            setEmailSubject('');
        }
    }, [modalData?.modal_title]);

    useEffect(() => {
        if (open && modalData?.modal_title === "Joining Intimation") {
            resetJoiningIntimationState();
        }
    }, [open, modalData?.modal_title, resetJoiningIntimationState]);

    const handleSend = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);

            const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};
            const approved = modalData?.modal_data?.appointment_letter_verification_status?.status === 'Complete' ||
                modalData?.modal_data?.document_status?.status === 'approved';

            let url = '';
            let payload = {};
            let isMultipart = false;
            let headers = apiHeaderToken(config.API_TOKEN);

            // Dedicated flow for Joining Intimation
            if (modalData?.modal_title === "Joining Intimation") {
                url = `${config.API_URL}send_joining_intimation_mail`;

                payload = {
                    candidate_doc_id: modalData?.modal_data?.cand_doc_id,
                    approval_note_doc_id: id,
                    email_subject: emailSubject || "Joining Intimation Letter",
                    content: description, // may be empty or used if backend expects it
                    add_by_name: loginUsers?.name,
                    add_by_designation: loginUsers?.designation,
                    add_by_mobile: loginUsers?.mobile_no,
                    add_by_email: loginUsers?.email,
                    selected_doc: selectedDocIds.length > 0 ? JSON.stringify(selectedDocIds) : null
                };
            }
            // Approved Appointment Letter (after verification/approval)
            else if (approved) {
                url = `${config.API_URL}sendAppointmentLetterToCandidateAfterApproval`;

                payload = {
                    candidate_doc_id: modalData?.modal_data?.cand_doc_id,
                    approval_note_doc_id: modalData?.approval_note_doc_id || id,
                    email_subject: emailSubject,
                    add_by_name: loginUsers?.name,
                    add_by_mobile: loginUsers?.mobile_no,
                    add_by_designation: loginUsers?.designation,
                    add_by_email: loginUsers?.email,
                    selected_doc: selectedDocIds.length > 0 ? JSON.stringify(selectedDocIds) : null
                };
            }
            // Non-approved flow: Appointment Letter generation or other mails (Offer Letter, etc.)
            else {
                url = `${config.API_URL}send_approval_mail`;
                const formData = new FormData();

                const finalDescription = modalData?.modal_title === "Appointment Letter" ? description : description;

                formData.append("contents", finalDescription);
                formData.append("approval_note_id", id);
                formData.append("template_id", templateData?.template_id || '');
                formData.append("email_subject", emailSubject);
                formData.append("candidate_id", modalData?.modal_data?.cand_doc_id);
                formData.append("add_by_name", loginUsers?.name);
                formData.append("add_by_mobile", loginUsers?.mobile_no);
                formData.append("add_by_designation", loginUsers?.designation);
                formData.append("add_by_email", loginUsers?.email);

                if (selectedDocIds.length > 0) {
                    formData.append("selected_doc", JSON.stringify(selectedDocIds));
                }

                if (totalSalaryBreakup) {
                    formData.append('salary_structure', JSON.stringify(totalSalaryBreakup));
                }

                if (filterInterview) {
                    formData.append("trail_mail_list", JSON.stringify(filterInterview.map(item => ({
                        email: item?.email,
                        name: item?.name,
                    }))));
                }

                // Handle attachments (uploaded replacements + new files)
                let attachmentIndex = 0;

                // if (files && Array.isArray(files)) {
                //     attachments = files.map((input) => ({
                //         doc_name: input.name,
                //         file_name: input
                //     }));
                // }
                if (file && typeof file === 'object') {
                    Object.values(file).forEach(filesArr => {
                        filesArr.forEach(inputFile => {
                            formData.append(`attachments[${attachmentIndex}][doc_name]`, inputFile.name);
                            formData.append(`attachments[${attachmentIndex}][file_name]`, inputFile);
                            attachmentIndex++;
                        });
                    });
                }

                // Newly uploaded files (not tied to existing docs)
                if (files && files.length > 0) {
                    files.forEach(inputFile => {
                        formData.append(`attachments[${attachmentIndex}][doc_name]`, inputFile.name);
                        formData.append(`attachments[${attachmentIndex}][file_name]`, inputFile);
                        attachmentIndex++;
                    });
                }

                payload = formData;
                isMultipart = true;
                headers = apiHeaderTokenMultiPart(config.API_TOKEN);
            }

            const response = await axios.post(url, payload, headers);

            if (response.status === 200) {
                toast.success(response.data?.message || "Mail sent successfully!");
                fetchAgainApprovalDetails();
                handleClose();
                setFilterInterview(null);
                setSelectedDocIds([]);
                setOptionalDoc([]);
                setMendetoryDoc([]);
                setEmailSubject('');
            } else {
                toast.error(response.data?.message || "Failed to send mail");
            }
        } catch (error) {
            console.error("Error in handleSend:", error);
            toast.error(error?.response?.data?.message || error.message || "Internal server error");
        } finally {
            setLoading(false);
        }
    };

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

    const formatMoney = useCallback((v) => {
        const n = Number(v);
        const value = Number.isFinite(n) ? n : 0;
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    }, []);

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

    // Dedicated generator for Additional Benefits block (outside the table)
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

    const [loaded, setLoaded] = useState(false);
    const src = (process.env.PUBLIC_URL || "") + "/tinymce/tinymce.min.js";

    useEffect(() => {
        // If already present, skip loading
        if (window.tinymce) {
            setLoaded(true);
            return;
        }

        // If script tag already in document, wait for it
        const existing = document.querySelector(`script[data-tinymce-local]`);
        if (existing) {
            existing.addEventListener("load", () => setLoaded(true));
            existing.addEventListener("error", () => {
                console.error("Failed to load local tinymce script", src);
            });
            return;
        }

        // Insert the script tag and wait for it to load
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.defer = true;
        s.setAttribute("data-tinymce-local", "true");
        s.onload = () => {
            // tinyMCE should register window.tinymce
            if (window.tinymce) {
                setLoaded(true);
            } else {
                console.error("tinymce loaded but window.tinymce is undefined");
            }
        };
        s.onerror = (e) => {
            console.error("Error loading local tinymce script:", src, e);
        };
        document.body.appendChild(s);

        // cleanup: do not remove script on unmount, reuse across mounts
    }, [src]);

    useEffect(() => {
        if (totalSalaryBreakup && modalData && modalData?.modal_title === "Appointment Letter") {
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

    // ReactQuill automatically syncs description state, no manual sync needed

    const handlePreview = () => {
        if (!templateData) {
            toast.error("Something Went Wrong");
            return;
        }
        // Save data in localStorage
        localStorage.setItem("offer_letter_preview", true);
        localStorage.setItem("offer_letter_preview_data", JSON.stringify(templateData));
        localStorage.setItem("template_description", JSON.stringify(description));
        // Open the preview page in a new tab
        window.open('/preview-letter', '_blank');
    }

    const approvedEmailAnotherView = modalData?.modal_data?.appointment_letter_verification_status?.status === 'Complete' || modalData?.modal_data?.document_status?.status === 'approved'
    const progressData = modalData?.modal_data?.progress_data;

    const approvalHistoryData =
        Array.isArray(progressData) && progressData.length
            ? progressData[progressData.length - 1] // or progressData.at(-1)
            : null;

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="send-offer-modal"
            >
                <Box sx={style}>
                    {/* Close Button */}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mr={2}>
                        <Typography id={modalData && modalData?.modal_title} variant="h6" mb={2}>
                            {(modalData?.modal_data?.appointment_letter_verification_status?.status === 'Pending' && modalData?.modal_title === "Appointment Letter") ? 'Generate' : 'Send'} {modalData && modalData?.modal_title}
                        </Typography>
                        <div className="flex gap-2">

                            {
                                !approvedEmailAnotherView && !approvedEmailAnotherView && modalData?.modal_title !== "Joining Intimation" && (
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            marginRight: 1
                                        }}
                                        size="small"
                                        onClick={() => {
                                            // handleViewDocuments()
                                            // Implement your logic to view all documents
                                            setOpenDocumentModal(true)
                                        }}
                                        disabled={modalData?.modal_data?.appointment_letter_verification_status?.status === 'Complete' || modalData?.modal_data?.document_status?.status === 'approved'}
                                    >
                                        View Documents
                                    </Button>
                                )
                            }

                            {
                                !approvedEmailAnotherView && modalData && modalData?.modal_title === "Appointment Letter" && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            marginRight: 1
                                        }}
                                        onClick={() => {
                                            // handleViewDocuments()
                                            // Implement your logic to view all documents
                                            setSalaryOpen(true)
                                        }}
                                        disabled={modalData?.modal_data?.appointment_letter_verification_status?.status === 'Complete' || modalData?.modal_data?.document_status?.status === 'approved'}
                                    >
                                        Salary Structure
                                    </Button>
                                )
                            }

                            {
                                !approvedEmailAnotherView && modalData?.modal_title !== "Joining Intimation" && modalData && modalData?.modal_title && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            // handleViewDocuments()
                                            // Implement your logic to view all documents
                                            // offer latter preview on the modal
                                            handlePreview()
                                        }}
                                    >
                                        Preview
                                    </Button>
                                )
                            }
                        </div>
                    </Box>

                    {/* Salary calculation modal */}
                    {modalData && modalData?.modal_title === "Appointment Letter" && (
                        <SalaryBreakupModal
                            show={salaryOpen}
                            onHide={() => setSalaryOpen(false)}
                            offer_ctc={modalData?.modal_data?.offer_ctc}
                            payment_type={modalData?.modal_data?.payment_type}
                            initialValues={totalSalaryBreakup || {}}
                            saveDataToValue={(data) => {
                                setTotalSalaryBreakup({ ...data });
                                setSalaryUpdateTrigger(prev => prev + 1);
                                setSalaryOpen(false);
                            }}
                            candidate_details={modalData?.modal_data}
                        />
                    )}


                    {
                        !approvedEmailAnotherView && (
                            <AsyncPaginate
                                placeholder="Select Panel Member"
                                value={filterInterview}
                                loadOptions={EmployeeListDropDownPagination}
                                onChange={(option) => setFilterInterview(option)}
                                debounceTimeout={300}
                                isMulti
                                isClearable
                                styles={customStyles}
                                additional={{
                                    page: 1
                                }}
                                classNamePrefix="react-select"
                            />
                        )
                    }

                    {
                        !approvedEmailAnotherView && (
                            <div className='mt-2 row g-2'>
                                {/* <div className='col-md-6'> */}
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Email Subject"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                />
                                {/* </div> */}
                                {/* <div className='col-md-6'>
                                    <AsyncPaginate
                                        placeholder="Select Panel Member"
                                        value={filterInterview}
                                        loadOptions={EmployeeListDropDownPagination}
                                        onChange={(option) => setFilterInterview(option)}
                                        debounceTimeout={300}
                                        isMulti
                                        isClearable
                                        styles={customStyles}
                                        additional={{
                                            page: 1
                                        }}
                                        classNamePrefix="react-select"
                                    />
                                </div> */}
                            </div>
                        )
                    }

                    {
                        !approvedEmailAnotherView && (
                            <Typography variant="subtitle1" mt={2} mb={1}>
                                Description
                            </Typography>
                        )
                    }

                    {
                        approvedEmailAnotherView && (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Approved By</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Approved Designation</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Approved Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div style={{
                                                    display: 'grid',
                                                }} >
                                                    <span>{approvalHistoryData?.add_by_name} </span>
                                                    <span>{approvalHistoryData?.add_by_email} </span>
                                                    <span>{approvalHistoryData?.add_by_mobile} </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{approvalHistoryData?.add_by_designation}</TableCell>
                                            <TableCell>{moment(approvalHistoryData?.add_date).format('DD-MM-YYYY')}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )
                    }

                    {
                        !approvedEmailAnotherView && modalData && modalData?.modal_title === "Appointment Letter" ?
                            (
                                <Box sx={{ mb: 2 }}>
                                    <Editor
                                        value={description}
                                        onEditorChange={(content) => setDescription(content)}
                                        // tinymceScriptSrc optional because we already loaded it; including it is harmless
                                        init={{
                                            tinymceScriptSrc: src,
                                            height: 400,
                                            menubar: true,
                                            plugins: "advlist lists link image code table wordcount",
                                            toolbar:
                                                "undo redo | formatselect | bold italic underline | " +
                                                "alignleft aligncenter alignright alignjustify | " +
                                                "bullist numlist outdent indent | link image | table | removeformat | code",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:12px; line-height:1.3 }",
                                            branding: false,
                                            promotion: false,
                                        }}
                                    />
                                </Box>
                            )
                            :
                            !approvedEmailAnotherView && (
                                <Box>
                                    {/* <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={(content) => setDescription(content)}
                                        modules={modules}
                                        formats={formats}
                                        style={{ height: "400px" }}
                                    /> */}

                                    <Editor
                                        value={description}
                                        onEditorChange={(content) => setDescription(content)}
                                        // tinymceScriptSrc optional because we already loaded it; including it is harmless
                                        init={{
                                            tinymceScriptSrc: src,
                                            height: 400,
                                            menubar: true,
                                            plugins: "advlist lists link image code table wordcount",
                                            toolbar:
                                                "undo redo | formatselect | bold italic underline | " +
                                                "alignleft aligncenter alignright alignjustify | " +
                                                "bullist numlist outdent indent | link image | table | removeformat | code",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:12px; line-height:1.3 }",
                                            branding: false,
                                            promotion: false,
                                        }}
                                    />
                                </Box>
                            )
                    }

                    {
                        !approvedEmailAnotherView && modalData?.modal_title !== "Joining Intimation" && (
                            <Box mt={10}>
                                {mendetoryDocument.length > 0 && (
                                    <Box mb={2}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Documents
                                        </Typography>
                                        {mendetoryDocument.map((doc, idx) => (
                                            <Stack direction="row" spacing={1} alignItems="center" key={doc.name || idx} sx={{ mb: 1 }}>
                                                {/* Checkbox */}
                                                <Checkbox
                                                    checked={isInitialized ? selectedDocIds.includes(doc._id) : false}
                                                    disabled={doc?.is_optional === 'No'}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedDocIds(prev => [...prev, doc._id]);
                                                        } else {
                                                            setSelectedDocIds(prev => prev.filter(id => id !== doc._id));
                                                        }
                                                    }}
                                                    size="small"
                                                    sx={{
                                                        color: '#1976d2 !important',
                                                        '&.Mui-checked': {
                                                            color: '#1976d2 !important',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: '#1976d2 !important',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(25, 118, 210, 0.04) !important',
                                                        },
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {doc.doc_name}
                                                </Typography>
                                                {/* View Icon */}
                                                <Tooltip title="View" arrow componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            bgcolor: '#1976d2',
                                                            color: 'white',
                                                            fontSize: '0.75rem',
                                                            '& .MuiTooltip-arrow': { color: '#1976d2' }
                                                        }
                                                    }
                                                }}>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        href={doc.file_name}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                {/* Download Icon */}
                                                <Tooltip title="Download" arrow componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            bgcolor: '#388e3c',
                                                            color: 'white',
                                                            fontSize: '0.75rem',
                                                            '& .MuiTooltip-arrow': { color: '#388e3c' }
                                                        }
                                                    }
                                                }}>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        href={doc.file_name}
                                                        download
                                                        rel="noopener noreferrer"
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Uploads Button */}
                                                <Tooltip title="Upload" arrow componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            bgcolor: '#388e3c',
                                                            color: 'white',
                                                            fontSize: '0.75rem',
                                                            '& .MuiTooltip-arrow': { color: '#388e3c' }
                                                        }
                                                    }
                                                }}>
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        component="label"
                                                    >
                                                        <UploadFileIcon />
                                                        <input
                                                            type="file"
                                                            multiple
                                                            hidden
                                                            onChange={(e) => {
                                                                handleFileUpload(idx, e);
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>

                                                {
                                                    doc?.is_remove && (
                                                        <Tooltip title="Remove" arrow componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                    bgcolor: '#d32f2f',
                                                                    color: 'white',
                                                                    fontSize: '0.75rem',
                                                                    '& .MuiTooltip-arrow': { color: '#d32f2f' }
                                                                }
                                                            }
                                                        }}>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleRemoveOptional(doc)}
                                                            >
                                                                <DeleteForeverIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )
                                                }

                                                {/* Show uploaded file names below the upload icon */}
                                                <Box>
                                                    {file && file[idx] && file[idx].map((file, fileIdx) => (
                                                        <Typography key={fileIdx} variant="caption" color="success.main" sx={{ display: 'block', ml: 1 }}>
                                                            {file.name}
                                                        </Typography>
                                                    ))}
                                                </Box>

                                            </Stack>
                                        ))}

                                        {
                                            optionalDoc?.length > 0 && (
                                                <>

                                                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                                                        <InputLabel id="document-type-select-label">Select Document</InputLabel>
                                                        <Select
                                                            labelId="document-type-select-label"
                                                            id="document-type-select"
                                                            value={selectedDoc}
                                                            label="Select Document"
                                                            onChange={(e) => handleUpdateDocument(e)}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    '&:hover fieldset': {
                                                                        borderColor: '#D2C9FF',
                                                                    },
                                                                    '&.Mui-focused fieldset': {
                                                                        borderColor: '#D2C9FF',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {optionalDoc.map((option) => (
                                                                <MenuItem key={option._id} value={option._id}>
                                                                    {option.doc_name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </>
                                            )
                                        }
                                    </Box>
                                )}
                                {/* Upload New File */}
                                {/* <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<UploadFileIcon />}
                                        disabled={modalData?.modal_data?.appointment_letter_verification_status?.status === 'Complete' || modalData?.modal_data?.document_status?.status === 'approved'}
                                    >
                                        Upload New File
                                        <input
                                            type="file"
                                            ref={resetRef}
                                            hidden
                                            onChange={handleFileUploadMultiple}
                                        />
                                    </Button>
                                </Stack>
                                {files.map((file, idx) => (
                                    <Stack direction="row" spacing={1} alignItems="center" key={file.name + idx} sx={{ mb: 1 }}>
                                        <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {file.name}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            href={URL.createObjectURL(file)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemoveFile(idx)}
                                        >
                                            <GridDeleteIcon />
                                        </IconButton>
                                    </Stack>
                                ))} */}
                                {/* here design the salary  */}
                            </Box>
                        )}
                    {
                        approvedEmailAnotherView ? (
                            <div className='d-flex align-item-end justify-content-end'>
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    sx={{
                                        mt: 3,
                                        height: 44,
                                        width: 100,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onClick={handleSend}
                                    disabled={loading}
                                >
                                    {modalData?.modal_title === "Joining Intimation" ? 'Send' : // Always show "Send" for Joining Intimation
                                        (modalData?.modal_data?.appointment_letter_verification_status?.status === 'Pending' && modalData?.modal_title === "Appointment Letter") ? 'Generate' : loading ? (
                                            <CircularProgress
                                                size={24}
                                                sx={{
                                                    color: 'white',
                                                }}
                                            />
                                        ) : (
                                            'Send'
                                        )}
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="d-flex align-items-end justify-content-end"
                                style={{ gap: "10px" }}
                            >
                                {/* Conditionally show Skip button - not for Joining Intimation */}
                                {modalData && modalData?.modal_title !== "Appointment Letter" &&
                                    modalData?.modal_title !== "Joining Intimation" &&
                                    roleUserDetails?.special_permissions?.reference_check_skip === "yes" && (
                                        <Button
                                            onClick={SkipReference}
                                            variant="outlined"
                                            color="primary"
                                        >
                                            {skipLoading ? <CircularProgress size={24} /> : "Skip"}
                                        </Button>
                                    )}

                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{
                                        mt: 0,
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "all 0.3s ease",
                                        minWidth: 100,
                                    }}
                                    onClick={handleSend}
                                    disabled={loading}
                                >
                                    {modalData?.modal_title === "Joining Intimation" ? 'Send' : // Always show "Send" for Joining Intimation
                                        modalData?.modal_data?.appointment_letter_verification_status?.status === "Pending" ? (
                                            "Generate"
                                        ) : loading ? (
                                            <CircularProgress size={24} sx={{ color: "white" }} />
                                        ) : (
                                            "Send"
                                        )}
                                </Button>
                            </div>
                        )
                    }
                </Box>
            </Modal>
            <DocumentModal open={openDocModal} onClose={closedDocumentModal} data={[]} candidateData={modalData} />
        </>
    );
}
