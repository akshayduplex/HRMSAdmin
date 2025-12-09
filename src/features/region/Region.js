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

const Region = () => {
    const [regionName, setRegionName] = useState("");
    const [status, setStatus] = useState("Active");
    const [regionList, setRegionList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    
    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel); // Store the filter model if needed
    };
    const [totalRows, setTotalRows] = useState(0);
    const [edit, setEdit] = useState({
        stateName: '',
        stateStatus: '',
        stateId: "",
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
            setRegionName(edit.stateName);
            setStatus(edit.stateStatus);
        }
    }, [edit]);

    const handleAddState = async (e) => {
        e.preventDefault();
        const payload = { name: regionName, status };

        
        if(!regionName){
            return toast.warn('Please Enter the region Name');
         }

        try {
            const response = await axios.post(`${config.API_URL}addRegion`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setRegionName("");
            setStatus("Active");
            handleGetStateList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("region already exists");
            } else {
                console.error(err);
                toast.error("Failed to add region");
            }
        }
    };

    const handleGetStateList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {
            const response = await axios.post(`${config.API_URL}getRegionList`, payload, apiHeaderToken(config.API_TOKEN));
            setRegionList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching region:", error);
        }
    };
    
    const handleGetStateListTotal = async (input = '') => {
        const payload = {
            page_no: 1,
            per_page_record: 10000,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {

            const responseTotal = await axios.post(`${config.API_URL}getRegionList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching region:", error);
        }
    };

    useEffect(() => {
        handleGetStateList();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        handleGetStateListTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            stateName: data?.name,
            stateId: data?._id,
            stateStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.stateId, name: regionName, status };
        if(!regionName){
            return toast.warn('Please Enter the region Name');
         }
        try {
            const response = await axios.post(`${config.API_URL}editRegion`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setRegionList(prevList =>
                prevList.map(item =>
                    item._id === edit.stateId ? { ...item, name: regionName, status } : item
                )
            );
            setEdit({
                stateName: '',
                stateStatus: '',
                stateId: "",
                editStatus: false
            });
            setRegionName("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating region:", error);
            toast.error("Failed to update region");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (stateItem) => {
        const newStatus = stateItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: stateItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeRegionStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setRegionList(prevList =>
                prevList.map(item =>
                    item._id === stateItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Region status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating region status:", error);
            toast.error("Failed to update region status");
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
            headerName: "Region",
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

    const filteredRows = regionList.map((stateItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: stateItem?.name,
        status: stateItem?.status,
        _id: stateItem?._id,
        date:stateItem,
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
                            <h3>Add Region</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard" style={{minHeight:'500px'}}>
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddState}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Region</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Region"
                                                    value={regionName}
                                                    // onChange={(e) => setRegionName(e.target.value)}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setRegionName(e.target.value);
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
                                    rowHeight={80}
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
                                        maxHeight:'800px'
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

export default Region;
