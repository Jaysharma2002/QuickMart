import {Product,User,Order} from './Schema.js'
import Razorpay from 'razorpay'
import bcrypt from "bcryptjs";
export const fetch=async(req,res)=>{
    try {
        const data=await Product.find().populate({
            path:'reviews.user_id',
            select:'name'
        })
        if(data.length===0)
        {
            return res.status(404).json({message:"No Product Found"})
        }
        return res.status(200).json(data)
    } 
    catch (error) 
    {
     return res.status(404).json({error:"Internal Server Error"})   
    }
}

export const create = async (req, res) => {
    try {
        let products = req.body;

        // Ensure products is an array
        if (!Array.isArray(products)) {
            products = [products];
        }

        // Check if any product already exists
        const existingTitles = await Product.find({ title: { $in: products.map(p => p.title) } }).distinct("title");
        const newProducts = products.filter(p => !existingTitles.includes(p.title));

        if (newProducts.length === 0) {
            return res.status(200).json({ message: "All products already exist" });
        }

        // Save new products to the database
        const savedProducts = await Product.insertMany(newProducts);
        return res.status(200).json(savedProducts);
    } catch (error) {
        console.error("Error in create function:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const update = async (req, res) => {
    try {
      const id = req.params.id;
      console.log("Updating product with ID:", id);
      console.log("Request body:", req.body);
  
      if (req.body.images && typeof req.body.images === "string") {
        req.body.images = req.body.images.split(',').map(img => img.trim());
      }
  
      // Handle quantity update separately
      if (req.body.quantity !== undefined) {
        const newQuantity = Number(req.body.quantity);
        if (!isNaN(newQuantity)) {
          console.log("Updating sizes[0].quantity to:", newQuantity);
  
          await Product.updateOne(
            { _id: id, "sizes.0": { $exists: true } },
            { $set: { "sizes.0.quantity": newQuantity } }
          );
  
          delete req.body.quantity; // Remove from body to prevent root update
        } else {
          return res.status(400).json({ message: "Invalid quantity value" });
        }
      }
  
      // Now update the remaining fields
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "No Product Found" });
      }
  
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error in update:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
    

export const delete1=async(req,res)=>{
    try {
        const id =req.params.id
        const productExist=await Product.findById(id)
        if(!productExist)
        {
            return res.status(404).json({message:"No Product Found"})
        }
        await Product.findByIdAndDelete(id)
        return res.status(200).json({message:"User Deleted Successfully"})
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const payment=async(req,res)=>{
    try{
        const razorpay=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET})
            const options=req.body;
            const orders=await razorpay.orders.create(options)
            if(!orders)
            {
                return res.status(500).json({message:"No Orders"})
            }
            return res.json(orders)
    }
    catch(error){
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const alluser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    let hashedPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const user = await User.create({
      profileimage: "",
      name,
      email,
      password: hashedPassword,
      address: "",
      phone: "",
      gender: "",
      age: ""
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error during register:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email is not registered" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Use Google login for this account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    req.session.userId = user._id;
    await req.session.save();

    return res.status(200).json({ message: "Success", uid: user._id });
  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const order=async(req,res)=>{
    try {
        console.log('new order',req.session.userId)
        const UserId=req.session.userId;
        const user=await User.findById(UserId)
        const userName=user.name
        const userEmail=user.email
        const userAddress=user.address
        const userPhone=user.phone
        const { products } = req.body;

        const orders=[]

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required' });
        }

        for (const product of products) {
            const dbProduct = await Product.findById(product._id);
            if (!dbProduct) {
                continue; // or handle as error
            }

            // Reduce quantity from the correct size
            const sizeToUpdate = dbProduct.sizes.find(s => s.size === product.sizes[0].size);
            console.log(sizeToUpdate)
            if (sizeToUpdate) {
                if (sizeToUpdate.quantity < product.quantity) {
                    return res.status(400).json({ message: `Insufficient stock of ${product.title}` });
                }
                console.log("Trying to decrease the quantity")
                sizeToUpdate.quantity -= product.quantity;
                if(sizeToUpdate.quantity<=0)
                {
                    sizeToUpdate.inStock===false
                }
            }

            await dbProduct.save();

        // Create the order
            const order = new Order({
                userId:UserId,
                userName:userName,
                userEmail:userEmail,
                userAddress:userAddress,
                userPhone:userPhone,
                items:{
                    product: product._id,
                    title: product.title,
                    images: product.images,
                    quantity: product.quantity,
                    size:product.sizes[0].size,
                    price: product.price,
                },
                paymentStatus: 'Completed',
                orderDate: new Date(),
                orderStatus:'Placed'
            });
            await order.save();
            orders.push(order)
        }
        res.status(201).json({ message: 'Order created successfully', orders });
    }
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const getorder=async (req,res)=>{
    try {
        const data=await Order.find()
        if(data.length===0){
            return res.status(404).json({message:'NO Orders Found'})
        }
        return res.status(201).json(data)
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const updateorder=async(req,res)=>{
    try {
        const {changeOption}=req.body
        const{selectedOrders}=req.body
        if (!changeOption || !selectedOrders || !Array.isArray(selectedOrders)) {
            return res.status(400).json({ error: "Invalid input data" });
        }
        const updatedorders=[]
        for(const id of selectedOrders){
            const updatedorder=await Order.findByIdAndUpdate(id,{orderStatus:changeOption.orderStatus},{new:true})
            updatedorders.push(updatedorder)
        }
        return res.json(updatedorders)
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const getuserorder = async (req, res) => {
    try {
        console.log(req.session);
        const userId = req.session.userId;

        const orders = await Order.find({ userId: userId })
            .populate({
                path: 'items.product', 
                select: 'reviews',  
            }).sort({orderDate:-1, _id: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: "Order does not exist" });
        }

        return res.json(orders);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const cancelorder=async(req,res)=>{
    try {
        const { id } = req.body;

        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Make sure order is not already cancelled
        if (existingOrder.orderStatus === 'Cancelled') {
            return res.status(400).json({ error: "Order is already cancelled" });
        }
        const { product: productId, quantity, size } = existingOrder.items;
        console.log(existingOrder,productId,quantity,size)
        const dbProduct = await Product.findById(productId);
        if (dbProduct) {
            const sizeToUpdate = dbProduct.sizes.find(s => s.size === size);
            if (sizeToUpdate) {
                sizeToUpdate.quantity += quantity;
                if(sizeToUpdate.quantity>=1)
                {
                    sizeToUpdate.inStock=true
                }
                await dbProduct.save();
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(id,{ orderStatus: 'Cancelled' },{ new: true });
        return res.json([updatedOrder]);
    }
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const userprofile=async(req,res)=>{
    try {
        const userId=req.session.userId
        console.log(userId)
        const user=await User.findById(userId)
        if(!user)
        {
            return res.status(404).json({message:"No User Found"})
        }
        return res.json(user)
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const updateprofile=async(req,res)=>{
    try {
        const userId=req.session.userId
        console.log(userId)
        const updateData={...req.body}
        if(req.file)
        {
            updateData.profileimage = `/uploads/${req.file.filename}`;
        }
        const user=await User.findByIdAndUpdate(userId,updateData,{new:true})
        if(!user)
            {
                return res.status(404).json({message:"No User Found"})
            }
        return res.json(user)
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const profileimage=async(req,res)=>{
    try {
        const userId=req.session.userId
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"No User Found"})
        }
        const profileimageurl=user.profileimage
        return res.json(profileimageurl)
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const updateaddress=async(req,res)=>{
    try{
        const userId=req.session.userId
        const user=await User.findByIdAndUpdate(userId,req.body,{new:true})
        if(!user){
            return res.status(404).json({message:"No User Found"})
        }
        return res.json(user)
    }
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const getaddress=async(req,res)=>{
    try {
        const userid=req.session.userId
        const user=await User.findById(userid)
        if(!user)
        {
            return res.status(404).json({message:"No User Found"})
        }
        return res.json(user)
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const saverating = async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log("Session Data:", req.session);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: UserId is required' });
        }
        const { productId, rating ,orderId} = req.body;
        console.log("Incoming Data:", { productId, rating });
        if (!productId || rating === undefined || !orderId) {
            return res.status(400).json({ message: 'OrderId and Rating are required' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            console.log("Order not found for ID:", productId);
            return res.status(404).json({ message: 'No Order Found' });
        }
        if (!product.reviews) {
            product.reviews = [];
        }
        const existingReviewIndex = product.reviews.findIndex((review) => review.user_id.toString() === userId);
        if (existingReviewIndex !== -1) {
            product.reviews[existingReviewIndex].rating = rating;
            product.reviews[existingReviewIndex].date = Date.now();
        } else {
            product.reviews.push({ user_id: userId, rating, date: Date.now(),order_id:orderId });
        }
        await product.save();
        console.log(product.reviews)
        return res.json({ message: "Rating saved successfully", reviews: product.reviews });
    } catch (error) {
        console.error("Error in saverating:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

export const savecomment=async(req,res)=>{
    try {
        const userId = req.session.userId;
        console.log("Session Data:", req.session);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: UserId is required' });
        }
        const { productId, comment ,orderId } = req.body;
        console.log("Incoming Data:", { productId, comment });
        if (!productId || !comment) {
            return res.status(400).json({ message: 'OrderId and Comment are required' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            console.log("Order not found for ID:", productId);
            return res.status(404).json({ message: 'No Order Found' });
        }
        if (!product.reviews) {
            product.reviews = [];
        }
        const existingReviewIndex = product.reviews.findIndex((review) => review.user_id.toString() === userId);
        if (existingReviewIndex !== -1) {
            product.reviews[existingReviewIndex].comment = comment;
            product.reviews[existingReviewIndex].date = Date.now();
        } else {
            product.reviews.push({ user_id: userId, comment, date: Date.now(),order_id:orderId});
        }
        await product.save();
        console.log(product.reviews)
        return res.json({ message: "Rating saved successfully", reviews: product.reviews });
    } catch (error) {
        console.error("Error in saverating:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

export const productcount=async(req,res)=>{
    try{
        const count = await Product.countDocuments();
        res.json({ count });
    }
    catch{
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const usercount=async(req,res)=>{
    try{
        const count = await User.countDocuments();
        res.json({ count });
    }
    catch{
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const outofstockcount=async(req,res)=>{
    try{
        const count = await Product.countDocuments({"sizes.inStock":false});
        res.json({ count });
    }
    catch{
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const ordercount=async(req,res)=>{
    try {
        const now = new Date();

        // Set to local midnight (00:00) in IST
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms (UTC+5:30)
        const start = new Date(now.getTime() - (now.getTime() % (24 * 60 * 60 * 1000)) - istOffset);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);

        // Query using UTC timestamps that match "today" in IST
        const count = await Order.countDocuments({
        orderDate: { $gte: start, $lte: end }
        });
        res.json({count})
    }
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"})   
    }
}

export const totalearning=async(req,res)=>{
    try {
        const now = new Date();

        // Set to local midnight (00:00) in IST
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms (UTC+5:30)
        const start = new Date(now.getTime() - (now.getTime() % (24 * 60 * 60 * 1000)) - istOffset);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);

        // Query using UTC timestamps that match "today" in IST
        const Orders = await Order.find({
        orderDate: { $gte: start, $lte: end }
        });
        const total=Orders.reduce((a,b)=>{return a+(b.items?.price || 0)},0)
        res.json({total:Math.floor(total)})
    }
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"})   
    }
}

export const salesanalytics = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed: 7 = August

    // IST offset in minutes (5 hours 30 minutes)
    const IST_OFFSET_MINUTES = 330;

    // Start of month in IST (Aug 1, 00:00 IST)
    const istStart = new Date(Date.UTC(year, month, 1, 0, 0));
    istStart.setUTCMinutes(istStart.getUTCMinutes() - IST_OFFSET_MINUTES);

    // End of month in IST (Aug 31, 23:59:59.999 IST)
    const istEnd = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    istEnd.setUTCMinutes(istEnd.getUTCMinutes() - IST_OFFSET_MINUTES);

    const Orders = await Order.find({orderDate: { $gte: istStart,$lte: istEnd,},});

    const dailysales = {};
    for (const order of Orders) {
      // Convert stored UTC orderDate to IST string
      const istDate = new Date(order.orderDate.getTime() + IST_OFFSET_MINUTES * 60000);
      const dateStr = istDate.toISOString().split("T")[0];

      const total = order.items?.price || 0;
      dailysales[dateStr] = (dailysales[dateStr] || 0) + total;
    }

    const result = Object.keys(dailysales).map((date) => ({
      date,
      total: dailysales[date],
    }));

    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const yearlyearning=async(req,res)=>{
    try {
        const date=new Date()
        const year=date.getFullYear()
        const startdate=new Date(year,0,1)
        const enddate=new Date(year,11,31,23,59,59,999)

        const orders=await Order.find({orderDate:{$gte:startdate,$lte:enddate}})
        const total=orders.reduce((sum,order)=>sum + (order.items?.price || 0),0)
        res.json({total:Math.floor(total)})
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})      
    }
}

export const recentorders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 }) // latest first
      .limit(12); // or 5 based on your need

    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};

export const salesbycategory=async(req,res)=>{
    try {
        const orders=await Order.find()

        const categorized={};
        await Promise.all(
            orders.map(async(order)=>{
                const productId=order.items.product
                const product=await Product.findById(productId)
                if(product && product.category)
                {
                    const category =product.category
                    const price = order.items?.price || 0;

                    categorized[category]=(categorized[category] || 0)+price
                }
            })
        )

        const result=Object.entries(categorized).map(([category,price])=>({
            category,
            price
        }))

        res.json({result})

    } 
    catch (error){
    res.status(500).json({ error: "Failed to fetch recent orders" });
    }
}

export const usergrowthbymonth=async(req,res)=>{
    try {
        const date=new Date()
        const year=date.getFullYear()
        const month=date.getMonth()

        const startdate=new Date(year,month,1)
        const enddate=new Date(year,month+1,0,23,59,59,999)

        const users=await User.find({createdAt:{$gte:startdate,$lte:enddate}})
        const usergrowth={}
        const IST_OFFSET_MINUTES = 330;

        for(const user of users)
        {
            const istDate = new Date(user.createdAt.getTime() + IST_OFFSET_MINUTES * 60000);
            const dateStr = istDate.toISOString().split("T")[0];
            
            usergrowth[dateStr]=(usergrowth[dateStr] || 0)+1;
        }
        const result = Object.entries(usergrowth).map(([date, count]) => ({
            date,
            count,
        }));

        result.sort((a,b)=>new Date(a.date)-new Date(b.date))

        res.json({result})
    } catch (error) {
    res.status(500).json({ error: "Failed to users" });  
    }
}

export const deliverystatus=async(req,res)=>{
    try {
        const orders=await Order.find()
        const deliverystatus={}
        for(const order of orders)
        {
            const orderstatus=order.orderStatus

            deliverystatus[orderstatus]=(deliverystatus[orderstatus] || 0)+1
        }
        const result=Object.entries(deliverystatus).map(([status,count])=>({
            status,
            count
        }
        ))
        res.json({result})
        
    } catch (error) {
    res.status(500).json({ error: "Failed to users" });   
    }
}

export const fetchcategory=async(req,res)=>{
    try {
        const products=await Product.find()
        const categories={}
        for(const product of products)
        {
            const category=product.category

            categories[category]=true
        }
        console.log(categories)
        const result=Object.entries(categories).map(([category])=>({
            category
        }))
        res.json({result})
        
    } catch (error) {
        res.status(500).json({ error: "Failed to users" });   
    }
}

export const logout=async(req,res)=>{
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session:", err);
                return res.status(500).json({ message: "Logout failed" });
            }
            res.clearCookie('connect.sid'); // Clears session cookie
            return res.status(200).json({ message: "Logged out successfully" });
        });
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

