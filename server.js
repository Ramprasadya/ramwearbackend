import express from 'express'
const app = express()
import cors from "cors"
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoutes.js'
const port = process.env.PORT 
connectDB()
connectCloudinary()

// middlewares

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/user",userRouter)
app.use("/product",productRouter)
app.use("/cart", cartRouter)

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
