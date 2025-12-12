const express = require("express");
const db = require("../config/db");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

const isPositiveInteger = (value) => {
  return Number.isInteger(value) && value > 0;
};

router.post("/", protect, async (req, res) => {
  const user_id = req.user.id;

  const { event_id, name, email, quantity, mobile, total_amount } = req.body;

  if (
    !event_id ||
    !name ||
    !email ||
    !isPositiveInteger(quantity) ||
    !total_amount
  ) {
    return res.status(400).json({
      message: "Missing required booking information or invalid quantity.",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [events] = await connection.query(
      "SELECT available_seats, price FROM events WHERE id = ? FOR UPDATE", // LOCK the row for the transaction
      [event_id]
    );

    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Event not found." });
    }

    const event = events[0];
    const { available_seats, price } = event;

    // Seat Check
    if (available_seats < quantity) {
      await connection.rollback();
      return res.status(409).json({
        message: "Not enough seats available. Please try a lower quantity.",
      });
    }

    const calculated_total = quantity * price;
    if (parseFloat(total_amount) !== calculated_total) {
      await connection.rollback();
      // Logging this for security audit
      console.warn(
        `Price mismatch for Event ${event_id}. Client: ${total_amount}, Server: ${calculated_total}`
      );
      return res
        .status(400)
        .json({ message: "Total amount is incorrect. Booking aborted." });
    }

    const bookingSql = `INSERT INTO bookings (user_id, event_id, name, email, quantity, mobile, total_amount) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const bookingValues = [
      user_id,
      event_id,
      name,
      email,
      quantity,
      mobile,
      total_amount,
    ];

    const [bookingResult] = await connection.query(bookingSql, bookingValues);
    const bookingId = bookingResult.insertId;

    // Update Seat Count (Deduction) ---
    const new_available_seats = available_seats - quantity;
    const updateSql = "UPDATE events SET available_seats = ? WHERE id = ?";

    await connection.query(updateSql, [new_available_seats, event_id]);

    const eventId = event_id;
    const newAvailableSeats = new_available_seats;

    // Committing Transaction :
    await connection.commit();

    res.status(201).json({
      message: "Tickets successfully booked and seats confirmed!",
      bookingId: bookingId,
      newAvailableSeats: newAvailableSeats,
    });

    req.io.to(`event-${eventId}`).emit("seatsUpdated", {
      eventId: eventId,
      availableSeats: newAvailableSeats,
    });
    console.log(
      `Emitted seatsUpdated for Event ${eventId}. New count: ${newAvailableSeats}`
    );
  } catch (error) {
    console.error("Booking Transaction Failed:", error);

    // Rollback on any failure
    if (connection) {
      await connection.rollback();
    }

    res
      .status(500)
      .json({ message: "Failed to process booking due to a server error." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
