# NexaBuy E-Commerce Platform
## End-User Documentation

---

**Project Name:** NexaBuy E-Commerce Platform  
**Developed By:** Yash Singh  
**GitHub Repository:** [https://github.com/yashsingh-14/nexabuy-ecommerce](https://github.com/yashsingh-14/nexabuy-ecommerce)  
**Live Deployment:** [https://nexabuy-ecommerce.onrender.com](https://nexabuy-ecommerce.onrender.com)  
**Date:** April 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [How to Access NexaBuy](#2-how-to-access-nexabuy)
3. [User Roles Explained](#3-user-roles-explained)
4. [Getting Started — Registration & Login](#4-getting-started--registration--login)
5. [Customer Guide](#5-customer-guide)
   - 5.1 Browsing Products
   - 5.2 Searching & Filtering
   - 5.3 Viewing Product Details
   - 5.4 Adding Items to Cart
   - 5.5 Managing the Wishlist
   - 5.6 Shopping Cart & Quantity Management
   - 5.7 Checkout & Placing an Order
   - 5.8 Tracking Your Orders
6. [Admin Guide](#6-admin-guide)
   - 6.1 Admin Dashboard Overview
   - 6.2 Managing Categories
   - 6.3 Managing Products
   - 6.4 Managing Orders
   - 6.5 Managing Staff / Employees
   - 6.6 Leave Request Approvals
   - 6.7 Staff Attendance Report
7. [Employee Guide](#7-employee-guide)
   - 7.1 Employee Dashboard
   - 7.2 Clock-In / Clock-Out (Shift Management)
   - 7.3 Applying for Leave
8. [Navigation Bar](#8-navigation-bar)
9. [Logging Out](#9-logging-out)
10. [Frequently Asked Questions (FAQ)](#10-frequently-asked-questions-faq)

---

## 1. Introduction

**NexaBuy** is a full-stack e-commerce web application that allows customers to browse products, add them to their cart or wishlist, and place orders with multiple payment options. 

In addition to the standard shopping experience, NexaBuy also includes a built-in **Admin Dashboard** for store management and an **Employee Portal** for workforce management—making it an all-in-one platform for running an online store.

### Key Highlights:
- **For Customers:** Browse, search, filter, wishlist, cart, checkout, and order tracking.
- **For Admins:** Full control over products, categories, orders, staff, attendance, and leave management.
- **For Employees:** Personal dashboard with shift clock-in/clock-out and leave request system.

---

## 2. How to Access NexaBuy

### Option A: Live Website (Recommended)
Simply open your browser and visit the live URL:

> **[https://nexabuy-ecommerce.onrender.com](https://nexabuy-ecommerce.onrender.com)**

No installation or setup is needed. The application works on any modern web browser (Chrome, Firefox, Edge, Safari) on both desktop and mobile devices.

### Option B: Running Locally
If you want to run the project on your own computer:

1. **Clone the repository:**
   ```
   git clone https://github.com/yashsingh-14/nexabuy-ecommerce.git
   ```

2. **Start the Backend:**
   ```
   cd backend
   npm install
   npm run dev
   ```

3. **Start the Frontend (in a new terminal):**
   ```
   cd frontend
   npm install
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173`

---

## 3. User Roles Explained

NexaBuy has three types of users, each with different access levels:

| Role | Description | What They Can Do |
|------|-------------|------------------|
| **Customer** | Regular shoppers who buy products | Browse products, manage cart & wishlist, place orders, track orders |
| **Admin** | Store owner / manager with full control | Everything a customer can do + manage products, categories, orders, staff, attendance, and leave requests |
| **Employee** | Store staff members | Clock-in/clock-out for shifts, apply for leave, view leave status |

---

## 4. Getting Started — Registration & Login

### 4.1 Creating a New Account (Registration)

1. Open the NexaBuy website.
2. On the Login page, click the **"Register here"** link at the bottom.
3. Fill in the registration form:
   - **Full Name** — Enter your complete name (e.g., "Rahul Sharma").
   - **Email Address** — Enter a valid email (e.g., "rahul@gmail.com").
   - **Password** — Create a strong password (minimum 6 characters).
   - **Confirm Password** — Re-enter the same password to verify.
4. Click the **"Create Account"** button.
5. You will see a success message: *"Registration successful! Redirecting to login..."*
6. You will be automatically redirected to the Login page after 2 seconds.

> **Note:** All new accounts are created with the **Customer** role by default. Only an Admin can create Employee accounts.

### 4.2 Logging In

1. On the Login page, enter your **Email Address** and **Password**.
2. Click the **"Sign In"** button.
3. Based on your role, you will be redirected to:
   - **Admin** → Admin Dashboard
   - **Employee** → Employee Dashboard
   - **Customer** → Products Page

### 4.3 Demo Admin Login Credentials

To test the admin features, use the pre-created admin account:

| Field | Value |
|-------|-------|
| **Email** | `admin@ecommerce.com` |
| **Password** | `admin123` |

---

## 5. Customer Guide

### 5.1 Browsing Products

After logging in, you will see the **Products** page. This page displays all available products in a clean grid layout. Each product card shows:
- Product image
- Category name (e.g., "Electronics", "Clothing")
- Product name
- Price (in ₹)
- Stock availability (In Stock / Out of Stock)

### 5.2 Searching & Filtering

At the top of the Products page, you will find two filtering tools:

- **Search Bar:** Type any keyword to instantly search products by name or category. For example, typing "phone" will show all phone-related products.
- **Category Dropdown:** Click the dropdown and select a specific category (e.g., "Electronics") to see only products from that category. Select "All Categories" to reset the filter.

### 5.3 Viewing Product Details

To view more details about any product:
1. Click the **"Details"** button on the product card.
2. A dedicated product page will open showing the full product description, price, stock count, and image.

### 5.4 Adding Items to Cart

1. On any product card, click the **"Add to Cart"** button.
2. A green confirmation message will appear: *"Item added to cart! 🛒"*
3. If the product is out of stock, the "Add to Cart" button will be disabled (greyed out).

### 5.5 Managing the Wishlist

The Wishlist lets you save products you want to buy later.

**Adding to Wishlist:**
1. On any product card, click the **❤️ (heart) button**.
2. A confirmation message will appear: *"Added to wishlist! ❤️"*

**Viewing Your Wishlist:**
1. Click **"Wishlist"** in the navigation bar at the top.
2. You will see all your saved products displayed in a grid.

**Actions from Wishlist:**
- Click **"Add to Cart"** to move the item directly to your shopping cart.
- Click **"Remove from Wishlist"** to delete the item from your saved list.

### 5.6 Shopping Cart & Quantity Management

Click **"Cart"** in the navigation bar to view your shopping cart.

**What you will see:**
- A list of all items in your cart with their image, name, price, and quantity.
- **Order Summary** on the right side showing subtotal, shipping (Free), and total amount.

**Managing Quantities:**
- Click the **"+"** button to increase the quantity of an item.
- Click the **"−"** button to decrease the quantity (minimum 1).
- Click the **"✕"** button to completely remove an item from the cart.

**Proceeding to Checkout:**
- Click the **"Proceed to Checkout →"** button when you are ready to place your order.

### 5.7 Checkout & Placing an Order

The Checkout page has three sections:

**Section 1: Order Summary**
- Shows the total amount you are about to pay.

**Section 2: Delivery Address**
Fill in all the required fields:
- Full Name
- Mobile Number (10 digits)
- PIN Code (6 digits)
- Flat / House / Building
- Area / Street / Sector
- Town / City
- State (select from dropdown)

**Section 3: Payment Method**
Select one of the available payment options:
- Credit Card
- Debit Card
- UPI
- Net Banking
- Cash on Delivery

After filling in all details, click **"✓ Place Order"** to complete your purchase. You will be redirected to the Orders page where you can track your new order.

### 5.8 Tracking Your Orders

Click **"Orders"** in the navigation bar to view all your past and current orders.

**Order details shown:**
| Column | Description |
|--------|-------------|
| Order ID | Unique identifier for your order (e.g., #1, #2) |
| Total Amount | The total price of the order |
| Status | Current status badge (Pending / Confirmed / Shipped / Delivered / Cancelled) |
| Date | The date when the order was placed |

> **Note:** Order status is updated by the Admin. You cannot change the status yourself.

---

## 6. Admin Guide

Admins have full control over the platform. After logging in with admin credentials, you will be taken to the **Admin Dashboard**.

### 6.1 Admin Dashboard Overview

The Dashboard provides a quick at-a-glance summary of your store:

**Stats Cards (Top Row):**
| Card | What it Shows |
|------|---------------|
| 👥 Staff Present | Percentage of staff currently on shift |
| 📅 Pending Leaves | Number of leave requests waiting for your approval |
| 📦 Total Products | Total number of products in your catalogue |
| 🛒 Recent Orders | Total number of orders placed |

**Recent Orders Table:** Shows the latest orders with Order ID, Amount, Status, and Date.

**Live Activity Feed:** Shows recent actions happening on the platform (new orders, product updates, etc.)

**Attendance Report:** Click on the "Staff Present" card to open a full attendance modal showing which employees have clocked in today, with their check-in and check-out times.

### 6.2 Managing Categories

Navigate to **"Categories"** from the navigation bar.

**Creating a New Category:**
1. Click the **"+ New Category"** button.
2. Enter the Category Name (e.g., "Electronics", "Clothing").
3. Optionally add a Description.
4. Click **"Create Category"**.

**Editing a Category:**
1. In the categories table, click the **"✏️ Edit"** button next to the category.
2. Modify the name or description.
3. Click **"Save Changes"**.

**Deactivating a Category:**
1. Click the **"🗑️ Deactivate"** button.
2. A warning dialog will appear. If the category contains active products, you will be warned that deactivating it will hide those products from customers.
3. Click **"Yes, Deactivate"** to confirm.

**Categories Table Columns:**
| Column | Description |
|--------|-------------|
| # | Category ID |
| Category Name | Name of the category |
| Description | Brief description |
| Products | Number of products in this category |
| Status | Active (green) or Inactive (red) |
| Created | Date when the category was created |
| Actions | Edit or Deactivate buttons |

### 6.3 Managing Products

Navigate to **"Manage Products"** from the navigation bar.

**Adding a New Product:**
1. Click the **"+ Add Product"** button.
2. Fill in the form:
   - **Product Name** (required) — e.g., "Wireless Headphones"
   - **Category** (required) — Select from the dropdown
   - **Price** (required) — Enter the price in ₹ (e.g., 1299.00)
   - **Description** — Brief product description
   - **Stock Quantity** — How many units are available (e.g., 50)
   - **Image URL** — Paste a link to the product image
3. Click **"Add Product"**.

**Editing a Product:**
1. Click **"✏️ Edit"** next to any product in the table.
2. Modify any field as needed.
3. Click **"Save Changes"**.

**Removing a Product:**
1. Click **"🗑️ Remove"** next to the product.
2. Confirm the action in the dialog.
3. The product will be soft-deleted (deactivated) and hidden from customers.

### 6.4 Managing Orders

Navigate to **"Orders"** from the navigation bar. As an Admin, you will see **all orders** from all customers (Global Orders Management).

**Updating Order Status:**
1. In the Status column, click the dropdown next to any order.
2. Select the new status:
   - **Pending** — Order received, not yet processed
   - **Confirmed** — Order has been confirmed
   - **Shipped** — Order has been shipped
   - **Delivered** — Order has been delivered
   - **Cancelled** — Order has been cancelled
3. The status updates instantly.

### 6.5 Managing Staff / Employees

Navigate to **"Staff"** from the navigation bar.

**Adding a New Employee:**
1. Click **"+ Add New Staff"**.
2. Fill in the form:
   - **Full Name** — Employee's full name
   - **Corporate Email** — Their work email address
   - **Initial Password** — A temporary login password (you can use the eye icon to toggle password visibility)
3. Click **"Create Employee"**.

**Tabs:**
- **Active Staff** — Shows all currently active employees.
- **Archived (Off-boarded)** — Shows terminated/off-boarded employees.

**Actions for Active Staff:**
- **Reset Password** — Force-reset an employee's password. Click the button, enter the new password, and confirm.
- **Revoke Access** — Terminate the employee's access. They will immediately lose the ability to log in.

**Actions for Archived Staff:**
- **Restore Access** — Re-activate a previously terminated employee's account.

### 6.6 Leave Request Approvals

Navigate to **"Leaves"** from the navigation bar. As an Admin, you will see all leave requests from all employees.

**Approving or Rejecting Leave:**
1. Review the leave request details: Employee Name, Leave Period (Start Date → End Date), Reason, and Current Status.
2. Use the status dropdown or buttons to change the status to:
   - **Approved** — Accept the leave request
   - **Rejected** — Deny the leave request

### 6.7 Staff Attendance Report

From the Admin Dashboard, click on the **"👥 Staff Present"** stat card to open the Attendance Report modal.

This modal shows:
- List of all employees
- Their check-in time for today
- Their check-out time (if they have clocked out)
- Overall attendance percentage

---

## 7. Employee Guide

Employees have a dedicated portal for managing their shifts and leave requests.

### 7.1 Employee Dashboard

After logging in as an Employee, you will see your personal dashboard showing:

**Stats Cards:**
| Card | What it Shows |
|------|---------------|
| Shift Control | Interactive button to start/end your shift (see below) |
| Current Status | Your current shift status — Active, Off-Duty, or Done |
| Total Leave Requests | Number of leave requests you have submitted |
| Approved Leaves | Number of leaves that have been approved |

**Recent Leave Requests Table:** Shows your 5 most recent leave applications with dates, reason, and status.

### 7.2 Clock-In / Clock-Out (Shift Management)

The large colored card on your dashboard controls your shift:

**Before Starting Shift:**
- The card shows **"Start Shift — Click to Clock-In"** (purple/blue color).
- Click it to begin your work shift. Your clock-in time will be recorded.

**During Shift:**
- The card turns **green** and shows **"End Shift"** along with the time you clocked in.
- A timer icon pulses to indicate you are currently on shift.
- Click it to end your shift and record your clock-out time.

**After Completing Shift:**
- The card turns **grey** and shows **"Shift Completed"**.
- A timesheet summary bar appears below showing your total clock-in and clock-out times.
- You cannot clock in again until the next day.

### 7.3 Applying for Leave

Navigate to **"Leave Requests"** from the navigation bar.

**Submitting a New Leave Request:**
1. Fill in the leave form:
   - **Start Date** — When your leave begins
   - **End Date** — When your leave ends
   - **Reason** — A brief explanation for the leave
2. Submit the request.
3. Your request will appear in the table with a **"Pending"** status.

**Leave Status Meanings:**
| Status | Meaning |
|--------|---------|
| **Pending** (yellow) | Your request is waiting for the Admin's review |
| **Approved** (green) | Your leave has been approved by the Admin |
| **Rejected** (red) | Your leave request was denied by the Admin |

---

## 8. Navigation Bar

NexaBuy uses a modern, animated floating navigation bar at the top center of the screen.

**How it works:**
- When you are at the top of any page, the navigation bar is fully expanded showing all the links.
- When you **scroll down**, the navigation bar automatically shrinks into a small circle with a menu icon.
- When you **scroll back up**, the navigation bar smoothly expands back to its full size.
- You can also **click the small circle** to manually expand the menu.

**Navigation Links by Role:**

| Customer | Admin | Employee |
|----------|-------|----------|
| Products | Dashboard | My Dashboard |
| Cart | Products | Leave Requests |
| Wishlist | Cart | |
| Orders | Wishlist | |
| | Orders | |
| | Staff | |
| | Leaves | |
| | Categories | |
| | Manage Products | |

Each link has a small avatar icon showing the first letter of your name and a **"Logout"** button at the end.

---

## 9. Logging Out

To log out of NexaBuy:
1. Look at the right end of the navigation bar.
2. Click the **"Logout"** button (shown in red text).
3. You will be immediately logged out and redirected to the Login page.

---

## 10. Frequently Asked Questions (FAQ)

**Q: I forgot my password. How do I reset it?**  
A: Currently, there is no self-service password reset. Please contact the Admin, who can reset your password from the Staff Management page.

**Q: Can I change my email or name after registration?**  
A: This feature is not available in the current version. Please contact the Admin for account changes.

**Q: Why is the "Add to Cart" button greyed out?**  
A: This means the product is currently out of stock. You can still add it to your Wishlist and purchase it later when the stock is replenished.

**Q: How long does it take for my order status to update?**  
A: Order status is manually updated by the Admin. It depends on the store's processing and shipping timelines.

**Q: Can I cancel my order?**  
A: Only the Admin can change the order status to "Cancelled." Please contact the store for cancellation requests.

**Q: I am an Employee. Why can't I see Products or Cart?**  
A: Employee accounts are designed specifically for workforce management (attendance and leave). They do not have access to the shopping features.

**Q: The website loads slowly on the first visit. Is this normal?**  
A: Yes. The live deployment uses Render's free tier, which puts the server to sleep after periods of inactivity. The first visit may take 30-60 seconds to wake up the server. Subsequent visits will be fast.

---

*This document is the official End-User Documentation for the NexaBuy E-Commerce Platform. For technical or developer documentation, please refer to the README.md file in the GitHub repository.*
