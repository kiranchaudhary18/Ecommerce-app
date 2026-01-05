import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) =>{
    try{
        const {token} =req.headers
        
        console.log("🔐 ADMIN AUTH CHECK");
        console.log("🔑 Token received:", token ? "Yes" : "No");

        if(!token) {
            console.log("❌ No token provided");
            return res.json({success:false, message:"Not Authorized Login Again"})
        }
        
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log("🔓 Token decoded:", token_decode);
        
        const expectedValue = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        console.log("✅ Expected:", expectedValue);
        console.log("🔍 Match:", token_decode === expectedValue);

        if(token_decode !== expectedValue){
         console.log("❌ Token mismatch");
         return res.json({success:false, message:"Not Authorized Login Again"})
        }
        
        console.log("✅ Admin authenticated");
        next()
    }
    catch(error){
      console.log("❌ ADMIN AUTH ERROR:", error);
      res.json({success:false,message:error.message})
    }
}

export default adminAuth
