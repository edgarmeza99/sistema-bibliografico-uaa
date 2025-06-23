import { api } from './api';

export const getBibliografias = async () => {
    const response = await api.get('/bibliografias');
    return response.data;
};

export const getBibliografiaById = async (id) => {
    const response = await api.get(`/bibliografias/${id}`);
    return response.data;
};

export const createBibliografia = async (bibliografia) => {
    const response = await api.post('/bibliografias', bibliografia);
    return response.data;
};

export const updateBibliografia = async (id, bibliografia) => {
    const response = await api.put(`/bibliografias/${id}`, bibliografia);
    return response.data;
};

export const deleteBibliografia = async (id) => {
    await api.delete(`/bibliografias/${id}`);
};