import { createContext } from 'react';
import assets from '../assets/assets';
import products from '../assets/products';


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

     const currency = '$';
     const delivery_fee=10;
     
     

    const value={
        products,
        currency,
        delivery_fee
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;