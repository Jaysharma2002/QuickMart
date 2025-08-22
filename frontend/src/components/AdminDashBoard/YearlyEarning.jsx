import React,{useEffect,useState} from "react"
import axios from "axios"
import "../../styles/YearlyEarning.css"
import {useloader} from '../../context/ContextLoader.jsx'
function YearlyEarning(){

    const [yearlyEarning,setYearlyEarning]=useState(0)
    const { startloading, stoploading } = useloader(); 

    const fetch=async()=>{
        startloading();
      try {
        const res=await axios.get("http://localhost:8000/api/product/yearlyearning")
        setYearlyEarning(res.data.total)
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
        <div className="yearly-earning-card">
            <div className="groupeditems">
                <div className="coupled">
                    <h1>{yearlyEarning}</h1>
                    <button className="yearly-earning-btn" ><i className="fa-solid fa-indian-rupee-sign"></i></button>
                </div>
                <p>Yearly Earning</p>
            </div>
        </div>
    )
}

export default YearlyEarning
