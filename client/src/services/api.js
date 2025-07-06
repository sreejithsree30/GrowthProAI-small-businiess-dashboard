import axios from 'axios';

const API_BASE_URL = 'https://growth-pro-ai-small-businiess-dashb.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const businessAPI = {

  getBusinesses: async () => {
    const response = await api.get('/businesses');
    return response.data;
  },

 
  createBusiness: async (data) => {
    const response = await api.post('/business-data', data);
    return response.data;
  },


  updateBusiness: async (id, data) => {
    const response = await api.put(`/businesses/${id}`, data);
    return response.data;
  },


  deleteBusiness: async (id) => {
    await api.delete(`/businesses/${id}`);
  },

  regenerateHeadline: async (name, location, id) => {
    const params = new URLSearchParams({ name, location });
    if (id) params.append('id', id.toString());

    const response = await api.get(`/regenerate-headline?${params}`);
    return response.data;
  },


  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};
