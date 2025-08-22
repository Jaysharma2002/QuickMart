import React,{useEffect,useState,useRef}  from "react";
import axios from "axios";
import '../styles/Admin.css'
import { useloader } from "../context/ContextLoader";
import UniversalLoader from "./UniversalLoader";
function AdminContent({selectedCategory,searchProduct,outOfStock}){
    const [onChange,setOnChange]=useState(false)
    const [isVisible,setIsVisible]=useState(false);
    const [isEdit,setIsEdit]=useState(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [newProduct,setNewProduct]=useState({
        images:[],
        title:"",
        description:"",
        price:"",
        quantity:"",
        category:"",
        sizes: [{ size: "", inStock: true, quantity: 1 }],
    })
    const [product,setProducts]=useState([])
    const [allProducts, setAllProducts] = useState([]); 
    const refPopup=useRef(null)
    const {startloading,stoploading}=useloader()
    const {isLoading}=useloader()
    const [newImageUrl, setNewImageUrl] = useState("");
    
        useEffect(() => {

         if (isVisible) {
            setHasInteracted(true); // Once visible, we can allow animations
        }

        if (isVisible) {
            document.body.style.overflow = 'hidden'; // Disable scroll
        } else {
            document.body.style.overflow = 'auto';   // Re-enable scroll
        }

        // Clean up on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isVisible]);

    useEffect(()=>{
        fetch();
    },[selectedCategory,searchProduct])

    useEffect(()=>{
        function changeVisible(event){
            if(refPopup.current && !refPopup.current.contains(event.target))
            {
                setIsVisible(false);
            }
        }
        if(isVisible)
        {
            document.addEventListener("mousedown",changeVisible)
        }
        return()=>{
            document.removeEventListener("mousedown",changeVisible)
        }
    },[isVisible])

    useEffect(()=>{
        if(outOfStock && allProducts){
            setProducts(allProducts.filter(p =>Array.isArray(p.sizes) && p.sizes.length > 0 &&p.sizes.every(s => s.inStock === false)
        ));} 
        else {
            setProducts(allProducts);
        }
    },[outOfStock,allProducts])

    const fetch=async()=>{
            try {
                startloading() 
            await axios.get("https://quickmartproject-backend.onrender.com/api/product/fetch").then((response)=>{
                const products=response.data
                const filteredItems=products.filter((item)=>{
                const selectedfiltereditems=selectedCategory?.toLowerCase()==="all" || item.category.toLowerCase()===selectedCategory.toLowerCase()
                const searchedfiltereditems=searchProduct?.toLowerCase()==="" || item.title.toLowerCase().includes(searchProduct.toLowerCase()) || item.category.toLowerCase().includes(searchProduct.toLowerCase())
                return selectedfiltereditems && searchedfiltereditems
                })
                setProducts(filteredItems)
                setAllProducts(filteredItems)
            })
        } catch (error) {
            console.log(error)
        }
        finally{
            stoploading()
        }
        }

    const handleInput=async(e)=>{
        const {name,value}=e.target
        setNewProduct((prevState)=>({
            ...prevState,
            [name]:value,
        })
    )
}

    const AddProduct=async()=>{
        await axios.post("https://quickmartproject-backend.onrender.com/api/product/create",{
            images: newProduct.images || [],
            title:newProduct.title,
            description:newProduct.description,
            price:newProduct.price,
            quantity:newProduct.quantity,
            category:newProduct.category,
            sizes: newProduct.sizes,
        })
        fetch();
        setNewProduct({title:"",images:[],description:"",price:"",quantity:"",category:"",sizes: [{ size: "", inStock: true, quantity: 1 }]});
        setNewImageUrl("");
    }

    function handleupdateInput(item){

  setNewProduct({
    title: item.title,
    images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
    description: item.description,
    price: item.price,
    quantity: item.quantity,
    category: item.category,
    sizes: item.sizes && item.sizes.length > 0 
      ? item.sizes.map((s) => ({
          size: s.size ?? "",
          inStock: s.inStock ?? true,
          quantity: s.quantity ?? 1
        })) 
      : [{ size: "", inStock: true, quantity: 1 }]
  });
  setIsEdit(item._id);
}


    const UpdateProduct = async () => {
    if (!isEdit) {
        console.log("No Product Found");
        return;
    }

    const response = await axios.put(`https://quickmartproject-backend.onrender.com/api/product/update/${isEdit}`, {
        title: newProduct.title,
        images: newProduct.images || [],
        description: newProduct.description,
        price: newProduct.price,
        quantity: newProduct.quantity,
        category: newProduct.category,
        sizes: newProduct.sizes,
    });

    setProducts((products) =>products.map((product) =>product._id === isEdit ? response.data : product));
    setNewProduct({title:"",images:[],description:"",price:"",quantity:"",category:"",sizes:[{ size: "", inStock: true, quantity: 1 }]});
    setNewImageUrl("");
    setIsEdit(null);
};

    const handleAddImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
        setNewProduct(prev => {
        const next = (prev.images || []);
            if (next.includes(url)) return prev; // no dupes
                return { ...prev, images: [...next, url] };
        });
    setNewImageUrl("");
    };

    const handleRemoveImage = (idx) => {
    setNewProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== idx)
    }));
    };


    const handleDelete=async(id)=>{
        await axios.delete(`https://quickmartproject-backend.onrender.com/api/product/delete/${id}`)
        setProducts((prev)=>{return prev.filter((product)=>product._id!==id)})
    }

    function outofstockproducts(){
        setProducts(allProducts.filter(eachproduct=>eachproduct.sizes.every(size=>size.inStock===false)))
    }

    function lowstockproducts(){
        setProducts(allProducts.filter(eachproduct=>eachproduct.sizes.some(size=>size.inStock && size.quantity>0 && size.quantity<5)))
    }

    function removefilter(){
        setProducts(allProducts)
    }

    return(
        <>
        {isLoading && <UniversalLoader active={isLoading} variant="overlay" message="Fetching Products.." blur={6}/>}
        <div className="Table">
            <div className="filter-product-buttons">
                <button onClick={()=>removefilter()}>All</button>
                <button onClick={()=>outofstockproducts()}><i className="fa-solid fa-triangle-exclamation"></i> Out Of Stock</button>
                <button onClick={()=>lowstockproducts()}><i className="fa-solid fa-bell"></i> Low Stock</button>
            </div>
            <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Product Image</th>
                    <th>Product Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Category Name</th>
                    <th>Sizes</th>
                    <th>In Stock</th>
                    <th>Size Quantity</th>
                    <th colSpan={2} ><button className="addbutton" onClick={()=>{setIsVisible(true),setOnChange(true)}}><i className="fa-solid fa-circle-plus"></i><span className="text"> Add Product</span></button></th>
                </tr>
            </thead>
            <tbody>
                {product.length>0?(product.map((item)=>(
                    <tr key={item._id}>
                    <td><p>{item.title}</p></td>
                    <td>
                    {Array.isArray(item.images) && item.images.length > 0 ? (
                        <img src={item.images[0]} alt="Product" />
                    ) : (
                        <span>No Image</span>
                    )}
                    </td>
                    <td><textarea defaultValue={`${item.description}`}></textarea></td>
                    <td><p>{item.price}</p></td>
                    <td><p>{item.quantity ?? 'N/A'}</p></td>
                    <td><p>{item.category}</p></td>
                     <td>
                    {item.sizes?.map((s, idx) => (
                        <p key={`size-${item._id}-${idx}`}>{s.size}</p>
                    ))}
                    </td>
                    <td>
                    {item.sizes?.map((s, idx) => (
                        <p key={`stock-${item._id}-${idx}`}>{s.inStock ? "Yes" : "No"}</p>
                    ))}
                    </td>
                    <td>
                    {item.sizes?.map((s, idx) => (
                        <p key={`qty-${item._id}-${idx}`}>{s.quantity}</p>
                    ))}
                    </td>
                    <td><button className="colbutton" onClick={()=>{handleupdateInput(item);setIsVisible(true);setOnChange(false)}}><i className="fa-solid fa-pen-to-square"></i><span className="text">Edit</span></button></td>
                    <td><button className="colbutton" onClick={()=>handleDelete(item._id)}><i className="fa-solid fa-delete-left"></i><span className="text">Delete</span></button></td>
                </tr>))):(
                    <tr>
                        <td colSpan={7}>No Data Available</td>
                    </tr>)}
            </tbody>
            </table>
        </div>
        <div className={`popup ${isVisible ? 'visible' : hasInteracted ? 'hidden' : 'initialhide'}`}  ref={refPopup}>
            <input type="text" name="title" value={newProduct.title} onChange={handleInput} placeholder="Product Name"></input>
            <div className="images-editor">
            <h3>Images</h3>

            <div className="images-grid">
                {Array.isArray(newProduct.images) && newProduct.images.filter(Boolean).length > 0 ? (
                newProduct.images.filter(Boolean).map((url, idx) => (
                    <div className="image-item" key={`img-${idx}`}>
                    <img src={url} alt={`img-${idx}`} onError={(e) => { e.currentTarget.style.opacity = '0.4'; }} />
                    <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove"
                    >
                        ×
                    </button>
                    </div>
                ))
                ) : (
                <p className="muted">No images yet.</p>
                )}
            </div>

            <div className="add-image-row">
                <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                />
                <button type="button" onClick={handleAddImage}>Add</button>
            </div>
            </div>

            <input type="text" name="description" value={newProduct.description} onChange={handleInput} placeholder="Product Description"></input>
            <input type="text" name="price" value={newProduct.price} onChange={handleInput} placeholder="Product Price"></input>
            <input type="text" name="quantity" value={newProduct.quantity} onChange={handleInput} placeholder="Product Quantity"></input>
            <input type="text" name="category" value={newProduct.category} onChange={handleInput} placeholder="Product Category"></input>
            <h3>Sizes</h3>
            {newProduct?.sizes?.map((sizeObj, index) => (
                <div key={index} className="size-row">
                    {/* Size Text Input */}
                    <input
                    type="text"
                    value={sizeObj?.size ?? ''}
                    placeholder="Size (e.g. M)"
                    onChange={(e) => {
                        const updatedSizes = [...newProduct.sizes];
                        updatedSizes[index] = {
                        ...updatedSizes[index],
                        size: e.target.value
                        };
                        setNewProduct((prev) => ({ ...prev, sizes: updatedSizes }));
                    }}
                    />

                    {/* InStock Dropdown */}
                    <select
                    value={sizeObj?.inStock === true ? "true" : "false"}
                    onChange={(e) => {
                        const updatedSizes = [...newProduct.sizes];
                        updatedSizes[index] = {
                        ...updatedSizes[index],
                        inStock: e.target.value === "true"
                        };
                        setNewProduct((prev) => ({ ...prev, sizes: updatedSizes }));
                    }}
                    >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                    </select>

                    {/* Quantity Input */}
                    <input
                    type="number"
                    value={sizeObj?.quantity ?? 0}
                    placeholder="Size Quantity"
                    min="0"
                    onChange={(e) => {
                        const updatedSizes = [...newProduct.sizes];
                        updatedSizes[index] = {
                        ...updatedSizes[index],
                        quantity: Number(e.target.value)
                        };
                        setNewProduct((prev) => ({ ...prev, sizes: updatedSizes }));
                    }}
                    />
                    <button onClick={() => {
                        const updatedSizes = [...newProduct.sizes];
                        updatedSizes.splice(index, 1);
                        setNewProduct((prev) => ({ ...prev, sizes: updatedSizes }));
                    }} disabled={newProduct.sizes.length === 1} className="remove-btn">Remove</button>

                </div>
                ))}



            <button onClick={() =>
                setNewProduct((prev) => ({
                    ...prev,
                    sizes: [...prev.sizes, { size: "", inStock: true, quantity: 1 }],
                }))} className="add-btn">Add Size</button>

            <div className="popbuttons">
                <div className={`disableadd ${onChange?'visible':'hidden'}`}>
                <button onClick={()=>{AddProduct();setIsVisible(false)}} ><i className="fa-solid fa-check"></i><span className="text"> Confirm</span></button>
                </div>
                <div className={`disableupdate ${!onChange?'visible':'hidden'}`}>
                <button onClick={()=>{UpdateProduct();setIsVisible(false)}} ><i className="fa-solid fa-check"></i><span className="text">Update</span></button>
                </div>
                <button onClick={() => { setIsVisible(false);setNewProduct({title: "",images: [],description: "",price: "",quantity: "",category: "",sizes: [{ size: "", inStock: true, quantity: 1 }],});setNewImageUrl("");setIsEdit(null);}}><i className="fa-solid fa-xmark"></i><span className="text"> Close</span></button>
            </div>
        </div> 
        </>
    )

}

export default AdminContent