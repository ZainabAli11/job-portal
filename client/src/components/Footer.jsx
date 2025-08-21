import React from 'react'
import assets from '../assets/assets'

const Footer = () => {
  return (
    <footer className="w-full bg-blue-100 text-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <img width={160} src={assets.logo} alt="logo" className="opacity-90" />

        {/* Copyright */}
        <p className="text-sm text-gray-600 text-center sm:text-left">
          © 2025 Insider Jobs. All Rights Reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-5">
          <img
            width={32}
            src={assets.facebook_icon}
            alt="facebook"
            className="hover:scale-110 hover:opacity-80 transition duration-300 cursor-pointer"
          />
          <img
            width={32}
            src={assets.twitter_icon}
            alt="twitter"
            className="hover:scale-110 hover:opacity-80 transition duration-300 cursor-pointer"
          />
          <img
            width={32}
            src={assets.instagram_icon}
            alt="instagram"
            className="hover:scale-110 hover:opacity-80 transition duration-300 cursor-pointer"
          />
        </div>
      </div>

    </footer>
  )
}

export default Footer
