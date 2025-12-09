import React from "react";
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

const rows = [
    {
        id: 1,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Current Designation": "Engineer", 
        Experience: "8 Years",
        Location: "New York",
        "Current CTC": 70000,
        "Expected CTC": 80000,
        "Notice Period": 30,
    },
    {
        id: 2,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Current Designation": "Manager",
        Experience: "8 Years",
        Location: "San Francisco",
        "Current CTC": 90000,
        "Expected CTC": 100000,
        "Notice Period": 60,
    },
    {
        id: 3,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Current Designation": "Developer",
        Experience: "8 Years",
        Location: "Chicago",
        "Current CTC": 60000,
        "Expected CTC": 70000,
        "Notice Period": 45,
    },
    {
        id: 4,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Current Designation": "Analyst",
        Experience: "8 Years",
        Location: "Los Angeles",
        "Current CTC": 75000,
        "Expected CTC": 85000,
        "Notice Period": 30,
    },
    {
        id: 5,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Current Designation": "Consultant",
        Experience: "8 Years",
        Location: "Houston",
        "Current CTC": 65000,
        "Expected CTC": 75000,
        "Notice Period": 60,
    },
    {
        id: 6,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Current Designation": "Architect",
        Experience: "8 Years",
        Location: "Seattle",
        "Current CTC": 110000,
        "Expected CTC": 120000,
        "Notice Period": 90,
    },
    {
        id: 7,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Current Designation": "Team Lead",
        Experience: "8 Years",
        Location: "Boston",
        "Current CTC": 95000,
        "Expected CTC": 105000,
        "Notice Period": 45,
    },
    {
        id: 8,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },
        "Current Designation": "Project Manager",
        Experience: "8 Years",
        Location: "Atlanta",
        "Current CTC": 100000,
        "Expected CTC": 110000,
        "Notice Period": 60,
    },
    {
        id: 9,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },
        "Current Designation": "Software Engineer",
        Experience: "8 Years",
        Location: "Miami",
        "Current CTC": 55000,
        "Expected CTC": 65000,
        "Notice Period": 30,
    },
    {
        id: 10,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },
        "Current Designation": "Data Scientist",
        Experience: "8 Years",
        Location: "Dallas",
        "Current CTC": 80000,
        "Expected CTC": 90000,
        "Notice Period": 45,
    },
    {
        id: 11,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },
        "Current Designation": "Business Analyst",
        Experience: "8 Years",
        Location: "Philadelphia",
        "Current CTC": 70000,
        "Expected CTC": 80000,
        "Notice Period": 60,
    },
    {
        id: 12,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },
        "Current Designation": "Product Manager",
        Experience: "8 Years",
        Location: "Denver",
        "Current CTC": 90000,
        "Expected CTC": 100000,
        "Notice Period": 30,
    },
    {
        id: 13,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },
        "Current Designation": "HR Manager",
        Experience: "8 Years",
        Location: "Phoenix",
        "Current CTC": 95000,
        "Expected CTC": 105000,
        "Notice Period": 45,
    },
    {
        id: 14,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },
        "Current Designation": "Sales Executive",
        Experience: "8 Years",
        Location: "Detroit",
        "Current CTC": 60000,
        "Expected CTC": 70000,
        "Notice Period": 60,
    },
    {
        id: 15,
        candidateInfo: {
            name: "John Doe",
            status: "Selected",
            email: "john@example.com",
            phone: "1234567890",
        },
        "Current Designation": "Marketing Specialist",
        Experience: "8 Years",
        Location: "Portland",
        "Current CTC": 85000,
        "Expected CTC": 95000,
        "Notice Period": 30,
    },
];

const columns = [
    { field: "id", headerName: "Sno.", width: 50 },
    {
        field: "candidateName",
        headerName: "Candidate Name",
        width: 130,
        renderCell: (params) => (
            <div className="candinfo">
                <Link to="/candidate-profile"><p className="color-blue">{params.row?.candidateInfo?.name}</p></Link>
                <span className="statustag">{params?.row?.candidateInfo?.status}</span>
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
        width: 100,
    },
    {
        field: "Location",
        headerName: "Location",
        type: "number",
        width: 100,
    },
    {
        field: "Current CTC",
        headerName: "Current CTC",
        type: "number",
        width: 110,
    },
    {
        field: "Expected CTC",
        headerName: "Expected CTC",
        type: "number",
        width: 120,
    },
    {
        field: "Notice Period",
        headerName: "Notice Period",
        type: "number",
        width: 100,
    },
    {
        field: "Resume",
        headerName: "Resume",
        width: 100,
        renderCell: () => (
            <div className="  d-flex flex-column justify-content-end align-items-center">
                <div className="h-100">
                    <IoDocumentTextOutline className="fs-5" />
                </div>
            </div>
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
                            <Dropdown.Item>
                                <div className="d-flex">
                                    <FiUserCheck />
                                    <span>Shortlist</span>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <div className="d-flex">
                                    <IoCalendarClearOutline />
                                    <span>Schedule Interview</span>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <div className="d-flex">
                                    <RiFeedbackLine />
                                    <span>Feedback</span>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <div className="d-flex">
                                    <GrSubtractCircle />
                                    <span>Reject</span>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <div className="d-flex">
                                    <RiDeleteBin6Line />
                                    <span>Delete</span>
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        ),
    },
];

const CandidateTable = ()=> {
    return (
        <> 
            <div className="w-100">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    headerClassName="custom-header-class"
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 20]}
                    checkboxSelection
                />
            </div>

        </>

    )
}

export default CandidateTable;