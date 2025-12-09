
import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
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
import { MdDelete } from 'react-icons/md';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';

const CustomToolbar = ({ csvOptions }) => (
    <GridToolbarContainer>
        <GridToolbarExport csvOptions={csvOptions} />
        <GridToolbarQuickFilter />
    </GridToolbarContainer>
);

// Manages Here Forword Fef if we Possible 
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BatchId = () => {
    const [BatchId, setBatchId] = useState("");
    const [status, setStatus] = useState("Active");
    const [batchIdList, setBatchIdList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [DeletedData , setDeletedData] = useState(null);
    const [edit, setEdit] = useState({
        batchIdName: '',
        batchIdStatus: '',
        batchDocId: "",
        editStatus: false
    });

    const [filterModel, setFilterModel] = useState({
        items: [],
      });
    
      const handleFilterModelChange = (newFilterModel) => {
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
            setBatchId(edit.batchIdName);
            setStatus(edit.batchIdStatus);
        }
    }, [edit]);

    const handleAddDuration = async (e) => {
        e.preventDefault();
        const payload = { batch_id:BatchId, status };
        if (!BatchId) {
            return toast.warn('Please Enter the BatchId');
        }

        try {
            const response = await axios.post(`${config.API_URL}addBatchID`, payload, apiHeaderToken(config.API_TOKEN));

            if (response.data.status === true) {
                toast.success(response.data.message);
            } else {
                toast.warn(response.data.message);
            }
            setBatchId("");
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
            keywords:filterModel?.quickFilterValues?.join(' ')?.toLowerCase(),
        };
        try {
            const response = await axios.post(`${config.API_URL}getBatchIDList`, payload, apiHeaderToken(config.API_TOKEN));
            setBatchIdList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching durations:", error);
        }
    };

    const handleGetDurationTotal = async () => {
        const payload = {
            page_no: 1,
            per_page_record: 10000,
            status: '',
            keywords:filterModel?.quickFilterValues?.join(' ')?.toLowerCase(),
        };
        try {
            const responseTotal = await axios.post(`${config?.API_URL}getBatchIDList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching durations:", error);
        }
    };

    useEffect(() => {
        handleGetDuration();
    }, [paginationModel , filterModel]);
    
    useEffect(() => {
        handleGetDurationTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        console.log(data)
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            batchIdName: data?.name,
            batchDocId: data?._id,
            batchIdStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.batchDocId, batch_id:BatchId, status };
        if (!BatchId) {
            return toast.warn('Please Enter the BatchId');
        }
        try {
            const response = await axios.post(`${config.API_URL}editBatchID`, payload, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message);
                setBatchIdList(prevList =>
                    prevList.map(item =>
                        item._id === edit.batchDocId ? { ...item, batch_id:BatchId, status } : item
                    )
                );
                setEdit({
                    batchIdName: '',
                    batchIdStatus: '',
                    batchDocId: "",
                    editStatus: false
                });
                setBatchId("");
                setStatus("Active");
                // handleGetDuration();
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || "Someting Went Wrong");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (batchItems) => {
        const newStatus = batchItems.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: batchItems._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeBatchIDStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setBatchIdList(prevList =>
                prevList.map(item =>
                    item._id === batchItems._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`BatchId status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating BatchId status:", error);
            toast.error("Failed to update BatchId status");
        }
    };

    const HandleDelete = async (e, data) => {
        e.preventDefault();
        setIsModalOpen(true)
        setDeletedData(data)
    }

    const DeleteBatchId = async () => {
        const payload = { _id: DeletedData._id };
        try {
            const response = await axios.post(`${config.API_URL}deleteBatchIDById`, payload, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                setBatchIdList(prevList =>
                    prevList.filter(item => item._id !== DeletedData._id)
                );
                setDeletedData(null)
                setIsModalOpen(false)
                toast.success(response.data?.message)
            } else {
                toast.error(response.data?.message || "Failed to delete BatchId");
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to delete BatchId")
        }
    }

    const columns = [
        {
            field: "id",
            headerName: "Sno.",
            width: 80,

        },
        {
            field: "addedDate",
            headerName: "addedDate",
            width: 80,
        },
        {
            field: "updatedDate",
            headerName: "updatedDate",
            width: 80,
        },
        {
            field: "Status",
            headerName: "Status",
            width: 80,
        },
        {
            field: "name",
            headerName: "BatchId",
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
            headerName: "Edit",
            width: 150,
            renderCell: (params) => (
                <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },
        {
            field: "Delete",
            headerName: "Delete",
            width: 150,
            renderCell: (params) => (
                <button type='button' className='btn bg-danger' onClick={(e) => HandleDelete(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
                    <MdDelete className='fs-5 text-center' color='#fff' />
                </button>
            ),
        },
    ];

    const filteredRows = batchIdList.map((batchItems, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: batchItems?.batch_id,
        status: batchItems?.status,
        Status: batchItems?.status,
        _id: batchItems?._id,
        date: batchItems,
        addedDate:moment(batchIdList?.add_date).format("DD/MM/YYYY"),
        updatedDate:moment(batchIdList?.updated_on).format("DD/MM/YYYY")
    }));

    const rowHeight = 60;
    const gridHeight = Math.min(filteredRows.length, paginationModel.pageSize) * rowHeight + 110;

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-BatchId="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Batch ID</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddDuration}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Batch ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Batch Id"
                                                    value={BatchId}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\s+/g, '');
                                                        setBatchId(value);
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
                                    initialState={{
                                        columns:{
                                            columnVisibilityModel: {
                                                addedDate:false,
                                                updatedDate:false,
                                                Status:false
                                            }
                                        }
                                    }}
                                    paginationModel={paginationModel}
                                    onPaginationModelChange={handlePaginationModelChange}
                                    filterModel={filterModel}
                                    onFilterModelChange={handleFilterModelChange}                                          
                                    rowCount={totalRows}
                                    pageSizeOptions={[10, 20]}
                                    disableRowSelectionOnClick
                                    paginationMode="server"
                                    rowHeight={rowHeight}
                                    disableColumnSelector
                                    disableDensitySelector
                                    disableColumnFilter={false} 
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
                                        minHeight: '300px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                            {/* toolbar: {
                                csvOptions: {
                                    fields: exportableColumns,
                                },
                            }, */}

            {/* Delete Confirmation In Batch Id*/}
            <Dialog
                open={isModalOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setIsModalOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete Batch ID"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-requisition-description">
                        Are you sure ? you want to delete {DeletedData && DeletedData?.name} Batch Id.
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className='apprvbtn' onClick={() => setIsModalOpen(false) }>Disagree</button>
                    <button className='danderBtb' onClick={DeleteBatchId}>Agree</button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BatchId;




