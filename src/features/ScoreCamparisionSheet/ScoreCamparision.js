import React, { useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
import { Box , CardContent, Grid, Typography } from "@mui/material";
import ScoreComparisonSheet from "./ScoreCartsDetails";
import { AsyncPaginate } from "react-select-async-paginate";
import { useDispatch } from "react-redux";
import { GetDesignationWiseJobList } from "../slices/AtsSlices/getJobListSlice";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import Select from 'react-select'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { toast } from "react-toastify";


const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#8b7dceff' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#8b7dceff',
        },
        minHeight: '40px', // match Select dropdown height
        height: '40px',
        fontSize: '0.95rem', // match Select font size
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
        zIndex: 1300, // ensure menu overlays table and other content
        // position: 'relative',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#34209b' : state.isFocused ? '#8b7dceff' : provided.backgroundColor,
        fontSize: '0.95rem', // match Select font size
        minHeight: '36px', // match Select option height
        '&:hover': {
            backgroundColor: '#8b7dceff',
            color: '#fff',
        },
    }),
};

const ScoreComparison = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const dispatch = useDispatch();
    const [scoreDetails, setScoreDetails] = useState(null);
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState({
        job: false,
        interviewers: false,
    });

    const getScoringSheetCaparisonDetails = async (jobId = '', interview_id) => {
        try {
            const payload = {
                job_id: jobId,
                employee_id: interview_id
            };
            // Assuming you have an action to fetch score comparison details
            const result = await axios.post(`${config.API_URL}/scoringSheet`, payload, apiHeaderToken(config.API_TOKEN))
            if (result.status === 200) {
                setScoreDetails(result.data?.data);
            } else {
                setScoreDetails(null);
            }

        } catch (error) {
            console.error("Error fetching score comparison details:", error);
            setScoreDetails(null);
        }
    }

    const JobInputChanges = async (inputValue, loadedOptions, { page }) => {

        let payloads = {
            "keyword": inputValue,
            "page_no": page.toString(),
            "per_page_record": "10",
            "scope_fields": [
                "_id",
                "job_title",
                "project_id",
                "project_name"
            ],
            "status": "Published",
        }

        const result = await dispatch(GetDesignationWiseJobList(payloads)).unwrap();

        return {
            options: result?.map((item) => {
                return {
                    id: item._id,
                    label: `${item?.job_title} (${item?.project_name})`,
                    value: item?._id,
                    project_id: item?.project_id
                }
            }),
            hasMore: result.length >= 10, // if true, next page will load
            additional: {
                page: page + 1
            }
        };
    };

    const handleJobChange = async (selectedOption) => {
        setSelectedJob(selectedOption);
        if (selectedOption) {
            try {
                setLoading((prev) => ({ ...prev, interviewers: true }));
                const response = await axios.post(`${config.API_URL}getInterviewerListByJobId`, { "job_id": selectedOption?.value }, apiHeaderToken(config.API_TOKEN));
                if (response.status === 200) {
                    let options = response.data?.data?.map((interviewer) => ({
                        label: `${interviewer?.employee_name} (${interviewer.employee_code})`,
                        value: interviewer.employee_doc_id,
                    }));
                    setInterviewers(options);
                }
            } catch (error) {
                console.error("Error fetching interviewers:", error);
                setInterviewers([]);
            } finally {
                setSelectedInterview(null);
                setLoading((prev) => ({ ...prev, interviewers: false }));
            }

            await getScoringSheetCaparisonDetails(selectedOption?.value, "");
        } else {
            setScoreDetails(null);
            setInterviewers([]);
            setSelectedInterview(null); // Clear selected interview if job is cleared
        }
    };

    const handleInterviewChange = (selectedOption) => {
        setSelectedInterview(selectedOption);
        if (selectedOption) {
            getScoringSheetCaparisonDetails(selectedJob?.value, selectedOption?.value);
        } else {
            getScoringSheetCaparisonDetails(selectedJob?.value, "");
        }
    };

    return (
        <>
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3> Score Comparison Sheet </h3>
                        </div>
                    </div>
                    <Box sx={{ minHeight: '100vh' }}>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            {/* Static example data for demonstration */}
                            <Grid item xs={12} md={4}>
                                <AsyncPaginate
                                    placeholder={'Select Job'}
                                    value={selectedJob}
                                    loadOptions={JobInputChanges}
                                    onChange={handleJobChange}
                                    debounceTimeout={300}
                                    isClearable
                                    styles={customStyles}
                                    additional={{
                                        page: 1
                                    }}
                                    classNamePrefix="react-select"
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                {/* <FormControl fullWidth>
                                    <InputLabel>Select Interviewer</InputLabel> */}
                                <Select
                                    placeholder={'Select Interviewer'}
                                    options={interviewers}
                                    value={selectedInterview}
                                    onChange={handleInterviewChange}
                                    isClearable
                                    isSearchable
                                    styles={customStyles}
                                    classNamePrefix="react-select"
                                    onMenuOpen={() => {
                                        if (!selectedJob) {
                                            toast.error("Please select a job first.");
                                            return;
                                        }
                                    }}
                                    isDisabled={!selectedJob}
                                    isLoading={loading.interviewers}
                                />
                                {/* </FormControl> */}
                            </Grid>

                        </Grid>

                        {
                            scoreDetails && scoreDetails.length > 0 ? (
                                <ScoreComparisonSheet scoreDetails={scoreDetails} selectedJob={selectedJob} />
                            ) : (
                                <Box borderRadius={2} boxShadow={2}
                                    sx={{
                                        maxWidth: "100%",
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        p: 3,
                                    }}
                                >
                                    <CardContent>
                                        <SentimentDissatisfiedIcon
                                            fontSize="large"
                                            color="action"
                                            sx={{ mb: 1 }}
                                        />
                                        <Typography variant="h6" gutterBottom>
                                            No Interview Scores Found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            There are no interview score details available for this job yet.
                                        </Typography>
                                    </CardContent>
                                </Box>
                            )
                        }
                        {/* <ScoreComparisonSheet scoreDetails={scoreDetails} /> */}
                    </Box>

                </div>
            </div>
        </>
    );
}

export default ScoreComparison;