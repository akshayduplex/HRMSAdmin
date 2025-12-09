import React from "react";
import GoBackButton from "../goBack/GoBackButton";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import AllHeaders from "../partials/AllHeaders";

const EmployeeContractClosure = ()=> {
  return (
    <><AllHeaders/>
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex justify-content-start align-items-start flex-column ">
            <h2>Full & Final</h2>
            <span>Employees full & final</span>
            <div className="row mt-4 w-100">
              <div className="col-lg-10">
                <div className="card card-border rounded-4 w-100 py-4 px-3">
                  <div className="card-body">
                    <div className="d-flex gap-5 flex-row">
                      <Form.Check
                        label="Resign"
                        name="group1"
                        type="radio"
                        id="check1"
                      />
                      <Form.Check
                        label="Terminate"
                        name="group1"
                        type="radio"
                        id="check2"
                      />
                      <Form.Check
                        label="Contract Closure"
                        name="group1"
                        type="radio"
                        id="check3"
                      />
                    </div>
                    <div className="d-flex gap-5 flex-row mt-4">
                      <Form.Check
                        label="Notice Period"
                        name="group1"
                        type="checkbox"
                        id="check231"
                      />
                    </div>
                    <div className="mt-4">
                      <Form className="d-flex flex-row gap-3">
                        <Form.Group
                          className="w-100"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className=" text-start w-100">
                            Salary Release Date
                          </Form.Label>
                          <div className="datebox">
                            <Form.Control
                              type="date"
                              placeholder="name@example.com"
                            />
                            <CiCalendar/>
                          </div>
                        </Form.Group>
                        <Form.Group
                          className=" w-100"
                          controlId="exampleForm.ControlTextarea1"
                        >
                          <Form.Label className=" text-start w-100">
                            Working Days
                          </Form.Label>
                          <Form.Control type="text" placeholder="--" />
                        </Form.Group>
                      </Form>
                    </div>
                    <div className="mt-4">
                      <Form>
                        <Form.Group
                          className=""
                          controlId="exampleForm.ControlTextarea1"
                        >
                          <Form.Label className=" text-start w-100">
                            State Reason
                          </Form.Label>
                          <Form.Control as="textarea" rows={6} className="h-100" />
                        </Form.Group>
                      </Form>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                      <div class="read-btn w-small w-100">
                        <button class="btn">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default  EmployeeContractClosure ;