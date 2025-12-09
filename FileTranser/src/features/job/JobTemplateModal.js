import React from "react";
//import Select from "@mui/material/Select";
import { IoMdSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";

const JobTemplateModal = (props) => {


  return (
    <Modal {...props} size="lg" className="jobtemp_modal">
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>
          <h4>Select from job templates</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-3">
          <h5 className="mb-0">Choose template</h5>
          <div className="row">
            <Form.Group
              className="col-lg-6"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Select aria-label="Default select example">
                <option value="1">Engineering</option>
                <option value="2">Management</option>
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="col-lg-6 "
              controlId="exampleForm.ControlInput1"
            >
              <InputGroup className="h-100">
                <InputGroup.Text id="basic-addon1" className="white-bg">
                  <IoMdSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by job title"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  className="h-100 bor-left"
                />
              </InputGroup>
            </Form.Group>
          </div>
          <div className="mx-fuller d-flex flex-column gap-3 infobox pe-3">
            <div className="card w-100 ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100 ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100 ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100 ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100  ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default JobTemplateModal;
