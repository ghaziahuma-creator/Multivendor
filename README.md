# ESHOP - Multivendor E-Commerce Platform

ESHOP is a full-stack multivendor e-commerce web application where multiple sellers can create their own shops, list products, and manage orders, while customers can browse, purchase, and chat with sellers in real time.

## 🔗 Live Demo

- **Live App:** [https://multivendor-6tx2.vercel.app](https://multivendor-6tx2.vercel.app)
- **Backend API:** [https://multivendor-tan.vercel.app](https://multivendor-tan.vercel.app)
- **Socket Server:** [https://eshop-socket-4mvx.onrender.com](https://eshop-socket-4mvx.onrender.com)

> Note: The socket server is hosted on Render's free tier, so it may take 30-50 seconds to "wake up" if it's been inactive for a while. Live chat should work normally once it's spun up.

## Features

- Multi-vendor shop creation and management
- Product listing, browsing, and detailed product pages
- Shopping cart and wishlist
- Order placement and order tracking
- Real-time chat between customers and sellers (Socket.IO)
- User and seller authentication (JWT-based)
- Admin dashboard for managing users, sellers, products, orders, and withdrawals
- Coupon codes and event/discount management
- Image uploads for products and shops (Cloudinary)
- Stripe payment integration

## Tech Stack

**Frontend:** React, Vite, Redux, Tailwind CSS — deployed on Vercel  
**Backend:** Node.js, Express.js — deployed on Vercel (serverless)  
**Real-time:** Socket.IO — deployed on Render  
**Database:** MongoDB Atlas  
**Image Storage:** Cloudinary  
**Authentication:** JWT (JSON Web Tokens)  
**Payments:** Stripe

## Project Structure

```
ESHOP/
├── backend/       # Express server, controllers, models, routes
├── frontend/      # React (Vite) client application
├── socket/        # Standalone Socket.IO server for real-time chat
```

## Getting Started (Local Setup)

### Prerequisites
- Node.js installed
- A MongoDB connection string (MongoDB Atlas recommended)
- A Cloudinary account (for image uploads)
- A Stripe account (for payments)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/ghaziahuma-creator/Multivendor.git
   cd Multivendor
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

4. Install socket server dependencies
   ```
   cd ../socket
   npm install
   ```

5. Set up environment variables
   - Create `backend/config/.env` with your database URL, JWT secrets, Cloudinary keys, and Stripe key
   - Create `socket/.env` with `FRONTEND_URL=http://localhost:5173`
   - Create `frontend/.env` with `VITE_BACKEND_URL=http://localhost:8000`

6. Run each part in separate terminals
   ```
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm run dev

   # Socket server
   cd socket
   npm start
   ```

## Author

Built by Ghazia Huma as a learning/portfolio project.
