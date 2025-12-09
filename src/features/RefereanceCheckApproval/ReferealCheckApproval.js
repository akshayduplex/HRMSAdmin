import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
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
    keyframes
} from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import moment from 'moment';
import { toast } from 'react-toastify';
const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-12px); }`

const ReferenceCheckForm = () => {

    const [url, setUrl] = useState(null);
    const [approvalDetails, setApprovalDetails] = useState(null)
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);


    const { id } = useParams();

    useEffect(() => {
        if (id) {
            try {
                const data = atob(id);
                if (data && typeof data !== 'undefined') {
                    setUrl(data?.split('|'))
                }
            } catch (error) {
                console.error("Error decoding Base64 string:", error);
            }
        }
    }, [id]);

    const getApprovalNoteDetails = async (approvalNote = '', token) => {
        try {
            let payload = {
                "approval_note_doc_id": approvalNote,
                "scope_fields": []
            }
            setPageLoading(true)
            let response = await axios.post(`${config.API_URL}getAppraisalNoteById`, payload, apiHeaderToken(token))
            if (response.status === 200) {
                setApprovalDetails(response.data?.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setPageLoading(false)
        }
    }

    useEffect(() => {
        if (url && Array.isArray(url) && url.length > 0) {
            getApprovalNoteDetails(url[0], url[url.length - 1])
        }
    }, [url])

    const candidateDetails = useMemo(() => {
        return approvalDetails && approvalDetails?.candidate_list?.find((item) => item?.cand_doc_id === url[1])
    }, [approvalDetails, url])

    const validationSchema = Yup.object({
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
            approvalStatus: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {

                let payload = {
                    "candidate_doc_id": candidateDetails?.cand_doc_id,
                    "approval_note_doc_id": approvalDetails?._id,
                    "applied_job_doc_id": candidateDetails?.applied_job_doc_id,
                    "email": url[3],
                    "referenceStatus": url[4],
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
                    "comments": values.comments
                }

                setLoading(true);

                let response = await axios.post(`${config.API_URL}updateReferenceCheckDataByLink`, payload, apiHeaderToken(url[5]))

                if (response.status === 200) {
                    toast.success(response.data?.message)
                    getApprovalNoteDetails(url[0], url[url.length - 1])
                } else {
                    toast.error(response.data?.message)
                }

            } catch (error) {
                toast.error(error?.response?.data?.message || error.message || "Something Went Wrong")
            } finally {
                setLoading(false)
                setSubmitting(false)
            }
        }
    });

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 3, fontFamily: 'Arial, sans-serif' }}>
            {
                pageLoading ?
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            mt: 3,
                        }}
                    >
                        {[0, 1, 2].map((i) => (
                            <Box
                                key={i}
                                component="span"
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    animation: `${bounce} 1.4s infinite ease-in-out`,
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            />
                        ))}
                    </Box>

                    : candidateDetails && Array.isArray(candidateDetails?.reference_check) && candidateDetails?.reference_check?.find(item => item?.referenceStatus === 'current' && item?.verification_status === 'Pending') ? (
                        <Paper elevation={3} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
                            <Typography variant="h5" align="center" sx={{
                                fontWeight: 'bold',
                                mb: 3,
                                color: '#2c3e50',
                                backgroundColor: '#f8f9fa',
                                p: 1,
                                borderRadius: '4px',
                                borderBottom: '2px solid #3498db'
                            }}>
                                REFERENCE CHECK FORM - MAIL
                            </Typography>

                            {/* Static Candidate Information Table */}
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
                                                {candidateDetails && candidateDetails?.name}
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
                                                {moment().format('DD/MM/YYY')}
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
                                                {approvalDetails && approvalDetails?.job_designation}
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
                                            <Typography variant="body1">
                                                {candidateDetails?.reference_check?.find(item => item.referenceStatus === url[4])?.name || ""}
                                            </Typography>
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
                                                {"HLFPPT (Hindustan Latex Family Planning Promotion Trust)"}
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
                                                {candidateDetails?.reference_check?.find(item => item.referenceStatus === url[4])?.mobile || ""}
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
                                                {"Email"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            {/* Reference Questions Section */}
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

                            {/* Reference Checker Information */}
                            <Grid container spacing={2} sx={{ mt: 3, p: 2, backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ backgroundColor: '#fff', p: 2, borderRadius: '4px', minHeight: '56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Name of reference checker</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                                            {(approvalDetails && approvalDetails?.add_by_details.name) || '—'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ backgroundColor: '#fff', p: 2, borderRadius: '4px', minHeight: '56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Designation</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                                            {(approvalDetails && approvalDetails?.add_by_details.designation) || '—'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={formik.handleSubmit}
                                    disabled={loading || formik.isSubmitting}
                                    sx={{
                                        px: 5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #34209b 30%, #524ca8ff 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                            Submitting...
                                        </Box>
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            </Box>
                        </Paper>
                    ) : <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            mt: 3,
                        }}
                    >
                        <div className="acceptcase" style={{ textAlign: 'center' }}>
                            <img src={config.LOGO_PATH} alt="Accepted" />
                            <p style={{ fontSize: "22px", fontWeight: 500, marginBottom: "20px", marginTop: 10 }}>
                                Thank you for your feedback! Your insights help us improve our hiring process and serve you even better. We appreciate your time and effort.
                            </p>
                        </div>
                    </Box>
            }
        </Box>
    );
};

export default ReferenceCheckForm;