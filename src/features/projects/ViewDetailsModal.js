import React from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";

const ViewDetailsModal = ({ show, onHide }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            {/* Header same as ExtendDurationModal */}
            <Modal.Header closeButton>
                <Modal.Title>
                    Project Details
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="py-4 proj_extns">

                {/* ---- Project Summary ---- */}
                <h6>Project Summary</h6>
                <Row className="mb-4">
                    <Col md={6}>
                        <p className="mb-1 text-muted">Project Name</p>
                        <p className="fw-semibold">Smart City Development</p>
                    </Col>
                    <Col md={6}>
                        <p className="mb-1 text-muted">Project Status</p>
                        <p className="fw-semibold">Ongoing</p>
                    </Col>
                </Row>

                {/* ---- Candidate / Application Stats ---- */}
                <h6>Application & Candidate Details</h6>

                <Row className="g-3 mt-1">
                    <Col md={3}>
                        <div className="stat-box">
                            <p className="text-muted mb-1">Applicants Applied</p>
                            <h4 className="mb-0">120</h4>
                        </div>
                    </Col>

                    <Col md={3}>
                        <div className="stat-box">
                            <p className="text-muted mb-1">Candidates Pending</p>
                            <h4 className="mb-0">45</h4>
                        </div>
                    </Col>

                    <Col md={3}>
                        <div className="stat-box">
                            <p className="text-muted mb-1">Candidates Approved</p>
                            <h4 className="mb-0">60</h4>
                        </div>
                    </Col>

                    <Col md={3}>
                        <div className="stat-box">
                            <p className="text-muted mb-1">Candidates Rejected</p>
                            <h4 className="mb-0">15</h4>
                        </div>
                    </Col>
                </Row>

                {/* ---- Future API Section Placeholder ---- */}
                <h6 className="mt-4">Additional Details</h6>
                <p className="text-muted">
                    ......
                </p>

            </Modal.Body>

            <Modal.Footer>
                <Button
                    className="sitebtn btn btn-secondary"
                    onClick={onHide}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewDetailsModal;
