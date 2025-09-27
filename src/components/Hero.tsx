import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onConnectWallet: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onConnectWallet, onLearnMore }) => {
  const [currentText, setCurrentText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fullText = 'AI Trading Agent';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setCurrentText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* Black Background with Grey Lines and Interactive Glow */}
      <div className="absolute inset-0">
        {/* Pure black base */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Grey grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(75,85,99,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(75,85,99,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Subtle grey dots at intersections */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60px_60px,rgba(75,85,99,0.15)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Interactive cursor glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.05) 40%, transparent 70%)`
          }}
        ></div>
        
        {/* Enhanced glow lines that follow cursor */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: `
              radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(59, 130, 246, 0.2) 0%, 
                rgba(59, 130, 246, 0.1) 30%, 
                transparent 60%
              ),
              radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(96, 165, 250, 0.3) 0%, 
                rgba(96, 165, 250, 0.1) 20%, 
                transparent 40%
              )
            `
          }}
        ></div>
      </div>
      
      {/* Premium ETH Logo with Enhanced Theme Matching */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-25">
        <motion.svg
          width="400"
          height="400"
          viewBox="0 0 256 417"
          className="eth-logo-premium-minimal"
          animate={{
            opacity: [0.2, 0.35, 0.2],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <defs>
            <linearGradient id="premiumMinimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#d1d5db" stopOpacity="1" />
              <stop offset="50%" stopColor="#f9fafb" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#d1d5db" stopOpacity="1" />
              <stop offset="100%" stopColor="#6b7280" stopOpacity="0.8" />
            </linearGradient>
            
            {/* Subtle glow filter */}
            <filter id="premiumMinimalGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Animated subtle shine */}
            <linearGradient id="subtleShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-100 -100;300 300;-100 -100"
                dur="6s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          
          <g filter="url(#premiumMinimalGlow)">
            {/* Main ETH diamond with premium grey gradient and darker blue stroke */}
            <path
              d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
              fill="url(#premiumMinimalGradient)"
              stroke="#2563eb"
              strokeWidth="2"
              strokeOpacity="0.9"
            />
            <path
              d="M127.962 0L0 212.32l127.962 75.639V154.158z"
              fill="url(#premiumMinimalGradient)"
              fillOpacity="0.85"
              stroke="#2563eb"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
            <path
              d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
              fill="url(#premiumMinimalGradient)"
              stroke="#2563eb"
              strokeWidth="2"
              strokeOpacity="0.9"
            />
            <path
              d="M127.962 416.905v-104.72L0 236.585z"
              fill="url(#premiumMinimalGradient)"
              fillOpacity="0.85"
              stroke="#2563eb"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
            <path
              d="M127.961 287.958l127.96-75.637-127.96-58.162z"
              fill="url(#premiumMinimalGradient)"
              fillOpacity="0.7"
              stroke="#2563eb"
              strokeWidth="2"
              strokeOpacity="0.7"
            />
            <path
              d="M0 212.32l127.96 75.638v-133.8z"
              fill="url(#premiumMinimalGradient)"
              fillOpacity="0.75"
              stroke="#2563eb"
              strokeWidth="2"
              strokeOpacity="0.7"
            />
            
            {/* Subtle shine overlay */}
            <g opacity="0.6">
              <path
                d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
                fill="url(#subtleShine)"
              />
              <path
                d="M127.962 0L0 212.32l127.962 75.639V154.158z"
                fill="url(#subtleShine)"
              />
              <path
                d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
                fill="url(#subtleShine)"
              />
              <path
                d="M127.962 416.905v-104.72L0 236.585z"
                fill="url(#subtleShine)"
              />
              <path
                d="M127.961 287.958l127.96-75.637-127.96-58.162z"
                fill="url(#subtleShine)"
              />
              <path
                d="M0 212.32l127.96 75.638v-133.8z"
                fill="url(#subtleShine)"
              />
            </g>
          </g>
        </motion.svg>
      </div>

      {/* Minimal Content */}
      <div className="max-w-4xl mx-auto px-6 text-center z-10">
        <div className="space-y-12">
          {/* Minimal Title */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-wide">
                <span className="gradient-text-minimal">
                  {currentText}
                </span>
                {!isTypingComplete && (
                  <motion.span 
                    className="text-blue-400 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </h1>
            </motion.div>
            
            {/* Simple tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isTypingComplete ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-lg md:text-xl text-gray-300 font-light">
                Natural language trading across multiple chains
              </p>
            </motion.div>
          </div>

          {/* Single Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isTypingComplete ? 1 : 0, y: isTypingComplete ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={onConnectWallet}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-3 text-lg font-medium rounded-full transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Trading
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;