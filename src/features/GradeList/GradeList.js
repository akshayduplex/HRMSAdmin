import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToggleButton from 'react-toggle-button';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import moment from 'moment';
import CustomToolbar from '../CommonFilter/CustomeToolBar';

const GradeList = () => {
    const [name, setName] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("Active");
    const [gradeList, setGradeList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        console.log("Filter Model Changed:", newFilterModel);
        const input = newFilterModel?.quickFilterValues?.[0]; // Get the value of the first filter
        fetchGrades(input); // Call your function with the input value
        setFilterModel(newFilterModel); // Store the filter model if needed
    };

    const [edit, setEdit] = useState({
        gradeName: '',
        gradePriority:'',
        gradeStatus: '',
        gradeId: "",
        isEditing: false
    });

    const handleChanges = (obj) => {
        setEdit((prevEdit) => ({
            ...prevEdit,
            ...obj
        }));
    };

    useEffect(() => {
        if (edit.isEditing) {
            setName(edit.gradeName);
            setPriority(edit.gradePriority)
            setStatus(edit.gradeStatus);
        }
    }, [edit]);

    const handleAddGrade = async (e) => {
        e.preventDefault();
        const payload = { name, status, priority };
        if (!name) {
            return toast.warn('Please Enter the grade');
        }
        if (!priority) {
            return toast.warn('Please Enter the priority');
        }
        try {
            const response = await axios.post(`${config.API_URL}AddGradeData`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setName("");
            setPriority("");
            setStatus("Active");
            fetchGrades();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("Grade already exists");
            } else {
                console.error(err);
                toast.error("Failed to add grade");
            }
        }
    };

    const fetchGrades = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1, // API is 1-indexed, DataGrid is 0-indexed
            per_page_record: paginationModel.pageSize,
            status: '',
            keyword:input
        };
        try {
            const response = await axios.post(`${config.API_URL}getGradeList`, payload, apiHeaderToken(config.API_TOKEN));
            setGradeList(response.data.data || []);
            const responseTotal = await axios.post(`${config.API_URL}getGradeList`, {
                page_no: 1, per_page_record: 1000000, status: ''
            }, apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching grades:", error);
        }
    };

    useEffect(() => {
        fetchGrades();
    }, [paginationModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
           gradeName: data.name,
            gradeId: data._id,
            gradeStatus: data.status,
           gradePriority: data.priority, 
            isEditing: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.gradeId, name, status, priority };

        if (!name) {
            return toast.warn('Please Enter the grade');
        }
        if (!priority) {
            return toast.warn('Please Enter the priority');
        }
        try {
            const response = await axios.post(`${config.API_URL}editGradeData`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setGradeList(prevList =>
                prevList.map(item =>
                    item._id === edit.gradeId ? { ...item, name, status, priority } : item
                )
            );
            setEdit({
                gradeName: '',
                gradePriority:'',
                gradeStatus: '',
                gradeId: "",
                isEditing: false
            });
            setName("");
            setPriority("");
            setStatus("Active");
        } catch (err) {
            toast.error(err.data.message);
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (gradeItem) => {
        const newStatus = gradeItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: gradeItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeGradeStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setGradeList(prevList =>
                prevList.map(item =>
                    item._id === gradeItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Grade status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating grade status:", error);
            toast.error("Failed to update grade status");
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "Sno.",
            width: 50
        },
        {
            field: "name",
            headerName: "Grade Name",
            width: 300,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.name}</p>
                </div>
            ),
        },
        {
            field: "priority",
            headerName: "Priority",
            width: 80,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.priority}</p>
                </div>
            ),
        },
        
        {
            field: "status",
            headerName: "Status",
            width: 200,
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
            width: 200,
            renderCell: (params) => (
                <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },
    ];

    const filteredRows = gradeList.map((gradeItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: gradeItem?.name,
        status: gradeItem?.status,
        priority: gradeItem?.priority,
        _id: gradeItem?._id,
        date:gradeItem,
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
                            <h3>Add Grade List</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.isEditing ? handleSubmitEdit : handleAddGrade}>
                                    <div className='row'>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Grade</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Grade"
                                                    value={name}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z0-9 ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setName(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Priority</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Priority"
                                                    value={priority}
                                                   onChange={(e) => {
                                                    const regex = /^\d*$/;
                                                    const value = e.target.value;
                                                    if (regex.test(value) && value.length<=5) {
                                                        setPriority(value);
                                                    }
                                                  }}/>

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
                                                {edit.isEditing ? "Update" : "Submit"}
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

export default GradeList;
