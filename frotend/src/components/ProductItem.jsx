// import React, { useContext } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import {Link} from 'react-router-dom';


// const ProductItem = ({id,image,name,price}) => {

//     const {currency} =useContext(ShopContext);
//   return (
//     <Link className='text-gray-700 cursor-pointer' to={`./product/${id}`} >

//       <div className='overflow-hidden'>
       

//          <img  className='hover:scale-110 transition ease-in-out'
//         src={image && image.length > 0 ? image[0] : ''}
//         alt={name}
//       />
//       </div>

//       <p className='pt-3 pb-1 text-sm'>{name}</p>
//       <p className='text-sm font-medium'>{currency}{price}</p>
//     </Link>
//     );
// }

// export default ProductItem




import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {

  const { currency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}
      className="text-gray-700 cursor-pointer"
    >

      {/* IMAGE CONTAINER – FIXED HEIGHT */}
      <div className="w-full h-[260px] bg-gray-100 rounded-md overflow-hidden">
        <img
          src={image && image.length > 0 ? image[0] : ''}
          alt={name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
        />
      </div>

      {/* PRODUCT INFO */}
      <p className="pt-3 pb-1 text-sm line-clamp-2">
        {name}
      </p>

      <p className="text-sm font-medium">
        {currency}{price}
      </p>

    </Link>
  );
};

export default ProductItem;
