/**
 * Order Success Page
 * Animated celebration screen after successful order placement.
 */
import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    const timer = setTimeout(() => navigate('/my-orders'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const confettiColors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="success-page" id="order-success-page">
      <motion.div
        className="success-container"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="confetti-piece"
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 400, y: Math.random() * 400 + 100,
                rotate: Math.random() * 720, opacity: 0
              }}
              transition={{ duration: 2 + Math.random(), ease: 'easeOut', delay: Math.random() * 0.5 }}
              style={{
                background: confettiColors[i % 5],
                width: 10 + Math.random() * 10, height: 10 + Math.random() * 10,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px'
              }}
            />
          ))}
        </div>

        <motion.div className="success-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
          <FiCheckCircle />
        </motion.div>
        <motion.h1 className="success-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          🎉 Order Placed!
        </motion.h1>
        <motion.p className="success-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          Your pizza is on its way. Sit back and relax!
        </motion.p>
        {orderId && (
          <motion.p className="success-order-id" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            Order ID: <code>{orderId}</code>
          </motion.p>
        )}
        <motion.div className="success-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <Link to="/my-orders" className="btn btn-primary" id="view-orders-btn"><FiShoppingBag /> Track My Orders</Link>
          <Link to="/build" className="btn btn-outline" id="build-another-btn">🍕 Build Another Pizza</Link>
        </motion.div>
        <motion.p className="success-redirect-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          Redirecting to your orders in 5 seconds...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
