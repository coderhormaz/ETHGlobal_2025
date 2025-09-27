import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Wallet, Shield, CheckCircle } from 'lucide-react';
import { ethers } from 'ethers';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'email' | 'creating' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const createWallet = async () => {
    if (!isValidEmail) return;

    setStep('creating');

    // Simulate wallet creation process
    setTimeout(() => {
      const wallet = ethers.Wallet.createRandom();
      setWalletAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setWalletAddress('');
    setPrivateKey('');
    setIsValidEmail(false);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-blue-500/20 shadow-2xl shadow-blue-500/20"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {step === 'email' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                  <p className="text-gray-400">Enter your email to create a new Web3 wallet</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield size={16} />
                    <span>Your wallet will be encrypted and secured</span>
                  </div>

                  <button
                    onClick={createWallet}
                    disabled={!isValidEmail}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Wallet
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'creating' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Wallet className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Creating Your Wallet</h2>
                  <p className="text-gray-400">Please wait while we generate your secure wallet...</p>
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Wallet Created!</h2>
                  <p className="text-gray-400">Your Web3 wallet has been successfully created</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Wallet Address
                    </label>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                      <p className="text-cyan-400 text-sm font-mono break-all">{walletAddress}</p>
                      <button
                        onClick={() => copyToClipboard(walletAddress)}
                        className="text-xs text-gray-400 hover:text-cyan-400 mt-1"
                      >
                        Click to copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Private Key (Keep this secure!)
                    </label>
                    <div className="bg-gray-800 p-3 rounded-lg border border-red-500/30">
                      <p className="text-red-400 text-sm font-mono break-all">{privateKey}</p>
                      <button
                        onClick={() => copyToClipboard(privateKey)}
                        className="text-xs text-gray-400 hover:text-red-400 mt-1"
                      >
                        Click to copy
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-yellow-400 text-sm">
                      <strong>Important:</strong> Save your private key securely. This is the only way to access your wallet.
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                  >
                    Continue to Eth AI
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;