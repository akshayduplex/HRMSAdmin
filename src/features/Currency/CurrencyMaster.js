import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import ToggleButton from 'react-toggle-button';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import moment from 'moment';
import CustomToolbar from '../CommonFilter/CustomeToolBar';

const AddCurrency = () => {
    const [countryName, setCountryName] = useState("");
    const [currencyName, setCurrencyName] = useState("");
    const [currencySymbol, setCurreccyCymbol] = useState("");
    const [currencyCode, setCurrencyCode] = useState("");
    const [status, setStatus] = useState("Active");
    const [divisionList, setDivisionList] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);

    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterModelChange = (newFilterModel) => {
        console.log("Filter Model Changed:", newFilterModel);
        const input = newFilterModel?.quickFilterValues?.[0]; // Get the value of the first filter
        handleGetDivisionList(input); // Call your function with the input value
        setFilterModel(newFilterModel); // Store the filter model if needed
    };
    const [edit, setEdit] = useState({
        divisionName: '',
        divisionStatus: '',
        divisionId: "",
        symbol:'',
        currencyName:'',
        currencyCode:'',
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
            setCountryName(edit.divisionName);
            setStatus(edit.divisionStatus);
            setCurrencyName(edit.currencyName);
            setCurreccyCymbol(edit?.symbol)
            setCurrencyCode(edit?.currencyCode)
        }
    }, [edit]);

    const handleAddDivision = async (e) => {
        e.preventDefault();
        const payload = {
            "country": countryName,
            "currency": currencyName,
            "code":currencyCode ,
            "symbol": currencySymbol,
            "status": status
        }


        if (!countryName) {
            return toast.warn('Please Enter the Country Name');
        }
        if (!currencyName) {
            return toast.warn('Please Enter the Currency Name');
        }
        if (!currencySymbol) {
            return toast.warn('Please Enter the Currency Symbol');
        }
        if (!currencyCode) {
            return toast.warn('Please Enter the Currency Code');
        }

        try {
            const response = await axios.post(`${config.API_URL}addCurrency`, payload, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data?.message);
                setCountryName("");
                setCurrencyName("");
                setCurreccyCymbol("");
                setCurrencyCode("");
                setStatus("Active");
                handleGetDivisionList();
            } else {
                toast.error(response.data?.message);
            }
        } catch (err) {
            toast.error(err.message || err.response?.data?.message || 'Something Went Wrong');
        }
    };

    const handleGetDivisionList = async (input = '') => {
        const payload = {
            page_no: paginationModel.page + 1,
            per_page_record: paginationModel.pageSize,
            status: '',
            keyword:input,
        };
        try {
            const response = await axios.post(`${config.API_URL}getCurrencyList`, payload, apiHeaderToken(config.API_TOKEN));
            setDivisionList(response?.data?.data || []);
            const responseTotal = await axios.post(`${config.API_URL}getCurrencyList`, { keyword:input, page_no: 1, per_page_record: 1000000, status: '' }, apiHeaderToken(config.API_TOKEN));
            setTotalRows(responseTotal?.data?.data?.length || 0);
        } catch (error) {
            console.error("Error fetching divisions:", error);
        }
    };

    useEffect(() => {
        handleGetDivisionList();
    }, [paginationModel]);

    const handleEdit = (e, data) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        handleChanges({
            divisionName: data?.country,
            divisionId: data?._id,
            divisionStatus: data?.status,
            symbol:data?.symbol,
            currencyName:data?.currency,
            currencyCode:data?.code,
            editStatus: true
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = {
            "country": countryName,
            "currency": currencyName,
            "code": currencyCode,
            "symbol":currencySymbol,
            "status": status,
            "_id": edit.divisionId
        }

        if (!countryName) {
            return toast.warn('Please Enter the Country Name');
        }
        if (!currencyName) {
            return toast.warn('Please Enter the Currency Name');
        }
        if (!currencySymbol) {
            return toast.warn('Please Enter the Currency Symbol');
        }
        if (!currencyCode) {
            return toast.warn('Please Enter the Currency Symbol');
        }
        try {
            const response = await axios.post(`${config.API_URL}editCurrency`, payload, apiHeaderToken(config.API_TOKEN));
            toast.success(response.data.message);
            setDivisionList(prevList =>
                prevList.map(item =>
                    item._id === edit.divisionId ? { ...item, country: countryName, status , code:currencyCode , currency: currencyName , symbol: currencySymbol} : item
                )
            );
            setEdit({
                divisionName: '',
                divisionStatus: '',
                divisionId: "",
                symbol:'',
                currencyName:'',
                currencyCode:'',
                editStatus: false
            });
            setCountryName("");
            setCurrencyName("");
            setCurreccyCymbol("");
            setCurrencyCode("");
            setStatus("Active");
            handleGetDivisionList();
        } catch (error) {
            console.error("Error updating division:", error);
            toast.error("Failed to update division");
        }
    };

    const handlePaginationModelChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleToggleStatus = async (divisionItem) => {
        const newStatus = divisionItem.status === 'Active' ? 'Inactive' : 'Active';
        const payload = { _id: divisionItem._id, status: newStatus };
        try {
            await axios.post(`${config.API_URL}changeCurrencyStatus`, payload, apiHeaderToken(config.API_TOKEN));
            setDivisionList(prevList =>
                prevList.map(item =>
                    item._id === divisionItem._id ? { ...item, status: newStatus } : item
                )
            );
            toast.success(`Currency status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating division status:", error);
            toast.error("Failed to update division status");
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
            headerName: "Country Name",
            width: 200,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.country}</p>
                </div>
            ),
        },
        {
            field: "currency",
            headerName: "Currency",
            width: 150,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.currency}</p>
                </div>
            ),
        },
        {
            field: "code",
            headerName: "Code",
            width: 150,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.code}</p>
                </div>
            ),
        },
        {
            field: "symbol",
            headerName: "Symbol",
            width: 100,
            renderCell: (params) => (
                <div className="candinfo prcnt_bar">
                    <p className="color-black mt-3">{params.row.symbol}</p>
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
            width: 260,
            renderCell: (params) => (
                <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
                    <FaRegEdit className='fs-5 text-center' />
                </button>
            ),
        },
    ];

    const filteredRows = divisionList.map((divisionItem, index) => ({
        id: index + 1 + paginationModel.page * paginationModel.pageSize,
        country: divisionItem?.country,
        code: divisionItem?.code,
        currency: divisionItem?.currency,
        symbol: divisionItem?.symbol,
        status: divisionItem?.status,
        _id: divisionItem?._id,
        date:divisionItem
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
                            <h3>Add Currency</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddDivision}>
                                    <div className='row'>
                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <Form.Label>Country Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Country Name"
                                                    value={countryName}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setCountryName(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <Form.Label>Currency</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Rupees | Dollar | Yan"
                                                    value={currencyName}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setCurrencyName(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <Form.Label>Currency Symbol</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="₹"
                                                    value={currencySymbol}
                                                    onChange={(e) => {
                                                        setCurreccyCymbol(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <Form.Label>Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Currency code"
                                                    value={currencyCode}
                                                    onChange={(e) => {
                                                        const regex = /^[A-Za-z() ]+$/;
                                                        if (regex.test(e.target.value) || e.target.value === '') {
                                                            setCurrencyCode(e.target.value);
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
                                        minHeight:'300px'
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

export default AddCurrency;





