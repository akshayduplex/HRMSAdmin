import React from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { CiSearch } from "react-icons/ci";
import TotalAssetsTable from './TotalAssetsTable.js';
import AssignedAssetsTable from './AssignedAssetsTable.js';
import UnassignedAssetsTable from './UnassignedAssetsTable.js';


export default function AssetsTabs() {
    return (
        <>
            <Tab.Container id="left-tabs-example" className="" defaultActiveKey="first">
                <Nav variant="pills" className="flex-row postedjobs border-full mb-4 widthcomp widthfuller">
                    <Nav.Item>
                        <Nav.Link eventKey="first">Total Assets (120)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="second">Assigned Assets (10)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="third">Unassigned Assets (6)</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="first">
                        <div className="d-flex justify-content-between align-items-end mb-4">
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

                        <TotalAssetsTable />

                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                     
                        <AssignedAssetsTable />
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                       
                        <UnassignedAssetsTable />

                    </Tab.Pane>                    

                </Tab.Content>
            </Tab.Container>
        </>

    )
}

