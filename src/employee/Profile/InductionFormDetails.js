import React, { useState, useRef } from "react";
import { Accordion, Button, Form, Spinner, Table } from "react-bootstrap";
import { FaEye } from "react-icons/fa6";
import { BiPencil } from 'react-icons/bi';
import config from "../../config/config";
import { toast } from "react-toastify";
import axios from "axios";
import { apiHeaderTokenMultiPart } from "../../config/api_header";


const InductionFromDetails = ({ handleImageClick, employeeDoc, setEdit, getEmployeeListFun }) => {

    const [documentName, setDocumentName] = useState('')
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    let JoiningKits = employeeDoc && employeeDoc?.induction_physical_form_docs;
    let data = (employeeDoc && employeeDoc?.induction_form_data) || {}



    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!documentName) {
            return toast.warn('Please Enter the Document Name')
        }
        if (!file) {
            return toast.warn('Please Choose the File')
        }

        const formData = new FormData()
        // {"employee_doc_id":"66c03f16a7361b6a0dca0fe6","filename":"Browse File","document_name":""}
        formData.append('employee_doc_id', employeeDoc?._id)
        formData.append('filename', file)
        formData.append('document_name', documentName)
        setLoading(true)
        axios.post(`${config.API_URL}uploadEmployeePhysicalInductionForm`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data?.message)
                    getEmployeeListFun();
                    setFile(null)
                    setDocumentName('')
                    if (fileInputRef.current) {
                        fileInputRef.current.value = null;
                    }
                } else {
                    toast.error(response.data?.message)
                }
                setLoading(false)
            })
            .catch((err) => {
                toast.error(err?.response.data?.message)
                setLoading(false)
            })
    }

    return (
        <>
            <div className="InductionForm">
                <div className='row'>
                    <div className='sitecard'>

                        <Accordion defaultActiveKey={'1'}>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <p><strong>Induction Form Details</strong></p>
                                    {/* <Button className="makeEditButton" onClick={setEdit}>
                                        Edit
                                    </Button> */}
                                    <div className="leftMargin">
                                        <BiPencil size={25} onClick={setEdit} />
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="d-flex  flex-wrap">
                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p><strong>Date : </strong>  
                                            <span>{employeeDoc && data.date}</span></p>
                                        </div>
                                        <div className="datafield"  style={{ width: '30%', minWidth: '100px' }}>
                                            <p>   <strong>Duration :  </strong> <span> {data.duration}</span> </p>
                                        </div>
                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p>  <strong>Location :  </strong> <span>{data.location}</span>
                                            </p>
                                        </div>
                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p>  <strong>Name of Facilitators : </strong> {data.name_of_facilitators}</p>
                                        </div>
                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p>    <strong>Venue : </strong> <span>{data.venue}</span></p>
                                        </div>

                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p>   <strong>Participant Name : </strong>  <span>{data.participant_name}</span> </p>
                                        </div>

                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p>  <strong>Participant Designation : </strong>  <span>{data.participant_designation}</span> </p>
                                        </div>

                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p> <strong>Participant Department : </strong> <span>{data.participant_department}</span> </p>
                                        </div>

                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p>   <strong>Date Of Joining : </strong> <span> {data.date_of_joining}</span> </p>
                                        </div>

                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p>    <strong>Participant Employee Code : </strong> <span> {data.employee_code}</span> </p>
                                        </div>

                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                            <p><strong>Participant signature : </strong>  <FaEye onClick={(e) => handleImageClick(`${config.IMAGE_PATH}${data.signature}`)} /></p>
                                        </div>

                                        <div className="datafield" style={{ width: '30%', minWidth: '100px' }}>
                                        </div>

                                        <div className="datafield"style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>Organization:</strong></p>
                                            <hr />
                                        </div>

                                        <div className="datafield p-2" style={{ width: '100%' }}>
                                            <p> <strong>I Was Informed Well In Advance About The Induction Program:</strong></p>
                                            <p><strong>Answer</strong>: <span>{data.organization}</span> </p>
                                        </div>

                                        <div className="datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p> <strong>Facilities:</strong></p>
                                            <hr />
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p> <strong>1. The Ambiance Wan Conductive And Comfortable</strong></p>
                                            <p><strong>Answer</strong>: <span>{data.facilities_option_1}</span> </p>
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>2. Good Training Aids and Audio-visual aids were used:</strong></p>
                                            <p><strong>Answer</strong>: <span>{data.facilities_option_2}</span> </p>
                                        </div>

                                        <div className="datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>Subject And Content:</strong></p>
                                            <hr />
                                        </div>

                                        <div  className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>1. Introduction to Organization (including parent organization), its leadership team , Vision , Mission & Value explained and presented neatly:</strong></p>
                                            <p> <strong>Answer</strong>: <span>{data.subject_content_1}</span></p>
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>2. Current Position of organization , its operational footprints , products & services , donor / partners , was explained and presented neatly</strong></p>
                                            <p> <strong>Answer</strong>: <span>{data.subject_content_2}</span> </p>
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>3. HR norms including leave, Working hours & attendance, Performance Appraisal process , Employee benefits schema & travel policy were explained properly</strong></p>
                                            <p> <strong>Answer</strong>:  <span>{data.subject_content_3}</span> </p>
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                           <p> <strong>4. HRIS (Employee Self Service ) module Introduction and usage explained by the Facilitator properly</strong></p>
                                            <p> <strong>Answer</strong>: <span> {data.subject_content_4}</span> </p>
                                        </div>

                                        <div className="datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>Presentation / Pedagogy</strong></p>
                                            <hr />
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                           <p> <strong>1. The Facilitator/presenter had good presentation and effective teaching skills</strong></p>
                                            <p> <strong>Answer</strong>: <span> {data.presentation_1}</span> </p>
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                           <p> <strong>2. The Facilitator could give value added inputs in additional to the induction content</strong></p>
                                            <p> <strong>Answer</strong>: <span> {data.presentation_2}</span> </p>
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>3. Trainer wan interested and addressed participants concern</strong></p>
                                            <p> <strong>Answer</strong>: {data.presentation_3}</p>
                                        </div>

                                        <div className="datafield" style={{ width: '100%', minWidth: '250px' }}>
                                           <p> <strong>Over All Relevance / Usefulness</strong></p>
                                            <hr />
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                          <p>  <strong>1. This induction is relevant to my current job & use my future growth and learning</strong></p>
                                            <p><strong>Answer</strong>: <span>{data.over_all_usefulness_1}</span></p>
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', minWidth: '250px' }}>
                                           <p> <strong>2. I would recommend this induction to my department personnel</strong> </p>
                                            <p><strong>Answer</strong>:<span> {data.over_all_usefulness_2}</span></p>
                                        </div>

                                        <div className="datafield" style={{ width: '100%', minWidth: '250px' }}>
                                            <p><strong>Others</strong></p>
                                            <hr />
                                        </div>

                                        <div className="p-2  m-2 datafield" style={{ width: '100%', }}>
                                           <p> <strong>1. What changes to the HR Induction training would you suggest? ( including time , value , course , content , facilities , ect. )</strong></p>
                                            <p dangerouslySetInnerHTML={{ __html: data.others_1 }} />
                                        </div>
                                        <div className="p-2 m-2 datafield" style={{ width: '100%', }}>
                                           <p> <strong>2. Comments on the most useful parts of the induction training or areas that need to be extended further</strong> </p>
                                            <p dangerouslySetInnerHTML={{ __html: data.others_2 }} />
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header><p><strong>Upload Physical Induction Document(s)</strong></p></Accordion.Header>
                                <Accordion.Body>
                                    <div className="d-flex justify-content-around flex-wrap">
                                        <Form.Group controlId="documentName">
                                            <Form.Label>Enter Document Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Document Name"
                                                value={documentName}
                                                onChange={(e) => setDocumentName(e.target.value)}
                                                style={{ width: '300px' }}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="fileUpload">
                                            <Form.Label>Choose Document</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".pdf , .jpeg ,.jpg , .png , .docx , .doc" // Acceptable file types
                                                onChange={handleFileChange}
                                                required
                                                style={{ width: '300px', padding: '10px' }}
                                                ref={fileInputRef}
                                            />
                                        </Form.Group>

                                        <div className="" style={{ marginTop: '37px' }}>
                                            <Button
                                                variant="primary"
                                                type="button"
                                                onClick={() => handleUpload('KYC', 'Document')}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column gap-2 mt-5 scroller-content w-100 smalldata infobox">
                                        <Table className="candd_table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center fw-medium">S.No</th>
                                                    <th className="text-center fw-medium">Document Name</th>
                                                    <th className="text-center fw-medium">Document Type</th>
                                                    <th className="text-center fw-medium">Attached Date</th>
                                                    <th className="text-center fw-medium">size</th>
                                                    <th className="text-center fw-medium">View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {JoiningKits && JoiningKits.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6">No documents available</td>
                                                    </tr>
                                                ) : (
                                                    JoiningKits?.map((doc, index) => (
                                                        <tr key={doc.id || index}>
                                                            <td>{index + 1}</td>
                                                            <td>{doc.document_name || "N/A"}</td>
                                                            <td>{doc.mime_type || "N/A"}</td>
                                                            <td>{new Date(doc.add_date).toLocaleDateString()}</td>
                                                            <td>{doc.file_size || "N/A"}</td>
                                                            <td>
                                                                <FaEye onClick={(e) => handleImageClick(`${config.IMAGE_PATH}${doc?.file_name}`)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>





                    </div>
                </div>
            </div>
        </>
    )
}

export default InductionFromDetails