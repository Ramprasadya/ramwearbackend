import express from 'express'
const userRouter = express.Router();
import { LoginUser, RegisterUser, AdminLogin, UserDetail } from '../controllers/userController.js'
import authUser from '../middleware/auth.js';


userRouter.post("/register",RegisterUser)
userRouter.post("/login",LoginUser)
userRouter.post("/admin",AdminLogin)
userRouter.get("/userDetail", authUser, UserDetail)

export default userRouter;