import React, { useEffect, useState } from "react";
import axios from "axios";
import {ResponsiveContainer,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,} from "recharts";
import '../../styles/UserGrowth.css'
import {useloader} from '../../context/ContextLoader.jsx'
const UserGrowth = () => {
  const [data, setData] = useState([]);
  const { startloading, stoploading } = useloader(); 

  useEffect(() => {
    const fetchData = async () => {
      startloading();
      try {
        const res = await axios.get("https://quickmartproject-backend.onrender.com/api/product/usergrowthbymonth");
      setData(res.data.result);
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err);
      } finally {
        stoploading();
      }
    };
    fetchData();
  }, []);

  return (
    <div className="monthly-user-growth">
        <div className="pie-header">
            <h2>New Users This Month</h2>
        </div>
      <ResponsiveContainer width="95%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(str) => new Date(str).getDate()} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowth;
