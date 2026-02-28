# 🚀 StoreFleet — Full Stack E-Commerce App

![StoreFleet](https://img.shields.io/badge/StoreFleet-E--Commerce-f59e0b?style=for-the-badge&logo=shopify&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

A full-stack e-commerce web application built with the **MERN stack** (MongoDB, Express, React, Node.js). StoreFleet supports user authentication, product management, order placement, reviews, and a complete admin dashboard.

---

## ✨ Features

### 👤 User Features
- Register & Login with JWT authentication (HTTP-only cookies)
- Browse and search products with filters (category, price range, rating)
- View product details with image gallery
- Leave and delete reviews with star ratings
- Place orders with real-time stock validation
- Forgot / Reset password via email
- Update profile and change password

### 🔐 Admin Features
- **Admin Dashboard** — Product count, user count, category stats
- **Manage Products** — Add, edit, delete products with image support
- **Manage Users** — View all users, change roles (user ↔ admin), delete users

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB Atlas + Mongoose 7 |
| **Auth** | JWT (JSON Web Tokens) + HTTP-only cookies |
| **Styling** | Vanilla CSS, Glassmorphism design, Dark theme |
| **Email** | Nodemailer (Gmail SMTP) |
| **Security** | bcryptjs password hashing, role-based access control |

---

## 📁 Project Structure

```
storefleet-fullstack-ecommeapp/
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── user/             # User routes, controller, repository, schema
│   │   ├── product/          # Product routes, controller, repository, schema
│   │   └── order/            # Order routes, controller, repository, schema
│   ├── config/               # MongoDB connection
│   ├── middlewares/          # Auth, error handling
│   ├── utils/                # sendToken, email
│   ├── scripts/              # Seed admin script
│   ├── .env                  # Environment variables (not pushed)
│   └── server.js
│
└── frontend/                 # React + Vite app
    └── src/
        ├── api/              # Axios service layers
        ├── components/       # Navbar, Footer, ProductCard, etc.
        ├── context/          # AuthContext (global user state)
        └── pages/            # All page components
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB with replica set for transactions)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/storefleet-fullstack-ecommeapp.git
cd storefleet-fullstack-ecommeapp
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=3000
mongo_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/storefleet
JWT_Secret=your_jwt_secret_here
JWT_Expire=1d
COOKIE_EXPIRES_IN=1
STORFLEET_SMPT_MAIL=your_email@gmail.com
STORFLEET_SMPT_MAIL_PASSWORD=your_app_password
SMPT_SERVICE=gmail
```

Seed admin user:
```bash
node scripts/seedAdmin.js
```

Start backend:
```bash
npm run dev       # development (node --watch)
npm start         # production
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000/api/storefleet](http://localhost:3000/api/storefleet)

---

## 🔑 Default Admin Credentials
> After running the seed script:
```
Email:    admin@storefleet.com
Password: Admin@123
```

---

## 📡 API Endpoints

### User Routes — `/api/storefleet/user`
| Method | Route | Access |
|---|---|---|
| POST | `/signup` | Public |
| POST | `/login` | Public |
| POST | `/password/forget` | Public |
| PUT | `/password/reset/:token` | Public |
| GET | `/details` | Auth |
| GET | `/logout` | Auth |
| PUT | `/password/update` | Auth |
| PUT | `/profile/update` | Auth |
| GET | `/admin/allusers` | Admin |
| GET | `/admin/details/:id` | Admin |
| PUT | `/admin/update/:id` | Admin |
| DELETE | `/admin/delete/:id` | Admin |

### Product Routes — `/api/storefleet/product`
| Method | Route | Access |
|---|---|---|
| GET | `/products` | Public |
| GET | `/details/:id` | Public |
| GET | `/reviews/:id` | Public |
| POST | `/add` | Admin |
| PUT | `/update/:id` | Admin |
| DELETE | `/delete/:id` | Admin |
| PUT | `/rate/:id` | Auth |
| DELETE | `/review/delete` | Auth |

### Order Routes — `/api/storefleet/order`
| Method | Route | Access |
|---|---|---|
| POST | `/new` | Auth |

---

## 🎨 Design Highlights
- Dark navy theme with gold accent colors
- Glassmorphism cards with blur effects
- Smooth page transitions and micro-animations
- Fully responsive (mobile hamburger menu, stacked layouts)
- Custom gold dropdown arrows and scrollbars

---

## 📝 License
MIT

---

> Built as a capstone project — showcasing full-stack MERN development with authentication, authorization, real-time DB operations, and modern UI design.
