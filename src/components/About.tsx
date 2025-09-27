import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, TrendingUp, Users, Globe } from 'lucide-react';
import SectionHeading from './SectionHeading';

const About: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Trading',
      description: 'Our advanced AI algorithms analyze market conditions to provide optimal swap rates and timing.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute swaps in seconds with our optimized smart contracts and low-latency infrastructure.',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Shield,
      title: 'Secure & Trustless',
      description: 'Built on Ethereum with battle-tested security protocols. Your funds never leave your control.',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: TrendingUp,
      title: 'Best Rates',
      description: 'Get the most competitive rates by aggregating liquidity from multiple DEXs and protocols.',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Simple interface designed for both beginners and experienced DeFi users.',
      color: 'from-indigo-400 to-purple-400'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Available worldwide with no restrictions. Trade from anywhere, anytime.',
      color: 'from-teal-400 to-blue-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="About Eth AI"
          subtitle="Revolutionizing DeFi with artificial intelligence. Eth AI combines cutting-edge AI technology with decentralized finance to provide seamless, secure, and profitable cryptocurrency swaps."
        />

        {/* Main Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-blue-500/20"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">
                The Future of Cryptocurrency Trading
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Eth AI leverages advanced machine learning algorithms to optimize your USDC to Ethereum 
                swaps. Our platform monitors real-time market conditions, liquidity pools, and gas fees 
                to ensure you get the best possible rates every time you trade.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Built on the Ethereum blockchain, our solution is completely decentralized, ensuring 
                your assets remain secure and under your control throughout the entire trading process.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live & Operational</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">24/7 Trading</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/30">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🤖</div>
                  <h4 className="text-xl font-bold text-white">AI-Driven Intelligence</h4>
                  <p className="text-gray-300 text-sm">
                    Our AI processes over 1000+ market signals per second to optimize your trades
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">$10M+</div>
              <div className="text-gray-300 text-sm">Total Volume Traded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">50K+</div>
              <div className="text-gray-300 text-sm">Successful Swaps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300 text-sm">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">AI Monitoring</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;