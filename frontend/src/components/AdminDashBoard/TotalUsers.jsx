import React,{useEffect,useState} from "react"
import axios from "axios"
import "../../styles/TotalUsers.css"
import {useloader} from '../../context/ContextLoader.jsx'
function TotalUsers(){

    const [userCount,setUserCount]=useState(0)
    const { startloading, stoploading } = useloader(); 

    const fetch=async()=>{
        startloading();
      try {
        const res=await axios.get("https://quickmartproject-backend.onrender.com/api/product/usercount")
        setUserCount(res.data.count)
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
        <div className="usercount-card">
            <div className="groupeditems">
                <div className="coupled">
                    <h1>{userCount}</h1>
                    <button><i className="fa-solid fa-user"></i></button>
                </div>
                <p>Total Users</p>
            </div>
        </div>
    )
}

export default TotalUsers