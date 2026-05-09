/**
 * Socket Context
 * Manages Socket.io connection for real-time order status updates.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [orderUpdates, setOrderUpdates] = useState({});
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to Socket.io
      const newSocket = io('/', {
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('🔌 Socket connected');

        // Join user-specific room
        if (user.role === 'admin') {
          newSocket.emit('joinAdmin');
        } else {
          newSocket.emit('joinRoom', user.id);
        }
      });

      // Listen for order status updates
      newSocket.on('orderStatusUpdate', (data) => {
        console.log('📦 Order status update:', data);
        setOrderUpdates(prev => ({
          ...prev,
          [data.orderId]: data.status
        }));
      });

      // Listen for new orders (admin)
      newSocket.on('newOrder', (order) => {
        console.log('🆕 New order:', order);
        setOrderUpdates(prev => ({
          ...prev,
          newOrder: order
        }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const value = {
    socket,
    orderUpdates,
    clearUpdate: (orderId) => {
      setOrderUpdates(prev => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
