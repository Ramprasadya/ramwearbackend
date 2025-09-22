import express from 'express'
const userRouter = express.Router();
import { LoginUser, RegisterUser, AdminLogin } from '../controllers/userController.js'


userRouter.post("/register",RegisterUser)
userRouter.post("/login",LoginUser)
userRouter.post("/admin",AdminLogin)

export default userRouter;