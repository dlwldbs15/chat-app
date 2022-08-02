import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
export default function AlertDialog({Title, Discription, isOpen, visibleOKButton, visibleCancelButton, okCallback}) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(isOpen);
  },[isOpen]);

  const handleOK = () => {
    setOpen(false);
    if (okCallback != null)
      okCallback();
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {Title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {Discription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {visibleCancelButton ? <Button onClick={handleClose}>Cancel</Button> : null}
          {visibleOKButton ? <Button onClick={handleOK} autoFocus>
            OK
          </Button> : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}