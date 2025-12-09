import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ast1 from "../../../images/ast1.png";
import ast2 from "../../../images/ast2.png";
import { IoMdEye } from "react-icons/io";
import { IoMdClose } from "react-icons/io";


const ViewAssigned = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageSrc = ast1;

    // Open modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="" closeButton>
                <Modal.Title>
                    <h4>Assigned Asset Details</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Employee Code</p>
                            <h6>1011011000</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Employee Name</p>
                            <h6>Anshul Awathi</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Asset Name</p>
                            <h6>MSI-LPT007</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Device Serial Number</p>
                            <h6>58454466</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Asset/Device Type</p>
                            <h6>Laptop</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Assign Date</p>
                            <h6>22/11/2021</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Asset Images</p>
                            <div className='viewasst_imgs'>
                                <div className='astimgbox' onClick={openModal}>
                                    <img src={ast1} />
                                    <IoMdEye />
                                </div>
                                <div className='astimgbox'>
                                    <img src={ast2} />
                                    <IoMdEye />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Signed Declaration Form</p>
                            <div className='decltion'>
                                <h6>Declaration.pdf</h6>
                                <span><IoMdEye /></span>
                            </div>
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <div className="imgpopup" style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                        <button onClick={closeModal} style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            padding: "0px 5px 3px",
                            backgroundColor: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            zIndex: 10,
                            lineHeight: "normal"
                        }}
                        >
                            <IoMdClose />
                        </button>

                        <img src={imageSrc}
                            alt="Full View"
                            style={{
                                maxWidth: "90%",
                                maxHeight: "90%",
                                borderRadius: "8px",
                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
                            }}
                        />
                    </div>
                )
                }
            </Modal.Body>

        </Modal> 


    )
}
export default ViewAssigned;
