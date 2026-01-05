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
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log("🔓 Token decoded:", decoded);
        
        if(decoded?.email !== process.env.ADMIN_EMAIL){
         console.log("❌ Token email mismatch");
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
