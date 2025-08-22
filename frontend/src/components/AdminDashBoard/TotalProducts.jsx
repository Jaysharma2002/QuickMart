import React,{useEffect,useState} from "react"
import axios from "axios"
import "../../styles/TotalProducts.css"
import { useNavigate } from "react-router-dom"
import {useloader} from '../../context/ContextLoader.jsx'
function TotalProducts({setOutOfStock,outOfStock}){

    const navigate=useNavigate()
    const [productCount,setProductCount]=useState(0)
    const { startloading, stoploading } = useloader(); 

    const fetch=async()=>{
        startloading();
      try {
        const res = await axios.get("https://quickmartproject-backend.onrender.com/api/product/productcount");
        setProductCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch sales analytics:", err);
      } finally {
        stoploading();
      }
    }

    useEffect(()=>{
        fetch()
    },[])

    function navigateProduct(){
        navigate('/admin/product')
    }

    return (
        <div className="count-card" onClick={()=>{navigateProduct();outOfStock==true?setOutOfStock(false):[]}} style={{cursor:'pointer'}}>
            <div className="groupeditems">
                <div className="coupled">
                    <h1>{productCount}</h1>
                    <button className="product-btn"><i className="fa-solid fa-box-open"></i></button>
                </div>
                <p>Total Products</p>
            </div>
        </div>
    )
}

export default TotalProducts