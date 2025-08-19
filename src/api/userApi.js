// src/api/users.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

// User listing
export const fetchUsers = async ({ page = 1, limit = 20, search = "" }) => {
  const response = await axios.post(`${API_URL}/users`, { page, limit, search });
  return response.data;
};

export const fetchUser = async (id) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data.data;
};

export const createUser = async (data) => {
  const response = await axios.post(`${API_URL}/users/create`, data);
  return response.data.data;
};

export const updateUser = async ({ id, user }) => {
  const response = await axios.put(`${API_URL}/users/${id}`, user);
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};

// ===== AUTHENTICATION =====

// Register a new user
export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

// Login user
export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data, {
    withCredentials: true, // so cookies/session work with AdonisJS
  });
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
};
