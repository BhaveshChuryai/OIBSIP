# 🍕 PizzaHub — Pizza Delivery Web Application

A production-grade, full-stack pizza delivery app built for **Oasis Infobyte Level 3 Task 1**.

## ✨ Features

- **Custom Pizza Builder** — 5-step wizard (Base → Sauce → Cheese → Veggies → Summary)
- **JWT Authentication** — Registration, email verification (OTP), forgot/reset password
- **Fake Payment** — Simulated credit card UI with 2-second processing animation
- **Admin Panel** — Inventory management, order status updates, low stock alerts
- **Real-time Updates** — Socket.io for live order status tracking
- **Scheduled Alerts** — node-cron checks stock every 30 min, emails admin via Nodemailer

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Context API, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (access + refresh tokens), bcrypt |
| Email | Nodemailer (Gmail SMTP) |
| Real-time | Socket.io |
| Scheduling | node-cron |

## 📁 Folder Structure

```
├── client/           # React frontend (Vite)
│   └── src/
│       ├── api/      # Axios instance + API helpers
│       ├── components/ # Reusable UI components
│       ├── context/  # Auth, Cart, Socket providers
│       └── pages/    # Route-level page components
├── server/           # Express backend
│   ├── config/       # Database connection
│   ├── controllers/  # Route handlers
│   ├── middleware/    # Auth + admin guards
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express route definitions
│   ├── utils/        # Email, JWT, Socket helpers
│   └── jobs/         # Cron job (stock alerts)
├── .env.example
├── README.md
└── routes.md
```

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Gmail account with App Password (for email features)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

```bash
# Copy .env.example to server/.env
cp .env.example server/.env
# Edit server/.env with your values
```

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- Admin account: `admin@pizza.com` / `admin123`
- 23 inventory items (5 bases, 5 sauces, 5 cheeses, 8 veggies)
- 6 preset pizza varieties

### 4. Start Development

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 👤 User Flow

1. Register → Verify Email (OTP) → Login
2. Browse menu or build custom pizza
3. Pizza Builder: Base → Sauce → Cheese → Veggies → Summary
4. Checkout with fake payment (pre-filled card, 2s spinner)
5. Order success → Track status in real-time

## 👨‍💼 Admin Flow

1. Login at `/admin-login` (admin@pizza.com / admin123)
2. Dashboard: View stats, recent orders, low stock alerts
3. Inventory: View/edit stock levels and thresholds
4. Orders: Update status (Order Received → In the Kitchen → Sent to Delivery)

## 📡 API Routes

See [routes.md](./routes.md) for full API documentation.

## 🔐 Admin Credentials

```
Email:    admin@pizza.com
Password: admin123
```

---

Built with ❤️ by Bhavesh for Oasis Infobyte
