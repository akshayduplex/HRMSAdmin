import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Grid,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { apiHeaderToken } from '../../config/api_header';
import moment from 'moment';
import { toast } from 'react-toastify';
import config from '../../config/config';
import { useParams } from 'react-router-dom';

const ReferenceCheckApprovalModal = ({ open, onClose, approvalDetails, candidateDetails, fetchAgainApprovalDetails, roleUserDetails, referenceStatus }) => {
    const [submitting, setSubmitting] = useState(false);

    const RoleUserDetails = useMemo(() => {

        return JSON.parse(localStorage.getItem("admin_role_user") || {});

    }, [])

    const { id } = useParams()

    const validationSchema = Yup.object({
        contactPersonName: Yup.string().required('This field is required'),
        contactPersonMobile: Yup.string()
            .required('Mobile number is required')
            .matches(/^[0-9]+$/, 'Mobile number should only contain digits')
            .length(10, 'Mobile number should be exactly 10 digits'),
        knowDuration: Yup.string().required('This field is required'),
        capacity: Yup.string().required('This field is required'),
        workedAs: Yup.string().required('This field is required'),
        workedFrom: Yup.string().required('This field is required'),
        leftReason: Yup.string().required('This field is required'),
        responsibilities: Yup.string().required('This field is required'),
        performance: Yup.string().required('Performance rating is required'),
        whyPerformance: Yup.string().required('Reason is required'),
        excelledAreas: Yup.string(),
        reemploy: Yup.string().required('This field is required'),
        reemployReason: Yup.string().when('reemploy', {
            is: 'no',
            then: (schema) => schema.required('Reason is required when answer is "no"'),
            otherwise: (s) => s.notRequired()
        }),
        comments: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            contactPersonName: '',
            contactPersonMobile: '',
            knowDuration: '',
            capacity: '',
            workedAs: '',
            workedFrom: '',
            leftReason: '',
            responsibilities: '',
            performance: '',
            whyPerformance: '',
            excelledAreas: '',
            reemploy: 'yes',
            reemployReason: '',
            comments: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setSubmitting(true);

                let payload = {
                    "candidate_doc_id": candidateDetails?.cand_doc_id,
                    "approval_note_doc_id": approvalDetails?._id,
                    "applied_job_doc_id": candidateDetails?.applied_job_doc_id,
                    "contact_person_name": values.contactPersonName,
                    "contact_person_mobile": values.contactPersonMobile,
                    // "email": approvalDetails.email,
                    "referenceStatus": referenceStatus,
                    "verification_mode": "telephone",
                    "know_him": values.knowDuration,
                    "capacity": values.capacity,
                    "after_know_organization": values.workedAs,
                    "from": values.workedFrom,
                    "leave_reason": values.leftReason,
                    "responsibilities": values.responsibilities,
                    "performance": values.performance,
                    "performance_remark": values.whyPerformance,
                    "excelled_work": values.excelledAreas,
                    "give_opportunity": values.reemploy,
                    "give_opportunity_reason": values.reemployReason,
                    "comments": values.comments,
                    "add_by_name": RoleUserDetails?.name,
                    "add_by_mobile": RoleUserDetails?.mobile_no,
                    "add_by_designation": RoleUserDetails?.designation,
                    "add_by_email": RoleUserDetails?.email,
                    "added_by_id": RoleUserDetails?._id
                };

                let response = await axios.post(
                    `${config.API_URL}updateReferenceCheckFromAdmin`,
                    payload,
                    apiHeaderToken(config.API_TOKEN)
                );

                if (response.status === 200) {
                    toast.success(response.data?.message);
                    fetchAgainApprovalDetails()
                    onClose();
                    resetForm()
                } else {
                    toast.error(response.data?.message);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || error.message || "Something Went Wrong");
            } finally {
                setSubmitting(false);
            }
        }
    });

    const SkipReference = async (e) => {
        e.preventDefault();

        let payload = {
            "name": RoleUserDetails?.name,
            "designation": RoleUserDetails?.designation,
            "mobile": RoleUserDetails?.mobile_no,
            "email": RoleUserDetails?.email,
            "candidate_doc_id": candidateDetails?.cand_doc_id,
            "approval_note_doc_id": id,
            "referenceStatus": referenceStatus,
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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
            PaperProps={{ sx: { borderRadius: '12px' } }}
        >
            <DialogTitle sx={{
                backgroundColor: '#f5f7fa',
                borderBottom: '1px solid #e0e0e0',
                py: 2,
                pr: 8,
                position: 'relative'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Reference Check Form ( {referenceStatus === 'previous' ? 'Telephonic' : 'HR Head'}  )
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 3, px: 4 }}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    {/* Candidate Information Table */}
                    <Table sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: 'bold',
                                    width: '40%',
                                    borderRight: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f7fa'
                                }}>
                                    Name of candidate:
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fff' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                        {candidateDetails?.name || '—'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: 'bold',
                                    borderRight: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f7fa'
                                }}>
                                    Date:
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fff' }}>
                                    <Typography variant="body1">
                                        {moment().format('DD/MM/YYYY')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: 'bold',
                                    borderRight: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f7fa'
                                }}>
                                    Position applied for:
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fff' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                        {approvalDetails?.job_designation || '—'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: 'bold',
                                    borderRight: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f7fa'
                                }}>
                                    Contact person name:
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fff' }}>
                                    {/* <Typography variant="body1">
                                            {candidateDetails?.reference_check?.find(
                                                item => item.referenceStatus === approvalDetails.referenceStatus
                                            )?.name || '—'}
                                        </Typography> */}
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="contactPersonName"
                                        value={formik.values.contactPersonName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} // Add this to trigger validation on blur
                                        error={formik.touched.contactPersonName && Boolean(formik.errors.contactPersonName)}
                                        helperText={formik.touched.contactPersonName && formik.errors.contactPersonName}
                                        placeholder="Enter Contact Person Name"
                                        sx={{ mt: 2, backgroundColor: '#fff' }}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: 'bold',
                                    borderRight: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f7fa'
                                }}>
                                    Organization Name:
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fff' }}>
                                    <Typography variant="body1">
                                        HLFPPT (Hindustan Latex Family Planning Promotion Trust)
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: 'bold',
                                    borderRight: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f7fa'
                                }}>
                                    Contact Number:
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fff' }}>
                                    <Typography variant="body1">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="contactPersonMobile"
                                            value={formik.values.contactPersonMobile}
                                            onChange={(e) => {
                                                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                if (numericValue.length <= 10) { // Prevent more than 10 digits
                                                    formik.setFieldValue('contactPersonMobile', numericValue);
                                                }
                                            }}
                                            onBlur={formik.handleBlur} // Add this to trigger validation on blur
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key) || (formik.values.contactPersonMobile.length >= 10 && e.key !== 'Backspace')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            error={formik.touched.contactPersonMobile && Boolean(formik.errors.contactPersonMobile)}
                                            helperText={formik.touched.contactPersonMobile && formik.errors.contactPersonMobile}
                                            placeholder="Enter Contact Number"
                                            sx={{ mt: 2, backgroundColor: '#fff' }}
                                        />
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{
                                    fontWeight: 'bold',
                                    borderRight: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f7fa'
                                }}>
                                    Mode of reference check:
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fff' }}>
                                    <Typography variant="body1">
                                        Telephonic
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    {/* Form Fields */}
                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            1. How long you know him/her?
                            <TextField
                                variant="standard"
                                name={'knowDuration'}
                                value={formik.values.knowDuration}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.knowDuration && Boolean(formik.errors.knowDuration)}
                                helperText={formik.touched.knowDuration && formik.errors.knowDuration}
                                placeholder={'Enter...'}
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                        borderBottom: '1px solid #333',
                                        textAlign: 'center',
                                        padding: '0 0 4px 0',
                                        fontSize: '0.95rem'
                                    }
                                }}
                                sx={{
                                    width: "100px",
                                    mx: 1,
                                    '& .MuiInputBase-input': {
                                        padding: 0,
                                        textAlign: 'center',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        position: 'absolute',
                                        bottom: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />

                            In what capacity?
                            <TextField
                                variant="standard"
                                name={'capacity'}
                                value={formik.values.capacity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                                helperText={formik.touched.capacity && formik.errors.capacity}
                                placeholder={'Enter...'}
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                        borderBottom: '1px solid #333',
                                        textAlign: 'center',
                                        padding: '0 0 4px 0',
                                        fontSize: '0.95rem'
                                    }
                                }}
                                sx={{
                                    width: "150px",
                                    mx: 1,
                                    '& .MuiInputBase-input': {
                                        padding: 0,
                                        textAlign: 'center',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        position: 'absolute',
                                        bottom: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            2. I understand that he/she worked with your organization as a
                            <TextField
                                variant="standard"
                                name={'workedAs'}
                                value={formik.values.workedAs}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.workedAs && Boolean(formik.errors.workedAs)}
                                helperText={formik.touched.workedAs && formik.errors.workedAs}
                                placeholder={'Enter...'}
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                        borderBottom: '1px solid #333',
                                        textAlign: 'center',
                                        padding: '0 0 4px 0',
                                        fontSize: '0.95rem'
                                    }
                                }}
                                sx={{
                                    width: "100px",
                                    mx: 1,
                                    '& .MuiInputBase-input': {
                                        padding: 0,
                                        textAlign: 'center',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        position: 'absolute',
                                        bottom: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />
                            from
                            <TextField
                                variant="standard"
                                name={'workedFrom'}
                                value={formik.values.workedFrom}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.workedFrom && Boolean(formik.errors.workedFrom)}
                                helperText={formik.touched.workedFrom && formik.errors.workedFrom}
                                placeholder={'Enter...'}
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                        borderBottom: '1px solid #333',
                                        textAlign: 'center',
                                        padding: '0 0 4px 0',
                                        fontSize: '0.95rem'
                                    }
                                }}
                                sx={{
                                    width: "100px",
                                    mx: 1,
                                    '& .MuiInputBase-input': {
                                        padding: 0,
                                        textAlign: 'center',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        position: 'absolute',
                                        bottom: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />
                            and he/she left your employment due to
                            <TextField
                                variant="standard"
                                name={'leftReason'}
                                value={formik.values.leftReason}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.leftReason && Boolean(formik.errors.leftReason)}
                                helperText={formik.touched.leftReason && formik.errors.leftReason}
                                placeholder={'Enter...'}
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                        borderBottom: '1px solid #333',
                                        textAlign: 'center',
                                        padding: '0 0 4px 0',
                                        fontSize: '0.95rem'
                                    }
                                }}
                                sx={{
                                    width: "150px",
                                    mx: 1,
                                    '& .MuiInputBase-input': {
                                        padding: 0,
                                        textAlign: 'center',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        position: 'absolute',
                                        bottom: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            3. What were his/her main responsibilities?
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            variant="outlined"
                            name="responsibilities"
                            value={formik.values.responsibilities}
                            onChange={formik.handleChange}
                            error={formik.touched.responsibilities && Boolean(formik.errors.responsibilities)}
                            helperText={formik.touched.responsibilities && formik.errors.responsibilities}
                            placeholder="Describe the candidate's responsibilities..."
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Box>

                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            4. How would you describe his/her overall work performance?
                        </Typography>
                        <FormControl component="fieldset" sx={{ mb: 1 }}>
                            <RadioGroup
                                name="performance"
                                value={formik.values.performance}
                                onChange={formik.handleChange}
                                row
                                sx={{ mb: 1 }}
                            >
                                <FormControlLabel
                                    value="excellent"
                                    control={<Radio color="primary" />}
                                    label="Excellent"
                                    sx={{ mr: 3 }}
                                />
                                <FormControlLabel
                                    value="good"
                                    control={<Radio color="primary" />}
                                    label="Good"
                                    sx={{ mr: 3 }}
                                />
                                <FormControlLabel
                                    value="average"
                                    control={<Radio color="primary" />}
                                    label="Average"
                                    sx={{ mr: 3 }}
                                />
                                <FormControlLabel
                                    value="poor"
                                    control={<Radio color="primary" />}
                                    label="Poor"
                                />
                            </RadioGroup>
                            {formik.touched.performance && formik.errors.performance && (
                                <Typography variant="caption" color="error">{formik.errors.performance}</Typography>
                            )}
                        </FormControl>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Why?</Typography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            variant="outlined"
                            name="whyPerformance"
                            value={formik.values.whyPerformance}
                            onChange={formik.handleChange}
                            error={formik.touched.whyPerformance && Boolean(formik.errors.whyPerformance)}
                            helperText={formik.touched.whyPerformance && formik.errors.whyPerformance}
                            placeholder="Explain the rating..."
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Box>

                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            5. Are there any specific areas where the person excelled? (List)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            variant="outlined"
                            name="excelledAreas"
                            value={formik.values.excelledAreas}
                            onChange={formik.handleChange}
                            placeholder="List areas where the candidate excelled..."
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Box>

                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            6. Would you re-employ this person if you were given the opportunity?
                        </Typography>
                        <FormControl component="fieldset" sx={{ mb: 1 }}>
                            <RadioGroup
                                name="reemploy"
                                value={formik.values.reemploy}
                                onChange={formik.handleChange}
                                row
                                sx={{ mb: 1 }}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={<Radio color="primary" />}
                                    label="Yes"
                                    sx={{ mr: 3 }}
                                />
                                <FormControlLabel
                                    value="no"
                                    control={<Radio color="primary" />}
                                    label="No"
                                />
                            </RadioGroup>
                            {formik.touched.reemploy && formik.errors.reemploy && (
                                <Typography variant="caption" color="error">{formik.errors.reemploy}</Typography>
                            )}
                        </FormControl>
                        {formik.values.reemploy === 'no' && (
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                variant="outlined"
                                name="reemployReason"
                                value={formik.values.reemployReason}
                                onChange={formik.handleChange}
                                error={formik.touched.reemployReason && Boolean(formik.errors.reemployReason)}
                                helperText={formik.touched.reemployReason && formik.errors.reemployReason}
                                placeholder="If 'no', why not? Please explain..."
                                sx={{ mt: 2, backgroundColor: '#fff' }}
                            />
                        )}
                    </Box>

                    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            Comments:
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            variant="outlined"
                            name="comments"
                            value={formik.values.comments}
                            onChange={formik.handleChange}
                            placeholder="Additional comments about the candidate..."
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Box>

                    {/* Form Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                        {
                            roleUserDetails && roleUserDetails?.special_permissions?.reference_check_skip === 'yes' && (
                                <Button
                                    variant="outlined"
                                    onClick={SkipReference}
                                    sx={{
                                        px: 4,
                                        py: 1,
                                        fontWeight: 'bold',
                                        borderWidth: '2px',
                                        '&:hover': { borderWidth: '2px' }
                                    }}
                                >
                                    Skip
                                </Button>
                            )
                        }
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={submitting}
                            sx={{
                                px: 4,
                                py: 1,
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #34209b 30%, #524ca8ff 90%)',
                                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                                }
                            }}
                        >
                            {submitting ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                    Submitting...
                                </Box>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ReferenceCheckApprovalModal;