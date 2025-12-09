import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
// import { JsonDataParsed } from "../slices/ImportCandidateSlice/ImportCandidate";
import { FaCheckCircle } from 'react-icons/fa'; // For checkmark icon

// Static header options
const options = [
    { "value": "Sno", "label": "Sno" },
    { "value": "employee_id", "label": "Employee ID" },
    { "value": "employee_name", "label": "Employee Name" },
    { "value": "employee_email", "label": "Employee Email" },
    { "value": "employee_mobile_no", "label": "Employee Mobile No" },
    { "value": "employee_alt_mobile_no", "label": "Employee Alt Mobile No" },
    { "value": "aadhaar_no", "label": "Aadhaar No" },
    { "value": "gender", "label": "Gender" },
    { "value": "date_of_birth", "label": "Date of Birth" },
    { "value": "marital_status", "label": "Marital Status" },
    { "value": "father_name", "label": "Father Name" },
    { "value": "designation", "label": "Designation" },
    { "value": "department_name", "label": "Department Name" },
    { "value": "employee_type", "label": "Employee Type" },
    { "value": "batch_id", "label": "Batch ID" },
    { "value": "education_data", "label": "Education Data" },
    { "value": "joining_date", "label": "Joining Date" },
    { "value": "date_of_leaving", "label": "Date of Leaving" },
    { "value": "probation_complete_date", "label": "Probation Complete Date" },
    { "value": "appraisal_date", "label": "Appraisal Date" },
    { "value": "reason_of_leaving", "label": "Reason of Leaving" },
    { "value": "location", "label": "Location" },
    { "value": "occupation", "label": "Occupation" },
    { "value": "working_days_type", "label": "Working Days Type" },
    { "value": "division", "label": "Division" },
    { "value": "region", "label": "Region" },
    { "value": "grade", "label": "Grade" },
    { "value": "esi_number", "label": "ESI Number" },
    { "value": "esi_dispensary", "label": "ESI Dispensary" },
    { "value": "pf_number", "label": "PF Number" },
    { "value": "pf_effective_from", "label": "PF Effective From" },
    { "value": "uan_number", "label": "UAN Number" },
    { "value": "pan_number", "label": "PAN Number" },
    { "value": "bank_name", "label": "Bank Name" },
    { "value": "bank_account_number", "label": "Bank Account Number" },
    { "value": "bank_branch", "label": "Bank Branch" },
    { "value": "ifsc_code", "label": "IFSC Code" },
    { "value": "bank_account_type", "label": "Bank Account Type" },
    { "value": "present_address", "label": "Present Address" },
    { "value": "permanent_address", "label": "Permanent Address" },
    { "value": "reporting_manager", "label": "Reporting Manager" },
    { "value": "sanctioned_position", "label": "Sanctioned Position" },
    { "value": "project_name", "label": "Project Name" },
    { "value": "kpi_data", "label": "KPI Data" },
    { "value": "kra_data", "label": "KRA Data" },
    { "value": "jd_data", "label": "JD Data" },
    { "value": "total_experience", "label": "Total Experience" },
    { "value": "employee_alt_email", "label": "Employee Alternative Email" }
];

  

const VerifiedContent = ({ selectedOptions , setSelectedOptions , setMappedData , mappedData  }) => {
    const dispatch = useDispatch();
    const { extractedData } = useSelector((state) => state.import);

    useEffect(() => {
        if (extractedData && extractedData.length > 0) {
            const importedHeaders = Object.keys(extractedData[0]);
            const initialSelections = importedHeaders.map((importedHeader) => {
                // Find the matching static option based on label
                const matchedOption = options.find(option => option.value.toLowerCase() === importedHeader.toLowerCase());
                return matchedOption || null; // Return the matched option or null
            });
            setSelectedOptions(initialSelections);
        }
    }, [extractedData]);

    const handleChange = (selected, index) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = selected || null; // Set null if no selection
        setSelectedOptions(newSelectedOptions);
    };

    const importedHeaders = extractedData && extractedData.length > 0 ? Object.keys(extractedData[0]) : [];

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h3>Imported Excel Headers</h3>
                    {importedHeaders.map((header, index) => (
                        <Row key={index} className="mb-2">
                            <Col xs={6}>
                                <div 
                                    style={{
                                        display: "flex", 
                                        alignItems: "center", 
                                        color: selectedOptions[index] ? "green" : "black"
                                    }}
                                >
                                    {selectedOptions[index] && (
                                        <FaCheckCircle style={{ color: 'green', marginRight: '8px' }} />
                                    )}
                                    {header}
                                </div>
                            </Col>
                            <Col xs={6}>
                                <Select
                                    options={options}
                                    onChange={(selected) => handleChange(selected, index)}
                                    value={selectedOptions[index] || null} // Ensure null is passed if no selection
                                    placeholder="Select Static Header"
                                />
                            </Col>
                        </Row>
                    ))}
                    {/* <Button onClick={handleSaveMappings} variant="primary">Save Mappings</Button> */}
                </Col>
            </Row>
        </Container>
    );
};

export default VerifiedContent;
