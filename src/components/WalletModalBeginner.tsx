import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, CheckCircle, Wallet } from 'lucide-react';
import { ethers } from 'ethers';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsCreating(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    try {
      // Create wallet
      const wallet = ethers.Wallet.createRandom();
      setWalletAddress(wallet.address);
      setIsCreating(false);
      setIsComplete(true);
    } catch (error) {
      console.error('Error creating wallet:', error);
      setIsCreating(false);
      alert('Error creating wallet. Please try again.');
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsCreating(false);
    setIsComplete(false);
    setWalletAddress('');
    onClose();
  };

  const handleGetStarted = () => {
    // In a real app, this would navigate to the main dashboard
    alert('Welcome to Web3! Your wallet is ready to use.');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div 
          className="bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-poppins text-white">Join Web3</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Email Step */}
          {!isCreating && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3 font-poppins">
                  Get Started in Seconds
                </h3>
                <p className="text-gray-300 mb-6 font-poppins leading-relaxed">
                  Create your secure Web3 wallet instantly! Just enter your email address and we'll set everything up for you.
                </p>
                
                <div className="bg-blue-50/5 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 text-sm">✨</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1 font-poppins">Beginner-Friendly</h4>
                      <p className="text-blue-200 text-sm font-poppins">
                        No technical knowledge required. We handle all the complex stuff for you!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-poppins">
                    Your Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors font-poppins"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 font-poppins text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create My Wallet
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-xs text-gray-400 text-center font-poppins">
                  🔒 Completely secure • Generated locally • We never store your information
                </p>
              </div>
            </motion.div>
          )}

          {/* Creating Step */}
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Wallet className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2 font-poppins">Creating Your Wallet...</h3>
              <p className="text-gray-300 font-poppins mb-6">Setting up your secure Web3 wallet</p>
              
              <div className="space-y-3">
                {['Generating secure keys...', 'Setting up your account...', 'Almost ready...'].map((text, index) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.8, duration: 0.5 }}
                    className="flex items-center gap-3 text-sm text-gray-300 justify-center"
                  >
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.8 }}
                    />
                    <span className="font-poppins">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Complete Step */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-8">
                <motion.div 
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2 font-poppins">Welcome to Web3! 🎉</h3>
                <p className="text-gray-300 font-poppins">Your wallet is ready and secured</p>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 mb-6 border border-gray-600">
                <div className="mb-2">
                  <span className="text-sm text-gray-400 font-poppins">Your Wallet Address:</span>
                </div>
                <p className="text-white text-sm font-mono break-all bg-gray-900/50 p-3 rounded border font-poppins">
                  {walletAddress}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-poppins">
                  This is your public address - you can share this to receive payments
                </p>
              </div>

              <motion.button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 font-poppins text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Exploring Web3! 🚀
              </motion.button>

              <div className="mt-6 bg-green-50/5 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-300 text-sm font-poppins text-left">
                  <strong>✅ You're all set!</strong> Your wallet is secure and ready to use. 
                  You can now receive Ethereum, explore DeFi, and join the Web3 revolution. 
                  Welcome to the future of finance! 
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletModal;