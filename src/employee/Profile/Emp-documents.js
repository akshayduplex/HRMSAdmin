import React, { useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import "./test.css"; // Custom CSS file
import { FaTrash } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../../config/api_header";
import { toast } from "react-toastify";
import InductionForm from "./InDuctionTraningFeedBackForm";
import ReferenceForm from "./ReferenceForm";
import InductionFromDetails from "./InductionFormDetails";
import ReferenceDetailsPage from "./ReferenceDetailsPage";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";


const tabStyle = {
    width: "500px", // Set the desired width for all tabs
    // height: '50px',    // Set the desired height for all tabs
    textAlign: "center",
    // padding: '10px',
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#f1f1f1", // Light gray background for unselected tab
    borderRadius: "5px", // Slight border-radius
    // margin: '0 5px', // Margin between tabs
};

const activeTabStyle = {
    ...tabStyle,
    // backgroundColor: 'green',
    color: "white",
};


export default function Emp_document({ employeeDoc, getEmployeeListFun }) {
    const [activeTab, setActiveTab] = useState("KYC");
    const [InductionEditable, setInductionEditable] = useState(false);
    const loginData = JSON.parse(localStorage.getItem('admin_role_user')) || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docUrl, setDocUrl] = useState('');
    const fileInputRef = useRef(null);
    const [showReferralDetails, setShowReferralDetails] = useState(false);


    const [documentName, setDocumentName] = useState('');
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');


    useEffect(() => {
        if (activeTab) {
            setFileUrl(null);
            setFile(null)
            setDocumentName('')
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        }
    }, [activeTab])

    useEffect(() => {
        if (employeeDoc && employeeDoc?.induction_form_status === "Complete") {
            setInductionEditable(true)
        }
        if (employeeDoc && employeeDoc?.reference_check_form_status === "Complete") {
            setShowReferralDetails(true)
        }
    }, [employeeDoc])

    const setEdit = () => {
        setInductionEditable(false)
    }

    const setReferenceFormEdit = () => {
        if (showReferralDetails) {
            setShowReferralDetails(false);
        } else {
            setShowReferralDetails(true);
        }
    }

    const setNotEdit = () => {

        setInductionEditable(true)
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile); // Create a URL for the selected file
            setFileUrl(url); // Set the file URL for preview
        }
    };

    const handleImageClick = (url) => {
        // alert(url);
        setDocUrl(url);
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const filteredDocs = employeeDoc?.docs?.filter(
        (doc) => doc.doc_category === activeTab
    );

    const JoiningKits = employeeDoc?.joining_kit_docs;

    const [loading, setLoading] = useState({
        label: '',
        status: false,
    });


    /******************** Handle Uploads File With the Multiple ************/

    const handleUpload = async (type, sub_doc_category, IsSignature = null) => {
        const formData = new FormData();

        if (!file) {
            return toast.warn("Please Choose The File");
        }
        if (!documentName && activeTab !== 'Signature') {
            return toast.warn("Please Enter the Document Name");
        }

        formData.append("filename", file);
        formData.append("_id", employeeDoc?._id);
        formData.append("doc_category", type);
        formData.append("sub_doc_category", sub_doc_category);
        formData.append("doc_name", activeTab === 'Signature' ? 'Signature' : documentName);
        formData.append("added_by_name", loginData?.name);
        formData.append("add_by_email", loginData?.email);
        formData.append("add_by_mobile", loginData?.mobile_no);
        formData.append("add_by_designation", loginData?.designation);

        try {
            setLoading({
                label: documentName,
                status: true
            });
            let response = await axios.post(`${config.API_URL}${IsSignature ? "uploadEmployeeSignature" : "uploadEmployeeKycDocs"}`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response.data?.message)
                getEmployeeListFun();
                setFileUrl(null);
                setFile(null)
                setDocumentName('')
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            } else {
                toast.error(response.data?.message || "Something went wrong")
            }
            setLoading({
                label: '',
                status: false
            });
        } catch (error) {
            console.error(`Upload failed for ${type}`, error);
            toast.error(error?.response?.data?.message || error?.message || 'Something Went Wrong')
            setLoading({
                label: '',
                status: false
            });
        }
    };

    const HandleJoiningKits = async (url) => {
        const formData = new FormData();

        if (!file) {
            return toast.warn("Please Choose The File");
        }
        if (!documentName) {
            return toast.warn("Please Enter the Document Name");
        }

        formData.append("filename", file);
        formData.append("employee_doc_id", employeeDoc?._id);
        formData.append("document_name", documentName);
        formData.append("add_by_name", loginData?.name);
        formData.append("add_by_email", loginData?.email);
        formData.append("add_by_mobile", loginData?.mobile_no);
        formData.append("add_by_designation", loginData?.designation);

        try {
            setLoading({
                label: documentName,
                status: true
            });
            let response = await axios.post(`${config.API_URL}${url}`, formData, apiHeaderTokenMultiPart(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response.data?.message)
                getEmployeeListFun();
                setFileUrl(null);
                setFile(null)
                setDocumentName('')
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            } else {
                toast.error(response.data?.message)
            }
            setLoading({
                label: '',
                status: false
            });
        } catch (error) {
            console.error(error?.response?.data?.message || 'Something Went Wrong');
            toast.error(error?.response?.data?.message || error?.message || 'Something Went Wrong')
            setLoading({
                label: '',
                status: false
            });
        }
    }

    const [deleteLoading, setDeleteLoading] = useState(null);


    const handleDelete = async (document, doctype) => {
        try {

            let payloads = {
                "employee_doc_id": employeeDoc?._id,
                "onboard_doc_id": document?._id,
                "doc_type": doctype
            }

            setDeleteLoading(document?._id)

            let response = await axios.post(`${config.API_URL}deleteEmployeeDocuments`, payloads, apiHeaderToken(config.API_TOKEN));

            if (response.status === 200) {
                toast.success(response.data?.message)
                getEmployeeListFun();
            } else {
                toast.error(response.data?.message)
            }

        } catch (error) {
            console.error(error?.response?.data?.message || 'Something Went Wrong');
            toast.error(error?.response?.data?.message || error?.message || 'Something Went Wrong')
        } finally {
            setDeleteLoading(null)
        }
    }


    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pr-0 h-100 ps-0 pt-4">
                        <div className="d-flex flex-column justify-content-around ">
                            {/* Tabs for document categories */}
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(tab) => setActiveTab(tab)}
                                className="mb-3"
                            >
                                <Tab
                                    eventKey="KYC"
                                    title="KYC Document(s)"
                                    style={activeTab === "KYC" ? activeTabStyle : tabStyle}
                                />
                                <Tab
                                    eventKey="Educational"
                                    title="Educational Document(s)"
                                    style={
                                        activeTab === "Educational" ? activeTabStyle : tabStyle
                                    }
                                />
                                <Tab
                                    eventKey="Experience"
                                    title="Experience Certificate(s)"
                                    style={activeTab === "Experience" ? activeTabStyle : tabStyle}
                                />
                                <Tab
                                    eventKey="Bank Cheque"
                                    title="Bank Cheque"
                                    style={activeTab === "Bank Cheque" ? activeTabStyle : tabStyle}
                                />
                                <Tab
                                    eventKey="Signature"
                                    title="Signature"
                                    style={activeTab === "Signature" ? activeTabStyle : tabStyle}
                                />
                                <Tab
                                    eventKey="joining"
                                    title="Joining Kit"
                                    style={activeTab === "joining" ? activeTabStyle : tabStyle}
                                />
                                <Tab
                                    eventKey="offer"
                                    title="Offer Latter"
                                    style={activeTab === "offer" ? activeTabStyle : tabStyle}
                                />
                                <Tab
                                    eventKey="appointment"
                                    title="Appointment Latter"
                                    style={activeTab === "appointment" ? activeTabStyle : tabStyle}
                                />
                                <Tab
                                    eventKey="Induction"
                                    title="Induction Form"
                                    style={activeTab === "Induction" ? activeTabStyle : tabStyle}
                                />
                                <Tab
                                    eventKey="Reference"
                                    title="Reference Form"
                                    style={activeTab === "Reference" ? activeTabStyle : tabStyle}
                                />
                            </Tabs>

                            {/* Tab Panels */}
                            <div className="tab-content">
                                {activeTab === "KYC" && (
                                    <div className="d-flex justify-content-around flex-wrap mb-5">
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
                                                accept=".pdf, .doc, .jpeg , jpg , docx" // Acceptable file types
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
                                                disabled={loading.status}
                                            >
                                                {loading.status ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Educational" && (
                                    <div className="d-flex justify-content-around flex-wrap mb-5">
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
                                                accept=".pdf, .doc, .jpeg , jpg , docx" // Acceptable file types
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
                                                onClick={() => handleUpload('Educational', 'Marksheet')}
                                                disabled={loading.status}
                                            >
                                                {loading.status ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Experience" && (
                                    <div className="d-flex justify-content-around flex-wrap mb-5">
                                        <Form.Group controlId="documentName">
                                            <Form.Label>Enter Document Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Document Name"
                                                value={documentName}
                                                onChange={(e) => setDocumentName(e.target.value)}
                                                required
                                                style={{ width: '300px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="fileUpload">
                                            <Form.Label>Choose Document</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".pdf, .doc, .jpeg , jpg , docx" // Acceptable file types
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
                                                onClick={() => handleUpload('Experience', 'Letter')}
                                                disabled={loading.status}
                                            >
                                                {loading.status ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {/* Bank check Tab(s) */}
                                {activeTab === "Bank Cheque" && (
                                    <div className="d-flex justify-content-around flex-wrap mb-5">
                                        <Form.Group controlId="documentName">
                                            <Form.Label>Enter Document Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Document Name"
                                                value={documentName}
                                                onChange={(e) => setDocumentName(e.target.value)}
                                                required
                                                style={{ width: '300px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="fileUpload">
                                            <Form.Label>Choose Document</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".pdf, .doc, .jpeg , jpg , docx" // Acceptable file types
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
                                                onClick={() => handleUpload('Bank Cheque', 'Bank Cheque')}
                                                disabled={loading.status}
                                            >
                                                {loading.status ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Uplods Emp Signature */}
                                {activeTab === "Signature" && (
                                    <div className="d-flex justify-content-around flex-wrap mb-5">
                                        <Form.Group controlId="fileUpload">
                                            <Form.Label>Choose Signature Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".png, .jpeg , jpg" // Acceptable file types
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
                                                onClick={() => handleUpload('Signature', 'Signature', 'yes')}
                                                disabled={loading.status}
                                            >
                                                {loading.status ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}


                                {activeTab === "joining" && (
                                    <div className="d-flex justify-content-around flex-wrap mb-5">
                                        <Form.Group controlId="documentName">
                                            <Form.Label>Enter Document Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Document Name"
                                                value={documentName}
                                                onChange={(e) => setDocumentName(e.target.value)}
                                                required
                                                style={{ width: '300px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="fileUpload">
                                            <Form.Label>Choose Document</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".pdf, .doc, .jpeg , jpg , docx" // Acceptable file types
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
                                                onClick={() => HandleJoiningKits("uploadEmployeeJoiningKit")}
                                                disabled={loading.status}
                                            >
                                                {loading.status ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "offer" && (
                                    <div className="d-flex justify-content-around flex-wrap mb-5">
                                        <Form.Group controlId="documentName">
                                            <Form.Label>Enter Document Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Document Name"
                                                value={documentName}
                                                onChange={(e) => setDocumentName(e.target.value)}
                                                required
                                                style={{ width: '300px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="fileUpload">
                                            <Form.Label>Choose Document</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".pdf, .doc, .jpeg , jpg" // Acceptable file types
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
                                                onClick={() => HandleJoiningKits("uploadEmployeeOfferLetter")}
                                                disabled={loading.status}
                                            >
                                                {loading.status ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "appointment" && (
                                    <div className="d-flex justify-content-around flex-wrap mb-5">
                                        <Form.Group controlId="documentName">
                                            <Form.Label>Enter Document Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Document Name"
                                                value={documentName}
                                                onChange={(e) => setDocumentName(e.target.value)}
                                                required
                                                style={{ width: '300px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="fileUpload">
                                            <Form.Label>Choose Document</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".pdf, .doc, .jpeg , jpg" // Acceptable file types
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
                                                onClick={() => HandleJoiningKits("uploadEmployeeAppointmentLetter")}
                                                disabled={loading.status}
                                            >
                                                {loading.status ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" /> Uploading...
                                                    </>
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {
                                    activeTab === 'Induction' &&
                                    (
                                        <div className="d-flex flex-wrap mb-5">
                                            {
                                                InductionEditable ?
                                                    <InductionFromDetails handleImageClick={handleImageClick} employeeDoc={employeeDoc} setEdit={setEdit} getEmployeeListFun={getEmployeeListFun} /> :
                                                    <InductionForm employeeDoc={employeeDoc} setNotEdit={setNotEdit} getEmployeeListFun={getEmployeeListFun} />
                                            }
                                        </div>
                                    )
                                }

                                {
                                    activeTab === 'Reference' &&
                                    (
                                        <div className="d-flex flex-wrap mb-5">
                                            {
                                                showReferralDetails ?
                                                    <ReferenceDetailsPage employeeDoc={employeeDoc} setReferenceFormEdit={setReferenceFormEdit} /> :
                                                    <ReferenceForm employeeDoc={employeeDoc} setReferenceFormEdit={setReferenceFormEdit} getEmployeeListFun={getEmployeeListFun} />
                                            }
                                        </div>
                                    )
                                }

                            </div>

                            {/* Document Table */}
                            {
                                activeTab !== 'Induction' && activeTab !== 'joining' && activeTab !== 'Reference' && activeTab !== 'offer' && activeTab !== 'appointment' &&
                                (
                                    <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100 smalldata infobox">
                                        <Table className="candd_table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center fw-medium">S.No</th>
                                                    <th className="text-center fw-medium">Document Name</th>
                                                    <th className="text-center fw-medium">Category</th>
                                                    <th className="text-center fw-medium">Attached Date</th>
                                                    <th className="text-center fw-medium">View</th>
                                                    <th className="text-center fw-medium">Verified By</th>
                                                    <th className="text-center fw-medium">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredDocs && filteredDocs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6">No documents available</td>
                                                    </tr>
                                                ) : (
                                                    filteredDocs?.map((doc, index) => (
                                                        <tr key={doc.id || index}>
                                                            <td>{index + 1}</td>
                                                            <td>{doc.doc_name || "N/A"}</td>
                                                            <td>{doc.doc_category || "N/A"}</td>
                                                            <td>{new Date(doc.add_date).toLocaleDateString()}</td>
                                                            <td>
                                                                {/\.(jpe?g|png)$/i.test(doc?.file_name) ? (
                                                                    <img
                                                                        src={`${doc?.doc_category === "Signature" ? config.IMAGE_PATH : config.IMAGE_PATH_EMP}${doc?.file_name}`}
                                                                        alt="Document Preview"
                                                                        style={{ width: "100px", height: "auto", cursor: "pointer" }}
                                                                        onClick={() =>
                                                                            handleImageClick(
                                                                                `${doc?.doc_category === "Signature" ? config.IMAGE_PATH : config.IMAGE_PATH_EMP}${doc?.file_name}`
                                                                            )
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Tooltip
                                                                        title="View Document"
                                                                        arrow
                                                                        placement="top"
                                                                        componentsProps={{
                                                                            tooltip: {
                                                                                sx: {
                                                                                    backgroundColor: '#1976d2',
                                                                                    color: '#fff',
                                                                                    fontSize: '0.875rem',
                                                                                },
                                                                            },
                                                                            arrow: {
                                                                                sx: {
                                                                                    color: '#1976d2',
                                                                                },
                                                                            },
                                                                        }}
                                                                    >
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                handleImageClick(`${config.IMAGE_PATH_EMP}${doc?.file_name}`)
                                                                            }
                                                                            size="small"
                                                                            sx={{
                                                                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' },
                                                                            }}
                                                                        >
                                                                            <FaEye style={{ color: '#1976d2' }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </td>
                                                            <td>{doc?.added_by || "N/A"}</td>
                                                            <td>
                                                                {
                                                                    deleteLoading === doc?._id ?
                                                                        <CircularProgress style={{ color: 'red' }} />
                                                                        : <Tooltip
                                                                            title="Delete Document"
                                                                            arrow
                                                                            placement="top"
                                                                            componentsProps={{
                                                                                tooltip: {
                                                                                    sx: {
                                                                                        backgroundColor: '#d32f2f',
                                                                                        color: '#fff',
                                                                                        fontSize: '0.875rem',
                                                                                    },
                                                                                },
                                                                                arrow: {
                                                                                    sx: {
                                                                                        color: '#d32f2f',
                                                                                    },
                                                                                },
                                                                            }}
                                                                        >
                                                                            <IconButton
                                                                                onClick={() => handleDelete(doc, 'docs')}
                                                                                size="small"
                                                                                sx={{
                                                                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                                                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' },
                                                                                    marginLeft: '8px',
                                                                                }}
                                                                            >
                                                                                <FaTrash style={{ color: '#d32f2f' }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                }</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )
                            }

                            {
                                activeTab === 'joining' &&
                                (
                                    <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100 smalldata infobox">
                                        <Table className="candd_table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center fw-medium">S.No</th>
                                                    <th className="text-center fw-medium">Document Name</th>
                                                    <th className="text-center fw-medium">Document Type</th>
                                                    <th className="text-center fw-medium">Attached Date</th>
                                                    <th className="text-center fw-medium">Uploaded By</th>
                                                    <th className="text-center fw-medium">Verified  By</th>
                                                    <th className="text-center fw-medium">Actions</th>
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
                                                            <td>
                                                                <div className="d-grid gap-1">
                                                                    <span>{doc.added_by?.name || "N/A"}</span>
                                                                    <span>{doc.added_by?.mobile || "N/A"} , {doc.added_by?.email || "N/A"}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-grid gap-1">
                                                                    <span>{doc.added_by?.name || "N/A"}</span>
                                                                    <span>{doc.added_by?.mobile || "N/A"} , {doc.added_by?.email || "N/A"}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {/* View Icon with Tooltip */}
                                                                <Tooltip
                                                                    title="View Document"
                                                                    arrow
                                                                    placement="top"
                                                                    componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                backgroundColor: '#1976d2',
                                                                                color: '#fff',
                                                                                fontSize: '0.875rem',
                                                                            },
                                                                        },
                                                                        arrow: {
                                                                            sx: {
                                                                                color: '#1976d2',
                                                                            },
                                                                        },
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        onClick={() => handleImageClick(`${config.IMAGE_PATH_EMP}${doc?.file_name}`)}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                                            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' },
                                                                        }}
                                                                    >
                                                                        <FaEye style={{ color: '#1976d2' }} />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                {/* Delete Icon with Tooltip */}
                                                                {
                                                                    deleteLoading === doc?._id ?
                                                                        <CircularProgress style={{ color: 'red' }} />
                                                                        : <Tooltip
                                                                            title="Delete Document"
                                                                            arrow
                                                                            placement="top"
                                                                            componentsProps={{
                                                                                tooltip: {
                                                                                    sx: {
                                                                                        backgroundColor: '#d32f2f',
                                                                                        color: '#fff',
                                                                                        fontSize: '0.875rem',
                                                                                    },
                                                                                },
                                                                                arrow: {
                                                                                    sx: {
                                                                                        color: '#d32f2f',
                                                                                    },
                                                                                },
                                                                            }}
                                                                        >
                                                                            <IconButton
                                                                                onClick={() => handleDelete(doc, 'joining_kit_docs')}
                                                                                size="small"
                                                                                sx={{
                                                                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                                                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' },
                                                                                    marginLeft: '8px',
                                                                                }}
                                                                            >
                                                                                <FaTrash style={{ color: '#d32f2f' }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                )
                            }
                            {
                                activeTab === 'offer' &&
                                (
                                    <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100 smalldata infobox">
                                        <Table className="candd_table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center fw-medium">S.No</th>
                                                    <th className="text-center fw-medium">Document Name</th>
                                                    <th className="text-center fw-medium">Document Type</th>
                                                    <th className="text-center fw-medium">Attached Date</th>
                                                    <th className="text-center fw-medium">Uploaded By</th>
                                                    <th className="text-center fw-medium">Verified  By</th>
                                                    <th className="text-center fw-medium">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeDoc && employeeDoc?.offer_letter_docs && employeeDoc?.offer_letter_docs?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6">No documents available</td>
                                                    </tr>
                                                ) : (
                                                    employeeDoc?.offer_letter_docs?.map((doc, index) => (
                                                        <tr key={doc.id || index}>
                                                            <td>{index + 1}</td>
                                                            <td>{doc.document_name || "N/A"}</td>
                                                            <td>{doc.mime_type || "N/A"}</td>
                                                            <td>{new Date(doc.add_date).toLocaleDateString()}</td>
                                                            <td>
                                                                <div className="d-grid gap-1">
                                                                    <span>{doc.added_by?.name || "N/A"}</span>
                                                                    <span>{doc.added_by?.mobile || "N/A"} , {doc.added_by?.email || "N/A"}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-grid gap-1">
                                                                    <span>{doc.added_by?.name || "N/A"}</span>
                                                                    <span>{doc.added_by?.mobile || "N/A"} , {doc.added_by?.email || "N/A"}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {/* View Icon with Tooltip */}
                                                                <Tooltip
                                                                    title="View Document"
                                                                    arrow
                                                                    placement="top"
                                                                    componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                backgroundColor: '#1976d2',
                                                                                color: '#fff',
                                                                                fontSize: '0.875rem',
                                                                            },
                                                                        },
                                                                        arrow: {
                                                                            sx: {
                                                                                color: '#1976d2',
                                                                            },
                                                                        },
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        onClick={() => handleImageClick(`${config.IMAGE_PATH_EMP}${doc?.file_name}`)}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                                            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' },
                                                                        }}
                                                                    >
                                                                        <FaEye style={{ color: '#1976d2' }} />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                {/* Delete Icon with Tooltip */}

                                                                {
                                                                    deleteLoading === doc?._id ?
                                                                        <CircularProgress style={{ color: 'red' }} />
                                                                        : <Tooltip
                                                                            title="Delete Document"
                                                                            arrow
                                                                            placement="top"
                                                                            componentsProps={{
                                                                                tooltip: {
                                                                                    sx: {
                                                                                        backgroundColor: '#d32f2f',
                                                                                        color: '#fff',
                                                                                        fontSize: '0.875rem',
                                                                                    },
                                                                                },
                                                                                arrow: {
                                                                                    sx: {
                                                                                        color: '#d32f2f',
                                                                                    },
                                                                                },
                                                                            }}
                                                                        >
                                                                            <IconButton
                                                                                onClick={() => handleDelete(doc, 'offer_letter_docs')}
                                                                                size="small"
                                                                                sx={{
                                                                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                                                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' },
                                                                                    marginLeft: '8px',
                                                                                }}
                                                                            >
                                                                                <FaTrash style={{ color: '#d32f2f' }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                }
                                                            </td>

                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )
                            }
                            {
                                activeTab === 'appointment' &&
                                (
                                    <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100 smalldata infobox">
                                        <Table className="candd_table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center fw-medium">S.No</th>
                                                    <th className="text-center fw-medium">Document Name</th>
                                                    <th className="text-center fw-medium">Document Type</th>
                                                    <th className="text-center fw-medium">Attached Date</th>
                                                    <th className="text-center fw-medium">Uploaded By</th>
                                                    <th className="text-center fw-medium">Verified By</th>
                                                    <th className="text-center fw-medium">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeDoc && employeeDoc?.appointment_letter_docs && employeeDoc?.appointment_letter_docs?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6">No documents available</td>
                                                    </tr>
                                                ) : (
                                                    employeeDoc?.appointment_letter_docs?.map((doc, index) => (
                                                        <tr key={doc.id || index}>
                                                            <td>{index + 1}</td>
                                                            <td>{doc.document_name || "N/A"}</td>
                                                            <td>{doc.mime_type || "N/A"}</td>
                                                            <td>{new Date(doc.add_date).toLocaleDateString()}</td>
                                                            <td>
                                                                <div className="d-grid gap-1">
                                                                    <span>{doc.added_by?.name || "N/A"}</span>
                                                                    <span>{doc.added_by?.mobile || "N/A"} , {doc.added_by?.email || "N/A"}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-grid gap-1">
                                                                    <span>{doc.added_by?.name || "N/A"}</span>
                                                                    <span>{doc.added_by?.mobile || "N/A"} , {doc.added_by?.email || "N/A"}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {/* View Icon with Tooltip */}
                                                                <Tooltip
                                                                    title="View Document"
                                                                    arrow
                                                                    placement="top"
                                                                    componentsProps={{
                                                                        tooltip: {
                                                                            sx: {
                                                                                backgroundColor: '#1976d2',
                                                                                color: '#fff',
                                                                                fontSize: '0.875rem',
                                                                            },
                                                                        },
                                                                        arrow: {
                                                                            sx: {
                                                                                color: '#1976d2',
                                                                            },
                                                                        },
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        onClick={() => handleImageClick(`${config.IMAGE_PATH_EMP}${doc?.file_name}`)}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                                            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' },
                                                                        }}
                                                                    >
                                                                        <FaEye style={{ color: '#1976d2' }} />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                {/* Delete Icon with Tooltip */}
                                                                {
                                                                    deleteLoading === doc?._id ?
                                                                        <CircularProgress style={{ color: 'red' }} />
                                                                        :
                                                                        <Tooltip
                                                                            title="Delete Document"
                                                                            arrow
                                                                            placement="top"
                                                                            componentsProps={{
                                                                                tooltip: {
                                                                                    sx: {
                                                                                        backgroundColor: '#d32f2f',
                                                                                        color: '#fff',
                                                                                        fontSize: '0.875rem',
                                                                                    },
                                                                                },
                                                                                arrow: {
                                                                                    sx: {
                                                                                        color: '#d32f2f',
                                                                                    },
                                                                                },
                                                                            }}
                                                                        >
                                                                            <IconButton
                                                                                onClick={() => handleDelete(doc, 'appointment_letter_docs')}
                                                                                size="small"
                                                                                sx={{
                                                                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                                                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' },
                                                                                    marginLeft: '8px',
                                                                                }}
                                                                            >
                                                                                <FaTrash style={{ color: '#d32f2f' }} />
                                                                            </IconButton>
                                                                        </Tooltip>

                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>

            {/* Display the iframe if a document URL is set */}
            <Modal show={isModalOpen} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Document Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: '300px', overflow: 'auto' }}>
                        {docUrl && docUrl.split('.').pop().toLowerCase() === 'pdf' ? (
                            <iframe
                                src={docUrl}
                                title="PDF Preview"
                                style={{ width: '100%', height: '100%' }}
                                frameBorder="0"
                            />
                        ) : docUrl && (docUrl.split('.').pop().toLowerCase() === 'docx' || docUrl.split('.').pop().toLowerCase() === 'doc') ? (
                            <div style={{ textAlign: 'center' }}>
                                <iframe
                                    src={`https://docs.google.com/gview?url=${docUrl}&embedded=true`}
                                    style={{ width: '100%', height: '500px' }}
                                    frameBorder="0"
                                    title="Doc Review"
                                ></iframe>
                            </div>
                        ) : (
                            <img
                                src={docUrl}
                                alt="Selected"
                                style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                            />
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
