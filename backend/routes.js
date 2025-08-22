import express from "express"
import upload from "./Middleware.js"; 
import {fetch,create,update,delete1,payment,alluser,signin,order,getorder,updateorder,getuserorder,cancelorder,userprofile,updateprofile,profileimage,updateaddress,getaddress,logout,saverating,savecomment,productcount,usercount,outofstockcount,ordercount,totalearning,salesanalytics,yearlyearning,recentorders,salesbycategory, usergrowthbymonth, deliverystatus, fetchcategory} from "./Controller.js"


const route=new express.Router()
route.post("/create",create)
route.get("/fetch",fetch)
route.put("/update/:id",update)
route.delete("/delete/:id",delete1)
route.post("/payment",payment)
route.post('/createuser',alluser)
route.post('/signin',signin)
route.post('/order',order)
route.get('/getorder',getorder)
route.put('/updatestatus',updateorder)
route.get('/getuserorder',getuserorder)
route.put('/cancelorder',cancelorder)
route.post('/userprofile',userprofile)
route.post('/updateprofile', upload.single('profileimage'), updateprofile);
route.post('/profileimage',profileimage)
route.put('/updateaddress',updateaddress)
route.post('/getaddress',getaddress)
route.post('/logout',logout)
route.put('/saverating',saverating)
route.put('/savecomment',savecomment)
route.get('/productcount',productcount)
route.get('/usercount',usercount)
route.get('/outofstockcount',outofstockcount)
route.get('/ordercount',ordercount)
route.get('/totalearning',totalearning)
route.get('/salesanalytics',salesanalytics)
route.get('/yearlyearning',yearlyearning)
route.get('/recentorders',recentorders)
route.get('/salesbycategory',salesbycategory)
route.get('/usergrowthbymonth',usergrowthbymonth)
route.get('/deliverystatus',deliverystatus)
route.get('/fetchcategory',fetchcategory)
export default route