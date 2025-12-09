
import React, { useState, useEffect, useCallback } from 'react';
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
import AsyncSelect from 'react-select/async';
import moment from 'moment';

import { GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { IoIosSearch } from 'react-icons/io';
import { Box } from "@mui/material";


const CustomToolbar = () => (
  <GridToolbarContainer>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "8px 16px",
      }}
    >
      <IoIosSearch size={25} color="gray" />
      <GridToolbarQuickFilter
        placeholder="Search by the Location Name Only"
        sx={{
          flexGrow: 1, // Makes the input box take the remaining space
          "& input": {
            padding: "8px", // Adjust padding for the input box
            fontSize: "14px", // Adjust font size
          },
        }}
      />
    </Box>
  </GridToolbarContainer>
);


const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff !important",
    borderColor: state.isFocused
      ? "#D2C9FF"
      : state.isHovered
        ? "#80CBC4"
        : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 1px #D2C9FF" : "none",
    "&:hover": {
      borderColor: "#D2C9FF",
    },
    // maxWidth: '%',
    //   width: "200px",
    height: "44px",
    // borderTopLeftRadius: '0',
    // borderBottomLeftRadius: '0'
  }),
  menu: (provided) => ({
    ...provided,
    borderTop: "1px solid #D2C9FF",
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid #D2C9FF",
    color: state.isSelected ? "#fff" : "#000000",
    backgroundColor: state.isSelected
      ? "#4CAF50"
      : state.isFocused
        ? "#80CBC4"
        : provided.backgroundColor,
    "&:hover": {
      backgroundColor: "#80CBC4",
      color: "#fff",
    },
  }),
};


const AddLocation = () => {
  const [location, setLocation] = useState("");
  const [state, setState] = useState(null);
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [status, setStatus] = useState("Active");
  const [locationList, setLocationList] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputs, setInput] = useState('')

  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const handleFilterModelChange = (newFilterModel) => {
    setFilterModel(newFilterModel);
  }

  const [edit, setEdit] = useState({
    editLocationName: '',
    locationStatus: '',
    locationId: "",
    editLatitude: '',
    editLongitude: '',
    editState: null,
    editStatus: false
  });

  const handleChanges = (obj) => {
    setEdit(prevEdit => ({
      ...prevEdit,
      ...obj
    }));
  };

  useEffect(() => {
    if (edit.editLocationName && edit.locationId && edit.locationStatus && edit.editState && edit.editLatitude && edit.editLongitude) {
      setLocation(edit.editLocationName);
      setStatus(edit.locationStatus);
      setState(edit.editState);
      setLatitude(edit.editLatitude);
      setLongitude(edit.editLongitude);
    }
  }, [edit]);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!state) {
      toast.warn("Please select a state.");
      return;
    }
    const payload = {
      name: location,
      status,
      latitude,
      longitude,
      state_id: state?.value,
      state: state?.label
    };
    if (!location) {
      return toast.warn('Please Enter the location');
    }
    if (!latitude) {
      return toast.warn('Please Enter the latitude');
    }
    if (!longitude) {
      return toast.warn('Please Enter the longitude');
    }
    try {
      const response = await axios.post(`${config.API_URL}addLocation`, payload, apiHeaderToken(config.API_TOKEN));
      if (response.data.status === true) {
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
      setLocation("");
      setLatitude("")
      setLongitude("")
      setState(null);
      setStatus("Active");
      handleGetLocation();
    } catch (err) {
      console.error(err);
      toast.error(err.response.message);
    }
  };

  const handleGetLocation = async (input = '') => {
    const payload = {
      page_no:paginationModel?.page + 1,
      per_page_record: paginationModel?.pageSize,
      status: '',
      keyword: filterModel?.quickFilterValues?.join(' ').toLowerCase() || ''
    };
    setLoading(true)
    try {
      const response = await axios.post(`${config.API_URL}getLocationList`, payload, apiHeaderToken(config.API_TOKEN));
      setLocationList(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
    setLoading(false)
  };

  const handleGetLocationTotal = async (input = '') => {
    const payload = {
      page_no: 1,
      per_page_record: 10000,
      status: '',
      keyword: filterModel?.quickFilterValues?.join(' ').toLowerCase() || ''
    };
    setLoading(true)
    try {
      const response = await axios.post(`${config.API_URL}getLocationList`, payload, apiHeaderToken(config.API_TOKEN));
      setTotalRows(response?.data?.data?.length || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
    setLoading(false)
  };

  useEffect(() => {
    handleGetLocation();
  }, [paginationModel, filterModel]);


  useEffect(() => {
    handleGetLocationTotal()
  }, [filterModel])

  const handleEdit = (e, data) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    handleChanges({
      editLocationName: data?.name,
      locationId: data?._id,
      locationStatus: data?.status,
      editLatitude: data?.latitude,
      editLongitude: data?.longitude,
      editState: { value: data?.state?._id, label: data?.state },
      editStatus: true
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!state) {
      toast.error("Please select a state.");
      return;
    }

    const payload = {
      _id: edit?.locationId,
      name: location,
      status: status,
      state_id: state?.value,
      state: state?.label,
      latitude,
      longitude
    };
    if (!location) {
      return toast.warn('Please Enter the location');
    }
    if (!latitude) {
      return toast.warn('Please Enter the latitude');
    }
    if (!longitude) {
      return toast.warn('Please Enter the longitude');
    }
    try {
      const response = await axios.post(`${config.API_URL}editLocation`, payload, apiHeaderToken(config.API_TOKEN));
      toast.success(response.data.message);
      setLocationList(prevList =>
        prevList.map(loc =>
          loc._id === edit.locationId ? { ...loc, name: location, status: status, state_id: edit?.state_id, state: edit?.state, latitude, longitude } : loc
        )
      );
      setEdit({
        editLocationName: '',
        locationStatus: '',
        locationId: "",
        editState: null,
        editStatus: false
      });
      setLocation("");
      setLatitude("");
      setLongitude("")
      setState(null);
      handleGetLocation();
    } catch (error) {
      toast.error(error.data.massage);
    }
  };

  const handleToggleStatus = async (location) => {
    const newStatus = location.status === 'Active' ? 'Inactive' : 'Active';
    const payload = { _id: location?._id, status: newStatus };
    try {
      await axios.post(`${config.API_URL}changeLocationStatus`, payload, apiHeaderToken(config.API_TOKEN));
      setLocationList(prevList =>
        prevList.map(loc =>
          loc._id === location?._id ? { ...loc, status: newStatus } : loc
        )
      );
      toast.success(`Location status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating location status:", error);
      toast.error("Failed to update location status");
    }
  };



  const columns = [
    {
      field: "id",
      headerName: "Sno.",
      width: 50
    },
    {
      field: "state",
      headerName: "State",
      width: 200,
      renderCell: (params) => (
        //console.log(params)
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params?.row?.state}</p>

        </div>
      ),
    },
    {
      field: "name",
      headerName: "Location",
      width: 200,
      renderCell: (params) => (
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params.row.name}</p>
        </div>
      ),
    }, {
      field: "latitude",
      headerName: "Latitude",
      width: 100,
      renderCell: (params) => (
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params.row.latitude}</p>
        </div>
      ),
    },
    {
      field: "longitude",
      headerName: "Longitude",
      width: 100,
      renderCell: (params) => (
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params.row.longitude}</p>
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
        <div>
          <button
            type='button'
            className='btn btn-primary'
            onClick={(e) => handleEdit(e, params.row)}
            style={{ height: "35px", lineHeight: "12px" }}
          >
            <FaRegEdit className='fs-5 text-center' />
          </button>
        </div>
      ),
    },
  ];

  const filteredRows = locationList?.map((location, index) => ({
    id: index + 1 + paginationModel?.page * paginationModel?.pageSize,
    name: location?.name,
    status: location?.status,
    state: location?.state,
    latitude: location?.latitude || '0',
    longitude: location?.longitude || '0',
    state_id: location?.state_id,
    _id: location?._id,
    date: location
  }));

  const rowHeight = 80;
  const gridHeight = Math.max(filteredRows.length * rowHeight, 500);

  const [listOptions, setListOption] = useState([])

  const handleGetStateList = async (inputValue) => {
    const payload = {
      page_no: 1,
      per_page_record: 10000,
      status: ""
    };
    try {
      const response = await axios.post(
        `${config.API_URL}getStateList`,
        payload,
        apiHeaderToken(config.API_TOKEN)
      );
      const states = response?.data?.data || [];
      const filteredStates = states.filter((state) =>
        state.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filteredStates.map((state) => ({
        value: state._id,
        label: state.name
      }));
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  };

  const handleGetStateListDefaultOptions = async () => {
    const payload = {
      page_no: 1,
      per_page_record: 10,
      status: ""
    };
    try {
      const response = await axios.post(
        `${config.API_URL}getStateList`,
        payload,
        apiHeaderToken(config.API_TOKEN)
      );
      const states = response?.data?.data || [];
      const formattedStates = states.map((state) => ({
        value: state._id,
        label: state.name
      }));
      setListOption(formattedStates);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };


  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="row">
            <div className="pagename">
              <h3>Add Location</h3>
            </div>
          </div>
          <div className="row">
            <div className="sitecard">
              <div className="projectcard">
                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddLocation}>
                  <div className='row'>
                    <div className="col-sm-3">
                      <Form.Label>State</Form.Label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions={listOptions}
                        onMenuOpen={handleGetStateListDefaultOptions}
                        styles={customStyles}
                        loadOptions={handleGetStateList}
                        onChange={(selectedOption) => setState(selectedOption)}
                        value={state}
                        placeholder="Select a state"
                      />
                    </div>
                    <div className="col-sm-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Location"
                        value={location}
                        // onChange={(e) => setLocation(e.target.value)}
                        onChange={(e) => {
                          const regex = /^[A-Za-z() ]+$/;
                          if (regex.test(e.target.value) || e.target.value === '') {
                            setLocation(e.target.value);
                          }
                        }}
                      />
                    </div>


                    {/* <----------change--------------> */}
                    <div className="col-sm-3">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                      // onChange={(e) => {
                      //   const regex = /^\d.*$/;
                      //   const value = e.target.value;
                      //   if (regex.test(value) && value.length <= 10) {
                      //     setLatitude(value);
                      //   }
                      // }}
                      />
                    </div>

                    <div className="col-sm-3">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                      // onChange={(e) => {
                      //   const regex = /^\d.*$/;
                      //   const value = e.target.value;
                      //   if (regex.test(value) && value.length <= 10) {
                      //     setLongitude(value);
                      //   }
                      // }}
                      />
                    </div>


                    {/* <----------change--------------> */}


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
              <div className="projectcard mt-3 ">
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  rowCount={totalRows}
                  paginationModel={paginationModel}
                  onPaginationModelChange={handlePaginationModelChange}
                  onFilterModelChange={handleFilterModelChange}
                  pageSizeOptions={[10, 20, 40, 50, 80]}
                  disableRowSelectionOnClick
                  rowHeight={80}
                  paginationMode="server"
                  disableColumnSelector
                  loading={loading}
                  disableColumnFilter={false}
                  slots={{ toolbar: CustomToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  sx={{
                    height: gridHeight,
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

export default AddLocation;