import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { token} = useAppContext()
    const navigate = useNavigate()

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      <img onClick={ ()=> navigate('/')} src={assets.logo} alt='image-logo' className='w-24 sm:w-44 cursor-pointer'/>
      <div className='flex items-center gap-3 sm:gap-8'>
        <NavLink
          to='/about'
          className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
        >
          <span className='sm:hidden'>About</span>
          <span className='hidden sm:inline'>About Activity</span>
        </NavLink>
        <NavLink
          to='/blogs'
          className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
        >
          Blogs
        </NavLink>
        <button onClick={ ()=> navigate('/admin')} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-6 sm:px-10 py-2.5'>
          {token ? 'Dashboard' : 'Login'}
          <img src={assets.arrow} className='w-3' alt='arrow' />
        </button>
      </div>
    </div>
  )
}

export default Navbar
