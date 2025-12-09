import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UploadsExcelFile from './FileUplodsStepper';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { JsonDataParsed, uploadsFiles } from '../slices/ImportCandidateSlice/ImportCandidate';
import { useDispatch } from 'react-redux';
import * as XLSX from "xlsx";
import VerifiedContent from './verifiedContent';
import UploadsCandidate from './UplodsCandidate';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import { useNavigate } from 'react-router-dom';



const REQUIRED_FIELDS = [
    "email",
    "name",
    "mobile_no",
    "designation",
    "total_experience",
    "location",
    "current_ctc",
    "expected_ctc",
    "current_employer",
    "current_employer_mobile",
    "department"
];




const steps = ['Import Excel', 'Verified Content', 'Uploads Candidate'];


const ImportCandidate = () => {

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

    const hasEmptyRequiredFields = (selectedOptions) => {

        const mappedFields = selectedOptions.filter(item => item !== null)?.map(record => record?.value) || [];
    
        return REQUIRED_FIELDS.some(field => !mappedFields.includes(field));
    };


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

            const hasErrors = hasEmptyRequiredFields(selectedOptions)

            if (hasErrors) {
                return toast.warn('Please Map the Required Headers');
            }

            handleSaveMappings()

        }

        if (activeStep === 2) {

            if (!project) {
                return toast.warn("Please Select the Project");
            }
            if (!designationSelectedValue) {
                return toast.warn("Please choose the Designation");
            }
            if (!selectedOption) {
                return toast.warn("Please choose the Applied From");
            }
            if (!file) {
                return toast.warn("Please Choose the File")
            }
            if (!jobSelectedOption) {
                return toast.warn("Please Select the Job")
            }

            try {

                let updatedData = extractedData && extractedData.map((record) => {
                    const filteredRecord = { ...record }; // Create a copy of the record
                    delete filteredRecord.id; // Remove the 'id' key
                    delete filteredRecord.Sno; // Remove the 'Sno' key
                    return filteredRecord;
                });

                let Payloads = {
                    "project_id": project?.value,
                    "job_id": jobSelectedOption?.value,
                    "applied_from": selectedOption?.value,
                    "candidate_data": updatedData
                }

                const response = await axios.post(`${config.API_URL}importCandidatesDataJson`, Payloads, apiHeaderToken(config.API_TOKEN))
                if (response.status === 200) {
                    toast.success(response?.data?.message);
                    setProject(null);
                    setSelectedJobOption(null);
                    setSelectedOption(null);
                    setSelectedDesignationValue(null)
                    setTimeout(() => {
                        navigate('/ats')
                    }, 5000)

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

    const importedHeaders = extractedData && extractedData.length > 0 ? Object.keys(extractedData[0]) : [];

    const handleSaveMappings = () => {

        const newMappings = selectedOptions.map((selected, index) => ({
            importedHeader: importedHeaders[index],
            staticHeader: selected ? selected.value : null,
        }));

        setMappedData(newMappings);

        const updatedData = extractedData.map((record) => {
            const updatedRecord = {};
            importedHeaders.forEach((header, index) => {
                const staticHeader = newMappings[index]?.staticHeader;
                if (staticHeader) {
                    updatedRecord[staticHeader] = record[header];
                }
            });
            return updatedRecord;
        });

        dispatch(JsonDataParsed(updatedData));
    };


    // components stepper mapping -

    const mappingComponetsSteper = {
        1: < UploadsExcelFile />,
        2: < VerifiedContent selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} setMappedData={setMappedData} mappedData={mappedData}  />,
        3: <UploadsCandidate
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

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleDownload = () => {
        // You can directly reference the file path in the public folder
        const fileUrl = `/Hrms_Candidate_import_data_format.xlsx`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'Hrms_Candidate_import_data_format.xlsx'; // The name of the downloaded file
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
                            <h4>Import Candidate</h4>
                        </div>
                        <div className="pagename">
                            <Button variant="primary" type="button" onClick={handleDownload}>
                                Downloads Format
                            </Button>
                        </div>
                    </div>

                    <div className="row mt-3" >
                        <div className="sitecard">
                            <div className="projectcard">

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

export default ImportCandidate;





