import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    images: {
      type: [String],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
      },
    category: {
      type: String,
      required: true
    },
    sizes: [
      {
        size: { type: String,required:true},
        inStock: { type: Boolean,default:true,required:true },
        quantity:{type:Number,default:1,required:true}
      }
    ],
    reviews: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user"},
        order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'order' },
        rating: { type: Number, min: 0, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now },
        
      }
    ]
  });

const UserSchema=mongoose.Schema({
    provider: {
        type: String,
        default: "local"
    },
    provider_id: {
        type: String,
    },
    profileimage: {
        type: String
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,    
    },
    password:{
        type:String,
    },
    address:{
        type:String,
    },
    phone:{
        type:String,
    },
    gender:{
        type:String,
    },
    age:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        required:true
    }
})

const OrderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    userAddress:{
        type:String,
        required:true
    },
    userPhone:{
        type:String,
        required:true
    },
    items:
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true,
            },
            title:{
                type:String,
                required:true
            },
            images:{
                type:[String],
                required:true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            size:{
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    orderStatus:{
        type:String,
        enum:['Placed','Dispatched','Failed','Cancelled','Delivered'],
        default:'Placed',
    }
});
const Product=mongoose.model("product",Schema)
const User=mongoose.model("user",UserSchema)
const Order=mongoose.model("order",OrderSchema)
export {Product,User,Order};
