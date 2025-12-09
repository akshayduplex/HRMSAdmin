
import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import ToggleButton from 'react-toggle-button';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import moment from 'moment';
import { GridToolbarQuickFilter } from '@mui/x-data-grid';

const CustomToolbar = ({ csvOptions }) => (
    <GridToolbarContainer>
        <GridToolbarExport csvOptions={csvOptions} />
        <GridToolbarQuickFilter />
    </GridToolbarContainer>
);


const Bank = () => {
    const [bankName, setBankName] = useState("");
    const [status, setStatus] = useState("Active");
    const [bankList, setBankList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        const input = filterModel?.quickFilterValues?.[0]; // Get the value of the first filter
        handleGetBankList(input); // Call your function with the input value
        setFilterModel(newFilterModel); // Store the filter model if needed
    };

    const [edit, setEdit] = useState({
        bankName: '',
        bankStatus: '',
        bankId: "",
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
            setBankName(edit.bankName);
            setStatus(edit.bankStatus);
        }
    }, [edit]);

    const handleAddBank = async (e) => {
        e.preventDefault();
        const payload = { name: bankName, status };

        if (!bankName) {
            return toast.warn('Please Enter the bank Name');
        }

        try {
            const response = await axios.post(`${config.API_URL}addBank`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setBankName("");
            setStatus("Active");
            handleGetBankList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("Bank already exists");
            } else {
                console.error(err);
                toast.error("Failed to add bank");
            }
        }
    };

    const handleGetBankList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase(),
        };
        try {
            const response = await axios.post(`${config.API_URL}getBankList`, payload, apiHeaderToken(config.API_TOKEN));
            setBankList(response?.data?.data || []);

        } catch (error) {
            console.error("Error fetching Bank:", error);
        }
    };

    const handleGetBankListTotal = async (input = '') => {
        const payload = {
            page_no:  1,
            per_page_record: 1000,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase(),
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getBankList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching Bank:", error);
        }
    };

    useEffect(() => {
        handleGetBankList();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        handleGetBankListTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            bankName: data?.name,
            bankId: data?._id,
            bankStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.bankId, name: bankName, status };
        if (!bankName) {
            return toast.warn('Please Enter the bank Name');
        }
        try {
            const response = await axios.post(`${config.API_URL}editBank`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setBankList(prevList =>
                prevList.map(item =>
                    item._id === edit.bankId ? { ...item, name: bankName, status } : item
                )
            );
            setEdit({
                bankName: '',
                bankStatus: '',
                bankId: "",
                editStatus: false
            });
            setBankName("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating Bank:", error);
            toast.error("Failed to update Bank");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (bankItem) => {
        const newStatus = bankItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: bankItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeBankStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setBankList(prevList =>
                prevList.map(item =>
                    item._id === bankItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Bank status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating Bank status:", error);
            toast.error("Failed to update Bank status");
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "Sno.",
            width: 80
        },
        {
            field: "addedDate",
            headerName: "addedDate",
            width: 80
        },
        {
            field: "updatedDate",
            headerName: "updatedDate",
            width: 80
        },
        {
            field: "Status",
            headerName: "Status",
            width: 80
        },
        {
            field: "name",
            headerName: "Bank",
            width: 400,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.name}</p>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
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
            width: 400,
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

    const filteredRows = bankList.map((bankItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: bankItem?.name,
        status: bankItem?.status,
        Status: bankItem?.status,
        _id: bankItem?._id,
        date:bankItem,
        addedDate:bankItem?.add_date,
        updatedDate:bankItem?.updated_on,
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
                            <h3>Add Bank</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddBank}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Bank</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Bank"
                                                    value={bankName}

                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z()-/ ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setBankName(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3 mt-2">
                                                <Form.Label>Status</Form.Label>
                                                <div className="d-flex">
                                                    <Form.Check
                                                        type="radio"
                                                        name="status"
                                                        label="Active"
                                                        value="Active"
                                                        checked={status === 'Active'}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                    />
                                                    &nbsp;
                                                    <Form.Check
                                                        type="radio"
                                                        name="status"
                                                        label="Inactive"
                                                        value="Inactive"
                                                        checked={status === 'Inactive'}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                    />
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
                                    initialState={{
                                        columns:{
                                            columnVisibilityModel: {
                                                addedDate:false,
                                                updatedDate:false,
                                                Status:false
                                            }
                                        }
                                    }}
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
                                            csvOptions: {
                                                fields:['id' , 'name' ,'Status' ,'addedDate','updatedDate']
                                            }
                                        },
                                    }}
                                    sx={{
                                        height:'800px'
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

export default Bank;

