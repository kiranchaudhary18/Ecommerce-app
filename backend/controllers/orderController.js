import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'

// ================= PLACE ORDER (COD) =================
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;   // 🔥 FROM JWT

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID missing from token"
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// ================= USER ORDERS =================
const userOrders = async (req, res) => {
   try{
      
    const {userId} = req.body
    const orders = await orderModel.find({userId})

    res.json({success:true, orders})
    
   }catch(error) {
       console.log(error)
      res.json({success:false, message:error.message})
   }
}

// ================= ADMIN: ALL ORDERS =================
const allOrders = async (req, res) => {
    
   try{
       const orders = await orderModel.find({})
       res.json({success:false, orders})
   }
   catch(error){
     console.log(error)
      res.json({success:false, message:error.message})
   }
}

// ================= UPDATE STATUS =================
const updateStatus = async (req, res) => {
  
}

const placeOrderStripe = async () => {}
const placeOrderRazorpay = async () => {}

export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus
}
