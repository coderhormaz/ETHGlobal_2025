import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Shield, Brain } from 'lucide-react';
import SectionHeading from './SectionHeading';

const TechStack: React.FC = () => {
  const techCategories = [
    {
      title: 'Frontend',
      icon: Code,
      color: 'from-blue-400 to-cyan-400',
      technologies: ['React', 'TypeScript', 'Framer Motion', 'Vite']
    },
    {
      title: 'Blockchain',
      icon: Shield,
      color: 'from-purple-400 to-pink-400',
      technologies: ['Ethereum', 'Ethers.js', 'Smart Contracts', 'MetaMask']
    },
    {
      title: 'AI & Analytics',
      icon: Brain,
      color: 'from-green-400 to-emerald-400',
      technologies: ['Machine Learning', 'Real-time Analytics', 'Pattern Recognition', 'Risk Assessment']
    },
    {
      title: 'Infrastructure',
      icon: Database,
      color: 'from-yellow-400 to-orange-400',
      technologies: ['Node.js', 'Web3 APIs', 'IPFS', 'GraphQL']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="tech" className="py-20 bg-gradient-to-b from-slate-900 to-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Our Tech Stack"
          subtitle="Built with cutting-edge technologies to deliver the most reliable, secure, and efficient DeFi trading experience."
          gradient="from-purple-400 to-pink-400"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Category Header */}
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>

              {/* Technologies List */}
              <div className="space-y-2">
                {category.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={techIndex}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: techIndex * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Compact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Version 2.1.0</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Built for Scale</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Enterprise Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;