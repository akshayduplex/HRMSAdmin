import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container, Typography, Grid, TextField, Button,
    FormControl, InputLabel, Select, MenuItem, FormHelperText,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Checkbox, Box,
} from '@mui/material';
import moment from 'moment';
import { CloudUpload, DangerousOutlined } from '@mui/icons-material';
import axios from 'axios';
import config from '../../../config/config';
import { apiHeaderTokenMultiPart } from '../../../config/api_header';
import { toast } from 'react-toastify';


const JoiningReportFormAddEdit = ({ candidateData, setEditApplicant }) => {
    const [familyMembers, setFamilyMembers] = useState([
        { id: 1, name: '', dateOfBirth: '', age: '', relationship: '', occupation: '', dependent: false },
    ]);

    const userLoginDetails = useMemo(() => {

        return JSON.parse(localStorage.getItem('admin_role_user')) || {};

    }, [])

    const appliedJobDetails = useMemo(() => {

        return candidateData?.applied_jobs?.find((item) => item?.job_id === candidateData?.job_id)

    }, [candidateData])

    const previousEmp = useMemo(() => {

        return candidateData?.applicant_form_data?.employment_history?.length > 0 ? candidateData?.applicant_form_data?.employment_history : []

    }, [candidateData])

    useEffect(() => {
        if (candidateData?.applicant_form_data &&
            Array.isArray(candidateData?.applicant_form_data?.family_members) &&
            candidateData?.applicant_form_data?.family_members?.length > 0) {

            // Clear existing default family member if we have data from candidateData
            setFamilyMembers([]);

            const updatedExistingFamily = candidateData.applicant_form_data.family_members.map((item, index) => {
                return {
                    id: index + 1, // Start from 1 to match your initial state pattern
                    name: item?.name || '',
                    dateOfBirth: item?.date_of_birth || '', // Add date_of_birth if available in your data
                    age: item?.age || '',
                    relationship: item?.particulars || '',
                    occupation: item?.occupation || '',
                    dependent: item?.is_dependent?.toLowerCase() === 'yes'
                }
            });

            setFamilyMembers(updatedExistingFamily);
        }
    }, [candidateData]);

    const validationSchema = Yup.object({
        name: Yup.string().required('Full name is required'),
        dateOfJoining: Yup.string().required('Date of joining is required'),
        dateOfBirth: Yup.string().required('Date of birth is required'),
        fatherName: Yup.string().required("Father's name is required"),
        placeOfPosting: Yup.string().required('Place of posting is required'),
        addressCommunication: Yup.string().required('Communication address is required'),
        contactNos: Yup.string().required('Contact number is required'),
        mailIds: Yup.string().email('Invalid email format').required('Email is required'),
        permanentAddress: Yup.string().required('Permanent address is required'),
        sex: Yup.string().required('Gender is required'),
        maritalStatus: Yup.string().required('Marital status is required'),
        bloodGroup: Yup.string().required('Blood group is required'),
        panNo: Yup.string().required('PAN number is required').matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Invalid PAN format'),
        emergencyContactLocalName: Yup.string().required('Local emergency contact name is required'),
        emergencyContactLocalContact: Yup.string().required('Local emergency contact number is required'),
        emergencyContactLocalAddress: Yup.string().required('Local emergency contact address is required'),
        emergencyContactPermanentAddress: Yup.string().required('Local emergency contact address is required'),
        emergencyContactPermanentName: Yup.string().required('Permanent emergency contact name is required'),
        emergencyContactPermanentContact: Yup.string().required('Permanent emergency contact number is required'),
        bankName: Yup.string().required('Bank name is required'),
        branchIFSC: Yup.string().required('Branch & IFSC Code is required'),
        accountNo: Yup.string().required('Account number is required'),
        previousOrganization: Yup.string().optional().trim(),
        previousDesignation: Yup.string().optional().trim(),
        previousReportingManagerName: Yup.string().optional(),
        previousReportingManagerDesignation: Yup.string().optional(),
        previousReportingManagerEmail: Yup.string()
            .optional()
            .email('Please enter a valid email address')
            .matches(
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                'Please enter a valid email address'
            ),
        permanentContactEmail: Yup.string()
            .optional()
            .email('Please enter a valid email address')
            .matches(
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                'Please enter a valid email address'
            ),
        previousReportingManagerMob: Yup.string()
            .optional()
            .matches(
                /^[6-9]\d{9}$/,
                'Please enter a valid 10-digit mobile number'
            )
            .test('valid-mobile', 'Mobile number must be 10 digits', value => {
                if (!value) return true;
                const digits = value.replace(/\D/g, '');
                return digits.length === 10;
            }),
        previousTenureFrom: Yup.string()
            .optional()
            .test('valid-date', 'Invalid date format', value =>
                value && moment(value, 'YYYY-MM-DD', true).isValid()
            ),
        previousTenureTo: Yup.string()
            .optional()
            .test('valid-date', 'Invalid date format', value =>
                value && moment(value, 'YYYY-MM-DD', true).isValid()
            )
            .test('is-greater', 'To date must be greater than From date', function (value) {
                const { previousTenureFrom } = this.parent;
                if (!previousTenureFrom || !value) return true; // Skip validation if either date is empty

                const fromDate = moment(previousTenureFrom);
                const toDate = moment(value);
                return toDate.isAfter(fromDate);
            }),
        pfAccountNo: Yup.string().optional().trim(),
        uan: Yup.string().optional().trim(),
        cancelCheque: Yup.mixed()
            .test('fileSize', 'File size is too large', (value) => {
                if (!value) return true; // Not required
                return value.size <= 5 * 1024 * 1024;
            })
            .test('fileType', 'Unsupported file format', (value) => {
                if (!value) return true;
                const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
                return validTypes.includes(value.type);
            }),

    });

    const formik = useFormik({
        initialValues: {
            name: candidateData?.name || '',
            dateOfJoining: moment(appliedJobDetails && appliedJobDetails?.onboard_date).format('YYYY-MM-DD') || '',
            dateOfBirth: candidateData?.applicant_form_data?.dob
                ? moment({
                    year: +candidateData.applicant_form_data.dob.year || 2000,
                    month: moment(candidateData.applicant_form_data.dob.month, 'MMMM').month(),
                    day: +candidateData.applicant_form_data.dob.date || 1,
                }).format('YYYY-MM-DD')
                : '',
            fatherName: candidateData?.applicant_form_data?.father_hushband_name || "",
            placeOfPosting: candidateData?.applied_jobs?.find((item) => item?.job_id === candidateData?.job_id)?.proposed_location || candidateData?.location,
            employeeNo: '',
            reportingTime: '',
            designation: candidateData?.designation,
            reportingManager: '',
            addressCommunication: candidateData?.applicant_form_data?.communication_address?.address || '',
            contactNos: candidateData?.applicant_form_data?.communication_address?.mobile_no || '',
            mailIds: candidateData?.applicant_form_data?.communication_address?.email_id || '',
            permanentAddress: candidateData?.applicant_form_data?.permanent_address?.address || '',
            permanentContactNos: candidateData?.applicant_form_data?.permanent_address?.mobile_no || '',
            permanentContactEmail: candidateData?.applicant_form_data?.permanent_address?.email_id || '',
            sex: candidateData?.applicant_form_data?.gender || "",
            maritalStatus: candidateData?.applicant_form_data?.marital_status || "",
            dateOfWedding:candidateData?.annexure_eleven_form_data?.dateOfWedding || '',
            noOfChildrenMale: candidateData?.annexure_eleven_form_data?.noOfChildrenMale || '',
            noOfChildrenFemale: candidateData?.annexure_eleven_form_data?.noOfChildrenFemale || '',
            bloodGroup:candidateData?.annexure_eleven_form_data?.blood_group || '',
            panNo:candidateData?.annexure_eleven_form_data?.pan_number || '',
            emergencyContactLocalName:candidateData?.annexure_eleven_form_data?.emergency_contact_local?.name || '',
            emergencyContactLocalContact: candidateData?.annexure_eleven_form_data?.emergency_contact_local?.contact_no || '',
            emergencyContactLocalAddress: candidateData?.annexure_eleven_form_data?.emergency_contact_local?.address || '',
            emergencyContactPermanentName:candidateData?.annexure_eleven_form_data?.emergency_contact_permanent?.name || '',
            emergencyContactPermanentContact: candidateData?.annexure_eleven_form_data?.emergency_contact_permanent?.contact_no || '',
            emergencyContactPermanentAddress:candidateData?.annexure_eleven_form_data?.emergency_contact_permanent?.address || '',
            bankName: candidateData?.annexure_eleven_form_data?.bank_details?.bank_name || ''  ,
            branchIFSC: candidateData?.annexure_eleven_form_data?.bank_details?.branch_ifsc || '',
            accountNo:candidateData?.annexure_eleven_form_data?.bank_details?.account_no || ''  ,
            previousOrganization: previousEmp[0]?.org_name,
            previousDesignation: previousEmp[0]?.designation,
            previousReportingManagerName:candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_reporting_mng_name || '',
            previousReportingManagerDesignation:candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_reporting_mng_designation || '',
            previousReportingManagerMob: previousEmp[0]?.reporting_person_mobile || '',
            previousReportingManagerEmail: previousEmp[0]?.reporting_person_email || "",
            previousTenureFrom: moment(appliedJobDetails && previousEmp[0]?.duration_from).format('YYYY-MM-DD') || '',
            previousTenureTo: moment(appliedJobDetails && previousEmp[0]?.duration_to).format('YYYY-MM-DD') || '',
            pfAccountNo:candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_pf || '',
            uan:candidateData?.annexure_eleven_form_data?.previous_organization_details?.previous_pan_no || '',
            declaration: false,
            cancelCheque: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            let communication_address = {
                address: values.addressCommunication,
                contact_no: values.contactNos,
                email: values.mailIds,
            }

            let permanent_address = {
                address: values?.permanentAddress,
                contact_no: values?.permanentContactNos,
                email: values.permanentContactEmail,
            }

            const familyDetails = familyMembers?.map((item) => {
                return {
                    name: item?.name,
                    relationship: item?.relationship,
                    occupation: item?.occupation,
                    age: item?.age,
                    date_of_birth: item?.dateOfBirth,
                    is_dependent: item?.dependent ? 'yes' : 'no',
                }
            })

            const emergency_contact_details_permanent = {
                name: values.emergencyContactPermanentName,
                contact_no: values.emergencyContactPermanentContact,
                address: values.emergencyContactPermanentAddress
            }

            const emergency_contact_details_local = {
                name: values.emergencyContactLocalName,
                contact_no: values.emergencyContactLocalContact,
                address: values.emergencyContactLocalAddress
            }

            const candidate_bank_details = {
                bank_name: values.bankName,
                branch_ifsc: values.branchIFSC,
                account_no: values.accountNo
            }

            const details_of_previous_emp = {
                previous_org_name: values.previousOrganization,
                previous_designation: values?.previousDesignation,
                previous_reporting_mng_name: values?.previousReportingManagerName,
                previous_reporting_mng_email: values?.previousReportingManagerEmail,
                previous_reporting_mng_designation: values?.previousReportingManagerDesignation,
                previous_reporting_mng_mobile_no: values?.previousReportingManagerMob,
                previous_from: values.previousTenureFrom,
                previous_to: values.previousTenureTo,
                previous_pan_no: values.panNo,
                previous_pf: values.pfAccountNo
            }

            let added_by = {
                user_id: userLoginDetails?._id,
                user_name: userLoginDetails?.name,
                user_email: userLoginDetails?.email,
                user_mobile_no: userLoginDetails?.mobile_no,
                user_designation: userLoginDetails?.designation,
            }

            setSubmitting(true);

            let formData = new FormData();
            formData.append('candidate_id', candidateData?._id)
            formData.append('candidate_name', values.name)
            formData.append('candidate_designation', values.designation)
            formData.append('candidate_father_husband_name', values.fatherName)
            formData.append('candidate_doj', values.dateOfJoining)
            formData.append('candidate_dob', values.dateOfBirth)
            formData.append('candidate_date_of_wedding', values.dateOfWedding)
            formData.append('candidate_place_of_posting', values.placeOfPosting)
            formData.append('candidate_reporting_time', values.reportingTime)
            formData.append('candidate_reporting_manager', values.reportingManager)
            formData.append('candidate_communication_address', JSON.stringify(communication_address))
            formData.append('candidate_permanent_address', JSON.stringify(permanent_address))
            formData.append('candidate_gender', values.sex)
            formData.append('employee_number', values.employeeNo)
            formData.append('candidate_marital_status', values.maritalStatus)
            formData.append('candidate_blood_group', values.bloodGroup)
            formData.append('candidate_pan_number', values.panNo)
            formData.append('candidate_family_details', JSON.stringify(familyDetails))
            formData.append('candidate_emergency_contact_local', JSON.stringify(emergency_contact_details_local))
            formData.append('candidate_emergency_contact_permanent', JSON.stringify(emergency_contact_details_permanent))
            formData.append('candidate_bank_details', JSON.stringify(candidate_bank_details))
            formData.append('filename', values.cancelCheque)
            formData.append('candidate_previous_org_details', JSON.stringify(details_of_previous_emp))
            formData.append('added_by', JSON.stringify(added_by))

            try {
                let response = await axios.post(`${config.API_URL}saveAnnexureElevenForm`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
                if (response.status === 200) {
                    toast.success(response.data?.message)
                } else {
                    toast.error(response.data?.message)
                }
            } catch (error) {
                toast.error(error?.response.data?.message || error?.message || "Something went wrong");
            } finally {
                setSubmitting(false)
            }
        },
    });

    const addFamilyMember = () => {
        setFamilyMembers([
            ...familyMembers,
            { id: familyMembers.length + 1, name: '', dateOfBirth: '', age: '', relationship: '', occupation: '', dependent: false }
        ]);
    };

    const removeFamilyMember = (id) => {
        if (familyMembers.length > 1) {
            setFamilyMembers(familyMembers.filter(member => member.id !== id));
        }
    };

    const handleNumberChange = (e) => {
        const { value, name } = e.target;
        // Only allow numbers and limit to 10 digits
        const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);

        // Update formik value
        formik.setFieldValue(name, numericValue);
    };

    const handleAlphaInput = (index, field) => (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            const newFamilyMembers = [...familyMembers];
            newFamilyMembers[index][field] = value;
            setFamilyMembers(newFamilyMembers);
        }
    };

    const handleDateChange = (index) => (e) => {
        const value = e.target.value;
        const newFamilyMembers = [...familyMembers];
        newFamilyMembers[index].dateOfBirth = value;
        if (value) {
            const age = moment().diff(moment(value, 'YYYY-MM-DD'), 'years');
            newFamilyMembers[index].age = age.toString();
        } else {
            newFamilyMembers[index].age = '';
        }
        setFamilyMembers(newFamilyMembers);
    };

    const handleDependentChange = (index) => (e) => {
        const newFamilyMembers = [...familyMembers];
        newFamilyMembers[index].dependent = e.target.checked;
        setFamilyMembers(newFamilyMembers);
    };

    return (
        <>
            <Box sx={{
                textAlign: 'center',
                display: 'flex',
                gap: 2,
                alignItems: 'end',
                justifyContent: 'end'
            }}>

                <Button
                    variant="outlined"
                    color="error"
                    sx={{
                        textAlign: 'center',
                        alignItems: 'center',
                        marginBottom: '5px',
                    }}
                    startIcon={<DangerousOutlined />}
                    onClick={() => setEditApplicant(false)}
                >
                    Close
                </Button>
            </Box>
            <Container maxWidth="md" sx={{ py: 4, fontFamily: 'Arial, sans-serif' }}>
                {/* Logo Section */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box
                        component="img"
                        src={'/logo512.png'}
                        alt="Company Logo"
                        sx={{
                            width: 'auto',
                            height: 60,
                            objectFit: 'contain',
                            maxWidth: '200px'
                        }}
                    />
                </Box>

                {/* Form Title */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" sx={{ textDecoration: 'underline', fontWeight: 'bold', mb: 1 }}>
                        ANNEXURE 11
                    </Typography>
                    <Typography variant="h6" sx={{ textDecoration: 'underline', fontWeight: 'bold', mb: 1 }}>
                        HINDUSTAN LATEX FAMILY PLANNING PROMOTION TRUST
                    </Typography>
                    <Typography variant="h5" sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                        JOINING REPORT
                    </Typography>
                </Box>

                {/* Instructions */}
                <Box sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textDecoration: 'underline', mb: 1 }}>
                        Instructions:
                    </Typography>
                    <ol>
                        <li>Fill the form furnishing all relevant information against all questions asked.</li>
                        <li>The form is required to be submitted to the HR Department at the project site.</li>
                        <li>Please attach the attested Photostat copies of the certificates or testimonial in support of your age, qualification, experience and salary.</li>
                    </ol>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                    {/* Personal Details Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                            Personal Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="*Name"
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    id="dateOfJoining"
                                    name="dateOfJoining"
                                    label="*Date of Joining"
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.dateOfJoining}
                                    onChange={formik.handleChange}
                                    error={formik.touched.dateOfJoining && Boolean(formik.errors.dateOfJoining)}
                                    helperText={formik.touched.dateOfJoining && formik.errors.dateOfJoining}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    label="*Date of Birth"
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    inputProps={{
                                        max: moment().subtract(15, 'years').format('YYYY-MM-DD') // Sets max date to 15 years ago
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.dateOfBirth}
                                    onChange={formik.handleChange}
                                    error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                                    helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="fatherName"
                                    name="fatherName"
                                    label="*Father's Name"
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    value={formik.values.fatherName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
                                    helperText={formik.touched.fatherName && formik.errors.fatherName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="placeOfPosting"
                                    name="placeOfPosting"
                                    label="Place of Posting"
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    value={formik.values.placeOfPosting}
                                    onChange={formik.handleChange}
                                    error={formik.touched.placeOfPosting && Boolean(formik.errors.placeOfPosting)}
                                    helperText={formik.touched.placeOfPosting && formik.errors.placeOfPosting}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="employeeNo"
                                    name="employeeNo"
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    label="Employee No (To be filled by HR dept.)"
                                    value={formik.values.employeeNo}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="reportingTime"
                                    name="reportingTime"
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    label=": Reporting Time :"
                                    value={formik.values.reportingTime}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="designation"
                                    name="designation"
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    label=": Designation :"
                                    value={formik.values.designation}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="reportingManager"
                                    name="reportingManager"
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    label=": Reporting Manager :"
                                    value={formik.values.reportingManager}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Address Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                            Contact Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="addressCommunication"
                                    name="addressCommunication"
                                    label="*Address for Communication"
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    multiline
                                    rows={3}
                                    value={formik.values.addressCommunication}
                                    onChange={formik.handleChange}
                                    error={formik.touched.addressCommunication && Boolean(formik.errors.addressCommunication)}
                                    helperText={formik.touched.addressCommunication && formik.errors.addressCommunication}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="contactNos"
                                    name="contactNos"
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    label="Contact No."
                                    value={formik.values.contactNos}
                                    onChange={handleNumberChange}
                                    error={formik.touched.contactNos && Boolean(formik.errors.contactNos)}
                                    helperText={formik.touched.contactNos && formik.errors.contactNos}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="mailIds"
                                    name="mailIds"
                                    size='small'

                                    label="Email"
                                    value={formik.values.mailIds}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={formik.touched.mailIds && Boolean(formik.errors.mailIds)}
                                    helperText={formik.touched.mailIds && formik.errors.mailIds}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="permanentAddress"
                                    name="permanentAddress"
                                    label="*Permanent Address"
                                    size='small'
                                    multiline
                                    rows={3}
                                    value={formik.values.permanentAddress}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.permanentAddress && Boolean(formik.errors.permanentAddress)}
                                    helperText={formik.touched.permanentAddress && formik.errors.permanentAddress}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="permanentContactNos"
                                    name="permanentContactNos"
                                    size='small'
                                    label="Contact No."
                                    value={formik.values.permanentContactNos}
                                    onChange={handleNumberChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="permanentContactEmail"
                                    name="permanentContactEmail"
                                    size='small'
                                    label="Email"
                                    value={formik.values.permanentContactEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Personal Information Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                            Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={formik.touched.sex && Boolean(formik.errors.sex)}>
                                    <InputLabel id="sex-label">*Sex</InputLabel>
                                    <Select
                                        labelId="sex-label"
                                        id="sex"
                                        size='small'
                                        name="sex"
                                        value={formik.values.sex}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="*Sex"
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="others">Others</MenuItem>
                                    </Select>
                                    {formik.touched.sex && formik.errors.sex && (
                                        <FormHelperText>{formik.errors.sex}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={formik.touched.maritalStatus && Boolean(formik.errors.maritalStatus)}>
                                    <InputLabel id="maritalStatus-label">*Marital Status</InputLabel>
                                    <Select
                                        labelId="maritalStatus-label"
                                        id="maritalStatus"
                                        size='small'
                                        name="maritalStatus"
                                        value={formik.values.maritalStatus}
                                        onChange={formik.handleChange}
                                        label="*Marital Status"
                                    >
                                        <MenuItem value="married">Married</MenuItem>
                                        <MenuItem value="unmarried">Unmarried</MenuItem>
                                        <MenuItem value="separated">Separated</MenuItem>
                                        <MenuItem value="widow">Widow</MenuItem>
                                        <MenuItem value="widower">Widower</MenuItem>
                                    </Select>
                                    {formik.touched.maritalStatus && formik.errors.maritalStatus && (
                                        <FormHelperText>{formik.errors.maritalStatus}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {formik.values.maritalStatus === 'Married' && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            id="dateOfWedding"
                                            name="dateOfWedding"
                                            size='small'
                                            label="Date of Wedding"
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.dateOfWedding}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            id="noOfChildrenMale"
                                            size='small'

                                            name="noOfChildrenMale"
                                            label="No. of Children: Male"
                                            value={formik.values.noOfChildrenMale}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            id="noOfChildrenFemale"
                                            size='small'

                                            name="noOfChildrenFemale"
                                            label="Female"
                                            value={formik.values.noOfChildrenFemale}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="bloodGroup"
                                    size='small'
                                    name="bloodGroup"
                                    label="*Blood Group"
                                    value={formik.values.bloodGroup}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)}
                                    helperText={formik.touched.bloodGroup && formik.errors.bloodGroup}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="panNo"
                                    name="panNo"
                                    label="*PAN No."
                                    size='small'
                                    value={formik.values.panNo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.panNo && Boolean(formik.errors.panNo)}
                                    helperText={formik.touched.panNo && formik.errors.panNo}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Family Details Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                            *Personal Family Details
                        </Typography>
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>S.No</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Date of Birth</TableCell>
                                        <TableCell>Age</TableCell>
                                        <TableCell>Relationship</TableCell>
                                        <TableCell>Occupation</TableCell>
                                        <TableCell>Whether Dependent or not</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {familyMembers.map((member, index) => (
                                        <TableRow key={member.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    sx={{ width: 140 }}
                                                    value={member.name || ''}
                                                    onChange={handleAlphaInput(index, 'name')}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    type="date"
                                                    sx={{ width: 140 }}
                                                    value={member.dateOfBirth || ''}
                                                    inputProps={{
                                                        max: moment().subtract(15, 'years').format('YYYY-MM-DD')
                                                    }}
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={handleDateChange(index)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    sx={{ width: 80 }}
                                                    value={member.age || ''}
                                                    disabled
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    sx={{ width: 140 }}
                                                    value={member.relationship || ''}
                                                    onChange={handleAlphaInput(index, 'relationship')}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    sx={{ width: 140 }}
                                                    value={member.occupation || ''}
                                                    onChange={handleAlphaInput(index, 'occupation')}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    size="small"
                                                    checked={Boolean(member.dependent)}
                                                    onChange={handleDependentChange(index)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => removeFamilyMember(member.id)}
                                                    disabled={familyMembers.length <= 1}
                                                >
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant="outlined" onClick={addFamilyMember}>
                            Add Family Member
                        </Button>
                    </Box>

                    {/* Emergency Contact Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                            Emergency Contact Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    *Emergency Contact Details (Local)
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="emergencyContactLocalName"
                                    name="emergencyContactLocalName"
                                    label="Name"
                                    size='small'
                                    value={formik.values.emergencyContactLocalName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.emergencyContactLocalName && Boolean(formik.errors.emergencyContactLocalName)}
                                    helperText={formik.touched.emergencyContactLocalName && formik.errors.emergencyContactLocalName}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    id="emergencyContactLocalContact"
                                    name="emergencyContactLocalContact"
                                    label="Contact"
                                    size='small'
                                    value={formik.values.emergencyContactLocalContact}
                                    onChange={handleNumberChange}
                                    error={formik.touched.emergencyContactLocalContact && Boolean(formik.errors.emergencyContactLocalContact)}
                                    helperText={formik.touched.emergencyContactLocalContact && formik.errors.emergencyContactLocalContact}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    id="emergencyContactLocalAddress"
                                    name="emergencyContactLocalAddress"
                                    label="Address"
                                    size='small'

                                    value={formik.values.emergencyContactLocalAddress}
                                    onChange={formik.handleChange}
                                    error={formik.touched.emergencyContactLocalAddress && Boolean(formik.errors.emergencyContactLocalAddress)}
                                    helperText={formik.touched.emergencyContactLocalAddress && formik.errors.emergencyContactLocalAddress}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    *Emergency Contact Details (Permanent)
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="emergencyContactPermanentName"
                                    name="emergencyContactPermanentName"
                                    label="Name"
                                    size='small'

                                    value={formik.values.emergencyContactPermanentName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.emergencyContactPermanentName && Boolean(formik.errors.emergencyContactPermanentName)}
                                    helperText={formik.touched.emergencyContactPermanentName && formik.errors.emergencyContactPermanentName}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    id="emergencyContactPermanentContact"
                                    name="emergencyContactPermanentContact"
                                    label="Contact"
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    value={formik.values.emergencyContactPermanentContact}
                                    onChange={handleNumberChange}
                                    error={formik.touched.emergencyContactPermanentContact && Boolean(formik.errors.emergencyContactPermanentContact)}
                                    helperText={formik.touched.emergencyContactPermanentContact && formik.errors.emergencyContactPermanentContact}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    id="emergencyContactPermanentAddress"
                                    name="emergencyContactPermanentAddress"
                                    label="Address"
                                    size='small'

                                    value={formik.values.emergencyContactPermanentAddress}
                                    onChange={formik.handleChange}
                                    error={formik.touched.emergencyContactPermanentAddress && Boolean(formik.errors.emergencyContactPermanentAddress)}
                                    helperText={formik.touched.emergencyContactPermanentAddress && formik.errors.emergencyContactPermanentAddress}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Bank Details Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                            Bank Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="bankName"
                                    name="bankName"
                                    label="*Name of Bank"
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    value={formik.values.bankName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                                    helperText={formik.touched.bankName && formik.errors.bankName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="branchIFSC"
                                    name="branchIFSC"
                                    label="*Branch & IFSC Code"
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    value={formik.values.branchIFSC}
                                    onChange={formik.handleChange}
                                    error={formik.touched.branchIFSC && Boolean(formik.errors.branchIFSC)}
                                    helperText={formik.touched.branchIFSC && formik.errors.branchIFSC}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="accountNo"
                                    name="accountNo"
                                    label="*Account No."
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    value={formik.values.accountNo}
                                    onChange={formik.handleChange}
                                    error={formik.touched.accountNo && Boolean(formik.errors.accountNo)}
                                    helperText={formik.touched.accountNo && formik.errors.accountNo}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item xs={12}>
                                    <input
                                        accept=".jpeg , png ,image/*"
                                        type="file"
                                        id="cancelCheque"
                                        name="cancelCheque"
                                        hidden
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            if (file) {
                                                // Validate file size (e.g., 5MB limit)
                                                if (file.size > 5 * 1024 * 1024) {
                                                    alert('File size should be less than 5MB');
                                                    return;
                                                }

                                                // Validate file type
                                                const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
                                                if (!validTypes.includes(file.type)) {
                                                    alert('Please upload PDF, DOC, DOCX, or image files only');
                                                    return;
                                                }

                                                formik.setFieldValue('cancelCheque', file);
                                            }
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            htmlFor="cancelCheque"
                                            startIcon={<CloudUpload />}
                                        >
                                            Attach Cancel Cheque
                                        </Button>
                                        {formik.values.cancelCheque && (
                                            <Typography variant="body2" color="textSecondary">
                                                {formik.values.cancelCheque.name}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                                        Supported formats: PDF, DOC, DOCX, Images (JPG, PNG) | Max size: 5MB
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Previous Employer Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                            Details of previous employer
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="previousOrganization"
                                    name="previousOrganization"
                                    label="Name of the last Organization & Address"
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    value={formik.values.previousOrganization}
                                    onChange={formik.handleChange}
                                    error={formik.touched.previousOrganization && Boolean(formik.errors.previousOrganization)}
                                    helperText={formik.touched.previousOrganization && formik.errors.previousOrganization}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="previousDesignation"
                                    name="previousDesignation"
                                    label="Your Designation"
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    value={formik.values.previousDesignation}
                                    onChange={formik.handleChange}
                                    error={formik.touched.previousDesignation && Boolean(formik.errors.previousDesignation)}
                                    helperText={formik.touched.previousDesignation && formik.errors.previousDesignation}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="previousReportingManagerName"
                                    name="previousReportingManagerName"
                                    label="Reporting Manager (Name)"
                                    value={formik.values.previousReportingManagerName}
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={formik.touched.previousReportingManagerName && Boolean(formik.errors.previousReportingManagerName)}
                                    helperText={formik.touched.previousReportingManagerName && formik.errors.previousReportingManagerName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="previousReportingManagerDesignation"
                                    name="previousReportingManagerDesignation"
                                    label="Reporting Manager ( Designation )"
                                    value={formik.values.previousReportingManagerDesignation}
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={formik.touched.previousReportingManagerDesignation && Boolean(formik.errors.previousReportingManagerDesignation)}
                                    helperText={formik.touched.previousReportingManagerDesignation && formik.errors.previousReportingManagerDesignation}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="previousReportingManagerMob"
                                    name="previousReportingManagerMob"
                                    label="Reporting Manager ( Mobile )"
                                    value={formik.values.previousReportingManagerMob}
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    onChange={handleNumberChange}
                                    error={formik.touched.previousReportingManagerMob && Boolean(formik.errors.previousReportingManagerMob)}
                                    helperText={formik.touched.previousReportingManagerMob && formik.errors.previousReportingManagerMob}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="previousReportingManagerEmail"
                                    name="previousReportingManagerEmail"
                                    label="Reporting Manager ( Email )"
                                    value={formik.values.previousReportingManagerEmail}
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={formik.touched.previousReportingManagerEmail && Boolean(formik.errors.previousReportingManagerEmail)}
                                    helperText={formik.touched.previousReportingManagerEmail && formik.errors.previousReportingManagerEmail}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="previousTenureFrom"
                                    name="previousTenureFrom"
                                    type='date'
                                    label="Tenure From"
                                    value={formik.values.previousTenureFrom}
                                    InputLabelProps={{ shrink: true }}
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={formik.touched.previousTenureFrom && Boolean(formik.errors.previousTenureFrom)}
                                    helperText={formik.touched.previousTenureFrom && formik.errors.previousTenureFrom}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="previousTenureTo"
                                    type='date'
                                    name="previousTenureTo"
                                    label="Tenure To ..........."
                                    value={formik.values.previousTenureTo}
                                    InputLabelProps={{ shrink: true }}
                                    size='small'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={formik.touched.previousTenureTo && Boolean(formik.errors.previousTenureTo)}
                                    helperText={formik.touched.previousTenureTo && formik.errors.previousTenureTo}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="pfAccountNo"
                                    name="pfAccountNo"
                                    label="PF Account No. of the last organization"
                                    value={formik.values.pfAccountNo}
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    onChange={formik.handleChange}
                                    error={formik.touched.pfAccountNo && Boolean(formik.errors.pfAccountNo)}
                                    helperText={formik.touched.pfAccountNo && formik.errors.pfAccountNo}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="uan"
                                    name="uan"
                                    label="PF Universal Account No. (UAN)"
                                    value={formik.values.uan}
                                    size='small'
                                    onBlur={formik.handleBlur}

                                    onChange={formik.handleChange}
                                    error={formik.touched.uan && Boolean(formik.errors.uan)}
                                    helperText={formik.touched.uan && formik.errors.uan}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Declaration Section */}
                    <Box sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            DECLARATION:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            I, son/ daughter of {formik.values.fatherName || '________________'}, solemnly declare that the information furnished by me is true to the best of my knowledge and that I'll inform the Human Resource Department, HLFPPT regarding any change in the above information within one week from the time of its change.
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        // bgcolor: '#f8f8f8',
                                        minHeight: '40px',
                                        // border: '1px solid #e0e0e0',
                                        // borderRadius: 1
                                    }}
                                >
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {moment().format('DD/MM/YYYY')}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        // bgcolor: '#f8f8f8',
                                        minHeight: '40px',
                                        // border: '1px solid #e0e0e0',
                                        // borderRadius: 1
                                    }}
                                >
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Signature
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            minHeight: '50px'
                                        }}
                                    >
                                        {candidateData?.applicant_form_data && candidateData?.applicant_form_data.signature ? (
                                            <Box
                                                component="img"
                                                src={config.IMAGE_PATH + candidateData?.applicant_form_data.signature}
                                                alt="Signature"
                                                sx={{
                                                    maxHeight: '50px',
                                                    objectFit: 'contain',
                                                    width: 'auto',
                                                    filter: 'brightness(0.8)',  // Makes signature look more natural
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                component="img"
                                                src="/path/to/default-signature.png"  // Replace with your default signature image
                                                alt="Default Signature"
                                                sx={{
                                                    maxHeight: '50px',
                                                    objectFit: 'contain',
                                                    width: 'auto',
                                                    opacity: 0.7
                                                }}
                                            />
                                        )}
                                    </Typography>

                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        // bgcolor: '#f8f8f8',
                                        minHeight: '40px',
                                        // border: '1px solid #e0e0e0',
                                        // borderRadius: 1
                                    }}
                                >
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Place
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {candidateData?.location || '________________'}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        minHeight: '60px',
                                        borderBottom: '1px solid #999', // mimic signature underline
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        // bgcolor: '#fdfdfd'
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{ mb: 0.5 }}
                                    >
                                        Name
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: `'Dancing Script', 'Pacifico', 'Cedarville Cursive', cursive`,
                                            fontSize: '1.5rem',
                                            color: '#333',
                                            minHeight: '32px',
                                        }}
                                    >
                                        {formik.values.name || '________________'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Form Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="contained" color="primary" disabled={formik.isSubmitting} type="submit">
                            {formik.isSubmitting ? 'Loading.....' : 'Submit'}
                        </Button>
                    </Box>
                </form>
            </Container>
        </>
    );
};

export default JoiningReportFormAddEdit;