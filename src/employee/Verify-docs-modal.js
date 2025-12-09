import React, { useState, useEffect } from "react";
import config from "../config/config";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Viewdoc_modal from "./View-document";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEye, FaDownload } from "react-icons/fa";
import axios from "axios";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../config/api_header";
import { toast } from "react-toastify";
import moment from "moment";

const IMAGE_PATH = config.IMAGE_PATH;
export default function Verify_docs_modal(props) {
  const [viewmodalShow, setViewModalShow] = useState(false);
  const [employeeDoc, setEmployeeDoc] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedDocName, setSelectedDocName] = useState("");

  let EmployeeId = localStorage.getItem('onBoardingId')

  const { Document, candidate, fetchRecords } = props;
  const admin_role_user = JSON.parse(localStorage.getItem('admin_role_user'))


  // Example function to handle the upload logic
  const uploadDocument = async (docDetails) => {
    try {

      let payloads = {
        // "employee_doc_id":EmployeeId,
        "candidate_doc_id": candidate?._id,
        "action": "Accept",
        "onboard_doc_id": docDetails?._id || '',
        "add_by_name": admin_role_user?.name,
        "add_by_email": admin_role_user?.email,
        "add_by_mobile": admin_role_user?.mobile_no,
        "add_by_designation": admin_role_user?.designation
      }

      let response = await axios.post(`${config.API_URL}verifyOnBoardDocuments`, payloads, apiHeaderToken(config.API_TOKEN))

      if (response.status === 200) {
        toast.success(response.data?.message || "Document Uploaded Successfully")
        // fetchRecords();
      } else {
        // Handle upload failure
        toast.error(response.data?.message || "SomeTing Went Wrong")
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.response.data?.message || error?.message || "SomeTing Went Wrong")
    }
  };


  const handleDownloadClick = (fileName, docName) => {
    const fileUrl = IMAGE_PATH + fileName;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewClick = (fileName, docName) => {
    setSelectedImage(IMAGE_PATH + fileName);
    setSelectedDocName(docName);
    setViewModalShow(true);
  };

  return (
    <>
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="border-0 px-4" closeButton>
          <Modal.Title>Documents Attached</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-top">
          <Table className="docstable">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Document Name</th>
                <th>Category</th>
                <th>Attached Date</th>
                <th>Uploaded By</th>
                <th colspan="2">Action</th>
              </tr>
            </thead>
            <tbody>

              {
                Document && Document.length > 0 ? (
                  Document?.map((doc, index) => {
                    return (
                      <>
                        <tr key={doc._id}>
                          <td>{index + 1}</td>
                          <td>{doc.doc_name}</td>
                          <td>{doc.doc_category}</td>
                          <td>{moment(doc?.send_file_data?.add_date).format("DD/MM/YYYY")}</td>
                          <td>{doc?.send_file_data?.added_by_data?.name || ""}</td>
                          <td>
                            <div className="d-flex flex-row gap-3 justify-content-end">
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>View Document</Tooltip>}
                              >
                                <button
                                  className="viewfile"
                                  onClick={() => handleViewClick(doc?.send_file_data?.file_name, doc.doc_name)}
                                >
                                  <FaEye />
                                </button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Download Document</Tooltip>}
                              >
                                <button
                                  className="viewfile"
                                  onClick={() => handleDownloadClick(doc?.send_file_data?.file_name, doc.doc_name)}
                                >
                                  <FaDownload />
                                </button>
                              </OverlayTrigger>
                              {/* <button className="set_verify" onClick={(e) => uploadDocument(doc)}>Verify</button> */}
                            </div>
                          </td>
                        </tr>
                      </>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6">No documents available</td>
                  </tr>
                )
              }
            </tbody>

          </Table>
          {/* <div className="read-btn d-flex justify-content-center align-items-center my-3">
            <button className="px-5 w-small btn" onClick={(e) => uploadDocument()}>Verify All</button>
          </div> */}
        </Modal.Body>
      </Modal>

      <Viewdoc_modal show={viewmodalShow} onHide={() => setViewModalShow(false)} imageUrl={selectedImage} docName={selectedDocName} />

    </>
  );
}
