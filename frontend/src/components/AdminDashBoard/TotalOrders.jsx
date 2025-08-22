import React,{useEffect,useState} from "react"
import axios from "axios"
import "../../styles/TotalOrders.css"
import { useNavigate } from "react-router-dom"
import {useloader} from '../../context/ContextLoader.jsx'
function TotalOrders({setTodayOrder,todayOrder}){

    const navigate=useNavigate()
    const [orderCount,setOrderCount]=useState(0)
    const { startloading, stoploading } = useloader(); 

    const fetch=async()=>{
         startloading();
      try {
        const res = await axios.get("https://quickmartproject-backend.onrender.com/api/product/ordercount");
        setOrderCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err);
      } finally {
        stoploading();
      }
    }

    useEffect(()=>{
        fetch()
    },[])

    function navigateOrder(){
        navigate('/admin/order')
    }

    return (
        <div className="order-count-card" onClick={()=>{navigateOrder();todayOrder==true?setTodayOrder(false):setTodayOrder(true)}} style={{cursor:'pointer'}} >
            <div className="groupeditems">
                <div className="coupled">
                    <h1>{orderCount}</h1>
                    <button className="product-btn" ><i className="fa-solid fa-clipboard"></i></button>
                </div>
                <p>Orders Placed Today</p>
            </div>
        </div>
    )
}

export default TotalOrders