CREATE DATABASE IF NOT EXISTS event_booking;
USE event_booking;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT, 
    location VARCHAR(255) NOT NULL,  
    date DATETIME NOT NULL,  
    total_seats INT NOT NULL, 
    available_seats INT NOT NULL,  
    price DECIMAL(10, 2) NOT NULL, 
    img VARCHAR(255),
    
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT,
    event_id INT NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    quantity INT NOT NULL,
    mobile VARCHAR(20), 
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed' NOT NULL, 

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);


INSERT INTO users (username, email, password, role) 
VALUES ('admin_user', 'admin@example.com', 'secure_hashed_password', 'admin');