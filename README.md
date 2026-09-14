# Techloom POS & Inventory System - Frontend

Frontend application for the Techloom POS & Inventory System. This React application provides user interfaces for authentication, product browsing, shopping cart, order management, inventory viewing, and admin operations.

## Technology Stack

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- React Icons
- React Hot Toast
- Vercel Deployment

## Features

### Authentication

- User registration and login
- JWT token-based authentication
- Role-based access control
- Protected routes for users and admins

### Product Management

- View available products
- Product details display
- Product image display
- Product category browsing
- Admin product management interface

### Inventory Management

- Live stock viewing
- Product availability checking
- Real-time inventory information display

### Shopping Cart Management

- Add products to cart
- Update cart quantities
- Remove products from cart
- Cart summary calculation

### Order Management

- Checkout process
- Create customer orders
- View order history
- Track order status

### Admin Dashboard

- Manage products
- Manage customer orders
- View sales reports
- Monitor system activities

### Image Management

- Display product images
- Supabase Storage image integration

## Project Structure

```
frontend

├── src
│
├── components
│
├── pages
│
├── routes
│
├── assets
│
├── App.jsx
│
└── main.jsx
```

## Environment Variables

```env
VITE_BACKEND_URL=
```

## Installation

```bash
npm install
```

## Running Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

## API Integration

- `/api/users` - Authentication and user management

- `/api/products` - Product and inventory data

- `/api/orders` - Order management

- `/api/payments` - Payment handling

- `/api/upload` - Image upload services

## Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Storage: Supabase Storage

## Author

Gaurawa Mihiranga
