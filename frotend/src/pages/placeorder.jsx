import React, {useState, useContext} from 'react';
import assets from '../assets/assets';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const PlaceOrder = () => {

     const [method , setMethod] = useState ('cod');
     const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);
     const userId = localStorage.getItem("userId");

    



     const [formData, setFormData] = useState({
      firstName: '',
      lastName:'',
      email:'',
      street:'',
      city:'',
      state:'',
      zipcode:'',
      country:'',
      phone:'',
     })

     const onChangeHandler = (event) => {
      const name = event.target.name
      const value = event.target.value 

       setFormData(data => ({...data, [name]:value}))


     }

 const onSubmitHandler = async (event) => {
  event.preventDefault();

  if (!token) {
    toast.error('Please login to place an order');
    navigate('/login');
    return;
  }

  try {
    let orderItems = [];

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const product = structuredClone(
            products.find(p => p._id === items)
          );
          product.size = item;
          product.quantity = cartItems[items][item];
          orderItems.push(product);
        }
      }
    }

    if (!orderItems.length) {
      toast.error('Cart is empty');
      return;
    }

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
    };

    // 🔥 STRIPE PAYMENT
    if (method === "stripe") {
      try {
        const response = await axios.post(
          backendUrl + "/api/order/stripe",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Stripe Response:', response.data);

        if (response.data.success && response.data.session_url) {
          window.location.href = response.data.session_url;
        } else {
          toast.error(response.data.message || 'Stripe payment failed');
        }
      } catch (err) {
        console.log('Stripe error:', err);
        toast.error(err.response?.data?.message || err.message);
      }
    }

    // 🔥 COD PAYMENT
    if (method === "cod") {
      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('COD Response:', response.data);

      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
        toast.success("Order placed successfully!");
      } else {
        toast.error(response.data.message || 'Order placement failed');
      }
    }

  } catch (error) {
    console.log('Order error:', error);
    toast.error(error.message);
  }
};


     



    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
          {/* ------- Left SIde ----- */}
             <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                 
                <div className='text-xl sm:text-2xl my-3 '>
                  <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
                </div>
                
                <div className='flex gap-3'>
                   <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                </div>

                 <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Email address' />
                  <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                
                  <div className='flex gap-3'>
                   <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>

                  <div className='flex gap-3'>
                   <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>

                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />


             </div>

             {/* ------ Right side ---- */}

             <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal/>
                </div>

                <div className='mt-12'>
                     <Title text1={'PAYMENT'} text2={'METHOD'}/>

                 {/*------------ Payment method section --------- */}

                 <div className='flex gap-3 flex-col lg:flex-row'>
                    <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                          <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                          <img className='h-5 mx-4' src={assets.stripe} alt=" " />
                    </div>

                    <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                          <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                          <img className='h-5 mx-4' src={assets.razorpay} alt=" " />
                    </div>

                    <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                          <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                         <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                    </div>

                 </div>

                 <div className='w-full text-end mt-8'>
                   <button type="submit" className='bg-black text-white px-16 py-3 text-sm'>
  PLACE ORDER
</button>

                 </div>



                </div>

             </div>
        </form>
    );
}
export default PlaceOrder;