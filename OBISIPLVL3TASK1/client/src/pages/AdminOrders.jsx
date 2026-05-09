/**
 * Admin Orders Page
 * Table of all orders with status update dropdown and real-time updates.
 */
import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../api/orderApi';
import { useSocket } from '../context/SocketContext';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

const statusOptions = ['Order Received', 'In the Kitchen', 'Sent to Delivery'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { orderUpdates } = useSocket();

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Refresh on new order notification
  useEffect(() => {
    if (orderUpdates.newOrder) {
      fetchOrders();
    }
  }, [orderUpdates]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div className="admin-orders" id="admin-orders-page">
      <h1 className="page-title">📋 Order Management</h1>
      <p className="page-subtitle">{orders.length} total orders</p>

      {orders.length === 0 ? (
        <div className="empty-state"><span className="empty-emoji">📭</span><h2>No orders yet</h2></div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Pizza</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className="order-id-cell">#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.user?.name || 'N/A'}<br /><small>{order.user?.email}</small></td>
                  <td className="pizza-config-cell">
                    <small>{order.pizzaConfig.base} • {order.pizzaConfig.sauce} • {order.pizzaConfig.cheese}</small>
                    {order.pizzaConfig.veggies?.length > 0 && <br />}
                    {order.pizzaConfig.veggies?.length > 0 && <small className="text-muted">+ {order.pizzaConfig.veggies.join(', ')}</small>}
                  </td>
                  <td>₹{order.totalPrice}</td>
                  <td><small>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></td>
                  <td><span className={`status-badge status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>{order.status}</span></td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updating === order._id}
                      id={`status-select-${order._id}`}
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
