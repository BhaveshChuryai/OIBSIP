/**
 * Socket.io Configuration
 * Sets up real-time communication for order status updates.
 */
const { Server } = require('socket.io');

let io;

/**
 * Initialize Socket.io with the HTTP server
 * @param {object} httpServer - Node.js HTTP server instance
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins their personal room for order updates
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    });

    // Admin joins admin room
    socket.on('joinAdmin', () => {
      socket.join('admin');
      console.log(`👨‍💼 Admin joined admin room`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the Socket.io instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.');
  }
  return io;
};

module.exports = { initSocket, getIO };
