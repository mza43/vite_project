import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";

const UserViewDialog = ({ open, onClose, user }) => {


  return (
    <Dialog
      open={open}
      onClose={onClose}        
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>User Details</DialogTitle>

      <DialogContent dividers>
        {user ? (
          <Stack spacing={1.25}>
            <Typography><b>Name:</b> {user.name}</Typography>
            <Typography><b>Email:</b> {user.email}</Typography>
            <Typography><b>Phone:</b> {user?.setting?.phone || "N/A"}</Typography>
            <Typography><b>City:</b> {user?.setting?.city || "N/A"}</Typography>
          </Stack>
        ) : (
          <Typography>No user selected.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserViewDialog;
