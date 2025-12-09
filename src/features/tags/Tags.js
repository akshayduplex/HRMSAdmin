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

const Tags = () => {
    const [tagName, setTagName] = useState("");
    const [status, setStatus] = useState("Active");
    const [tagList, setTagList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel); // Store the filter model if needed
    };

    const [edit, setEdit] = useState({
        tagName: '',
        tagStatus: '',
        tagId: "",
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
            setTagName(edit.tagName);
            setStatus(edit.tagStatus);
        }
    }, [edit]);

    const handleAddTag = async (e) => {
        e.preventDefault();
        const payload = { name: tagName, status };
        if (!tagName) {
            return toast.warn('Please Enter the tag Name');
        }
        try {
            const response = await axios.post(`${config.API_URL}addTag`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setTagName("");
            setStatus("Active");
            handleGetTagList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("tag already exists");
            } else {
                console.error(err);
                toast.error("Failed to add tag");
            }
        }
    };

    const handleGetTagList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {
            const response = await axios.post(`${config.API_URL}getTagList`, payload, apiHeaderToken(config.API_TOKEN));
            setTagList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching tags list:", error);
        }
    };

    const handleGetTagListTotal = async (input = '') => {
        const payload = {
            page_no:  1,
            per_page_record: 10000,
            status: '',
            keyword:filterModel?.quickFilterValues?.join(' ').toLowerCase()
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getTagList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching tags list:", error);
        }
    };

    useEffect(() => {
        handleGetTagList();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        handleGetTagListTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            tagName: data?.name,
            tagId: data?._id,
            tagStatus: data?.status,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.tagId, name: tagName, status };
        if (!tagName) {
            return toast.warn('Please Enter the tag Name');
        }
        try {
            const response = await axios.post(`${config.API_URL}editTag`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setTagList(prevList =>
                prevList.map(item =>
                    item._id === edit.tagId ? { ...item, name: tagName, status } : item
                )
            );
            setEdit({
                tagName: '',
                tagStatus: '',
                tagId: "",
                editStatus: false
            });
            setTagName("");
            setStatus("Active");
        } catch (error) {
            console.error("Error updating tags:", error);
            toast.error("Failed to update tags");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (tagItem) => {
        const newStatus = tagItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: tagItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeTagStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setTagList(prevList =>
                prevList.map(item =>
                    item._id === tagItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Tag status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating tags status:", error);
            toast.error("Failed to update tags status");
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
            headerName: "Tags",
            width: 300,
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
            width: 250,
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

    const filteredRows = tagList.map((tagItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: tagItem?.name,
        status: tagItem?.status,
        _id: tagItem?._id,
        date:tagItem
    }));

    const rowHeight = 80;
    const gridHeight = Math.max(filteredRows.length * rowHeight , 400) 

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Tags</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard h-100">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddTag}>
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <Form.Label>Tags</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter tags"
                                                    value={tagName}
                                                    //onChange={(e) => setTagName(e.target.value)}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setTagName(e.target.value);
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
                                    // style={{ height: gridHeight }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Tags;










