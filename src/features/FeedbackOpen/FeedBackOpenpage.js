import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Grid,
    Chip,
    Divider,
    Stack,
    Paper,
    Container,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Radio,
    RadioGroup,
    Switch,
    Slider,
    ButtonGroup
} from '@mui/material';
import {
    Email,
    Phone,
    LocationOn,
    Work,
    School,
    CalendarToday,
    Person,
    Business,
    Assessment,
    Star,
    StarBorder,
    StarHalf,
    RateReview,
    VideoCall,
    Badge,
    ThumbUp,
    Celebration,
    TaskAlt
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from "react-toastify";
import axios from "axios";
import { apiHeaderToken } from "../../config/api_header";
import config from "../../config/config";
import moment from "moment";
import Rating from "react-rating";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { FetchCandidatesListByIdInterview } from "../slices/AppliedJobCandidates/JobAppliedCandidateSlice";

const FeedBackOpenpage = () => {
    const params = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [UrlDetails, setUrl] = useState(null);
    const dispatch = useDispatch();
    const [skillRating, setSkillRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [commnicationRating, setCommnicatioRating] = useState(0);
    const [JobMatch, setJobMatch] = useState(0);
    const [JobKnowleage, setJobKnowleage] = useState(0);
    const [creaTiveProbuls, setcreaTiveProbuls] = useState(0);
    const [teamPlayes, setteamPlayes] = useState(0);
    const [exposure, setexposure] = useState(0);
    const [canLoading, setCanLoading] = useState(false)
    const [alredyApproved, setApproved] = useState(false);
    const [smLoading, setSmLoading] = useState(false);

    useEffect(() => {
        const url = new URL(`${config.API_URL}interviewFeedback/${params?.id}`);
        const urlFirstParts = url.pathname.split("/");
        const mprFrmIndex = urlFirstParts.indexOf("interviewFeedback");
        const mprDocDetails = urlFirstParts[mprFrmIndex + 1];
        try {
            const data = atob(mprDocDetails);
            if (data && typeof data !== 'undefined') {
                setUrl(data?.split('|'))
            }
        } catch (error) {
            console.error("Error decoding Base64 string:", error);
        }
    }, [params?.id]);

    // Candidate_id | Interviewer_id | applied_job_d | token

    const fetchCandidateDetails = async () => {
        try {

            const payload = {
                _id: UrlDetails?.[0],
                token: UrlDetails?.[3]
            }
            setCanLoading(true)
            let response = await dispatch(FetchCandidatesListByIdInterview(payload)).unwrap()
            if (response?.status === 200) {
                setUserDetails(response?.data?.data)
                let appliedDetails = response?.data?.data?.applied_jobs?.find((job) => job._id === UrlDetails?.[2]);
                let verified = appliedDetails?.interviewer?.find((item) => item?._id === UrlDetails?.[1]);
                setApproved(verified?.feedback_status === 'Approved');
            } else {
                setUserDetails(null)
            }
        } catch (error) {
            setUserDetails(null)
        } finally {
            setCanLoading(false)
        }
    }

    useEffect(() => {

        if (UrlDetails && Array.isArray(UrlDetails) && UrlDetails?.length > 0) {
            fetchCandidateDetails()
        }

    }, [UrlDetails])


    const [interviewId, setInterviewId] = useState('');
    const [comment, setComment] = useState('');
    const [date, setDate] = useState('');
    const [ratingOption, setRatingOption] = useState('');
    const [ratingPercentage, setRatingPercentage] = useState('');
    const [manuallyEdited, setManuallyEdited] = useState(false);
    const [isParticipated, setIsParticipated] = useState(true);

    useEffect(() => {
        if (!manuallyEdited) {
            const totalPossiblePoints = 50;
            const currentTotal =
                JobMatch +
                JobKnowleage +
                creaTiveProbuls +
                teamPlayes +
                commnicationRating +
                exposure;
            const percentage = Math.round((currentTotal / totalPossiblePoints) * 100);
            setRatingPercentage(percentage.toString());
        }

        const percent = Number(ratingPercentage);
        if (percent < 40) setRatingOption('rejected');
        else if (percent >= 40 && percent < 65) setRatingOption('waitlisted');
        else if (percent >= 65) setRatingOption('suitable');
    }, [
        JobMatch,
        JobKnowleage,
        creaTiveProbuls,
        teamPlayes,
        commnicationRating,
        exposure,
        manuallyEdited,
        ratingPercentage
    ]);

    useEffect(() => {
        setDate(moment().format("YYYY-MM-DD"));
    }, []);

    const resetForm = () => {
        setComment('');
        setCommnicatioRating(0);
        setSkillRating(0);
        setJobMatch(0);
        setJobKnowleage(0);
        setteamPlayes(0);
        setexposure(0);
        setcreaTiveProbuls(0);
        setDate(moment().format("YYYY-MM-DD"));
        setRating(0);
        setRatingOption('');
        setRatingPercentage('');
        setManuallyEdited(false);
        setInterviewId('');
        setIsParticipated(true);
    };

    const appliedJob = useMemo(() => {
        return userDetails?.applied_jobs?.find((job) => job.job_id === userDetails?.job_id)
    }, [userDetails])

    let checkStatus = appliedJob?.interviewer?.find((item) => item?._id === UrlDetails?.[1]);

    const handleSubmitFeedBack = (e) => {
        e.preventDefault();

        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }
        let interviewer = appliedJob?.interviewer?.find((item) => item?._id === UrlDetails?.[1])
        if (isParticipated) {
            const payloads = {
                candidate_id: userDetails?._id,
                interviewer_id: UrlDetails?.[1],
                applied_job_id: UrlDetails?.[2],
                comment,
                job_match: JobMatch,
                job_knowledge: JobKnowleage,
                creative_problem_solving: creaTiveProbuls,
                team_player: teamPlayes,
                communication_skill: commnicationRating,
                exposure_to_job_profile: exposure,
                hiring_suggestion_status: ratingOption,
                hiring_suggestion_percent: ratingPercentage,
                add_by_name: interviewer?.employee_name,
                add_by: interviewer?.employee_name,
                add_by_mobile: interviewer?.mobile_no || '',
                add_by_designation: interviewer?.designation || '',
                add_by_email: interviewer?.email || '',
                feedback_date: date,
                participated: true
            };

            setSmLoading(true)

            axios.post(`${config.API_URL}saveFeedback`, payloads, apiHeaderToken(UrlDetails?.[3]))
                .then((response) => {
                    if (response.status === 200) {
                        resetForm()
                        setApproved(true)
                        return toast.success(response.data.message)
                    }
                })
                .catch(err => {
                    toast.error(err.response.data.message || err?.message)
                }).finally(() => {
                    setSmLoading(false);
                })
        } else {
            const payloads = {
                candidate_id: userDetails?._id,
                interviewer_id: UrlDetails?.[1],
                applied_job_id: UrlDetails?.[2],
                comment,
                participated: false,
                non_participation_reason: comment,
                add_by_name: interviewer?.employee_name,
                add_by: interviewer?.employee_name,
                add_by_mobile: interviewer?.mobile_no,
                add_by_designation: interviewer?.designation,
                add_by_email: interviewer?.email,
                feedback_date: date
            };

            axios.post(`${config.API_URL}saveSkippedInterviewCandidateFeedback`, payloads, apiHeaderToken(UrlDetails?.[3]))
                .then((response) => {
                    if (response.status === 200) {
                        resetForm()
                        setApproved(true)
                        return toast.success(response.data.message)
                    }
                })
                .catch(err => {
                    toast.error(err.response.data.message || err?.message)
                }).finally(() => {
                    setSmLoading(false);
                })
        }
    };

    if (canLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6">Loading candidate details...</Typography>
            </Container>
        );
    }

    // Thank You Message Component for Already Approved Feedback
    const ThankYouMessage = () => (
        <Paper
            elevation={3}
            sx={{
                p: 6,
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'background.paper'
            }}
        >
            <TaskAlt sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />

            <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                Thank You!
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your feedback has been successfully submitted.
            </Typography>

            <Chip
                icon={<CheckCircleIcon />}
                label="Feedback Approved"
                color="success"
                variant="outlined"
            />
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>

                {/* Candidate Details Card */}
                <Box sx={{ mb: 3, p: 2.5, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                    <Grid container spacing={3} alignItems="center">

                        {/* Avatar & Basic Info */}
                        <Grid item xs={12} md={4}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: 'primary.main',
                                        fontSize: '1.1rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {userDetails?.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                                        {userDetails?.name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        {userDetails?.job_title || 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" color="primary.main" fontWeight="500">
                                        {userDetails?.designation || 'N/A'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>

                        {/* Contact & Professional Details */}
                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {userDetails?.email || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {userDetails?.mobile_no || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {userDetails?.location || 'N/A'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {userDetails?.department || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {userDetails?.total_experience || 'N/A'} Experience
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {moment(appliedJob?.interview_date).format('DD-MM-YYYY') || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <VideoCall sx={{
                                        fontSize: 16,
                                        color: appliedJob?.interview_type === 'Online' ? 'success.main' : 'warning.main'
                                    }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: appliedJob?.interview_type === 'Online' ? 'success.main' : 'warning.main',
                                            fontWeight: 500
                                        }}
                                    >
                                        {appliedJob?.interview_type || 'N/A'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                {
                    alredyApproved ? (
                        <ThankYouMessage />
                    ) : (
                        <>
                            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" fontWeight="600">Interview Participation</Typography>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption">
                                            {isParticipated ? "Participated" : "Not Participated"}
                                        </Typography>
                                        <Switch
                                            size="small"
                                            checked={isParticipated}
                                            onChange={(e) => setIsParticipated(e.target.checked)}
                                            color="primary"
                                        />
                                    </Stack>
                                </Stack>
                            </Box>

                            {/* If Participated → full form */}
                            {isParticipated ? (
                                <>
                                    {/* Skills */}
                                    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="body2" fontWeight="600" sx={{ mb: 2 }}>
                                            Skills Assessment
                                        </Typography>

                                        <Grid container spacing={2}>

                                            {/* Job Match */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="caption" display={'block'} fontWeight={600}>Job Match</Typography>
                                                <Rating
                                                    initialRating={JobMatch}
                                                    onChange={(rate) => setJobMatch(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={5} // Maximum rating is 10
                                                />
                                            </Grid>

                                            {/* Job Knowledge */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="caption" display={'block'} fontWeight={600}>Job Knowledge</Typography>
                                                <Rating
                                                    initialRating={JobKnowleage}
                                                    onChange={(rate) => setJobKnowleage(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={10} // Maximum rating is 10
                                                />
                                            </Grid>

                                            {/* Creative Problem Solving */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="caption" display={'block'} fontWeight={600}>Creative Problem Solving</Typography>
                                                <Rating
                                                    initialRating={creaTiveProbuls}
                                                    onChange={(rate) => setcreaTiveProbuls(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={10} // Maximum rating is 10
                                                />
                                            </Grid>

                                            {/* Team Player */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="caption" display={'block'} fontWeight={600}>Team Player</Typography>
                                                <Rating
                                                    initialRating={teamPlayes}
                                                    onChange={(rate) => setteamPlayes(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={5} // Maximum rating is 10
                                                />
                                            </Grid>

                                            {/* Communication */}
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Typography variant="caption" display={'block'} fontWeight={600}>Communication Skill</Typography>
                                                <Rating
                                                    initialRating={commnicationRating}
                                                    onChange={(rate) => setCommnicatioRating(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={10} // Maximum rating is 10
                                                />
                                            </Grid>

                                            {/* Exposure */}
                                            <Grid item xs={12} sm={6} md={4} display={'block'}>
                                                <Typography variant="caption" display={'block'} fontWeight={600}>Exposure To Job Profile</Typography>
                                                <Rating
                                                    initialRating={exposure}
                                                    onChange={(rate) => setexposure(rate)}
                                                    fractions={2} // Allows 0.5 increments
                                                    fullSymbol={<FaStar color="gold" size={24} />}
                                                    halfSymbol={<FaStarHalfAlt color="gold" size={24} />}
                                                    emptySymbol={<FaRegStar color="gold" size={24} />}
                                                    stop={10} // Maximum rating is 10
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>


                                    {/* Interview & Decision */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                <Typography variant="body2" fontWeight="600">Interview Details</Typography>

                                                <TextField
                                                    fullWidth size="small" type="date"
                                                    label="Date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{ mt: 1 }}
                                                />

                                                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                                                    {/* <InputLabel>Interviewer</InputLabel> */}
                                                    {/* <Select
                                                        value={interviewId}
                                                        onChange={(e) => setInterviewId(e.target.value)}
                                                        label="Interviewer"
                                                    >
                                                        <MenuItem value="">Select Interviewer</MenuItem>
                                                        <MenuItem value="1">Interviewer 1</MenuItem>
                                                        <MenuItem value="2">Interviewer 2</MenuItem>
                                                    </Select> */}

                                                    <TextField
                                                        fullWidth size="small" type="text"
                                                        // label="interviewer name"
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={{ mt: 1 }}
                                                        readOnly
                                                        value={checkStatus?.employee_name}
                                                    />

                                                </FormControl>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                <Typography variant="body2" fontWeight="600">Hiring Decision</Typography>

                                                <ButtonGroup fullWidth size="small" sx={{ mt: 1 }}>
                                                    <Button
                                                        variant={ratingOption === "rejected" ? "contained" : "outlined"}
                                                        color="error"
                                                        onClick={() => setRatingOption("rejected")}
                                                    >
                                                        Rejected
                                                    </Button>

                                                    <Button
                                                        variant={ratingOption === "waitlisted" ? "contained" : "outlined"}
                                                        color="warning"
                                                        onClick={() => setRatingOption("waitlisted")}
                                                    >
                                                        Waitlisted
                                                    </Button>

                                                    <Button
                                                        variant={ratingOption === "suitable" ? "contained" : "outlined"}
                                                        color="success"
                                                        onClick={() => setRatingOption("suitable")}
                                                    >
                                                        Suitable
                                                    </Button>
                                                </ButtonGroup>

                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Rating %"
                                                    value={ratingPercentage}
                                                    sx={{ mt: 2 }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*$/.test(val) && Number(val) <= 100) {
                                                            setRatingPercentage(val);
                                                            setManuallyEdited(true);
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {/* Comments */}
                                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                                        <Typography variant="body2" fontWeight="600">Additional Comments</Typography>

                                        <TextField
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={3}
                                            sx={{ mt: 1 }}
                                            label="Enter feedback comments"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </Box>
                                </>
                            ) : (
                                /* Non Participation */
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                                    <Typography variant="body2" fontWeight="600">Reason for Non-Participation</Typography>

                                    <TextField
                                        fullWidth
                                        size="small"
                                        multiline
                                        rows={3}
                                        sx={{ mt: 1 }}
                                        label="Reason"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </Box>
                            )}

                            {/* Submit Button */}
                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={handleSubmitFeedBack}
                                    disabled={smLoading}
                                    startIcon={<CheckCircleIcon />}
                                >
                                    {smLoading ? 'Submitting...' : 'Submit Feedback'}
                                </Button>
                            </Box>
                        </>
                    )
                }
            </Paper >
        </Container >
    );
};

export default FeedBackOpenpage;
