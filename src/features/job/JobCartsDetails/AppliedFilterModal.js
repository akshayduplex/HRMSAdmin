import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AppliedFilterModal = ({ show, onHide, onApplyFilter , onResetFilter }) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');

  const handleSearch = () => {
    const filters = {
      city: city.trim(),
      state: state.trim(),
      education: education.trim(),
      experience: experience.trim(),
    };
    onApplyFilter(filters);
    onHide();
  };

  const handleCancel = () => {
    setCity('');
    setState('');
    setEducation('');
    setExperience('');
    onHide()
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Apply Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Education</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppliedFilterModal;