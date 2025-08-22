import React, { useState ,useEffect,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import '../styles/Header.css';
import Logo from '../assets/images.png'

function Header({ setSelectedcategory, searchedProduct, setSearchedProduct,addedToCart,productInCart,setProductInCart,selectedcategory,profileupdate}) {
    const [isSidebarvisible, setSidebarvisible] = useState(false); 
    const [showMessage,setShowMessage]=useState(false)
    const [profileShow,setProfileShow]=useState(false)
    const [categories,setCategories]=useState([])
    const refProfile=useRef(null)
    const refCategoryBar=useRef(null)
    const navigate = useNavigate();

    useEffect(()=>{
        const fetch = async () => {
            const res = await axios.get("http://localhost:8000/api/product/fetchcategory");
            setCategories(res.data.result);
        };
        fetch();
    },[])

    useEffect(()=>{
        if(productInCart)
        {
            setShowMessage(true)
            setTimeout(()=>{setShowMessage(false);setProductInCart(false);},3000)
        }
    },[productInCart])

    useEffect(()=>{
        if(selectedcategory!=="All"){
            navigateTo('/home')
            setSidebarvisible(false)
        }
      },[selectedcategory])
  
      useEffect(()=>{
        function hideProfile(event)
        {
        if(refProfile.current && !refProfile.current.contains(event.target))
                {
                    setProfileShow(false)
                }
        }
        if(profileShow)
        {
            document.addEventListener("mousedown",hideProfile)
        }
        return(()=>{
            document.removeEventListener("mousedown",hideProfile)
        })
      },[profileShow])

      useEffect(()=>{
        if (isSidebarvisible && refCategoryBar.current) {
            refCategoryBar.current.scrollTop = 0;
        }
        function hideSideBar(event){
            if(refCategoryBar.current && !refCategoryBar.current.contains(event.target))
            {
                setSidebarvisible(false)
            }
        }
        if(isSidebarvisible)
        {
            document.addEventListener("mousedown",hideSideBar)
        }
        return(()=>{
            document.removeEventListener("mousedown",hideSideBar)
        })

      },[isSidebarvisible])

    const handleSearch = (e) => {
        setSearchedProduct(e.target.value);
        navigate('/home')
    };

    const navigateTo = (path) => {
        navigate(path);
    };

    function logout(){
        axios.post('http://localhost:8000/api/product/logout',{},{withCredentials:true})
        setProfileShow(false)
        navigateTo('/')
    }
    function viewprofile(){
        navigateTo('/viewprofile')
    }
    return (
        <>
            <div className="Allheader">
                <div className="header">
                    <div className='category-setion'>
                        <button onClick={() => {setSidebarvisible(true);setProfileShow(false)}}><i className="fa-solid fa-list"><span></span></i> </button>
                        <div className='user-logo-container'>
                            <p>QuickMart</p>
                            <img src={Logo} alt="Site Logo" />
                        </div>
                    </div>
                    <div className='search-home-container'>
                        <div className="searchbarcon">
                            <button onClick={() => {setSelectedcategory("All");navigateTo('/home')}}><i className="fa-solid fa-house"><span></span></i></button>
                            <input type="text" className="searchbar" placeholder="Search For Products.." value={searchedProduct} onChange={handleSearch}/>
                        </div>
                    </div>
                    <div className="buttons">
                        <button onClick={() => navigateTo('/cart')} className="cart-btn"><i className="fa-solid fa-cart-shopping"><span> CART</span></i><span className="badge">{addedToCart}</span></button>
                        <button onClick={()=> navigateTo('/order')}><i className="fa-solid fa-clipboard"><span> ORDER</span></i></button>
                        <div className="profilebutton-container">
                            <button onClick={()=>{setProfileShow(true);setSidebarvisible(false)}} style={{padding:'8px'}}><i className="fa-solid fa-circle-user" style={{fontSize:'22px'}}></i></button>
                            <div className={`profile ${profileShow ? 'profilevisible' : 'profilehidden'}`} ref={refProfile}>
                                <button onClick={() => {viewprofile(); setProfileShow(false)}} className='profileoption'><i className="fa-solid fa-user"></i></button>
                                <button onClick={() => {logout(); setProfileShow(false)}} className='profileoption'><i className="fa-solid fa-right-from-bracket"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`productincart ${showMessage?'visible':'hidden'}`}>
                    <p><i className="fa-solid fa-bell"></i>  Product Is Already In Cart</p>
                </div>
            </div>
            <div className={`navbar ${isSidebarvisible?'visible':'hidden'}`} ref={refCategoryBar}>
                <label className="category-label">Categories</label>
                <ul>
                    <li>
                    <button onClick={() => { setSelectedcategory("All");setSidebarvisible(false) }}>All</button>
                    </li>
                    {categories.map((e, i) => (
                    <li key={i}>
                        <button onClick={() => {setSelectedcategory(e.category);}}>
                        {(e.category).charAt(0).toUpperCase()+e.category.slice(1)}
                        </button>
                    </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Header;
