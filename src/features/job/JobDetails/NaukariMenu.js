import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicIcon from '@mui/icons-material/Public';
import BlockIcon from '@mui/icons-material/Block';
import UpdateIcon from '@mui/icons-material/Update';
import { alpha, useTheme } from '@mui/material/styles';
import PostJobModal from './PostJobModal';
import axios from 'axios';
import config from '../../../config/config';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetJobListById } from '../../slices/AtsSlices/getJobListSlice';
import { apiHeaderToken } from '../../../config/api_header';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import UnpublishOrDeleteJobOnNaukri from './UnPublishOrDeleteJob';

/**
 * NaukariMenu
 * Renders the Naukari actions menu and controls the PostJobModal.
 */
export default function NaukariMenu({ data }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const dispatch = useDispatch()
  const { id } = useParams();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postedData, setPostedData] = useState(null);
  const isArchived = data?.naukari_job_data?.status === 'DELETED';



  const handleDeleteOrUnpublish = async () => {
      try {

        let response = await axios.post(`${config.API_URL}naukri/unpublish_job`, {
          job_doc_id: data?._id
        }, apiHeaderToken(config.API_TOKEN))

        if (response.data?.status) {

          toast.success(response.data?.message)
          dispatch(GetJobListById(id));

        } else {
          toast.error(response.data?.message || 'An error occurred while processing your request.');
        }

      } catch (error) {
        console.error('Error deleting or unpublishing job:', error);
        toast.error(error?.response.data?.message || 'An unexpected error occurred. Please try again later.');
      }
  }

  const handleFetchCandidateFromNaukri = async () => {
      try {

        let response = await axios.post(`${config.API_URL}naukri/fetchCandidates`, {"job_doc_id":data?._id} , apiHeaderToken(config.API_TOKEN))

        if (response.data?.status) {

          toast.success(response.data?.message)
          dispatch(GetJobListById(id));

        } else {
          toast.error(response.data?.message || 'An error occurred while processing your request.');
        }

      } catch (error) {
        console.error('Error deleting or unpublishing job:', error);
        toast.error(error?.response.data?.message || 'An unexpected error occurred. Please try again later.');
      }
  }

  const options = [
    !isArchived && !data?.naukari_job_data?.publish_job_id && {
      label: 'Publish',
      icon: <PublicIcon fontSize="small" sx={{ color: theme.palette.success.main }} />,
      action: () => setModalOpen(true),
    },

    !isArchived && data?.naukari_job_data?.publish_job_id && {
      label: 'Update Job',
      icon: <UpdateIcon fontSize="small" sx={{ color: theme.palette.info.main }} />,
      action: () => setModalOpen(true),
    },

    !isArchived && data?.naukari_job_data?.publish_job_id && {
      label: 'Refresh Candidate(s)',
      icon: <UpdateIcon fontSize="small" sx={{ color: theme.palette.info.main }} />,
      action: () => handleFetchCandidateFromNaukri(),
    },

    !isArchived && postedData && postedData?.jobStatus?.naukri?.url && {
      label: 'View Job On Naukri',
      icon: <OpenInNewIcon fontSize="small" sx={{ color: theme.palette.info.main }} />,
      action: () => window.open(postedData.jobStatus.naukri.url, '_blank'),
    },

    !isArchived && data?.naukari_job_data?.publish_job_id && {
      label: 'Unpublish / Delete',
      icon: <BlockIcon fontSize="small" sx={{ color: theme.palette.error.main }} />,
      action: () => setDeleteConfirmOpen(true),
    },

    isArchived && {
      label: 'Repost Job On Naukri',
      icon: <PublicIcon fontSize="small" sx={{ color: theme.palette.success.main }} />,
      action: () => setModalOpen(true),
    },
  ].filter(Boolean);

  return (
    <>
      <Button
          variant="outlined"
          endIcon={<MoreVertIcon />}
          onClick={handleClick}
          aria-controls={open ? 'naukari-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
      >
        {'Naukri'}
      </Button>

      <Menu
          id="naukari-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {options.map((opt) => (
            <MenuItem
              key={opt.label}
              onClick={() => {
                handleClose();
                opt.action();
              }}
            >
              {opt.icon}
              <span style={{ marginLeft: 8 }}>{opt.label}</span>
            </MenuItem>
          ))}
      </Menu>

      {/* Modal Component */}
      <PostJobModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        setPostedData={setPostedData}
        postedData={postedData}
      />

      <UnpublishOrDeleteJobOnNaukri 
        deleteConfirmOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        handleDeleteOrUnpublish={handleDeleteOrUnpublish}
      />


       {/* Delete or unpublished Data with that status */}

     {/* <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Unpublish Job"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to unpublish this job from Naukri? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              handleDeleteOrUnpublish();
            }}
            color="error"
            variant="contained"
            autoFocus
          >
            Unpublish
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
}
