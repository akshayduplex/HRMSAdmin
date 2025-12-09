import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { Editor } from '@tinymce/tinymce-react';
import config from "../../config/config";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../../config/api_header";
import { toast } from "react-toastify";
import axios from "axios";
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Button as MuiXButton, Skeleton, Modal, Box, Typography, DialogContent, IconButton, Dialog, DialogTitle, Chip, Grid } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog as PreviewDialog } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import { CircularProgress } from '@mui/material';
import { changeJobTypeLabel } from "../../utils/common";


function throttle(fn, delay) {
    let inThrottle = false;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, delay);
        }
    };
}



function useIsMobile(breakpoint = 768, throttleDelay = 200) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined'
            ? window.innerWidth <= breakpoint
            : false
    );

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= breakpoint);
    }, [breakpoint]);

    // wrap our resize handler in a throttled version
    const throttledResize = useMemo(
        () => throttle(handleResize, throttleDelay),
        [handleResize, throttleDelay]
    );

    useEffect(() => {
        // set initial value
        handleResize();

        // subscribe using throttled handler
        window.addEventListener('resize', throttledResize);

        return () => {
            window.removeEventListener('resize', throttledResize);
        };
    }, [handleResize, throttledResize]);

    return isMobile;
}


const OfferLatterTemp = ({ type, template, setTemplate, loadingTemplate, handleFetchTemplate, jobType }) => {


    const [fileInputs, setFileInputs] = useState([
        { id: 0, file: null, fileName: '', is_html: 'No', is_optional: 'No' }
    ]);

    const isMobile = useIsMobile(768, 200);
    const editorRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [showEditAdd, setEditAdd] = useState(false);

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        itemId: null
    });

    const [previewModal, setPreviewModal] = useState({
        open: false,
        documents: [],
        parent_id: null,
    });

    const [documentPreview, setDocumentPreview] = useState({
        open: false,
        url: '',
        name: '',
        type: ''
    });

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

    const handleDocumentPreview = (doc) => {
        const fileExt = doc.file_name.split('.').pop().toLowerCase();
        const fileUrl = config.IMAGE_PATH + doc.file_name;

        // For PDF files, use Google Docs Viewer
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

        setDocumentPreview({
            open: true,
            url: viewerUrl,
            name: doc.doc_name,
            type: fileExt
        });
    };
    // Add this handler function
    const handlePreviewDocuments = (documents, parent_id) => {
        setPreviewModal({
            open: true,
            documents: documents,
            parent_id: parent_id
        });
    };

    // Add this style object inside your component
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
    };

    const handleFileNameChange = (id, value, field) => {
        setFileInputs(prev => prev.map(input =>
            input.id === id ? { ...input, [field]: value } : input
        ));
    };

    // const replaceSelectedTextWithVariable = (variable) => {
    //     const editor = editorRef.current;
    //     if (editor) {
    //         const placeholder = `{#${variable.key}}`;
    //         editor?.insertContent(placeholder);
    //         // Manually sync state after insertion
    //         setFormDataWithPayloads(prev => ({
    //             ...prev,
    //             description: editor.getContent()
    //         }));
    //     }
    // };

    const replaceSelectedTextWithVariable = (variable) => {
        const editor = editorRef.current;
        if (!editor) return;

        const placeholder = `{#${variable.key}}`;

        const selectedHTML = editor.selection.getContent({ format: "html" });

        if (selectedHTML) {
            editor.selection.setContent(`<span class="template-var">${placeholder}</span>`);
        } else {
            editor.insertContent(`<span class="template-var">${placeholder}</span>`);
        }

        editor.focus();

        setFormDataWithPayloads(prev => ({
            ...prev,
            description: editor.getContent()
        }));
    };


    const handleFileChangeMulti = (id, e) => {
        const file = e.target.files[0];
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (file && allowedTypes.includes(file.type)) {
            setFileInputs(prev => prev.map(input =>
                input.id === id ? { ...input, file: file } : input
            ));
            setFormDataWithPayloads(prev => ({
                ...prev,
                attachment_array: fileInputs.map(input => input.file).filter(Boolean)
            }));
        } else {
            alert('Please upload only PDF, DOC or DOCX files');
            e.target.value = null;
        }
    };

    const addMoreFiles = () => {
        setFileInputs(prev => [...prev, { id: prev.length, file: null, fileName: '' }]);
    };
    // Add this function to remove a file input
    const removeFileInput = (id) => {
        setFileInputs(prev => prev.filter(input => input.id !== id));
    };

    const [formData, setFormDataWithPayloads] = useState({
        description: "",
        job_type: "",
        status: "",
        attachment: "",
        old_attachment: "",
        uploaded_docs: [],
        doc_id: "",
        is_esic: "No"
    });

    const [selectedFile, setSelectedFile] = useState(null);

    // Add this function inside your component
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (file && allowedTypes.includes(file.type)) {
            setSelectedFile(file);
            setFormDataWithPayloads(prev => ({
                ...prev,
                attachment: file
            }));
        } else {
            alert('Please upload only PDF, DOC or DOCX files');
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // add the types of form  -
        let formType = '';

        switch (type) {
            case 'appointment':
                formType = 'Appointment Letter'
                break;
            case 'offer':
                formType = 'Offer Letter'
                break;
            default:
                formType = 'Joining Kit';
        }
        const formDataToSend = new FormData();
        formDataToSend.append("template", formData.description);
        formDataToSend.append("job_type", formData.job_type);
        formDataToSend.append("status", formData.status);
        formDataToSend.append("template_for", formType);
        formDataToSend.append("esic_status", !formData.is_esic ? "No" : formData.is_esic);
        let attachments = [];

        const mimeMap = {
            html: "text/html",
            txt: "text/plain",
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
        };

        function getMimeType(filename) {
            const ext = filename.split(".").pop().toLowerCase();
            return mimeMap[ext] || "application/octet-stream";
        }

        // create a zero‑byte dummy File object for *any* filename
        function createDummyFile(filename) {
            const mime = getMimeType(filename);
            return new File([new Uint8Array()], filename, { type: mime });
        }

        let dummyFile = createDummyFile('dummy.pdf')


        if (fileInputs && Array.isArray(fileInputs)) {
            attachments = fileInputs.map((input) => ({
                doc_name: input.fileName,
                file_name: input.is_html === 'Yes' ? dummyFile : input.file,
                is_html: !input?.is_html ? 'No' : input.is_html,
                is_optional: !input?.is_optional ? 'No' : input.is_optional
            }));
        }

        attachments.forEach((att, i) => {
            formDataToSend.append(`attachments[${i}][doc_name]`, att.doc_name);
            formDataToSend.append(`attachments[${i}][file_name]`, att.file_name);
            formDataToSend.append(`attachments[${i}][is_html]`, att.is_html);
            formDataToSend.append(`attachments[${i}][is_optional]`, att.is_optional);
        });

        try {

            let response = await axios.post(`${config.API_URL}saveTemplateSettings`, formDataToSend, apiHeaderTokenMultiPart(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response?.data?.message);
                handleFetchTemplate(type);
                setEditAdd(false);
                setFormDataWithPayloads({
                    description: "",
                    job_type: "",
                    status: "",
                    attachment: "",
                    old_attachment: "",
                    doc_id: "",
                });
                setFileInputs([{ id: 0, file: null, fileName: '' }]);
                setSelectedFile(null);

            } else {
                toast.error(response?.data?.message);
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteTemplate = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(`${config.API_URL}removeTemplateSettingsById`, { doc_id: id }, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response?.data?.message);
                // handleFetchTemplate(type);
                setTemplate(prev => prev.filter((item) => item._id !== id));
                setDeleteModal({ open: false, itemId: null }); // Close modal after success
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.error("Error deleting template:", error);
            toast.error(error?.response?.data?.message || error?.message || "An error occurred while deleting the template.");
        } finally {
            setLoading(false);
            setDeleteModal({ open: false, itemId: null });
        }
    }

    const TEMPLATE_VARIABLES = [
        { key: 'name', label: 'Name' },
        { key: 'position_name', label: 'Position' },
        { key: 'project_name', label: 'Project' },
        { key: 'department_name', label: 'Department' },
        { key: 'designation_name', label: 'Designation' },
        { key: 'location', label: 'Location' },
        { key: 'contract_end_date', label: 'Contract End Date' },
        { key: 'reporting_person_name', label: 'Reporting Person' },
        { key: 'posting_location', label: 'Posting Location' },
        { key: 'offer_amount', label: 'Offer Amount' },
        { key: 'offer_amount_in_words', label: 'Amount in Words' },
        { key: 'onboarding_date', label: 'Onboarding Date' },
        { key: 'salary_type', label: 'Salary Type' },
        { key: 'company_name', label: 'Company Name' },
        { key: 'page_link', label: 'Send Link' },
        { key: 'email_id', label: 'Email ID' },
        { key: 'login_url', label: 'Login URL' },
        { key: 'father_name', label: 'Father Name' },
        { key: 'ro_address', label: 'RO Address' },
        { key: 'salary_structure', label: 'Salary Structure' },
        { key: 'additional_benefits', label: 'Additional Benefits' },
        { key: 'signature', label: 'Signature' },
    ];

    const [deleteDocumentLoading, setDeleteModalLoading] = useState(false);

    const handleDeleteDocument = async (docId) => {
        if (!docId) return;

        setDeleteModalLoading(docId);

        try {

            const response = await axios.post(
                `${config.API_URL}removeAttachmentDocFromTSById`,
                { doc_id: previewModal.parent_id, attachment_id: docId },
                apiHeaderToken(config.API_TOKEN)
            );

            if (response.status === 200) {
                toast.success(response?.data?.message || 'Document deleted successfully');
                // Update the documents list in the preview modal
                setPreviewModal(prev => ({
                    ...prev,
                    documents: prev.documents.filter(doc => doc._id !== docId)
                }));

                handleFetchTemplate(type);

            } else {
                toast.error(response?.data?.message || 'Failed to delete document');
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            toast.error(error?.response?.data?.message || 'Error deleting document');
        }
        finally {
            setDeleteModalLoading(null);
        }
    };

    const handleRemoveDoc = async (docId) => {
        if (!docId) return;

        setDeleteModalLoading(docId);

        try {

            const response = await axios.post(
                `${config.API_URL}removeAttachmentDocFromTSById`,
                { doc_id: formData?.doc_id, attachment_id: docId },
                apiHeaderToken(config.API_TOKEN)
            );

            if (response.status === 200) {
                toast.success(response?.data?.message || 'Document deleted successfully');
                // Update the documents list in the preview modal
                setFormDataWithPayloads(prev => ({
                    ...prev,
                    uploaded_docs: prev.uploaded_docs.filter(doc => doc._id !== docId)
                }));

                // handleFetchTemplate(type);

            } else {
                toast.error(response?.data?.message || 'Failed to delete document');
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            toast.error(error?.response?.data?.message || 'Error deleting document');
        }
        finally {
            setDeleteModalLoading(null);
        }
    };


    return (
        <>
            <Col className="p-3">
                <div className="d-flex justify-content-end mb-3">
                    {!showEditAdd ? (
                        <Button
                            variant="success"
                            onClick={() => {
                                setEditAdd(!showEditAdd);
                            }}
                        >
                            <AiOutlinePlusCircle className="me-1" size={20} />
                            Add New Template
                        </Button>
                    ) : (
                        <Button
                            variant="danger"
                            onClick={() => {
                                setEditAdd(!showEditAdd);
                            }}
                        >
                            <AiOutlineDelete className="me-1" size={20} />
                            close
                        </Button>
                    )}
                </div>
                {!showEditAdd && (
                    <TableContainer component={Paper} elevation={0}>
                        <Table sx={{ minWidth: 650 }} aria-label="template table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        Sr
                                    </TableCell>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        Job Type
                                    </TableCell>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        Status
                                    </TableCell>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        Added Date
                                    </TableCell>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        View Doc
                                    </TableCell>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loadingTemplate ? (
                                    // 1. Loading state
                                    [...Array(3)].map((_, index) => (
                                        <TableRow key={`loading-${index}`}>
                                            {[...Array(6)].map((_, cellIndex) => (
                                                <TableCell key={`loading-cell-${cellIndex}`}>
                                                    <Skeleton animation="wave" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : template && template.length > 0 ? (
                                    // 2. Data state
                                    template.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Grid container alignItems="center" spacing={1}>
                                                    <Grid item xs={12} md="auto" sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box sx={{
                                                            fontWeight: 'bold',
                                                            color: 'text.primary',
                                                            minWidth: '80px' // Ensures consistent width for job type label
                                                        }}>
                                                            {changeJobTypeLabel(item.job_type)}
                                                        </Box>

                                                        {item?.job_type === "ONROLE" && (
                                                            <Chip
                                                                label={item.esic_status === 'No' ? 'Mediclaim' : 'ESIC'}
                                                                size="small"
                                                                color={item.esic_status === 'No' ? 'default' : 'primary'}
                                                                sx={{
                                                                    ml: 1.5,
                                                                    fontWeight: 600,
                                                                    fontSize: '0.75rem',
                                                                    height: '24px',
                                                                    '& .MuiChip-label': { px: 1 }
                                                                }}
                                                            />
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                            <TableCell>{item.status || ''}</TableCell>
                                            <TableCell>{moment(item.add_date).format("DD/MM/YYYY")}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handlePreviewDocuments(item.attachments, item._id)}
                                                    size="small"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <MuiXButton
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                    startIcon={<EditIcon />}
                                                    onClick={() => {
                                                        setEditAdd(!showEditAdd);
                                                        console.log(item)
                                                        const docUrl = config.IMAGE_PATH + item?.attachments?.[0]?.file_name;
                                                        setFormDataWithPayloads({
                                                            description: item.template,
                                                            job_type: item.job_type,
                                                            status: item.status,
                                                            old_attachment: docUrl,
                                                            uploaded_docs: item?.attachments,
                                                            doc_id: item._id,
                                                            is_esic: item?.esic_status
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </MuiXButton>
                                                <MuiXButton
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => setDeleteModal({ open: true, itemId: item._id })}
                                                >
                                                    Delete
                                                </MuiXButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    // 3. Empty state
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            No Records Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Your existing form code for adding/editing templates */}
                {showEditAdd && (
                    <Form className="mt-4 border p-3 rounded">
                        <Row>
                            <Col md={formData.job_type === 'ONROLE' ? 4 : 6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Job Type</Form.Label>
                                    <Form.Select
                                        value={formData.job_type}
                                        onChange={(e) => {
                                            setFormDataWithPayloads((prev) => (
                                                {
                                                    ...prev,
                                                    job_type: e.target.value
                                                }
                                            ))
                                        }}
                                        required
                                        isInvalid={formData.job_type === ""}
                                    >
                                        <option value="">Select Job Type</option>
                                        <option value="ONROLE" >On Role</option>
                                        <option value="ONCONTRACT" >On Consultant</option>
                                        <option value="EMPANELED">EMPANELED</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a job type.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {
                                formData.job_type === 'ONROLE' && (
                                    <Col md={formData.job_type === 'ONROLE' ? 4 : 6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ESIC Status</Form.Label>
                                            <Form.Select
                                                value={formData.is_esic}
                                                onChange={(e) => {
                                                    setFormDataWithPayloads((prev) => (
                                                        {
                                                            ...prev,
                                                            is_esic: e.target.value
                                                        }
                                                    ))
                                                }}
                                                required
                                                isInvalid={formData.is_esic === ""}
                                            >
                                                <option value="">Select ESIC</option>
                                                <option value="Yes" >ESIC</option>
                                                <option value="No" >Non ESIC</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select a ESIC.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                )
                            }

                            <Col md={formData.job_type === 'ONROLE' ? 4 : 6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={formData.status}
                                        onChange={(e) => {
                                            setFormDataWithPayloads((prev) => (
                                                {
                                                    ...prev,
                                                    status: e.target.value
                                                }
                                            ))
                                        }}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={12} className="mb-3">
                                <Form.Group className="mb-3">
                                    <Form.Label>Template Description</Form.Label>
                                    <Editor
                                        onInit={(evt, editor) => {
                                            editorRef.current = editor;
                                        }}
                                        value={formData.description}
                                        onEditorChange={(content) => {
                                            setFormDataWithPayloads((prev) => ({
                                                ...prev,
                                                description: content
                                            }))
                                        }}
                                        tinymceScriptSrc={src}
                                        init={{
                                            height: 500,
                                            menubar: true,
                                            plugins: "advlist lists link image code table wordcount",
                                            toolbar:
                                                "undo redo | formatselect | bold italic underline | " +
                                                "alignleft aligncenter alignright alignjustify | " +
                                                "bullist numlist outdent indent | link image | table | removeformat | code" +
                                                "lineheight | forecolor backcolor | fullscreen",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:12px; line-height:1.5 }",
                                            line_height_formats: "1 1.15 1.5 1.75 2 2.5 3",
                                            branding: false,
                                            promotion: false,
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a description.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={12} className={!isMobile && "mt-5"} style={{ marginTop: isMobile && "5rem" }}>
                                <div className="d-flex flex-wrap gap-2">
                                    {TEMPLATE_VARIABLES.map((variable) => (
                                        <Button
                                            key={variable.key}
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => replaceSelectedTextWithVariable(variable)}
                                            style={{
                                                transition: 'all 0.3s ease',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = '#34209b';
                                                e.currentTarget.style.borderColor = '#34209b';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = '';
                                                e.currentTarget.style.borderColor = '';
                                                e.currentTarget.style.color = '';
                                            }}
                                        >
                                            {variable.label}
                                        </Button>
                                    ))}
                                </div>
                            </Col>

                            {formData?.uploaded_docs?.length > 0 && (
                                <Box mt={5}>
                                    <Typography variant="h6" gutterBottom>
                                        Attached Documents:
                                    </Typography>

                                    <Grid container spacing={2}>
                                        {formData.uploaded_docs.map((doc, idx) => (
                                            <Grid
                                                key={doc._id || idx}
                                                item
                                                xs={12}
                                            // sx={{
                                            //     borderBottom:'1px solid black'
                                            // }}
                                            >
                                                <Grid container alignItems="center" spacing={1}>
                                                    {/* 1️⃣ Doc Name (5/12) */}
                                                    <Grid item xs={4}>
                                                        <Typography fontWeight="bold">
                                                            {doc.doc_name}
                                                        </Typography>
                                                    </Grid>


                                                    <Grid item xs={2}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="HTML Form"
                                                            checked={doc.is_html === 'Yes'} // <-- ensure your state has `isHtml` boolean
                                                            className="mb-2"
                                                            readOnly
                                                        />
                                                    </Grid>

                                                    <Grid item xs={2}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="Is Optinal"
                                                            checked={doc?.is_optional === 'Yes'} // <-- ensure your state has `isHtml` boolean
                                                            className="mb-2"
                                                            readOnly
                                                        />
                                                    </Grid>

                                                    {/* 2️⃣ File Name (5/12) */}
                                                    <Grid item xs={4}>
                                                        <Box display="flex" alignItems="center" justifyContent={'space-between'} gap={1}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                ({doc.file_name})
                                                            </Typography>
                                                            <Button
                                                                type="button"
                                                                variant="outlined"
                                                                className="btn btn-sm btn-danger"
                                                                disabled={deleteDocumentLoading === doc?._id}
                                                                onClick={() => handleRemoveDoc(doc?._id)}
                                                            >
                                                                {deleteDocumentLoading === doc?._id ? 'Deleting....' : 'Remove'}
                                                            </Button>
                                                        </Box>
                                                    </Grid>

                                                    {/* 3️⃣ Controls (2/12) */}
                                                    {/* <Grid item xs={2}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={!!doc.is_html}
                                                                        size="small"
                                                                        disabled
                                                                    />
                                                                }
                                                                label="HTML"
                                                            />

                                                        </Box>
                                                    </Grid> */}
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}


                            <Col md={12} className="mt-3">
                                <Form.Group className="mb-3">
                                    <Form.Label>Attachments (Allowed formats PDF, DOC, DOCX )</Form.Label>
                                    {fileInputs.map((input, index) => (
                                        <div key={input.id} className="mb-3">
                                            <div className="row">
                                                <Col md={4}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter Document name"
                                                        value={input.fileName}
                                                        onChange={(e) => handleFileNameChange(input.id, e.target.value, 'fileName')}
                                                        required
                                                        className="form-control"
                                                    />
                                                </Col>

                                                <Col md={2}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="HTML Form"
                                                        checked={input.is_html === 'Yes'} // <-- ensure your state has `isHtml` boolean
                                                        onChange={(e) => handleFileNameChange(input.id, e.target.checked ? 'Yes' : 'No', 'is_html')}
                                                        className="mb-2"
                                                    />
                                                </Col>

                                                <Col md={2}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="Is Optional"
                                                        checked={input.is_optional === 'Yes'} // <-- ensure your state has `is_optional` boolean
                                                        onChange={(e) => handleFileNameChange(input.id, e.target.checked ? 'Yes' : 'No', 'is_optional')}
                                                        className="mb-2"
                                                    />
                                                </Col>

                                                <Col md={4}>
                                                    <div className="input-group flex-grow-1">
                                                        <Form.Control
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => handleFileChangeMulti(input.id, e)}
                                                            className="form-control"
                                                            required
                                                        />
                                                        {fileInputs.length > 1 && (
                                                            <Button
                                                                variant="outline-danger"
                                                                onClick={() => removeFileInput(input.id)}
                                                            >
                                                                <AiOutlineDelete size={20} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Col>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-end align-items-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={addMoreFiles}
                                            style={{
                                                transition: 'all 0.3s ease',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = '#34209b';
                                                e.currentTarget.style.borderColor = '#34209b';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = '';
                                                e.currentTarget.style.borderColor = '';
                                                e.currentTarget.style.color = '';
                                            }}
                                        >
                                            <AiOutlinePlusCircle
                                                className="me-1"
                                                size={20}
                                                style={{ verticalAlign: 'middle' }}
                                            />
                                            Add More Files
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center">
                            <Button
                                variant="primary"
                                type="submit"
                                className="px-4"
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{
                                    transition: 'all 0.3s ease',
                                }}

                            >
                                <AiOutlinePlusCircle className="me-1" size={20} />
                                {loading ? 'Saving...' : (formData.doc_id ? 'Update Template' : 'Add Template')}
                            </Button>
                        </div>
                    </Form>
                )}
            </Col>

            {/* Delete Confirmation modal */}
            <Modal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, itemId: null })}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-modal-title" variant="h6" component="h2" gutterBottom>
                        Confirm Delete
                    </Typography>
                    <Typography id="delete-modal-description" sx={{ mt: 2, mb: 3 }}>
                        Are you sure you want to delete this template? This action cannot be undone.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <MuiXButton
                            variant="outlined"
                            onClick={() => setDeleteModal({ open: false, itemId: null })}
                        >
                            Cancel
                        </MuiXButton>
                        <MuiXButton
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteTemplate(deleteModal.itemId)}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </MuiXButton>
                    </Box>
                </Box>
            </Modal>

            <Dialog
                open={previewModal.open}
                onClose={() => setPreviewModal({ open: false, documents: [] })}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: '#f8f9fa',
                    borderBottom: '1px solid #e0e0e0',
                    mb: 2
                }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        Document List
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => setPreviewModal({ open: false, documents: [] })}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'grey.500',
                            '&:hover': {
                                color: 'grey.700',
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        Document Name
                                    </TableCell>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        Added Date
                                    </TableCell>
                                    <TableCell sx={{
                                        backgroundColor: '#34209b',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        width: '120px'
                                    }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {previewModal.documents.map((doc, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: '#f8f9fa',
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                                {doc.doc_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2">
                                                {moment(doc.add_date).format('DD/MM/YYYY')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                display: 'flex',
                                                gap: 1,
                                                // Prevent layout shift
                                                minHeight: 40,
                                                alignItems: 'center'
                                            }}>
                                                {
                                                    doc?.is_html === 'Yes' ? (
                                                        <Chip label="HTML Form" color="primary" variant="outlined" />
                                                    )
                                                        : (

                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDocumentPreview(doc)}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(52, 32, 155, 0.08)',
                                                                        '& .MuiSvgIcon-root': {
                                                                            transform: 'scale(1.1)',
                                                                        }
                                                                    },
                                                                }}
                                                            >
                                                                <VisibilityIcon
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: '#34209b',
                                                                        transition: 'transform 0.2s ease'
                                                                    }}
                                                                />
                                                            </IconButton>

                                                        )
                                                }

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteDocument(doc._id)}
                                                    disabled={deleteDocumentLoading} // Disable button while loading
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                            '& .MuiSvgIcon-root': {
                                                                transform: 'scale(1.1)',
                                                            }
                                                        },
                                                    }}
                                                >
                                                    {deleteDocumentLoading === doc._id ? (
                                                        <CircularProgress
                                                            size={20}
                                                            sx={{
                                                                color: '#d32f2f',
                                                                animation: 'spin 1s linear infinite',
                                                            }}
                                                        />
                                                    ) : (
                                                        <DeleteIcon
                                                            fontSize="small"
                                                            sx={{
                                                                color: '#d32f2f',
                                                                transition: 'transform 0.2s ease'
                                                            }}
                                                        />
                                                    )}
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {previewModal.documents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                            <Typography color="text.secondary">
                                                No documents available
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>

            <PreviewDialog
                open={documentPreview.open}
                onClose={() => setDocumentPreview({ open: false, url: '', name: '', type: '' })}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        height: '90vh',
                        borderRadius: 2,
                        bgcolor: '#fff',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                    }
                }}
                sx={{
                    position: 'fixed',
                    zIndex: 99999,
                    '& .MuiDialog-paper': {
                        zIndex: 99999
                    },
                    '& .MuiBackdrop-root': {
                        zIndex: 99998
                    }
                }}

            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#34209b',
                        color: 'white',
                        py: 2
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {documentPreview.type === 'pdf' ? (
                            <PictureAsPdfIcon />
                        ) : (
                            <FileIcon />
                        )}
                        <Typography variant="h6">
                            {documentPreview.name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = documentPreview.url;
                                link.download = documentPreview.name;
                                link.click();
                            }}
                            sx={{
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => setDocumentPreview({ open: false, url: '', name: '', type: '' })}
                            sx={{
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 0, height: 'calc(100% - 64px)', bgcolor: '#fff' }}>
                    <iframe
                        src={documentPreview.url}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            backgroundColor: '#fff'
                        }}
                        title="Document Preview"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        loading="lazy"
                    />
                </DialogContent>
            </PreviewDialog>
        </>
    );
};

export default OfferLatterTemp;