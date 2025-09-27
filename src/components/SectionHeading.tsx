import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  gradient = "from-blue-400 to-cyan-400",
  className = "" 
}) => {
  const words = title.split(' ');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`text-center mb-16 ${className}`}
    >
      <motion.h2 
        className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            className={index === words.length - 1 || index === words.length - 2 
              ? `text-transparent bg-clip-text bg-gradient-to-r ${gradient}` 
              : "text-white"
            }
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3 + index * 0.1,
              ease: "easeOut"
            }}
          >
            {word}{index < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </motion.h2>
      
      {/* Animated Underline */}
      <motion.div 
        className={`w-24 h-1 bg-gradient-to-r ${gradient} mx-auto rounded-full mb-8`}
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 96, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
      />
      
      {subtitle && (
        <motion.p 
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative Elements */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 -mt-4"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className={`w-32 h-32 bg-gradient-to-r ${gradient} rounded-full blur-3xl opacity-20`} />
      </motion.div>
    </motion.div>
  );
};

export default SectionHeading;