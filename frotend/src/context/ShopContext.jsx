import { createContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const currency = '$';
  const delivery_fee = 10;
  
  // Get backend URL from environment, with fallback
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // If not set or empty, use current origin as fallback (for deployed apps)
  if (!backendUrl || backendUrl === 'http://localhost:4000') {
    // For development, use localhost, otherwise use current domain
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      backendUrl = 'http://localhost:4000';
    } else {
      // For production, assume backend is on same domain (but different port or path)
      // Change this if your backend is on a different domain
      backendUrl = window.location.origin.replace(':3000', ':4000');
    }
  }
  
  console.log('🔵 Using Backend URL:', backendUrl);

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : {};
  });

 const [token, setToken] = useState(localStorage.getItem("token"));


  const navigate = useNavigate();

  // ===================== GET PRODUCTS =====================
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    }
  };

  // ===================== GET USER CART =====================
  const getUserCart = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load cart");
    }
  };

  // ===================== ADD TO CART =====================
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      await axios.post(
        backendUrl + "/api/cart/add",
        { itemId, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to sync cart");
      setCartItems(cartItems); // rollback
    }
  };

  // ===================== UPDATE QUANTITY =====================
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (!token) return;

    try {
      await axios.post(
        backendUrl + '/api/cart/update',
        { itemId, size, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update cart");
    }
  };

  // ===================== CART COUNT =====================
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        totalCount += cartItems[items][item];
      }
    }
    return totalCount;
  };

  // ===================== CART AMOUNT =====================
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      const product = products.find(p => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        totalAmount += product.price * cartItems[productId][size];
      }
    }

    return totalAmount;
  };

  // ===================== EFFECTS =====================
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart();
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // ===================== CONTEXT VALUE =====================
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
