import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Wallet, 
  TrendingUp, 
  RefreshCw, 
  DollarSign,
  Clock,
  ExternalLink,
  TrendingDown
} from 'lucide-react';
import AIAgentChat from './AIAgentChat';
import WalletSetup from './WalletSetup';
import { useAuth } from '../../contexts/AuthContext';
import UniswapService from '../../lib/uniswap';
import priceService, { type TokenPrice } from '../../lib/priceService';

const AIAgentMain: React.FC = () => {
  const { wallet: authWallet } = useAuth();
  const [showWalletSetup, setShowWalletSetup] = useState(false);
  const [walletBalance, setWalletBalance] = useState<{[key: string]: string}>({});
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [tokenPrices, setTokenPrices] = useState<{[key: string]: TokenPrice}>({});
  const [isPricesLoading, setIsPricesLoading] = useState(false);

  // Refresh balances and prices when wallet changes
  useEffect(() => {
    if (authWallet && authWallet.privateKey !== '***encrypted***') {
      refreshBalances();
      refreshPrices();
      
      // Set up price refresh interval (every 2 minutes)
      const priceInterval = setInterval(refreshPrices, 120000);
      return () => clearInterval(priceInterval);
    }
  }, [authWallet]);

  const refreshBalances = async () => {
    if (!authWallet || authWallet.privateKey === '***encrypted***') return;
    
    setIsRefreshingBalance(true);
    try {
      const tokens = ['POL', 'ETH', 'USDC', 'USDT'];
      const balances: {[key: string]: string} = {};
      
      for (const token of tokens) {
        const balance = await UniswapService.getTokenBalance(token, authWallet.address);
        if (balance) {
          balances[token] = balance;
        }
      }
      
      setWalletBalance(balances);
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
    setIsRefreshingBalance(false);
  };

  // Fetch real-time prices
  const refreshPrices = async () => {
    setIsPricesLoading(true);
    try {
      const tokens = ['POL', 'ETH', 'USDC', 'USDT'];
      const prices = await priceService.getTokenPrices(tokens);
      setTokenPrices(prices);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
    setIsPricesLoading(false);
  };

  const handleUnlockWallet = async () => {
    // Wallet is already unlocked by WalletSetup component
    // Just close the modal and let the useEffect handle the rest
    setShowWalletSetup(false);
  };

  const handleWalletRequired = () => {
    if (authWallet && authWallet.privateKey === '***encrypted***') {
      // Wallet exists but is encrypted - need password to unlock
      setShowWalletSetup(true);
    } else {
      // No wallet at all - this shouldn't happen if user is authenticated
      console.error('No wallet found for authenticated user');
    }
  };

  const formatBalance = (balance: string, decimals: number = 4): string => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    return num.toFixed(decimals);
  };

  // Check if wallet is ready (exists and is decrypted)
  const isWalletReady = authWallet && authWallet.privateKey !== '***encrypted***';

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence>
        {showWalletSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setShowWalletSetup(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <WalletSetup
                onWalletUnlocked={handleUnlockWallet}
                onClose={() => setShowWalletSetup(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 2xl:w-[28rem] glass-premium lg:border-r border-white/10 flex flex-col lg:min-h-0 max-h-[40vh] lg:max-h-none overflow-auto lg:overflow-visible">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-brand-gradient rounded-2xl flex items-center justify-center">
                <Bot className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-white">AI Trading Agent</h1>
                <p className="text-gray-400 text-xs lg:text-sm">Powered by Gemini AI</p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2 p-2 lg:p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs lg:text-sm font-medium">Connected to Polygon</span>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="p-4 lg:p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base lg:text-lg font-semibold text-white flex items-center gap-2">
                <Wallet size={16} className="lg:hidden xl:inline" />
                <Wallet size={18} className="hidden lg:inline xl:hidden" />
                <Wallet size={18} className="hidden xl:inline" />
                <span className="hidden sm:inline">Wallet</span>
              </h2>
              {isWalletReady && (
                <button
                  onClick={() => {
                    refreshBalances();
                    refreshPrices();
                  }}
                  disabled={isRefreshingBalance || isPricesLoading}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Refresh balances and prices"
                >
                  <RefreshCw size={16} className={(isRefreshingBalance || isPricesLoading) ? 'animate-spin' : ''} />
                </button>
              )}
            </div>

            {isWalletReady ? (
              <div className="space-y-4">
                {/* Wallet Address */}
                <div className="p-3 bg-black/30 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-xs mb-1">Address</p>
                  <p className="text-white text-sm font-mono truncate">
                    {authWallet.address}
                  </p>
                  <a
                    href={`https://polygonscan.com/address/${authWallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 text-xs mt-2 hover:text-blue-300"
                  >
                    <ExternalLink size={12} />
                    View on Polygonscan
                  </a>
                </div>

                {/* Token Balances */}
                <div className="space-y-2">
                  <h3 className="text-white font-medium text-sm">Token Balances</h3>
                  {Object.entries(walletBalance).map(([token, balance]) => {
                    const price = tokenPrices[token];
                    const balanceNum = parseFloat(balance) || 0;
                    const value = price ? balanceNum * price.price : 0;
                    
                    return (
                      <div key={token} className="p-2 bg-black/20 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {token === 'POL' ? 'P' : token[0]}
                              </span>
                            </div>
                            <span className="text-white text-sm font-medium">{token}</span>
                            {price && (
                              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${
                                price.change24h >= 0 
                                  ? 'bg-green-500/10 text-green-400' 
                                  : 'bg-red-500/10 text-red-400'
                              }`}>
                                {price.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {Math.abs(price.change24h).toFixed(1)}%
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-gray-300 text-sm">
                              {formatBalance(balance)}
                            </div>
                            {price && value > 0 && (
                              <div className="text-gray-500 text-xs">
                                ${value.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                        {price && (
                          <div className="text-gray-400 text-xs">
                            ${price.price.toFixed(price.price < 1 ? 4 : 2)} per {token}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {Object.keys(walletBalance).length === 0 && !isRefreshingBalance && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No balances to display
                    </p>
                  )}
                  
                  {(isRefreshingBalance || isPricesLoading) && (
                    <div className="text-center py-4">
                      <RefreshCw className="w-4 h-4 text-blue-400 animate-spin mx-auto" />
                      <p className="text-gray-400 text-xs mt-1">
                        {isRefreshingBalance ? 'Updating balances...' : 'Loading prices...'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Wallet Status */}
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm font-medium">Wallet Ready</span>
                </div>
              </div>
            ) : authWallet ? (
              // Wallet exists but is encrypted
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto border border-yellow-500/30">
                  <Wallet className="text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Wallet Locked</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Enter your password to unlock your wallet for AI trading
                  </p>
                  <button
                    onClick={() => setShowWalletSetup(true)}
                    className="btn-premium w-full py-2 text-sm"
                  >
                    Unlock Wallet
                  </button>
                </div>
              </div>
            ) : (
              // No wallet (shouldn't happen for authenticated users)
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto">
                  <Wallet className="text-gray-400" size={24} />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">No Wallet Found</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Something went wrong. Please sign out and sign back in.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="p-4 lg:p-6 flex-1 hidden lg:block">
            <h2 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Features</h2>
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-black/20 rounded-xl">
                <TrendingUp className="text-blue-400" size={14} />
                <div>
                  <p className="text-white text-xs lg:text-sm font-medium">Smart Trading</p>
                  <p className="text-gray-400 text-xs">Natural language swap commands</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-black/20 rounded-xl">
                <DollarSign className="text-green-400" size={14} />
                <div>
                  <p className="text-white text-xs lg:text-sm font-medium">Real-time Prices</p>
                  <p className="text-gray-400 text-xs">Live Uniswap V3 quotes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-black/20 rounded-xl">
                <Clock className="text-purple-400" size={14} />
                <div>
                  <p className="text-white text-xs lg:text-sm font-medium">Auto Execution</p>
                  <p className="text-gray-400 text-xs">Automated transaction signing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-w-0 lg:min-h-0">
          <AIAgentChat 
            wallet={isWalletReady ? authWallet : null} 
            onWalletRequired={handleWalletRequired}
          />
        </div>
      </div>
    </div>
  );
};

export default AIAgentMain;