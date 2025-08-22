import React,{useEffect,useState} from 'react'
import '../styles/beauty.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import beautytemplate from '../assets/beauty-template.png'
import fashiontemplate from '../assets/fashion-template.png'
import smartphonestemplate from '../assets/smartphones-template.png'
import furnituretemplate from '../assets/furniture-template.png'
import UniversalLoader from './UniversalLoader'

function Beauty({selectedcategory,setProducts,searchedProduct,setAddedtocart,addedToCart,setProductInCart,setData,data,setProductId}){
    
    const [isImage,setIsImage]=useState(true)
    const images = [beautytemplate, fashiontemplate,smartphonestemplate,furnituretemplate];
    const [curr, setCurr] = useState(0);
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

    useEffect(() => {
        const debounce=setTimeout(()=>{
            const fetch=async()=>{
                setLoading(true)
            await axios.get("http://localhost:8000/api/product/fetch").then((response) => {
                const products=response.data
                const filteredItems =products.filter((item)=>{
                    const categoryfiltereditem=selectedcategory?.toLowerCase()==="all" || item.category.toLowerCase()===selectedcategory.toLowerCase()
                    const searchfiltereditems=searchedProduct?.toLowerCase()==="" || item.title.toLowerCase().includes(searchedProduct.toLowerCase())
                    return categoryfiltereditem && searchfiltereditems
                })
                if(filteredItems.length===0){
                    setData([]);
                    setLoading(false)
                }
                else{
                    setData(filteredItems);
                    setLoading(false)
                }
                
            });
        }
        fetch();
        },[300])
         
        return()=>clearTimeout(debounce)
    }, [selectedcategory,searchedProduct]);

    useEffect(()=>{
            if(selectedcategory!=="All" || searchedProduct!=="")
            {
                setIsImage(false)
            }
            else{
                setIsImage(true)
            }
            
        },[selectedcategory,searchedProduct])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurr((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);
    
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
      
        function previmage() {
            setCurr((prev) => (prev === 0 ? images.length - 1 : prev - 1)); // Loop to the last image when at the first one
        }
    
        function nextimage() {
            setCurr((prev) => (prev === images.length - 1 ? 0 : prev + 1)); // Loop to the first image when at the last one
        }

    return(
        <>
        <UniversalLoader active={loading} variant="overlay" message="Fetching products…" blur={6}/>
        <div className={`image-container ${isImage?'visible':'hidden'}`}>
            <button onClick={previmage} className="prev"><i className="fa-solid fa-left-long"></i></button>
            <div className="carousel-wrapper">
                <img src={images[curr]} alt="carousel" className="slideimage fade-in" key={curr}/>
            </div>
            <button onClick={nextimage} className="next"><i className="fa-solid fa-right-long"></i></button>
        </div>
        <div className="content">
            {Array.isArray(data) && data.length>0?(data.map((e)=>
            <div key={e._id} className="card" onClick={()=>{setProductId(e._id);navigate('/productcomponent')}}>
                <div className='img-container'>
                    <img src={e.images[0]} ></img>
                    <div className='rating-container'>{e.reviews.length>0?((()=>{const totalRating=e.reviews.reduce((sum,review)=>sum+review.rating,0)
                                                                                  const averageRating=(totalRating/e.reviews.length).toFixed(1)
                                                                                  return <p className='rating-value'>{averageRating} <i className="fa-solid fa-star"></i></p>})()):([])}</div>
                </div>
                <p className='textsummer'>{e.title}</p>
                <p>₹{e.price}</p>
                {e.sizes[0].quantity>0?(
                    <button className="add" onClick={(event)=>{event.stopPropagation();addtocart(e)}}><i className="fa-solid fa-cart-plus"><span>Add to Cart</span></i></button>
                ):(
                    <button className="outofstock" disabled={true}><i className="fa-solid fa-cart-plus"><span>Out Of Stock</span></i></button>
                )}
            </div>)):(<h1 className='no-product-tagline'>!! No Product Found</h1>)}
        </div>
        </>
    )
}

export default Beauty; 