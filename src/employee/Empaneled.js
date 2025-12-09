import React, { useState } from "react";
import GoBackButton from "./Goback";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import { LiaRupeeSignSolid } from "react-icons/lia";

export default function Empaneled() {
  const [activeTab, setActiveTab] = useState("first");

  const changeTab = () => {
    setActiveTab("second");
  };

  return (
    <>
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex justify-content-between read-btn reload-btn">
            <h2 className="fs-3">Define Salary Structure - Empaneled</h2>
            <button className="btn d-flex flex-row justify-content-center align-items-center gap-2 w-small py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
              >
                <rect
                  width="16"
                  height="16"
                  transform="translate(0.5)"
                  fill="#BFE7FA"
                />
                <path
                  d="M9.5 14C10.6867 14 11.8467 13.6481 12.8334 12.9888C13.8201 12.3295 14.5892 11.3925 15.0433 10.2961C15.4974 9.19975 15.6162 7.99335 15.3847 6.82946C15.1532 5.66558 14.5818 4.59648 13.7426 3.75736C12.9035 2.91825 11.8344 2.3468 10.6705 2.11529C9.50666 1.88378 8.30026 2.0026 7.2039 2.45673C6.10754 2.91085 5.17047 3.67989 4.51118 4.66658C3.85189 5.65328 3.5 6.81331 3.5 8V11.1L1.7 9.3L1 10L4 13L7 10L6.3 9.3L4.5 11.1V8C4.5 7.0111 4.79324 6.0444 5.34265 5.22215C5.89206 4.39991 6.67295 3.75904 7.58658 3.38061C8.50021 3.00217 9.50555 2.90315 10.4755 3.09608C11.4454 3.289 12.3363 3.76521 13.0355 4.46447C13.7348 5.16373 14.211 6.05465 14.4039 7.02455C14.5969 7.99446 14.4978 8.99979 14.1194 9.91342C13.741 10.8271 13.1001 11.6079 12.2779 12.1574C11.4556 12.7068 10.4889 13 9.5 13V14Z"
                  fill="#155674"
                />
              </svg>
              Reset
            </button>
          </div>
          <div className="mt-3">
            <div className="postedjobs hrforms">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey="first"
                fill
              >
                <Nav
                  variant="pills"
                  className="flex-row border-full d-flex justify-content-between align-items-end"
                  activeKey={activeTab}

                >
                  <div className="d-flex flex-row">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="first"
                        className={
                          activeTab === "first" ? "active " : "unactive "
                        }
                      >
                        Earning
                      </Nav.Link>
                    </Nav.Item>

                  </div>
                </Nav>
                <Tab.Content
                  className="contere"
                  activeKey={activeTab}

                >
                  <Tab.Pane
                    eventKey="first"
                    className={
                      activeTab === "first" ? "active show" : "active d-none"
                    }
                  >
                    <div className="sitecard my-3">
                      <div className="mx-1000">
                        <Form className="d-flex flex-row gap-3 mb-4">
                          <Form.Group
                            controlId="exampleForm.ControlInput1"
                            className="w-100"
                          >
                            <Form.Label>
                              Number of Days (Working)
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 position-relative">
                              <Form.Control
                                type="text"
                                className="w-100 ps-4 ms-1 form-control fs-5"
                              />
                              
                            </div>
                          </Form.Group>
                          <Form.Group
                            controlId="exampleForm.ControlInput1"
                            className="w-100"
                          >
                            <Form.Label>
                              Consultation Fee / CTO
                            </Form.Label>
                            <div className="d-flex flex-row gap-5 position-relative w-100">
                              <Form.Control
                                type="text"
                                className="w-100 ps-4 ms-1 form-control fs-5"
                              />
                              <div className="rp_icon">
                                <LiaRupeeSignSolid size={"16px"} />
                              </div>
                            </div>
                          </Form.Group>
                        </Form>
                      </div>

                      <div className="d-flex justify-content-end mt-5 align-items-end mx-1000">
                        <div className="read-btn w-large w-100">
                          <button className="btn" >
                            Create Appointment Letter
                          </button>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>

                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
