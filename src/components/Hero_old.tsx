import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, ArrowDown, Brain, MessageCircle, DollarSign } from 'lucide-react';

interface HeroProps {
  onConnectWallet: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onConnectWallet, onLearnMore }) => {
  const [currentText, setCurrentText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
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

  // ETH Logo SVG component
  const EthLogo = () => (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 256 417"
      className="absolute opacity-20"
      initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        scale: [0.8, 1.1, 0.8],
        rotate: [-15, 15, -15]
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <defs>
        <linearGradient id="ethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#627EEA" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#8A92F7" stopOpacity="1" />
          <stop offset="70%" stopColor="#A855F7" stopOpacity="1" />
          <stop offset="100%" stopColor="#627EEA" stopOpacity="0.8" />
        </linearGradient>
        <filter id="ethGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="shine" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <motion.g
        filter="url(#ethGlow)"
        animate={{
          filter: [
            "drop-shadow(0 0 10px rgba(98, 126, 234, 0.6))",
            "drop-shadow(0 0 30px rgba(168, 85, 247, 0.8))",
            "drop-shadow(0 0 20px rgba(138, 146, 247, 0.7))",
            "drop-shadow(0 0 10px rgba(98, 126, 234, 0.6))"
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
          fill="url(#ethGradient)"
        />
        <path
          d="M127.962 0L0 212.32l127.962 75.639V154.158z"
          fill="url(#ethGradient)"
          fillOpacity="0.7"
        />
        <path
          d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
          fill="url(#ethGradient)"
        />
        <path
          d="M127.962 416.905v-104.72L0 236.585z"
          fill="url(#ethGradient)"
          fillOpacity="0.7"
        />
        <path
          d="M127.961 287.958l127.96-75.637-127.96-58.162z"
          fill="url(#ethGradient)"
          fillOpacity="0.4"
        />
        <path
          d="M0 212.32l127.96 75.638v-133.8z"
          fill="url(#ethGradient)"
          fillOpacity="0.6"
        />
        {/* Shine overlay */}
        <ellipse
          cx="128"
          cy="150"
          rx="100"
          ry="120"
          fill="url(#shine)"
          opacity="0.8"
        />
      </motion.g>
    </motion.svg>
  );

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Premium Dark Background with Sophisticated Gradients */}
      <div className="absolute inset-0 bg-premium-mesh">
        {/* Layered gradient backgrounds for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(37,99,235,0.15)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(6,182,212,0.12)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,_rgba(16,185,129,0.08)_0%,_transparent_40%)]"></div>
        
        
        {/* Large Static ETH Logo in Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15">
          <svg
            width="400"
            height="400"
            viewBox="0 0 256 417"
            className="static-eth-logo"
          >
            <defs>
              <linearGradient id="centerEthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#627EEA" stopOpacity="0.3" />
                <stop offset="30%" stopColor="#8A92F7" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#A855F7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#627EEA" stopOpacity="0.3" />
              </linearGradient>
              <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#centerGlow)">
              <path
                d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
                fill="url(#centerEthGradient)"
              />
              <path
                d="M127.962 0L0 212.32l127.962 75.639V154.158z"
                fill="url(#centerEthGradient)"
                fillOpacity="0.8"
              />
              <path
                d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
                fill="url(#centerEthGradient)"
              />
              <path
                d="M127.962 416.905v-104.72L0 236.585z"
                fill="url(#centerEthGradient)"
                fillOpacity="0.8"
              />
              <path
                d="M127.961 287.958l127.96-75.637-127.96-58.162z"
                fill="url(#centerEthGradient)"
                fillOpacity="0.5"
              />
              <path
                d="M0 212.32l127.96 75.638v-133.8z"
                fill="url(#centerEthGradient)"
                fillOpacity="0.7"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Premium Grid Pattern */}
      <div className="absolute inset-0 bg-premium-grid opacity-30"></div>

      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 8) % 80}%`,
              top: `${20 + (i * 12) % 60}%`,
              width: `${8 + (i % 3) * 4}px`,
              height: `${8 + (i % 3) * 4}px`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg backdrop-blur-sm"></div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center z-10">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-12"
        >
          {/* Minimal Premium Title */}
          <motion.div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
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
            
            {/* Minimal tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isTypingComplete ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-lg md:text-xl text-gray-300 font-light">
                Natural language trading across multiple chains
              </p>
            </motion.div>
          </motion.div>
          </motion.div>


            
            {/* AI Agent feature badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                { icon: Brain, label: 'AI-Powered Commands', color: 'purple' },
                { icon: MessageCircle, label: 'Natural Language', color: 'blue' },
                { icon: DollarSign, label: 'Price Discovery', color: 'green' },
              ].map(({ icon: Icon, label, color }, index) => (
                <motion.div
                  key={label}
                  className="glass-premium px-5 py-3 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-default group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon 
                      className={`${
                        color === 'purple' ? 'text-purple-400' :
                        color === 'blue' ? 'text-blue-400' : 'text-green-400'
                      } group-hover:scale-110 transition-transform duration-300`} 
                      size={18} 
                    />
                    <span className="font-medium text-gray-200">{label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Premium Action Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
          >
            <motion.button
              onClick={onConnectWallet}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-10 py-4 text-lg font-semibold rounded-2xl flex items-center gap-3 group shadow-2xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300"
              whileHover={{ 
                scale: 1.02, 
                y: -3,
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Brain 
                size={20} 
                className="group-hover:rotate-12 transition-transform duration-300 text-cyan-300"
              />
              <span>Start AI Trading</span>
              <ChevronRight 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </motion.button>

            <motion.button
              onClick={onLearnMore}
              className="btn-outline-premium px-10 py-4 text-lg font-semibold rounded-2xl flex items-center gap-3 group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-current rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              </div>
              <span>Learn More</span>
            </motion.button>
          </motion.div>

          {/* Statistics or Key Numbers */}
          <motion.div
            variants={fadeInUp}
            className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: '4 Chains', label: 'Multi-Chain Support', gradient: 'from-blue-400 to-cyan-400' },
              { number: '24/7', label: 'AI Agent Active', gradient: 'from-purple-400 to-pink-400' },
              { number: 'Real-time', label: 'Pyth Price Feeds', gradient: 'from-green-400 to-emerald-400' },
            ].map(({ number, label, gradient }, index) => (
              <motion.div
                key={label}
                className="glass-subtle p-6 rounded-2xl text-center group hover:glass-premium transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
                  {number}
                </div>
                <div className="text-gray-400 font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Explore Features</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:border-cyan-400 transition-colors duration-300 cursor-pointer"
              >
                <ArrowDown className="w-4 h-4 text-cyan-400" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;