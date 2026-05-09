/**
 * Order API helpers
 */
import API from './axios';

export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders/admin/all');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
