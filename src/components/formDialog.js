import * as React from 'react';
import {TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';

export default function FormDialog({title, content, placeholder, isOpen, submitValue}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const changeText = (e) => {
    if (text !== e.target.value)
        setText(e.target.value);
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleOK = () => {
    setOpen(false);
    submitValue(text)
  };
  React.useEffect(() => {
    setOpen(isOpen);
  },[isOpen]);
 
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={placeholder}
            type="text"
            fullWidth
            variant="standard"
            onChange={changeText}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOK}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}