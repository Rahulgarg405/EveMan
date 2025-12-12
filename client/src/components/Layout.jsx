import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#6d33ccdc]">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
