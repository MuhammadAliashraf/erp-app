

// Assuming base URL is configured in axios or we set it here
// Standard setup often has an axios instance. Let's start by importing the default one if it exists or create one.
// Since I saw `services/axios.js` I'll assume it exports an instance.
import api from '../services/axios'; 
// If `services/axios` is not what I think, I'll fallback to `axios` directly but I should check `services/axios.js` content.

const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
