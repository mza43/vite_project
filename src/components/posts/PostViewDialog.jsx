
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

const PostViewDialog = ({ open, handleClose, post }) => (
  <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle>Post Details</DialogTitle>
    <DialogContent>
      {post && (
        <>
          <Typography>Title: {post.title}</Typography>
          <Typography>Description: {post.description}</Typography>
          <Typography>User: {post.user?.name || "N/A"}</Typography>
          <Typography>
            Categories: {post.categories?.map((c) => c.title).join(", ") || "N/A"}
          </Typography>
        </>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default PostViewDialog;
