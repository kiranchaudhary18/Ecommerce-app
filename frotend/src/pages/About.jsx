import React from 'react';
import assets from '../assets/assets';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox'


const About = () => {
    return (
        <div>
             
             <div className='text-2xl text-center pt-8 border-t'>
               <Title text1={'ABOUT'} text2={'US'} />
             </div>

             <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md:max-w-[400px]' src={assets.about} alt="" />

                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam non soluta necessitatibus eius vel fuga error facilis, porro ea similique! Vero minima perferendis quibusdam repellat blanditiis porro dolorem sequi earum.</p>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam repudiandae iste odio at provident commodi, magnam eaque molestias, officia possimus, eos numquam dignissimos. Vero saepe animi repudiandae et, ad aperiam?</p>
                
                <b className='text-gray-800'>Our Mission</b>
                <p>Our mission at forever is to empower customer with choice, convenience, and confidence, we`re  </p>
                 </div>   
             </div>

             <div className='text-xl py-4'>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
             </div>

             <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'> 
                    <b>Quality Assurance:</b>
                    <p className='text-gray-600'>We meticulously select and wet each product to ensure it meets our stringent qualoty standards.</p>
                </div>

                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'> 
                    <b>Convenience:</b>
                    <p className='text-gray-600'>With our user-friendly interface and hassle-free ordering , shopping has never been easier. </p>
                </div>

                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'> 
                    <b>Exceptional Customer Service:</b>
                    <p className='text-gray-600'>Our team of dedicated professional is here to assist you the way, ensuring </p>
                </div>
             </div>

             <NewsletterBox/>
        </div>
    );
}
export default About;