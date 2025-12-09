import moment from 'moment';
import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Table from 'react-bootstrap/Table';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ViewAssetsModal = (props) => {
    const navigate = useNavigate();


    let { assetsData } = props;

    const handleToNavigate = (id) => {
        localStorage.setItem("onBoardingId", id);
        navigate('/people-profile?tab=assets')
    }

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="" closeButton>
                <Modal.Title>
                    <h4>View Asset Details</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="row">
                        <div className='col-sm-6'>
                            <div className='asst_dtlsbox'>
                                <p>Asset Name</p>
                                <h6>{assetsData?.asset_name || 'N/A'}</h6>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='asst_dtlsbox'>
                                <p>Device Serial Number</p>
                                <h6>{assetsData?.serial_no || 'N/A'}</h6>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='asst_dtlsbox'>
                                <p>Asset/Device Type</p>
                                <h6>{assetsData?.asset_type || 'N/A'}</h6>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='asst_dtlsbox'>
                                <p>Status</p>
                                {
                                    assetsData?.assign_status === 'Assigned' ?
                                        <h6 className='text-green'>{assetsData?.assign_status}</h6> :
                                        <h6 className='text-danger'>{assetsData?.assign_status}</h6>
                                }
                            </div>
                        </div>
                    </div>
                    <h6 className="mt-4"> Assign History</h6>
                    <div className="modaltbl mt-0">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Sno.</th>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Assigned On</th>
                                    <th>Returned On</th>
                                    <th>Return Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    assetsData?.assigned_history && assetsData?.assigned_history?.length > 0 ?
                                        assetsData?.assigned_history?.map((item , index) => {
                                            return (
                                                <tr key={item?.employee_doc_id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className='d-flex align-items-center gap-2'>
                                                            <span>{item?.employee_code}</span>
                                                            <span style={{cursor:"pointer"}} onClick={() => handleToNavigate(item?.employee_doc_id)}><FaExternalLinkAlt color='green'/></span>
                                                        </div>
                                                    </td>
                                                    <td>{item?.employee_name}</td>
                                                    <td>{item?.assign_date ? moment(item?.assign_date).format('DD/MM/YYYY') : "-"}</td>
                                                    <td>{item?.return_date ? moment(item?.return_date).format('DD/MM/YYYY') : "-"}</td>
                                                    <td>{item?.return_condition_status || 'N/A'}</td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr className='text-center'>
                                            <td colSpan={6} className='text-center'>No Record Found</td>
                                        </tr>
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default ViewAssetsModal;
