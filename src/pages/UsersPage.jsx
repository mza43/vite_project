import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../store/usersSlice";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Box,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ConfirmDialog from "../components/common/ConfirmDialog";
import NotificationDialog from "../components/common/NotificationDialog";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { list: users, loading, meta } = useSelector((state) => state.users);

  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortModel, setSortModel] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers({ page, search: searchTerm }));
  }, [dispatch, page, searchTerm]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      city: Yup.string().required("City is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          email: values.email,
          settings: {
            phone: values.phone,
            city: values.city,
          },
        };

        if (editId) {
          await dispatch(updateUser({ id: editId, user: payload })).unwrap();
          setNotificationMessage("User updated successfully!");
        } else {
          await dispatch(createUser(payload)).unwrap();
          setNotificationMessage("User created successfully!");
        }

        await dispatch(fetchUsers({ page }));
        setNotificationOpen(true);
        formik.resetForm();
        handleCloseDialog();
      } catch (err) {
        setNotificationMessage(err?.message || "Something went wrong!");
        setNotificationOpen(true);
      }
    },
  });

  const handleOpenDialog = (user = null) => {
    if (user) {
      formik.setValues({
        name: user.name,
        email: user.email,
        phone: user.setting?.phone || "",
        city: user.setting?.city || "",
      });
      setEditId(user.id);
    } else {
      formik.resetForm();
      setEditId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser(deleteId)).unwrap();
      await dispatch(fetchUsers({ page }));
      setNotificationMessage("User deleted successfully!");
      setNotificationOpen(true);
    } catch (err) {
      setNotificationMessage(err?.message || "Delete failed!");
      setNotificationOpen(true);
    }
    setConfirmOpen(false);
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };

  const handleSortChanged = useCallback((params) => {
    const sort = params.api.getSortModel();
    setSortModel(sort);
  }, []);

  const columns = [
    { headerName: "ID", field: "id", width: 70, sortable: true },
    { headerName: "Name", field: "name", flex: 1, sortable: true },
    { headerName: "Email", field: "email", flex: 1, sortable: true },
    {
      headerName: "Phone",
      field: "setting.phone",
      flex: 1,
      valueGetter: (params) => params.data.setting?.phone || "-",
    },
    {
      headerName: "City",
      field: "setting.city",
      flex: 1,
      valueGetter: (params) => params.data.setting?.city || "-",
    },
    {
      headerName: "Actions",
      width: 240,
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleViewClick(params.data)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => handleOpenDialog(params.data)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteClick(params.data.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // reset to page 1 on new search
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add User
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className="ag-theme-alpine" style={{ width: "100%" }}>
            <AgGridReact
              rowData={users}
              columnDefs={columns}
              pagination={false}
              onSortChanged={handleSortChanged}
              domLayout="autoHeight"
              defaultColDef={{
                sortable: true,
                filter: true,
                floatingFilter: true,
              }}
            />
          </div>

          {/* Pagination Controls */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography>
              Page {meta?.currentPage} of {meta?.lastPage} | Total:{" "}
              {meta?.total}
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                disabled={meta?.currentPage === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={meta?.currentPage === meta?.lastPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{editId ? "Edit User" : "Add User"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="dense"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="dense"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              margin="dense"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <TextField
              label="City"
              name="city"
              fullWidth
              margin="dense"
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" type="submit">
              {editId ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <Typography>Name: {selectedUser.name}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>
                Phone: {selectedUser.setting?.phone || "N/A"}
              </Typography>
              <Typography>
                City: {selectedUser.setting?.city || "N/A"}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
      />

      <NotificationDialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        message={notificationMessage}
      />
    </div>
  );
};

export default UsersPage;
