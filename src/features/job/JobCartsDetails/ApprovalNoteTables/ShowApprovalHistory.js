import { Box, Button } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { Modal, Accordion, Table, Row, Col } from 'react-bootstrap';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { CamelCases, changeJobTypeLabel } from '../../../../utils/common';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../../../config/config';
import { apiHeaderToken } from '../../../../config/api_header';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationModal from './DeleteCandidateModal';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const RecordsModal = ({ openModalApprovalHistory, handleClosedShowApprovalHistory, data, setData, getApprovalListByJobId }) => {
  const getUserDetails = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};
  const filterJobDetails = useSelector((state) => state.appliedJobList.selectedJobList);
  const { id } = useParams();

  const [DeleteCandidateLoading, setCandidateLoading] = useState(false)

  const [loading, setLoading] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const handleDeleteCandidate = (e, data) => {
    e.preventDefault();
    setDeleteData(data);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleDeleteConfirm = async () => {

    let payload = {
      "approval_note_doc_id": data?._id,
      "approval_note_id": data?.approval_note_id,
      "candidate_doc_id": deleteData?.cand_doc_id
    }

    setCandidateLoading(true)

    axios
      .post(`${config.API_URL}removeCandidateFromApprovalNoteById`, payload, apiHeaderToken(config.API_TOKEN))
      .then((response) => {
        toast.success(response.data.message);

        const updatedCandidateList = data?.candidate_list?.filter(
          (item) => item.cand_doc_id !== deleteData?.cand_doc_id
        );
        setCandidateLoading(false)

        setData((prevData) => ({
          ...prevData,
          candidate_list: updatedCandidateList,
        }));

        if (filterJobDetails?.value) {
          getApprovalListByJobId(filterJobDetails?.value)
        }
        if (id) {
          getApprovalListByJobId(id)
        }

        setShowDeleteModal(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err?.message);
        setCandidateLoading(false)
      });

  };

  const haringStatus = (e, candidate, status) => {
    e.preventDefault();
    const payload = {
      candidate_id: candidate?.cand_doc_id,
      applied_job_id: candidate?.applied_job_doc_id,
      hiring_status: status,
      add_by_name: getUserDetails?.name,
      add_by_mobile: getUserDetails?.mobile_no,
      add_by_designation: getUserDetails?.designation,
      add_by_email: getUserDetails?.email,
    };

    setLoading(status);

    axios
      .post(`${config.API_URL}updateHireStatus`, payload, apiHeaderToken(config.API_TOKEN))
      .then((response) => {
        toast.success(response.data.message);
        setLoading('');
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err?.message);
        setLoading('');
      });
  };

  return (
    <>
      <Modal show={openModalApprovalHistory} onHide={handleClosedShowApprovalHistory} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Approval History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey="0">
            {data?.candidate_list?.length <= 0 ? <h4 className='text-center'> No Records Found </h4> : data?.candidate_list?.map((item, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>
                  Candidate Name - {CamelCases(item?.name)}
                </Accordion.Header>
                <Accordion.Body>
                  <Row className='mb-3'>
                    <Col sm={3}>
                      <span> <strong style={{ fontSize: '14px', fontWeight: '640' }} >CTC Amount</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}>{item?.offer_ctc}</p> </span>
                    </Col>
                    <Col sm={3}>
                      <span> <strong style={{ fontSize: '14px', fontWeight: '640' }} >Onboarding Date</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}> {moment(item?.onboarding_date).format('DD-MM-YYYY')} </p>  </span>
                    </Col>
                    <Col sm={3}>
                      <span> <strong style={{ fontSize: '14px', fontWeight: '640' }}>Contract End Date</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}> {moment(item?.job_valid_date).format('DD-MM-YYYY')} </p>  </span>
                    </Col>
                    <Col sm={3}>
                      <span> <strong style={{ fontSize: '14px', fontWeight: '640' }}>Employment Nature</strong> : <p style={{ fontSize: '14px', fontWeight: '400' }}>{changeJobTypeLabel(item?.job_type)}</p> </span>
                    </Col>
                  </Row>

                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Sr No.</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item?.approval_history?.length > 0 ? (
                        item.approval_history.map((member, idx) => {
                          const memberDetails = data?.panel_members_list?.find(
                            (panelMember) => panelMember?.emp_doc_id === member?.emp_doc_id
                          );
                          return (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{CamelCases(memberDetails?.name) || 'N/A'}</td>
                              <td>{memberDetails?.designation || 'N/A'}</td>
                              <td>{member?.approval_status || 'N/A'}</td>
                              <td>
                                {member?.approved_date
                                  ? moment(member?.approved_date).format('DD/MM/YYYY')
                                  : 'N/A'}
                              </td>
                              <td>{member?.remark || 'N/A'}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
                            No Records Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  <Box sx={{ display: 'flex', justifyContent: 'end', gap: 3, mt: 2 }}>
                    {item?.approval_history?.length > 0 && (
                      <>
                        <Button
                          color="success"
                          variant="contained"
                          startIcon={<CheckCircleIcon />}
                          onClick={(e) => haringStatus(e, item, 'Approved')}
                          disabled={loading === 'Approved'}
                        >
                          Approve
                        </Button>
                        <Button
                          color="warning"
                          variant="contained"
                          startIcon={<PauseCircleIcon />}
                          onClick={(e) => haringStatus(e, item, 'Hold')}
                          disabled={loading === 'Hold'}
                        >
                          Hold
                        </Button>
                      </>
                    )}
                    {['Inprogress'].includes(data?.status) && (
                      <Button
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={(e) => handleDeleteCandidate(e, item)}
                        disabled={loading === 'Hold'}
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosedShowApprovalHistory}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <DeleteConfirmationModal
        candidateName={deleteData?.name}
        open={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={DeleteCandidateLoading}
      />
    </>
  );
};

export default RecordsModal;
