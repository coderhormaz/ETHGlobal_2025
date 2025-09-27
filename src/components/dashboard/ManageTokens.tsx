import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllTokenBalances } from '../../lib/polygon';

interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
  balance: string;
  balanceUSD: string;
}

const ManageTokens: React.FC = () => {
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { wallet } = useAuth();

  const fetchTokenBalances = async () => {
    if (!wallet?.address) return;
    
    setLoading(true);
    try {
      const balances = await getAllTokenBalances(wallet.address);
      setTokens(balances);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching token balances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenBalances();
  }, [wallet?.address]);

  const totalPortfolioValue = tokens.reduce((sum, token) => {
    return sum + parseFloat(token.balanceUSD || '0');
  }, 0);

  const handleRefresh = () => {
    fetchTokenBalances();
  };

  if (!wallet) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Coins size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Wallet Not Connected</h2>
          <p className="text-gray-400">Please connect your wallet to view token balances.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
              <Coins size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Manage Tokens</h1>
              <p className="text-sm text-gray-400">Your Polygon token portfolio</p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="p-6 border-b border-white/10 bg-black/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Portfolio Value */}
          <motion.div
            className="glass-premium rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <DollarSign size={20} className="text-green-400" />
              <h3 className="font-medium text-white">Total Portfolio Value</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              ${totalPortfolioValue.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </motion.div>

          {/* Top Performing Token */}
          <motion.div
            className="glass-premium rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={20} className="text-green-400" />
              <h3 className="font-medium text-white">Best Performer</h3>
            </div>
            <p className="text-lg font-bold text-green-400">MATIC</p>
            <p className="text-sm text-gray-400">+12.5% (24h)</p>
          </motion.div>

          {/* Token Count */}
          <motion.div
            className="glass-premium rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Coins size={20} className="text-blue-400" />
              <h3 className="font-medium text-white">Tokens Held</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {tokens.filter(token => parseFloat(token.balance) > 0).length}
            </p>
            <p className="text-sm text-gray-400">Active tokens</p>
          </motion.div>
        </div>
      </div>

      {/* Token List */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Your Tokens</h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-premium rounded-xl p-6 border border-white/10 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-600 rounded w-20 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tokens.map((token, index) => (
              <motion.div
                key={token.address}
                className="glass-premium rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={token.logoUrl}
                      alt={token.symbol}
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/48/48';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-white">{token.symbol}</h3>
                      <p className="text-sm text-gray-400">{token.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {parseFloat(token.balance).toFixed(4)} {token.symbol}
                    </p>
                    <p className="text-sm text-gray-400">
                      ${parseFloat(token.balanceUSD || '0').toFixed(2)}
                    </p>
                    
                    {/* Price change indicator (dummy data) */}
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {Math.random() > 0.5 ? (
                        <>
                          <TrendingUp size={12} className="text-green-400" />
                          <span className="text-xs text-green-400">
                            +{(Math.random() * 10).toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown size={12} className="text-red-400" />
                          <span className="text-xs text-red-400">
                            -{(Math.random() * 5).toFixed(1)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar for balance visualization */}
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(parseFloat(token.balance) / 1000 * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {tokens.length === 0 && !loading && (
              <div className="text-center py-12">
                <Coins size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Tokens Found</h3>
                <p className="text-gray-400">
                  Your wallet doesn't have any tokens yet, or they haven't been loaded.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTokens;