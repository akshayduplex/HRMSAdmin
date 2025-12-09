import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const UnpublishOrDeleteJobOnNaukri = ({ deleteConfirmOpen, onClose, handleDeleteOrUnpublish }) => {

    return (
        <>
            <Dialog
                open={deleteConfirmOpen}
                onClose={onClose}
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
                        onClick={() => onClose()}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onClose()
                            handleDeleteOrUnpublish();
                        }}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Unpublish
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UnpublishOrDeleteJobOnNaukri