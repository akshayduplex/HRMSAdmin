import React, { useState, useEffect, useMemo } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridToolbar , useGridApiRef  } from "@mui/x-data-grid";
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
import CustomToolbarExport from '../CommonFilter/CustomeToolBarExport';

const Department = () => {
    const [departmentName, setDepartmentName] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("Active");
    const [departmentList, setDepartmentList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);
    const apiRef = useGridApiRef();

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel);
    };


    const [edit, setEdit] = useState({
        departmentName: '',
        departmentPriority: '',
        departmentStatus: '',
        departmentId: "",
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
            setDepartmentName(edit.departmentName);
            setPriority(edit.departmentPriority)
            setStatus(edit.departmentStatus);
        }
    }, [edit]);

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        const payload = { name: departmentName, status, priority };
        if (!departmentName) {
            return toast.warn('Please Enter the department');
        }
        if (!priority) {
            return toast.warn('Please Enter the priority');
        }
        try {
            const response = await axios.post(`${config.API_URL}addDepartment`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setDepartmentName("");
            setPriority("");
            setStatus("Active");
            fetchDepartments();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("department already exists");
            } else {
                console.error(err);
                toast.error("Failed to add department");
            }
        }
    };

    const fetchDepartments = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            filter_keyword: filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {
            const response = await axios.post(`${config.API_URL}getDepartmentList`, payload, apiHeaderToken(config.API_TOKEN));
            setDepartmentList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchDepartmentsTotal = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1, // API is 1-indexed, DataGrid is 0-indexed
            per_page_record: 10000,
            status: '',
            filter_keyword: filterModel?.quickFilterValues?.join(" ").toLowerCase()
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getDepartmentList`, payload  , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        fetchDepartmentsTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            departmentName: data.name,
            departmentId: data._id,
            departmentStatus: data.status,
            departmentPriority: data.priority,
            isEditing: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.departmentId, name: departmentName, status, priority };

        if (!departmentName) {
            return toast.warn('Please Enter the department');
        }
        if (!priority) {
            return toast.warn('Please Enter the priority');
        }
        try {
            const response = await axios.post(`${config.API_URL}editDepartment`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setDepartmentList(prevList =>
                prevList.map(item =>
                    item._id === edit.departmentId ? { ...item, name: departmentName, status, priority } : item
                )
            );
            setEdit({
                departmentName: '',
                departmentPriority: '',
                departmentStatus: '',
                departmentId: "",
                isEditing: false
            });
            setDepartmentName("");
            setPriority("");
            setStatus("Active");
        } catch (err) {
            toast.error(err.data.message)
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (departmentItem) => {
        const newStatus = departmentItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: departmentItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeDepartmentStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setDepartmentList(prevList =>
                prevList.map(item =>
                    item._id === departmentItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Department status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating department status:", error);
            toast.error("Failed to update department status");
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "Sno.",
            width: 50,
            export: true

        },
        {
            field: "name",
            headerName: "Department",
            width: 300,
            export: true,
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
            export: false,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.priority}</p>
                </div>
            ),
        },

        {
            field: "status",
            headerName: "Status",
            width: 180,
            export: true,
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
            width: 100,
            disableExport: true,  // Add this line
            renderCell: (params) => (
                <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },
    ];

    const filteredRows = departmentList.map((departmentItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: departmentItem?.name,
        status: departmentItem?.status,
        priority: departmentItem?.priority,
        _id: departmentItem?._id,
        date: departmentItem
    }));

    const exportableColumns = [
        'id',     // Include only field names, not the full column definitions
        'name',
        'priority',
        'status'
    ];    

    const rowHeight = 60;
    const gridHeight = Math.min(filteredRows.length, paginationModel.pageSize) * rowHeight + 110;

    const toolbarComponent = useMemo(
        () => <CustomToolbarExport api="getDepartmentList" />,
        []
     );
      

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Department</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard" style={{ minHeight: '500px' }}>
                            <div className="projectcard">
                                <Form onSubmit={edit.isEditing ? handleSubmitEdit : handleAddDepartment}>
                                    <div className='row'>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Department</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Department"
                                                    value={departmentName}
                                                    // onChange={(e) => setDepartmentName(e.target.value)}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z& ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setDepartmentName(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>priority</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter priority"
                                                    value={priority}
                                                    // onChange={(e)=>setPriority(e.target.value)}
                                                    onChange={(e) => {
                                                        const regex = /^\d*$/;
                                                        const value = e.target.value;
                                                        if (regex.test(value) && value.length <= 5) {
                                                            setPriority(value);
                                                        }
                                                    }} />

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
                                    pageSizeOptions={[10, 20 , 40 , 50 , 70 , 80 , 99]}
                                    disableRowSelectionOnClick
                                    paginationMode="server"
                                    rowHeight={rowHeight}
                                    filterModel={filterModel}
                                    onFilterModelChange={handleFilterModelChange}
                                    disableColumnSelector
                                    disableDensitySelector
                                    disableColumnFilter={false} // Enable column filtering   
                                    slots={{ toolbar: CustomToolbarExport  }}
                                    slotProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                            csvOptions: {
                                                // fields: exportableColumns,
                                                fileName: 'department-list',
                                                // delimiter: ',',
                                                utf8WithBom: true,
                                                // allColumns: false,
                                                fields: ['id', 'name', 'priority', 'status'], // Explicitly specify fields to export
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
                                        minHeight: '400px'
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

export default Department;