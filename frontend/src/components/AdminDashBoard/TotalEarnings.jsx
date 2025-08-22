import React,{useEffect,useState} from "react"
import axios from "axios"
import "../../styles/TotalEarnings.css"
import {useloader} from '../../context/ContextLoader.jsx'
function TotalEarnings(){

    const [totalEarning,setTotalEarning]=useState(0)
    const { startloading, stoploading } = useloader(); 

    const fetch=async()=>{
        startloading();
      try {
        const res=await axios.get("https://quickmartproject-backend.onrender.com/api/product/totalearning")
        setTotalEarning(res.data.total)
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
        <div className="total-earning-card">
            <div className="groupeditems">
                <div className="coupled">
                    <h1>{totalEarning}</h1>
                    <button><i className="fa-solid fa-indian-rupee-sign"></i></button>
                </div>
                <p>Total Earning</p>
            </div>
        </div>
    )
}

export default TotalEarnings