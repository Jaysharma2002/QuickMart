import React,{useEffect,useState} from "react"
import axios from "axios"
import {useloader} from '../../context/ContextLoader.jsx'
import { useNavigate} from "react-router-dom"
import "../../styles/OutofStock.css"
function OutOfStock({setOutOfStock,outOfStock}){

    const [outofStockCount,setOutofStockCount]=useState(0)
    const { startloading, stoploading } = useloader();
    const navigate=useNavigate() 

    const fetch=async()=>{
        startloading();
      try {
        const res = await axios.get("http://localhost:8000/api/product/outofstockcount");
        setOutofStockCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err);
      } finally {
        stoploading();
      }
    }

    useEffect(()=>{
        fetch()
    },[])

    return (
        <div className="outofstock-count-card" onClick={()=>{setOutOfStock(true);navigate('/admin/product')}} style={{cursor:'pointer'}}>
            <div className="groupeditems">
                <div className="coupled">
                    <h1>{outofStockCount}</h1>
                    <button><i className="fa-solid fa-triangle-exclamation"></i></button>
                </div>
                <p>Out of Stock Products</p>
            </div>
        </div>
    )
}

export default OutOfStock