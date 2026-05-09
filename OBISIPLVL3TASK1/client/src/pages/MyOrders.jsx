/**
 * My Orders Page
 * Displays user's orders with real-time status tracking via Socket.io.
 */
import { useState, useEffect } from 'react';
import { getMyOrders } from '../api/orderApi';
import { useSocket } from '../context/SocketContext';
import OrderStatusTracker from '../components/OrderStatusTracker';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { orderUpdates } = useSocket();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Apply real-time updates from Socket.io
  useEffect(() => {
    if (Object.keys(orderUpdates).length > 0) {
      setOrders(prev => prev.map(order => {
        if (orderUpdates[order._id]) {
          return { ...order, status: orderUpdates[order._id] };
        }
        return order;
      }));
    }
  }, [orderUpdates]);

  if (loading) return <Loader text="Loading your orders..." />;

  return (
    <div className="orders-page" id="my-orders-page">
      <h1 className="page-title">📦 My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-emoji">🍕</span>
          <h2>No orders yet</h2>
          <p>Start building your first pizza!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              className="order-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="order-card-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <span className={`order-status-badge status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-card-body">
                <div className="order-config">
                  <span>🫓 {order.pizzaConfig.base}</span>
                  <span>🥫 {order.pizzaConfig.sauce}</span>
                  <span>🧀 {order.pizzaConfig.cheese}</span>
                  {order.pizzaConfig.veggies?.length > 0 && (
                    <span>🥬 {order.pizzaConfig.veggies.join(', ')}</span>
                  )}
                </div>
                <div className="order-price">₹{order.totalPrice}</div>
              </div>
              <OrderStatusTracker status={order.status} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
