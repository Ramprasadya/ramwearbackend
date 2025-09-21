import userModel from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken =(id)=>{
   return jwt.sign({id},process.env.JWT_SECRET)
}

// Route for user Login 
const LoginUser=async(req,res)=>{
   try {
      const {email, password} = req.body;
      const user = await userModel.findOne({email})
      if(!user){
         res.json({success:false, message:"User does not exist"})
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if(isMatch){
         const token  = createToken(user._id)
         res.json({success:true, token})
      }else{
         res.json({success:false,message:"Invalid Credentials"})
      }
   } catch (error) {
      console.log(error);
      res.json({success:false, message:error.message})
      
   }

}

// Route for user registration
const RegisterUser=async(req,res)=>{
   try {
      const {name, email, password} = req.body;
      // checking user exist oor not 
      const exist = await userModel.findOne({email});
      if(exist){
         return res.json({success:false, message:"User Already Exist"})
      }

      // Validating  email format & Strong password 
      if(!validator.isEmail(email)){
         return res.json({success:false, message:"Please enter a valid email"})
      }
      if(password.length <5){
         return res.json({success:false,message:"Please enter a strong password & at least 5 character"})
      }

      // hash user password 
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)

      const newUser = new userModel({
         name,
         email,
         password:hashPassword
      })

      const user = await newUser.save();

      const token  = createToken(user._id)
      res.json({success:true, token})

   } catch (error) {
      console.log(error);
      res.json({success:false, message:error.message})
      
   }
}

// admin Login 
const AdminLogin=async(req,res)=>{

}



export {LoginUser,RegisterUser,AdminLogin}