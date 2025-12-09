import React, { useEffect, useState } from "react"; // Ensure useState is imported
import Modal from "react-bootstrap/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import StepConnector from "@mui/material/StepConnector";
import { styled } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Form from "react-bootstrap/Form";
import Select from "@mui/material/Select";
import DatePicker from "react-multi-date-picker";
import { Link } from "react-router-dom";

const CustomStepIcon = ({ active, completed }) => {
    if (completed) {
        return <CheckCircleIcon color="primary" />;
    } else if (active) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
            >
                <path
                    d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z"
                    fill="#30A9E2"
                />
            </svg>
        );
    } else {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
            >
                <path
                    d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5ZM8.73782 11.5C8.73782 13.0255 9.97449 14.2622 11.5 14.2622C13.0255 14.2622 14.2622 13.0255 14.2622 11.5C14.2622 9.97449 13.0255 8.73782 11.5 8.73782C9.97449 8.73782 8.73782 9.97449 8.73782 11.5Z"
                    fill="#EBEBEB"
                />
            </svg>
        );
    }
};

// const CustomStepConnector = styled(StepConnector)({
//     line: {
//         height: 3,
//         border: 0,
//         backgroundColor: "#eaeaf0",
//         borderRadius: 1,
//     },
//     active: {
//         "& $line": {
//             backgroundImage:
//                 "linear-gradient( 95deg, rgb(46, 46, 46) 0%, rgb(46, 46, 46) 50%, rgb(194, 194, 194) 50%, rgb(194, 194, 194) 100%)",
//         },
//     },
//     completed: {
//         "& $line": {
//             backgroundImage:
//                 "linear-gradient( 95deg, rgb(46, 46, 46) 0%, rgb(46, 46, 46) 50%, rgb(194, 194, 194) 50%, rgb(194, 194, 194) 100%)",
//         },
//     },
// });

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
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
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderRadius: 1,
    },
}));

const ExcelModal = (props) => {
    const [activeStep, setActiveStep] = useState(0);
    const [age, setAge] = useState("");
    const [values, setValues] = useState([]);
    //const [modalValues, setModalValues] = useState([]);

    // const handleChangeValue = (event) => {
    //     setAge(event.target.value);
    // };
    const handleChange = (dates) => {
        if (dates.length > 2) {
            dates.shift();
        }
        setValues(dates);
    };
    const handleChangeModal = (dates) => {
        if (dates.length > 2) {
            dates.shift();
        }
        //setModalValues(dates);
    };

    useEffect( ()=>{
        setActiveStep(0);
        setAge('');
    },[setActiveStep,setAge]);


    return (
        <>
            <Modal {...props} size="lg" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title>Import Excel</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center align-items-center flex-column">
                    <Box sx={{ minWidth: 500 }}>
                        <Stepper
                            activeStep={activeStep}
                            connector={<ColorlibConnector />}
                            alternativeLabel
                        >
                            <Step>
                                <StepLabel StepIconComponent={CustomStepIcon}>
                                    <h6>Step 1</h6>
                                    <span>Import Excel</span>
                                </StepLabel>
                            </Step>
                            <Step>
                                <StepLabel StepIconComponent={CustomStepIcon}>
                                    <h6>Step 2</h6>
                                    <span>Preview import and confirm</span>
                                </StepLabel>
                            </Step>
                        </Stepper>
                    </Box>
                    <div className="row mt-4 gy-4 px-5">
                        <div className="col-lg-6">
                            <label className="mb-2">Project</label>
                            <Box sx={{ minWidth: 300 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Select Project
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={age}
                                        label="Select Project"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <div className="col-lg-6 timeprd_slct">
                            <label className="mb-2 ">Select Month</label>
                            <Box sx={{ minWidth: 300 }}>
                                <FormControl fullWidth>
                                    <DatePicker
                                        multiple
                                        value={values}
                                        onChange={handleChangeModal}
                                        dateSeparator=" to "
                                    />
                                </FormControl>
                            </Box>
                        </div>
                        <div className="col-lg-8">
                            <Form.Label htmlFor="basic-url">
                                Select Attendance Excel Sheet
                            </Form.Label>
                            <div className="customfile_upload">
                                <input type="file" className="cstmfile w-100 rounded-2 border-secondary" />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="d-flex justify-content-center align-items-end flex-row gap-2 h-100 pb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                >
                                    <rect
                                        width="16"
                                        height="16"
                                        transform="translate(0 0.5)"
                                        fill="white"
                                    />
                                    <path
                                        d="M13 12.5V14.5H3V12.5H2V14.5C2 14.7652 2.10536 15.0196 2.29289 15.2071C2.48043 15.3946 2.73478 15.5 3 15.5H13C13.2652 15.5 13.5196 15.3946 13.7071 15.2071C13.8946 15.0196 14 14.7652 14 14.5V12.5H13Z"
                                        fill="#7054FF"
                                    />
                                    <path
                                        d="M13 7.5L12.295 6.795L8.5 10.585V1.5H7.5V10.585L3.705 6.795L3 7.5L8 12.5L13 7.5Z"
                                        fill="#7054FF"
                                    />
                                </svg>
                                <Link to="#" className="text-purple">
                                    Sample file
                                </Link>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="read-btn d-flex justify-content-center align-items-center mt-5">
                                <button className="btn w-large">Import</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ExcelModal;