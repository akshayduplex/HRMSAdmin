import React, { useState, useEffect } from 'react';
import GoBackButton from '../Goback';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UploadsExcelFile from './FileUploadStteper';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { JsonDataParsed , uploadsFiles } from '../../features/slices/ImportCandidateSlice/ImportCandidate';
import { useDispatch } from 'react-redux';
import * as XLSX from "xlsx";
import VerifiedContent from './VerifiedContent';
import UploadsCandidate from './UploadEmployee';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import { useNavigate } from 'react-router-dom';


const steps = ['Import Excel', 'Upload Employee'];


const ImportEmployee = () => {

    const [activeStep, setActiveStep] = React.useState(0);
    const dispatch = useDispatch()
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [mappedData, setMappedData] = useState([]);
    const [project, setProject] = useState(null);
    const [option, setOptions] = useState(null)
    const [projectWiseJobList, setJobList] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null);
    const [jobSelectedOption, setSelectedJobOption] = useState(null);
    const [defaultDesignation, setDefaultDesignation] = useState(null);
    const [designationSelectedValue, setSelectedDesignationValue] = useState(null)
    const navigate = useNavigate();

    const { file, extractedData } = useSelector((state) => state.import)


    useEffect(() => {
        return () => {
            dispatch(uploadsFiles())
            dispatch(JsonDataParsed())
        }
    }, [dispatch])

    const handleNext = async () => {

        if (activeStep === 0) {

            if (!file) {
                return toast.warn('Please Select the File')
            }

            if (!extractedData?.length || (Array.isArray(extractedData) && extractedData?.length <= 0 )) {
                return toast.warn('Please Do Not Uploads Empty Excel sheets')
            }

        }

        if (activeStep === 1) {

            // if (!project) {
            //     return toast.warn("Please Select the Project");
            // }
            // if (!designationSelectedValue) {
            //     return toast.warn("Please choose the Designation");
            // }
            // if (!selectedOption) {
            //     return toast.warn("Please Choose the Job type");
            // }
            // if (!file) {
            //     return toast.warn("Please Choose the File")
            // }

            try {

                let updatedData = extractedData && extractedData?.map((record) => {
                    const filteredRecord = { ...record }; // Create a copy of the record
                    delete filteredRecord.id; // Remove the 'id' key
                    delete filteredRecord.Sno; // Remove the 'Sno' key
                    delete filteredRecord?.designation_drop_down
                    filteredRecord.designation_name = filteredRecord.designation
                    return filteredRecord;
                });

                let Payloads = {
                    "employee_data": updatedData
                }

                const response = await axios.post(`${config.API_URL}importEmployeeDataSecond`, Payloads, apiHeaderToken(config.API_TOKEN))

                console.log(response)

                if (response.status === 200) {
                    toast.success(response?.data?.message);
                    // setProject(null);
                    setSelectedJobOption(null);
                    setSelectedOption(null);
                    setSelectedDesignationValue(null)
                    setTimeout(() => {
                        navigate(`/employee-list`)
                    }, 5000)
                    // setProject(null);
                } else {
                    toast.error(response?.data?.message);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || error.message);
            }
        }

        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // components stepper mapping -

    const mappingComponetsSteper = {
        1: < UploadsExcelFile />,
        // 2: < VerifiedContent selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} setMappedData={setMappedData} mappedData={mappedData}  />,
        2: <UploadsCandidate
            project={project}
            setProject={setProject}
            option={option}
            setOptions={setOptions}
            projectWiseJobList={projectWiseJobList}
            setJobList={setJobList}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            jobSelectedOption={jobSelectedOption}
            setSelectedJobOption={setSelectedJobOption}
            defaultDesignation={defaultDesignation}
            setDefaultDesignation={setDefaultDesignation}
            designationSelectedValue={designationSelectedValue}
            setSelectedDesignationValue={setSelectedDesignationValue}
        />
    }
    
    const handleDownload = () => {
        // You can directly reference the file path in the public folder
        const fileUrl = `/Hrms_Employee_import_format.xlsx`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'Hrms_Employee_import_format.xlsx'; // The name of the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="d-flex justify-content-between">
                        <div className="pagename">
                            <h4>Import Employee</h4>
                        </div>
                        <div className="pagename">
                            <Button variant="primary" type="button" onClick={handleDownload}>
                                Download Format
                            </Button>
                        </div>
                    </div>

                    <div className="row mt-3" >
                        <div className="sitecard">
                            <div className="projectcard w-100">

                                <Box sx={{ width: '100%' }}>

                                    <Stepper activeStep={activeStep}>
                                        {steps.map((label, index) => {
                                            const stepProps = {};
                                            const labelProps = {};
                                            return (
                                                <Step key={label} {...stepProps}>
                                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                                </Step>
                                            );
                                        })}
                                    </Stepper>

                                    {(
                                        <React.Fragment>
                                            <Typography sx={{ mt: 4, mb: 1 }}>  {mappingComponetsSteper[activeStep + 1]} </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                <Button
                                                    color="inherit"
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Back
                                                </Button>
                                                <Box sx={{ flex: '1 1 auto' }} />
                                                <Button variant="contained" onClick={handleNext}>
                                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                </Button>
                                            </Box>
                                        </React.Fragment>
                                    )}
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImportEmployee;





