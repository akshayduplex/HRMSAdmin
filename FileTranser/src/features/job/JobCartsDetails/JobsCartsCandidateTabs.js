import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { CiSearch } from "react-icons/ci";
import JobCandidateTable from "./JobCandidatePanel.js";
import InterviewTable from "./InterviewTables.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { ShortListCandidates } from "../../slices/JobSortLIstedSlice/SortLIstedSlice.js";
import { FetchAppliedCandidateDetails } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice.js";
import { useParams } from "react-router-dom";


export default function JobCardsCandidateTabs() {
    const [activeTab, setActiveTab] = useState('first');
    const AppliedCandidates = useSelector((state) => state.appliedJobList.AppliedCandidate);
    const getEmployeeRecords = JSON.parse(localStorage.getItem('admin_role_user') ?? {})
    const [CandidatesDetials, setCandidatesDetials] = useState([]);
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const { id } = useParams();
    // here handle the status of tabs records data 
    const getStatus = (key) => {
        switch (key) {
            case 'first': return 'Applied';
            case 'second': return 'Shortlisted';
            case 'third': return 'Interview';
            case 'four': return 'Offer';
            case 'five': return 'Hired';
            case 'six': return 'Rejected';
            default: return '';
        }
        // ['Applied','Shortlisted','Interview','Offer','Hired','Rejected'];
    };

    const handleSelect = (key) => {
        setActiveTab(key);
        console.log(`Active tab: ${key}`);  // Log the active tab key
    };

    const handleBulkSortListed = (e) => {
        e.preventDefault()
        if (CandidatesDetials.length === 0 && e.target.value === 'Shortlisted') {
            return toast.warning('No Candidates Selected to Shortlist')
        }
        if (e.target.value && e.target.value === 'Shortlisted') {
            let candidateDetails = CandidatesDetials.reduce((acc, value) => {
                if (value?.candidateInfo) {
                    acc.push({
                        candidate_id: value?.candidateInfo?.candidate_id,
                        applied_job_id: value?.candidateInfo?.applied_job_id,
                    })
                }
                return acc
            }, [])
            let payloads = {
                "role_user_id": getEmployeeRecords?._id,
                "candidate_ids": candidateDetails,
                "status": "Shortlisted"
            }
            dispatch(ShortListCandidates(payloads))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        dispatch(FetchAppliedCandidateDetails(id));
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const status = getStatus(activeTab);

    // console.log(AppliedCandidates , 'this is data ');

    return (
        <>
            <Tab.Container id="left-tabs-example" className="" defaultActiveKey="first" onSelect={handleSelect}>
                <Nav variant="pills" className="flex-row postedjobs border-full mb-4 widthcomp widthfuller">
                    <Nav.Item>
                        <Nav.Link eventKey="first">New Candidates ({AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Applied')?.length})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="second">Shortlisted ({AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Shortlisted')?.length})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="third">Interview ({AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Interview')?.length})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="four">Offer ({AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Offer')?.length})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="five">Hired ({AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Hired')?.length})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="six">Rejected ({AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Rejected')?.length})</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="first">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div className="tbl_hdng">
                                <h6>{AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Applied')?.length} Candidates</h6>
                            </div>
                            <div className="d-flex flex-row gap-3">
                                <InputGroup className="searchy-input">
                                    <InputGroup.Text id="basic-addon1" className="border-0">
                                        <CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search Candidate"
                                        aria-label="Username"
                                        value={search}
                                        aria-describedby="basic-addon1"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="d-flex justify-content-start bulkaction_btn mb-3">
                            <Form.Select aria-label="Default select example" onChange={handleBulkSortListed}>
                                <option value={null}>Bulk Action</option>
                                <option value="Shortlisted">Shortlist</option>
                            </Form.Select>
                        </div>
                        <JobCandidateTable PageStatus={status} setCandidatesDetials={setCandidatesDetials} filterText={search} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div className="tbl_hdng">
                                <h6>{AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Shortlisted')?.length} Candidates</h6>
                            </div>
                            <div className="d-flex flex-row gap-3">
                                <InputGroup className="searchy-input">
                                    <InputGroup.Text id="basic-addon1" className="border-0">
                                        <CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search Candidate"
                                        aria-label="Username"
                                        value={search}
                                        aria-describedby="basic-addon1"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <JobCandidateTable PageStatus={status} setCandidatesDetials={setCandidatesDetials} filterText={search} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <h5>{AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Interview')?.length} Candidates</h5>
                            </div>
                            <div className="d-flex flex-row gap-3">
                                <Form.Select aria-label="Default select example">
                                    <option disabled selected>Sort By Rating</option>
                                    <option value="1">5</option>
                                    <option value="1">4.5</option>
                                    <option value="1">4</option>
                                    <option value="1">3.5</option>
                                    <option value="1">3</option>
                                </Form.Select>
                                <InputGroup className="searchy-input">
                                    <InputGroup.Text id="basic-addon1" className="border-0">
                                        <CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search Candidate"
                                        aria-label="Username"
                                        value={search}
                                        aria-describedby="basic-addon1"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <InterviewTable PageStatus={status} filterText={search} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="four">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div className="tbl_hdng">
                                <h6>{AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Offer')?.length} Candidates</h6>
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
                        <JobCandidateTable PageStatus={status} setCandidatesDetials={setCandidatesDetials} filterText={search} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="five">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div className="tbl_hdng">
                                <h6>{AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Hired')?.length} Candidates</h6>
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
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </div>

                        <JobCandidateTable PageStatus={status} setCandidatesDetials={setCandidatesDetials} filterText={search} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="six">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div className="tbl_hdng">
                                <h6>{AppliedCandidates.status === 'success' && AppliedCandidates.data.filter((key) => key.form_status === 'Rejected')?.length} Candidates</h6>
                            </div>
                            <div className="d-flex flex-row gap-3">
                                <InputGroup className="searchy-input">
                                    <InputGroup.Text id="basic-addon1" className="border-0">
                                        <CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search Candidate"
                                        aria-label="Username"
                                        value={search}
                                        aria-describedby="basic-addon1"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <JobCandidateTable PageStatus={status} setCandidatesDetials={setCandidatesDetials} filterText={search} />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    )
}

