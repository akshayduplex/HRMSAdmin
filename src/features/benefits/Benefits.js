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

const Benefits = () => {
    const [benefits, setBenefits] = useState("");
    const [status, setStatus] = useState("Active");
    const [benefitsList, setBenefitsList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        // const input = filterModel?.quickFilterValues?.[0]; // Get the value of the first filter
        // handleGetStateList(input); // Call your function with the input value
        setFilterModel(newFilterModel); // Store the filter model if needed
    };

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
            setBenefits(edit.stateName);
            setStatus(edit.stateStatus);
        }
    }, [edit]);

    const handleAddState = async (e) => {
        e.preventDefault();
        const payload = { name: benefits, status };
        if(!benefits){
            return toast.warn('Please Enter the tag benefits');
         }
        try {
            const response = await axios.post(`${config.API_URL}addBenefits`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setBenefits("");
            setStatus("Active");
            handleGetStateList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("Benefits already exists");
            } else {
                console.error(err);
                toast.error("Failed to add benefits");
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
            const response = await axios.post(`${config.API_URL}getBenefitList`, payload, apiHeaderToken(config.API_TOKEN));
            setBenefitsList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching benefits:", error);
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
            const responseTotal = await axios.post(`${config.API_URL}getBenefitList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching benefits:", error);
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
        const payload = { _id: edit.stateId, name: benefits, status };
        if(!benefits){
            return toast.warn('Please Enter the tag benefits');
         }
        try {
            const response = await axios.post(`${config.API_URL}editBenefits`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setBenefitsList(prevList =>
                prevList.map(item =>
                    item._id === edit.stateId ? { ...item, name: benefits, status } : item
                )
            );
            setEdit({
                stateName: '',
                stateStatus: '',
                stateId: "",
                editStatus: false
            });
            setBenefits("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating benefits:", error);
            toast.error("Failed to update benefits");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (stateItem) => {
        const newStatus = stateItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: stateItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeBenefitStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setBenefitsList(prevList =>
                prevList.map(item =>
                    item._id === stateItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Benefits status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating benefits status:", error);
            toast.error("Failed to update benefits status");
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
            headerName: "Benefits",
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
            width: 100,
            renderCell: (params) => (
                <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },

    ];

    const filteredRows = benefitsList.map((stateItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: stateItem?.name,
        status: stateItem?.status,
        _id: stateItem?._id,
        date:stateItem
    }));

    const rowHeight = 80;
    const gridHeight = Math.max((filteredRows.length * rowHeight) + 100 , 400);

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Benefits</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddState}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Benefits</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Benefits"
                                                    value={benefits}
                                                    //onChange={(e) => setBenefits(e.target.value)}

                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setBenefits(e.target.value);
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
                                    disableColumnSelector
                                    disableDensitySelector
                                    disableColumnFilter={false} 
                                    filterModel={filterModel}
                                    onFilterModelChange={handleFilterModelChange}     
                                    onPaginationModelChange={handlePaginationModelChange}
                                    rowCount={totalRows}
                                    pageSizeOptions={[10, 20]}
                                    disableRowSelectionOnClick
                                    paginationMode="server"
                                    rowHeight={rowHeight}
                                    slots={{ toolbar: GridToolbar }}
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

export default Benefits;









