import React,{useState,useEffect} from "react"
import axios from "axios"
import { ResponsiveContainer,PieChart,Tooltip,Pie,Cell } from "recharts"
import "../../styles/SalesCategory.css"
import {useloader} from '../../context/ContextLoader.jsx'
function SalesCategory(){

    const [data,setData]=useState([])
    const { startloading, stoploading } = useloader(); 

    const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28",
    "#A28FD0", "#FF6B6B", "#4DD0E1", "#9575CD", "#AED581", "#F06292",
    "#BA68C8", "#4DB6AC", "#7986CB", "#E57373", "#FFD54F", "#81C784"
    ];

    const fetch=async()=>{
        startloading();
      try {
        const res = await axios.get("http://localhost:8000/api/product/salesbycategory");
        setData(res.data.result);
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err);
      } finally {
        stoploading();
      }
    }

    useEffect(()=>{
        fetch()
    },[])

    if (!data) return <div>Loading...</div>;

    return(
        <div className="salescategorydiv">
            <h2>Sales By Category</h2>
            <ResponsiveContainer width="100%" height={280} >
                <PieChart>
                    <Pie
                    dataKey="price"
                    nameKey="category"
                    data={data}
                    label={({category})=>category}
                    outerRadius={100}
                    >
                    {data.map((entry,index)=>(
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )

}

export default SalesCategory