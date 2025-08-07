import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

// Get all users
export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data.data;
};

export const fetchUser = async (id) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data.data;
};

export const createUser = async (data) => {
  const response = await axios.post(`${API_URL}/users`, data);
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
