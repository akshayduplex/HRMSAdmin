import { React, useState , useEffect } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StepConnector from "@mui/material/StepConnector";
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import { Link } from 'react-router-dom';
import { CamelCases , DateFormate } from "../../utils/common";

const steps = ["Applied", "Shortlisted", "Interview", "Offer", "Hired"];
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 20,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                "linear-gradient( 95deg,rgba(48, 169, 226, 1) 0%,rgba(48, 169, 226, 1) 50%,rgba(48, 169, 226, 1) 100%)",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                "linear-gradient( 95deg,rgba(48, 169, 226, 1) 0%,rgba(48, 169, 226, 1) 50%,rgba(48, 169, 226, 1) 100%)",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        width: 3,
        height: 1,
        border: 0,
        backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderRadius: 1,
    },
}));


const CustomStepIcon = ({ active, completed }) => {
    if (completed) {
        return <CheckCircleIcon color="primary" />;
    } else if (active) {
        return <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
            <path d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z" fill="#30A9E2" />
        </svg>;
    } else {
        return <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
            <path d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z" fill="#EBEBEB" />
        </svg>;
    }
};


export default function InterviewSteps({interviewStep}) {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (interviewStep && interviewStep?.applied_jobs[0]?.form_status) {
            const currentStepIndex = steps.indexOf(interviewStep?.applied_jobs[0]?.form_status);
            if (currentStepIndex !== -1) {
                setActiveStep(currentStepIndex);
            }
        }
    }, [interviewStep]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    return (
        <>
            <div className="sitecard pr-0 ps-0 mb-3">
                    <div className="d-flex flex-column steps_intervw_hdr gap-1 px-3">
                        <div className="location">
                            <span>{interviewStep && CamelCases(interviewStep?.applied_jobs[0]?.interview_type)}</span>
                        </div>
                        <h4 className="mb-0">{interviewStep && interviewStep?.applied_jobs[0]?.job_title}</h4>
                        <div className="dflexbtwn">
                            <span> { interviewStep && interviewStep?.location } </span>
                            <span>{ interviewStep && DateFormate(interviewStep?.applied_jobs[0]?.add_date) }</span>
                        </div>
                    </div>
                    <Box sx={{ width: "100%" }} className="px-3">
                        <Stepper
                            activeStep={activeStep}
                            connector={<ColorlibConnector />}
                            orientation="vertical"
                        >
                            {/* Your steps */}
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                    <div className="read-btn w-100 mt-3 px-3">
                        <Link to={`/schedule-interview/${interviewStep?.job_id}?userId=${interviewStep?._id}&applied-job-id=${interviewStep && interviewStep?.applied_jobs[0]?._id}`}>
                            <button className="btn" onClick={handleNext}>Schedule Interview</button>
                        </Link>
                    </div>
            </div>
        </>
    );
}