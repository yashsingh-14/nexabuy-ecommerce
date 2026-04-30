# 🛍️ NexaBuy E-Commerce Platform

Welcome to **NexaBuy**! This is a modern, fast, and easy-to-use e-commerce platform built with React and Node.js. 

Unlike traditional e-commerce sites, NexaBuy comes with a built-in **Admin & Employee Dashboard** to help store owners manage their inventory, track staff attendance, and handle leave requests—all in one place!

---

## 🚀 Features

### For Customers:
* **Browse Products:** Clean and elegant product catalog.
* **Shopping Cart & Wishlist:** Easily add items to buy later or purchase them immediately.
* **Order Tracking:** Keep track of past and current orders.

### For Admins & Store Owners:
* **Dashboard Overview:** See live activity, total orders, and staff attendance at a glance.
* **Product & Category Management:** Add, edit, or remove products and categories easily.
* **Staff Management:** View employee attendance and approve/reject leave requests.

### For Employees/Staff:
* **Employee Dashboard:** Manage daily shifts and attendance.
* **Leave Requests:** Apply for time off directly through the portal.

---

## 💻 Tech Stack

NexaBuy uses a standard and popular tech stack, making it fast and easy to run on any computer.

* **Frontend:** React.js + Vite (for lightning-fast building)
* **Backend:** Node.js + Express.js
* **Database:** MySQL
* **Authentication:** JSON Web Tokens (JWT) for secure logins

---

## 🛠️ How to Run NexaBuy Locally

Follow these simple steps to run the project on your own computer.

### 1. Database Setup
Make sure you have MySQL installed on your computer.
1. Open your MySQL terminal or MySQL Workbench.
2. Create a new database named `ecommerce_db`.
3. Import the database tables using the schema file provided:
   `backend/database/schema.sql`

*(A default admin account is automatically created when you run the schema. Email: `admin@ecommerce.com` | Password: `admin123`)*

### 2. Start the Backend (Server)
Open your terminal and run these commands:

```bash
cd backend
npm install
```

Create a new file named `.env` inside the `backend` folder and add your database details:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=my_super_secret_nexabuy_key
```

Start the server:
```bash
npm run dev
```

### 3. Start the Frontend (Website)
Open a **new** terminal window and run these commands:

```bash
cd frontend
npm install
npm run dev
```

Your website will now be running live at **http://localhost:5173**!

---

## 🔗 Simple API Overview

Here is a quick look at how our backend communicates with the frontend:

* **Authentication:** `/api/auth` (Login and Register users)
* **Products:** `/api/products` (Fetch, Add, Edit, Delete items)
* **Categories:** `/api/categories` (Organize items into groups)
* **Cart & Wishlist:** `/api/cart` and `/api/wishlist` (Manage user shopping bags)
* **Orders:** `/api/orders` (Process and view orders)
* **Staff Leaves & Attendance:** `/api/leaves` and `/api/attendance` (Manage the workforce)

---

> **Note:** This project was custom-built with a focus on an elegant UI and a clean, easy-to-read codebase. Enjoy exploring NexaBuy!
