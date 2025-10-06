import express from 'express'
import {placeOrder, placeOrderStripe, placeOrderRazorpay, AllOrders, UserOrder, UpdateStatus, verifyRazorpay} from "../controllers/orderController.js"
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin feature
orderRouter.get("/list", adminAuth, AllOrders)
orderRouter.post("/status",adminAuth,UpdateStatus)

// Payment Features
orderRouter.post("/place",authUser, placeOrder)
orderRouter.post("/stripe",authUser, placeOrderStripe)
orderRouter.post("/razorpay", authUser, placeOrderRazorpay)

// User feature
orderRouter.get("/userorders", authUser, UserOrder)

// varify payment
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
export default orderRouter