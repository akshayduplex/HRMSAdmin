import React, { useEffect, useState } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import { Link } from 'react-router-dom';
import RequisitionTableCeo from './CeoMprTables';
import CeoNavbarComponent from './CeoNavbar';
import SearchInput from './SearchBox';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { ManPowerAcquisitionsSliceCard } from '../slices/JobSortLIstedSlice/SortLIstedSlice';
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


const ListManpowerRequisitionCeo = () => {

    const [search, setSearch] = useState('');
    const searchParams = DeBouncingForSearch(search)
    const [selectedRows, setSelectedRows] = useState([]);
    const [bulkApprovalModal, setBulkApprovalModal] = useState(false);
    const [bulkApprovalStatus, setBulkApprovalStatus] = useState('Approved');
    const [bulkApprovalFeedback, setBulkApprovalFeedback] = useState('');
    const [bulkApprovalLoading, setBulkApprovalLoading] = useState(false);
    const [getParams] = useSearchParams();
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
                "employee_id": "NA",
                "mpr_ids": selectedRows,
                "status": bulkApprovalStatus,
                "remark": bulkApprovalFeedback,
                "designation": "CEO"
            };

            let respose = await axios.post(`${config.API_URL}BulkApprovedMprByCeoOrHodSir`, payload, apiHeaderToken(config.API_TOKEN));

            if (respose.status === 200) {
                toast.success(respose?.data?.message);
                setBulkApprovalFeedback('');
                setBulkApprovalStatus('Approved');
                setSelectedRows([]);
                setBulkApprovalModal(false);
                // dispatch(getManPowerRequisitionCardHod({
                //     employee_id: userDetails?.employee_doc_id,
                //     status: getParams.get('type') === 'PendingByHod' ? 'PendingByHod' : 'PendingByCeo',
                //     page: 1,
                //     pageSize: 9
                // }))
                const isPendingByCeo = getParams.get('type') === 'PendingByCeo';
                let Payloads = {
                    "keyword": "",
                    page_no: isPendingByCeo ? 1 : 1,
                    per_page_record: isPendingByCeo ? 1000 : 1000, // Fetch all data for table view
                    "scope_fields": [],
                    "status": "",
                    "filter_type": getParams.get('type') ? getParams.get('type') : '',
                    "filter_keyword": '',
                    "project_name": getParams.get('project_name') ? getParams.get('project_name') : '',
                    "project_id": getParams.get('project_id') ? getParams.get('project_id') : ''
                }
                dispatch(ManPowerAcquisitionsSliceCard(Payloads))
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
                            {getParams.get('type') === 'PendingByCeo' && (
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
                        <RequisitionTableCeo searchParamsInput={searchParams} setSelectedRows={setSelectedRows} />
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
                                    id="rejected"
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


export default ListManpowerRequisitionCeo;
