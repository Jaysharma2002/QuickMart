import React from "react"
import TotalProducts from "./TotalProducts";
import TotalUsers from "./TotalUsers";
import OutOfStock from "./OutOfStock";
import TotalOrders from "./TotalOrders";
import TotalEarnings from "./TotalEarnings";
import SalesAnalytics from './SalesAnalytics';
import YearlyEarning from "./YearlyEarning";
import RecentOrders from "./RecentOrders";
import OrderStatus from "./OrderStatus";
import UserGrowth from "./UserGrowth";
import "../../styles/AdminDashboard.css"
import SalesCategory from "./SalesCategory";
import { useloader } from "../../context/ContextLoader";
import UniversalLoader from "../UniversalLoader";
function AdminDashborad({setOutOfStock,outOfStock,setTodayOrder,todayOrder}) {
    const {isLoading}=useloader()
    return (
        <div className="admindashboard">
            {isLoading && <UniversalLoader active={isLoading} variant="overlay" message="Loading Dashboard.." blur={6}/>}
            <div className="top-card-grid">
                <TotalProducts setOutOfStock={setOutOfStock} outOfStock={outOfStock}/>
                <TotalUsers />
                <TotalOrders setTodayOrder={setTodayOrder} todayOrder={todayOrder}/>
            </div>

            <div className="middle-chart-grid">
                <YearlyEarning />
                <OutOfStock setOutOfStock={setOutOfStock} outOfStock={outOfStock}/>
                <TotalEarnings />
            </div>

            <div className="parent">
                <div className="div1">
                    <SalesCategory/>
                    <OrderStatus/>
                </div>
                <div className="div2">
                    <div className="div2-left">
                        <UserGrowth />
                        <SalesAnalytics />
                    </div>
                    <div className="div2-right">
                        <RecentOrders />
                    </div>
                </div>               
            </div>
        </div>
    );
}


export default AdminDashborad;