import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, TrendingUp, Users, Globe } from 'lucide-react';
import SectionHeading from './SectionHeading';

const About: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Natural Language Trading',
      description: 'Simply say "Swap 10 USDC to ETH" and our AI agent executes the trade across Polygon, Ethereum, Arbitrum, and Base networks.',
      color: 'from-purple-500 to-pink-500',
      delay: 0
    },
    {
      icon: Zap,
      title: 'Instant Price Discovery',
      description: 'Ask "What\'s ETH price?" and get real-time data from Pyth Oracle with live market analysis and trading insights.',
      color: 'from-yellow-500 to-orange-500',
      delay: 0.1
    },
    {
      icon: Shield,
      title: 'Secure Wallet Management',
      description: 'AI-managed wallets created via email signup, stored securely in database with full private key access and withdrawal controls.',
      color: 'from-emerald-500 to-teal-500',
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: 'Uniswap SDK Integration',
      description: 'Powered by Uniswap SDK for optimal liquidity routing and best execution prices across multiple DEX aggregators.',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.3
    },
    {
      icon: Users,
      title: 'Multi-Chain Support',
      description: 'Trade seamlessly across Polygon, Ethereum, Arbitrum, and Base with automatic network switching and gas optimization.',
      color: 'from-indigo-500 to-purple-500',
      delay: 0.4
    },
    {
      icon: Globe,
      title: 'Email-Based Authentication',
      description: 'Simple signup with email creates your trading wallet automatically. Add funds, withdraw, and export private keys securely.',
      color: 'from-teal-500 to-blue-500',
      delay: 0.5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="AI Trading Agent"
          subtitle="Your intelligent blockchain companion that understands natural language commands, executes multi-chain trades, and manages your digital assets with enterprise-grade security."
        />

        {/* Hero Content Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="glass-premium rounded-3xl p-8 lg:p-12 mb-20 border border-white/8 shadow-floating"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Conversational
                  <span className="gradient-text-premium"> Blockchain Trading</span>
                </h3>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  Our AI agent transforms complex blockchain interactions into simple conversations. 
                  Just tell it what you want to do in plain English.
                </p>
                
                <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                    <p><strong className="text-blue-400">"Swap 10 USDC to ETH"</strong> → AI executes across best available DEX</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                    <p><strong className="text-purple-400">"What's ETH price?"</strong> → Real-time data from Pyth Oracle</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                    <p><strong className="text-green-400">"Add funds to wallet"</strong> → Secure deposit with private key control</p>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3 glass-subtle px-4 py-2 rounded-full">
                  <div className="status-indicator online"></div>
                  <span className="text-sm font-medium text-gray-300">Network Operational</span>
                </div>
                <div className="flex items-center gap-3 glass-subtle px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-300">AI Models Active</span>
                </div>
                <div className="flex items-center gap-3 glass-subtle px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-breathe"></div>
                  <span className="text-sm font-medium text-gray-300">Real-time Analysis</span>
                </div>
              </div>
            </div>

            {/* AI Visualization */}
            <div className="relative">
              <motion.div 
                className="glass-elevated rounded-2xl p-8 text-center relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 bg-premium-dots opacity-10"></div>
                
                <div className="relative space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mx-auto w-20 h-20 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-premium"
                  >
                    <Brain size={32} className="text-white" />
                  </motion.div>
                  
                  <div className="space-y-3">
                    <h4 className="text-2xl font-bold gradient-text">AI Trading Engine</h4>
                    <p className="text-gray-400 leading-relaxed">
                      Natural language processing meets blockchain execution across 4 major networks
                    </p>
                  </div>

                  {/* Chain indicators */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="glass-subtle p-3 rounded-xl">
                      <div className="text-lg font-bold text-blue-400">4</div>
                      <div className="text-xs text-gray-500">Networks</div>
                    </div>
                    <div className="glass-subtle p-3 rounded-xl">
                      <div className="text-lg font-bold text-purple-400">24/7</div>
                      <div className="text-xs text-gray-500">Active</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="card-premium group cursor-default"
              >
                <div className="space-y-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-premium group-hover:shadow-floating transition-all duration-300`}>
                    <feature.icon className="text-white" size={30} />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Premium Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-elevated rounded-3xl p-8 lg:p-12 border border-white/5"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Trusted <span className="gradient-text">Multi-Chain Platform</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience seamless trading across Polygon, Ethereum, Arbitrum, and Base with AI-powered intelligence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 'Polygon', label: 'Low-cost trades', color: 'text-purple-400' },
              { value: 'Ethereum', label: 'Maximum liquidity', color: 'text-blue-400' },
              { value: 'Arbitrum', label: 'Fast execution', color: 'text-cyan-400' },
              { value: 'Base', label: 'Coinbase ecosystem', color: 'text-emerald-400' }
            ].map(({ value, label, color }, index) => (
              <motion.div
                key={label}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-4xl lg:text-5xl font-bold ${color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {value}
                </div>
                <div className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;