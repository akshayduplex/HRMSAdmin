import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { JsonDataParsed } from "../slices/ImportCandidateSlice/ImportCandidate";
import { FaCheckCircle } from 'react-icons/fa'; // For checkmark icon

// Static header options
const options = [
    { value: "Sno", label: "Sno" },
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "designation", label: "Designation" },
    { value: "mobile_no", label: "Mobile No" },
    { value: "total_experience", label: "Total Experience" },
    { value: "relevant_experience", label: "Relevant Experience" },
    { value: "location", label: "Location" },
    { value: "current_ctc", label: "Current CTC" },
    { value: "expected_ctc", label: "Expected CTC" },
    { value: "notice_period", label: "Notice Period" },
    { value: "department", label: "Department" },
    { value: "current_employer", label: "Current Employer" },
    { value: "current_employer_mobile", label: "Current Employer Mobile" },
    { value: "current_employer_email", label: "Current Employer Email" },
    { value: "last_working_day", label: "Last Working Day" },
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

    // const availableOptions = options.filter(
    //     (opt) => !selectedOptions.some((selected) => selected && selected.value === opt.value)
    // );

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
