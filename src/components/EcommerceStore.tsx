'use client'

import ChatWidget from '@/components/ChatWidget'
import { FaHeart, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'

const EcommerceStore = () => {
  return (
    <>
      <header className='bg-white shadow-md sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-5'>
          <div className='flex justify-between items-center py-4'>
            <div className='text-2xl font-bold text-purple-600'>ShopSmart</div>
            <div className='flex items-center bg-gray-100 rounded-full px-4 py-2 w-2/5'>
              <input type='text' className='border-none bg-transparent w-full px-2 outline-none text-sm' placeholder='Search for products...' />
              <button className='border-none bg-none text-gray-500 cursor-pointer'>
                <FaSearch />
              </button>
            </div>
            <div className='flex gap-5'>
              <a href='#account' className='relative text-gray-900'>
                <FaUser size={20} />
              </a>
              <a href='#wishlist' className='relative text-gray-900'>
                <FaHeart size={20} />
                <span className='absolute -top-2 -right-2 bg-purple-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-xs'>{3}</span>
              </a>
              <a href='#cart' className='relative text-gray-900'>
                <FaShoppingCart size={20} />
                <span className='absolute -top-2 -right-2 bg-purple-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-xs'>{2}</span>
              </a>
            </div>
          </div>
          <nav className='flex justify-center border-t border-gray-100'>
            <ul className='flex gap-0 list-none p-0 m-0'>
              <li className='mx-4'>
                <a
                  href='#'
                  className='block px-5 py-4 no-underline font-medium relative text-purple-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.75 after:bg-purple-600'
                >
                  Home
                </a>
              </li>
              <li className='mx-4'>
                <a
                  href='#'
                  className='block px-5 py-4 text-gray-900 no-underline font-medium relative hover:text-purple-600 hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.75 hover:after:bg-purple-600'
                >
                  Electronics
                </a>
              </li>
              <li className='mx-4'>
                <a
                  href='#'
                  className='block px-5 py-4 text-gray-900 no-underline font-medium relative hover:text-purple-600 hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.75 hover:after:bg-purple-600'
                >
                  Clothing
                </a>
              </li>
              <li className='mx-4'>
                <a
                  href='#'
                  className='block px-5 py-4 text-gray-900 no-underline font-medium relative hover:text-purple-600 hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.75 hover:after:bg-purple-600'
                >
                  Home & Kitchen
                </a>
              </li>
              <li className='mx-4'>
                <a
                  href='#'
                  className='block px-5 py-4 text-gray-900 no-underline font-medium relative hover:text-purple-600 hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.75 hover:after:bg-purple-600'
                >
                  Beauty
                </a>
              </li>
              <li className='mx-4'>
                <a
                  href='#'
                  className='block px-5 py-4 text-gray-900 no-underline font-medium relative hover:text-purple-600 hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.75 hover:after:bg-purple-600'
                >
                  Sports
                </a>
              </li>
              <li className='mx-4'>
                <a
                  href='#'
                  className='block px-5 py-4 text-gray-900 no-underline font-medium relative hover:text-purple-600 hover:after:content-[""] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.75 hover:after:bg-purple-600'
                >
                  Deals
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className='bg-linear-to-r from-purple-600 to-purple-700 text-white py-15 text-center mb-10'>
          <div className='max-w-6xl mx-auto px-5'>
            <h1 className='text-4xl mb-4'>Summer Sale is Live!</h1>
            <p className='text-lg mb-8 opacity-90'>Get up to 50% off on selected items. Limited time offer!</p>
            <button className='bg-white text-purple-600 border-none rounded-full px-6 py-3 text-base font-bold cursor-pointer transition-all hover:-translate-y-0.75 hover:shadow-lg'>
              Shop Now
            </button>
          </div>
        </div>
      </main>

      <footer className='bg-gray-50 py-15 mt-15'>
        <div className='max-w-6xl mx-auto px-5'>
          <div className='grid grid-cols-auto-fit gap-8 mb-10' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <h3 className='text-lg mb-5 text-gray-900'>Shop</h3>
              <ul className='list-none p-0 m-0'>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Electronics
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Clothing
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Home & Kitchen
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Beauty
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Sports
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg mb-5 text-gray-900'>Customer Service</h3>
              <ul className='list-none p-0 m-0'>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Contact Us
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Returns & Exchanges
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    FAQs
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Shipping Policies
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Order Tracking
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg mb-5 text-gray-900'>About Us</h3>
              <ul className='list-none p-0 m-0'>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Our Story
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Privacy Policy
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Terms of Service
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Customer Reviews
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg mb-5 text-gray-900'>Contact With Us</h3>
              <ul className='list-none p-0 m-0'>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Facebook
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Twitter
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    Instagram
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    LinkedIn
                  </a>
                </li>
                <li className='mb-2.5'>
                  <a href='#' className='no-underline text-gray-500 hover:text-purple-600'>
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='text-center pt-8 border-t border-gray-200 text-sm text-gray-500'>
            &copy; {new Date().getFullYear()} ShopSmart. All rights reserved.
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  )
}

export default EcommerceStore
