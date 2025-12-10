// server/routes/eventRoutes.js

const express = require("express");
const { protect, isAdmin } = require("../middleware/auth.middleware");
const db = require("../config/db"); // The database connection pool

const router = express.Router();

// 1. POST /events - Create Event (Admin Only)
router.post("/", protect, isAdmin, async (req, res) => {
  // Note: We are mocking req.user.id = 1 for the admin_id placeholder
  const { title, description, location, date, total_seats, price, img } =
    req.body;
  const admin_id = req.user.id;

  // Simple validation
  if (!title || !location || !date || !total_seats || !price) {
    return res.status(400).json({ message: "Missing required event fields." });
  }

  // Set available_seats equal to total_seats upon creation [cite: 23, 25]
  const available_seats = total_seats;

  const sql = `INSERT INTO events (admin_id, title, description, location, date, total_seats, available_seats, price, img) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    admin_id,
    title,
    description,
    location,
    date,
    total_seats,
    available_seats,
    price,
    img,
  ];

  try {
    const [result] = await db.query(sql, values);
    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to create event." });
  }
});

// 2. GET /events - List all events (search, filter by date/location)
router.get("/", protect, async (req, res) => {
  const { search, location, date } = req.query; // Get query parameters

  let sql =
    "SELECT id, title, location, date, price, available_seats FROM events WHERE 1=1";
  const values = [];

  // Filter by location
  if (location) {
    sql += " AND location LIKE ?";
    values.push(`%${location}%`);
  }

  // Filter by date (simple date match/range)
  if (date) {
    // Note: For advanced date ranges, the query logic will be more complex (e.g., BETWEEN)
    sql += " AND DATE(date) = ?";
    values.push(date);
  }

  // Search by title or description
  if (search) {
    sql += " AND (title LIKE ? OR description LIKE ?)";
    values.push(`%${search}%`, `%${search}%`);
  }

  // Order by date to show upcoming events first [cite: 7]
  sql += " ORDER BY date ASC";

  try {
    const [events] = await db.query(sql, values);
    res.json(events);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to retrieve events." });
  }
});

// Inside server/routes/eventRoutes.js

// 3. GET /events/:id - Event details
router.get("/:id", protect, async (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM events WHERE id = ?";

  try {
    const [events] = await db.query(sql, [id]);
    if (events.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }
    // Return the first (and only) result
    res.json(events[0]);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to retrieve event details." });
  }
});

// 4. PUT /events/:id - Update event (Admin Only) [cite: 53]
router.put("/:id", protect, isAdmin, async (req, res) => {
  // Event update logic will go here
  res.send("Admin: Update event route");
});

// 5. DELETE /events/:id - Delete event (Admin Only) [cite: 55]
router.delete("/:id", protect, isAdmin, async (req, res) => {
  // Event delete logic will go here
  res.send("Admin: Delete event route");
});

module.exports = router;
