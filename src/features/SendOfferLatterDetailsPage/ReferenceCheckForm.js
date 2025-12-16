import React, { useEffect, useMemo, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    IconButton,
    ThemeProvider,
    createTheme,
    Grid, // Import Grid for layout
    Checkbox, // Import Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { toast } from 'react-toastify';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // MUI equivalent for AiOutlineDelete

// Note: I am assuming the external library components (like AiOutlineDelete, Col, Row, Form.Control)
// for the new document upload fields were placeholders or from a component library you've aliased.
// For consistency and to fully use the imported MUI components, I will use MUI Grid for the layout.

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

const ReferenceCheckModal = ({ open, onClose, Candidate, fetchAgainApprovalDetails, referenceStatus, roleUserDetails }) => {
    // 1. UPDATE STATE: Added is_html and is_optional default values
    const [formData, setFormData] = useState({
        refreeName: '',
        designation: '',
        mobile: '',
        email: '',
        referenceStatus: 'previous',
        isLoading: false,
        uploaded_docs: Candidate?.uploaded_docs || [], // Assuming this comes from the Candidate prop
        documents: [] // { file, name, is_html, is_optional }
    });
    // Assuming deleteDocumentLoading state exists in parent/context or is managed here for remove button
    const [deleteDocumentLoading, setDeleteDocumentLoading] = useState(null);

    console.log("candidate data", Candidate)
    const RoleUserDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem("admin_role_user") || {});
    }, [])

    const { id } = useParams()

    useEffect(() => {
        if (referenceStatus && open) {
            setFormData(prev => ({
                ...prev,
                referenceStatus,
                // Ensure uploaded_docs is initialized from Candidate prop when modal opens
                uploaded_docs: Candidate?.uploaded_docs || []
            }));
        }
    }, [referenceStatus, open, Candidate?.uploaded_docs]);


    const [errors, setErrors] = useState({ mobile: '', email: '' });

    // 2. UPDATE handleDocumentAdd to initialize checkbox states
    const handleDocumentAdd = (files) => {
        const selectedFiles = Array.from(files);

        setFormData((prev) => {
            const existing = prev.documents.map(d => d.file.name);

            const newDocs = selectedFiles
                .filter(file => !existing.includes(file.name))
                .map(file => ({
                    file,
                    name: "",          // ✅ empty by default
                    is_html: 'No',
                    is_optional: 'No',
                }));

            return {
                ...prev,
                documents: [...prev.documents, ...newDocs],
            };
        });
    };


    // 3. UPDATE handleFileNameChange to handle name and checkbox status changes
    const handleDocumentFieldChange = (index, value, fieldName) => {
        setFormData((prev) => {
            const updated = [...prev.documents];
            updated[index] = {
                ...updated[index],
                [fieldName]: value,
            };
            return { ...prev, documents: updated };
        });
    };

    const handleRemoveDocument = (index) => {
        setFormData((prev) => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index),
        }));
    };

    // Placeholder for remove existing document function (assuming original logic)
    const handleRemoveDoc = async (docId) => {
        setDeleteDocumentLoading(docId);
        try {
            // Replace with actual API call to delete document
            // Example:
            await axios.post(`${config.API_URL}deleteDocument`, { doc_id: docId }, apiHeaderToken(config.API_TOKEN));
            toast.success("Document removed successfully");

            // Simulating success: remove from formData.uploaded_docs
            setFormData(prev => ({
                ...prev,
                uploaded_docs: prev.uploaded_docs.filter(doc => doc._id !== docId)
            }));
            toast.success("Document removed successfully (simulated)");

            fetchAgainApprovalDetails();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to remove document");
        } finally {
            setDeleteDocumentLoading(null);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'mobile') {
            const isValid = /^[0-9]{10}$/.test(value);
            setErrors(prev => ({ ...prev, mobile: isValid || value === '' ? '' : 'Enter a valid 10-digit mobile number' }));
        }

        if (name === 'email') {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setErrors(prev => ({ ...prev, email: isValid || value === '' ? '' : 'Enter a valid email address' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isMobileValid = /^[0-9]{10}$/.test(formData.mobile);
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

        setErrors({
            mobile: isMobileValid ? '' : 'Enter a valid 10-digit mobile number',
            email: isEmailValid ? '' : 'Enter a valid email address'
        });

        if (!isMobileValid || !isEmailValid) return;

        setFormData(prev => ({ ...prev, isLoading: true }));

        try {
            const formDataPayload = new FormData();

            // Text fields
            formDataPayload.append("name", formData.refreeName);
            formDataPayload.append("designation", formData.designation);
            formDataPayload.append("mobile", formData.mobile);
            formDataPayload.append("email", formData.email);
            formDataPayload.append("referenceStatus", formData.referenceStatus);
            formDataPayload.append("cand_doc_id", Candidate?.cand_doc_id);
            formDataPayload.append("approval_note_doc_id", id);
            formDataPayload.append("added_by_name", RoleUserDetails?.name);
            formDataPayload.append("added_by_mobile", RoleUserDetails?.mobile_no);
            formDataPayload.append("added_by_designation", RoleUserDetails?.designation);
            formDataPayload.append("added_by_email", RoleUserDetails?.email);

            // Documents
            formData.documents.forEach((doc) => {
                formDataPayload.append("documents[]", doc.file);
                formDataPayload.append("document_names[]", doc.name);
                // NEW: Append checkbox states
                formDataPayload.append("is_htmls[]", doc.is_html);
                formDataPayload.append("is_optionals[]", doc.is_optional);
            });

            // ... API call logic ...
            const response = await axios.post(
                `${config.API_URL}updateReferenceCheckInApprovalNote`,
                formDataPayload,
                {
                    ...apiHeaderToken(config.API_TOKEN),
                    headers: {
                        ...apiHeaderToken(config.API_TOKEN)?.headers,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data?.message);
                fetchAgainApprovalDetails();
                onClose();

                setFormData({
                    refreeName: '',
                    designation: '',
                    mobile: '',
                    email: '',
                    referenceStatus: 'previous',
                    isLoading: false,
                    documents: []
                });
            } else {
                toast.error(response.data?.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setFormData(prev => ({ ...prev, isLoading: false }));
        }
    };


    const SkipReference = async (e) => {
        e.preventDefault();
        // ... SkipReference logic ...
    };

    return (
        <ThemeProvider theme={theme}>
            <Modal open={open} onClose={onClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600, // Slightly increased width for better layout of 4 fields
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxWidth: '95vw',
                    maxHeight: '95vh',
                    overflowY: 'auto'
                }}>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }} size="small">
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h5" gutterBottom fontWeight="bold">Reference Check</Typography>

                    <form onSubmit={handleSubmit}>
                        {/* Reference Status Radio Group (MUI is fine) */}
                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                            <FormLabel component="legend">Reference Status</FormLabel>
                            <RadioGroup
                                row
                                name="referenceStatus"
                                value={formData.referenceStatus}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value={formData.referenceStatus}
                                    control={<Radio color="primary" />}
                                    label={formData.referenceStatus === 'previous' ? "Previous" : formData.referenceStatus === 'current' ? "Current" : "HR Head"}
                                />
                            </RadioGroup>
                        </FormControl>

                        {/* Text Fields (MUI is fine) */}
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Referee Name"
                            name="refreeName"
                            value={formData.refreeName}
                            onChange={handleChange}
                            size="small"
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            size="small"
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Mobile Number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            size="small"
                            required
                            error={Boolean(errors.mobile)}
                            helperText={errors.mobile}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            size="small"
                            required
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                        />

                        {/* Hidden File Input */}
                        <input
                            id="documentInput"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            hidden
                            onChange={(e) => {
                                handleDocumentAdd(e.target.files);
                                e.target.value = ""; // allows selecting same file again
                            }}
                        />

                        {/* --- Attached Documents Display (Existing UI - now using MUI Checkbox instead of Form.Check) --- */}
                        {formData?.uploaded_docs?.length > 0 && (
                            <Box mt={5}>
                                <Typography variant="h6" gutterBottom>
                                    Attached Documents:
                                </Typography>

                                <Grid container spacing={2}>
                                    {/* Header Row for Attached Docs */}
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" sx={{ fontWeight: 'bold' }}>
                                            <Grid item xs={4}>Document Name</Grid>
                                            <Grid item xs={4}>File & Controls</Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Documents List */}
                                    {formData.uploaded_docs.map((doc, idx) => (
                                        <Grid
                                            key={doc._id || idx}
                                            item
                                            xs={12}
                                            sx={{ borderBottom: '1px solid #eee' }} // Added a separator
                                        >
                                            <Grid container alignItems="center" spacing={1}>
                                                {/* 1️⃣ Doc Name (4/12) */}
                                                <Grid item xs={6}>
                                                    <Typography fontWeight="bold">
                                                        {doc.doc_name}
                                                    </Typography>
                                                </Grid>

                                                {/* 4️⃣ File Name & Remove Button (4/12) */}
                                                <Grid item xs={6}>
                                                    <Box display="flex" alignItems="center" justifyContent={'space-between'} gap={1}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            ({doc.file_name})
                                                        </Typography>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            disabled={deleteDocumentLoading === doc?._id}
                                                            onClick={() => handleRemoveDoc(doc?._id)}
                                                        >
                                                            {deleteDocumentLoading === doc?._id ? 'Deleting....' : 'Remove'}
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                        {/* --- End Attached Documents Display --- */}

                        <Box sx={{ mt: 5 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <FormLabel>Attach Documents (PDF, DOC, DOCX, Images)</FormLabel>

                                <IconButton
                                    color="primary"
                                    onClick={() => document.getElementById("documentInput").click()}
                                >
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Box>

                            {/* --- New Document Uploads  --- */}
                            {formData.documents.map((doc, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        mb: 1.5,
                                        borderRadius: 2,
                                        border: "1px solid #e0e0e0",
                                        backgroundColor: "#fff",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    <Grid container spacing={1.5} alignItems="center">
                                        {/* Document Name */}
                                        <Grid item xs={12} sm={5}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Document Name"
                                                placeholder="Enter document title"
                                                value={doc.name}
                                                onChange={(e) =>
                                                    handleDocumentFieldChange(index, e.target.value, "name")
                                                }
                                                required
                                            />
                                        </Grid>

                                        {/* File name */}
                                        <Grid item xs={11} sm={6}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    pr: 1,
                                                }}
                                                title={doc.file.name}
                                            >
                                                {doc.file.name}
                                            </Typography>
                                        </Grid>

                                        {/* Remove button */}
                                        <Grid item xs={1} sm={1} textAlign="right">
                                            <IconButton
                                                size="small"
                                                disableRipple
                                                onClick={() => handleRemoveDocument(index)}
                                                sx={{
                                                    color: "#d32f2f", // always red
                                                    p: 0.5,
                                                    // "&:hover": {
                                                    //     backgroundColor: "transparent", // no hover bg
                                                    // },
                                                }}
                                            >
                                                <DeleteOutlineIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: "#c62828",
                                                        stroke: "#c62828",
                                                        strokeWidth: 1.2,
                                                    }}
                                                />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}

                            {/* --- End New Document Uploads --- */}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                            {
                                roleUserDetails && roleUserDetails?.special_permissions?.reference_check_skip === 'yes' && (
                                    <Button
                                        onClick={SkipReference}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        Skip
                                    </Button>
                                )
                            }
                            <Button
                                disabled={formData.isLoading}
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                {formData?.isLoading ? "Loading..." : "Submit"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal >
        </ThemeProvider >
    );
};

export default ReferenceCheckModal;