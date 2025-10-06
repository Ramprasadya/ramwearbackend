import Stripe from "stripe"
import OrderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import razorpay from 'razorpay'

// global variable
const currency = 'usd'
const deliveryCharge = 10
// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY
})

// Placing Order using COD
const placeOrder = async (req, res) => {
    try {
        const userId = req.userId
        const { items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new OrderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed .." })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Placing Order using Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId
        const { items, amount, address } = req.body
        const { origin } = req.headers;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new OrderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100

            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100

            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'

        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Placing Order using Razorpay
const placeOrderRazorpay = async (req, res) => {
    try {

        const userId = req.userId
        const { items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new OrderModel(orderData)
        await newOrder.save()

        const option = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: newOrder._id.toString()
        }

        const razorpayOrder = await razorpayInstance.orders.create(option)
        res.json({ success: true, order: razorpayOrder })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId
        const { razorpay_order_id } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        // console.log(orderInfo)
        if (orderInfo.status === 'paid') {
            await OrderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true, message: "Payment Successfull" })
        } else {
            res.json({ success: false, message: "Payment Failed," })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// All oredrs data for admin pannel 
const AllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// User Order for front-end
const UserOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await OrderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update Order Status from admin pannel
const UpdateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        await OrderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { verifyRazorpay, placeOrder, placeOrderStripe, placeOrderRazorpay, AllOrders, UserOrder, UpdateStatus }