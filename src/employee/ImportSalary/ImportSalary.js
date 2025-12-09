import React, { useState, useEffect } from 'react';
import GoBackButton from '../Goback';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UploadsExcelFile from '../ImportEmployee/FileUploadStteper';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { JsonDataParsed , uploadsFiles } from '../../features/slices/ImportCandidateSlice/ImportCandidate';
import { useDispatch } from 'react-redux';
import * as XLSX from "xlsx";
import VerifiedContent from '../ImportEmployee/VerifiedContent';
import UploadsCandidate from '../ImportEmployee/UploadEmployee';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken, apiHeaderTokenMultiPart } from '../../config/api_header';
import { useNavigate } from 'react-router-dom';

const REQUIRED_FIELDS = [
    "employee_id",
    "employee_name",
    "employee_email",
    "employee_mobile_no",
    "aadhaar_no",
    "basic_salary",
    "salary_hra",
    "salary_da",
    "salary_total",
    "ctc_per_month",
    "ctc_per_anum",
    "transport_allowances",
    "medical_allowances",
    "children_allowances",
    "special_allowances",
    "project_allowances",
    "charge_allowances",
    "uniform_allowance",
    "employee_pf",
    "accident_insurance_premium",
    "sodexo_food_voucher",
    "vehicle_fuel_allowances",
    "vehicle_allowances",
    "books_journals",
    "telephone_allowances",
    "helper_allowance"
];




const steps = ['Import Excel', 'Uploads Salary'];


const ImportSalary = () => {

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

            const columns = Object.keys(extractedData && extractedData[0]); // Get existing field names
            const missingFields = REQUIRED_FIELDS.filter(field => !columns.includes(field)); // Find missing fields
            if (missingFields.length) {
                return toast.warn(`Missing required fields: ${missingFields.join(", ")}`);
            }
        }

        // if (activeStep === 1) {

        //     const hasErrors = hasEmptyRequiredFields(selectedOptions)

        //     if (hasErrors) {
        //         return toast.warn('Please Map the Required Headers');
        //     }

        //     handleSaveMappings()
        // }

        if (activeStep === 1) {
            
            if (!selectedOption) {
                return toast.warn("Please Choose the Job type");
            }
            if (!file) {
                return toast.warn("Please Choose the File")
            }

            try {

                let updatedData = extractedData && extractedData?.map((record) => {
                    const filteredRecord = { ...record }; // Create a copy of the record
                    delete filteredRecord.id; // Remove the 'id' key
                    delete filteredRecord.Sno; // Remove the 'Sno' key
                    return filteredRecord;
                });

                let Payloads = {
                    "job_type": selectedOption?.value,
                    "employee_salary": updatedData
                }

                const response = await axios.post(`${config.API_URL}importEmployeeSalaryData`, Payloads, apiHeaderToken(config.API_TOKEN))
                
                if (response.status === 200) {
                    toast.success(response?.data?.message);
                    // setProject(null);
                    setSelectedJobOption(null);
                    setSelectedOption(null);
                    setSelectedDesignationValue(null)
                    // setTimeout(() => {
                    //     navigate(`/employee-list?project_id=${project?.value}&project_name=${project?.label}`)
                    // }, 5000)
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

    const importedHeaders = extractedData && extractedData.length > 0 ? Object.keys(extractedData[0]) : [];

    const handleSaveMappings = () => {

        const newMappings = selectedOptions?.map((selected, index) => ({
            importedHeader: importedHeaders[index],
            staticHeader: selected ? selected.value : null,
        }));

        setMappedData(newMappings);

        const updatedData = extractedData?.map((record) => {
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

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleDownload = () => {
        // You can directly reference the file path in the public folder
        const fileUrl = `/emp_salary.xlsx`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'Hrms_Employee_salary_upload_format.xlsx'; // The name of the downloaded file
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
                            <h4>Import Salary</h4>
                        </div>
                        <div className="pagename">
                            <Button variant="primary" type="button" onClick={handleDownload}>
                                Download Format
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

export default ImportSalary;





