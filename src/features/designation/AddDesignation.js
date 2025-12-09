import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
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
import SetPriorityModal from "./SetPriorityModal";
import moment from 'moment';
import CustomToolbar from '../CommonFilter/CustomeToolBar';
import CustomToolbarExport from '../CommonFilter/CustomeToolBarExport';

const AddDesignation = () => {
  const [showModal, setShowModal] = useState(false);
  const [designation, setDesignation] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("Active");
  const [designationList, setDesignationList] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const handleFilterModelChange = (newFilterModel) => {
    const input = newFilterModel?.quickFilterValues?.join(' ')?.toLowerCase();
    handleGetDesignation(input); 
    setFilterModel(newFilterModel); 
  };

  const [edit, setEdit] = useState({
    editLocationName: '',
    editPriority: '',
    locationStatus: '',
    locationId: "",
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
      setDesignation(edit?.editLocationName);
      setPriority(edit?.editPriority)
      setStatus(edit?.locationStatus);
    }
  }, [edit]);

  // <----------------setModal----------------------------->
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  // <----------------setModal----------------------------->

  const handleAddDesignation = async (e) => {
    e.preventDefault();
    const payload = { name: designation, status, priority };
    if (!designation) {
      return toast.warn('Please Enter the Designation');
    }
    if (!priority) {
      return toast.warn('Please Enter the priority');
    }
    try {
      const response = await axios.post(`${config.API_URL}addDesignation`, payload, apiHeaderToken(config.API_TOKEN));
      toast.success(response.data.message);
      setDesignation("");
      setPriority("");
      setStatus("Active");
      handleGetDesignation();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.warning("Designation already exists");
      } else {
        console.error(err);
        toast.error("Failed to add bank");
      }
    }
  };


  const handleGetDesignation = async (input = '') => {
    const payload = {
      page_no: 1,
      per_page_record: 10000,
      status: '',
      filter_keyword:input
    };
    try {
      const response = await axios.post(`${config.API_URL}getDesignationList`, payload, apiHeaderToken(config.API_TOKEN));
      setDesignationList(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching Designation:", error);
    }
  };

  useEffect(() => {
    handleGetDesignation();
  }, []);

  const handleEdit = (e, data) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    handleChanges({
      editLocationName: data?.name,
      locationId: data?._id,
      locationStatus: data?.status,
      editPriority: data?.priority,
      editStatus: true
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const payload = { _id: edit?.locationId, name: designation, status, priority };

    if (!designation) {
      return toast.warn('Please Enter the Designation');
    }
    if (!priority) {
      return toast.warn('Please Enter the priority');
    }

    try {
      const response = await axios.post(`${config.API_URL}editDesignation`, payload, apiHeaderToken(config.API_TOKEN));
      toast.success(response?.data?.message);
      setDesignationList(prevList =>
        prevList.map(loc =>
          loc._id === edit?.locationId ? { ...loc, name: designation, status, priority } : loc
        )
      );
      setEdit({
        editLocationName: '',
        editPriority: '',
        locationStatus: '',
        locationId: "",
        editStatus: false
      });
      setDesignation("");
      setPriority("");
      setStatus("Active");
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleToggleStatus = async (designation) => {
    const newStatus = designation?.status === 'Active' ? 'Inactive' : 'Active';
    const payload = { _id: designation?._id, status: newStatus };
    try {
      await axios.post(`${config.API_URL}changeDesignationStatus`, payload, apiHeaderToken(config.API_TOKEN));
      setDesignationList(prevList =>
        prevList.map(loc =>
          loc._id === designation?._id ? { ...loc, status: newStatus } : loc
        )
      );
      toast.success(`Designation status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating Designation status:", error);
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
      headerName: "Designation",
      width: 400,
      renderCell: (params) => (
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params.row.name}</p>
        </div>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params) => (
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params.row.priority}</p>
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
      width: 250,
      disableExport: true,  // Add this line
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
      disableExport: true,  // Add this line
      renderCell: (params) => (
        <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
          <FaRegEdit className='fs-5 text-center' />
        </button>
      ),
    },
  ];

  const filteredRows = designationList.map((location, index) => ({
    id: index + 1 + paginationModel.page * paginationModel.pageSize,
    name: location?.name,
    status: location?.status,
    priority: location?.priority,
    _id: location?._id,
    date: location
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
              <h3>Add Designation</h3>
            </div>
          </div>
          <div className="row">
            <div className="sitecard">
              <div className="projectcard">
                <div className="dflexbtwn">
                </div>
                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddDesignation}>
                  <div className='row'>
                    <div className="col-sm-3">
                      <div className="mb-3">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter designation"
                          value={designation}
                          onChange={(e) => {
                            const regex = /^[A-Za-z()-/& ]+$/;
                            if (regex.test(e.target.value) || e.target.value === '') {
                              setDesignation(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <div className="mb-3">
                        <Form.Label>priority</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter priority"
                          value={priority}
                          onChange={(e) => {
                            const regex = /^\d*$/;
                            const value = e.target.value;
                            if (regex.test(value) && value.length <= 5) {
                              setPriority(value);
                            }
                          }} />

                      </div>
                    </div>

                    <div className="col-sm-2">
                      <div className="mb-3 mt-2">
                        <Form.Label>Status</Form.Label>
                        {/* <div className="d-flex">
                          <Form.Check
                            type="radio"
                            label="Active"
                            name="status"
                            value="Active"
                            checked={status === 'Active'}
                            onChange={(e) => setStatus(e.target.value)}
                          /> &nbsp;
                          <Form.Check
                            type="radio"
                            label="Inactive"
                            name="status"
                            value="Inactive"
                            checked={status === 'Inactive'}
                            onChange={(e) => setStatus(e.target.value)}
                          />
                        </div> */}
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
                    <div className="col-sm-2 mt-4">
                      <Button className="sitebtn btnblue fullbtn" variant="primary" type="submit">
                        {edit.editStatus ? "Update" : "Submit"}
                      </Button>
                    </div>
                    <div className="col-sm-1 mt-4 ms-5">
                      <Button
                        className="sitebtn btnblue fullbtn"
                        variant="primary"
                        onClick={handleShow}
                      >
                        Set Priority
                      </Button>
                      <SetPriorityModal show={showModal} handleClose={handleClose} />
                    </div>

                  </div>
                </Form>
              </div>
              <div className="projectcard ">
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  rowCount={filteredRows?.length}
                  pageSizeOptions={[10, 20 , 40 , 80]}
                  disableRowSelectionOnClick
                  rowHeight={80}
                  filterModel={filterModel}
                  onFilterModelChange={handleFilterModelChange}                        
                  disableColumnSelector
                  disableDensitySelector
                  disableColumnFilter={false} // Enable column filtering     
                  slots={{ toolbar: CustomToolbarExport }}
                  slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        csvOptions: {
                            // fields: exportableColumns,
                            fileName: 'designation-list',
                            // delimiter: ',',
                            utf8WithBom: true,
                            // allColumns: false,
                            fields: ['id', 'name', 'priority', 'status'], // Explicitly specify fields to export
                            getRowsToExport: (params) => {
                                return params.apiRef
                                    .getVisibleRowModels()
                                    .map(row => ({
                                        id: row.id,
                                        name: row.name,
                                        priority: row.priority,
                                        status: row.status
                                    }));
                            }
                        },
                    },
                }}
                  sx={{
                    height:800,
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

export default AddDesignation;