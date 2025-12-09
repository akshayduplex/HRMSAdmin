import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import ToggleButton from 'react-toggle-button';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import moment from 'moment';
import CustomToolbar from '../CommonFilter/CustomeToolBar';

const Occupation = () => {
    const [occupationName, setOccupationName] = useState("");
    const [status, setStatus] = useState("Active");
    const [occupationList, setOccupationList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        const input = filterModel?.quickFilterValues?.[0]; // Get the value of the first filter
        handleGetOccupationList(input); // Call your function with the input value
        setFilterModel(newFilterModel); // Store the filter model if needed
    };

    const [edit, setEdit] = useState({
        occupationName: '',
        occupationStatus: '',
        occupationId: "",
        editStatus: false
    });

    useEffect(() => {
        if (edit.editStatus) {
            setOccupationName(edit.occupationName);
            setStatus(edit.occupationStatus);
        }
    }, [edit]);

    const handleAddOccupation = async (e) => {
        e.preventDefault();
        const payload = { name: occupationName, status };
        if (!occupationName) {
            return toast.warn('Please Enter the occupation');
        }
        try {
            const response = await axios.post(`${config.API_URL}addOccupation`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setOccupationName("");
            setStatus("Active");
            handleGetOccupationList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("occupation already exists");
            } else {
                console.error(err);
                toast.error("Failed to add occupation");
            }
        }
    };

    const handleGetOccupationList = async ( input = '' ) => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase(),
        };
        try {
            const response = await axios.post(`${config.API_URL}getOccupationList`, payload, apiHeaderToken(config.API_TOKEN));
            setOccupationList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching occupation list:", error);
        }
    };
    const handleGetOccupationListTotal = async ( input = '' ) => {
        const payload = {
            page_no: 1,
            per_page_record: 1000,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase(),
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getOccupationList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching occupation list:", error);
        }
    };

    useEffect(() => {
        handleGetOccupationList();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        handleGetOccupationListTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        setEdit({
            occupationName: data?.name,
            occupationId: data?._id,
            occupationStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.occupationId, name: occupationName, status };
        if (!occupationName) {
            return toast.warn('Please Enter the occupation');
        }
        try {
            const response = await axios.post(`${config.API_URL}editOccupation`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setOccupationList(prevList =>
                prevList.map(item =>
                    item._id === edit.occupationId ? { ...item, name: occupationName, status } : item
                )
            );
            setEdit({
                occupationName: '',
                occupationStatus: '',
                occupationId: "",
                editStatus: false
            });
            setOccupationName("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating occupation:", error);
            toast.error("Failed to update occupation");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (occupationItem) => {
        const newStatus = occupationItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: occupationItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeOccupationStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setOccupationList(prevList =>
                prevList.map(item =>
                    item._id === occupationItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Occupation status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating occupation status:", error);
            toast.error("Failed to update occupation status");
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "Sno.",
            width: 80
        },
        {
            field: "name",
            headerName: "Occupation",
            width: 300,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.name}</p>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => (
                <div className='mt-3'>
                    <ToggleButton
                        value={params.row.status === "Active"}
                        onToggle={() => handleToggleStatus(params.row)}
                    />
                </div>
            ),
        },
        {
            field: "date",
            headerName: "Date",
            width: 200,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-2">Added Date: {moment(params.row?.date?.add_date).format('DD/MM/YYYY')}</p>
                    <p className="color-black">Updated Date: {moment(params.row?.date?.add_date).format('DD/MM/YYYY')}</p>
                </div>
            ),
        },
        {
            field: "Edit",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
                <button
                    type='button'
                    className='btn btn-primary'
                    onClick={(e) => handleEdit(e, params.row)}
                    style={{ height: "35px", lineHeight: "12px" }}
                >
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },
    ];

    const filteredRows = occupationList.map((occupationItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: occupationItem?.name,
        status: occupationItem?.status,
        _id: occupationItem?._id,
        data:occupationItem,
    }));

    const rowHeight = 80;
    const gridHeight = Math.min(filteredRows.length, paginationModel.pageSize) * rowHeight + 110;

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Occupation</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddOccupation}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Occupation</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter occupation"
                                                    value={occupationName}
                                                    //onChange={(e) => setOccupationName(e.target.value)}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setOccupationName(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3 mt-2">
                                                <Form.Label>Status</Form.Label>
                                                <div className="d-flex">
                                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Form.Check
                                                            type="radio"
                                                            name="status"
                                                            value="Active"
                                                            checked={status === 'Active'}
                                                            onChange={(e) => setStatus(e.target.value)}
                                                        /> &nbsp;
                                                        Active
                                                    </label> &nbsp;
                                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Form.Check
                                                            type="radio"
                                                            name="status"
                                                            value="Inactive"
                                                            checked={status === 'Inactive'}
                                                            onChange={(e) => setStatus(e.target.value)}
                                                        /> &nbsp;
                                                        Inactive
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 mt-4">
                                            <Button className="sitebtn btnblue fullbtn" variant="primary" type="submit">
                                                {edit.editStatus ? "Update" : "Submit"}
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <div className="projectcard ">
                                <DataGrid
                                    rows={filteredRows}
                                    columns={columns}
                                    paginationModel={paginationModel}
                                    onPaginationModelChange={handlePaginationModelChange}
                                    rowCount={totalRows}
                                    pageSizeOptions={[10, 20]}
                                    disableRowSelectionOnClick
                                    paginationMode="server"
                                    rowHeight={rowHeight}
                                    filterModel={filterModel}
                                    onFilterModelChange={handleFilterModelChange}                        
                                    disableColumnSelector
                                    disableDensitySelector
                                    disableColumnFilter={false} // Enable column filtering   
                                    slots={{ toolbar: CustomToolbar }}
                                    slotProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                        },
                                    }}
                                    sx={{
                                        minHeight:'300px',
                                        height:'700px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Occupation;


