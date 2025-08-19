// src/components/category/CategoryFormDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const CategoryFormDialog = ({ open, onClose, formik, editId }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="dense"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="dense"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" type="submit">
            {editId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryFormDialog;
