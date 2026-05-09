/**
 * Dashboard Page
 * Shows preset pizza menu and link to custom pizza builder.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMenu } from '../api/pizzaApi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await getMenu();
        setPizzas(data);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) return <Loader text="Loading menu..." />;

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="dashboard-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Welcome, <span className="gradient-text">{user?.name}</span>! 👋</h1>
          <p className="dashboard-subtitle">Explore our menu or build your own masterpiece</p>
        </motion.div>

        <Link to="/build" className="btn btn-primary btn-lg" id="build-custom-btn">
          🛠️ Build Custom Pizza <FiArrowRight />
        </Link>
      </div>

      <section className="menu-section" id="menu-section">
        <h2 className="section-title">🍕 Our Signature Pizzas</h2>
        <div className="pizza-grid">
          {pizzas.map((pizza, i) => (
            <motion.div
              key={pizza._id}
              className="pizza-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="pizza-card-image">
                <span className="pizza-card-emoji">{pizza.image || '🍕'}</span>
              </div>
              <div className="pizza-card-body">
                <h3 className="pizza-card-name">{pizza.name}</h3>
                <p className="pizza-card-desc">{pizza.description}</p>
                <div className="pizza-card-config">
                  <span className="config-tag">🫓 {pizza.defaultConfig?.base}</span>
                  <span className="config-tag">🥫 {pizza.defaultConfig?.sauce}</span>
                  <span className="config-tag">🧀 {pizza.defaultConfig?.cheese}</span>
                </div>
                <div className="pizza-card-footer">
                  <span className="pizza-price">₹{pizza.basePrice}</span>
                  <Link to="/build" className="btn btn-sm btn-outline" id={`order-${pizza._id}`}>
                    Customize <FiArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
