/**
 * StepIndicator Component
 * Visual progress indicator for the pizza builder wizard.
 */
import { FiCheck } from 'react-icons/fi';

const steps = [
  { label: 'Base', icon: '🫓' },
  { label: 'Sauce', icon: '🥫' },
  { label: 'Cheese', icon: '🧀' },
  { label: 'Veggies', icon: '🥬' },
  { label: 'Summary', icon: '📋' }
];

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="step-indicator" id="pizza-step-indicator">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step.label} className="step-wrapper">
            <div
              className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              id={`step-${stepNumber}`}
            >
              {isCompleted ? (
                <FiCheck className="step-check" />
              ) : (
                <span className="step-icon">{step.icon}</span>
              )}
            </div>
            <span className={`step-label ${isActive ? 'active' : ''}`}>{step.label}</span>
            {index < steps.length - 1 && (
              <div className={`step-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
