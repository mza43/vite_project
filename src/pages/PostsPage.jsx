
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost, updatePost, deletePost } from "../store/postsSlice";
import { fetchUsers } from "../store/usersSlice";
import { fetchCategories } from "../store/categoriesSlice";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import PostsTable from "../components/posts/PostsTable";
import PostFormDialog from "../components/posts/PostFormDialog";
import PostViewDialog from "../components/posts/PostViewDialog";
import postColumns from "../components/posts/postColumns";

import ConfirmDialog from "../components/common/ConfirmDialog";
import NotificationDialog from "../components/common/NotificationDialog";

const PostsPage = () => {
  const dispatch = useDispatch();
  const { list: posts, loading } = useSelector((state) => state.posts);
  const { list: users } = useSelector((state) => state.users);
  const { list: categories } = useSelector((state) => state.categories);

  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(fetchCategories());
  }, [dispatch]);

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
        setOpenDialog(false);
      } catch (err) {
        setNotificationMessage(err?.message || "Something went wrong!");
        setNotificationOpen(true);
      }
    },
  });

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

  const handleViewClick = (post) => {
    setSelectedPost(post);
    setOpenView(true);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Posts</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add Post
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PostsTable
          rowData={posts}
          columnDefs={postColumns(handleViewClick, handleOpenDialog, handleDeleteClick)}
          loading={loading}
        />
      )}

      <PostFormDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        formik={formik}
        users={users}
        categories={categories}
        editId={editId}
      />

      <PostViewDialog
        open={openView}
        handleClose={() => setOpenView(false)}
        post={selectedPost}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post?"
      />

      <NotificationDialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        message={notificationMessage}
      />
    </div>
  );
};

export default PostsPage;
