import jwt from 'jsonwebtoken'

const authUser = async(req,res,next)=>{
    const {token } = req.headers;
    if(!token){
        return res.json({success:false, message:"Not Authorized Login Again"})
    }
    try {
        const token_decode = await jwt.verify(token, process.env.JWT_SECRET)
        // console.log(token_decode)

        req.userId = await token_decode.id
        // console.log(req.userId)
        next()
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

export default authUser;