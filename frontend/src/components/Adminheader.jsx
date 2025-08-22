import React from "react";
import { useNavigate,useLocation } from "react-router-dom";
import '../styles/Adminheader.css'
function Adminheader({setSelectedCategory,searchProduct,setSearchProduct,setSidePanel,sidePanel,setOutOfStock,outOfStock,setTodayOrder,todayOrder}){
    const navigate=useNavigate()
    const location=useLocation()
    function logout(){
        navigate("/")
    }
    function navigateOrder(){
        if(outOfStock){setOutOfStock(false)}
        if(todayOrder){setTodayOrder(false)}
        navigate("/admin/order")
    }
    function navigateAdmin(){
        if(outOfStock){setOutOfStock(false)}
        if(todayOrder){setTodayOrder(false)}
        navigate("/admin/dashboard")
    }
    function navigateProduct()
    {
        if(outOfStock){setOutOfStock(false)}
        if(todayOrder){setTodayOrder(false)}
        navigate('/admin/product')
    }
    if(location.pathname==="/viewprofile" ||location.pathname==="/productcomponent" || location.pathname==="/home" || location.pathname === "/" || location.pathname==="/cart" || location.pathname==="/Payment" || location.pathname==="/thankyou" || location.pathname==='/register' || location.pathname==='/order')
    {
        return null;
    }
    return(
        <div className="adminheader">
            <div className="headtitle">
                <button onClick={()=>setSidePanel(!sidePanel)}><i className="fa-solid fa-list"></i></button>
                <input type="text" placeholder="Search Products.." value={searchProduct} onChange={(e) => {setSearchProduct(e.target.value);navigate("/admin/product")}}/>
            </div>
            
            <div className="admin-header-buttons">
                <button onClick={()=>{setSelectedCategory("All");navigateAdmin();}}><i className="fa-solid fa-house"></i><span>HOME</span></button>
                <button onClick={navigateProduct}><i className="fa-solid fa-clipboard"></i><span>PRODUCT</span></button>
                <button onClick={navigateOrder}><i className="fa-solid fa-clipboard"></i><span>ORDER</span></button>
            </div>
            
            <div className="logout-btn-container">
                <button onClick={logout}><i className="fa-solid fa-right-from-bracket"></i><span>LOGOUT</span></button>
            </div>
        </div>
    )

}

export default Adminheader