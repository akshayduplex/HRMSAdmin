import { React, useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import { RiTwitterXFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { CgProfile } from "react-icons/cg";
import GoBackButton from "../../goBack/GoBackButton";
import { FaStar } from "react-icons/fa6";
// import Rate_modal from "./Ratings/Rating-modal";
import RateModal from "../../Rating/RatingModels";
import InterviewSteps from "../InterviewSteps";
import CandidateResume from "../CandidateResume";
import AllHeaders from "../../partials/AllHeaders";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FetchCandidatesListById } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import config from "../../../config/config";
import moment from "moment";
import { DateFormate } from "../../../utils/common";
import FeedbackModels from "./FeedBackModles";


export default function CandidateProfile() {
  const color = ["bg_redlt", "bg_magentalt", "bg_purple", "bg_greenlt"];
  const [modalShow, setModalShow] = useState(false);
  const [selectedData , setData] = useState(false);
  const { id } = useParams();
  const candidateRecords = useSelector((state) => state.appliedJobList.AppliedCandidateList)
  const dispatch = useDispatch();

  console.log(candidateRecords , 'this is candidate records data from the server');

  useEffect(() => {
    dispatch(FetchCandidatesListById(id));
  }, [id, dispatch])

  const handleShowRateModels = (e, data) => {
    e.preventDefault()
    setModalShow(true);
    console.log(data , 'this is data from the dropdown');
    setData(data)
  }

  return (
    <>
      <AllHeaders />
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="sitecard">
            <div className="cd_profilebox d-flex">
              <div className="cd_prfleft">
                <div className="prfimg">
                  {
                    candidateRecords.status === 'success' && candidateRecords.data?.photo ?
                      <img style={{ maxHeight: '150px', maxWidth: '150px' }} src={`${config.IMAGE_PATH}${candidateRecords.status === 'success' && candidateRecords.data?.photo}`} alt="candidate images" />
                      : <CgProfile size={60} style={{ marginBottom: '2rem' }} />
                  }
                  <span className="rat_tag">{candidateRecords.status === 'success' && candidateRecords.data?.complete_profile_status}%</span>
                </div>
                <div className="name_rating">
                  <h4 className="name">{candidateRecords.status === 'success' && candidateRecords.data?.name}</h4>
                  <div className="rat_text">
                    <h6>Candidate rating</h6>
                    <p className="ratenum">
                      <FaStar />
                      <span>4.5</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="cd_prfright d-flex">
                <div className="cnt_info">
                  <h6>Contact Information</h6>
                  <p>{candidateRecords.status === 'success' && candidateRecords.data?.mobile_no}</p>
                  <p>
                    {candidateRecords.status === 'success' && candidateRecords.data?.email}
                  </p>
                  <p> {candidateRecords.status === 'success' && candidateRecords.data?.location}</p>
                  <ul className="social">
                    <li>
                      <a href="#">
                        <FaLinkedin />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <RiTwitterXFill />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <FaFacebook />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <FaInstagram />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="cnt_info prev_empinfo">
                  <h6>Previous Employer</h6>
                  <p>{candidateRecords.status === 'success' && candidateRecords.data?.current_employer}</p>
                  <p>{candidateRecords.status === 'success' && candidateRecords.data?.designation} </p>
                  <p>
                    <a href="#"> {candidateRecords.status === 'success' && candidateRecords.data?.current_employer_mobile}</a>
                  </p>
                  <p>
                    <a href="mailto:">{candidateRecords.status === 'success' && candidateRecords.data?.email}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Tab.Container id="left-tabs-example" className="mt-3" defaultActiveKey="first">
            <Nav variant="pills" className="flex-row postedjobs widthcomp tabsborder">
              <Nav.Item>
                <Nav.Link eventKey="first">Candidates Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Interviews</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Score Comparison Sheet</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="four">Feedback</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="five">Assessment</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="int_process_tabs">
              <Tab.Pane eventKey="first">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className="sitecard pr-0">
                      <div className="infobox">
                        <h5>Personal Information</h5>
                        <div className="infotext">
                          <div className="infos">
                            <h6>Current Employer</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.current_employer}</p>
                          </div>
                          <div className="infos">
                            <h6>Designation</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.designation}</p>
                          </div>
                          <div className="infos">
                            <h6>Experience in Total</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.total_experience}</p>
                          </div>
                          <div className="infos">
                            <h6>Relevant Experience</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.relevant_experience}</p>
                          </div>
                          <div className="infos">
                            <h6>Current CTC</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.current_ctc} LPA</p>
                          </div>
                          <div className="infos">
                            <h6>Expected CTC</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.expected_ctc} LPA</p>
                          </div>
                          <div className="infos">
                            <h6>Notice Period</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.notice_period} Days</p>
                          </div>
                          <div className="infos">
                            <h6>Last Working day </h6>
                            <p>{candidateRecords.status === 'success' && moment(candidateRecords.data?.last_working_day).format("DD/MM/YYYY")}</p>
                          </div>
                          <div className="infos">
                            <h6>Applied from</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.applied_from}</p>
                          </div>
                          <div className="infos">
                            <h6>Reference employee</h6>
                            <p>{candidateRecords.status === 'success' && candidateRecords.data?.reference_employee}</p>
                          </div>
                        </div>
                        <h5>Education</h5>
                        <div className="infotext">
                          {
                            candidateRecords.status === 'success' && candidateRecords.data?.education !== 0
                            && candidateRecords.data?.education.map((value, index) => {
                              return (
                                <>
                                  <div className="infos" key={index}>
                                    <h6>{value.degree}</h6>
                                    <p>{value.institute}</p>
                                    <p>From {moment(value.from_date).format("YYYY")} - {moment(value.to_date).format("YYYY")}</p>
                                  </div>
                                </>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className="sitecard h-100">
                      <div className="infobox">
                        <div className="d-flex flex-column gap-3 mt-1 scroller-content w-100">
                          {
                            candidateRecords.status === 'success' && candidateRecords.data?.applied_jobs?.length !== 0 ?
                              candidateRecords.data?.applied_jobs?.map((item, index) => {
                                return (
                                  <>
                                    <div className="card hr_jobcards card-border me-2" key={index}>
                                      <div className="card-body">
                                        <div className="d-flex flex-column gap-3">
                                          <div className="d-flex justify-content-between">
                                            <div className="d-flex flex-column gap-1 contenter">
                                              <div className="location">
                                                <span className="text-start w-100 d-flex">
                                                  {item?.interview_type}
                                                </span>
                                              </div>
                                              <h3 className="text-start mb-0">
                                                {item?.job_title}
                                              </h3>
                                              <span className="text-start">
                                                {candidateRecords.data?.location}
                                              </span>
                                            </div>
                                            {/* button and drop down details here */}
                                            <div className="d-flex flex-row">
                                              <div className="d-flex flex-column gap-2">
                                                <Link to={`/job-details/${item.job_id}`} className="detaibtn">
                                                  View Detail
                                                </Link>
                                                <span className="datetime">
                                                  {DateFormate(item.add_date)}
                                                </span>
                                              </div>
                                              {/* <div className="ddbtn buttnner">
                                                <Dropdown>
                                                  <Dropdown.Toggle id="dropdown-basic">
                                                    <HiDotsVertical />
                                                  </Dropdown.Toggle>

                                                  <Dropdown.Menu className="job_dropdown py-2 min-widther mt-2">
                                                    <Dropdown.Item href="#/action-1">
                                                      <div className="d-flex gap-3 flex-row">
                                                        <FiLink />
                                                        <span>Copy Link</span>
                                                      </div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">
                                                      <div className="d-flex gap-3 flex-row">
                                                        <FaRegClone />
                                                        <span>Clone</span>
                                                      </div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">
                                                      <div className="d-flex gap-3 flex-row">
                                                        <BsArchive />
                                                        <span>Archieve</span>
                                                      </div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/action-4">
                                                      <div className="d-flex gap-3 flex-row">
                                                        <RiDeleteBin6Line />
                                                        <span>Delete</span>
                                                      </div>
                                                    </Dropdown.Item>
                                                  </Dropdown.Menu>
                                                </Dropdown>
                                              </div> */}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )
                              }) : null
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className="sitecard pr-0 h-100 ps-0 pt-4">
                      <div className="infobox">
                        <h5 className="ms-3">Interview Timeline</h5>
                        <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100 candd_table smalldata">
                          <Table hover>
                            <thead>
                              <tr>
                                <th>Interviewer Name</th>
                                <th>Skills</th>
                                <th>Communication</th>
                                <th>Rating</th>
                                <th>Total interviewer </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                candidateRecords.status === 'success' && candidateRecords.data?.applied_jobs[0]?.interviewer.map((value, index) => {
                                  return (
                                    <>
                                      <tr key={index}>
                                        <td>{value?.employee_name}({value?.designation})</td>
                                        <td>{value?.skills}</td>
                                        <td>{value?.communication}</td>
                                        <td>{value?.rating}</td>
                                        <td>{candidateRecords.data?.applied_jobs[0]?.interviewer?.length}</td>
                                      </tr>
                                    </>
                                  )
                                })
                              }
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="four">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className="sitecard pr-0 h-100 ps-0 pt-4">
                      <div className="infobox">
                        <h5 className="ms-3">Interview Timeline</h5>
                        <div className="d-flex flex-column gap-2 mt-1 scroller-content candd_table w-100 smalldata">
                          <Table hover>
                            <thead>
                              <tr>
                                <th >Interview Date</th>
                                <th>Interviewer(s)</th>
                                <th>Round</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Comment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                candidateRecords.status === 'success' && candidateRecords.data?.applied_jobs[0]?.interviewer.map((value, index) => {
                                  return (
                                    <>
                                      <tr key={index}>
                                        <td>{value?.interview_date ? moment(value?.interview_date).format("DD-MMMM-YYYY") : moment(candidateRecords.data?.applied_jobs[0]?.interview_date).format("DD-MMMM-YYYY")}</td>
                                        <td>{value?.employee_name}({value?.designation})</td>
                                        <td>{value?.stage}</td>
                                        <td>{value?.rating}</td>
                                        <td>
                                         {
                                            value?.feedback_status === 'Pending'
                                              ?
                                              <div className="d-flex align-items-center flex-column gap-1" onClick={(e) => handleShowRateModels(e, candidateRecords.data)}>
                                                <span className={`statused ${value?.feedback_status === 'Pending' ? 'bg_purple' : 'bg_greenlt'} `}>{value?.feedback_status}</span>
                                                <span className="updatedby">Updated by - {value?.added_by}</span>
                                              </div>
                                              : <div className="d-flex align-items-center flex-column gap-1">
                                                <span className={`statused ${value?.feedback_status === 'Pending' ? 'bg_purple' : 'bg_greenlt'} `}>{value?.feedback_status}</span>
                                                <span className="updatedby">Updated by - {value?.added_by}</span>
                                               </div>
                                          }
                                        </td>
                                        <td className="comment">
                                          <p> {value?.comment} </p>
                                        </td>
                                      </tr>
                                    </>
                                  )
                                })
                              }
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="five">
                <div className="row my-3">
                  <div className="col-lg-8">
                    <div className=" pr-0 h-100">
                      <div className="">
                        <div className="d-flex flex-column gap-2 mt-1 scroller-content w-100">
                          <div className="card card-border me-2">
                            <div className="card-body assemntbox">
                              <div className="d-flex align-items-center mb-4 justify-content-between">
                                <h5 className="text-start mb-0">
                                  Assessment Status
                                </h5>
                                <span className="statuses">
                                  {candidateRecords.status === 'success' && candidateRecords.data?.assessment_status}
                                </span>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <h5 className="text-start mb-0">
                                  Score
                                </h5>
                                <div className="stat-color">
                                  {candidateRecords.status === 'success' && candidateRecords.data?.score}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <InterviewSteps interviewStep={candidateRecords.status === 'success' && candidateRecords.data} />
                    <CandidateResume resume={candidateRecords.status === 'success' && candidateRecords.data} />
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
          <FeedbackModels show={modalShow} onHide={() => setModalShow(false)} selectedData={selectedData}/>
        </div>
      </div>
    </>
  );
}
