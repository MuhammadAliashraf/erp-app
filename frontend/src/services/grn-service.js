import api from "./axios";

const createGrn = async (data) => {
  const response = await api.post('/grn', data);
  return response.data;
};

const getAllGrns = async () => {
  const response = await api.get('/grn');
  return response.data;
};

const getGrnById = async (id) => {
  const response = await api.get(`/grn/${id}`);
  return response.data;
};

const grnService = {
  createGrn,
  getAllGrns,
  getGrnById,
};

export default grnService;
