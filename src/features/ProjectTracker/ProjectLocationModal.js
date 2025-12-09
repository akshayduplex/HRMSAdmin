import React from "react";
import Modal from "react-bootstrap/Modal";

const ProjectLocationModal = (props) => {
    
    const { ProjectLocation } = props;

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="border-0" closeButton>
                <Modal.Title>
                    <h4>Project Location  <span className="postn_name">{ProjectLocation?.title}</span></h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="projectloc_wraps">
                   <ol>
                      {/* <li>Arunachal Pradesh</li>
                      <li>Himachal Pradesh</li>
                      <li>Uttar Pradesh</li>
                      <li>Noida</li>
                      <li>Assam</li>
                      <li>Nagaland</li>
                      <li>Odissa</li>
                      <li>Rajasthan</li> */}
                      {
                                ProjectLocation?.location?.map((item, index) => {
                                    return (
                                        <>
                                           <li key={index}>{item?.name}</li>
                                        </>
                                    )
                                })
                            }
                   </ol>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default ProjectLocationModal;
