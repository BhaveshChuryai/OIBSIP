/**
 * Cart Context
 * Manages pizza builder state and cart for checkout.
 */
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [pizzaConfig, setPizzaConfig] = useState({
    base: null,
    sauce: null,
    cheese: null,
    veggies: []
  });
  const [prices, setPrices] = useState({
    base: 0,
    sauce: 0,
    cheese: 0,
    veggies: 0
  });

  const setBase = (base, price) => {
    setPizzaConfig(prev => ({ ...prev, base }));
    setPrices(prev => ({ ...prev, base: price }));
  };

  const setSauce = (sauce, price) => {
    setPizzaConfig(prev => ({ ...prev, sauce }));
    setPrices(prev => ({ ...prev, sauce: price }));
  };

  const setCheese = (cheese, price) => {
    setPizzaConfig(prev => ({ ...prev, cheese }));
    setPrices(prev => ({ ...prev, cheese: price }));
  };

  const toggleVeggie = (veggie, price) => {
    setPizzaConfig(prev => {
      const exists = prev.veggies.includes(veggie);
      const newVeggies = exists
        ? prev.veggies.filter(v => v !== veggie)
        : [...prev.veggies, veggie];

      return { ...prev, veggies: newVeggies };
    });
    setPrices(prev => {
      const isAdding = !pizzaConfig.veggies.includes(veggie);
      return {
        ...prev,
        veggies: isAdding ? prev.veggies + price : prev.veggies - price
      };
    });
  };

  const totalPrice = Object.values(prices).reduce((sum, p) => sum + p, 0);

  const resetCart = () => {
    setPizzaConfig({ base: null, sauce: null, cheese: null, veggies: [] });
    setPrices({ base: 0, sauce: 0, cheese: 0, veggies: 0 });
  };

  const value = {
    pizzaConfig,
    prices,
    totalPrice,
    setBase,
    setSauce,
    setCheese,
    toggleVeggie,
    resetCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
