import React,{useEffect,useState} from "react";
import axios from 'axios'
import '../styles/AdminOrder.css'
import { useloader } from "../context/ContextLoader";
import UniversalLoader from "./UniversalLoader";
function AdminOrder({todayOrder}){
    const [orders,setOrder]=useState([])
    const [filteredOrders,setFilteredOrders]=useState([])
    const [option,setOption]=useState()
    const [changeOption,setChangeOption]=useState()
    const [date,setDate]=useState()
    const [selectedOrders,setSelectedOrders]=useState([])
    const [updateButton,setUpdateButton]=useState(false)
    const {startloading,stoploading}=useloader()
    const {isLoading}=useloader()

    useEffect(()=>{
        const fetch=async()=>{
            try{
                startloading()
                const response=await axios.get('http://localhost:8000/api/product/getorder')
                setFilteredOrders(response.data)
                setOrder(response.data)  
            }
            finally{
                stoploading()
            }      
        }
        fetch();
        
    },[])

    useEffect(()=>{
        if(date || option)
        {
            const filteredorders=orders.filter((order)=>{
                const filteredbydate=date?(order.orderDate).slice(0,10)===date : true
                const filteredbyoptions=option?order.orderStatus===option : true
                return filteredbydate && filteredbyoptions
            })
            setFilteredOrders(filteredorders)   
        }
        else{
            setFilteredOrders(orders)
        }
    },
    [date,orders,option])

    useEffect(()=>{
        if(selectedOrders && updateButton)
        {
            const fetch=async()=>{
                const response=await axios.put('http://localhost:8000/api/product/updatestatus',{selectedOrders:selectedOrders,changeOption:{orderStatus:changeOption}})
                setFilteredOrders((prevOrders)=>
                    prevOrders.map((order)=>
                        response.data.find((updateOrder)=>updateOrder._id===order._id) || order
                    )
                )
                setOrder((prevOrders)=>
                    prevOrders.map((order)=>
                        response.data.find((updateOrder)=>updateOrder._id===order._id) || order
                    )
                )
                setSelectedOrders([])
            }
            fetch()
        }
        setUpdateButton(false)
    },[changeOption,selectedOrders,updateButton])

    useEffect(()=>{
        if(todayOrder && orders){
            const date = new Date().toISOString().split("T")[0];
            const filteredorders=orders.filter((order)=>(order.orderDate).slice(0,10)===date)
            setFilteredOrders(filteredorders)
        } 
        else {
            setFilteredOrders(orders)
        }
    },[todayOrder,orders])

    function SelectionHandler(id) {
        setSelectedOrders((prevState)=>
            prevState.includes(id)?
                prevState.filter((orderId)=>orderId!==id)
                :[...prevState,id]
        )
      }
    return(
        <>
        {isLoading && <UniversalLoader active={isLoading} variant="overlay" message="Fetching Orders.." blur={6}/>}
        <div className="TableOrder">
            <div className="order">
                <div className="Adminorder">
                    <button onClick={()=>{setFilteredOrders(orders);setDate();setOption();}} className="showallbutton">Show All</button>
                    <div className="datecontainer">
                        <label className="order-label">Select Date:</label>
                        <input type="date"  onChange={(e)=>setDate(e.target.value)} className="dateinput"></input>
                    </div>
                    <div className="statuscontainer">
                        <label className="order-label">Select Status:</label>
                        <select onChange={(e)=>setOption(e.target.value)} className="newoption">
                        <option value="Placed" className="option">Placed</option>
                            <option value="Dispatched" className="option">Dispatched</option>
                            <option vlaue="Delivered" className="option">Delivered</option>
                            <option value="Failed" className="option">Failed</option>
                            <option value="Cancelled" className="option">Cancelled</option>
                        </select>
                    </div>
                    <div className="updatestatuscontainer">
                        <button onClick={()=>setUpdateButton(true)} className="updatebutton">Update</button>
                        <select onChange={(e)=>setChangeOption(e.target.value)} className="newoption">
                            <option value="Dispatched" className="option">Dispatched</option>
                            <option vlaue="Delivered" className="option">Delivered</option>
                            <option value="Failed" className="option">Failed</option>
                        </select>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>UserName</th>
                        <th>UserEmail</th>
                        <th>Product Title</th>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>PaymentStatus</th>
                        <th>OrderDate</th>
                        <th>OrderStatus</th>
                    </tr>
                </thead>
                <tbody>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((item) => (
                    <tr key={item._id}>
                        <td><input type="checkbox" checked={selectedOrders.includes(item._id)} onChange={() => SelectionHandler(item._id)}/></td>
                        <td>{item.userName}</td>
                        <td>{item.userEmail}</td>
                        <td>{item.items.title}</td>
                        <td className="nopadding"><img src={item.items.images[0]} alt="product" /></td>
                        <td>{item.items.quantity}</td>
                        <td>{item.items.price}</td>
                        <td>{item.paymentStatus}</td>
                        <td>{item.orderDate.slice(0, 10)}</td>
                        <td>{item.orderStatus}</td>
                    </tr>
                    ))):(<tr>
                        <td colSpan={10}>No Data Available</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
        </>
    )
}

export default AdminOrder