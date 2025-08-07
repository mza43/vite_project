import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "../store/postsSlice";
import { fetchUsers } from "../store/usersSlice";
import { fetchCategories } from "../store/categoriesSlice";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  CircularProgress,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ConfirmDialog from "../components/common/ConfirmDialog";
import NotificationDialog from "../components/common/NotificationDialog";

// AG Grid modules
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const PostsPage = () => {
  const dispatch = useDispatch();
  const { list: posts, loading } = useSelector((state) => state.posts);
  const { list: users } = useSelector((state) => state.users);
  const { list: categories } = useSelector((state) => state.categories);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Notification
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Filters
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");

  // Fetch data
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesTitle = post.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesDescription = post.description
      .toLowerCase()
      .includes(searchDescription.toLowerCase());
    const matchesUser = filterUserId ? post.user?.id === filterUserId : true;
    const matchesCategory = filterCategoryId
      ? post.categories?.some((c) => c.id === filterCategoryId)
      : true;

    return matchesTitle && matchesDescription && matchesUser && matchesCategory;
  });

  // Formik setup
  const formik = useFormik({
    initialValues: { title: "", description: "", userId: "", categoryIds: [] },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      userId: Yup.string().required("User is required"),
      categoryIds: Yup.array().min(1, "Select at least one category"),
    }),
    onSubmit: async (values) => {
      try {
        if (editId) {
          await dispatch(updatePost({ id: editId, post: values })).unwrap();
          setNotificationMessage("Post updated successfully!");
        } else {
          await dispatch(createPost(values)).unwrap();
          setNotificationMessage("Post created successfully!");
        }
        await dispatch(fetchPosts());
        setNotificationOpen(true);
        formik.resetForm();
        handleCloseDialog();
      } catch (err) {
        setNotificationMessage(err?.message || "Something went wrong!");
        setNotificationOpen(true);
      }
    },
  });

  // Open dialog
  const handleOpenDialog = (post = null) => {
    if (post) {
      formik.setValues({
        title: post.title,
        description: post.description,
        userId: post.user?.id || "",
        categoryIds: post.categories?.map((c) => c.id) || [],
      });
      setEditId(post.id);
    } else {
      formik.resetForm();
      setEditId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  // Delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deletePost(deleteId)).unwrap();
      await dispatch(fetchPosts());
      setNotificationMessage("Post deleted successfully!");
      setNotificationOpen(true);
    } catch (err) {
      setNotificationMessage(err?.message || "Delete failed!");
      setNotificationOpen(true);
    }
    setConfirmOpen(false);
  };

  // View
  const handleViewClick = (post) => {
    setSelectedPost(post);
    setOpenView(true);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTitle("");
    setSearchDescription("");
    setFilterUserId("");
    setFilterCategoryId("");
  };

  // AG Grid columns
  const columns = [
  { headerName: "ID", field: "id", width: 70, filter: true },
  { headerName: "Title", field: "title", flex: 1, filter: true },
  { headerName: "Description", field: "description", flex: 1, filter: true },
  {
    headerName: "User",
    field: "user.name",
    flex: 1,
    filter: true,
    valueGetter: (p) => p.data.user?.name || "-",
  },
  {
    headerName: "Categories",
    field: "categories",
    flex: 1,
    filter: true,
    valueGetter: (p) =>
      p.data.categories?.map((c) => c.title).join(", ") || "-",
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


  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>

      {/* Filters */}
      {/* <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search by Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          size="small"
        />
        <TextField
          label="Search by Description"
          value={searchDescription}
          onChange={(e) => setSearchDescription(e.target.value)}
          size="small"
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>User</InputLabel>
          <Select
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            size="small"
            label="User"
          >
            <MenuItem value="">All Users</MenuItem>
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            size="small"
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Box> */}

      {/* Add button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add Post
      </Button>

      {/* Loader */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="ag-theme-alpine" style={{ width: "100%", borderRadius: "8px" }}>
          <AgGridReact
            rowData={filteredPosts}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
            rowHeight={50}
            headerHeight={45}
            domLayout="autoHeight"
              floatingFilter={true} // 👈 Enables input fields below each header

          />
        </div>
      )}

      {/* Dialog Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{editId ? "Edit Post" : "Add Post"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="dense"
              value={formik.values.title}
              onChange={formik.handleChange}
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
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />

            {/* User Select */}
            <FormControl fullWidth margin="dense">
              <InputLabel>User</InputLabel>
              <Select
                name="userId"
                value={formik.values.userId}
                onChange={formik.handleChange}
                input={<OutlinedInput label="User" />}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.userId && formik.errors.userId && (
                <Typography color="error" variant="caption">
                  {formik.errors.userId}
                </Typography>
              )}
            </FormControl>

            {/* Categories Multi-select */}
            <FormControl fullWidth margin="dense">
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                name="categoryIds"
                value={formik.values.categoryIds}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) =>
                  categories
                    .filter((c) => selected.includes(c.id))
                    .map((c) => c.title)
                    .join(", ")
                }
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={formik.values.categoryIds.includes(c.id)} />
                    <ListItemText primary={c.title} />
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.categoryIds && formik.errors.categoryIds && (
                <Typography color="error" variant="caption">
                  {formik.errors.categoryIds}
                </Typography>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" color="primary" type="submit">
              {editId ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth>
        <DialogTitle>Post Details</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <>
              <Typography>Title: {selectedPost.title}</Typography>
              <Typography>Description: {selectedPost.description}</Typography>
              <Typography>User: {selectedPost.user?.name || "N/A"}</Typography>
              <Typography>
                Categories:{" "}
                {selectedPost.categories?.map((c) => c.title).join(", ") || "N/A"}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post?"
      />

      {/* Notification Dialog */}
      <NotificationDialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        message={notificationMessage}
      />
    </div>
  );
};

export default PostsPage;
