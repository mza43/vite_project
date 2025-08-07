import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch posts
export const fetchPosts = async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data.data; // Array of posts
};

// Create post
export const createPost = async (data) => {
  const res = await axios.post(`${API_URL}/posts`, data);
  return {
    message: res.data.message || "Post created successfully!",
    data: res.data.data,
  };
};

// Update post
export const updatePost = async (id, data) => {
  const res = await axios.put(`${API_URL}/posts/${id}`, data);
  return {
    message: res.data.message || "Post updated successfully!",
    data: res.data.data,
  };
};

// Delete post
export const deletePost = async (id) => {
  const res = await axios.delete(`${API_URL}/posts/${id}`);
  return {
    message: res.data.message || "Post deleted successfully!",
    id,
  };
};
