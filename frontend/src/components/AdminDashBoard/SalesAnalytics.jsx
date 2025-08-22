import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import '../../styles/SalesAnalytics.css'
import { useloader } from "../../context/ContextLoader";
const SalesAnalytics = () => {
  const [data, setData] = useState([]);
  const { startloading, stoploading } = useloader(); 

  const fetch=async()=>{
    startloading();
    try {
      const res = await axios.get("http://localhost:8000/api/product/salesanalytics");
      setData(res.data);
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
    <div className="Cart-Container">
      <h2 >Monthly Earnings (₹)</h2>
      <ResponsiveContainer width="95%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(str) => new Date(str).getDate()} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesAnalytics;
