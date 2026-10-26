# Cyberflix Systems LLP — PC Components E-Commerce Platform

> **India's premium destination for PC components.** A full-stack MERN e-commerce platform with a real-time PC Builder, compatibility engine, and Razorpay-powered checkout.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS v3, Framer Motion |
| **State** | Zustand (persist middleware) |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **Payments** | Razorpay (UPI, Cards, Net Banking) |
| **Fonts** | Barlow Condensed, Inter (Google Fonts) |

---

## Project Structure

```
cyberflix-mern/
├── backend/                    # Express API server
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile, wishlist
│   │   ├── cartController.js   # Cart CRUD
│   │   ├── orderController.js  # Orders + Razorpay integration
│   │   └── productController.js# Product CRUD, search, filters
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + admin guard
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── Build.js            # Saved PC builds
│   │   ├── Cart.js             # User cart
│   │   ├── Order.js            # Orders with payment result
│   │   ├── Product.js          # Products + compatibility fields
│   │   ├── Review.js           # Product reviews
│   │   └── User.js             # Users with bcrypt, wishlist
│   ├── routes/
│   │   ├── admin.js            # Admin stats, user management
│   │   ├── auth.js             # Auth endpoints
│   │   ├── builder.js          # PC Builder save/check
│   │   ├── cart.js             # Cart endpoints
│   │   ├── orders.js           # Order endpoints
│   │   ├── products.js         # Product endpoints
│   │   └── reviews.js          # Review endpoints
│   ├── seeder/
│   │   └── seedProducts.js     # 58 products + admin user seed
│   ├── utils/
│   │   ├── compatibilityEngine.js  # Socket, RAM, PSU checks
│   │   └── generateToken.js    # JWT generator
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── server.js               # Express entry point
│
├── frontend/                   # React + Vite app
│   ├── public/
│   │   ├── favicon.svg
│   │   └── sw.js               # Service worker cleanup
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── cart/
│   │   │   │   └── CartDrawer.jsx      # Slide-in cart panel
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx          # Mega-menu navigation
│   │   │   │   └── Footer.jsx
│   │   │   └── products/
│   │   │       └── ProductCard.jsx     # Product card with fallback images
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Hero, categories, featured
│   │   │   ├── ProductsPage.jsx        # Filter sidebar + grid
│   │   │   ├── ProductDetailPage.jsx   # Specs, compatibility, add to cart
│   │   │   ├── BuilderPage.jsx         # PC Builder with compatibility check
│   │   │   ├── CartPage.jsx            # Full cart view
│   │   │   ├── CheckoutPage.jsx        # Shipping form + Razorpay
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx         # Orders, wishlist, account settings
│   │   │   ├── AdminDashboardPage.jsx  # Admin layout with sidebar
│   │   │   ├── AdminProductsPage.jsx   # Product CRUD
│   │   │   ├── AdminOrdersPage.jsx     # Order management
│   │   │   └── AdminUsersPage.jsx      # User management
│   │   ├── services/
│   │   │   └── api.js              # Axios instance + all API modules
│   │   ├── store/
│   │   │   ├── useAuthStore.js     # Auth state (Zustand + persist)
│   │   │   ├── useBuilderStore.js  # Builder state + compatibility
│   │   │   └── useCartStore.js     # Cart state (guest + server)
│   │   ├── App.jsx
│   │   ├── index.css               # Tailwind + global component classes
│   │   └── main.jsx                # React entry + SW cleanup
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js              # Dev proxy → localhost:5000
│   └── package.json
│
└── package.json                    # Monorepo scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas connection string
- **Razorpay** account for payments (test keys work for development)

---

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd cyberflix-mern

# Install all dependencies (backend + frontend)
npm run install:all
```

Or install separately:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Configure Environment

Copy the example env file and fill in your values:

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/cyberflix
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d

# Razorpay — get keys from https://dashboard.razorpay.com/
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FRONTEND_URL=http://localhost:5173
```

---

### 3. Seed the Database

Populates 58 products across 10 categories and creates an admin user:

```bash
cd backend
npm run seed
```

**Default admin credentials:**
```
Email:    admin@cyberfixsystems.in
Password: Admin@123
```

> ⚠️ Change these credentials before going to production.

---

### 4. Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend API (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Available Scripts

### Root (monorepo)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both backend and frontend concurrently |
| `npm run install:all` | Install dependencies for both backend and frontend |

### Backend (`/backend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run seed` | Seed products and admin user |

### Frontend (`/frontend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login and get JWT |
| `GET` | `/auth/profile` | Get user profile (🔒 auth) |
| `PUT` | `/auth/profile` | Update profile (🔒 auth) |
| `POST` | `/auth/wishlist/:productId` | Toggle wishlist item (🔒 auth) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | Get all products (filter, sort, paginate) |
| `GET` | `/products/featured` | Get featured/bestseller products |
| `GET` | `/products/search?q=` | Full-text search |
| `GET` | `/products/category/:cat` | Products by category |
| `GET` | `/products/:id` | Single product |
| `POST` | `/products` | Create product (🔒 admin) |
| `PUT` | `/products/:id` | Update product (🔒 admin) |
| `DELETE` | `/products/:id` | Soft delete product (🔒 admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create order + Razorpay order (🔒 auth) |
| `POST` | `/orders/:id/pay` | Verify Razorpay payment (🔒 auth) |
| `GET` | `/orders/myorders` | Get user's orders (🔒 auth) |
| `GET` | `/orders/:id` | Get single order (🔒 auth) |
| `GET` | `/orders` | All orders (🔒 admin) |
| `PUT` | `/orders/:id/status` | Update order status (🔒 admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cart` | Get user cart (🔒 auth) |
| `POST` | `/cart` | Add item to cart (🔒 auth) |
| `DELETE` | `/cart/:productId` | Remove item (🔒 auth) |
| `DELETE` | `/cart` | Clear cart (🔒 auth) |

### PC Builder
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/builder/check` | Check component compatibility |
| `POST` | `/builder/save` | Save a build (🔒 auth) |
| `GET` | `/builder/my` | Get user's saved builds (🔒 auth) |
| `DELETE` | `/builder/:id` | Delete a saved build (🔒 auth) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/stats` | Dashboard stats (🔒 admin) |
| `GET` | `/admin/users` | All users (🔒 admin) |

---

## PC Builder — Compatibility Engine

The compatibility engine (`backend/utils/compatibilityEngine.js`) checks:

| Check | Description |
|-------|-------------|
| **CPU ↔ Motherboard** | Socket type match (AM5, LGA1700, etc.) |
| **CPU ↔ RAM** | RAM type support (DDR4 / DDR5) |
| **Motherboard ↔ RAM** | RAM type match |
| **PSU Wattage** | CPU + GPU TDP × 1.3 safety margin |
| **High-TDP GPU** | Warns if GPU TDP > 300W and PSU < 850W |
| **CPU Cooler** | Warns if no cooler selected for high-TDP CPUs |
| **Integrated Graphics** | Warns if no GPU and CPU may lack iGPU |

Performance scores (0–99) are estimated for **Gaming**, **Workstation**, and **General Use** based on component price and specs.

---

## Product Categories

| Category | Key |
|----------|-----|
| Processors (CPU) | `cpu` |
| Graphics Cards (GPU) | `gpu` |
| Motherboards | `motherboard` |
| Memory (RAM) | `ram` |
| Storage (SSD/HDD) | `storage` |
| Power Supplies | `psu` |
| PC Cases | `case` |
| CPU Coolers | `cooling` |
| Case Fans | `fans` |
| Monitors | `monitors` |
| Peripherals | `peripherals` |
| Accessories | `accessories` |

---

## Design System

The frontend uses a custom Tailwind theme defined in `tailwind.config.js`:

| Token | Value |
|-------|-------|
| `brand-red` | `#E53E2D` (primary accent) |
| `brand-bg` | `#0A0A0A` (page background) |
| `brand-bg-1` | `#111111` (card background) |
| `brand-border` | `#222222` |
| `brand-muted` | `#888888` |
| Font — Headings | **Barlow Condensed** (bold, uppercase) |
| Font — Body | **Inter** |

---

## Payment Flow (Razorpay)

```
User clicks "Place Order"
        ↓
Backend creates Razorpay order → returns { razorpayOrderId, amount, key }
        ↓
Frontend loads Razorpay checkout widget
        ↓
User pays via UPI / Card / Net Banking
        ↓
Razorpay returns { paymentId, orderId, signature }
        ↓
Backend verifies HMAC signature → marks order as paid
        ↓
Cart is cleared → user redirected to profile
```

> Payment only processes with real/test Razorpay keys. Without keys, checkout UI renders but payment will fail.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | ✅ | `development` or `production` |
| `PORT` | ✅ | Backend port (default: 5000) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `JWT_EXPIRE` | ✅ | Token expiry (e.g. `30d`) |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay key secret |
| `FRONTEND_URL` | ✅ | Frontend URL for CORS |

---

## Known Issues & Notes

- **Razorpay 402 in dev** — Normal if using placeholder keys. Real test keys from [dashboard.razorpay.com](https://dashboard.razorpay.com) fix this.
- **Product images** — Products use curated Unsplash images as fallback. A beautiful gradient placeholder renders if the image fails to load.
- **Guest cart** — Cart works without login (stored in Zustand). On login, cart syncs to the server.

---

## License

Private — Cyberflix Systems LLP © 2026. All rights reserved.

---

*Built with React + Node.js + MongoDB*
