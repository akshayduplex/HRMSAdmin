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
        isLoading: false
    });

    const RoleUserDetails = useMemo(() => {

        return JSON.parse(localStorage.getItem("admin_role_user") || {});

    }, [])

    const { id } = useParams()

    useEffect(() => {

        if (referenceStatus && open) {
            setFormData({
                ...formData,
                referenceStatus: referenceStatus
            })
        }

    }, [referenceStatus, open, formData])


    const [errors, setErrors] = useState({ mobile: '', email: '' });

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
                        referenceStatus: ''
                    })
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
                                <FormControlLabel value={referenceStatus} checked control={<Radio color="primary" />} label={referenceStatus === 'previous' ? "Previous" : referenceStatus === 'current' ?  "Current" : 'HR Head'} />
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
