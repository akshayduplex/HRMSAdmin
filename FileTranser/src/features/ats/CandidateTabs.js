import React from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { CiSearch } from "react-icons/ci";

import CandidateTable from './CandidateTable';


const CandidateTabs = ()=> {
    return (
        <>

            <Tab.Container id="left-tabs-example" className="" defaultActiveKey="first">
                <Nav variant="pills" className="flex-row postedjobs border-full mb-4 widthcomp widthfuller">
                    <Nav.Item>
                        <Nav.Link eventKey="first">Total Candidates (120)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="second">Shortlisted (10)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="third">Interview (6)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="four">Offer (3)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="five">Hired (1)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="six">Rejected (0)</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="first">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <h5>120 Candidates</h5>
                            </div>
                            <div className="d-flex flex-row gap-3">
                                <InputGroup className="searchy-input">
                                    <InputGroup.Text id="basic-addon1" className="border-0">
                                        <CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search Candidate"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="d-flex justify-content-start bulkaction_btn mb-3">
                            <Form.Select aria-label="Default select example">
                                <option disabled selected>Bulk Action</option>
                                <option value="1">Shortlist</option>
                            </Form.Select>
                        </div>

                        <CandidateTable />

                    </Tab.Pane>
                    <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>

    )
}

export default CandidateTabs;