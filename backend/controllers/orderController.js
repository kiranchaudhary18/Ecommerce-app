// import orderModel from '../models/orderModel.js'
// import userModel from '../models/userModel.js'

// // ================= PLACE ORDER (COD) =================
// const placeOrder = async (req, res) => {
//   try {
//     const { items, amount, address } = req.body;
//     const userId = req.userId;   // 🔥 FROM JWT

//     if (!userId) {
//       return res.json({
//         success: false,
//         message: "User ID missing from token"
//       });
//     }

//     const orderData = {
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod: "COD",
//       payment: false,
//       date: Date.now()
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     // clear cart
//     await userModel.findByIdAndUpdate(userId, { cartData: {} });

//     res.json({ success: true, message: "Order Placed" });

//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };


// // ================= USER ORDERS =================
// const userOrders = async (req, res) => {
//    try{
      
//     const userId = req.userId // Get from JWT middleware
//     const orders = await orderModel.find({userId})

//     res.json({success:true, orders})
    
//    }catch(error) {
//        console.log(error)
//       res.json({success:false, message:error.message})
//    }
// }

// // ================= ADMIN: ALL ORDERS =================
// const allOrders = async (req, res) => {
    
//    try{
//        const orders = await orderModel.find({})
//        res.json({success:true, orders})
//    }
//    catch(error){
//      console.log(error)
//       res.json({success:false, message:error.message})
//    }
// }

// // ================= UPDATE STATUS =================
// const updateStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
    
//     await orderModel.findByIdAndUpdate(orderId, { status });
    
//     res.json({ success: true, message: 'Status Updated' });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// }

// const placeOrderStripe = async () => {}
// const placeOrderRazorpay = async () => {}

// export {
//   placeOrder,
//   placeOrderRazorpay,
//   placeOrderStripe,
//   allOrders,
//   userOrders,
//   updateStatus
// }




import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

// global variables
const currency="inr"
const deliveryCharge=10

// gatway initialize

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)




/* ================= PLACE ORDER (COD) ================= */
// const placeOrder = async (req, res) => {
//   try {
//     const { items, amount, address } = req.body;
//     const userId = req.userId; // from JWT middleware

//     if (!userId) {
//       return res.json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const orderData = {
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod: "COD",
//       payment: false,
//       status: "Order Placed", // ✅ IMPORTANT
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     // clear cart after order
//     await userModel.findByIdAndUpdate(userId, { cartData: {} });

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };


const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;  // ✅ Keep as string to match orderModel

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ================= USER ORDERS ================= */
// const userOrders = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const orders = await orderModel
//       .find({ userId })
//       .sort({ date: -1 }); // ✅ latest order first

//     res.json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

const userOrders = async (req, res) => {
  try {
    const userId = req.userId;  // ✅ Keep as string to match orderModel

    const orders = await orderModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


/* ================= ADMIN: ALL ORDERS ================= */
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    console.log("UPDATE STATUS API HIT");
    console.log("OrderId:", orderId);
    console.log("Status:", status);

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    console.log("UPDATED ORDER:", updatedOrder);

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.log("UPDATE STATUS ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};
 
/* ================= PAYMENT PLACEHOLDERS ================= */
const placeOrderStripe = async (req,res) => {

  try {
    const { items, amount, address } = req.body;
    const userId = req.userId; // ✅ Get from auth middleware
    const { origin } = req.headers;

    console.log('Stripe Payment Request:', { userId, itemsCount: items.length, amount });


     const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      // status: "Order Placed",
      date: Date.now(),
    };

     const newOrder = new orderModel(orderData);
    await newOrder.save()

    const line_items=items.map((item)=>({
      price_data: {
        currency: currency,
        product_data : {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }))


    line_items.push({
       price_data: {
        currency: currency,
        product_data : {
          name:" Delivery Charges"
        },
        unit_amount: deliveryCharge  * 100
      },
      quantity: 1

    })

    const session = await stripe.checkout.sessions.create({
       success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
       cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
       line_items,
       mode: 'payment',
    })

    res.json({success:true, session_url: session.url});

  }
  catch(error){
    console.log('Stripe Error:', error)
    res.json({success:false, message: error.message || 'Stripe payment failed'})
  }
};




const placeOrderRazorpay = async () => {};

export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
};

