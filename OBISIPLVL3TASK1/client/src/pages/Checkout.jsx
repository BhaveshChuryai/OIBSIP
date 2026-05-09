/**
 * Checkout Page
 * Fake payment UI with pre-filled dummy card, simulated processing, and order creation.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orderApi';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiLock } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { pizzaConfig, totalPrice, resetCart } = useCart();

  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardHolder, setCardHolder] = useState('Test User');
  const [expiry, setExpiry] = useState('12/26');
  const [cvv, setCvv] = useState('123');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Redirect if no pizza configured
  if (!pizzaConfig.base) {
    navigate('/build');
    return null;
  }

  const handlePayment = async () => {
    setError('');
    setProcessing(true);

    // Simulate 2-second payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Payment always succeeds — create order in backend
      const { data } = await createOrder({
        pizzaConfig,
        totalPrice
      });

      resetCart();
      navigate('/order-success', { state: { orderId: data.order.id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-page" id="checkout-page">
      <motion.div
        className="checkout-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>🍕 Order Summary</h2>
          <div className="checkout-summary-items">
            <div className="checkout-item">
              <span>Base: {pizzaConfig.base}</span>
            </div>
            <div className="checkout-item">
              <span>Sauce: {pizzaConfig.sauce}</span>
            </div>
            <div className="checkout-item">
              <span>Cheese: {pizzaConfig.cheese}</span>
            </div>
            {pizzaConfig.veggies.length > 0 && (
              <div className="checkout-item">
                <span>Veggies: {pizzaConfig.veggies.join(', ')}</span>
              </div>
            )}
          </div>
          <div className="checkout-total">
            <span>Total</span>
            <span className="checkout-total-price">₹{totalPrice}</span>
          </div>
        </div>

        {/* Payment Card */}
        <div className="payment-section">
          <h2><FiCreditCard /> Payment Details</h2>
          <div className="payment-badge">
            <FiLock /> Secure Payment (Simulated)
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="credit-card-ui" id="credit-card">
            <div className="card-front">
              <div className="card-chip"></div>
              <div className="card-number">{cardNumber}</div>
              <div className="card-bottom">
                <div className="card-holder">
                  <label>Card Holder</label>
                  <span>{cardHolder}</span>
                </div>
                <div className="card-expiry">
                  <label>Expires</label>
                  <span>{expiry}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-form" id="payment-form">
            <div className="form-group">
              <label htmlFor="card-number">Card Number</label>
              <input
                type="text"
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="form-group">
              <label htmlFor="card-holder">Card Holder Name</label>
              <input
                type="text"
                id="card-holder"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="card-expiry">Expiry (MM/YY)</label>
                <input
                  type="text"
                  id="card-expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div className="form-group">
                <label htmlFor="card-cvv">CVV</label>
                <input
                  type="password"
                  id="card-cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {processing ? (
              <motion.div
                className="payment-processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="processing"
              >
                <div className="payment-spinner"></div>
                <p>Processing payment...</p>
              </motion.div>
            ) : (
              <motion.button
                className="btn btn-primary btn-full btn-pay"
                onClick={handlePayment}
                id="pay-now-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="pay-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                💳 Pay ₹{totalPrice} Now
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
