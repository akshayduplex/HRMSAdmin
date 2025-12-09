import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import config from '../../../../config/config';
import { apiHeaderToken } from '../../../../config/api_header';
import { toast } from 'react-toastify';
import { FetchAppliedCandidateDetailsCount } from '../../../slices/AppliedJobCandidates/JobAppliedCandidateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function DeleteConfirmationModal({ open, handleClose, data, rows, setListApproval, approvalNotes }) {
    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(true);
    const dispatch = useDispatch()
    const { id } = useParams();
    const filterJobDetails = useSelector((state) => state.appliedJobList.selectedJobList);

    /************* handle Input changes To check the approval Note Id ************/
    const handleInputChange = (e) => {

        const value = e.target.value;

        setInputValue(value);

        if (value === data?.approval_note_id) {

            setIsValid(true);

        } else {

            setIsValid(false);

        }
    };

    /************* Handle Clicked To Delete Modal ************/
    const handleConfirmDelete = () => {

        if (inputValue === data?.approval_note_id) {

            handleDeleteApprovalNoteById();

        } else {

            setIsValid(false);
        }
    };

    /**
     * ---------------@description-----------------------------------
     * Delete Approval Note By Id
     */
    const handleDeleteApprovalNoteById = async () => {

        let payload = {
            approval_note_id: inputValue,
            approval_note_doc_id: data?._id
        }

        try {
            let response = await axios.post(`${config.API_URL}deleteApprovalNoteById`, payload, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {

                toast.success(response.data?.message);

                setListApproval(approvalNotes?.filter((item) => item?.approval_note_id !== inputValue))
                dispatch(FetchAppliedCandidateDetailsCount(id || filterJobDetails?.value));


                handleClose()

                setInputValue("")
            } else {

                toast.error(response.data?.message);

            }

        } catch (error) {

            toast.error(error?.response.data?.message || error.message || "Something Went Wrong");

        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Are you sure you want to delete the Approval Note <strong>{data?.approval_note_id}</strong>? This action cannot be undone.
                </Typography>
                <TextField
                    label="Enter Approval Note ID to confirm"
                    variant="outlined"
                    fullWidth
                    value={inputValue}
                    onChange={handleInputChange}
                    error={!isValid}
                    helperText={isValid ? "" : "Approval Note Id does not match."}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirmDelete}
                    color="error"
                    variant="contained"
                    disabled={!isValid}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
