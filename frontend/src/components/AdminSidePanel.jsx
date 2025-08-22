import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import "../styles/AdminSidePanel.css";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/images.png'

const AdminSidePanel = forwardRef(function AdminSidePanel(
  { setSelectedCategory, sidePanel, setSidePanel },
  ref
) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("https://quickmartproject-backend.onrender.com/api/product/fetchcategory");
      setCategories(res.data.result);
    };
    fetch();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref?.current && !ref.current.contains(e.target)) {
        setSidePanel(false);
      }
    }
    if (sidePanel) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidePanel, setSidePanel, ref]);

  return (
    <div className="sidepanel-container" ref={ref}>
      <div className="logo-container">
        <p>QuickMart</p>
        <img src={Logo} alt="logo" />
      </div>

      <label className="category-label">Categories</label>
      <ul>
        <li>
          <button onClick={() => { setSelectedCategory("All"); setSidePanel(false); }}>
            All
          </button>
        </li>
        {categories.map((e, i) => (
          <li key={i}>
            <button onClick={() => {setSelectedCategory(e.category);setSidePanel(false);navigate("/admin/product");}}>
              {(e.category).charAt(0).toUpperCase()+e.category.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default AdminSidePanel;
