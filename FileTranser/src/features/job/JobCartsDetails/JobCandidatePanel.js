import React, {  useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import { FiUserCheck } from "react-icons/fi";
import { IoCalendarClearOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiFeedbackLine } from "react-icons/ri";
import { GrSubtractCircle } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import config from "../../../config/config";
import { ShortListCandidates } from "../../slices/JobSortLIstedSlice/SortLIstedSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FetchAppliedCandidateDetails } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice";
import { DeleteAndRemoved } from "../../slices/JobSortLIstedSlice/SortLIstedSlice";
import { FaUserPlus } from 'react-icons/fa'; 

// const rows = [
//     {
//         id: 1,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 90
//         },

//         "Current Designation": "Engineer",
//         "Experience": "8 Years",
//         "Location": "New York",
//         "Current CTC": 70000,
//         "Expected CTC": 80000,
//         "Notice Period": 30,
//     },
//     {
//         id: 2,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Interviewed",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },

//         "Current Designation": "Manager",
//         "Experience": "8 Years",
//         "Location": "San Francisco",
//         "Current CTC": 90000,
//         "Expected CTC": 100000,
//         "Notice Period": 60,
//     },
//     {
//         id: 3,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Interviewed",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },

//         "Current Designation": "Developer",
//         "Experience": "8 Years",
//         "Location": "Chicago",
//         "Current CTC": 60000,
//         "Expected CTC": 70000,
//         "Notice Period": 45,
//     },
//     {
//         id: 4,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "On hold",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 70
//         },

//         "Current Designation": "Analyst",
//         "Experience": "8 Years",
//         "Location": "Los Angeles",
//         "Current CTC": 75000,
//         "Expected CTC": 85000,
//         "Notice Period": 30,
//     },
//     {
//         id: 5,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Hired",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 70
//         },

//         "Current Designation": "Consultant",
//         "Experience": "8 Years",
//         "Location": "Houston",
//         "Current CTC": 65000,
//         "Expected CTC": 75000,
//         "Notice Period": 60,
//     },
//     {
//         id: 6,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "On hold",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 50
//         },

//         "Current Designation": "Architect",
//         "Experience": "8 Years",
//         "Location": "Seattle",
//         "Current CTC": 110000,
//         "Expected CTC": 120000,
//         "Notice Period": 90,
//     },
//     {
//         id: 7,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },

//         "Current Designation": "Team Lead",
//         Experience: "8 Years",
//         Location: "Boston",
//         "Current CTC": 95000,
//         "Expected CTC": 105000,
//         "Notice Period": 45,
//     },
//     {
//         id: 8,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 90
//         },
//         "Current Designation": "Project Manager",
//         Experience: "8 Years",
//         Location: "Atlanta",
//         "Current CTC": 100000,
//         "Expected CTC": 110000,
//         "Notice Period": 60,
//     },
//     {
//         id: 9,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },
//         "Current Designation": "Software Engineer",
//         Experience: "8 Years",
//         Location: "Miami",
//         "Current CTC": 55000,
//         "Expected CTC": 65000,
//         "Notice Period": 30,
//     },
//     {
//         id: 10,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },
//         "Current Designation": "Data Scientist",
//         Experience: "8 Years",
//         Location: "Dallas",
//         "Current CTC": 80000,
//         "Expected CTC": 90000,
//         "Notice Period": 45,
//     },
//     {
//         id: 11,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 70
//         },
//         "Current Designation": "Business Analyst",
//         Experience: "8 Years",
//         Location: "Philadelphia",
//         "Current CTC": 70000,
//         "Expected CTC": 80000,
//         "Notice Period": 60,
//     },
//     {
//         id: 12,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },
//         "Current Designation": "Product Manager",
//         Experience: "8 Years",
//         Location: "Denver",
//         "Current CTC": 90000,
//         "Expected CTC": 100000,
//         "Notice Period": 30,
//     },
//     {
//         id: 13,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },
//         "Current Designation": "HR Manager",
//         Experience: "8 Years",
//         Location: "Phoenix",
//         "Current CTC": 95000,
//         "Expected CTC": 105000,
//         "Notice Period": 45,
//     },
//     {
//         id: 14,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },
//         "Current Designation": "Sales Executive",
//         Experience: "8 Years",
//         Location: "Detroit",
//         "Current CTC": 60000,
//         "Expected CTC": 70000,
//         "Notice Period": 60,
//     },
//     {
//         id: 15,
//         candidateInfo: {
//             name: "Anshul Awasthi",
//             status: "Shortlisted",
//             email: "john@example.com",
//             phone: "1234567890",
//             match_percent: 80
//         },
//         "Current Designation": "Marketing Specialist",
//         Experience: "8 Years",
//         Location: "Portland",
//         "Current CTC": 85000,
//         "Expected CTC": 95000,
//         "Notice Period": 30,
//     },
// ];

export default function JobCandidateTable({ PageStatus, setCandidatesDetials, filterText }) {
    const dispatch = useDispatch();
    const { id } = useParams();
    const AppliedJobs = useSelector((state) => state.appliedJobList.AppliedCandidate)
    const getEmployeeRecords = JSON.parse(localStorage.getItem('admin_role_user') ?? {})
    const rows = AppliedJobs.status === 'success' && AppliedJobs.data.length !== 0
        ? AppliedJobs.data
            .filter(value => value.form_status === PageStatus)  // Filter based on PageStatus
            .map((value, index) => ({
                id: index+1,
                candidateInfo: {
                    candidate_id: value._id,
                    name: value.name,
                    status: value.form_status,
                    email: value.email,
                    phone: value.mobile_no,
                    match_percent: parseInt(value.complete_profile_status),
                    resume: value.resume_file,
                    job_id: value.job_id,
                    applied_job_id: value.applied_jobs[0]?._id,
                    interviewer_id: value.applied_jobs
                },
                "Current Designation": value.designation,
                "Experience": value.total_experience,
                "Location": value.location.split(',')[0].trim(),
                "Current CTC":  `${value.current_ctc} LPA`,
                "Expected CTC": `${value.expected_ctc} LPA`,
                "Notice Period": `${value.notice_period} Days`
            }))
        : [];

    // shortListCandidate
    function handleSortListed(e, data) {
        e.preventDefault();
        let candidateDetails = [
            {
                candidate_id: data?.candidateInfo.candidate_id,
                applied_job_id: data?.candidateInfo.applied_job_id
            }
        ]
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
        // called the all records to re render the data =>
    }



    const handleDelete = (e, data) => {
        e.preventDefault();
        let payloads = {
            "candidate_id": data?.candidateInfo.candidate_id,
            "applied_job_id": data?.candidateInfo.applied_job_id,
            "status": "Deleted"
        }
        dispatch(DeleteAndRemoved(payloads))
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
    const handleReject = (e, data) => {
        e.preventDefault();
        let payloads = {
            "candidate_id": data?.candidateInfo.candidate_id,
            "applied_job_id": data?.candidateInfo.applied_job_id,
            "status": "Rejected"
        }
        dispatch(DeleteAndRemoved(payloads))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    dispatch(FetchAppliedCandidateDetails(id));
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const columns = [
        { field: "id", headerName: "Sno.", width: 50 },
        {
            field: "candidateName",
            headerName: "Candidate Name",
            width: 200,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <Link to={`/candidate-profile/${params.row?.candidateInfo?.candidate_id}`}><p className="color-blue">{params.row?.candidateInfo?.name}</p></Link>
                    <span className="statustag">{params?.row?.candidateInfo?.status}</span>
                    <div className="percnt_match">
                        <div className="percnt_match_progress">
                            <span class="title timer" data-from="0" data-to={params?.row?.candidateInfo?.match_percent} data-speed="1800">{params?.row?.candidateInfo?.match_percent}%</span>
                            <div class="left"></div>
                            <div class="right"></div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            field: "Email & Phone Number",
            headerName: "Email & Phone Number",
            width: 200,
            renderCell: (params) => (
                <div className="candinfo">
                    <p>{params.row?.candidateInfo?.email}</p>
                    <span>{params?.row?.candidateInfo?.phone}</span>
                </div>
            ),
        },
        {
            field: "Current Designation",
            headerName: "Current Designation",
            type: "number",
            width: 160,
        },
        {
            field: "Experience",
            headerName: "Experience",
            type: "number",
            width: 80,
        },
        {
            field: "Location",
            headerName: "Location",
            type: "number",
            width: 80,
        },
        {
            field: "Current CTC",
            headerName: "Current CTC",
            type: "number",
            width: 90,
        },
        {
            field: "Expected CTC",
            headerName: "Expected CTC",
            type: "number",
            width: 90,
        },
        {
            field: "Notice Period",
            headerName: "Notice Period",
            type: "number",
            width: 80,
        },
        {
            field: "Resume",
            headerName: "Resume",
            width: 80,
            renderCell: (params) => (
                <a href={`${config.IMAGE_PATH}${params.row?.candidateInfo?.resume}`} target="_blank" rel="noopener noreferrer">
                    <div className="d-flex flex-column justify-content-end align-items-center">
                        <div className="h-100">
                            <IoDocumentTextOutline className="fs-5" />
                        </div>
                    </div>
                </a>
            ),
        },
        {
            width: 30,
            renderCell: (params) => (
                <div className="d-flex flex-column justify-content-end align-items-center">
                    <div className="h-100 buttnner">
                        <Dropdown className="tbl_dropdown">
                            <Dropdown.Toggle>
                                <BsThreeDotsVertical className="fs-5" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="py-2 min-widther mt-2">
                                {
                                    params.row?.candidateInfo?.status === "Applied"
                                    &&
                                    <Dropdown.Item onClick={(e) => handleSortListed(e, params.row)}>
                                        <div className="d-flex">
                                            <FiUserCheck />
                                            <span>Shortlist</span>
                                        </div>
                                    </Dropdown.Item>
                                }
                                {
                                    params.row?.candidateInfo?.status === "Shortlisted"
                                    &&
                                    <Dropdown.Item href={`/schedule-interview/${params.row?.candidateInfo?.job_id}?userId=${params.row?.candidateInfo?.candidate_id}&applied-job-id=${params.row?.candidateInfo?.applied_job_id}`}>
                                        <div className="d-flex">
                                            <IoCalendarClearOutline />
                                            <span>Schedule Interview</span>
                                        </div>
                                    </Dropdown.Item>
                                }
                                {
                                    !['Rejected'].includes(params.row?.candidateInfo?.status) &&
                                    <Dropdown.Item onClick={(e) => handleReject(e, params.row)}>
                                        <div className="d-flex">
                                            <GrSubtractCircle />
                                            <span>Reject</span>
                                        </div>
                                    </Dropdown.Item>
                                }
                                {
                                    ['Shortlisted', 'Applied', 'Rejected'].includes(params.row?.candidateInfo?.status) &&
                                    <Dropdown.Item onClick={(e) => handleDelete(e, params.row)}>
                                        <div className="d-flex">
                                            <RiDeleteBin6Line />
                                            <span>Delete</span>
                                        </div>
                                    </Dropdown.Item>
                                }
                                {
                                    ['Hired'].includes(params.row?.candidateInfo?.status) &&
                                    <Dropdown.Item>
                                        <div className="d-flex">
                                            <FaUserPlus />
                                            <span>Onboard</span>
                                        </div>
                                    </Dropdown.Item>
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            ),
        },
    ];



    const [selectedRowIds, setSelectedRowIds] = useState([])

    const handleSelectionChange = (selectionModel) => {
        const selectedData = selectionModel.map((id) =>
            rows.find((row) => row.id === id)
        );
        // console.log(selectedData, 'This is selected data from the server');
        setSelectedRowIds(selectedData);
        setCandidatesDetials(selectedData);
        console.log(selectedRowIds, 'this is selected row data from the server')
    };

    const filteredRows = rows.filter((row) =>
        row.candidateInfo?.name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <>
            <div className="w-100">
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    headerClassName="custom-header-class"
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange} // Updated method name    
                    loading={AppliedJobs.status === 'loading' && true}
                />
            </div>
        </>
    )
}

