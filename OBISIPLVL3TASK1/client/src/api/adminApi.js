/**
 * Admin API helpers
 */
import API from './axios';

export const getInventory = () => API.get('/inventory');
export const updateInventory = (id, quantity) => API.put(`/inventory/${id}`, { quantity });
export const updateThreshold = (id, threshold) => API.put(`/inventory/${id}/threshold`, { threshold });
