import api from './axios';

const getAllSuppliers = async () => {
  const response = await api.get('/suppliers');
  return response.data;
};

const getSupplier = async (id) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

const createSupplier = async (data) => {
  const response = await api.post('/suppliers', data);
  return response.data;
};

const updateSupplier = async (id, data) => {
  const response = await api.put(`/suppliers/${id}`, data);
  return response.data;
};

const deleteSupplier = async (id) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};

export default {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
