import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/RecentOrders.css";
import { useloader } from "../../context/ContextLoader";
const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const { startloading, stoploading } = useloader(); 

  const fetch=async()=>{
      startloading();
      try {
        const res = await axios.get("http://localhost:8000/api/product/recentorders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err);
      } finally {
        stoploading();
      }
    }

  useEffect(() => {
    fetch()
  }, []);

  return (
    <div className="recent-orders">
      <h2>Recent Orders</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Item</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.userName}</td>
              <td>{order.items?.title}</td>
              <td>{order.items?.price.toFixed(2)}</td>
              <td>{order.orderStatus}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
