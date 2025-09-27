import React from 'react';
import { motion } from 'framer-motion';

interface FooterProps {
  scrollToSection: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ scrollToSection }) => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black border-t border-gray-800/50 overflow-hidden z-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* Ethereum Logo SVG */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg">
                <svg
                  viewBox="0 0 784.37 1277.39"
                  className="w-full h-full"
                  fill="currentColor"
                >
                  <g transform="translate(-292.06 -134.81)">
                    <polygon
                      points="684.24 671.45 976.38 694.43 684.24 1412.2 684.24 1012.54 684.24 671.45"
                      fill="#627EEA"
                    />
                    <polygon
                      points="684.24 671.45 684.24 1012.54 684.24 1412.2 392.11 694.43 684.24 671.45"
                      fill="#fff"
                      fillOpacity="0.6"
                    />
                    <polygon
                      points="684.24 134.81 684.24 539.22 684.24 602.69 976.38 663.48 684.24 134.81"
                      fill="#627EEA"
                    />
                    <polygon
                      points="684.24 134.81 392.11 663.48 684.24 602.69 684.24 539.22 684.24 134.81"
                      fill="#fff"
                      fillOpacity="0.6"
                    />
                  </g>
                </svg>
              </div>
              <span className="font-poppins font-bold text-3xl text-white">
                Eth AI
              </span>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md font-poppins font-light">
              Democratizing Web3 access through intuitive tools and educational resources. 
              Join the future of decentralized technology, designed for everyone to understand and use.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <h4 className="font-poppins font-semibold text-white mb-4">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors font-poppins"
                />
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 font-poppins"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { name: 'Twitter', icon: '𝕏', color: 'hover:from-blue-500 hover:to-blue-600' },
                { name: 'Discord', icon: '💬', color: 'hover:from-purple-500 hover:to-indigo-600' },
                { name: 'GitHub', icon: '⚡', color: 'hover:from-gray-500 hover:to-gray-600' },
                { name: 'LinkedIn', icon: '💼', color: 'hover:from-blue-600 hover:to-blue-700' },
                { name: 'Telegram', icon: '✈️', color: 'hover:from-cyan-500 hover:to-blue-500' }
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href="#"
                  className={`w-14 h-14 bg-gray-800/50 ${social.color} rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-gray-700/50 hover:border-transparent group`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-poppins font-semibold text-xl text-white mb-6">
              Navigation
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Home', section: 'home' },
                { label: 'About Us', section: 'about' },
                { label: 'Technology', section: 'tech' },
                { label: 'Contact', section: 'contact' }
              ].map((link) => (
                <button
                  key={link.section}
                  onClick={() => scrollToSection(link.section)}
                  className="block w-full text-left text-gray-300 hover:text-white transition-all duration-300 font-poppins font-medium hover:translate-x-2 transform group"
                >
                  <span className="inline-flex items-center gap-2">
                    {link.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <h3 className="font-poppins font-semibold text-xl text-white mb-6">
              Products
            </h3>
            <div className="space-y-4">
              {[
                'Wallet Creation',
                'Token Swapping',
                'DeFi Dashboard',
                'NFT Marketplace',
                'Staking Platform'
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-300 hover:text-white transition-all duration-300 font-poppins font-medium hover:translate-x-2 transform group"
                >
                  <span className="inline-flex items-center gap-2">
                    {item}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="font-poppins font-semibold text-xl text-white mb-6">
              Resources
            </h3>
            <div className="space-y-4">
              {[
                'Documentation',
                'API Reference', 
                'Video Tutorials',
                'Community Forum',
                'Developer Support',
                'Whitepaper',
                'Security Audit'
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-300 hover:text-white transition-all duration-300 font-poppins font-medium hover:translate-x-2 transform group"
                >
                  <span className="inline-flex items-center gap-2">
                    {item}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 text-gray-400 text-sm font-poppins">
            <span>© {currentYear} Eth AI. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
          
          <div className="text-gray-400 text-sm flex items-center gap-2 font-poppins">
            <span>Built with</span>
            <motion.span 
              className="text-red-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              ❤️
            </motion.span>
            <span>for the Web3 community</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;