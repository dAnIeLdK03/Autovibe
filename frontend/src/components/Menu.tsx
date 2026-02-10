import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

interface MenuProps {
    label: string,
    onClick: () => void
}

const Menu: React.FC<MenuProps> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const navigate = useNavigate();

// Close the menu when clicking outside
useEffect(() => {
    const listener = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    document.addEventListener("mousedown", listener);
    return () => {
        document.removeEventListener("mousedown", listener);
    };
}, []);

    const menuItems: MenuProps[] = [
        {label: "Home", onClick: () => navigate("/Cars")},
        {label: "Profile", onClick: () => navigate("/profile")},
        {label: "My Cars", onClick: () => navigate("/cars/my")},
        {label: "Logout", onClick: () => navigate("/logout")},
      //{label: " Settings", onClick: () => navigate("/settings")},
    ]

   
  return (
  <div className="ml-auto relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleMenu}
        className="ml-0 flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors shadow-sm text-white hover:bg-gray-600"
        aria-label="Toggle Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu