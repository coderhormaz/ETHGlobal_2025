import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onConnectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate, onConnectWallet }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Tech Stack', id: 'tech' },
    { name: 'Contact', id: 'contact' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header 
      className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="relative mr-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/25 border border-white/10">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 784.37 1277.39" 
                  className="text-white drop-shadow-sm"
                  fill="currentColor"
                >
                  <g>
                    <polygon points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
                    <polygon points="392.07,0 0,650.54 392.07,882.29 392.07,472.33 "/>
                    <polygon points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
                    <polygon points="392.07,1277.38 392.07,956.52 0,724.89 "/>
                    <polygon points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
                    <polygon points="0,650.54 392.07,882.29 392.07,472.33 "/>
                  </g>
                </svg>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white mr-1 tracking-tight">Eth</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 tracking-tight">AI</span>
              <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-6 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg group ${
                  activeSection === item.id 
                    ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">{item.name}</span>
                {activeSection === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
            
            <motion.button
              onClick={onConnectWallet}
              className="ml-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/25 border border-white/10 backdrop-blur-sm"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.35)",
                y: -1
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1"/>
                  <polyline points="15,10 21,4 15,4 15,10"/>
                </svg>
                Let's Start
              </span>
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-white/10 bg-slate-800/50 backdrop-blur-xl rounded-b-2xl mx-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg mx-2 ${
                    activeSection === item.id 
                      ? 'text-white bg-white/10 border border-white/20' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => {
                  onConnectWallet();
                  setIsMenuOpen(false);
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25 w-fit mx-2 mt-2"
              >
                Let's Start
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;