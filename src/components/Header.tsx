import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

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
      className="fixed top-0 w-full z-[9999] glass-premium border-b border-white/5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Premium Logo Design */}
          <motion.div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="relative mr-3">
              {/* Main logo container with enhanced styling */}
              <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-premium border border-white/10 group-hover:shadow-floating transition-all duration-300">
                {/* Enhanced Ethereum logo */}
                <svg 
                  width="22" 
                  height="22" 
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
              
              {/* Animated glow effect */}
              <div className="absolute -inset-1 bg-brand-gradient rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-glow-pulse"></div>
            </div>
            
            {/* Brand text with premium styling */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white mr-1 tracking-tight">Eth</span>
              <span className="text-2xl font-bold gradient-text-premium tracking-tight">AI</span>
              
              {/* Status indicator */}
              <div className="ml-3 flex items-center gap-1.5">
                <div className="status-indicator online"></div>
                <span className="text-xs font-medium text-gray-400 hidden sm:block">Live</span>
              </div>
            </div>
          </motion.div>

          {/* Premium Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl group ${
                  activeSection === item.id 
                    ? 'text-white bg-white/8 backdrop-blur-sm border border-white/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="relative z-10 font-medium">{item.name}</span>
                
                {/* Active indicator with premium animation */}
                {activeSection === item.id && (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-brand-gradient rounded-full"></div>
                  </>
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            ))}
            
            {/* Premium CTA Button */}
            <motion.button
              onClick={onConnectWallet}
              className="ml-6 btn-premium flex items-center gap-2.5 focus-ring"
              whileHover={{ 
                scale: 1.02, 
                y: -1
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Zap size={16} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold">Connect Wallet</span>
            </motion.button>
          </nav>

          {/* Premium Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2.5 text-white rounded-xl hover:bg-white/10 transition-colors duration-200"
            onClick={toggleMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Premium Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden pb-4 glass-elevated rounded-2xl mx-4 mt-2 border border-white/5"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <nav className="flex flex-col space-y-1 p-3">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-xl ${
                    activeSection === item.id 
                      ? 'text-white bg-white/8 border border-white/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <div className="w-2 h-2 bg-brand-gradient rounded-full ml-auto"></div>
                  )}
                </motion.button>
              ))}
              
              <motion.button
                onClick={() => {
                  onConnectWallet();
                  setIsMenuOpen(false);
                }}
                className="btn-premium w-full justify-center mt-4 focus-ring"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Zap size={16} />
                Connect Wallet
              </motion.button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;