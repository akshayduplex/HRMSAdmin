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
import { DateFormate } from '../../utils/common'
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import AsyncSelect from 'react-select/async';
import { FetchProjectStateDropDown } from '../slices/ProjectListDropDown/ProjectListDropdownSlice';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import CustomToolbar from '../CommonFilter/CustomeToolBar';



const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};

const Holiday = () => {
    const [holiday, setHoliday] = useState("");
    const [schedule, setSchedule] = useState("");
    const [status, setStatus] = useState("Active");
    const [holidayList, setHolidayList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);
    const [option, setOptions] = useState(null);
    const [ projectState , setStateOptions] = useState(null);
    const dispatch = useDispatch();

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        setFilterModel(newFilterModel);
    };

    const [edit, setEdit] = useState({
        holidayName: '',
        holidayDate: '',
        holidayStatus: '',
        holidayId: "",
        editStatus: false,
        state_list:'',
    });

    const handleChanges = (obj) => {
        setEdit((prevEdit) => ({
            ...prevEdit,
            ...obj
        }));
    };

    /************************** Get State List DropDown ********************/
    const stateLoadOption = async (input) => {
        const result = await dispatch(FetchProjectStateDropDown(input)).unwrap();
        return result;
    }
    const stateMenuOpen = async () => {
        const result = await dispatch(FetchProjectStateDropDown('')).unwrap();
        setOptions(result);
    }
    const handleStateChanges = (option) => {
        setStateOptions(option);
        handleChanges( { state_list: option?.map((item) => { return {state_name:item?.label , state_id:item.value} }) } )
    }

    useEffect(() => {
        if (edit.editStatus) {
            setHoliday(edit.holidayName);
            const formattedDate = new Date(edit.holidayDate).toISOString().split('T')[0];
            setSchedule(formattedDate);
            setStatus(edit.holidayStatus);
        }
    }, [edit]);

    const handleAddHoliday = async (e) => {
        e.preventDefault();
        const payload = { name: holiday, schedule_date: schedule, status , state_list:edit?.state_list};
        if (!holiday) {
            return toast.warn('Please Enter the  holiday');
        }
        if (!schedule) {
            return toast.warn('Please Enter the date');
        }

        try {
            const response = await axios.post(`${config.API_URL}addHoliday`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setHoliday("");
            setSchedule("");
            setStatus("Active");
            handleGetHolidayList();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                toast.warn("Holiday already exists");
            } else {
                console.error(err);
                toast.error(err.response.data.message);
            }
        }
    };

    const handleGetHolidayList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            scope_fields:[],
            keyword:'',
            filter_keyword: filterModel?.quickFilterValues?.join(' ').toLowerCase(),
            year: ""
        };
        try {
            const response = await axios.post(`${config.API_URL}getHolidayList`, payload, apiHeaderToken(config.API_TOKEN));
            setHolidayList(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching Holiday:", error);
        }
    };

    const handleGetHolidayListTotal = async (input = '') => {
        const payload = {
            page_no: 1,
            per_page_record: 1000,
            status: '',
            scope_fields:[],
            keyword:'',
            filter_keyword: filterModel?.quickFilterValues?.join(' ').toLowerCase(),
            year: ""
        };
        try {
            const responseTotal = await axios.post(`${config.API_URL}getHolidayList`, payload , apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching Holiday:", error);
        }
    };

    useEffect(() => {
        handleGetHolidayList();
    }, [paginationModel , filterModel]);

    useEffect(() => {
        handleGetHolidayListTotal();
    }, [filterModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            holidayName: data?.name,
            holidayId: data?._id,
            holidayDate: data?.schedule_date,
            holidayStatus: data?.status,
            editStatus: true,
        });

        setStateOptions(data?.state_name?.map((item) =>  {  return { value:item?.state_id , label:item?.state_name } }))
        handleChanges({state_list:data?.state_name?.map((item) =>  {  return { value:item?.state_id , label:item?.state_name } })})

    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = { _id: edit.holidayId, name: holiday, status, schedule_date: schedule , state_list:edit?.state_list };
        if (!holiday) {
            return toast.warn('Please Enter the  holiday');
        }
        if (!schedule) {
            return toast.warn('Please Enter the date');
        }
        try {
            const response = await axios.post(`${config.API_URL}editHoliday`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setHolidayList(prevList =>
                prevList.map(item =>
                    item._id === edit.holidayId ? { ...item, name: holiday, status, schedule_date: schedule } : item
                )
            );
            setEdit({
                holidayName: '',
                holidayStatus: '',
                holidayDate: "",
                holidayId: "",
                editStatus: false,
                state_list:null
            });
            setHoliday("");
            setSchedule("")
            setStatus("Active");
            handleGetHolidayList();
        } catch (error) {
            console.error("Error updating Holiday:", error);
            toast.error("Failed to update Holiday");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (holidayItem) => {
        const newStatus = holidayItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: holidayItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeHolidayStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setHolidayList(prevList =>
                prevList.map(item =>
                    item._id === holidayItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Holiday status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating Holiday status:", error);
            toast.error("Failed to update Holiday status");
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
            headerName: "Holiday",
            width: 200,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.name}</p>
                </div>
            ),
        },
        {
            field: "state_name",
            headerName: "State Name",
            width: 300,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar lineBreack">
                    <p className="color-black mt-3">{params.row.state_name?.map((item) => item.state_name).join(',')}</p>
                </div>
            ),
        },
        {
            field: "schedule_date",
            headerName: "Schedule Date",
            width: 300,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{DateFormate(params.row.schedule_date)}</p>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 260,
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

    const filteredRows = holidayList.map((holidayItem, index) => ({

        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        name: holidayItem?.name,
        schedule_date: holidayItem?.schedule_date,
        status: holidayItem?.status,
        _id: holidayItem?._id,
        state_name:holidayItem?.state_list,
        date:holidayItem,
    }));

    const rowHeight = 80;
    const gridHeight = Math.max(filteredRows.length * rowHeight , 400);

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className="row">
                        <div className="pagename">
                            <h3>Add Holiday</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard" style={{minHeight:'600px'}}>
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddHoliday}>
                                    <div className='row'>
                                        <div className="col-sm-12">
                                            <div className="mb-3">
                                                <Form.Label>Choose State</Form.Label>
                                                <AsyncSelect
                                                    isMulti
                                                    cacheOptions
                                                    defaultOptions
                                                    defaultValue={option}
                                                    loadOptions={stateLoadOption}
                                                    value={projectState}
                                                    onMenuOpen={stateMenuOpen}
                                                    placeholder="State"
                                                    onChange={handleStateChanges}
                                                    classNamePrefix="react-select"
                                                    styles={customStyles}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <Form.Label>Holiday</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Holiday"
                                                    value={holiday}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setHoliday(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-3">
                                            <div className="mb-3 position-relative">
                                                <Form.Label>Date</Form.Label>
                                                <Form.Control
                                                    id='form-date'
                                                    type="date"
                                                    placeholder="Enter date"
                                                    value={schedule}
                                                    onChange={(e) => setSchedule(e.target.value)}
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

export default Holiday;



