import React,{useState,useEffect} from "react"
import axios from "axios"
import { ResponsiveContainer,PieChart,Tooltip,Pie,Cell,Legend} from "recharts"
import "../../styles/OrderStatus.css"
import {useloader} from '../../context/ContextLoader.jsx'
function OrderStatus(){

    const [data,setData]=useState([])
    const { startloading, stoploading } = useloader(); 

    const STATUS_COLORS = {
        Delivered: "#60da8fff",   // green
        Placed: "#736edeff",      // blue
        Cancelled: "#fa6419ff",   // orange
        Dispatched: "#ffc658",    // yellow
        Failed: "#fe5050ff"       // red
    };

    const fetch=async()=>{
        startloading();
      try {
        const res = await axios.get("http://localhost:8000/api/product/deliverystatus");
        setData(res.data.result);
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err);
      } finally {
        stoploading();
      }
    }

     const customLegend = data.map((entry, index) => ({
        value: entry.status,
        type: "square",
        color: STATUS_COLORS[entry.status] || "#8884d8",
    }));

    useEffect(()=>{
        fetch()
    },[])

    if (!data) return <div>Loading...</div>;

    return(
        <div className="orderstatusdiv">
            <h2>Order Status</h2>
            <ResponsiveContainer width="100%" height={280} >
                <PieChart>
                    <Pie
                    dataKey="count"
                    nameKey="status"
                    data={data}
                    label={({status})=>status}
                    outerRadius={100}
                    >
                    {data.map((entry,index)=>(
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#8884d8"}/>
                    ))}
                    </Pie>
                    <Tooltip/>
                    <Legend payload={customLegend} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )

}

export default OrderStatus