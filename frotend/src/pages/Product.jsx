import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';


const Product = () => {
  
    const {productId} = useParams();
    const {products, currency, addToCart} = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState ('');
    const [size, setSize] = useState ('');

    const fetchProductData = async () => {
      products.map((item)=>{
        if(item._id === productId){
          setProductData(item)
          setImage(item.image[0]);

          return null;
        }
      })
    
    }

    useEffect(()=>{
       fetchProductData();
    },[productId, products]);

    return productData ? (
        <div className='border-t-2 pt-5 sm:pt-10 transition-opacity ease-in duration-500 opacity-100'>
            {/* Product  Data */}
             <div className='flex gap-6 sm:gap-12 flex-col sm:flex-row px-3 sm:px-0'>
                    {/* Product Images */}
                    <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                           <div className='flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-scroll justify-start sm:justify-normal sm:w-[18.7%] w-full order-2 sm:order-1'>
                              {
                                productData.image.map((item, index) => (
                                    <img onClick={()=> setImage(item)} src={item} key={index} className='w-16 h-16 sm:w-full sm:h-auto sm:mb-3 flex-shrink-0 cursor-pointer rounded border border-gray-200'/>
                                ))
                              }
                           </div>

                          <div className="w-full sm:w-[80%] order-1 sm:order-2">
  <div className="w-full h-[300px] sm:h-[500px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
    <img
      src={image}
      alt="product"
      className="w-full h-full object-contain p-4"
    />
  </div>
</div>

                    </div>

                    {/* ------ Product info ------ */}

                    <div className='flex-1 mt-6 sm:mt-0'>
                         <h1 className='font-medium text-xl sm:text-2xl mt-2'>{productData.name}</h1>

                         <div className='flex items-center gap-1 mt-2'>
                            <img src={assets.star} alt=" " className="w-3" /> 
                            <img src={assets.star} alt=" " className="w-3" /> 
                            <img src={assets.star} alt=" " className="w-3" /> 
                            <img src={assets.star} alt=" " className="w-3" /> 
                            <img src={assets.stardull} alt=" " className="w-3" /> 
                            <p className='pl-2 text-sm'>(122)</p>
                       </div>

                       <p className='mt-5 text-2xl sm:text-3xl font-medium'>{currency}{productData.price}</p>
                       <p className='mt-5 text-gray-500 text-sm sm:text-base'>{productData.description}</p>

                       <div className='flex flex-col gap-4 my-6 sm:my-8'>
                        <p className='text-sm sm:text-base'>Select Size</p>
                        <div className='flex gap-2 flex-wrap'>
                              {productData.sizes.map((item, index) => (
                                <button onClick={() => setSize(item)} className={`border py-2 px-3 sm:px-4 bg-gray-100 text-sm ${item === size ? 'border-orange-500 border-2': ' '}`} key={index} >{item}</button>
                              ))}
                        </div>
                       </div>

                       <button onClick={()=>addToCart(productData._id,size)} className='w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
                       <hr className='mt-6 sm:mt-8 sm:w-4/5'/>

                       <div className='text-xs sm:text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                            <p>100% original product.</p>
                            <p>Cash on delivery available on this product.</p>
                            <p>Easy return and exchange policy within 7 days.</p>
                       </div>
                    
                    </div>
             </div>

             {/* ------- dscription & review section ----- */}

             <div className='mt-20'>
                <div className='flex'>
                      <b className='border px-5 py-3 text-sm'>Description</b>
                      <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
                </div>
                <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, modi minus? Veritatis explicabo, deserunt praesentium amet molestias a, blanditiis voluptatibus sit assumenda non excepturi laborum quisquam incidunt voluptas fuga commodi.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam laboriosam, a sit, illo aut ducimus itaque, sint sed molestias earum magni nemo. Quasi illum quidem magni facere perspiciatis exercitationem maiores.</p>
                </div>
             </div>

             {/* ------display related produts----- */}

               <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
             

        </div>
    ) : <div className='opacity-0'></div>;
}
export default Product;