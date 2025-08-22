import React,{useEffect,useState} from 'react';
import '../styles/cart.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart({ product,setProducts,setAddedtocart,addedToCart}) {
    const navigate = useNavigate();
    const [emptyMessage,setEmptyMessage]=useState(false)
    const [totalprice, setTotalprice] = React.useState(0);
    const [editData,setEditData]=useState({
        address:'',
        phone:''
    })
    function shop() {
        navigate("/home");
    }
    
    function Onclickremove(id)
    {
        setProducts(products=>{return products.filter(product=>product._id!==id)})
        setAddedtocart(addedToCart-1)
    }

    function Totalprice(){
        return product.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    }
    useEffect(()=>{
        window.scrollTo(0,0)
        const fetch=async()=>{
            const response=await axios.post("http://localhost:8000/api/product/getaddress",{},{withCredentials:true})
            setEditData({
                address:response.data.address || '',
                phone:response.data.phone || ''
            })
        }
        fetch()
    },[])
    useEffect(()=>{
        const total=Totalprice();
        if(setTotalprice){
            setTotalprice(total)
        }
    },[product,setTotalprice])
    
    function InputHandler(e){
        const {name,value}=e.target
        setEditData((prevState)=>({
            ...prevState,
            [name]:value
        }))
    }

    const submit=async()=>{
        const response=await axios.put("http://localhost:8000/api/product/updateaddress",editData,{withCredentials:true})
        setEditData({
            address:response.data.address,
            phone:response.data.phone
        })
    }

    const onAddQuantity=(e)=>{
        setProducts((prevState)=>
            prevState.map((item)=>item._id===e._id?{...item,quantity:item.quantity+1}:item)
        )
    }

    const onRemoveQuanity=(e)=>{
        setProducts((prevState)=>
            prevState.map((item)=>item._id===e._id && item.quantity>1?{...item,quantity:item.quantity-1}:item)
        )
    }

    const Payment=async()=>{
        
        if(editData.address!=='' && editData.phone!==''){
        const response = await fetch('http://localhost:8000/api/product/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount:totalprice*100, currency: 'INR', receipt: 'receipt#1', notes: {} })
          });
          const order = await response.json();

      // Open Razorpay Checkout
      const options = {
        key: 'rzp_test_fx1IQ3ysrz5vZE',
        amount: totalprice*100, // 50000 refers to 50000 paise
        currency: 'INR',
        name: 'QuickMart',
        description: 'Test Transaction',
        order_id: order.id, // This is the order_id created in the backend
        prefill: {
          name: 'Jay Sharma',
          email: 'jaysharmadec2002@gmail.com',
          contact: '7720964387'
        },
        theme: {
          color: '#7055B5'
        },
        handler:async function(){
            try{
                navigate("/home")
                axios.post('http://localhost:8000/api/product/order',{products:product},{withCredentials:true})
                setProducts([])
                setAddedtocart(0)
            }
            catch (error) {
                console.error('Error sending products to the server:', error);
            }
        },
        config: {
            display: {
              blocks: {
                banks: {
                  name: 'All Payment Options',
                  instruments: [
                    {
                      method: 'upi'
                    },
                    {
                      method: 'card'
                    },
                    {
                        method: 'wallet'
                    },
                    {
                        method: 'netbanking'
                    }
                  ],
                },
              },
              sequence: ['block.banks'],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
        }
      const rzp = new Razorpay(options);
      rzp.open();}
      else{
        setEmptyMessage(true)
        setTimeout(()=>{
            setEmptyMessage(false)
        },3000)
      }
    }

    return (
        <div className="cart-page">
      {Array.isArray(product) && product.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-card">
            <div className="empty-icon" aria-hidden>
              <i className="fa-solid fa-cart-shopping"></i>
            </div>

            <h2 className="empty-title">Your Cart Is Empty</h2>
            <p className="empty-sub">
              Looks like you haven’t added anything yet. Explore products and come back!
            </p>

            <button className="btn-gradient" onClick={shop} aria-label="Continue shopping">
              <i className="fa-solid fa-bag-shopping" />
              <span> Continue Shopping</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-shell">
          <div className="cart-header">
            <h1 className="cart-title">YOUR CART ({product.length})</h1>
          </div>

          <section className="cart-items" aria-labelledby="cart-items-heading">
            <h2 id="cart-items-heading" className="visually-hidden">Cart items</h2>

            {product.map((e) => (
              <article key={e._id} className="cart-item" role="group" aria-label={e.title}>
                <div className="item-img">
                  <img src={e.images?.[0]} alt={e.title} loading="lazy" />
                </div>

                <div className="item-info">
                  <h3 className="item-title">{e.title}</h3>
                  <div className="item-meta">₹{e.price} • {e.category}</div>
                  <div className="item-tags">
                    {e.sizes?.[0]?.quantity > 0 ? (
                      <span className="item-tag">In stock</span>
                    ) : (
                      <span className="item-tag out">Out of stock</span>
                    )}
                  </div>
                </div>

                <div className="item-qty" aria-label="Quantity control">
                  <div className="qty">
                    <button aria-label={`Increase quantity for ${e.title}`} onClick={(ev) => { ev.stopPropagation(); onAddQuantity(e); }}>+</button>
                    <input type="number" min="1" value={e.quantity ?? 1} readOnly aria-live="polite"/>
                    <button aria-label={`Decrease quantity for ${e.title}`} onClick={(ev) => { ev.stopPropagation(); onRemoveQuanity(e); }}>−</button>
                  </div>
                </div>

                <div className="item-price">
                  <div className="now">₹{(e.price * (e.quantity ?? 1)).toFixed(0)}</div>
                  {e.originalPrice && <div className="old">₹{e.originalPrice}</div>}
                </div>

                <div className="item-remove">
                  <button onClick={(ev) => { ev.stopPropagation(); Onclickremove && Onclickremove(e._id); }} aria-label={`Remove ${e.title}`}>
                    <i className="fa-regular fa-circle-xmark"></i>
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="summary-card" aria-labelledby="summary-title">
            <h3 id="summary-title" className="summary-title">Shipping Details</h3>

            <div className="coupon">
              <div style={{width: "100%"}}>
                <label className="sr-only" htmlFor="address">Address</label>
                <input id="address" placeholder="Address.." name="address" value={editData.address || ""} onChange={InputHandler} />
              </div>
            </div>

            <div className="inputgroup">
              <label>Phone</label>
              <input type="text" name="phone" placeholder='Phone No..' value={editData.phone || ""} onChange={InputHandler} />
            </div>

            <button onClick={submit} className="shipping-btn">Save details</button>

            <div className="totals" aria-hidden>
              <div className="row"><span>Subtotal</span><span>₹{Totalprice().toFixed(0)}</span></div>
              <div className="row"><span>Shipping</span><span>Free</span></div>
              <div className="row total"><span>Total</span><span>₹{Totalprice().toFixed(0)}</span></div>
            </div>

            <button onClick={Payment} className="checkout-btn">Proceed to Checkout</button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
