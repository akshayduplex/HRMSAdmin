
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

const Duration = () => {
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("Active");
    const [durationList, setDurationList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);
    const [edit, setEdit] = useState({
        durationName: '',
        durationStatus: '',
        durationId: "",
        editStatus: false
    });

    const [filterModel, setFilterModel] = useState({
        items: [],
      });
    
    const handleFilterModelChange = (newFilterModel) => {
        const input = newFilterModel?.quickFilterValues?.join(' ')?.toLowerCase();
        // handleGetDesignation(input); 
        setFilterModel(newFilterModel); 
    };

    const handleChanges = (obj) => {
        setEdit((prevEdit) => ({
            ...prevEdit,
            ...obj
        }));
    };

    useEffect(() => {
        if (edit.editStatus) {
            setDuration(edit.durationName);
            setStatus(edit.durationStatus);
        }
    }, [edit]);

    const handleAddDuration = async (e) => {
        e.preventDefault();
        const payload = { duration, status };
        if(!duration){
            return toast.warn('Please Enter the duration');
         }

        try {
            const response = await axios.post(`${config.API_URL}addDuration`, payload, apiHeaderToken(config.API_TOKEN));
           
            if(response.data.status===true){
                toast.success(response.data.message);
            }else{
                toast.warn(response.data.message); 
            }
            setDuration("");
            setStatus("Active");
            handleGetDuration();
        } catch (err) {
            console.log(err)
        }
    };

    const handleGetDuration = async () => {
        const payload = {
            page_no: paginationModel.page + 1, // API is 1-indexed, DataGrid is 0-indexed
            per_page_record: paginationModel.pageSize,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ')?.toLowerCase()
        };
        try {
            const response = await axios.post(`${config.API_URL}getDurationList`, payload, apiHeaderToken(config.API_TOKEN));
            setDurationList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching durations:", error);
        }
    };

    const handleGetDurationTotalCount = async () => {
        const payload = {
            page_no: paginationModel.page + 1, // API is 1-indexed, DataGrid is 0-indexed
            per_page_record: 10000,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ')?.toLowerCase()
        };
        try {
            const responseTotal = await axios.post(`${config?.API_URL}getDurationList` , payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching durations:", error);
        }
    };

    useEffect(() => {
        handleGetDuration();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        handleGetDurationTotalCount()
    } , [filterModel])

    const handleEdit = (e, data) => {
        console.log(data)
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            durationName: data?.name,
            durationId: data?._id,
            durationStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.durationId, duration, status };
        if(!duration){
            return toast.warn('Please Enter the duration');
         }
        try {
            const response = await axios.post(`${config.API_URL}editDuration`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setDurationList(prevList =>
                prevList.map(item =>
                    item._id === edit.durationId ? { ...item, duration, status } : item
                )
            );
            setEdit({
                durationName: '',
                durationStatus: '',
                durationId: "",
                editStatus: false
            });
            setDuration("");
            setStatus("Active");
        } catch (err) {
            toast.error(err.data.message);
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (durationItem) => {
        const newStatus = durationItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: durationItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeDurationStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setDurationList(prevList =>
                prevList.map(item =>
                    item._id === durationItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Duration status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating duration status:", error);
            toast.error("Failed to update duration status");
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
            headerName: "Duration",
            width: 200,
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
                    {/* <span style={{ transform: "TranslateY(-1px)" }}>{params.row.status}</span> */}
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
                <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },
    ];

    const filteredRows = durationList.map((durationItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: durationItem?.duration,
        status: durationItem?.status,
        _id: durationItem?._id,
        date:durationItem
    }));

    const rowHeight = 80;
    const gridHeight = Math.min(filteredRows.length * rowHeight);

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Duration</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddDuration}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Duration</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter duration"
                                                    value={duration}
                                                    //onChange={(e) => setDuration(e.target.value)}
                                                    onChange={(e) => {
                                                        const regex = /^\d{1,2}[A-Za-z() ]*$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setDuration(e.target.value);
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
                                    filterModel={filterModel}
                                    onFilterModelChange={handleFilterModelChange}                                          
                                    paginationMode="server"
                                    rowHeight={rowHeight}
                                    disableColumnSelector
                                    disableDensitySelector
                                    disableColumnFilter={false} // Enable column filtering   
                                    slots={{ toolbar: CustomToolbar }}
                                    slotProps={{
                                        toolbar: {
                                            showQuickFilter: false,
                                        },
                                    }}
                                    sx={{
                                        minHeight:gridHeight
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

export default Duration;




