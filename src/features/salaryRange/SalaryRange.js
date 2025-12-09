
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

const SalaryRange = () => {
    const[label,setLabel] = useState("")
    const [fromName, setFromName] = useState("");
    const [toName, setToName] = useState("");
    const [status, setStatus] = useState("Active");
    const [salaryRangeList, setSalaryRangeList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel); // Store the filter model if needed
    };

    const [edit, setEdit] = useState({
        label:'',
        fromName: '',
        toName: '',
        salaryStatus: '',
        salaryId: "",
        editStatus: false
    });
    const handleChanges = (obj) => {
        setEdit((prevEdit) => ({
            ...prevEdit,
            ...obj
        }
        ));
    };
    useEffect(() => {
        if (edit.editStatus) {
            setLabel(edit.label)
            setFromName(edit.fromName);
            setToName(edit.toName);
            setStatus(edit.salaryStatus);
        }
    }, [edit]);

    const handleAddSalaryRange = async (e) => {
        e.preventDefault();
        const payload = { label, status, from: fromName, to: toName };

        if(!label){
            return toast.warn('Please Enter the  label');
         }
         if(!fromName){
            return toast.warn('Please Enter the from');
         }
         if(!toName){
            return toast.warn('Please Enter the to');
         }

        try {
            const response = await axios.post(`${config.API_URL}addSalaryRange`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setLabel("")
            setFromName("");
            setToName("");
            setStatus("Active");
            fetchSalaryRangeList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("Salary range already exists");
            } else {
                console.error(err);
                toast.error("Failed to add salary range");
            }
        }
    };

    const fetchSalaryRangeList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            keyword:filterModel?.quickFilterValues?.join(' - ')
        };
        try {
            const response = await axios.post(`${config.API_URL}getSalaryRangeList`, payload, apiHeaderToken(config.API_TOKEN));
            setSalaryRangeList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching salary ranges:", error);
        }
    };
    
    const fetchSalaryRangeListTotal = async (input = '') => {
        const payload = {
            page_no: 1,
            per_page_record: 1000,
            status: '',
            keyword:filterModel?.quickFilterValues?.join(' ')
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getSalaryRangeList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching salary ranges:", error);
        }
    };

    useEffect(() => {
        fetchSalaryRangeList();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        fetchSalaryRangeListTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            label:data?.label,
            fromName: data?.from,
            toName: data?.to,
            salaryId: data?._id,
            salaryStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        
        const payload = { _id: edit.salaryId, label, status, from: fromName, to: toName };
        if(!label){
            return toast.warn('Please Enter the  label');
         }
         if(!fromName){
            return toast.warn('Please Enter the from');
         }
         if(!toName){
            return toast.warn('Please Enter the to');
         }
        try {
            const response = await axios.post(`${config.API_URL}editSalaryRange`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setSalaryRangeList(prevList =>
                prevList.map(item =>
                    item._id === edit.salaryId ? { ...item, label, status, from: fromName, to: toName } : item
                )
            );
            setEdit({
                label:'',
                fromName: '',
                toName: '',
                salaryStatus: '',
                salaryId: "",
                editStatus: false
            });
            setLabel("");
            setFromName("");
            setToName("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating salary range:", error);
            toast.error("Failed to update salary range");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (salaryItem) => {
        const newStatus = salaryItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: salaryItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeSalaryRangeStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setSalaryRangeList(prevList =>
                prevList.map(item =>
                    item._id === salaryItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Salary range status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating salary range status:", error);
            toast.error("Failed to update salary range status");
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "Sno.",
            width: 80
        },
        {
            field: "label",
            headerName: "Salary Range",
            width: 250,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.label}</p>
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
            width: 200,
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

    const filteredRows = salaryRangeList.map((salaryItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        label: salaryItem?.label,
        status: salaryItem?.status,
        _id: salaryItem?._id,
        from: salaryItem?.from,
        to: salaryItem?.to,
        date:salaryItem,
    }));

    const rowHeight = 80;
    const gridHeight = Math.max(filteredRows.length * rowHeight, 400)

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Salary Range</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddSalaryRange}>
                                    <div className='row'>
                                    <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Label</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter salary Label"
                                                    value={label}
                                                    onChange={(e) => setLabel(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>From</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="from"
                                                    value={fromName}
                                                onChange={(e) => {
                                                    const regex = /^\d*$/;
                                                    const value = e.target.value;
                                                    if (regex.test(value) && value.length<=10) {
                                                        setFromName(value);
                                                    }
                                                  }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>To</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="to"
                                                    value={toName}
                                                    onChange={(e) => {
                                                        const regex = /^\d*$/;
                                                        const value = e.target.value;
                                                        if (regex.test(value) && value.length<=10) {
                                                            setToName(value);
                                                        }
                                                      }}
                                                    //onChange={(e) => setToName(e.target.value)}
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
                                    // filterModel={filterModel}
                                    // onFilterModelChange={handleFilterModelChange}                        
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

export default SalaryRange;




