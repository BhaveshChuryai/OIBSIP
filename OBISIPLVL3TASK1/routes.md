# 📡 API Routes Documentation

## Auth Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user. Body: `{ name, email, password }` |
| POST | `/api/auth/verify-email` | ❌ | Verify email with OTP. Body: `{ email, otp }` |
| POST | `/api/auth/login` | ❌ | User login. Body: `{ email, password }`. Returns: `{ user, accessToken, refreshToken }` |
| POST | `/api/auth/admin-login` | ❌ | Admin login. Body: `{ email, password }`. Returns: `{ user, accessToken, refreshToken }` |
| POST | `/api/auth/forgot-password` | ❌ | Send reset email. Body: `{ email }` |
| POST | `/api/auth/reset-password/:token` | ❌ | Reset password. Body: `{ password }` |
| POST | `/api/auth/refresh-token` | ❌ | Refresh access token. Body: `{ refreshToken }` |
| GET | `/api/auth/me` | ✅ | Get current user profile |

## Pizza Routes (`/api/pizza`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/pizza/ingredients` | ✅ | Get available ingredients grouped by category |
| GET | `/api/pizza/menu` | ✅ | Get preset pizza menu items |

## Order Routes (`/api/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | ✅ | Create new order. Body: `{ pizzaConfig: { base, sauce, cheese, veggies }, totalPrice }` |
| GET | `/api/orders/my-orders` | ✅ | Get logged-in user's orders |
| GET | `/api/orders/:id` | ✅ | Get order by ID (users can only view their own) |
| GET | `/api/orders/admin/all` | ✅🔒 | Get all orders (admin only) |
| PUT | `/api/orders/:id/status` | ✅🔒 | Update order status. Body: `{ status }`. Values: `"Order Received"`, `"In the Kitchen"`, `"Sent to Delivery"` |

## Inventory Routes (`/api/inventory`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/inventory` | ✅🔒 | Get all inventory items (admin only) |
| PUT | `/api/inventory/:id` | ✅🔒 | Update item quantity. Body: `{ quantity }` (admin only) |
| PUT | `/api/inventory/:id/threshold` | ✅🔒 | Update low-stock threshold. Body: `{ threshold }` (admin only) |

## Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ | Server health check |

---

**Legend**: ✅ = Requires JWT token | 🔒 = Admin only
