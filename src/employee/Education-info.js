import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

export default function Education_info() {
    const [finalResult, setFinalResult] = useState([]);
    const [educationData, setEducationData] = useState([
        { degree: "High School", year: '', marks: '' },
        { degree: "Intermediate", year: '', marks: '' },
        { degree: "Graduation", year: '', marks: '' },
        { degree: "Post Graduation", year: '', marks: '' },
    ]);

    const [certifications, setCertifications] = useState([
        { id: 0, degree: '', marks: '', year: '' },
    ]);

    const handleEducationInputChange = (e, index, field) => {
        const updatedEducationData = [...educationData];
        updatedEducationData[index][field] = e.target.value;
        setEducationData(updatedEducationData);
    };

    const handleCertificationInputChange = (e, index, field) => {
        const updatedCertifications = [...certifications];
        updatedCertifications[index][field] = e.target.value;
        setCertifications(updatedCertifications);
    };

    const handleAddCertification = () => {
        setCertifications([...certifications, { id: certifications.length, degree: '', marks: '', year: '' }]);
    };

    const handleRemoveCertification = (id) => {
        setCertifications(certifications.filter((cert) => cert.id !== id));
    };

    // Merge educationData and certifications into finalResult
    useEffect(() => {
        const combinedData = [
            ...educationData.map(({ degree, marks, year }) => ({ degree, marks, year })),
            ...certifications.map(({ degree, marks, year }) => ({ degree, marks, year })),
        ];
        setFinalResult(combinedData);
        // console.log('Final Result:', combinedData);
    }, [educationData, certifications]);
    console.log(finalResult)
    return (
        <>
            {/* Education Information */}
            <div className="row mt-3 gy-3 align-items-center" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-5">
                    <Form>
                        <Form.Group className="mb-4" controlId="highSchool">
                            <Form.Label>High School Percentage & Passing Year</Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="hidden"
                                    name="degree"
                                    value={educationData[0].degree}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="90"
                                    value={educationData[0].marks}
                                    onChange={(e) => handleEducationInputChange(e, 0, 'marks')}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="2000"
                                    value={educationData[0].year}
                                    onChange={(e) => handleEducationInputChange(e, 0, 'year')}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mt-1" controlId="graduation">
                            <Form.Label>Graduation Percentage & Passing Year</Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="hidden"
                                    name="degree"
                                    value={educationData[2].degree}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="80"
                                    value={educationData[2].marks}
                                    onChange={(e) => handleEducationInputChange(e, 2, 'marks')}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="2005"
                                    value={educationData[2].year}
                                    onChange={(e) => handleEducationInputChange(e, 2, 'year')}
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </div>
                <div className="col-5">
                    <Form>
                        <Form.Group className="mb-4" controlId="intermediate">
                            <Form.Label>Intermediate Percentage & Passing Year</Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="hidden"
                                    name="degree"
                                    value={educationData[1].degree}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="98"
                                    value={educationData[1].marks}
                                    onChange={(e) => handleEducationInputChange(e, 1, 'marks')}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="2002"
                                    value={educationData[1].year}
                                    onChange={(e) => handleEducationInputChange(e, 1, 'year')}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mt-1" controlId="postGraduation">
                            <Form.Label>Post Graduation Percentage & Passing Year</Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Control
                                    type="hidden"
                                    name="degree"
                                    value={educationData[3].degree}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="N/A"
                                    value={educationData[3].marks}
                                    onChange={(e) => handleEducationInputChange(e, 3, 'marks')}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="N/A"
                                    value={educationData[3].year}
                                    onChange={(e) => handleEducationInputChange(e, 3, 'year')}
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </div>
            </div>

            {/* Certification Information */}
            <div className="certifications_row gy-3">
                <h4 className="text-start my-4">Other Certifications</h4>
                {certifications.map((cert, index) => (
                    <div className={`row mb-4 certificationblock-${cert.id}`} key={cert.id}>
                        <div className="col-5">
                            <Form.Group controlId={`certificationName-${cert.id}`}>
                                <Form.Label>Certification Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Excel Certification"
                                    value={cert.degree}
                                    onChange={(e) => handleCertificationInputChange(e, index, 'degree')}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-5">
                            <div className="d-flex flex-row gap-4 align-items-end">
                                <div>
                                    <Form.Label>Grade</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="70.12"
                                        value={cert.marks}
                                        onChange={(e) => handleCertificationInputChange(e, index, 'marks')}
                                    />
                                </div>
                                <div>
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="2022"
                                        value={cert.year}
                                        onChange={(e) => handleCertificationInputChange(e, index, 'year')}
                                    />
                                </div>
                            </div>
                        </div>
                        <button className='subtbtn' type='button' onClick={() => handleRemoveCertification(cert.id)}>-</button>
                    </div>
                ))}
                <button className='addbtn' type='button' onClick={handleAddCertification}>+</button>
            </div>
        </>
    );
}
