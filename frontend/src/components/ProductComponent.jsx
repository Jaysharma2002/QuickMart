import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ProductComponent.css'
function ProductComponent({data,productId,setProductInCart,setProducts,setAddedtocart,addedToCart})
{
    const navigate=useNavigate()
    const [currProduct,setCurrProduct]=useState(null)
    const [imageIndex,setImageIndex]=useState(0)
    const [reviewIndex, setReviewIndex] = useState(0);

    const averageRating=currProduct?.reviews?.reduce((a,b)=>a+b.rating, 0)/currProduct?.reviews.length

    useEffect(()=>{
        window.scrollTo(0,0)
    },[])

    useEffect(()=>{
        if(!productId)
        {
            navigate('/home')
        }
        else{
            setCurrProduct(data.find((product)=>product._id===productId))
            setImageIndex(0)
            setReviewIndex(0);
        }
    },[data,productId])
    
    function addtocart(e){
        setProducts(prevproducts=>{
            const isProductIn=prevproducts.some(product=>product._id===e._id)
            if(!isProductIn){
                setAddedtocart(addedToCart+1)
                return [...prevproducts,e];
            }
            else{
                setProductInCart(true)
            }
            return prevproducts;
        })
    }
    const prevReview = () => {
        setReviewIndex(prev => Math.max(prev - 5, 0));
    };

    const nextReview = () => {
        setReviewIndex(prev =>
            Math.min(prev + 5, currProduct.reviews.length - 5));
    };

 return(
    <div className="ProductComponent">
            <div className="product" key={currProduct?._id}>
                <div className="productimages">
                    <img src={currProduct?.images[imageIndex]}></img>
                </div>
                <div className="productdetails">
                    <p>{currProduct?.title}</p>
                    <p className="description">{currProduct?.description}</p>
                    <div className="rating-buttons">{[1,2,3,4,5].map(num => (
                                                    <i key={num} className="fa-solid fa-star" style={{ color: (averageRating || 0)>= num ? '#16be47' : '#e5e4e4' }}></i>
                    ))}</div>
                    <p>₹{currProduct?.price}</p>
                    <div className="image-array-contanier">
                        {currProduct?.images?.map((e,i)=>(<img key={i} src={e} className="img-element" onClick={()=>setImageIndex(i)}/>))}
                    </div>
                    <button className="add" onClick={()=>addtocart(currProduct)}><i className="fa-solid fa-cart-plus"> Add to Cart</i></button>
                </div>
            </div>
            <div className="customer-reviews-container">
                {currProduct?.reviews?.length ? (
                    <div className="reviews-carousel">
                    <button onClick={prevReview} className="rev-prev" aria-label="Previous reviews" disabled={reviewIndex === 0}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <div className="reviews-list">
                        <h2 className="reviews-title">Customer Reviews</h2>
                        {currProduct.reviews
                        .slice(reviewIndex, reviewIndex + 5)
                        .map((r, i) => {
                            const name = r?.user_id?.name || "Anonymous";
                            const rating = r?.rating || 0;
                            const initials = name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();

                            return (
                            <article
                                className="review-card"
                                key={r._id || `review-${reviewIndex + i}`}
                            >
                                <div className="reviewer">
                                    <p className="avatar">{initials}</p>
                                    <p className="name">{name}</p>
                                </div>
                                <div className="meta">
                                    <div className="stars">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <i key={`star-${n}`} className="fa-solid fa-star" style={{ color: rating >= n ? "#16be47" : "#e5e4e4" }}
                                        />
                                    ))}
                                    </div>
                                </div>
                                <p className="comment">{r?.comment || "No comment provided."}</p>
                            </article>
                            );
                        })}
                    </div>

                    <button
                        onClick={nextReview}
                        className="rev-next"
                        aria-label="Next reviews"
                        disabled={reviewIndex + 5 >= currProduct.reviews.length}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                    </div>
                ) : (
                    <div className="no-reviews-card">
                    <div className="no-reviews-icon">
                        <i className="fa-regular fa-message"></i>
                    </div>
                    <p className="no-reviews-title">No customer reviews yet</p>
                    <p className="no-reviews-sub">Be the first to share your experience.</p>
                    </div>
                )}
                </div>
            </div> 
        )}

export default ProductComponent