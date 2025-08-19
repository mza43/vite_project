import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function UserFormDialog({ open, onClose, initialUser = null, onSubmit }) {
  const formik = useFormik({
    initialValues: {
      name: initialUser?.name || "",
      email: initialUser?.email || "",
      phone: initialUser?.setting?.phone || "",
      city: initialUser?.setting?.city || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (!open) formik.resetForm();
   
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialUser ? "Edit User" : "Add User"}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField margin="dense" fullWidth label="Name" name="name" value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} />
          <TextField margin="dense" fullWidth label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
          <TextField margin="dense" fullWidth label="Phone" name="phone" value={formik.values.phone} onChange={formik.handleChange} />
          <TextField margin="dense" fullWidth label="City" name="city" value={formik.values.city} onChange={formik.handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
