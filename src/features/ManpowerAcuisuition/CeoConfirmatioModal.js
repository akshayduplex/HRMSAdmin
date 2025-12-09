import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({open, setConfirmNoConfirm ,  handleSendMPRToEmailToCEO , getReqisitionDataToSendEmailForCEO}) {

  const handleClose = () => {
    setConfirmNoConfirm(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Before Sending"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to Re-send the (MPR) to the CEO for approval?
            Please ensure the details are accurate and all necessary updates have been made before proceeding.
            This action will notify the CEO and initiate the approval process.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=> handleSendMPRToEmailToCEO(getReqisitionDataToSendEmailForCEO)}>Send</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}