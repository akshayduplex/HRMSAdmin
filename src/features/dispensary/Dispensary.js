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

const Dispensary = () => {
    const [dispensaryName, setDispensaryName] = useState("");
    const [status, setStatus] = useState("Active");
    const [dispensaryList, setDispensaryList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel); 
    };

    const [edit, setEdit] = useState({
        dispensaryName: '',
        dispensaryStatus: '',
        dispensaryId: "",
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
            setDispensaryName(edit.dispensaryName);
            setStatus(edit.dispensaryStatus);
        }
    }, [edit]);

    const handleAddDispensary = async (e) => {
        e.preventDefault();
        const payload = { name: dispensaryName, status };
        if (!dispensaryName) {
            return toast.warn('Please Enter the dispensary');
        }

        try {
            const response = await axios.post(`${config.API_URL}addDispensary`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setDispensaryName("");
            setStatus("Active");
            handleGetDispensaryList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("dispensary already exists");
            } else {
                console.error(err);
                toast.error("Failed to add dispensary");
            }
        }
    };

    const handleGetDispensaryList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase(),
        };
        try {
            const response = await axios.post(`${config.API_URL}getDispensaryList`, payload, apiHeaderToken(config.API_TOKEN));
            setDispensaryList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching dispensary list:", error);
        }
    };
    const handleGetDispensaryListTotal = async (input = '') => {
        const payload = {
            page_no: 1,
            per_page_record: 1000,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase(),
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getDispensaryList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching dispensary list:", error);
        }
    };

    useEffect(() => {
        handleGetDispensaryList();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        handleGetDispensaryListTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            dispensaryName: data?.name,
            dispensaryId: data?._id,
            dispensaryStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.dispensaryId, name: dispensaryName, status };

        if (!dispensaryName) {
            return toast.warn('Please Enter the dispensary');
        }
        try {
            const response = await axios.post(`${config.API_URL}editDispensary`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setDispensaryList(prevList =>
                prevList.map(item =>
                    item._id === edit.dispensaryId ? { ...item, name: dispensaryName, status } : item
                )
            );
            setEdit({
                dispensaryName: '',
                dispensaryStatus: '',
                dispensaryId: "",
                editStatus: false
            });
            setDispensaryName("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating dispensary:", error);
            toast.error("Failed to update dispensary");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (dispensaryItem) => {
        const newStatus = dispensaryItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: dispensaryItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeDispensaryStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setDispensaryList(prevList =>
                prevList.map(item =>
                    item._id === dispensaryItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Dispensary status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating dispensary status:", error);
            toast.error("Failed to update dispensary status");
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
            headerName: "Dispensary",
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

    const filteredRows = dispensaryList.map((dispensaryItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: dispensaryItem?.name,
        status: dispensaryItem?.status,
        _id: dispensaryItem?._id,
        date:dispensaryItem
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
                            <h3>Add Dispensary</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddDispensary}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Dispensary</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter dispensary"
                                                    value={dispensaryName}

                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setDispensaryName(e.target.value);
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
                                        maxHeight:'800px',
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

export default Dispensary;
