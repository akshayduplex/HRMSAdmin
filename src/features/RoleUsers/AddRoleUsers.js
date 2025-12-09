import React, { useEffect, useState } from "react";
import AllHeaders from "../partials/AllHeaders";
import GoBackButton from "../analytics/GoBackButton";
import { Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GetDesignationList } from "../slices/DesignationDropDown/designationDropDown";
import { useDispatch } from "react-redux";
import AsyncSelect from 'react-select/async';
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";




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




const AddRoleUsers = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        user_id: "",
        role_name: "",
        user_name: "",
        user_email: "",
        user_phone: "",
        user_designation: null,
        status: '',
        option: null,
        loading: false
    })

    const [searchParams] =  useSearchParams()

    const [formError, setFormError] = useState({
        nameError: '',
        emailError: '',
        phoneError: '',
        designationError: '',
    })

    const navigate = useNavigate();

    // Make the Handle state change
    const handleChanges = (obj) => {
        setFormData((prev) => {
            return { ...prev, ...obj }
        })
    }
    // Make Error State changes
    const handleErrors = (obj) => {
        setFormError((prev) => {
            return { ...prev, ...obj }
        })
    }

    useEffect(() => {

        if(searchParams.get('id')){
            const id = searchParams.get('id');
            ( async () => {
                try {
                    let payloads = {
                        "_id":id,
                    }
                    let response = await axios.post(`${config.API_URL}getRoleUserById` , payloads , apiHeaderToken(config.API_TOKEN));
                    if(response.data.status){
                        handleChanges({
                            user_id: response.data.data._id,
                            user_name: response.data.data.name,
                            user_email: response.data.data.email,
                            user_phone: response.data.data.mobile_no,
                            user_designation:{label:response.data.data.designation, value:response.data.data.designation , id:response.data.data.designation_id ? response.data.data.designation_id : null },
                            status:'Active'
                        })
                    }
                } catch (error) {
                    console.log(error , 'this is Error');
                }
            })()
        }

    } ,[searchParams.get('id')])
    // Make the Designation 
    const projectDesignationLoadOption = async (input) => {
        const result = await dispatch(GetDesignationList(input)).unwrap();
        return result.slice(0, 10); // Limit to 10 records
    }

    // open menu drop down list project list state list dropdown ->...
    const handleMenuOpenDesignationDropdown = async () => {
        const result = await dispatch(GetDesignationList('')).unwrap();
        handleChanges({ option: result })
    };

    // handle changes project state filter -> 
    const handleProjectDesignationChange = (option) => {
        handleChanges({ user_designation: option })
    }
    // handle Form Submit
    const handleSubmit = async (e , type) => {
        e.preventDefault()
        if (!formData.user_designation) {
            toast.warn("Please Select the Designation")
            return
        }
        if (!formData.user_name) {
            toast.warn("Please Enter the Name")
            return
        }
        if (!formData.user_email) {
            toast.warn("Please Enter the Email")
            return
        }
        if (!formData.user_phone) {
            toast.warn("Please Enter the Phone Number")
            return
        }

        let payloads = {
            "name": formData.user_name,
            "email": formData.user_email,
            "mobile_no": formData.user_phone,
            "designation": formData.user_designation?.label,
            "designation_id": formData.user_designation?.id,
            "status:":formData.status,
        }

        if(formData.user_id){
            payloads._id = formData.user_id
        }

        try {
            handleChanges({ loading: true })
            let response = await axios.post(`${config.API_URL}${type}`, payloads, apiHeaderToken(config.API_TOKEN))
            if (response.data.status) {
                toast.success(response.data.message)
                handleChanges({
                    user_name: "",
                    user_email: "",
                    user_phone: "",
                    user_designation: null,
                    status: 'Active',
                })
                navigate('/role-users-list')
            } else {
                toast.error(response.data.message)
            }
            handleChanges({ loading: false })
        } catch (error) {
            toast.error(error.response.data.message)
            handleChanges({ loading: false })
            handleChanges({ loading: false })
        }
    }

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <h3>Add Role User</h3>
                    <div className="row">
                        <div className="sitecard">
                            <div className="projectcard">
                                <div className="row mb-5">
                                    <div className='dflexbtwn'>
                                        <div className='pagename'>
                                        </div>
                                        <div className='linkbtn'>
                                            <Link to='/role-users-list'>
                                                <button className='purplbtn'>View List</button>
                                            </Link>
                                        </div>
                                    </div>
                                    <Form onSubmit={ (e) =>  formData.user_id ? handleSubmit(e , 'editUser') : handleSubmit(e , 'addUser')}>
                                        <div className='row'>
                                            <div className="col-sm-6">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Name"
                                                    value={formData.user_name}
                                                    onChange={(e) => {
                                                        if (e.target.value?.length < 5) {
                                                            handleChanges({ user_name: e.target.value })
                                                            handleErrors({ nameError: 'Name must be at least 5 characters' })
                                                        } else {
                                                            handleChanges({ user_name: e.target.value })
                                                            handleErrors({ nameError: '' })
                                                        }
                                                    }}
                                                    isInvalid={!!formError.nameError}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formError.nameError}
                                                </Form.Control.Feedback>
                                            </div>
                                            <div className="col-sm-6">
                                                <Form.Label>Mobile Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Mobile Number"
                                                    value={formData.user_phone}
                                                    onChange={(e) => {
                                                        const isNumeric = /^[0-9]*$/.test(e.target.value);
                                                        if (isNumeric && e.target.value?.length <= 10) {
                                                            if (e.target.value.length === 10) {
                                                                handleErrors({ phoneError: '' })
                                                                handleChanges({ user_phone: e.target.value });
                                                            } else {
                                                                handleErrors({ phoneError: 'Phone number must be exactly 10 digits' })
                                                                handleChanges({ user_phone: e.target.value });
                                                            }
                                                        }
                                                    }}
                                                    isInvalid={!!formError.phoneError}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formError.phoneError}
                                                </Form.Control.Feedback>
                                            </div>
                                            <div className="col-sm-6">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Email"
                                                    value={formData.user_email}
                                                    onChange={(e) => {
                                                        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
                                                        if (isValidEmail) {
                                                            handleErrors({ emailError: '' })
                                                        } else {
                                                            handleErrors({ emailError: 'Please Enter the Valid Email' })
                                                        }
                                                        handleChanges({ user_email: e.target.value })
                                                    }}
                                                    isInvalid={!!formError.emailError}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formError.emailError}
                                                </Form.Control.Feedback>
                                            </div>
                                            <div className="col-sm-6">
                                                <Form.Label>Designation</Form.Label>
                                                <AsyncSelect
                                                    placeholder="Designation"
                                                    defaultOptions
                                                    defaultValue={formData.option}
                                                    value={formData.user_designation}
                                                    loadOptions={projectDesignationLoadOption}
                                                    onMenuOpen={handleMenuOpenDesignationDropdown}
                                                    onChange={(option) => handleProjectDesignationChange(option)}
                                                    classNamePrefix="react-select"
                                                    styles={customStyles}

                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="mb-6 mt-2">
                                                    <Form.Label>Status</Form.Label>
                                                    <div className="d-flex">
                                                        <label style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
                                                            <Form.Check
                                                                type="radio"
                                                                name="status"
                                                                value="Active"
                                                                checked={formData.status === 'Active'}
                                                                onChange={(e) => {
                                                                    handleChanges({ status: e.target.value })
                                                                }}
                                                            /> &nbsp;
                                                            Active
                                                        </label> &nbsp;
                                                        <label style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Form.Check
                                                                type="radio"
                                                                name="status"
                                                                value="Inactive"
                                                                checked={formData.status === 'Inactive'}
                                                                onChange={(e) => {
                                                                    handleChanges({ status: e.target.value })
                                                                }}
                                                            /> &nbsp;
                                                            Inactive
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 mt-4 text-center">
                                            <Button
                                                className="sitebtn btnblue fullbtn"
                                                variant="primary"
                                                type="submit"
                                                disabled={formData.loading} // Disable the button while loading
                                            >
                                                {formData.loading ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                        &nbsp;wait...
                                                    </>
                                                ) : (
                                                    'Submit'
                                                )}
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>

        </>
    )
}

export default AddRoleUsers;


// // import Form from 'react-bootstrap/Form';
// // import { DataGrid } from "@mui/x-data-grid";
// // import Button from 'react-bootstrap/Button';
// // import { toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import ToggleButton from 'react-toggle-button';
// // import { FaRegEdit } from "react-icons/fa";
// // import axios from 'axios';
// // import config from '../../config/config';
// // import { apiHeaderToken } from '../../config/api_header';
// // import AsyncSelect from 'react-select/async';
// // import GoBackButton from "../analytics/GoBackButton";

// // const customStyles = {
// //   control: (provided, state) => ({
// //     ...provided,
// //     backgroundColor: "#fff !important",
// //     borderColor: state.isFocused
// //       ? "#D2C9FF"
// //       : state.isHovered
// //         ? "#80CBC4"
// //         : provided.borderColor,
// //     boxShadow: state.isFocused ? "0 0 0 1px #D2C9FF" : "none",
// //     "&:hover": {
// //       borderColor: "#D2C9FF",
// //     },
// //     // maxWidth: '%',
// //     //   width: "200px",
// //     height: "44px",
// //     // borderTopLeftRadius: '0',
// //     // borderBottomLeftRadius: '0'
// //   }),
// //   menu: (provided) => ({
// //     ...provided,
// //     borderTop: "1px solid #D2C9FF",
// //   }),
// //   option: (provided, state) => ({
// //     ...provided,
// //     borderBottom: "1px solid #D2C9FF",
// //     color: state.isSelected ? "#fff" : "#000000",
// //     backgroundColor: state.isSelected
// //       ? "#4CAF50"
// //       : state.isFocused
// //         ? "#80CBC4"
// //         : provided.backgroundColor,
// //     "&:hover": {
// //       backgroundColor: "#80CBC4",
// //       color: "#fff",
// //     },
// //   }),
// // };


// const AddLocation = () => {

//     return (
//         <>
//             <AllHeaders />
//             <div className="maincontent">
//                 <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
//                     <GoBackButton />
//                     <div className="row">
//                         <div className="pagename">
//                             <h3>Add Location</h3>
//                         </div>
//                     </div>
//                     <div className="row">
//                         <div className="sitecard">
//                             <div className="projectcard">
//                                 <Form onSubmit={edit.editStatus ? handleSubmitEdit : handleAddLocation}>
//                                     <div className='row'>
//                                         <div className="col-sm-3">
//                                             <Form.Label>State</Form.Label>
//                                             <AsyncSelect
//                                                 cacheOptions
//                                                 defaultOptions={listOptions}
//                                                 onMenuOpen={handleGetStateListDefaultOptions}
//                                                 styles={customStyles}
//                                                 loadOptions={handleGetStateList}
//                                                 onChange={(selectedOption) => setState(selectedOption)}
//                                                 value={state}
//                                                 placeholder="Select a state"
//                                             />
//                                         </div>
//                                         <div className="col-sm-3">
//                                             <Form.Label>Location</Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 placeholder="Enter Location"
//                                                 value={location}
//                                                 // onChange={(e) => setLocation(e.target.value)}
//                                                 onChange={(e) => {
//                                                     const regex = /^[A-Za-z() ]+$/;
//                                                     if (regex.test(e.target.value) || e.target.value === '') {
//                                                         setLocation(e.target.value);
//                                                     }
//                                                 }}
//                                             />
//                                         </div>


//                                         {/* <----------change--------------> */}
//                                         <div className="col-sm-3">
//                                             <Form.Label>Latitude</Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 placeholder="Enter Latitude"
//                                                 value={latitude}
//                                                 onChange={(e) => setLatitude(e.target.value)}
//                                             // onChange={(e) => {
//                                             //   const regex = /^\d.*$/;
//                                             //   const value = e.target.value;
//                                             //   if (regex.test(value) && value.length <= 10) {
//                                             //     setLatitude(value);
//                                             //   }
//                                             // }}
//                                             />
//                                         </div>

//                                         <div className="col-sm-3">
//                                             <Form.Label>Longitude</Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 placeholder="Enter Longitude"
//                                                 value={longitude}
//                                                 onChange={(e) => setLongitude(e.target.value)}
//                                             // onChange={(e) => {
//                                             //   const regex = /^\d.*$/;
//                                             //   const value = e.target.value;
//                                             //   if (regex.test(value) && value.length <= 10) {
//                                             //     setLongitude(value);
//                                             //   }
//                                             // }}
//                                             />
//                                         </div>


//                                         {/* <----------change--------------> */}


//                                         <div className="col-sm-3">
//                                             <div className="mb-3 mt-2">
//                                                 <Form.Label>Status</Form.Label>
//                                                 <div className="d-flex">
//                                                     <label style={{ display: 'flex', alignItems: 'center' }}>
//                                                         <Form.Check
//                                                             type="radio"
//                                                             name="status"
//                                                             value="Active"
//                                                             checked={status === 'Active'}
//                                                             onChange={(e) => setStatus(e.target.value)}
//                                                         /> &nbsp;
//                                                         Active
//                                                     </label> &nbsp;
//                                                     <label style={{ display: 'flex', alignItems: 'center' }}>
//                                                         <Form.Check
//                                                             type="radio"
//                                                             name="status"
//                                                             value="Inactive"
//                                                             checked={status === 'Inactive'}
//                                                             onChange={(e) => setStatus(e.target.value)}
//                                                         /> &nbsp;
//                                                         Inactive
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-sm-3 mt-4">
//                                             <Button className="sitebtn btnblue fullbtn" variant="primary" type="submit">
//                                                 {edit.editStatus ? "Update" : "Submit"}
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </Form>
//                             </div>
//                             <div className="projectcard mt-3 " style={{ height: gridHeight }}>
//                                 <DataGrid
//                                     rows={filteredRows}
//                                     columns={columns}
//                                     paginationModel={paginationModel}
//                                     onPaginationModelChange={handlePaginationModelChange}
//                                     rowCount={totalRows}
//                                     pageSizeOptions={[10, 20]}
//                                     disableRowSelectionOnClick
//                                     paginationMode="server"
//                                     rowHeight={rowHeight}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddLocation;