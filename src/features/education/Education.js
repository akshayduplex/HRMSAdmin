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

const Education = () => {
    const [educationName, setEducationName] = useState("");
    const [status, setStatus] = useState("Active");
    const [educationList, setEducationList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel); // Store the filter model if needed
    };

    const [edit, setEdit] = useState({
        educationName: '',
        educationStatus: '',
        educationId: "",
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
            setEducationName(edit.educationName);
            setStatus(edit.educationStatus);
        }
    }, [edit]);

    const handleAddEducation = async (e) => {
        e.preventDefault();
        const payload = { name: educationName, status };
        if(!educationName){
            return toast.warn('Please Enter the tag Education');
         }
        try {
            const response = await axios.post(`${config.API_URL}addEducation`, payload, apiHeaderToken(config.API_TOKEN));

            toast.success(response?.data?.message);
            //console.log(response.data.message,"...................")
            setEducationName("");
            setStatus("Active");
            handleGetEducationList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("education already exists");
            } else {
                console.error(err);
                toast.error("Failed to add education");
            }
        }
    };

    const handleGetEducationList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {
            const response = await axios.post(`${config.API_URL}getEducationList`, payload, apiHeaderToken(config.API_TOKEN));
            setEducationList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching education list:", error);
        }
    };

    const handleGetEducationListTotal = async (input = '') => {
        const payload = {
            page_no: 1,
            per_page_record: 1000,
            status: '',
            filter_keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getEducationList`, payload, apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching education list:", error);
        }
    };

    useEffect(() => {
        handleGetEducationList();
    }, [paginationModel , filterModel]);
    
    useEffect(() => {
        handleGetEducationListTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        console.log(data)
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            educationName: data?.name,
            educationId: data?._id,
            educationStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.educationId, name: educationName, status };
        if(!educationName){
            return toast.warn('Please Enter the tag Education');
         }
        try {
            const response = await axios.post(`${config.API_URL}editEducation`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setEducationList(prevList =>
                prevList.map(item =>
                    item._id === edit.educationId ? { ...item, name: educationName, status } : item
                )
            );
            setEdit({
                educationName: '',
                educationStatus: '',
                educationId: "",
                editStatus: false
            });
            setEducationName("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating education:", error);
            toast.error("Failed to update education");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (educationItem) => {
        const newStatus = educationItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: educationItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeEducationStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setEducationList(prevList =>
                prevList.map(item =>
                    item._id === educationItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Education status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating education status:", error);
            toast.error("Failed to update education status");
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
            headerName: "Education",
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

    const filteredRows = educationList.map((educationItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: educationItem?.name,
        status: educationItem?.status,
        _id: educationItem?._id,
        date:educationItem
    }));

    const rowHeight = 80;
    const gridHeight = Math.max(filteredRows.length * rowHeight + 100 , 400);

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Education</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard" style={{minHeight:'500px'}}>
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddEducation}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Education</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter education"
                                                    value={educationName}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z\d()-/ ]+$/;
                                                        //const regex = /^[A-Za-z]+(?:\d{1,2})?[()\-/^[A-Za-z] ]*$/
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setEducationName(e.target.value);
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

export default Education;
