/**
 * Loader Component
 * Animated loading spinner with optional text.
 */
const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container" id="loader">
      <div className="loader-pizza">
        <div className="pizza-slice slice-1">🍕</div>
        <div className="pizza-slice slice-2">🍕</div>
        <div className="pizza-slice slice-3">🍕</div>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
