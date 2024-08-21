

# Café Management System

## Overview

The **Café Management System** is a comprehensive web-based solution designed to streamline the operational processes of Live Life Organic Company's café segment. This system addresses key challenges in menu management, employee coordination, reservation handling, gift card and voucher management, delivery logistics, inventory tracking, order processing, and feedback management. By integrating these functionalities into a single platform, the system enhances operational efficiency, improves customer satisfaction, and supports business growth.

## Features

- **Menu Management**
  - Create, edit, and manage café menu items.
  - Categorize menu items for easy navigation.
  - Update descriptions, prices, and availability in real-time.
  - Customers can browse the menu, view nutritional information, and download a PDF version.

- **Employee Management**
  - Manage staff profiles, shifts, and schedules.
  - Monitor attendance using RFID or QR systems.
  - Assign tasks and track employee performance.

- **Inventory Management**
  - Real-time tracking of stock levels, expiration dates, and usage patterns.
  - Automated notifications for low stock levels.
  - Optimize procurement processes and ensure continuous fulfillment of customer demand.

- **Order Management**
  - Seamlessly handle order creation, tracking, modification, and cancellation.
  - Integrated order processing, tracking, and fulfillment for improved efficiency.

- **Delivery Management**
  - Assign delivery tasks to staff and provide real-time tracking of deliveries.
  - Update delivery status and ensure timely service.

- **Feedback Management**
  - Gather customer feedback with a 5-star rating system and comments.
  - Analyze feedback data to identify areas for improvement.
  - Enhance accountability and service quality.

- **Reservation Management**
  - Facilitate online table reservations for dine-in customers.
  - Manage reservation details and seating preferences.
  - Provide confirmation notifications to customers.

- **Gift Card and Voucher Management**
  - Create, distribute, and manage gift cards and vouchers.
  - Track usage and manage balances.
  - Support online and in-store purchases and redemptions.

## Technologies Used

- **Frontend**: ReactJS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Version Control**: GitHub
- **Deployment**: (Specify if applicable)

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/azaynm/ITP24_B11_10  
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Cafe-Management-System
   ```

3. **Install dependencies for both the frontend and backend:**

   ```bash
   npm install
   cd client
   npm install
   ```

4. **Set up the environment variables:**

   Create a `.env` file in the root directory and specify the following variables:

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

Once the application is running, you can access the platform via your web browser. The system provides an intuitive user interface for managing café operations, including menu management, employee coordination, inventory tracking, and more.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.



---
