/**
 * OrderStatusTracker Component
 * Visual pipeline showing order progress through stages with live updates.
 */
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import { GiCookingPot } from 'react-icons/gi';
import { FaTruck } from 'react-icons/fa';

const statusStages = [
  { key: 'Order Received', label: 'Order Received', icon: <FiClock />, emoji: '📦' },
  { key: 'In the Kitchen', label: 'In the Kitchen', icon: <GiCookingPot />, emoji: '👨‍🍳' },
  { key: 'Sent to Delivery', label: 'Sent to Delivery', icon: <FaTruck />, emoji: '🚀' }
];

const OrderStatusTracker = ({ status }) => {
  const currentIndex = statusStages.findIndex(s => s.key === status);

  return (
    <div className="order-tracker" id="order-status-tracker">
      {statusStages.map((stage, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={stage.key} className="tracker-step-wrapper">
            <div className={`tracker-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              {isCompleted ? (
                <FiCheckCircle className="tracker-icon" />
              ) : (
                <span className="tracker-emoji">{stage.emoji}</span>
              )}
            </div>
            <span className={`tracker-label ${isCurrent ? 'current' : ''}`}>
              {stage.label}
            </span>
            {index < statusStages.length - 1 && (
              <div className={`tracker-line ${index < currentIndex ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;
