import React, { useState } from 'react';
import { FaHome, FaUserCircle, FaUsers, FaCalendarWeek, FaList, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { icon: FaHome, text: 'Add Profile', path: '/' },
    { icon: FaUserCircle, text: 'All Profiles', path: '/profiles' },
    { icon: FaUsers, text: 'Schedule Matcher', path: '/schedule-matcher' },
    { icon: FaCalendarWeek, text: 'Weekly Schedule', path: '/weekly-schedule' },
    { icon: FaList, text: 'Reserved', path: '/reserved' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-blue-900 text-white p-2 rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-40
        w-64 h-screen bg-blue-900
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="bg-orange-500 p-6 text-center">
          <div className="mb-2">
            <div className="w-12 h-12 bg-white rounded-full mx-auto"></div>
          </div>
          <div className="text-white font-bold text-lg tracking-wide">JUICE</div>
          <div className="text-white font-bold text-base tracking-wide">TECK</div>
        </div>

        {/* Menu */}
        <ul className="list-none p-0 m-0 flex-1">
          {menuItems.map((item, index) => (
            <li key={index} className="flex items-center text-white p-5 border-b border-blue-800 cursor-pointer hover:bg-blue-800 transition-colors">
              <item.icon className="text-orange-500 mr-4 text-xl" />
              <Link 
                to={item.path} 
                className="text-white no-underline font-bold hover:text-orange-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 