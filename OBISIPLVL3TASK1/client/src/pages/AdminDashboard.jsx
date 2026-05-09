/**
 * Admin Dashboard Page
 * Overview with stats cards and quick access to inventory/orders.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../api/orderApi';
import { getInventory } from '../api/adminApi';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiAlertTriangle, FiPackage, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, invRes] = await Promise.all([getAllOrders(), getInventory()]);
        setOrders(ordersRes.data);
        setInventory(invRes.data);
      } catch (err) {
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status !== 'Sent to Delivery').length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.threshold);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const stats = [
    { icon: <FiShoppingBag />, label: 'Total Orders', value: totalOrders, color: '#3b82f6' },
    { icon: <FiPackage />, label: 'Pending', value: pendingOrders, color: '#f59e0b' },
    { icon: <FiAlertTriangle />, label: 'Low Stock', value: lowStockItems.length, color: '#ef4444' },
    { icon: <FiTrendingUp />, label: 'Revenue', value: `₹${totalRevenue}`, color: '#10b981' }
  ];

  return (
    <div className="admin-dashboard" id="admin-dashboard-page">
      <h1 className="page-title">🏪 Admin Dashboard</h1>
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ borderTopColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-grid">
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>📋 Recent Orders</h2>
            <Link to="/admin/orders" className="btn btn-sm btn-outline">View All</Link>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Price</th></tr></thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td><span className={`status-badge status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>{order.status}</span></td>
                    <td>₹{order.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>⚠️ Low Stock Alerts</h2>
            <Link to="/admin/inventory" className="btn btn-sm btn-outline">Manage</Link>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="empty-text">All stock levels are healthy ✅</p>
          ) : (
            <div className="low-stock-list">
              {lowStockItems.map(item => (
                <div key={item._id} className="low-stock-item">
                  <span className="low-stock-name">{item.name}</span>
                  <span className="low-stock-category">{item.category}</span>
                  <span className="low-stock-qty">{item.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
