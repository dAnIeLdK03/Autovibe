import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
    label: string;
    onClick: () => void;
}

const Menu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, []);

    const menuItems: MenuItem[] = [
        { label: "Home", onClick: () => navigate("/cars") },
        { label: "Profile", onClick: () => navigate("/profile") },
        { label: "My Cars", onClick: () => navigate("/cars/my") },
        { label: "Logout", onClick: () => navigate("/logout") },
    ];

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 
                ${isOpen ? 'bg-slate-700 text-[#70FFE2]' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
                aria-label="Toggle Menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-slate-800 border border-slate-700 shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div className="py-1">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-[#70FFE2] transition-colors border-b border-slate-700/50 last:border-0"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;