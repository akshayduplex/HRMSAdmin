import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
            name: "Anshul Awasthi",
            status: "Shortlisted",
            email: "john@example.com",
            phone: "1234567890",
            match_percent: 90
        },

        "Current Designation": "Engineer",
        "Experience": "8 Years",
        "Location": "New York",
        "Current CTC": 70000,
        "Expected CTC": 80000,
        "Notice Period": 30,
    },
    {
        id: 2,
        candidateInfo: {
            name: "Anshul Awasthi",
            status: "Interviewed",
            email: "john@example.com",
            phone: "1234567890",
            match_percent: 80
        },

        "Current Designation": "Manager",
        "Experience": "8 Years",
        "Location": "San Francisco",
        "Current CTC": 90000,
        "Expected CTC": 100000,
        "Notice Period": 60,
    },
    
];

const columns = [
    { field: "id", headerName: "Sno.", width: 50 },
    {
        field: "candidateName",
        headerName: "Candidate Name",
        width: 200,
        renderCell: (params) => (
            <div className="candinfo prcnt_bar">
                <Link to="/candidate-profile"><p className="color-blue">{params.row?.candidateInfo?.name}</p></Link>
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

export default function JobCandidateOfferTable() {
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

