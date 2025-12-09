import React, { useState } from "react"; // Ensure useState is imported
import { IoSearchOutline } from "react-icons/io5";
import GoBackButton from "../goBack/GoBackButton";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom"
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import AllHeaders from "../partials/AllHeaders";


export default function ViewSalary() {

    const [modalShow, setModalShow] = useState(false);

    const [showFirstIcon, setShowFirstIcon] = useState(true);

    const handleFirstIconClick = () => {
        setShowFirstIcon(false);
    };
    const initialrows = [
        {
            id: 1,
            ID: "EID100100",

            candidateInfo: {
                Name: "Anshul Awasthi",
                Designation: "Engineer",
                email: "john@example.com",
                phone: "1234567890",
            },
            TotalDays: "20 Days",
            Overtime: "2 hours",
            SickLeaves: "2 Days",
            PaidHoliday: "1 Day",
            Payout: "200k",
            Transaction_Id: "adc12131313",
            Transaction_Date: "20 April 2020",
        },
        {
            id: 2,
            ID: "EID100100",

            candidateInfo: {
                Name: "Anshul Awasthi",
                Designation: "Engineer",
                email: "john@example.com",
                phone: "1234567890",
            },
            TotalDays: "20 Days",
            Overtime: "2 hours",
            SickLeaves: "2 Days",
            PaidHoliday: "1 Day",
            Payout: "200k",
            Transaction_Id: "adc12131313",
            Transaction_Date: "20 April 2020",
        },
        {
            id: 3,
            ID: "EID100100",

            candidateInfo: {
                Name: "Anshul Awasthi",
                Designation: "Engineer",
                email: "john@example.com",
                phone: "1234567890",
            },
            TotalDays: "20 Days",
            Overtime: "2 hours",
            SickLeaves: "2 Days",
            PaidHoliday: "1 Day",
            Payout: "200k",
            Transaction_Id: "adc12131313",
            Transaction_Date: "20 April 2020",
        },
        {
            id: 4,
            ID: "EID100100",

            candidateInfo: {
                Name: "Anshul Awasthi",
                Designation: "Engineer",
                email: "john@example.com",
                phone: "1234567890",
            },
            TotalDays: "20 Days",
            Overtime: "2 hours",
            SickLeaves: "2 Days",
            PaidHoliday: "1 Day",
            Payout: "200k",
            Transaction_Id: "adc12131313",
            Transaction_Date: "20 April 2020",
        },


    ];
    const [age, setAge] = useState("");
    const [rows, setRows] = useState(initialrows);

    const handleChangeValue = (event) => {
        setAge(event.target.value);
    };


    const columns = [
        { field: "ID", headerName: "ID", flex: 0.6 },
        {
            field: "Name",
            headerName: "Name",
            renderCell: (params) => (
                <div className="candinfo">
                    <Link to="/candidate-detail">
                        <p className="color-blue"> {params.row.candidateInfo.Name}</p>
                    </Link>
                    <span>
                        {params.row.candidateInfo.Designation}
                    </span>
                </div>
            ),
            flex: 0.8,
        },
        { field: "TotalDays", headerName: "Total Days", flex: 0.6 },
        { field: "Overtime", headerName: "Overtime", flex: 0.6 },
        { field: "SickLeaves", headerName: "Sick Leaves", flex: 0.6 },
        { field: "PaidHoliday", headerName: "Paid Holiday", flex: 0.6 },
        { field: "Payout", headerName: "Payout", flex: 0.7 },
        { field: "Transaction_Id", headerName: "Transaction Id", flex: 0.7 },
        { field: "Transaction_Date", headerName: "Transaction Date", flex: 0.7 },

    ];
    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="d-flex flex-row gap-3 align-items-center flex-70 reload-btn justify-content-between ">
                        <h3 className="d-inline">View Salary</h3>
                    </div>

                    <div className="mt-4 d-flex justify-content-between">
                        <div className="d-flex flex-row gap-2 align-items-center">
                            <Box sx={{ minWidth: 190 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Select Project
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={age}
                                        label="Select Project"
                                        onChange={handleChangeValue}
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <div className="position-relative srchemployee">
                                <Form.Control
                                    type="text"
                                    className="w-100 ps-4 ms-2 form-control fs-6"
                                    placeholder="Search Employee"
                                />
                                <div className="srchicon">
                                    <IoSearchOutline size={"16px"} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
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
                    </div>
                </div>
            </div>
        </>
    );
}
