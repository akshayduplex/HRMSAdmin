import React, { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

export default function EmployeeTable({ formData, searchQuery, paginationModel, handlePaginationModelChange, totalCount, openLoader }) {
    const navigate = useNavigate();

    const handleProfileRedirect = (id) => {
        localStorage.setItem("onBoardingId", id);
        navigate('/people-profile');
    };
    const handleProfileEditRedirect = (id) => {
        localStorage.setItem("onBoardingId", id);
        navigate('/onboarding');
    };


    const rows = useMemo(() => {
        const data = searchQuery || [];

        return data.map((item, index) => {
            const location = (item.branch && item.branch.length > 0)
                ? item.branch.join(', ')
                : "N/A";
            return {
                id: index + 1,
                _id: item._id,
                Ec: item.employee_code || item._id,
                candidateInfo: {
                    name: item.name || "N/A",
                    status: item.profile_status || "N/A",
                    email: item.email || "N/A",
                    phone: item.mobile_no || "N/A",
                    addedDate: formatDateToDDMMYYYY(item?.add_date) || '01/12/2024'
                },
                Designation: item.designation || "N/A",
                Project: item.project_name || "N/A",
                Department: item.department || "N/A",
                Location: location !== ", ," ? location : "N/A",
                Batch_id: item?.batch_id ? item?.batch_id : "N/A",
                dateOfJoining: formatDateToDDMMYYYY(item.joining_date) || "N/A"
            };
        });
    }, [searchQuery]);


    function formatDateToDDMMYYYY(dateString) {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
    }

    const columns = [
        {
            field: "Ec",
            headerName: "EC No.",
            width: 100,
            renderCell: (params) => {
                return <Link to={"#"} onClick={(e) => {
                    e.preventDefault();
                    handleProfileRedirect(params.row._id);
                }}>{params.row?.Ec}</Link>;
            },
            // flex: 0.8
        },
        {
            field: "Name",
            headerName: "Name",
            width: 200,
            renderCell: (params) => (
                <div className="candinfo">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleProfileRedirect(params.row._id);
                        }}
                    >
                        <p className="color-blue overflow-hidden">{params.row?.candidateInfo?.name}</p>
                    </a>
                    <span className="statustag">{params.row?.candidateInfo?.status}</span>
                </div>
            ),
        },
        {
            field: "Batch_id",
            headerName: "Batch Id",
            width: 100,
        },
        {
            field: "Email & Phone Number",
            headerName: "Email & Phone Number",
            width: 300,
            renderCell: (params) => (
                <div className="d-flex flex-column data-flexer-with-border">
                    <span className="text-start overflow-hidden">{params.row?.candidateInfo?.email}</span>
                    <span className="text-start">{params.row?.candidateInfo?.phone}</span>
                </div>
            ),
        },
        {
            field: "dateOfJoining",
            headerName: "Date of Joining / Add Date",
            width: 300,
            renderCell: (params) => (
                <div className="d-flex flex-column data-flexer-with-border">
                    <p className="text-start lineBreack">DOJ: {params.row?.dateOfJoining}</p>
                    <p className="text-start lineBreack">Added: {params.row?.candidateInfo?.addedDate}</p>
                </div>
            ),
        },
        {
            field: "Designation",
            headerName: "Designation",
            width: 200,
            renderCell: (params) => (
                <p className="text-start lineBreack">{params.row?.Designation}</p>
            ),
        },
        {
            field: "Project",
            headerName: "Project",
            renderCell: (params) => (
                <p className="text-start lineBreack overflow-hidden">{params.row?.Project}</p>
            ),
            width: 150,
        },
        {
            field: "Department",
            headerName: "Department",
            width: 150,
            renderCell: (params) => (
                <p className="text-start lineBreack overflow-hidden">{params.row?.Department}</p>
            ),
        },
        {
            field: "Location",
            headerName: "Location",
            width: 150,
            renderCell: (params) => (
                <p className="text-start lineBreack overflow-hidden">{params.row?.Location}</p>
            ),
        },
        {
            field: "Edit",
            headerName: "Action",
            renderCell: (params) => (
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleProfileEditRedirect(params.row._id);
                        }}
                        type='button'
                        className='btn btn-primary'
                        style={{ height: "35px", lineHeight: "12px" }}
                    >
                        <FaRegEdit className='fs-5 text-center' />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-100 hide-check mt-3">
            <DataGrid
                rows={rows || []}
                columns={columns}
                disableRowSelectionOnClick
                rowHeight={80}
                rowCount={totalCount || 0}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                disableColumnFilter
                disableColumnMenu   
                disableColumnSorting
                paginationMode="server"
                pageSizeOptions={[10, 20, 40, 50, 60, 70, 80, 90, 99]}
                loading={openLoader}
            />
        </div>
    );
}
