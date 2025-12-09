import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
// import ast1 from "../../../images/ast1.png";
// import ast2 from "../../../images/ast2.png";
import { IoMdEye } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import config from "../../config/config";


const ViewReturnAssets = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [imagItem, setImg] = useState(null);

    const { asset } = props;

    // Open modal
    const openModal = (img) => {
        setIsModalOpen(true);
        setImg(img)
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const renderFilePreview = (fileUrl) => {
        const fileExtension = fileUrl.split('.').pop().toLowerCase();

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
            return (
                <img
                    src={`${config.IMAGE_PATH}${fileUrl}`}
                    alt="Full View"
                    style={{
                        maxWidth: "90%",
                        maxHeight: "90%",
                        borderRadius: "8px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
                    }}
                />
            );
        } else if (fileExtension === "pdf") {
            return (
                <iframe
                    src={`${config.IMAGE_PATH}${fileUrl}`}
                    title="PDF Preview"
                    style={{
                        width: "90%",
                        height: "90%",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
                    }}
                />
            );
        } else if (["doc", "docx"].includes(fileExtension)) {
            return (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        `${config.IMAGE_PATH}${fileUrl}`
                    )}`}
                    title="Document Preview"
                    style={{
                        width: "90%",
                        height: "90%",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
                    }}
                />
            );
        } else {
            return <p>Unsupported file type</p>;
        }
    };
    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="" closeButton>
                <Modal.Title>
                    <h4>Returned Asset Details</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Employee Code</p>
                            <h6>{asset?.employee_code}</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Employee Name</p>
                            <h6>{asset?.employee_name}</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Asset Name</p>
                            <h6>{asset?.asset_name}</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Device Serial Number</p>
                            <h6>{asset?.serial_no}</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Asset/Device Type</p>
                            <h6>{asset?.asset_type}</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Assign Date</p>
                            <h6>{asset?.assign_date}</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Asset Images</p>
                            <div className='viewasst_imgs'>
                                {
                                    asset?.assign_device_image && asset.assign_device_image?.length > 0 &&
                                    asset.assign_device_image?.map((item) => {
                                        return (
                                            <div className='astimgbox' onClick={() => openModal(item)}>
                                                <img src={`${config.IMAGE_PATH}${item}`} width={50} height={50} alt="item" />
                                                {/* <IoMdEye /> */}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Signed Declaration Form</p>
                            <div className='decltion'>
                                <h6>Declaration.pdf</h6>
                                <span onClick={() => openModal(asset?.signed_declaration_form)}><IoMdEye /></span>
                            </div>
                        </div>
                    </div>

                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Return Status</p>
                            <h6>{asset?.return_condition_status}</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Return Date</p>
                            <h6>{asset?.return_date}</h6>
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='asst_dtlsbox'>
                            <p>Return Condition or fault</p>
                            <h6>{asset?.return_condition}</h6>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='asst_dtlsbox'>
                            <p>Return Condition Images</p>
                            <div className='viewasst_imgs'>
                                {
                                    asset?.return_condition_device_image && asset.return_condition_device_image?.length > 0 &&
                                    asset.return_condition_device_image?.map((item) => {
                                        return (
                                            <div className='astimgbox' onClick={() => openModal(item)}>
                                                <img src={`${config.IMAGE_PATH}${item}`} width={50} height={50} alt="item" />
                                                {/* <IoMdEye /> */}
                                            </div>
                                        )
                                    })
                                }
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

                        {renderFilePreview(imagItem)}
                    </div>
                )
                }
            </Modal.Body>

        </Modal>


    )
}
export default ViewReturnAssets;
