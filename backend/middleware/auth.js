// import jwt from 'jsonwebtoken';

// const authUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not Authorized, Login Again'
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);

//     req.body.userId = token_decode.id;

//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid Token'
//     });
//   }
// };

// export default authUser;




import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized, Login Again'
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);

    req.userId = decoded.id;   // 🔥 IMPORTANT FIX

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: 'Invalid Token'
    });
  }
};

export default authUser;







// const loadOrderData = async () => {
//   try {
//     if (!token) return;

//     const response = await axios.post(
//       backendUrl + "/api/order/userorders",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ MATCH authUser
//         },
//       }
//     );

//     console.log("ORDERS RESPONSE:", response.data);

//     if (response.data.success) {
//       let allOrdersItem = [];

//       response.data.orders.forEach((order) => {
//         order.items.forEach((item) => {
//           allOrdersItem.push({
//             ...item,
//             status: order.status,
//             payment: order.payment,
//             paymentMethod: order.paymentMethod,
//             date: order.date,
//           });
//         });
//       });

//       setorderData(allOrdersItem.reverse());
//     }
//   } catch (error) {
//     console.log("ORDER LOAD ERROR:", error);
//   }
// };
