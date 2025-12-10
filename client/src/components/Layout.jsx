// client/src/components/Layout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"; // We will create this next
// import Footer from './Footer'; // Optional: add a footer component later

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Outlet renders the current route content (e.g., LandingPage, EventListingPage) */}
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
