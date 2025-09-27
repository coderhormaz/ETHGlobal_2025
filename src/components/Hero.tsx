import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, TrendingUp, Shield } from 'lucide-react';

interface HeroProps {
  onConnectWallet: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onConnectWallet, onLearnMore }) => {
  const [currentText, setCurrentText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = 'Welcome To Eth AI';

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
    }, 150);

    return () => clearInterval(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Professional Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(6,182,212,0.08)_0%,_transparent_50%)]"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Typing Animation Title */}
          <motion.div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {currentText}
              </span>
              {!isTypingComplete && (
                <motion.span 
                  className="text-cyan-400"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  |
                </motion.span>
              )}
            </h1>
            
            <motion.div 
              className="w-32 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isTypingComplete ? 128 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          {/* Description */}
          <motion.div
            variants={fadeInUp}
            className="space-y-6"
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Seamlessly swap your <span className="text-green-400 font-semibold">USDC</span> to{' '}
              <span className="text-blue-400 font-semibold">Ethereum</span> with the power of AI-driven optimization
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <motion.div 
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Zap className="text-yellow-400" size={18} />
                <span>Lightning Fast</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <TrendingUp className="text-green-400" size={18} />
                <span>Best Rates</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">Ξ</span>
                </div>
                <span>Ethereum Powered</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <motion.button
              onClick={onConnectWallet}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-xl shadow-blue-500/25 flex items-center gap-3 group border border-white/10 backdrop-blur-sm"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300">
                <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1"/>
                <polyline points="15,10 21,4 15,4 15,10"/>
              </svg>
              Connect Wallet
              <ChevronRight 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </motion.button>

            <motion.button
              onClick={onLearnMore}
              className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all duration-300 flex items-center gap-3 group backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              Learn More
            </motion.button>
          </motion.div>

          {/* Floating CTA Elements */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Explore Features</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronRight className="w-4 h-4 text-cyan-400 rotate-90" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;