import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      if (!token) {
        console.log("❌ No token found, cannot verify payment");
        return null;
      }

      console.log("🔵 Verifying Stripe payment:", { success, orderId });
      console.log("📡 Backend URL:", backendUrl);

      const response = await axios.post(
        backendUrl + '/api/order/verifyStripe',
        { success, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Verify response:", response.data);

      if (response.data.success) {
        setCartItems({});
        navigate('/orders');
        toast.success('Payment successful!');
      } else {
        navigate('/cart');
        toast.error('Payment failed!');
      }
    } catch (error) {
      console.log("❌ Verify payment error:", error.response?.data || error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'>
        <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Verify;
