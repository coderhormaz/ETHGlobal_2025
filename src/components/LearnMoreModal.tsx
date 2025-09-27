import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Wallet, ArrowRightLeft, CheckCircle, DollarSign } from 'lucide-react';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Wallet,
      title: 'Connect Your Wallet',
      description: 'Start by connecting your Web3 wallet or create a new one with just your email address.',
      details: [
        'Click "Let\'s Start" or "Connect Wallet" button',
        'Choose to connect existing wallet (MetaMask, WalletConnect) or create new one',
        'For new wallet: Enter your email and we\'ll generate a secure wallet',
        'Save your private key in a secure location',
        'Your wallet is now ready to use!'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: DollarSign,
      title: 'Add USDC to Your Wallet',
      description: 'Ensure you have USDC tokens in your wallet that you want to swap to Ethereum.',
      details: [
        'Check your wallet balance for USDC tokens',
        'If you don\'t have USDC, you can buy from exchanges like Coinbase, Binance',
        'Transfer USDC to your connected wallet address',
        'Minimum swap amount: $10 USDC',
        'Make sure you have some ETH for gas fees (~$5-20 depending on network)'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: ArrowRightLeft,
      title: 'Initiate the Swap',
      description: 'Use our AI-powered platform to get the best rates for your USDC to ETH swap.',
      details: [
        'Enter the amount of USDC you want to swap',
        'Our AI analyzes 50+ DEXs to find the best rate',
        'Review the swap details including fees and estimated gas',
        'Click "Swap" to initiate the transaction',
        'Confirm the transaction in your wallet'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: CheckCircle,
      title: 'Complete & Enjoy',
      description: 'Your swap is processed on-chain and ETH is delivered to your wallet automatically.',
      details: [
        'Wait for blockchain confirmation (usually 1-3 minutes)',
        'ETH will appear in your wallet automatically',
        'View transaction details on Etherscan',
        'Your swap history is saved in the platform',
        'Start your next swap anytime!'
      ],
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
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
            className="relative bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-blue-500/20 shadow-2xl shadow-blue-500/20"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                How to Use{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Eth AI
                </span>
              </h2>
              <p className="text-gray-400">
                Learn how to swap your USDC to Ethereum in just 4 simple steps
              </p>
              
              {/* Progress Bar */}
              <div className="flex items-center justify-center mt-6 space-x-2">
                {steps.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-1 mx-2 transition-all duration-300 ${
                          index < currentStep
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Step Icon and Title */}
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${steps[currentStep].color} flex items-center justify-center mb-4 shadow-lg`}>
                    {React.createElement(steps[currentStep].icon, { className: "text-white", size: 40 })}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    {steps[currentStep].description}
                  </p>
                </div>

                {/* Step Details */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <h4 className="text-lg font-semibold text-white mb-4">Step-by-Step Instructions:</h4>
                  <div className="space-y-3">
                    {steps[currentStep].details.map((detail, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 leading-relaxed">{detail}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tips Section */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                  <h4 className="text-cyan-400 font-semibold mb-2">💡 Pro Tips:</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    {currentStep === 0 && (
                      <>
                        <p>• Always save your private key in a secure password manager</p>
                        <p>• Never share your private key with anyone</p>
                        <p>• Consider using a hardware wallet for large amounts</p>
                      </>
                    )}
                    {currentStep === 1 && (
                      <>
                        <p>• Check gas prices before making transactions (use ETH Gas Station)</p>
                        <p>• Consider swapping during off-peak hours for lower fees</p>
                        <p>• Keep some ETH for future transactions</p>
                      </>
                    )}
                    {currentStep === 2 && (
                      <>
                        <p>• Our AI finds the best rates across 50+ DEXs automatically</p>
                        <p>• Larger swaps often get better rates due to economies of scale</p>
                        <p>• Set slippage tolerance based on market volatility</p>
                      </>
                    )}
                    {currentStep === 3 && (
                      <>
                        <p>• Transaction confirmations may take 1-3 minutes during network congestion</p>
                        <p>• You can track your transaction on Etherscan</p>
                        <p>• ETH will appear in your wallet automatically once confirmed</p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div className="text-center">
                <span className="text-gray-400 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Get Started
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LearnMoreModal;