# Café Management System 🌿

## Overview

The **Café Management System** is an intuitive web-based platform tailored to the needs of Live Life Organic Company’s café segment. This solution integrates core functionalities such as menu management, employee coordination, reservation handling, delivery logistics, inventory tracking, and order processing. By streamlining operations in a single platform, the system enhances efficiency, customer satisfaction, and supports long-term growth.

## Features

### 🍽️ Menu Management
- Create, edit, and categorize café menu items.
- Update descriptions, prices, and availability in real-time.
- Customers can view detailed nutritional information and download a PDF version of the menu.
- Flexible customization of menu items for different dietary preferences (e.g., vegetarian, vegan, gluten-free).

### 👨‍🍳 Employee Management
- Manage staff profiles, shift schedules, and task assignments.
- Monitor attendance and track employee performance with real-time data.
- Use RFID or QR code systems to automate attendance tracking.

### 🛒 Inventory Management
- Real-time tracking of stock levels, expiration dates, and usage patterns.
- Automated notifications for low stock or expiring items.
- Optimize procurement and inventory management to ensure smooth operations.

### 📦 Order Management
- Handle orders seamlessly from creation to tracking and cancellation.
- Integrated tracking system for orders from kitchen to customer.
- Order modification and status updates in real time.

### 🚚 Delivery Management
- Assign and track delivery tasks for staff in real time.
- Provide customers with updates on their delivery status.
- Improve delivery times with optimized routes and status tracking.

### 📝 Feedback Management
- Gather customer feedback through a 5-star rating system and written comments.
- Analyze feedback to improve service and identify areas for growth.
- Generate reports to track feedback trends over time.

### 🛋️ Reservation Management
- Enable customers to reserve tables online.
- Manage reservations and preferences (e.g., indoor/outdoor seating).
- Automatic email and SMS notifications for reservation confirmations.

### 🎁 Gift Card & Voucher Management
- Create and manage digital gift cards and vouchers for both online and in-store use.
- Track balances and usage history for each card.
- Enable easy redemptions with barcodes or QR codes.

## Technologies Used

- **Frontend**: ReactJS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Version Control**: GitHub
- **Deployment**: (Insert any deployment details, e.g., Heroku, AWS)

## Installation

Follow the steps below to set up the **Café Management System** on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/azaynm/ITP24_B11_10
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Cafe-Management-System
   ```

3. **Install the dependencies for both frontend and backend:**

   ```bash
   npm install
   cd client
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following values:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. **Run the application:**

   ```bash
   npm run dev
   ```

   This will start both the backend and frontend servers concurrently.

## Usage

Once the application is running, you can access it in your web browser. The system provides an easy-to-navigate user interface, allowing you to manage:

- **Menu**: Add, update, and display menu items.
- **Employees**: View staff schedules, assign tasks, and monitor performance.
- **Orders**: Process, track, and manage customer orders.
- **Reservations**: Handle table bookings and preferences.
- **Delivery**: Track delivery status and assignments.
- **Feedback**: Collect and analyze customer feedback.

## Contributing

We welcome contributions! To contribute to the **Café Management System**, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to your branch (`git push origin feature-branch-name`).
5. Open a pull request.
