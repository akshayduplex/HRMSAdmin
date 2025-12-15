import React, { useEffect, useState } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import { Link, useSearchParams } from 'react-router-dom';
import SearchInput from '../CeoDashboard/SearchBox';
import RequisitionTableHod from './HodMprList';
import axios from 'axios';
import { apiHeaderToken } from '../../config/api_header';
import { Modal } from 'react-bootstrap';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import config from '../../config/config';
import { ManPowerAcquisitionsSliceCardHod } from '../slices/JobSortLIstedSlice/SortLIstedSlice';
import { useDispatch } from 'react-redux';

const DeBouncingForSearch = (search) => {

    const [DebounceKey, setDeBounceKey] = useState('');

    useEffect(() => {

        let timer = setTimeout(() => {
            setDeBounceKey(search);

        }, 500);

        return () => {
            clearTimeout(timer);
        }

    }, [search])

    return DebounceKey
}

const ListManpowerRequisitionHod = () => {

    const [search, setSearch] = useState('');
    const searchParams = DeBouncingForSearch(search)
    const [selectedRows, setSelectedRows] = useState([]);
    const [bulkApprovalModal, setBulkApprovalModal] = useState(false);
    const [bulkApprovalStatus, setBulkApprovalStatus] = useState('Approved');
    const [bulkApprovalFeedback, setBulkApprovalFeedback] = useState('');
    const [bulkApprovalLoading, setBulkApprovalLoading] = useState(false);
    const [getParams] = useSearchParams();
    const userDetails = JSON.parse(localStorage.getItem('admin_role_user')) || {}
    const dispatch = useDispatch();


    const handleBulkApprove = () => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one approval note to approve.');
            return;
        }
        setBulkApprovalModal(true);
    };

    const handleBulkApprovalSubmit = async () => {
        if (!bulkApprovalFeedback.trim()) {
            toast.error('Please provide feedback for the bulk approval.');
            return;
        }

        setBulkApprovalLoading(true);
        try {

            const payload = {
                "employee_id": userDetails?.employee_doc_id,
                "mpr_ids": selectedRows,
                "status": bulkApprovalStatus,
                "remark": bulkApprovalFeedback,
                "designation": userDetails?.designation
            };

            let respose = await axios.post(`${config.API_URL}BulkApprovedMprByCeoOrHodSir`, payload, apiHeaderToken(config.API_TOKEN));

            if (respose.status === 200) {
                toast.success(`${bulkApprovalStatus} successfully!`);
                setBulkApprovalFeedback('');
                setBulkApprovalStatus('Approved');
                setSelectedRows([]);
                setBulkApprovalModal(false);
                const isPendingByHod = getParams.get('type') === 'PendingByHod';
                let Payloads = {
                    "employee_doc_id": userDetails?.employee_doc_id,
                    "keyword": "",
                    page_no: isPendingByHod ? 1 : 1,
                    per_page_record: isPendingByHod ? 1000 : 1000, // Fetch all data for table view
                    "scope_fields": [],
                    "status": "",
                    "filter_type": getParams.get('type') ? getParams.get('type') : '',
                    "filter_keyword": '',
                    "project_name": getParams.get('project_name') ? getParams.get('project_name') : '',
                    "project_id": getParams.get('project_id') ? getParams.get('project_id') : ''
                }
                dispatch(ManPowerAcquisitionsSliceCardHod(Payloads))
            }

        } catch (error) {
            console.error('Bulk approval error:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
        } finally {
            setBulkApprovalLoading(false);
        }
    };


    return (
        <>
            {/* <CeoNavbarComponent /> */}

            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='dflexbtwn'>
                        <div className='pagename'>
                            <h3>List of Requisition Form</h3>
                            <p>Requisition Raise Request Lisitng  </p>
                        </div>
                        {/* <div className='pb-3 cardsearch'>
                            <SearchInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClear={() => setSearch('')}
                            />
                        </div> */}
                        <div className='d-flex justify-content-center align-item-center gap-2'>
                            {getParams.get('type') === 'PendingByHod' && (
                                <div className='pb-3'>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="medium"
                                        onClick={handleBulkApprove}
                                        disabled={selectedRows.length === 0}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Bulk Approve ({selectedRows.length})
                                    </Button>
                                </div>
                            )}
                            <div className='pb-3 cardsearch'>
                                <SearchInput
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClear={() => setSearch('')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <RequisitionTableHod searchParamsInput={searchParams} setSelectedRows={setSelectedRows} />
                    </div>
                </div>
            </div>

            <Modal show={bulkApprovalModal} onHide={() => setBulkApprovalModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Status *</label>
                        <div className="d-flex gap-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="bulkApprovalStatus"
                                    id="approved"
                                    value="Approved"
                                    checked={bulkApprovalStatus === 'Approved'}
                                    onChange={(e) => setBulkApprovalStatus(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="approved">
                                    Approve
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="bulkApprovalStatus"
                                    id="Reject"
                                    value="Reject"
                                    checked={bulkApprovalStatus === 'Reject'}
                                    onChange={(e) => setBulkApprovalStatus(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="Reject">
                                    Reject
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="bulkApprovalStatus"
                                    id="need_to_discusss"
                                    value="need_to_discusss"
                                    checked={bulkApprovalStatus === 'need_to_discusss'}
                                    onChange={(e) => setBulkApprovalStatus(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="need_to_discusss">
                                    Need to discuss
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Feedback *</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            style={{ height: 160 }}
                            placeholder="Enter your feedback for bulk approval..."
                            value={bulkApprovalFeedback}
                            onChange={(e) => setBulkApprovalFeedback(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() => setBulkApprovalModal(false)}
                            disabled={bulkApprovalLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="success"
                            variant="contained"
                            onClick={handleBulkApprovalSubmit}
                            disabled={bulkApprovalLoading || !bulkApprovalFeedback.trim()}
                        >
                            {bulkApprovalLoading ? 'Processing...' : 'Submit'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}


export default ListManpowerRequisitionHod;
