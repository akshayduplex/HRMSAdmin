import axios from "axios";
import moment from "moment";
import React , { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from 'react-bootstrap/Table';
import { toast } from "react-toastify";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import { useDispatch } from "react-redux";
import { ManPowerAcquisitionsSlice } from "../slices/JobSortLIstedSlice/SortLIstedSlice";
import { Spinner } from "react-bootstrap";

const ApprovalModal = (props) => {

    const dispatch = useDispatch();
    const [loading ,setLoading] = useState();

    let { data , onHide } = props;
    const [formData , setFormData] = useState({
        approvalBy:'',
        approveType:'',
        comment:''
    })

    const handleChanges = (obj) => {
        setFormData((prevData) => ({
            ...prevData, // Spread the existing state
            ...obj       // Merge the new object into the state
        }));
    };

    const handleSubmit = async () => {
         try {
            if(!formData.approvalBy){
                return toast.warn('Please choose the Designation');
            }
            if(!formData.approveType){
                return toast.warn('Please choose the Approve Type');
            }
            if(!formData.comment){
                return toast.warn('Please enter the comment');
            }
            setLoading(true);
            let Payloads = {
                "_id":data?._id,
                "designation":formData.approvalBy,
                "status":formData.approveType,
                "comment":formData?.comment 
            }
            let response = await axios.post(`${config.API_URL}approveRejectRequisitionForm` , Payloads , apiHeaderToken(config.API_TOKEN))
            if(response.status === 200){
                toast.success(response.data?.message);
                let Payloads = {
                    "keyword": "",
                    "page_no": "1",
                    "per_page_record": "1000", "scope_fields": [],
                    "status": ""
                }
                dispatch(ManPowerAcquisitionsSlice(Payloads))
                setLoading(false)
                onHide();
                handleChanges({approvalBy:'',approveType:'',comment:''})
            }else{
                toast.error(response.data?.message);
                setLoading(false)
            }
         } catch (error) {
            console.log(error);
            toast.error(error.response.data.message ?? error.response.data.error.message ?? error.message );
            setLoading(false)
         }
    }


    return (
        <Modal {...props} size="lg" className="jobtemp_modal approvalmodal">
            <Modal.Header className="border-0" closeButton>
                <Modal.Title>
                    <h4>Status</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="row">
                        <Form.Group className="col-lg-6 position-relative" controlId="formGridEmail">
                            <Form.Label>Approved By</Form.Label>
                            <Form.Select  value={formData.approvalBy} onChange={(e) => handleChanges({approvalBy:e.target.value})}>
                                <option value={""}>Choose Type</option>
                                <option value={"HOD"}>HOD</option>
                                <option value={"CEO"}>CEO</option>
                                <option value={"HR"}>HR</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="row">
                            <div className="col-lg-6 mb-3">
                                <div className="d-flex flex-row gap-3 mt-3">
                                    <Form.Check
                                        type="radio"
                                        label="Approve"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        onClick={(e)=>  handleChanges({approveType:'Approved'})}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Reject"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                        onClick={(e)=>  handleChanges({approveType:'Reject'})}
                                    />
                                </div>
                            </div>
                            <div className='mb-4 col-sm-12'>
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as="textarea" placeholder="Enter description" value={formData.comment} onChange={(e) => handleChanges({comment:e.target.value})} />
                            </div>
                            <div className="text-center">
                                {
                                    loading ?
                                    <button className="sitebtn" ><Spinner animation="border" role="status"></Spinner></button>
                                    :
                                    <button className="sitebtn" onClick={handleSubmit}>Submit</button>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mx-fuller d-flex flex-column gap-3 infobox pe-3">
                        <div className="modaltbl w-100">
                            <Table hover className="">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Approved By (Designation)</th>
                                        <th>Comment</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data && data?.activity_data?.length > 0
                                            ? data.activity_data.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>{moment(item?.comment_date).format('DD/MM/YYYY')}</td>
                                                        <td>{item?.designation}</td>
                                                        <td>{item?.comment}</td>
                                                        <td>{item?.status}</td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                                    No records found
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default ApprovalModal;
