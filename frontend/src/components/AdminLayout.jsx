import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import AdminSidePanel from "./AdminSidePanel";
import Adminheader from "./Adminheader";
import "../styles/AdminLayout.css";

const AdminLayout = ({selectedCategory,setSelectedCategory,searchProduct,setSearchProduct,setOutOfStock,outOfStock,setTodayOrder,todayOrder}) => {
  const [sidePanel, setSidePanel] = useState(false);

  const sidepanelScrollRef = useRef(null);

  useEffect(() => {
    if (sidePanel && sidepanelScrollRef.current) {
      sidepanelScrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [sidePanel]);

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidePanel ? "active" : ""}`}>
        <AdminSidePanel
          ref={sidepanelScrollRef}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sidePanel={sidePanel}
          setSidePanel={setSidePanel}
        />
      </aside>

      <main className="admin-main">
        <Adminheader
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchProduct={searchProduct}
          setSearchProduct={setSearchProduct}
          sidePanel={sidePanel}
          setSidePanel={setSidePanel}
          setOutOfStock={setOutOfStock} 
          outOfStock={outOfStock}
          setTodayOrder={setTodayOrder}
          todayOrder={todayOrder}
        />
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
