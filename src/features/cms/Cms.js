import React, { useState, useEffect } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ToggleButton from 'react-toggle-button';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import CustomToolbar from '../CommonFilter/CustomeToolBar';

const Cms = () => {
  const [page_slug, setPage_slug] = useState("");
  const [meta_title, setMeta_title] = useState("");
  const [meta_keyword, setMeta_keyword] = useState("");
  const [meta_description, setMeta_description] = useState("");
  const [h_one_heading, setH_one_heading] = useState("");
  const [content_data, setContent_data] = useState("");
  const [status, setStatus] = useState("Active");
  const [cmsList, setCmsList] = useState([]);

  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const handleFilterModelChange = (newFilterModel) => {
    const input = newFilterModel?.quickFilterValues?.[0]; // Get the value of the first filter
    handleGetCmsList(input); // Call your function with the input value
    setFilterModel(newFilterModel); // Store the filter model if needed
  };

  const [edit, setEdit] = useState({
    page_slug: '',
    meta_title: '',
    meta_keyword: "",
    meta_description: "",
    h_one_heading: "",
    content_data: "",
    cmsStatus: "",
    cmsId: "",
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
      setPage_slug(edit?.page_slug);
      setMeta_title(edit?.meta_title);
      setMeta_keyword(edit?.meta_keyword);
      setMeta_description(edit?.meta_description);
      setH_one_heading(edit?.h_one_heading);
      setContent_data(edit?.content_data);
      setStatus(edit?.cmsStatus);
    }
  }, [edit]);

  const handleAddCms = async (e) => {
    e.preventDefault();

    const payload = { page_slug, meta_title, meta_keyword, meta_description, h_one_heading, content_data, status };

    if (!page_slug) {
      return toast.warn('Please Enter the slug');
    }
    if (!meta_title) {
      return toast.warn('Please Enter the title');
    }
    if (!meta_keyword) {
      return toast.warn('Please Enter the keyword');
    }
    if (!meta_description) {
      return toast.warn('Please Enter the description');
    }
    if (!h_one_heading) {
      return toast.warn('Please Enter the heading');
    }
    if (!content_data) {
      return toast.warn('Please Enter the content');
    }
    try {
      const response = await axios.post(`${config.API_URL}addCms`, payload, apiHeaderToken(config.API_TOKEN));
      if (response.data.status === true) {
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
      setPage_slug("");
      setMeta_title("");
      setMeta_keyword("");
      setH_one_heading("");
      setMeta_description("");
      setContent_data("");
      setStatus("Active");
      handleGetCmsList();
    } catch (err) {
      // if (err.response && err.response.status === 409) {
      //   toast.warn("CMS entry already exists");
      // } else {
      //   console.error(err);
      //   toast.error("Failed to add CMS entry");
      // }
      console.log(err)
    }
  };

  const handleGetCmsList = async (input = '') => {
    const payload = { page_slug: "all", scope_fields: ["add_date" , "_id" , 'page_slug' , 'meta_title',"meta_description",'meta_keyword',"h_one_heading","content_data" , "status" , "updated_on"], status: '', keyword: input };
    try {
      const response = await axios.post(`${config.API_URL}allCmsList`, payload, apiHeaderToken(config.API_TOKEN));
      setCmsList(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching CMS entries:", error);
    }
  };

  useEffect(() => {
    handleGetCmsList();
  }, []);

  const handleEdit = (e, data) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    handleChanges({
      page_slug: data?.page_slug,
      meta_title: data?.meta_title,
      h_one_heading: data?.h_one_heading,
      meta_keyword: data?.meta_keyword,
      meta_description: data?.meta_description,
      content_data: data?.content_data,
      cmsId: data?._id,
      cmsStatus: data?.status,
      editStatus: true
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const payload = { _id: edit.cmsId, page_slug, meta_title, meta_keyword, meta_description, h_one_heading, content_data, status };

    if (!page_slug) {
      return toast.warn('Please Enter the slug');
    }
    if (!meta_title) {
      return toast.warn('Please Enter the title');
    }
    if (!meta_keyword) {
      return toast.warn('Please Enter the keyword');
    }
    if (!meta_description) {
      return toast.warn('Please Enter the description');
    }
    if (!h_one_heading) {
      return toast.warn('Please Enter the heading');
    }
    if (!content_data) {
      return toast.warn('Please Enter the content');
    }

    try {
      const response = await axios.post(`${config.API_URL}editCms`, payload, apiHeaderToken(config.API_TOKEN));
      if(response.data?.status){
        toast.success(response.data.message);
        setCmsList(prevList =>
          prevList.map(item =>
            item._id === edit.cmsId ? { ...item, page_slug, meta_title, meta_keyword, meta_description, h_one_heading, content_data, status } : item
          )
        );
        setEdit({
          page_slug: "",
          meta_title: "",
          h_one_heading: "",
          meta_keyword: "",
          meta_description: "",
          content_data: "",
          cmsStatus: "",
          cmsId: "",
          editStatus: false
        });
        setPage_slug("");
        setContent_data("");
        setH_one_heading("");
        setMeta_description("");
        setMeta_title("");
        setMeta_keyword("");
        setStatus("Active");
      }else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error("Error updating CMS entry:", error);
      toast.error("Failed to update CMS entry");
    }
  };

  const handleToggleStatus = async (cmsItem) => {
    const newStatus = cmsItem.status === 'Active' ? 'Inactive' : 'Active';
    const payload = { _id: cmsItem._id, status: newStatus };
    try {
      await axios.post(`${config.API_URL}changeCmsStatus`, payload, apiHeaderToken(config.API_TOKEN));
      setCmsList(prevList =>
        prevList.map(item =>
          item._id === cmsItem._id ? { ...item, status: newStatus } : item
        )
      );
      toast.success(`CMS entry status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating CMS status:", error);
      toast.error("Failed to update CMS status");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Sno.",
      width: 50
    },
    {
      field: "page_slug",
      headerName: "PageSlug",
      width: 200,
      renderCell: (params) => (
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params.row.page_slug}</p>
        </div>
      ),
    },
    {
      field: "meta_title",
      headerName: "Title",
      width: 200,
      renderCell: (params) => (
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params.row.meta_title?.slice(0 , 25) + "..."}</p>
        </div>
      ),
    },
    {
      field: "h_one_heading",
      headerName: "Heading",
      width: 200,
      renderCell: (params) => (
        <div className="candinfo prcnt_bar">
          <p className="color-black mt-3">{params.row.h_one_heading?.slice(0 , 25) + "..."}</p>
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
      width: 260,
      renderCell: (params) => (
        <button type='button' className='btn btn-primary' onClick={(e) => handleEdit(e, params.row)} style={{ height: "35px", lineHeight: "12px" }}>
          <FaRegEdit className='fs-5 text-center' />
        </button>
      ),
    },
  ];

  const filteredRows = cmsList.map((cmsItem, index) => ({
    id: index + 1,
    page_slug: cmsItem?.page_slug,
    meta_title: cmsItem?.meta_title,
    h_one_heading: cmsItem?.h_one_heading,
    meta_keyword: cmsItem?.meta_keyword,
    meta_description: cmsItem?.meta_description,
    content_data: cmsItem?.content_data,
    status: cmsItem?.status,
    _id: cmsItem?._id,
    date: cmsItem
  }));

  const rowHeight = 60;


  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="row">
            <div className="pagename">
              <h3>Add CMS</h3>
            </div>
          </div>
          <div className="row">
            <div className="sitecard">
              <div className="projectcard">
                <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddCms}>
                  <div className='row'>
                    <div className="col-sm-12">
                      <div className="mb-3">
                        <Form.Label>Page Slug</Form.Label>
                        <Select
                          options={[
                            { value: 'terms', label: 'terms' },
                            { value: 'privacy-policy', label: 'privacy-policy' },
                          ]}
                          placeholder="Enter PageSlug"
                          value={page_slug ? { value: page_slug, label: page_slug } : null}
                          onChange={(selectedOption) => setPage_slug(selectedOption.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="mb-3">
                        <Form.Label>MetaTitle</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Title"
                          value={meta_title}
                          //onChange={(e) => setMeta_title(e.target.value)}
                          onChange={(e) => {
                            const regex = /^[A-Za-z()-/ ]+$/;
                            if (regex.test(e.target.value) || e.target.value === '') {
                              setMeta_title(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="mb-3">
                        <Form.Label>MetaKeyword</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Keyword"
                          value={meta_keyword}
                          //onChange={(e) => setMeta_keyword(e.target.value)}
                          onChange={(e) => {
                            const regex = /^[A-Za-z()-/ ]+$/;
                            if (regex.test(e.target.value) || e.target.value === '') {
                              setMeta_keyword(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="mb-3">
                        <Form.Label>MetaDescription</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Description"
                          value={meta_description}
                          //onChange={(e) => setMeta_description(e.target.value)}
                          onChange={(e) => {
                            const regex = /^[A-Za-z()-/ ]+$/;
                            if (regex.test(e.target.value) || e.target.value === '') {
                              setMeta_description(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="mb-3">
                        <Form.Label>Heading</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Heading"
                          value={h_one_heading}
                          //onChange={(e) => setH_one_heading(e.target.value)}
                          onChange={(e) => {
                            const regex = /^[A-Za-z()-/ ]+$/;
                            if (regex.test(e.target.value) || e.target.value === '') {
                              setH_one_heading(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="mb-3">
                        <Form.Label>ContentData</Form.Label>
                        <ReactQuill
                          style={{ height: '200px', border: 'none' }}
                          value={content_data}
                          onChange={(value) => setContent_data(value)}
                          className='form-control'
                          placeholder='Enter Your Content'
                        />
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="mb-3 mt-5">
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
                    <div className="col-sm-3" style={{ marginTop: '70px' }}>
                      <Button className="sitebtn btnblue fullbtn" variant="primary" type="submit">
                        {edit.editStatus ? "Update" : "Submit"}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
              <div className="projectcard mt-5">
                <div className="d-flex flex-column gap-2 mt-1  w-100  remfooter" >
                  <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    disableRowSelectionOnClick
                    rowHeight={rowHeight}
                    filterModel={filterModel}
                    onFilterModelChange={handleFilterModelChange}
                    rowCount={filteredRows?.length}
                    pageSizeOptions={[10, 20]}
                    paginationMode="server"
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
                      minHeight: '300px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cms;





