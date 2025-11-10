'use client'


import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle registration logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Circuit pattern */}
              <path d="M45 15C45 15 50 15 52 17C54 19 54 22 54 22" stroke="#4DB8C4" strokeWidth="2" fill="none"/>
              <circle cx="54" cy="22" r="2" fill="#4DB8C4"/>
              <path d="M35 18C35 18 38 18 40 20C42 22 42 25 42 25" stroke="#4DB8C4" strokeWidth="2" fill="none"/>
              <circle cx="42" cy="25" r="2" fill="#4DB8C4"/>
              <path d="M48 28C48 28 50 28 51 29C52 30 52 32 52 32" stroke="#4DB8C4" strokeWidth="2" fill="none"/>
              <circle cx="52" cy="32" r="1.5" fill="#4DB8C4"/>
              
              {/* PM Text */}
              <text x="15" y="55" fontSize="36" fontWeight="bold" fill="#9B8B7E">P</text>
              <text x="40" y="55" fontSize="36" fontWeight="bold" fill="#9B8B7E">M</text>
            </svg>
          </div>
          <h1 className="text-4xl font-bold" style={{ color: '#4DB8C4' }}>POSMind</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Daftar</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Silakan masukkan data Anda untuk melanjutkan
          </p>

          <div>
            {/* Nama Bisnis */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Nama Bisnis
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Masukkan Nama Bisnis"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>

            {/* No. Telepon */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                No. Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Masukkan Nomor Telepon"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan Kata Sandi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#4DB8C4' }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="inline-block"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}