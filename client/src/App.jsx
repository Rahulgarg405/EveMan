import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoutes";
import LandingPage from "./pages/LandingPage";
import EventListingPage from "./pages/EventListingPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingSuccess from "./pages/BookingSuccess";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with shared layout (Header/Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="events" element={<EventListingPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route
            path="booking/success/:bookingId"
            element={<BookingSuccess />}
          />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
