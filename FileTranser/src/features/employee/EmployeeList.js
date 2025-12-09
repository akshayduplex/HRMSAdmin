import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoMdSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import GoBackButton from "../goBack/GoBackButton";
import EmployeeTable from "./EmployeeTable";
import AllHeaders from "../partials/AllHeaders";



const EmployeeList = () => {
  return (
    <>
    <AllHeaders/>
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="hrhdng">
            <h2>People</h2>
            <p>
              Add Employee and Contractors
            </p>
            <div className="d-flex flex-row gap-5 w-100 my-3">
              <InputGroup className=" input-width">
                <InputGroup.Text
                  id="basic-addon1"
                  className="bg-gray-light pe-0 "
                >
                  <IoMdSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search name, email or employee ID"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  className="bg-gray-light bor-left ps-1 height-input"
                />
              </InputGroup>
              <Link to="/onboarding">
                <button className="btn onboard d-flex flex-row gap-2 align-items-center rounded-1 px-3">
                  Onboard New
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <rect width="16" height="16" fill="#BFE7FA" />
                    <path
                      d="M8 1C6.61553 1 5.26216 1.41054 4.11101 2.17971C2.95987 2.94888 2.06266 4.04213 1.53285 5.32122C1.00303 6.6003 0.86441 8.00776 1.13451 9.36563C1.4046 10.7235 2.07129 11.9708 3.05026 12.9497C4.02922 13.9287 5.2765 14.5954 6.63437 14.8655C7.99224 15.1356 9.3997 14.997 10.6788 14.4672C11.9579 13.9373 13.0511 13.0401 13.8203 11.889C14.5895 10.7378 15 9.38447 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1ZM8 4C8.14834 4 8.29334 4.04399 8.41668 4.1264C8.54002 4.20881 8.63615 4.32594 8.69291 4.46299C8.74968 4.60003 8.76453 4.75083 8.73559 4.89632C8.70665 5.0418 8.63522 5.17544 8.53033 5.28033C8.42544 5.38522 8.29181 5.45665 8.14632 5.48559C8.00083 5.51453 7.85004 5.49968 7.71299 5.44291C7.57595 5.38614 7.45881 5.29001 7.3764 5.16668C7.29399 5.04334 7.25 4.89834 7.25 4.75C7.25 4.55109 7.32902 4.36032 7.46967 4.21967C7.61033 4.07902 7.80109 4 8 4ZM10 12.0625H6V10.9375H7.4375V8.0625H6.5V6.9375H8.5625V10.9375H10V12.0625Z"
                      fill="#155674"
                    />
                  </svg>
                </button>
              </Link>
            </div>
            <Tab.Container
              id="left-tabs-example "
              className=" "
              defaultActiveKey="first"
            >
              <Nav
                variant="pills"
                className="flex-row postedjobs widthcomp widthfuller w-100 border-full"
              >
                <Nav.Item>
                  <Nav.Link eventKey="first">All (100)</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">On-role (70)</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">On-Contract (20)</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="four">Empaneled (20)</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="five">Dismissed (10)</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="w-100">
                <Tab.Pane eventKey="first">
                  <EmployeeTable />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <EmployeeTable />
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <EmployeeTable />
                </Tab.Pane>
                <Tab.Pane eventKey="four">
                  <EmployeeTable />
                </Tab.Pane>
                <Tab.Pane eventKey="five">
                  <EmployeeTable />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
}


export default EmployeeList;