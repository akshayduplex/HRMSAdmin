import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const rows = [
    {
        id: 1,
        Ec: "11110100",
        candidateInfo: {
            name: "John Doe",
            status: "Empanelled",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Date of Joining": "23/03/2024",
        Designation: "Sr. Engineer",
        Project: "HLFPPT",
        Department: "Engineering",
        Location: "Noida, Uttar Pradesh",
    },
    {
        id: 2,
        Ec: "11110100",
        candidateInfo: {
            name: "John Doe",
            status: "Empanelled",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Date of Joining": "23/03/2024",
        Designation: "Sr. Engineer",
        Project: "HLFPPT",
        Department: "Engineering",
        Location: "Noida, Uttar Pradesh",
    },
    {
        id: 3,
        Ec: "11110100",
        candidateInfo: {
            name: "John Doe",
            status: "Empanelled",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Date of Joining": "23/03/2024",
        Designation: "Sr. Engineer",
        Project: "HLFPPT",
        Department: "Engineering",
        Location: "Noida, Uttar Pradesh",
    },
    {
        id: 4,
        Ec: "11110100",
        candidateInfo: {
            name: "John Doe",
            status: "Empanelled",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Date of Joining": "23/03/2024",
        Designation: "Sr. Engineer",
        Project: "HLFPPT",
        Department: "Engineering",
        Location: "Noida, Uttar Pradesh",
    },
    {
        id: 5,
        Ec: "11110100",
        candidateInfo: {
            name: "John Doe",
            status: "Empanelled",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Date of Joining": "23/03/2024",
        Designation: "Sr. Engineer",
        Project: "HLFPPT",
        Department: "Engineering",
        Location: "Noida, Uttar Pradesh",
    },
    {
        id: 6,
        Ec: "11110100",
        candidateInfo: {
            name: "John Doe",
            status: "Empanelled",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Date of Joining": "23/03/2024",
        Designation: "Sr. Engineer",
        Project: "HLFPPT",
        Department: "Engineering",
        Location: "Noida, Uttar Pradesh",
    },
    {
        id: 7,
        Ec: "11110100",
        candidateInfo: {
            name: "John Doe",
            status: "Empanelled",
            email: "john@example.com",
            phone: "1234567890",
        },

        "Date of Joining": "23/03/2024",
        Designation: "Sr. Engineer",
        Project: "HLFPPT",
        Department: "Engineering",
        Location: "Noida, Uttar Pradesh",
    },
];

const columns = [
    { field: "Ec", headerName: "EC No.", flex: 0.8 },
    {
        field: "Name",
        headerName: "Name",
        renderCell: (params) => (
            <div className="candinfo">
                <a href="people-profile"><p className="color-blue">{params.row?.candidateInfo?.name}</p></a>
                <span className="statustag">{params?.row?.candidateInfo?.status}</span>
            </div>
        ),
        flex: 1,
    },
    {
        field: "Email & Phone Number",
        headerName: "Email & Phone Number",
        width: 200,
        renderCell: (params) => (
            <div className="d-flex flex-column data-flexer-with-border">
                <span className="text-start">{params.row?.candidateInfo?.email}</span>
                <span className="text-start">{params?.row?.candidateInfo?.phone}</span>
            </div>
        ),
        flex: 1.2,
    },
    {
        field: "Date of Joining",
        headerName: "Date of Joining",

        flex: 1,
    },
    {
        field: "Designation",
        headerName: "Designation",

        flex: 0.8,
    },
    {
        field: "Project",
        headerName: "Project",

        flex: 0.8,
    },
    {
        field: "Department",
        headerName: "Department",
        flex: 0.8,
    },
    {
        field: "Location",
        headerName: "Location",
        flex: 1,
    },
];

export default function Peoples_table() {
    return (
        <>
            <div className="w-100 hide-check mt-3">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 20]}

                />
            </div>
        </>
    );
}
