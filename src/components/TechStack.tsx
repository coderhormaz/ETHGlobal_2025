import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Shield, Brain, Cpu, Globe } from 'lucide-react';
import SectionHeading from './SectionHeading';

const TechStack: React.FC = () => {
  const techCategories = [
    {
      title: 'Frontend & UI',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      description: 'Modern, responsive interfaces built with industry-leading frameworks',
      technologies: [
        { name: 'React 18', description: 'Latest React with concurrent features' },
        { name: 'TypeScript', description: 'Type-safe development' },
        { name: 'Framer Motion', description: 'Fluid animations & interactions' },
        { name: 'Tailwind CSS', description: 'Premium styling system' }
      ]
    },
    {
      title: 'Multi-Chain Infrastructure',
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      description: 'Cross-chain trading across major Layer 1 and Layer 2 networks',
      technologies: [
        { name: 'Polygon', description: 'Low-cost, fast transactions' },
        { name: 'Ethereum', description: 'Maximum liquidity & security' },
        { name: 'Arbitrum', description: 'Layer 2 scaling solution' },
        { name: 'Base', description: 'Coinbase L2 ecosystem' }
      ]
    },
    {
      title: 'AI & Natural Language',
      icon: Brain,
      color: 'from-emerald-500 to-teal-500',
      description: 'Advanced AI for conversational blockchain interactions',
      technologies: [
        { name: 'GPT Integration', description: 'Natural language processing' },
        { name: 'Command Parser', description: 'Intent recognition system' },
        { name: 'Context Memory', description: 'Conversation state management' },
        { name: 'Auto Execution', description: 'Secure transaction handling' }
      ]
    },
    {
      title: 'DeFi & Trading',
      icon: Database,
      color: 'from-orange-500 to-yellow-500',
      description: 'Professional trading infrastructure with optimal execution',
      technologies: [
        { name: 'Uniswap SDK', description: 'DEX aggregation & routing' },
        { name: 'Pyth Oracle', description: 'Real-time price feeds' },
        { name: 'Gas Optimization', description: 'Cost-efficient transactions' },
        { name: 'MEV Protection', description: 'Front-running prevention' }
      ]
    },
    {
      title: 'Wallet & Security',
      icon: Cpu,
      color: 'from-pink-500 to-rose-500',
      description: 'Enterprise-grade wallet management and security',
      technologies: [
        { name: 'HD Wallets', description: 'Hierarchical deterministic keys' },
        { name: 'Email Auth', description: 'Simple signup process' },
        { name: 'Private Key Control', description: 'Full user ownership' },
        { name: 'Secure Storage', description: 'Encrypted database storage' }
      ]
    },
    {
      title: 'Backend & Database',
      icon: Globe,
      color: 'from-violet-500 to-purple-500',
      description: 'Scalable infrastructure for wallet and user management',
      technologies: [
        { name: 'Node.js', description: 'High-performance runtime' },
        { name: 'Database', description: 'Secure user & wallet storage' },
        { name: 'API Gateway', description: 'Unified service access' },
        { name: 'Real-time Sync', description: 'Live balance updates' }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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
    <section id="tech" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Technology Stack"
          subtitle="Built with cutting-edge AI and blockchain technologies to deliver conversational trading across Polygon, Ethereum, Arbitrum, and Base networks."
        />

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
        >
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={itemVariants}
              className="card-premium group h-full"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Category Header */}
              <div className="flex items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mr-4 shadow-premium group-hover:shadow-floating transition-all duration-300 group-hover:scale-110`}>
                  <category.icon className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Technologies List */}
              <div className="space-y-3">
                {category.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={techIndex}
                    className="group/tech flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-default"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-1.5 h-1.5 bg-brand-gradient rounded-full mt-2 flex-shrink-0 group-hover/tech:scale-125 transition-transform duration-200"></div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-200 group-hover/tech:text-white transition-colors duration-200">
                        {tech.name}
                      </div>
                      <div className="text-xs text-gray-500 group-hover/tech:text-gray-400 transition-colors duration-200">
                        {tech.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Stats & Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Version & Status Bar */}
          <div className="flex justify-center">
            <div className="glass-elevated rounded-2xl px-8 py-4 border border-white/5">
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <div className="status-indicator online"></div>
                  <span className="font-medium text-gray-300">Version 3.2.1</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-300">Production Ready</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="font-medium text-gray-300">Enterprise Grade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Conversational Interface', 
                description: 'Natural language commands for blockchain actions',
                color: 'text-blue-400'
              },
              { 
                title: 'Multi-Chain Router', 
                description: 'Optimal execution across 4 major networks',
                color: 'text-emerald-400'
              },
              { 
                title: 'Custodial Wallet System', 
                description: 'Email signup with full private key control',
                color: 'text-purple-400'
              }
            ].map((highlight, index) => (
              <motion.div
                key={highlight.title}
                className="glass-subtle p-6 rounded-2xl text-center group hover:glass-premium transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <h4 className={`font-bold ${highlight.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {highlight.title}
                </h4>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;