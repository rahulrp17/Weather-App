import React from 'react'
import cloud from "./assets/cloud.png"

const  Navbar = () => {
  return (
    <div className='navbar absolute top-0 left-0 right-0 shadow-lg flex bg-blue-600'>
        <div className='flex items-center gap-2 py-3 ml-5'>
             <img className='w-15 h-15' src={cloud} alt="" />
            <h1 className='text-2xl font-bold  text-white'>Weather App</h1>
        </div>
      
    </div>
  )
}

export default  Navbar
