import React, { useState } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";

const DeleteConfirmationModal = ({ candidateName, open, onClose, onConfirm  , loading}) => {
  return (
    <Modal
      open={open}
      onClose={!loading && onClose}
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="delete-confirmation-title" variant="h6" component="h2">
          Delete Candidate
        </Typography>
        <Typography id="delete-confirmation-description" sx={{ mt: 2 }}>
          Are you sure you want to delete <strong>{candidateName}</strong> Candidate?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button onClick={onClose} sx={{ mr: 2 }} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>
             { loading ? 'Loading...' : 'Delete' }
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal
