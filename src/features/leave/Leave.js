import React, { useState, useEffect, useCallback } from 'react';
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

const Leave = () => {
    const [name, setName] = useState("");
    const [allowed, setAllowed] = useState("");
    const [_allow , setAllow] = useState("");
    const [sort_name, setSort_name] = useState("");
    const [LeaveTypes , setLeaveType] = useState("" ?? null);
    const [status, setStatus] = useState("Active");
    const [stateList, setStateList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel); // Store the filter model if needed
    };

    const [edit, setEdit] = useState({
        LeaveName: '',
        LeaveAllowed: '',
        LeaveSortName: '',
        stateStatus: '',
        LeaveId: "",
        LeaveType: "",
        allowed_for_five_days:0,
        allowed_for_six_days:0,
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
            setName(edit.LeaveName);
            setAllowed(edit?.allowed_for_five_days ?? 0 )
            setSort_name(edit.LeaveSortName)
            setAllow(edit?.allowed_for_six_days ?? 0)
            setStatus(edit.stateStatus);
            setLeaveType(edit?.LeaveType)
        }
    }, [edit]);

    const handleAddState = async (e) => {
        e.preventDefault();
        const payload = { 
            name,
            status,
            allowed_for_five_days:allowed,
            allowed_for_six_days:_allow,
            sort_name,
            leave_type:LeaveTypes,
        };

        if (!name) {
            return toast.warn('Please Enter the name');
        }
        if (!sort_name) {
            return toast.warn('Please Enter the sort_name');
        }
        if(!LeaveTypes){
            return toast.warn('Please Select Leave Type');
        }
        if (!allowed) {
            return toast.warn('Please Enter the allowed 5 Day leave');
        }
        if(!_allow){
            return toast.warn('Please Allowed the 6 Day Leave');
        }

        try {
            const response = await axios.post(`${config.API_URL}addLeaveType`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setName("");
            setAllowed("")
            setAllow('')
            setLeaveType('');
            setSort_name("")
            setStatus("Active");
            handleGetStateList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("Leave already exists");
            } else {
                console.error(err);
                toast.error("Failed to add Leave");
            }
        }
    };

    const handleGetStateList = useCallback(async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {
            const response = await axios.post(`${config.API_URL}getLeaveTypeList`, payload, apiHeaderToken(config.API_TOKEN));
            setStateList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    } , [paginationModel , filterModel]);

    const handleGetStateListTotal = useCallback(async (input = '') => {
        const payload = {
            page_no: 1,
            per_page_record: 1000,
            status: '',
            keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getLeaveTypeList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    } , [filterModel]);

    useEffect(() => {
        handleGetStateList();
    }, [handleGetStateList, paginationModel]);

    useEffect(() => {
        handleGetStateListTotal();
    }, [handleGetStateListTotal, filterModel]);

    

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            LeaveName: data?.name,
            // LeaveAllowed: data?.allowed,
            LeaveSortName: data?.sort_name,
            LeaveType:data?.leave_type,
            allowed_for_five_days:data?.allowed_for_five_days,
            allowed_for_six_days:data?.allowed_for_six_days,
            LeaveId: data?._id,
            stateStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        // const payload = { , name, status, allowed, sort_name };
        const payload = { 
            _id: edit.LeaveId,
            name,
            status,
            allowed_for_five_days: parseInt(allowed),
            allowed_for_six_days:_allow,
            sort_name,
            leave_type:LeaveTypes,
        };
        if (!name) {
            return toast.warn('Please Enter the name');
        }
        if (!sort_name) {
            return toast.warn('Please Enter the sort_name');
        }
        if (!allowed) {
            return toast.warn('Please Enter the allowed');
        }
        if(!LeaveTypes){
            return toast.warn("Please Select The Leave Type")
        }
        try {
            const response = await axios.post(`${config.API_URL}editLeaveType`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setStateList(prevList =>
                prevList.map(item =>
                    item._id === edit.LeaveId ? { ...item, name, status, allowed_for_five_days:allowed, allowed_for_six_days:_allow ,  sort_name } : item
                )
            );
            setEdit({
                LeaveName: '',
                // LeaveAllowed: data?.allowed,
                LeaveSortName: '',
                LeaveType:'',
                allowed_for_five_days:'',
                allowed_for_six_days:'',
                LeaveId: '',
                stateStatus: '',
                editStatus: false
            });
            setName("");
            setAllowed("")
            setSort_name("")
            setStatus("Active");
            setLeaveType("")
            setAllow("")
        } catch (error) {
            console.error("Error updating state:", error);
            toast.error("Failed to update state");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (leaveItem) => {
        const newStatus = leaveItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: leaveItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeLeaveTypeStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setStateList(prevList =>
                prevList.map(item =>
                    item._id === leaveItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Leave status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating Leave status:", error);
            toast.error("Failed to update Leave status");
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
            headerName: "Name",
            width: 250,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.name}</p>
                </div>
            ),
        },
        {
            field: "sort_name",
            headerName: "Short Name",
            width: 180,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.sort_name}</p>
                </div>
            ),
        },
        {
            field: "allowed",
            headerName: "Allowed",
            width: 200,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black "> 5 Working Day :{params?.row?.data?.allowed_for_five_days}</p>
                    <span className="color-black "> 6 Working Day :{params?.row?.data?.allowed_for_six_days}</span>
                </div>
            ),
        },
        {
            field: "data",
            headerName: "Leave Type",
            width: 100,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black ">{params?.row?.data?.leave_type}</p>
                    {/* <span className="color-black "> 6 Working Day :{params?.row?.data?.allowed_for_six_days}</span> */}
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 100,
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
            width: 100,
            renderCell: (params) => (
                <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params?.row?.data)} style={{ height: "35px", lineHeight: "12px" }}>
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },
    ];

    const filteredRows = stateList && stateList.map((leaveItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: leaveItem?.name,
        sort_name: leaveItem?.sort_name,
        allowed: leaveItem?.allowed,
        status: leaveItem?.status,
        _id: leaveItem?._id,
        data:leaveItem,
        date:leaveItem
    }));

    const rowHeight = 80;
    const gridHeight = Math.max(filteredRows.length * rowHeight + 150, 400);

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Leave</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddState}>
                                    <div className='row'>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Leave name"
                                                    value={name}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setName(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Short Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Short Leave name"
                                                    value={sort_name}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setSort_name(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Leave Type</Form.Label>
                                                <Form.Select
                                                    placeholder="Select The Leave Types"
                                                    value={LeaveTypes}
                                                    onChange={(e) => {
                                                            setLeaveType(e.target.value);
                                                    }}
                                                >
                                                    <option value="">Choose One...</option>
                                                    <option value="Paid">Paid</option>
                                                    <option value="Unpaid">Unpaid</option>
                                                </Form.Select>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Allowed (5 Days Working)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Allowed Leave(s) in a Year"
                                                    value={allowed}
                                                    onChange={(e) => {
                                                        const regex = /^\d*$/;
                                                        const value = e.target.value;
                                                        if (regex.test(value) && value.length <= 2) {
                                                            setAllowed(value);
                                                        }
                                                    }}
                                                //onChange={(e)=>setAllowed(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Allowed (6 Days Working)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Allowed Leave(s) in a Year"
                                                    value={_allow}
                                                    onChange={(e) => {
                                                        const regex = /^\d*$/;
                                                        const value = e.target.value;
                                                        if (regex.test(value) && value.length <= 2) {
                                                            setAllow(value);
                                                        }
                                                    }}
                                                //onChange={(e)=>setAllowed(e.target.value)}
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
                                        <div className="col-sm-3 mt-3">
                                            <Button className="sitebtn btnblue fullbtn" variant="primary" type="submit">
                                                {edit.editStatus ? "Update" : "Submit"}
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <div className="projectcard mt-4">
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
                                        height:gridHeight
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

export default Leave;
