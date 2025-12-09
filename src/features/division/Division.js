import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import ToggleButton from 'react-toggle-button';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import moment from 'moment';
import CustomToolbar from '../CommonFilter/CustomeToolBar';
import CustomToolbarExport from '../CommonFilter/CustomeToolBarExport';

const Division = () => {
    const [divisionName, setDivisionName] = useState("");
    const [status, setStatus] = useState("Active");
    const [divisionList, setDivisionList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel);
    };

    const [edit, setEdit] = useState({
        divisionName: '',
        divisionStatus: '',
        divisionId: "",
        editStatus: false
    });

    const handleChanges = (obj) => {
        setEdit((prevEdit) => ({
            ...prevEdit,
            ...obj
        }));
    };

    useEffect(() => {
        if (edit.editStatus) {
            setDivisionName(edit.divisionName);
            setStatus(edit.divisionStatus);
        }
    }, [edit]);

    const handleAddDivision = async (e) => {
        e.preventDefault();
        const payload = { name: divisionName, status };

        if (!divisionName) {
            return toast.warn('Please Enter the division');
        }

        try {
            const response = await axios.post(`${config.API_URL}addDivision`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setDivisionName("");
            setStatus("Active");
            handleGetDivisionList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("division already exists");
            } else {
                console.error(err);
                toast.error("Failed to add division");
            }
        }
    };

    const handleGetDivisionList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ')?.toLowerCase(),
        };
        try {
            const response = await axios.post(`${config.API_URL}getDivisionList`, payload, apiHeaderToken(config.API_TOKEN));
            setDivisionList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching divisions:", error);
        }
    };
    const handleGetDivisionListTotal = async (input = '') => {
        const payload = {
            page_no: 1,
            per_page_record: 10000,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ')?.toLowerCase(),
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getDivisionList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching divisions:", error);
        }
    };

    useEffect(() => {
        handleGetDivisionList();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        handleGetDivisionListTotal()
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            divisionName: data?.name,
            divisionId: data?._id,
            divisionStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.divisionId, name: divisionName, status };
        if (!divisionName) {
            return toast.warn('Please Enter the division');
        }
        try {
            const response = await axios.post(`${config.API_URL}editDivision`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setDivisionList(prevList =>
                prevList.map(item =>
                    item._id === edit.divisionId ? { ...item, name: divisionName, status } : item
                )
            );
            setEdit({
                divisionName: '',
                divisionStatus: '',
                divisionId: "",
                editStatus: false
            });
            setDivisionName("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating division:", error);
            toast.error("Failed to update division");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (divisionItem) => {
        const newStatus = divisionItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: divisionItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeDivisionStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setDivisionList(prevList =>
                prevList.map(item =>
                    item._id === divisionItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Division status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating division status:", error);
            toast.error("Failed to update division status");
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
            headerName: "Division",
            width: 250,
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
            width: 300,
            disableExport: true,  // Add this line
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-2">Added Date: {moment(params.row?.date?.add_date).format('DD/MM/YYYY')}</p>
                    <p className="color-black">Updated Date: {moment(params.row?.date?.updated_on).format('DD/MM/YYYY')}</p>
                </div>
            ),
        },
        {
            field: "Edit",
            headerName: "Action",
            width: 150,
            disableExport: true,  // Add this line
            renderCell: (params) => (
                <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },
    ];

    const filteredRows = divisionList.map((divisionItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: divisionItem?.name,
        status: divisionItem?.status,
        _id: divisionItem?._id,
        date: divisionItem
    }));


    const rowHeight = 60;
    const gridHeight = Math.min(filteredRows.length, paginationModel.pageSize) * rowHeight + 110;

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Division</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard" style={{minHeight:'500px'}}>
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddDivision}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Division</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter division"
                                                    value={divisionName}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setDivisionName(e.target.value);
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
                                    pageSizeOptions={[10, 20 , 40 , 50 , 70 , 80 , 99]}
                                    disableRowSelectionOnClick
                                    paginationMode="server"
                                    rowHeight={rowHeight}
                                    filterModel={filterModel}
                                    onFilterModelChange={handleFilterModelChange}                        
                                    disableColumnSelector
                                    disableDensitySelector
                                    disableColumnFilter={false} // Enable column filtering   
                                    slots={{ toolbar: CustomToolbarExport }}
                                    slotProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                            csvOptions: {
                                                fileName: 'division-list',
                                                utf8WithBom: true,
                                                fields: ['id', 'name', 'priority', 'status'],
                                                getRowsToExport: (params) => {
                                                    return params.apiRef
                                                        .getVisibleRowModels()
                                                        .map(row => ({
                                                            id: row.id,
                                                            name: row.name,
                                                            priority: row.priority,
                                                            status: row.status
                                                        }));
                                                }
                                            },
                                        },
                                    }}
                                    sx={{
                                        minHeight:'300px'
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

export default Division;





