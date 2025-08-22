import React,{useEffect,useState} from "react";
import axios from 'axios'
import '../styles/Order.css'
import { useloader } from "../context/ContextLoader";
import UniversalLoader from "./UniversalLoader";
function Order(){
    const [orders,setOrder]=useState([])
    const [filteredOrders,setFilteredOrders]=useState([])
    const [option,setOption]=useState("")
    const [date,setDate]=useState(null)
    const [ratings,setRatings]=useState({})
    const [comments,setComments]=useState({})
    const [reviewSaved,setReviewSaved]=useState(false)
    const {startloading,stoploading}=useloader()
    const {isLoading}=useloader()
    useEffect(()=>{
        const fetch=async()=>{
            try{
                startloading()
            const response=await axios.get('https://quickmartproject-backend.onrender.com/api/product/getuserorder',{withCredentials:true})
            setFilteredOrders(response.data)
            setOrder(response.data)
            const initialRatings = {};
            const initialComments = {};

            response.data.forEach(order => {
                const review = order.items?.product?.reviews?.find(r => r.user_id === order.userId);
                if (review) {
                    initialRatings[order.items.product._id] = review.rating;
                    initialComments[order.items.product._id] = review.comment;
                }
            });
            setRatings(initialRatings);
            setComments(initialComments);         
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
        if(reviewSaved)
        {
            setTimeout(()=>{
                setReviewSaved(false)
            },2000)
        }
    },[reviewSaved])

    const cancelOrder=async(id)=>{
       const orderid=id
       const response=await axios.put("https://quickmartproject-backend.onrender.com/api/product/cancelorder",{id:orderid})
       setFilteredOrders((prevOrder)=>
        prevOrder.map((order)=>
        response.data.find((updateorder)=>updateorder._id===order._id) || order
        ))
        setOrder((prevOrder)=>
        prevOrder.map((order)=>
        response.data.find((updateorder)=>updateorder._id===order._id) || order
        ))
    } 

    const saveRating=async(orderId,productId,rating)=>{
        try {
            await axios.put("https://quickmartproject-backend.onrender.com/api/product/saverating", { productId, rating, orderId }, { withCredentials: true });
            setRatings(prevRatings => ({ ...prevRatings, [productId._id]:rating }));
            setReviewSaved(true)
        } catch (error) {
            console.error("Error saving rating:", error);
        }
    }

    const saveComment=async(productId,orderId)=>{
        try{
            const comment=comments[orderId]
            await axios.put("https://quickmartproject-backend.onrender.com/api/product/savecomment",{productId,comment,orderId},{withCredentials:true});
            setComments(prevComments => ({ ...prevComments, [productId]:comment}))
            setReviewSaved(true)

        }
        catch(error)
        {
            console.error("Error saving rating:", error);
        }

    }

    return(
        <>
        {isLoading && <UniversalLoader active={isLoading} variant="overlay" message="Fetching Products.." blur={6}/>}
        <div className="OrderComponent" style={{position:'relative',paddingTop:'50px'}}>
            <div className="order">
                <div className="Adminorder">
                    <button onClick={()=>{setFilteredOrders(orders);setDate(null);setOption("");}} className="showorder">Show&nbsp;All</button>
                    <div className="datecontainer">
                        <label  className="order-label">Date</label>
                        <input type="date"  onChange={(e)=>setDate(e.target.value)} className="dateinput"></input>
                    </div>
                    <div className="statuscontainer">
                        <select onChange={(e)=>setOption(e.target.value)} className="select-status">
                            <option value="" className="option">All</option>
                            <option value="Placed" className="option">Placed</option>
                            <option value="Dispatched" className="option">Dispatched</option>
                            <option vlaue="Delivered" className="option">Delivered</option>
                            <option value="Failed" className="option">Failed</option>
                            <option value="Cancelled" className="option">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="containerallorder">
            <div className="AllOrder">
            {filteredOrders.length>0?filteredOrders.map((order) =>
                <div className="cardorder" key={order._id}>
                        <div className="orderdetail">
                            <div className="orderstatuscontainer">
                                <p style={{color:order.orderStatus==="Placed"||order.orderStatus==="Dispatched" || order.orderStatus==="Delivered"?'green':'red'}} className="order-staus-title">{order.orderStatus} on <span className="order-date-title">{order.orderDate.slice(0, 10).split("-").reverse().join("-")}</span></p>
                                {order.orderStatus==="Dispatched" || order.orderStatus==="Placed"?(<button onClick={()=>cancelOrder(order._id)} className="cancelbutton">Cancel Order</button>):(<></>)}
                            </div>
                        </div>
                        <div className="innercontainer">
                            <img src={order.items.images[0]} className='productimage' alt={order.items.title}/>
                            <div className="order-productdetails">
                                <span>{order.items.title}</span>
                                <span>Quantity: {order.items.quantity}</span>
                                <span>Price: ₹{order.items.price}</span>
                            </div>
                        </div>
                        {order.orderStatus==="Delivered"?(<div className="rating">
                            <div className="inner-rating-container">
                                        <div className="rating-buttons">{[1, 2, 3, 4, 5].map(num => (
                                                <button key={num} style={{ color: ratings[order.items.product._id || 0]>= num ? '#16be47' : '#e5e4e4' }} className="rating-btn" onClick={() => saveRating(order._id,order.items.product, num)}>
                                                    <i className="fa-solid fa-star"></i>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                            <div className="user-review-container">
                                <input type="text" value={comments[order.items.product._id || '']} onChange={(e) => setComments(prev => ({ ...prev, [order._id]: e.target.value }))} placeholder="Review This Product..."/>
                                <button className="user-review-save-btn" onClick={()=>saveComment(order.items.product,order._id)}><i className="fa-regular fa-paper-plane"></i></button>
                            </div>
                        </div>):null}
                </div>
                ): <p>No Orders Yet</p>}
            </div>
            </div>
            {reviewSaved?(
                <p className="review-saved-message">Thanks For The Rating!</p>
            ):null}
        </div>
        </>
    )
}

export default Order