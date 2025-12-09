import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { GetDesignationWiseEmployeeList } from '../slices/EmployeeSlices/EmployeeSlice';
import { InfinitySpin } from 'react-loader-spinner';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


function EmployeeTable({ show, SetInPlaceOpen, Data }) {
    
    const dispatch = useDispatch();
    const { getDesignationEmployeeList } = useSelector((state) => state.employee);
    const navigate = useNavigate();

    useEffect(() => {
        if (Data) {
            let payloads = {
                "project_id": Data?._id,
                "designation": Data?.designation,
                "designation_id": Data?.designation_id,
                // "batch_id":Data?.designation_id ,
                "page_no": "1",
                "per_page_record": "1000",
                "scope_fields": ["_id","employee_code","name","mobile_no","email","designation","department","joining_date","appraisal_date" , "ctc" , "batch_id"]
            }
            dispatch(GetDesignationWiseEmployeeList(payloads))
        }
    }, [dispatch, Data])

    const handleClose = () => {
        SetInPlaceOpen(false);
    };


    return (
        <div className="" data-aos="fade-in" data-aos-duration="3000">
            <Modal show={show} onHide={handleClose} centered size='lg' >
                <Modal.Header closeButton>
                    <h5 className="text-start">Employee Details</h5>
                </Modal.Header>
                <Modal.Body>
                    {
                        getDesignationEmployeeList.status === 'Pending'
                            ? <div className="d-flex align-content-center justify-content-center">
                                <InfinitySpin
                                    visible={true}
                                    width="200"
                                    color="#4fa94d"
                                    ariaLabel="infinity-spin-loading"
                                />
                            </div>
                            :
                            <Table hover responsive className=''>
                                <thead>
                                    <tr>
                                        <th className='bg-color-set'>Employee ID</th>
                                        <th className='bg-color-set'>Employee Name</th>
                                        <th className='bg-color-set'>Designation</th>
                                        <th className='bg-color-set'>Department</th>
                                        <th className='bg-color-set'>Batch</th>
                                        <th className='bg-color-set'>Date of Joining</th>
                                        <th className='bg-color-set'>Appraisal Date</th>
                                        <th className='bg-color-set' >Offered CTC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getDesignationEmployeeList.status === 'succeeded' && getDesignationEmployeeList.data?.data.length > 0 ? (
                                        getDesignationEmployeeList.data?.data.map((employee) => (
                                            <tr key={employee._id} style={{ cursor: 'pointer' }}>
                                                <td>{<p className="color-blue" style={{ cursor: 'pointer' }} onClick={(e) => {
                                                    e.preventDefault();
                                                    localStorage.setItem('onBoardingId', employee._id)
                                                    navigate('/people-profile')
                                                }}>{employee.employee_code}</p>}</td>
                                                <td>
                                                    {employee.name}
                                                    <br />
                                                    {employee.email}
                                                    <br />
                                                    {employee.mobile_no}
                                                </td>
                                                <td>{employee.designation}</td>
                                                <td>{employee.department}</td>
                                                <td>{employee.batch_id}</td>
                                                <td>{employee.joining_date}</td>
                                                <td>{employee.appraisal_date}</td>
                                                <td>{employee.ctc}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EmployeeTable;

