import React from "react";
import candidate from "../../images/candidate.png";
import { FaLinkedin } from "react-icons/fa";
//import Table from "react-bootstrap/Table";
import {  RiTwitterXFill } from "react-icons/ri";
//import { GoDownload } from "react-icons/go";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
//import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
//import CheckCircleIcon from "@mui/icons-material/CheckCircle";
//import StepConnector from "@mui/material/StepConnector";
//import { styled } from "@mui/system";
import { Link } from "react-router-dom";

//import { CiCalendar } from "react-icons/ci";
import GoBackButton from "../goBack/GoBackButton";
import EmployeeInfo from "./profile/EmployeeInfo";
import EmployeeSalary from "./profile/EmployeeSalary";
import EmployeeAttendance from "./profile/EmployeeAttendance";
import EmployeeCreditHistory from "./profile/EmployeeCreditHistory";
import EmployeeDocument from "./profile/EmployeeDocument";
import AllHeaders from "../partials/AllHeaders";


const EmployeeProfile = () => {
  return (
    <>
      <AllHeaders/>
      <div className="maincontent">
        <div className="container ps-5" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="sitecard">
            <div className="cd_profilebox d-flex">
              <div className="cd_prfleft">
                <img src={candidate} alt=""/>
                <div className="dfx">
                  <h4 className="name">Anshul Awasthi</h4>
                  <p className="empcode">Employee Code: 10110100</p>
                </div>
              </div>
              <div className="cd_prfright d-flex">
                <div className="cnt_info">
                  <h6>Contact Information</h6>
                  <p>+91-9101101000</p>
                  <p>awasthi.anshul1997@gmail.com</p>
                  <p>Noida, Uttar Pradesh</p>
                  <ul className="social">
                    <li>
                      <Link to="#">
                        <FaLinkedin />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <RiTwitterXFill />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <FaFacebook />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <FaInstagram />
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="cnt_info prev_empinfo">
                  <h6>Employment Info</h6>
                  <p>Joining Date : 21/03/2024</p>
                  <p>Contract Expires on : 21/04/2026  </p>
                </div>
              </div>
            </div>
          </div>
          <Tab.Container id="left-tabs-example" className="mt-3" defaultActiveKey="first">
            <Nav variant="pills" className="flex-row postedjobs widthcomp border-full">
              <Nav.Item>
                <Nav.Link eventKey="first">Employee Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Salary</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Attendence</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="four">Credit History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="five">Documents</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <EmployeeInfo />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <EmployeeSalary />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <EmployeeAttendance />
              </Tab.Pane>
              <Tab.Pane eventKey="four">
                <EmployeeCreditHistory />
              </Tab.Pane>
              <Tab.Pane eventKey="five">
                <EmployeeDocument />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </>
  );
}

export default EmployeeProfile;