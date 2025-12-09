// import React, { useEffect, useState } from "react";
// import Modal from "react-bootstrap/Modal";
// import AsyncSelect from 'react-select/async';
// import FormControl from "@mui/material/FormControl";
// import { IoSearchOutline } from "react-icons/io5";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import { useDispatch } from "react-redux";
// import { FetchProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
// import axios from 'axios';
// import config from '../../config/config';
// import { apiHeaderToken } from '../../config/api_header';
// import { DataGrid } from '@mui/x-data-grid';

// const customStyles = {
//     control: (provided, state) => ({
//         ...provided,
//         backgroundColor: '#fff',
//         borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
//         boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
//         '&:hover': {
//             borderColor: '#D2C9FF',
//         },
//         height: '44px',
//     }),
//     menu: (provided) => ({
//         ...provided,
//         borderTop: '1px solid #D2C9FF',
//     }),
//     option: (provided, state) => ({
//         ...provided,
//         borderBottom: '1px solid #D2C9FF',
//         color: state.isSelected ? '#fff' : '#000',
//         backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
//         '&:hover': {
//             backgroundColor: '#80CBC4',
//             color: '#fff',
//         },
//     }),
// };

// const SetPriorityModal = (props) => {
//     const { show, handleClose } = props;
//     const [projectListOption, setProjectOptions] = useState([]);
//     const [option, setOptions] = useState([]);
//     const dispatch = useDispatch();
//     const [designationList, setDesignationList] = useState([]);
//     const [search, setSearch] = useState('');
//     const [loader, setLoader] = useState(false); 


//     const projectLoadOption = async (input) => {
//         const result = await dispatch(FetchProjectListDropDown(input)).unwrap();
//         return result;
//     };

//     const projectMenuOpen = async () => {
//         const result = await dispatch(FetchProjectListDropDown('')).unwrap();
//         setOptions(result);
//     };

// console.log(option,"all project")

//     const handleProjectChanges = (option) => {
//         setProjectOptions(option);
//         handleFilter(option)
//     };

//     const handleGetDesignation = async () => {
//         setLoader(true);
//         const payload = {
//             page_no: 1,
//             per_page_record: 1000,
//         };
//         try {
//             const response = await axios.post(`${config.API_URL}getProjectWiseDesignationList`, payload, apiHeaderToken(config.API_TOKEN));
//             setDesignationList(response.data.data || []);
//         } catch (error) {
//             console.error("Error fetching Designation:", error);
//         } finally {
//             setLoader(false);
//         }
//     };

//     useEffect(() => {
//         handleGetDesignation();
//     }, []);

//     const handleFilter = async (selectedOption) => {
//         try {
//             const payload = {
//                 keyword: "",
//                 project_id: selectedOption?.value,
//             };
//             setLoader(true);
//             const response = await axios.post(`${config.API_URL}getProjectWiseDesignationList`, payload, apiHeaderToken(config.API_TOKEN));
//             setLoader(false);
//             if (response.status === 200) {
//                 setDesignationList(response.data.data);
//             } else {
//                 setDesignationList([]);
//             }
//         } catch (error) {
//             setDesignationList([]);
//             setLoader(false);
//             console.error("Error filtering designations:", error);
//         }
//     };

//     const handlePriorityChange = async (e, id, project) => {
//         const newPriority = e?.target?.value;
//         const projectId =project?.value
//         console.log(projectId,"projectId Check")
//         const newRows = [...designationList];
//         const index = newRows.findIndex(designation => designation?._id === id);

//         if (index !== -1) {
//             newRows[index].priority = newPriority;
//             setDesignationList(newRows);
//         }

//         try {
//             const payload = { _id: id, project_id: project?.value, priority: newPriority,keyword: "" };
//             const response = await axios.post(`${config.API_URL}saveProjectWiseDesignationPriority`, payload, apiHeaderToken(config.API_TOKEN));
//             console.log(response.data.message, "Data saved successfully!");
//         } catch (err) {
//             console.log("Error saving data:", err);
//         }
//     };



//     const columns = [
//         {
//             field: "id",
//             headerName: "Sno",
//             width: 150,
//         },
//         {
//             field: "name",
//             headerName: "Designation",
//             width: 400,
//             renderCell: (params) => (
//                 <div className="projectInfo">
//                     <p>{params.row?.name}</p>
//                 </div>
//             )
//         },
//         {
//             field: "priority",
//             headerName: "Priority",
//             width: 150,
//             renderCell: (params) => (
//                 <input
//                 type="number"
//                 value={params.row?.priority}
//                 onBlur={(e) => handlePriorityChange(e, params?.row?._id, params?.row?.selectedOption?.value)}
//                 onChange={(e) => {
//                     const newRows = [...designationList];
//                     const index = newRows.findIndex(designation => designation._id === params.row._id);
//                     if (index !== -1) {
//                         newRows[index].priority = e.target.value;
//                         setDesignationList(newRows);
//                     }
//                 }}
//                 className="form-control mt-1"
//                 style={{ width: '100%' }}
//             />

//             ),
//         }
//     ];

//     const rows = designationList?.length !== 0 ? designationList?.map((designation, index) => ({
//         id: index + 1,
//         _id: designation._id, 
//         name: designation?.name,
//         priority: designation?.priority,
//     })) : [];

//     const filteredRows = rows.filter((row) =>
//         row?.name.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <Modal show={show} onHide={handleClose} size="lg" className="jobtemp_modal offermodal">
//             <Modal.Header className="border-0" closeButton>
//                 <Modal.Title>
//                     <h4>Set Priority</h4>
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div className="row mt-1 w-100">
//                     <div className="col-lg-5 mb-4">
//                         <FormControl fullWidth>
//                             <AsyncSelect
//                                 cacheOptions
//                                 defaultOptions
//                                 defaultValue={option}
//                                 loadOptions={projectLoadOption}
//                                 value={projectListOption}
//                                 onMenuOpen={projectMenuOpen}
//                                 placeholder="Select Project"
//                                 onChange={handleProjectChanges}
//                                 classNamePrefix="react-select"
//                                 styles={customStyles}
//                             />
//                         </FormControl>
//                     </div>
//                     <div className="col-lg-5 mb-4">
//                         <div className="position-relative srchemployee">
//                             <Form.Control
//                                 type="text"
//                                 className="w-100 ps-4 ms-2 form-control fs-6"
//                                 placeholder="Search Designation"
//                                 onChange={(e) => setSearch(e.target.value)}
//                             />
//                             <div className="srchicon">
//                                 <IoSearchOutline size={"16px"} />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="d-flex gap-2 mt-4 w-100 ">
//                         <DataGrid
//                             rows={filteredRows}
//                             className="w-100"
//                             loading={loader}
//                             columns={columns}
//                             headerClassName="custom-header-class"
//                             initialState={{
//                                 pagination: {
//                                     paginationModel: { page: 0, pageSize: 10 },
//                                 },
//                             }}
//                             pageSizeOptions={[10, 20]}
//                             sx={{
//                                 minHeight: 500
//                             }}
//                         />
//                     </div>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// };

// export default SetPriorityModal;






import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import AsyncSelect from 'react-select/async';
import FormControl from "@mui/material/FormControl";
import { IoSearchOutline } from "react-icons/io5";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { FetchProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { DataGrid } from '@mui/x-data-grid';

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

const SetPriorityModal = (props) => {
    const { show, handleClose } = props;
    const [projectListOption, setProjectOptions] = useState(null);
    const [option, setOptions] = useState([]);
    const dispatch = useDispatch();
    const [designationList, setDesignationList] = useState([]);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchProjectListDropDown(input)).unwrap();
        return result;
    };

    const projectMenuOpen = async () => {
        const result = await dispatch(FetchProjectListDropDown('')).unwrap();
        setOptions(result);
    };

    const handleProjectChanges = (option) => {
        setProjectOptions(option);
        setSearch('');  
        handleFilter(option);
    };

    const handleFilter = async (selectedOption) => {
        try {
            const payload = {
                keyword: "",
                project_id: selectedOption?.value,
            };
            setLoader(true);
            const response = await axios.post(`${config.API_URL}getProjectWiseDesignationList`, payload, apiHeaderToken(config.API_TOKEN));
            setLoader(false);
            if (response.status === 200) {
                setDesignationList(response.data.data);
            } else {
                setDesignationList([]);
            }
        } catch (error) {
            setDesignationList([]);
            setLoader(false);
            console.error("Error filtering designations:", error);
        }
    };

    const handlePriorityChange = async (e, id) => {
        const newPriority = e?.target?.value;
        const projectId = projectListOption?.value;

        const newRows = [...designationList];
        const index = newRows.findIndex(designation => designation?._id === id);

        if (index !== -1) {
            newRows[index].priority = newPriority;
            setDesignationList(newRows);
        }

        try {
            const payload = { _id: id, project_id: projectId, priority: newPriority, keyword: "" };
            const response = await axios.post(`${config.API_URL}saveProjectWiseDesignationPriority`, payload, apiHeaderToken(config.API_TOKEN));
            console.log(response?.data?.message, "Data saved successfully!");
        } catch (err) {
            console.log("Error saving data:", err);
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "Sno",
            width: 150,
        },
        {
            field: "name",
            headerName: "Designation",
            width: 400,
            renderCell: (params) => (
                <div className="projectInfo">
                    <p>{params?.row?.name}</p>
                </div>
            )
        },
        {
            field: "priority",
            headerName: "Priority",
            width: 150,
            renderCell: (params) => (
                <input
                    type="number"
                    value={params.row?.priority}
                    onBlur={(e) => handlePriorityChange(e, params?.row?._id)}
                    onChange={(e) => {
                        const newRows = [...designationList];
                        const index = newRows?.findIndex(designation => designation?._id === params?.row?._id);
                        if (index !== -1) {
                            newRows[index].priority = e.target.value;
                            setDesignationList(newRows);
                        }
                    }}
                    className="form-control mt-1"
                    style={{ width: '100%' }}
                />
            ),
        }
    ];

    const rows = designationList?.length !== 0 ? designationList?.map((designation, index) => ({
        id: index + 1,
        _id: designation?._id,
        name: designation?.name,
        priority: designation?.priority,
    })) : [];

    const filteredRows = rows.filter((row) =>
        row?.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal show={show} onHide={handleClose} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="border-0" closeButton>
                <Modal.Title>
                    <h4>Set Priority</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mt-1 w-100">
                    <div className="col-lg-5 mb-4">
                        <FormControl fullWidth>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                defaultValue={option}
                                loadOptions={projectLoadOption}
                                value={projectListOption}
                                onMenuOpen={projectMenuOpen}
                                placeholder="Select Project"
                                onChange={handleProjectChanges}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </FormControl>
                    </div>
                    
                    <div className="col-lg-5 mb-4">
                        <div className="position-relative srchemployee">
                            <Form.Control
                                type="text"
                                className="w-100 ps-4 ms-2 form-control fs-6"
                                placeholder="Search Designation"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="srchicon">
                                <IoSearchOutline size={"16px"} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-flex gap-2 mt-4 w-100 remfooter">
                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            loading={loader}
                            disableRowSelectionOnClick
                            pagination={false}
                            sx={{
                                minHeight: 100
                            }}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SetPriorityModal;

