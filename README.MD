# Smart Event Booking System (MERN + MySQL)

This project is a full-stack event ticketing platform where users can browse events and book tickets in real-time, and administrators can manage events and bookings.

This implementation uses the MERN stack principle (React, Node, Express) but replaces MongoDB with **MySQL** for relational data integrity, and incorporates **Socket.IO** for real-time features.

## ✨ Key Features

- **Secure Authentication:** User and Admin roles handled via JWT and BCrypt.
- **Transactional Booking:** Atomic updates ensure seats are reduced simultaneously with booking creation (prevents overbooking).
- **Real-time Seat Availability:** Uses Socket.IO to instantly notify users on event detail pages when seats are booked or updated.
- **Admin Dashboard:** Full CRUD operations (Create, Read, Update, Delete) for event management.
- **Modern UI/UX:** Animated forms and cards using Framer Motion, and a visually appealing Landing Page.

## 💻 Technology Stack

- **Database:** MySQL (Used for relational data: Events, Users, Bookings).
- **Backend:** Node.js (Express) (RESTful API and authentication handling).
- **Real-time:** Socket.IO (For instant seat availability updates).
- **Frontend:** React.js (Vite) (Frontend user interface).
- **Styling/UX:** Tailwind CSS, Framer Motion (Modern styling, animations, and transitions).

---

## Local Setup and Installation

Follow these steps to get the application running on your local machine.

### Prerequisites

You must have the following software installed:

- **Node.js** (v14+)
- **MySQL Server** (and a client like MySQL Workbench or DBeaver)

### Step 1: Clone the Repository

```bash
git clone [YOUR_REPO_URL_HERE]
cd smart-event-booking-system
```

## Step 2: Database Setup (MySQL)

### 1. Create Database

Log into your MySQL client and create the database specified in the backend configuration.

### 2. Run Schema Script

Execute the provided SQL script (`event_booking.sql`) to create the required tables (`users`, `events`, `bookings`).

## Step 3: Backend Configuration and Run

### 1. Navigate to Server

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env File

Create a `.env` file inside the **server** directory:

```
# Server Configuration
PORT=3000
JWT_SECRET=your_secret_key_for_jwt_signing

# MySQL Database Credentials (Must match your local setup)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_booking
```

### 4. Start the Server

```bash
node server.js
```

The server will run on **http://localhost:3000** (or the port specified in `.env`) and will confirm a successful DB connection.

---

## Step 4: Frontend Configuration and Run

### 1. Navigate to Client

```bash
cd ../client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Client

```bash
npm run dev
```

Open your browser:  
👉 **http://localhost:5173**

---

## 🔑 Authentication Credentials

### User Role Access

Login to browse events and book tickets.

### Admin Role Access

Admins can log in to access the **Admin Dashboard** for event creation and management.

> **Note:** You may need to manually insert the initial admin user into the `users` table using SQL.

---

## 💡 Future Enhancements

- Deploy backend (Render/Heroku) and frontend (Vercel/Netlify).
- Build a **PWA (Progressive Web App)** for mobile devices.
