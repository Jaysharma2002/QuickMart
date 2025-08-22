import React,{useState,useEffect} from "react";
import axios from "axios";
import '../styles/UserProfile.css'
import blankprofile from  '../assets/blank-profile.png'
import { useloader } from "../context/ContextLoader";
import UniversalLoader from "./UniversalLoader";
function UserProfile({setProfileUpdate})
{
    const [editData,setEditData]=useState({
        profileimage:'',
        name:'',
        email:'',
        address:'',
        phone:'',
        gender:'',
        age:''
    })
    const [selectedImage,setSelectedImage]=useState(null)
    const {startloading,stoploading}=useloader()
    const {isLoading}=useloader()

    useEffect(()=>{
        const fetch=async()=>{
          try{
            startloading()
            const response=await axios.post("https://quickmartproject-backend.onrender.com/api/product/userprofile",{},{withCredentials:true})
            setEditData({
                profileimage:response.data.profileimage || '',
                name:response.data.name || '',
                email:response.data.email || '',
                address:response.data.address || '',
                phone:response.data.phone || '',
                gender:response.data.gender || '',
                age:response.data.age || ''
            })
          }
          finally{
            stoploading()
          } 
        }
        fetch()
        window.scrollTo(0,0)
    },[])

    function InputHandler(e){
        const {name,value}=e.target
        setEditData((prevState)=>({
            ...prevState,
            [name]:value,
        }))
    }
    const submit=async()=>{
        const formdata=new FormData()
        if(selectedImage){
            formdata.append("profileimage",selectedImage)
        }
        formdata.append("name",editData.name)
        formdata.append("email",editData.email)
        formdata.append("address",editData.address)
        formdata.append("phone",editData.phone)
        formdata.append("gender",editData.gender)
        formdata.append("age",editData.age)
        const response=await axios.post("https://quickmartproject-backend.onrender.com/api/product/updateprofile",formdata,{withCredentials:true,headers:{"Content-Type":"multipart/form-data"}})
        setEditData({
            profileimage:response.data.profileimage || '',
            name:response.data.name || '',
            email:response.data.email || '',
            address:response.data.address || '',
            phone:response.data.phone || '',
            gender:response.data.gender || '',
            age:response.data.age || ''
        })
        setProfileUpdate(true)
    }
    return(
    <>
    {isLoading && <UniversalLoader active={isLoading} variant="overlay" message="Fetching Products.." blur={6}/>}
    <div className="profile-wrap">
      <form
        className="profile-card"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {/* LEFT: avatar + basic info */}
        <aside className="profile-left">
          <div className="avatar-wrap">
            <div className="avatar-ring" aria-hidden>
              {editData?.profileimage ? (
                <img src={editData.profileimage} alt="Profile" className="avatar-img"/>
              ):(
                <img src={blankprofile} alt="Default avatar" className="avatar-img" />
              )}
            </div>

            <h2 className="user-name">{editData?.name || "Your name"}</h2>
            <p className="user-email">{editData?.email || "you@example.com"}</p>
          </div>
        </aside>

        <section className="profile-right">
          <h3 className="section-title">Account details</h3>
          <div className="fields-grid">
            <div className="field">
              <label>Name</label>
              <input type="text" name="name" value={editData.name || ""} onChange={InputHandler} placeholder="Full name"/>
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" name="email" value={editData.email || ""} onChange={InputHandler} placeholder="email@example.com"/>
            </div>

            <div className="field">
              <label>Phone</label>
              <input type="tel" name="phone" value={editData.phone || ""} onChange={InputHandler} placeholder="+91 98765 43210"/>
            </div>

            <div className="field">
              <label>Gender</label>
              <input type="text" name="gender" value={editData.gender || ""} onChange={InputHandler} placeholder="Male / Female / Other"/>
            </div>

            <div className="field full">
              <label>Address</label>
              <input type="text" name="address" value={editData.address || ""} onChange={InputHandler} placeholder="Street, City, State, ZIP"/>
            </div>

            <div className="field">
              <label>Age</label>
              <input type="number" name="age" value={editData.age || ""} onChange={InputHandler} min="0" placeholder="e.g. 28"/>
            </div>
          </div>

          <div className="actions">
            <button type="submit" className="btn primary">Save changes</button>
          </div>
        </section>
        </form>
      </div>
    </>
    )
}

export default UserProfile