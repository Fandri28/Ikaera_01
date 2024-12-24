"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Use usePathname for route detection
import 'bootstrap-icons/font/bootstrap-icons.css';

// Interface for menu items
interface MenuItem {
  name: string;
  href: string;
  key: string;
  icon?: string; // Icon is optional
  onClick?: () => void; // onClick is optional
}

const Navbar: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null); // State for storing email
  const pathname = usePathname(); // Use usePathname to get the current route

  useEffect(() => {
    // Get the role and email from localStorage
    const storedRole = localStorage.getItem('userRole');
    const storedEmail = localStorage.getItem('userEmail');
    setRole(storedRole);
    setEmail(storedEmail); // Set email to state
  }, []);

  const handleLogout = () => {
    // Remove the role and email from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    // Reset the role and email state to null
    setRole(null);
    setEmail(null);
    // Redirect to the login page
    window.location.href = '/';
  };

  const menuItemsDefault: MenuItem[] = [
    { name: 'Login', href: '/', key: 'login', icon: 'bi-box-arrow-in-right' }, // Add icon here
    { name: 'Accueil', href: '/home', key: 'home' },
  ];

  const menuItemsAdmin: MenuItem[] = [
    { name: 'Accueil', href: '/home', key: 'home' },
    { name: 'Services', href: '/services', key: 'services' },
    { name: 'Contact', href: '/contact', key: 'contact' },
    { name: 'Admin', href: '/admin', key: 'admin' },
    { name: 'Logout', href: '#', key: 'logout', icon: 'bi-box-arrow-right', onClick: handleLogout },
  ];

  const menuItemsUser: MenuItem[] = [
    { name: 'Accueil', href: '/home', key: 'home' },
    { name: 'Services', href: '/services', key: 'services' },
    { name: 'Contact', href: '/contact', key: 'contact' },
    { name: 'Logout', href: '#', key: 'logout', icon: 'bi-box-arrow-right', onClick: handleLogout },
  ];

  // Define the menu based on role
  let menuItems: MenuItem[] = menuItemsDefault;
  if (role === 'admin') {
    menuItems = menuItemsAdmin;
  } else if (role === 'utilisateur') {
    menuItems = menuItemsUser;
  }

  // Get the first letter of the email
  const firstLetter = email ? email.charAt(0).toUpperCase() : '';

  return (
    <div    >
      <nav style={{  zIndex: 20 }} className="fixed top-0 px-5 mb-5 bg-white flex justify-between items-center p-1 w-full z-10 shadow-[0_4px_2px_0_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-8">
          <p className="text-2xl font-bold text-[#ACA982]">
            IKAERA
            <span className="block text-[#0057AB] text-lg font-normal">Consulting</span>
          </p>
          <ul className="flex items-center gap-6">
            {menuItems.slice(0, menuItems.length - 1).map((item) => (
              <li key={item.key}>
                <Link href={item.href} passHref>
                  <button
                    className={`text-[#2f4757] hover:underline hover:text-[#0057AB] ${item.key === 'admin' && pathname.startsWith('/admin') ? 'text-blue-500 font-bold' : pathname === item.href ? 'text-blue-500 font-bold' : ''
                      }`}
                    onClick={() => { }}
                  >
                    {item.icon && <i className={`bi ${item.icon}`} style={{ fontSize: '20px', marginRight: '5px' }}></i>}
                    {item.name}
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="flex items-center gap-6">
            {menuItems
              .filter((item) => item.key === 'logout')
              .map((item) => (
                <li key={item.key}>
                  <button
                    className="flex items-center gap-2 text-[#2f4757] hover:underline hover:text-[#0057AB]"
                    onClick={item.onClick}
                  >
                    <i className={`bi ${item.icon}`} style={{ fontSize: '25px' }}></i>
                    {item.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </nav>

      {email && (
  <div className="fixed top-16 right-6 p-3 bg-white flex items-center gap-2">
    <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
      {firstLetter}
    </div>
    <div className="text-[10px] text-gray-500 uppercase">{email}</div> {/* Smaller font size */}
  </div>
)}

    </div>
  );
};

export default Navbar;
