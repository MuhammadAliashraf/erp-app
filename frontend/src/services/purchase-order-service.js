import api from './axios';

const getAllPurchaseOrders = async () => {
  const response = await api.get('/purchase-orders');
  return response.data;
};

const getPurchaseOrder = async (id) => {
  const response = await api.get(`/purchase-orders/${id}`);
  return response.data;
};

const createPurchaseOrder = async (data) => {
  const response = await api.post('/purchase-orders', data);
  return response.data;
};

const updatePurchaseOrder = async (id, data) => {
  const response = await api.put(`/purchase-orders/${id}`, data);
  return response.data;
};

const deletePurchaseOrder = async (id) => {
  const response = await api.delete(`/purchase-orders/${id}`);
  return response.data;
};

export default {
  getAllPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
