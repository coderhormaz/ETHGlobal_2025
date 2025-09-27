import React from 'react';
import { motion } from 'framer-motion';

const EthereumBackground: React.FC = () => {
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  const connections = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], 
    [5, 6], [3, 7], [7, 8], [8, 9], [6, 10], [10, 11]
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Connection Lines */}
        {connections.map(([start, end], index) => (
          <motion.line
            key={`line-${index}`}
            x1={`${nodes[start].x}%`}
            y1={`${nodes[start].y}%`}
            x2={`${nodes[end].x}%`}
            y2={`${nodes[end].y}%`}
            stroke="url(#lineGradient)"
            strokeWidth="0.1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 0.6, 0] 
            }}
            transition={{
              duration: 4,
              delay: index * 0.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="0.15"
            fill="url(#nodeGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1], 
              opacity: [0, 0.8, 0.6] 
            }}
            transition={{
              duration: node.duration,
              delay: node.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Floating Ethereum Symbols */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          <motion.text
            x="20%"
            y="25%"
            fontSize="1.5"
            fill="#3B82F6"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            animate={{ 
              y: ["25%", "22%", "25%"],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Ξ
          </motion.text>
          <motion.text
            x="75%"
            y="70%"
            fontSize="1.2"
            fill="#06B6D4"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            animate={{ 
              y: ["70%", "67%", "70%"],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 6,
              delay: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Ξ
          </motion.text>
          <motion.text
            x="85%"
            y="20%"
            fontSize="0.8"
            fill="#3B82F6"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            animate={{ 
              y: ["20%", "18%", "20%"],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{
              duration: 10,
              delay: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Ξ
          </motion.text>
        </motion.g>
      </svg>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-950/5 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-cyan-950/5 to-transparent" />
    </div>
  );
};

export default EthereumBackground;