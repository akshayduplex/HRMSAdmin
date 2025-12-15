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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { toast } from 'react-toastify';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

const ReferenceCheckModal = ({ open, onClose, Candidate, fetchAgainApprovalDetails, referenceStatus, roleUserDetails }) => {
    const [formData, setFormData] = useState({
        refreeName: '',
        designation: '',
        mobile: '',
        email: '',
        referenceStatus: 'previous',
        isLoading: false,
        documents: []
    });
    console.log("candidate data", Candidate)
    const RoleUserDetails = useMemo(() => {

        return JSON.parse(localStorage.getItem("admin_role_user") || {});

    }, [])

    const { id } = useParams()

    useEffect(() => {
        if (referenceStatus && open) {
            setFormData(prev => ({
                ...prev,
                referenceStatus
            }));
        }
    }, [referenceStatus, open]);


    const [errors, setErrors] = useState({ mobile: '', email: '' });

    const handleDocumentAdd = (files) => {
        const newFiles = Array.from(files);
        setFormData(prev => {
            const existingNames = prev.documents.map(f => f.name);
            const filtered = newFiles.filter(f => !existingNames.includes(f.name));
            return {
                ...prev,
                documents: [...prev.documents, ...filtered]
            };
        });
    };

    const handleRemoveDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
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
            formData.documents.forEach((file, index) => {
                formDataPayload.append("documents[]", file);
            });

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
                    referenceStatus: '',
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

        let payload = {
            "name": RoleUserDetails?.name,
            "designation": RoleUserDetails?.designation,
            "mobile": RoleUserDetails?.mobile_no,
            "email": RoleUserDetails?.email,
            "cand_doc_id": Candidate?.cand_doc_id,
            "approval_note_doc_id": id,
            "referenceStatus": "current",
        }
        console.log("payload", payload)
        try {

            let response = await axios.post(`${config.API_URL}skipReferenceCheckData`, payload, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                toast.success(response.data?.message)
                fetchAgainApprovalDetails()
                onClose();
            } else {
                toast.error(response.data?.message)
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error?.message || "Something Went Wrong")
        } finally {
            // setFormData((prev) => {
            //     return { ...prev, isLoading: false }
            // })
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Modal open={open} onClose={onClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxWidth: '90vw',
                }}>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }} size="small">
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h5" gutterBottom fontWeight="bold">Reference Check</Typography>

                    <form onSubmit={handleSubmit}>
                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                            <FormLabel component="legend">Reference Status</FormLabel>
                            <RadioGroup
                                row
                                name="referenceStatus"
                                value={formData.referenceStatus}
                                onChange={handleChange}
                            >
                                {/* <FormControlLabel value="current" disabled control={<Radio color="primary" />} label="Current" /> */}
                                <FormControlLabel value={formData.referenceStatus} control={<Radio color="primary" />} label={formData.referenceStatus === 'previous' ? "Previous" : formData.referenceStatus === 'current' ? "Current" : "HR Head"} />
                            </RadioGroup>
                        </FormControl>

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
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ mt: 2 }}>
                                <FormLabel component="legend">
                                    Add Documents
                                </FormLabel>

                                <Box
                                    onClick={() => document.getElementById("documentInput").click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        handleDocumentAdd(e.dataTransfer.files);
                                    }}
                                    sx={{
                                        border: "1px dashed #bdbdbd",
                                        borderRadius: "6px",
                                        padding: "16px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "0.2s",
                                        "&:hover": {
                                            borderColor: "primary.main",
                                            backgroundColor: "#f5f8ff"
                                        }
                                    }}
                                >
                                    <Typography variant="body2" color="textSecondary">
                                        Click or drag files here to add documents
                                    </Typography>

                                    <input
                                        id="documentInput"
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        hidden
                                        onChange={(e) => handleDocumentAdd(e.target.files)}
                                    />
                                </Box>

                                {/* Document List */}
                                {formData.documents.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        {formData.documents.map((doc, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: 1,
                                                    px: 1.5,
                                                    py: 1,
                                                    mb: 1,
                                                    borderRadius: "8px",
                                                    backgroundColor: "#fafafa",
                                                    border: "1px solid #e5e7eb",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        flex: 1,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {doc.name}
                                                </Typography>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveDocument(index)}
                                                    sx={{
                                                        backgroundColor: "#ef4444", // strong red
                                                        color: "#ffffff",
                                                        width: 28,
                                                        height: 28,
                                                        "&:hover": {
                                                            backgroundColor: "#ef4444", // disable hover change
                                                        },
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
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
            </Modal>
        </ThemeProvider>
    );
};

export default ReferenceCheckModal;