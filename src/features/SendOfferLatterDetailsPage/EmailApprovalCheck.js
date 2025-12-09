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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
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

const EmailApprovalCheckStatus = ({ open, onClose, Candidate, fetchAgainApprovalDetails, referenceStatus, roleUserDetails }) => {
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
            approval_note_doc_id: id
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
            <Dialog open={open} disableEscapeKeyDown>
                <DialogTitle>Reference Check Not Approved</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The reference check for this candidate is not yet approved.
                        You must approve it before proceeding to the next steps.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
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
                    <Button onClick={onClose} variant="contained">
                        Wait For the Approval
                    </Button>
                </DialogActions>
            </Dialog>

        </ThemeProvider>
    );
};

export default EmailApprovalCheckStatus;
