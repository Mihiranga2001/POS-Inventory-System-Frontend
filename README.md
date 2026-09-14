# Techloom POS & Inventory System

A full-stack Point of Sale (POS) and Inventory Management System designed to simplify product management, inventory tracking, customer ordering, payment handling, and sales analysis.

## Overview

This system provides a complete workflow for managing products, monitoring stock, processing customer orders, handling payments, and generating business insights through an admin dashboard.

The application is built using a modern full-stack architecture with a React frontend, Express.js backend, MongoDB database, and cloud-based image storage.

---

## Features

## 🔐 Authentication & User Management

- User registration and login
- JWT-based authentication
- Role-based access control
- Admin and customer user roles

---

## 📦 Product Management

- Create, update, and delete products
- Manage product information
- Product category management
- Product image upload and storage
- View available products

---

## 📊 Inventory Management

- Real-time stock monitoring
- Stock level tracking
- Stock reservation system
- Prevention of overselling during concurrent purchases

---

## 🛒 Shopping Cart & Orders

- Add products to cart
- Update cart quantities
- Checkout process
- Order creation
- View customer order history
- Track order status

---

## 💳 Payment Management

- Payment workflow simulation
- Payment status handling
- Stock updates after successful payments
- Order lifecycle management

---

## 📈 Admin Dashboard & Reports

- Sales summary
- Revenue tracking
- Order statistics
- Top-selling products
- Recent order monitoring

---

# Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- Middleware-based architecture

## Database

- MongoDB
- MongoDB Atlas

## File Storage

- Supabase Storage

## Deployment

- Frontend: Vercel
- Backend: Render

---

# System Architecture

```
                React Frontend
                     |
                     |
              Express.js API
                     |
        -------------------------
        |                       |
     MongoDB              Supabase
     Database             Storage
```

---

# Project Structure

```
POS-Inventory-System

├── Frontend
│   ├── Components
│   ├── Pages
│   ├── Routes
│   ├── API Integration
│   └── Authentication

└── Backend
    ├── Controllers
    ├── Routes
    ├── Models
    ├── Middleware
    ├── Utils
    └── Database Configuration
```

---

# Installation & Setup

## Clone Repository

```bash
git clone <repository-url>
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
MONGO_URL=

JWT_SECRET=

SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_BUCKET=
```

Run backend:

```bash
npm start
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_BACKEND_URL=
```

Run frontend:

```bash
npm run dev
```

---

# API Modules

## Users

```
/api/users
```

Handles:

- Authentication
- User accounts
- Authorization


## Products

```
/api/products
```

Handles:

- Product management
- Stock information


## Orders

```
/api/orders
```

Handles:

- Checkout
- Orders
- Order status
- Sales reports


## Upload

```
/api/upload
```

Handles:

- Image upload
- Cloud storage management

---

# Deployment

The application is deployed using:

Frontend:

```
Vercel
```

Backend:

```
Render
```

Database:

```
MongoDB Atlas
```

Storage:

```
Supabase Storage
```

---

# Future Improvements

- Real payment gateway integration
- Mobile application
- Advanced analytics
- Notification system
- Automated testing
- Monitoring and logging

---

# Author

Gaurawa Mihiranga
