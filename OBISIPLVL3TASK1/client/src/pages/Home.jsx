/**
 * Home Page
 * Landing page with hero section, features, and CTA.
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GiFullPizza, GiChefToque, GiDeliveryDrone } from 'react-icons/gi';
import { FiArrowRight, FiShield } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-shapes">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hero-pizza-float"
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="hero-pizza-emoji">🍕</span>
          </motion.div>
          <h1 className="hero-title">
            Build Your <span className="gradient-text">Dream Pizza</span>
          </h1>
          <p className="hero-subtitle">
            Choose your base, sauce, cheese & toppings. Crafted to perfection, delivered to your door.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin' : '/build'} className="btn btn-primary btn-lg" id="hero-cta">
                {isAdmin ? 'Go to Dashboard' : 'Start Building'} <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="hero-signup">
                  Get Started <FiArrowRight />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg" id="hero-login">
                  Login
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="features" id="features-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why Pizza<span className="brand-accent">Hub</span>?
        </motion.h2>
        <div className="features-grid">
          {[
            { icon: <GiFullPizza />, title: 'Custom Builder', desc: 'Design your perfect pizza from 5 bases, 5 sauces, 5 cheeses, and 8 fresh veggies.' },
            { icon: <GiChefToque />, title: 'Live Tracking', desc: 'Watch your order move from kitchen to delivery in real-time.' },
            { icon: <GiDeliveryDrone />, title: 'Fast Delivery', desc: 'Hot & fresh at your doorstep. Track every step of the way.' }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Admin Quick Access */}
      <section className="admin-cta-section" id="admin-section">
        <div className="admin-cta-card">
          <FiShield className="admin-cta-icon" />
          <h3>Restaurant Admin?</h3>
          <p>Manage inventory, track orders, and monitor stock levels.</p>
          <Link to="/admin-login" className="btn btn-outline btn-sm" id="admin-cta-btn">
            Admin Login <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
