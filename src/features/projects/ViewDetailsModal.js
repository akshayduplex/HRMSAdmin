import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";

const ViewDetailsModal = ({ show, onHide, projectId }) => {

    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState(null);
    const [projectName, setProjectName] = useState("");

    useEffect(() => {
        if (show && projectId) {
            fetchProjectDetails();
        }
    }, [show, projectId]);

    const fetchProjectDetails = async () => {
        setLoading(true);
        try {
            const payload = { project_id: projectId };

            const res = await axios.post(
                `${config.API_URL}getProjectStatusCount`,
                payload,
                apiHeaderToken(config.API_TOKEN)
            );

            if (res.status === 200) {
                setDetails(res.data.data);
                setProjectName(res.data.data.project_name || "");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatClick = (type, value, status = null) => {
        if (!value || value === 0) return; // Don't redirect if count is 0

        let url = "http://localhost:3000";
        const encodedProjectName = encodeURIComponent(projectName);

        switch (type) {
            case "published_jobs":
                url = `/job-list?project_id=${projectId}&project_name=${encodedProjectName}`;
                break;

            case "approval_notes":
                url = `/candidate-listing?type=approval-total&project_id=${projectId}&project_name=${encodedProjectName}`;
                break;

            case "approval_candidates":
                url = `/candidate-listing?type=approved&project_id=${projectId}&project_name=${encodedProjectName}`;
                break;

            case "total_applied":
                url = `/candidate-listing?type=Applied&project_id=${projectId}&project_name=${encodedProjectName}`;
                break;

            case "shortlisted":
                url = `/candidate-listing?type=Shortlisted&project_id=${projectId}&project_name=${encodedProjectName}`;
                break;

            case "interviews":
                url = `/candidate-listing?type=Interview&project_id=${projectId}&project_name=${encodedProjectName}`;
                break;

            case "offer_letter":
                url = `/candidate-listing?type=Offered&project_id=${projectId}&project_name=${encodedProjectName}`;
                break;

            case "appointment_letter":
                url = `/appointment-approval-hod?type=Pending&project_name=${encodedProjectName}`;
                break;

            default:
                return;
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Helper function to create stat box with click handler
    const StatBox = ({ title, value, type, status = null }) => (
        <div
            className={`stat-box ${value > 0 ? 'clickable-stat' : ''}`}
            onClick={() => handleStatClick(type, value, status)}
            style={{
                cursor: value > 0 ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                padding: '10px',
                borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
                if (value > 0) e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
                if (value > 0) e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            <p className="text-muted mb-1">{title}</p>
            <h4 className={value > 0 ? 'text-primary' : ''}>{value}</h4>
        </div>
    );

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Project Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="py-4 proj_extns">

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                    </div>
                ) : details ? (
                    <>
                        <Row className="mb-4">
                            <Col md={6}>
                                <p className="mb-1 text-muted">Project Name</p>
                                <p className="fw-semibold">{details.project_name}</p>
                            </Col>

                            <Col md={6}>
                                <p className="mb-1 text-muted">Total Designations</p>
                                <p className="fw-semibold">{details.total_designation_status}</p>
                            </Col>
                        </Row>

                        {/* ---- Application Stats ---- */}
                        <h6>Application & Candidate Details</h6>

                        <Row className="g-3 mt-1">
                            <Col md={3}>
                                <StatBox
                                    title="Published Jobs"
                                    value={details.published_jobs}
                                    type="published_jobs"
                                />
                            </Col>

                            <Col md={3}>
                                <StatBox
                                    title="Total Applied"
                                    value={details.total_applied}
                                    type="total_applied"
                                    status="applied"
                                />
                            </Col>

                            <Col md={3}>
                                <StatBox
                                    title="Shortlisted"
                                    value={details.shortlisted}
                                    type="shortlisted"
                                    status="shortlisted"
                                />
                            </Col>

                            <Col md={3}>
                                <StatBox
                                    title="Interviews"
                                    value={details.interviews}
                                    type="interviews"
                                    status="interviewed"
                                />
                            </Col>

                            <Col md={3}>
                                <StatBox
                                    title="Approval Notes"
                                    value={details.approval_notes}
                                    type="approval_notes"
                                    status="approvalnotes"
                                />
                            </Col>

                            <Col md={3}>
                                <StatBox
                                    title="Approved Candidates"
                                    value={details.approval_candidates}
                                    type="approval_candidates"
                                    status="approved"
                                />
                            </Col>

                            <Col md={3}>
                                <StatBox
                                    title="Offer Letters"
                                    value={details.offer_letter}
                                    type="offer_letter"
                                    status="offer_letter"
                                />
                            </Col>

                            <Col md={3}>
                                <StatBox
                                    title="Appointment Letters"
                                    value={details.appointment_letter}
                                    type="appointment_letter"
                                    status="appointment_letter"
                                />
                            </Col>
                        </Row>
                    </>
                ) : (
                    <p className="text-center text-muted">No data available</p>
                )}

            </Modal.Body>

            <Modal.Footer>
                <Button className="sitebtn btn btn-secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewDetailsModal;