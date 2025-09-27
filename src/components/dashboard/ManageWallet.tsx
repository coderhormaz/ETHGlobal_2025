import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Copy, 
  Eye, 
  EyeOff, 
  QrCode, 
  DollarSign, 
  Send, 
  History,
  ExternalLink,
  CheckCircle,
  Shield
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAuth } from '../../contexts/AuthContext';
import { getMaticBalance, getRecentTransactions } from '../../lib/polygon';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: Date;
  status: 'success' | 'failed';
  gasUsed: string;
  gasPrice: string;
}

const ManageWallet: React.FC = () => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDecryptModal, setShowDecryptModal] = useState(false);
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [balance, setBalance] = useState('0');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  
  const { wallet, loadWallet } = useAuth();

  useEffect(() => {
    if (wallet?.address) {
      fetchWalletData();
    }
  }, [wallet?.address]);

  const fetchWalletData = async () => {
    if (!wallet?.address) return;
    
    setLoading(true);
    try {
      const [maticBalance, recentTxs] = await Promise.all([
        getMaticBalance(wallet.address),
        getRecentTransactions(wallet.address)
      ]);
      
      setBalance(maticBalance);
      setTransactions(recentTxs);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDecryptWallet = async () => {
    if (!decryptPassword) {
      setDecryptError('Please enter your password');
      return;
    }

    setIsDecrypting(true);
    setDecryptError('');

    try {
      await loadWallet(decryptPassword);
      setShowDecryptModal(false);
      setDecryptPassword('');
    } catch (error: any) {
      setDecryptError('Invalid password. Please try again.');
    } finally {
      setIsDecrypting(false);
    }
  };

  if (!wallet) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Wallet size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Wallet Connected</h2>
          <p className="text-gray-400">Please connect your wallet to manage it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
            <Wallet size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manage Wallet</h1>
            <p className="text-sm text-gray-400">Wallet settings and security</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Wallet Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Card */}
          <motion.div
            className="glass-premium rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <DollarSign size={20} className="text-green-400" />
              <h3 className="font-semibold text-white">Total Balance</h3>
            </div>
            
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-600 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-20"></div>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {parseFloat(balance).toFixed(4)} MATIC
                </p>
                <p className="text-sm text-gray-400">
                  ≈ ${(parseFloat(balance) * 0.85).toFixed(2)} USD
                </p>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="glass-premium rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                <Send size={16} />
                <span>Send</span>
              </button>
              <button 
                onClick={() => setShowQRCode(true)}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
              >
                <QrCode size={16} />
                <span>Receive</span>
              </button>
              {wallet.privateKey === '***encrypted***' ? (
                <button 
                  onClick={() => setShowDecryptModal(true)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl transition-colors col-span-2"
                >
                  <Shield size={16} />
                  <span>View Private Key</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors col-span-2"
                >
                  {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{showPrivateKey ? 'Hide' : 'Show'} Private Key</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Wallet Information */}
        <motion.div
          className="glass-premium rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-white mb-6">Wallet Information</h3>
          
          <div className="space-y-6">
            {/* Public Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Public Address
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-black/40 border border-gray-600/50 rounded-xl">
                  <p className="text-white font-mono text-sm break-all">
                    {wallet.address}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(wallet.address, 'address')}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  {copied === 'address' ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Private Key */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Private Key
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-black/40 border border-gray-600/50 rounded-xl">
                  {wallet.privateKey === '***encrypted***' ? (
                    <div className="flex items-center justify-between">
                      <p className="text-yellow-400 font-mono text-sm">
                        🔒 Private key is encrypted for security
                      </p>
                      <button
                        onClick={() => setShowDecryptModal(true)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                      >
                        Decrypt & View
                      </button>
                    </div>
                  ) : (
                    <p className="text-white font-mono text-sm break-all">
                      {showPrivateKey ? wallet.privateKey : '•'.repeat(64)}
                    </p>
                  )}
                </div>
                {wallet.privateKey !== '***encrypted***' && (
                  <>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                      title={showPrivateKey ? 'Hide private key' : 'Show private key'}
                    >
                      {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(wallet.privateKey, 'privateKey')}
                      className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-2"
                      disabled={!showPrivateKey}
                      title="Copy private key"
                    >
                      {copied === 'privateKey' ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-red-400 mt-2">
                ⚠️ Never share your private key with anyone. It gives full access to your wallet.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          className="glass-premium rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <History size={20} className="text-blue-400" />
              <h3 className="font-semibold text-white">Recent Transactions</h3>
            </div>
            <button 
              onClick={fetchWalletData}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-600 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-600 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-600 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx, index) => (
                <motion.div
                  key={tx.hash}
                  className="flex items-center justify-between p-4 bg-black/20 hover:bg-black/30 rounded-xl transition-colors group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => window.open(`https://polygonscan.com/tx/${tx.hash}`, '_blank')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.status === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {tx.from.toLowerCase() === wallet.address.toLowerCase() ? (
                        <Send size={14} className="text-white" />
                      ) : (
                        <History size={14} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {tx.from.toLowerCase() === wallet.address.toLowerCase() ? 'Sent' : 'Received'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {tx.timeStamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {parseFloat(tx.value).toFixed(4)} MATIC
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">View on Explorer</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No recent transactions found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Decrypt Password Modal */}
      {showDecryptModal && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDecryptModal(false)}
        >
          <motion.div
            className="glass-premium rounded-xl p-8 border border-white/10 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Decrypt Private Key</h3>
              <p className="text-sm text-gray-400">
                Enter your password to decrypt and view your private key
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={decryptPassword}
                  onChange={(e) => setDecryptPassword(e.target.value)}
                  className="w-full p-3 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  onKeyPress={(e) => e.key === 'Enter' && handleDecryptWallet()}
                />
              </div>

              {decryptError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{decryptError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDecryptModal(false);
                    setDecryptPassword('');
                    setDecryptError('');
                  }}
                  className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecryptWallet}
                  disabled={isDecrypting || !decryptPassword}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDecrypting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Decrypting...</span>
                    </>
                  ) : (
                    'Decrypt & View'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowQRCode(false)}
        >
          <motion.div
            className="glass-premium rounded-xl p-8 border border-white/10 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Receive Tokens</h3>
              <div className="bg-white p-4 rounded-xl mb-4 inline-block">
                <QRCode value={wallet.address} size={200} />
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Scan this QR code or copy the address below
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={wallet.address}
                  readOnly
                  className="flex-1 p-3 bg-black/40 border border-gray-600/50 rounded-xl text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(wallet.address, 'qr')}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  {copied === 'qr' ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ManageWallet;