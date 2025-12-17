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
import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

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

        documents: [],
        uploaded_docs: [],
    });

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
    const [deleteDocumentLoading, setDeleteDocumentLoading] = useState(null);
    const handleAddDocument = (file) => {
        setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, { name: '', file }]
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
    const handleDocumentFieldChange = (index, value, field) => {
        const updatedDocs = [...formData.documents];
        updatedDocs[index][field] = value;

        setFormData(prev => ({
            ...prev,
            documents: updatedDocs
        }));
    };
    const handleRemoveDocument = (index) => {
        const updatedDocs = [...formData.documents];
        updatedDocs.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            documents: updatedDocs
        }));
    };
    const handleRemoveDoc = async (docId) => {
        try {
            setDeleteDocumentLoading(docId);

            await axios.post(
                `${config.API_URL}removeUploadedReferenceDoc`,
                { doc_id: docId },
                apiHeaderToken(config.API_TOKEN)
            );

            setFormData(prev => ({
                ...prev,
                uploaded_docs: prev.uploaded_docs.filter(doc => doc._id !== docId)
            }));

            toast.success('Document removed');
        } catch (error) {
            toast.error('Failed to remove document');
        } finally {
            setDeleteDocumentLoading(null);
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

        let payload = {
            name: formData.refreeName,
            designation: formData.designation,
            mobile: formData.mobile,
            email: formData.email,
            referenceStatus: formData.referenceStatus,
            candidate_id: Candidate?.cand_doc_id,
            approval_note_doc_id: id,
            added_by_name: RoleUserDetails?.name,
            added_by_mobile: RoleUserDetails?.mobile_no,
            added_by_designation: RoleUserDetails?.designation,
            added_by_email: RoleUserDetails?.email
        }

        if (isMobileValid && isEmailValid) {
            setFormData((prev) => {
                return { ...prev, isLoading: true }
            })
            try {
                let response = await axios.post(`${config.API_URL}updateReferenceCheckInApprovalNote`, payload, apiHeaderToken(config.API_TOKEN))

                if (response.status === 200) {
                    toast.success(response.data?.message)
                    fetchAgainApprovalDetails()
                    onClose();
                    setFormData({
                        refreeName: '',
                        designation: '',
                        mobile: '',
                        email: '',
                        referenceStatus: '',
                        isLoading: false,
                        documents: [],
                        uploaded_docs: [],
                    });
                } else {
                    toast.error(response.data?.message)
                }
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.message || error?.message || "Something Went Wrong")
            } finally {
                setFormData((prev) => {
                    return { ...prev, isLoading: false }
                })
            }
        }
    };

    const SkipReference = async (e) => {
        e.preventDefault();

        let payload = {
            "name": RoleUserDetails?.name,
            "designation": RoleUserDetails?.designation,
            "mobile": RoleUserDetails?.mobile_no,
            "email": RoleUserDetails?.email,
            "candidate_doc_id": Candidate?.cand_doc_id,
            "approval_note_doc_id": id,
            "referenceStatus": "current",
        }

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
                    maxWidth: '90vw',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 4,
                }}>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }} size="small">
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
                        Reference Check
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                            <FormLabel component="legend">Reference Status</FormLabel>
                            <RadioGroup
                                row
                                name="referenceStatus"
                                value={formData.referenceStatus}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value={referenceStatus}
                                    checked
                                    control={<Radio color="primary" />}
                                    label={referenceStatus === 'previous' ? "Previous" : referenceStatus === 'current' ? "Current" : 'HR Head'}
                                />
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

                        {/* ---------- Attached Documents ---------- */}
                        {formData?.uploaded_docs?.length > 0 && (
                            <Box mt={4}>
                                <Typography variant="h6" gutterBottom textAlign="center">
                                    Attached Documents
                                </Typography>

                                <Grid container spacing={2}>
                                    {formData.uploaded_docs.map((doc, idx) => (
                                        <Grid
                                            key={doc._id || idx}
                                            item
                                            xs={12}
                                            sx={{ borderBottom: '1px solid #eee', py: 1 }}
                                        >
                                            <Grid container alignItems="center">
                                                <Grid item xs={6} textAlign="center">
                                                    <Typography fontWeight="bold">{doc.doc_name}</Typography>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        gap={1}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                flexGrow: 1,
                                                                minWidth: 0,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            ({doc.file_name})
                                                        </Typography>

                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemoveDoc(doc?._id)}
                                                            sx={{
                                                                color: 'error.main',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(251, 0, 0, 1)',
                                                                    color: 'error.light'
                                                                },
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {/* ---------- Attach New Documents ---------- */}
                        <Box sx={{ mt: 4 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <FormLabel>Attach Documents</FormLabel>
                                <IconButton color="primary" onClick={() => document.getElementById('documentInput').click()}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Box>

                            {formData.documents.map((doc, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        mb: 1.5,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Grid container spacing={1.5} alignItems="center">
                                        <Grid item xs={12} sm={5}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Document Name"
                                                value={doc.name}
                                                onChange={(e) => handleDocumentFieldChange(index, e.target.value, 'name')}
                                            />
                                        </Grid>

                                        <Grid item xs={10} sm={6} textAlign="center">
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {doc.file.name}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={2} sm={1} textAlign="right">
                                            <IconButton size="small" onClick={() => handleRemoveDocument(index)}>
                                                <DeleteIcon
                                                    fontSize="small"
                                                    sx={{
                                                        color: 'rgba(255, 1, 1, 0.9)',
                                                        '&:hover': {
                                                            color: 'error.light',
                                                        },
                                                    }}
                                                />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>

                        <input
                            type="file"
                            id="documentInput"
                            hidden
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    handleAddDocument(e.target.files[0]);
                                }
                                e.target.value = null;
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                            {roleUserDetails?.special_permissions?.reference_check_skip === 'yes' && (
                                <Button onClick={SkipReference} variant="outlined" color="primary">
                                    Skip
                                </Button>
                            )}
                            <Button disabled={formData.isLoading} type="submit" variant="contained" color="primary">
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