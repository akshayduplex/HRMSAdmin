import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import config from '../../../config/config';
import { apiHeaderToken } from '../../../config/api_header';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { GetJobList, GetJobListById } from '../../slices/AtsSlices/getJobListSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';


const LoadingProgress = ({ progress }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={progress}
                size={28}
                sx={{ color: '#1976d2' }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span style={{ fontSize: '0.75rem', color: '#1976d2' }}>
                    {Math.round(progress)}%
                </span>
            </Box>
        </Box>
    );
};


export default function PostJobModal({ open, onClose, data, setPostedData, postedData }) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [values, setValues] = useState({
        courseType: '',
        qualification: '',
        specialization: '',
        minSalary: 0,
        maxSalary: 0,
        workType: '',
    });

    const location = useLocation();

    const dispatch = useDispatch()
    const { id } = useParams();


    const [courseTypes, setCourseTypes] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [specializations, setSpecializations] = useState([]);

    /**
     * @description Fetch Posted Job Details From the API
     * @method Post
     */
    const FetchPostedJobDetails = async (id) => {
        try {
            let payloads = {
                job_doc_id: id,
            }
            let response = await axios.post(`${config.API_URL}naukri/publish_job_details`, payloads, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                setPostedData(response.data?.data)
            }
        } catch (error) {
            console.log(error, 'this is Error Message from the Url this is Error')
        }
    }


    // autofield the salary List

    useEffect(() => {
        if (open && data && data?.naukari_job_data?.status !== 'CREATED') {
            setValues((prev) => (
                {
                    ...prev,
                    maxSalary: data.salary_range,
                    minSalary: data.salary_range,
                }
            ))
        }

        if (open && data && data?.naukari_job_data?.status === 'CREATED') {
            FetchPostedJobDetails(data?._id)
        }
    }, [data , open])


    useEffect(() => {
        const updateFormData = async () => {
            if (!postedData || !open || !courseTypes.length) return;

            try {
                // First set course type
                const courseType = courseTypes?.find(
                    (item) => item?.course_type === postedData?.educationQualifications?.[0]?.courseType
                )?.course_name;

                if (courseType) {
                    const courseTypeObj = courseTypes?.find((item) => item?.course_name === courseType);

                    // Fetch qualifications
                    const qualRes = await axios.post(
                        `${config.API_URL}naukri/qualification_list`,
                        { course_type: courseTypeObj?.course_type },
                        apiHeaderToken(config.API_TOKEN)
                    );

                    setQualifications(qualRes.data?.data || []);

                    const qualification = postedData?.educationQualifications?.[0]?.qualification;
                    if (qualification) {
                        // Fetch specializations
                        const specRes = await axios.post(
                            `${config.API_URL}naukri/specialization_list`,
                            {
                                course_type: courseTypeObj?.course_type,
                                qualification: qualification
                            },
                            apiHeaderToken(config.API_TOKEN)
                        );

                        setSpecializations(specRes.data?.data || []);
                    }

                    // Set all values after fetching dependencies
                    setValues(prev => ({
                        ...prev,
                        courseType: courseType,
                        qualification: qualification || '',
                        specialization: postedData?.educationQualifications?.[0]?.specialization || '',
                        minSalary: postedData?.maxSalary || 0,
                        maxSalary: postedData?.minSalary || 0,
                        workType: postedData?.workMode || ''
                    }));
                }
            } catch (error) {
                console.error('Error updating form data:', error);
                toast.error('Failed to load form data');
            }
        };

        updateFormData();
    }, [postedData, open, courseTypes]);

    const isValidSalary = (value) => {
        return /^\d+$/.test(value) && parseInt(value) >= 0;
    };

    const handleChange = (field) => async (e) => {
        const value = e.target.value;
        setValues((prev) => ({ ...prev, [field]: value }));

        if (field === 'courseType') {

            setValues((prev) => ({
                ...prev,
                qualification: '',
                specialization: '',
            }));

            let type = courseTypes?.find((item) => item?.course_name === value)?.course_type
            setQualifications([]);
            setSpecializations([]);

            try {
                const res = await axios.post(`${config.API_URL}naukri/qualification_list`, {
                    course_type: type,
                }, apiHeaderToken(config.API_TOKEN));
                setQualifications(res.data?.data || []);
            } catch (err) {
                // toast.error(err?.message || 'Failed to fetch qualifications');
                console.log(err, 'this is Error Message from the Url this is Error')
            }
        }

        if (field === 'qualification') {
            setValues((prev) => ({
                ...prev,
                specialization: '',
            }));
            setSpecializations([]);

            let type = courseTypes?.find((item) => item?.course_name === values.courseType)?.course_type

            try {
                const res = await axios.post(`${config.API_URL}naukri/specialization_list`, {
                    course_type: type,
                    qualification: value,
                }, apiHeaderToken(config.API_TOKEN));
                setSpecializations(res.data?.data || []);
            } catch (err) {
                // toast.error('Failed to fetch specializations');
                console.log(err, 'this is Error Message from the Url this is Error')
            }
        }
    };

    useEffect(() => {
        if (open) {
            axios
                .get(`${config.API_URL}naukri/course_type_list`, apiHeaderToken(config.API_TOKEN))
                .then((res) => setCourseTypes(res.data?.data || []))
                .catch(() => toast.error('Failed to fetch course types'));
        }
    }, [open]);

    const handleSubmit = async () => {
        try {

            if (!values.courseType) {
                toast.error('Course Type is required');
                return;
            }

            // if (!values.qualification) {
            //     toast.error('Qualification is required');
            //     return;
            // }

            // if (!values.specialization) {
            //     toast.error('Specialization is required');
            //     return;
            // }

            if (!values.workType) {
                toast.error('Work type is required');
                return;
            }

            setLoading(true);
            // Start progress timer
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 90);
                });
            }, 200);

            let payloads = {
                "job_doc_id": data?._id,
                "education_data":
                    [
                        {
                            "courseType": courseTypes?.find((item) => item?.course_name === values.courseType)?.course_type,
                            "qualification": values.qualification,
                            "specialization": values.specialization
                        }
                    ],
                "work_type": values.workType,
                "action": data && data?.naukari_job_data?.status === 'CREATED' ? "update" : "add",
                min_salary: values.minSalary,
                max_salary: values.maxSalary
            }


            let response = await axios.post(`${config.API_URL}naukri/publish_job`, payloads, apiHeaderToken(config.API_TOKEN))

            if (response?.data?.status) {
                toast.success(response?.data?.message);
                setTimeout(() => {
                    setLoading(false);
                    setProgress(0);
                    onClose();
                }, 3000);
                dispatch(GetJobListById(id));
                if (['/job-list','/ats'].includes(location.pathname)) {
                    let Payloads = {
                        "keyword": "",
                        "department": "",
                        "job_title": "",
                        "location": "",
                        "job_type": "",
                        "salary_range": "",
                        "page_no": "1",
                        "per_page_record": "100",
                        "status": 'Published',
                        "scope_fields": [
                            "_id",
                            "project_name",
                            "department",
                            "job_title",
                            "job_type",
                            "experience",
                            "location",
                            "salary_range",
                            "status",
                            "working",
                            "deadline",
                            "form_candidates",
                            "available_vacancy",
                            "total_vacancy",
                            "add_date",
                            "designation",
                            "naukari_job_data"
                        ],
                    }
                    dispatch(GetJobList(Payloads));
                    FetchPostedJobDetails(data?._id)
                } else {
                    dispatch(GetJobListById(id));
                    FetchPostedJobDetails(data?._id)
                }
                
            } else {
                toast.error(response?.data?.message || 'Failed to post job');
                setTimeout(() => {
                    setLoading(false);
                    setProgress(0);
                    onClose();
                }, 3000);
            }
        } catch (error) {
            console.error('Error posting job:', error);
            setProgress(0);
            setLoading(false);
            toast.error(error?.response?.data?.message || 'An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Post Job on Naukari</DialogTitle>
            <DialogContent dividers>
                {/* Course Type Dropdown */}
                <TextField
                    select
                    label="Course Type"
                    fullWidth
                    required
                    value={values.courseType}
                    onChange={handleChange('courseType')}
                    SelectProps={{ native: true }}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                >
                    <option value="" disabled>
                        Select Course Type
                    </option>
                    {courseTypes?.map((type, idx) => (
                        <option key={idx} value={type?.course_name}>
                            {type?.course_name}
                        </option>
                    ))}
                </TextField>

                {/* Qualification Dropdown */}
                <TextField
                    select
                    label="Qualification"
                    fullWidth
                    required
                    value={values.qualification}
                    onChange={handleChange('qualification')}
                    SelectProps={{ native: true }}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    disabled={!values.courseType}
                >
                    <option value="" disabled>
                        Select Qualification
                    </option>

                    {qualifications?.map((qual, idx) => (
                        <option key={idx} value={qual?.qualification}>
                            {qual?.qualification}
                        </option>
                    ))}
                </TextField>

                {/* Specialization Dropdown */}
                <TextField
                    select
                    label="Specialization"
                    fullWidth
                    required
                    value={values.specialization}
                    onChange={handleChange('specialization')}
                    SelectProps={{ native: true }}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    disabled={!values.qualification}
                >
                    <option value="" disabled>
                        Select Specialization
                    </option>
                    {specializations.map((spec, idx) => (
                        <option key={idx} value={spec?.specialization}>
                            {spec?.specialization}
                        </option>
                    ))}
                </TextField>

                {/* Min Salary -  */}
                <TextField
                    margin="dense"
                    label="Min Salary"
                    type="number"
                    value={values.minSalary}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (isValidSalary(value)) {
                            setValues(prev => ({
                                ...prev,
                                minSalary: parseInt(value),
                                // maxSalary: parseInt(value) > prev.maxSalary ? parseInt(value) : prev.maxSalary
                            }));
                        }
                    }}
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    inputProps={{
                        min: 0,
                        step: 1,
                        pattern: '[0-9]*'
                    }}
                    error={values.minSalary < 0}
                    helperText={values.minSalary < 0 ? "Salary cannot be negative" : ""}
                    fullWidth
                    required
                />

                {/* Max Salary Input */}
                <TextField
                    margin="dense"
                    label="Max Salary"
                    type="number"
                    value={values.maxSalary}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (isValidSalary(value)) {
                            setValues(prev => ({
                                ...prev,
                                maxSalary: parseInt(value)
                            }));
                        }
                    }}
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    inputProps={{
                        min: values.minSalary,
                        step: 1,
                        pattern: '[0-9]*'
                    }}
                    error={values.maxSalary < values.minSalary}
                    helperText={values.maxSalary < values.minSalary ? "Max salary must be greater than or equal to min salary" : ""}
                    fullWidth
                    required
                />


                {/* Work Type Dropdown */}
                <TextField
                    select
                    label="Work Type"
                    fullWidth
                    value={values.workType}
                    onChange={handleChange('workType')}
                    SelectProps={{ native: true }}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                >
                    <option value="">Select Work Type</option>
                    <option value="In office">In Office</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !values.courseType || !values.workType}
                    startIcon={loading && <LoadingProgress progress={progress} />}
                >
                    {loading ? 'Posting...' : data && data?.naukari_job_data?.status === 'CREATED' ? "Update Job" : 'Post Job'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
