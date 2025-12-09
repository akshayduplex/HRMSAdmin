import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ViewofferModal = (props) => {
    const filterJobDetails = useSelector((state) => state.appliedJobList.selectedJobList);
    const { id } = useParams();

    let {  data } = props

    return (
        <Modal {...props} size="md" className="jobtemp_modal offermodal">
            <Modal.Header className="border-0" closeButton>
                <Modal.Title>
                    <h4>View Offer</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="row">

                        <Form.Group className="col-lg-12 mb-4" controlId="exampleForm.ControlInput1" >
                            <Form.Label>Designation </Form.Label>
                            <Form.Control value={data?.designation}  />
                        </Form.Group>
                        <Form.Group className="col-lg-6" controlId="">
                            <Form.Label>
                                CTC per annum
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text id=""><MdOutlineCurrencyRupee /></InputGroup.Text>
                                <Form.Control placeholder="360000" aria-describedby="" value={data?.applied_jobs?.find(item => item.job_id === id || filterJobDetails?.value)?.offer_ctc} />
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className="mx-fuller d-flex flex-column gap-3 infobox pe-3">

                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default ViewofferModal;
