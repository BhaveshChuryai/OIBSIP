/**
 * Pizza Builder Page
 * 5-step wizard: Base → Sauce → Cheese → Veggies → Summary
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIngredients } from '../api/pizzaApi';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '../components/StepIndicator';
import Loader from '../components/Loader';
import { FiArrowRight, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

const stepVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 }
};

const PizzaBuilder = () => {
  const navigate = useNavigate();
  const { pizzaConfig, prices, totalPrice, setBase, setSauce, setCheese, toggleVeggie } = useCart();
  const [step, setStep] = useState(1);
  const [ingredients, setIngredients] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const { data } = await getIngredients();
        setIngredients(data);
      } catch (err) {
        console.error('Failed to fetch ingredients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const canProceed = () => {
    switch (step) {
      case 1: return !!pizzaConfig.base;
      case 2: return !!pizzaConfig.sauce;
      case 3: return !!pizzaConfig.cheese;
      case 4: return true; // veggies are optional
      default: return true;
    }
  };

  if (loading) return <Loader text="Loading ingredients..." />;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="builder-step">
            <h2 className="step-title">🫓 Choose Your Base</h2>
            <p className="step-subtitle">Select the perfect foundation for your pizza</p>
            <div className="option-grid">
              {ingredients?.bases?.map((item) => (
                <motion.div
                  key={item._id}
                  className={`option-card ${pizzaConfig.base === item.name ? 'selected' : ''}`}
                  onClick={() => setBase(item.name, item.price)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id={`base-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <span className="option-emoji">🫓</span>
                  <span className="option-name">{item.name}</span>
                  <span className="option-price">₹{item.price}</span>
                  {pizzaConfig.base === item.name && <div className="option-check">✓</div>}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="builder-step">
            <h2 className="step-title">🥫 Choose Your Sauce</h2>
            <p className="step-subtitle">Pick a sauce that makes your taste buds dance</p>
            <div className="option-grid">
              {ingredients?.sauces?.map((item) => (
                <motion.div
                  key={item._id}
                  className={`option-card ${pizzaConfig.sauce === item.name ? 'selected' : ''}`}
                  onClick={() => setSauce(item.name, item.price)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id={`sauce-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <span className="option-emoji">🥫</span>
                  <span className="option-name">{item.name}</span>
                  <span className="option-price">₹{item.price}</span>
                  {pizzaConfig.sauce === item.name && <div className="option-check">✓</div>}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="builder-step">
            <h2 className="step-title">🧀 Choose Your Cheese</h2>
            <p className="step-subtitle">The gooey layer that brings it all together</p>
            <div className="option-grid">
              {ingredients?.cheeses?.map((item) => (
                <motion.div
                  key={item._id}
                  className={`option-card ${pizzaConfig.cheese === item.name ? 'selected' : ''}`}
                  onClick={() => setCheese(item.name, item.price)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id={`cheese-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <span className="option-emoji">🧀</span>
                  <span className="option-name">{item.name}</span>
                  <span className="option-price">{item.price > 0 ? `₹${item.price}` : 'Free'}</span>
                  {pizzaConfig.cheese === item.name && <div className="option-check">✓</div>}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="builder-step">
            <h2 className="step-title">🥬 Choose Your Veggies</h2>
            <p className="step-subtitle">Select as many toppings as you like</p>
            <div className="option-grid veggies-grid">
              {ingredients?.veggies?.map((item) => (
                <motion.div
                  key={item._id}
                  className={`option-card option-card-sm ${pizzaConfig.veggies.includes(item.name) ? 'selected' : ''}`}
                  onClick={() => toggleVeggie(item.name, item.price)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id={`veggie-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <span className="option-emoji">🥬</span>
                  <span className="option-name">{item.name}</span>
                  <span className="option-price">₹{item.price}</span>
                  {pizzaConfig.veggies.includes(item.name) && <div className="option-check">✓</div>}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="builder-step summary-step">
            <h2 className="step-title">📋 Order Summary</h2>
            <p className="step-subtitle">Review your custom pizza before checkout</p>
            <div className="summary-card">
              <div className="summary-pizza-visual">
                <span className="summary-pizza-emoji">🍕</span>
              </div>
              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">🫓 Base</span>
                  <span className="summary-value">{pizzaConfig.base}</span>
                  <span className="summary-price">₹{prices.base}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">🥫 Sauce</span>
                  <span className="summary-value">{pizzaConfig.sauce}</span>
                  <span className="summary-price">₹{prices.sauce}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">🧀 Cheese</span>
                  <span className="summary-value">{pizzaConfig.cheese}</span>
                  <span className="summary-price">₹{prices.cheese}</span>
                </div>
                {pizzaConfig.veggies.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">🥬 Veggies</span>
                    <span className="summary-value">{pizzaConfig.veggies.join(', ')}</span>
                    <span className="summary-price">₹{prices.veggies}</span>
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <span className="summary-label">💰 Total</span>
                  <span className="summary-value"></span>
                  <span className="summary-price">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="builder-page" id="pizza-builder-page">
      <StepIndicator currentStep={step} />

      <div className="builder-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="builder-nav">
        {step > 1 && (
          <button className="btn btn-outline" onClick={prevStep} id="builder-prev-btn">
            <FiArrowLeft /> Back
          </button>
        )}
        <div className="builder-nav-spacer" />
        {step < 5 ? (
          <button
            className="btn btn-primary"
            onClick={nextStep}
            disabled={!canProceed()}
            id="builder-next-btn"
          >
            Next <FiArrowRight />
          </button>
        ) : (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/checkout')}
            id="builder-checkout-btn"
          >
            <FiShoppingCart /> Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default PizzaBuilder;
