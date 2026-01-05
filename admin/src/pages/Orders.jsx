import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import assets from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      console.log("❌ NO TOKEN FOUND");
      return;
    }

    console.log("🔵 Fetching orders...");
    console.log("🔑 Token:", token);
    console.log("🌐 Backend URL:", backendUrl);

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      console.log("✅ FULL RESPONSE:", response);
      console.log("📦 RESPONSE DATA:", response.data);
      console.log("📋 ORDERS ARRAY:", response.data.orders);
      console.log("🔢 ORDERS COUNT:", response.data.orders?.length);

      if (response.data.success && response.data.orders) {
        console.log("✅ Setting orders:", response.data.orders.length);
        setOrders(response.data.orders);
      } else if (response.data.orders) {
        console.log("⚠️ Success false but orders exist");
        setOrders(response.data.orders);
      } else {
        console.log("❌ No orders in response");
        setOrders([]);
        toast.info("No orders found");
      }

    } catch (error) {
      console.error("❌ ERROR:", error);
      console.error("❌ ERROR RESPONSE:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const statusHandler = async (event, orderId) => {
  const newStatus = event.target.value;

  // ✅ 1. UI ko TURANT update karo
  setOrders((prevOrders) =>
    prevOrders.map((order) =>
      order._id === orderId
        ? { ...order, status: newStatus }
        : order
    )
  );

  try {
    // ✅ 2. Backend me update bhejo
    const response = await axios.post(
      backendUrl + "/api/order/status",
      { orderId, status: newStatus },
      { headers: { token } }
    );

    if (!response.data.success) {
      toast.error("Failed to update order status");
    }
  } catch (error) {
    toast.error("Server error while updating status");
  }
};

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className="mb-2 text-xl font-semibold">Order Page</h3>
      <p className="mb-4">Total Orders: {orders.length}</p>

      {orders.length === 0 ? (
        <p className="text-gray-500 py-4">No orders found</p>
      ) : (
        orders.map((order, index) => (
          <div
            key={order._id || index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr]
            gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 text-sm text-gray-700"
          >
            {/* Icon */}
            <img src={assets.parcel} alt="parcel" className="w-12" />

            {/* Address + Items */}
            <div>
              <div>
                {order.items.map((item, idx) => (
                  <p key={idx} className="py-0.5">
                    {item.name} × {item.quantity}
                    {item.size && <span> ({item.size})</span>}
                  </p>
                ))}
              </div>

              {/* ✅ FIX: MongoDB fields */}
              <p className="mt-3 font-medium">{order.address.firstName} {order.address.lastName}, </p>

              <p>{order.address.street},</p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.pincode}
              </p>
              <p>{order.address.phone}</p>
            </div>

            {/* Order Info */}
            <div>
              <p>Items : {order.items.length}</p>
              <p className="mt-2">Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>
                Date : {new Date(order.date).toLocaleDateString()}
              </p>
            </div>

            {/* Amount */}
            <p className="font-semibold">
              {currency}
              {order.amount}
            </p>

            {/* Status */}
            <select
              value={order.status}
              onChange={(e) => statusHandler(e, order._id)}
              className="p-2 border font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
