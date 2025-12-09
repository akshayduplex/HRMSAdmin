import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { toast } from "react-toastify";

const SendMprProject = ({ open, setOpenClosed, Data, loadingFetch }) => {

    const [loading, setLoading] = useState('');
    const [allsendLoading, setAllSendLoading] = useState(false);


    let userDetails = JSON.parse(localStorage.getItem('admin_role_user')) || {};

    let managerList = (Data?.manager_list || []).map((item) => ({
        employee_name: item?.emp_name,
        employee_id: item?.emp_id,
        employee_code: item?.emp_code,
        employee_role: "Project Manager",
        employee_designation: item?.designation,
    }));

    let InChargeList = (Data?.in_charge_list || []).map((item) => ({
        employee_name: item?.emp_name,
        employee_id: item?.emp_id,
        employee_code: item?.emp_code,
        employee_role: "Project Head",
        employee_designation: item?.designation,
    }));

    let arrayList = [...managerList, ...InChargeList];

    // Sending Single MPR features

    const HandleSendSingleMPR = async (empDoc = '') => {
        try {
            setLoading(empDoc)
            let paylods = {
                "project_id": Data?._id,
                "employee_doc_id": empDoc,
                "add_by_name": userDetails?.name,
                "add_by_mobile": userDetails?.mobile_no,
                "add_by_designation": userDetails?.designation,
                "add_by_email": userDetails?.email
            }
            let response = await axios.post(`${config.API_URL}sendRequisitionCreateFormMailByEmployeeID`, paylods, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response?.data?.message);
            } else {
                toast.error(response?.data?.message)
            }
            setLoading('')
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Someting Went Wrong");
            setLoading('')
        }
    }

    //  send to Evary One in MPR 
    const handleSendMPR = async (e) => {
        e.preventDefault()
        try {
            setAllSendLoading(true)
            let Payloads = {
                "project_id": Data?._id,
                "add_by_name": userDetails?.name,
                "add_by_mobile": userDetails?.mobile_no,
                "add_by_designation": userDetails?.designation
            }
            let response = await axios.post(`${config.API_URL}sendRequisitionCreateFormMail`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message);
                setOpenClosed(false)
            } else {
                toast.error(response.data.message);
            }
            setAllSendLoading(false)
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Someting Went Wrong");
            setAllSendLoading(false)
        }
    }

    return (
        <Modal
            show={open}
            onHide={(e) => setOpenClosed(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Project Managers & Head List
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <div className="modaltbl">
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Sno.</th>
                                <th>Employee Name</th>
                                <th>Employee Designation</th>
                                <th>Project Role</th>
                                <th>Send MPR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loadingFetch ?
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', verticalAlign: 'middle', height: '100px' }}>
                                            <div className="loader"></div>
                                        </td>
                                    </tr>
                                    :
                                    arrayList && Array.isArray(arrayList) && arrayList?.length > 0 ?
                                        arrayList?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.employee_name}</td>
                                                    <td>{item?.employee_designation}</td>
                                                    <td>{item?.employee_role}</td>
                                                    <td><Button disabled={loading === item?.employee_id} onClick={() => HandleSendSingleMPR(item?.employee_id)}>{loading === item?.employee_id ? 'Sending MPR...' : 'Send'}</Button></td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', verticalAlign: 'middle', height: '100px' }}>
                                                No Project Manager and Head Aligned.
                                            </td>
                                        </tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={allsendLoading} variant="primary" onClick={handleSendMPR} >
                    {allsendLoading ? 'Sending MPR...' : 'Send All'}
                </Button>
                <Button variant="danger" onClick={() => setOpenClosed(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SendMprProject;
