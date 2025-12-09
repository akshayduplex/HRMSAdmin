import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import GoBackButton from '../goBack/GoBackButton';
import ProjectEmployeeList from './ProjectEmployeeList';
import { CiCalendar } from "react-icons/ci";
import AllHeaders from '../partials/AllHeaders';
import { useDispatch, useSelector } from 'react-redux';
import { FetchProjectListDropDown , CloseProjects } from '../slices/ProjectListDropDown/ProjectListDropdownSlice';
import AsyncSelect from "react-select/async";
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

// create Async custom css part

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff !important',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        // maxWidth: '%',
        height: '44px',
        // borderTopLeftRadius: '0',
        // borderBottomLeftRadius: '0'
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};


const CloseProject = () => {
    const [project_id , setProjectId] = useState('');
    const [EndingDate , SetEndDate] = useState(null);
    const navigation = useNavigate();



    const dispatch = useDispatch();


    const ProjectListOptions = (inputValue) => {
           return dispatch(FetchProjectListDropDown(inputValue)).unwrap();
    }

    const handleCloseFeedBack = (e) => {
          e.preventDefault()

          if(!project_id){
             return toast.warning('Please Select the Project');
          }
          if(!EndingDate){
             return toast.warning('Please Select the Project End date');
          }
          let Payloads = {
            "_id":project_id,
            "closed_on":EndingDate,
            "total_payout":"0"
          }
          dispatch(CloseProjects(Payloads))
          .unwrap()
          .then((response) => {
                if(response.status){
                    setProjectId('');
                    SetEndDate(null);
                    toast.success(response.message);
                    setTimeout(() => {
                        navigation('/projects')
                    }, 1000);
                }else {
                    toast.warning(response.message);
                }
          })
          .catch((err) => {
              toast.error(err.message);
          })
    }

    // console.log(data , 'this is data from the server');

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='row'>
                        <div className='pagename'>
                            <h3>Close Project</h3>
                            <p>Current projects informations and tracking</p>
                        </div>
                    </div>
                    <Form>
                        <div className='row'>
                            <div className='col-sm-4 mb-3'>
                                {/* <Form.Select defaultValue="Choose...">
                                    <option>Select Project</option>
                                    <option>Delhi</option>
                                    <option>Delhi</option>
                                    <option>Delhi</option>
                                    <option>Delhi</option>
                                </Form.Select> */}
                                <AsyncSelect
                                    placeholder="Select Project List"
                                    cacheOptions
                                    loadOptions={ProjectListOptions}
                                    onChange={(option) => {
                                        const value = option ? option.value : null;
                                        // handleAllInputChange({"project_id":value});
                                        setProjectId(value)
                                    }}
                                    onInputChange={(inputValue) => inputValue}
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                    defaultOptions
                                />
                            </div>
                            <div className="col-sm-4 mb-3 datebox">
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Control type="date" placeholder="dd/mm/yyyy" value={EndingDate} onChange={(e) => SetEndDate(e.target.value)}/>
                                    <CiCalendar />
                                </Form.Group>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='dflexbtwn'>
                                <div className='total_pay'>
                                    <label>Total Payout</label>
                                    <input type='text' className='form-control' value="0" readOnly/>
                                </div>
                                <div className='btn_projectclose'>
                                    <button className='sitebtn btnblue' onClick={handleCloseFeedBack}>Close Project </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                    <div className='emp_project_table'>
                        <ProjectEmployeeList />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CloseProject;
