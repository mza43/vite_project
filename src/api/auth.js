// src/api/auth.js
import axios from "axios";

// Point directly to /api/auth
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api/auth";

export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials, { withCredentials: true });
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data, { withCredentials: true });
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return res.data;
};
