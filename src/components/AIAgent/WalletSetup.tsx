import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Key, 
  Shield, 
  AlertTriangle,
  Loader2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface WalletSetupProps {
  onWalletUnlocked: (wallet: any) => void;
  onClose: () => void;
}

const WalletSetup: React.FC<WalletSetupProps> = ({ onWalletUnlocked, onClose }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCorruptedWalletOptions, setShowCorruptedWalletOptions] = useState(false);
  
  const { loadWallet, deleteWallet } = useAuth();

  const handleUnlockWallet = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const wallet = await loadWallet(password);
      if (wallet) {
        onWalletUnlocked(wallet);
      }
    } catch (err: any) {
      console.error('Error unlocking wallet:', err);
      if (err.message.includes('corrupted')) {
        setShowCorruptedWalletOptions(true);
        setError(err.message);
      } else {
        setError(err.message || 'Failed to unlock wallet');
      }
    }
    
    setIsLoading(false);
  };

  const handleDeleteAndRecreate = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await deleteWallet();
      setError('Wallet deleted. Please create a new wallet from your account settings.');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error('Error deleting wallet:', err);
      setError(err.message || 'Failed to delete wallet');
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUnlockWallet();
    }
  };

  if (showCorruptedWalletOptions) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-premium p-8 rounded-3xl max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <AlertTriangle className="text-red-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Data Corrupted</h2>
          <p className="text-gray-400 text-sm">
            Your wallet data appears to be corrupted and cannot be decrypted
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-yellow-400 font-medium text-sm mb-1">Important Notice</p>
              <p className="text-yellow-300 text-xs leading-relaxed">
                Deleting your wallet will permanently remove all data. Make sure you have your private key backed up 
                if you want to recover your funds, or ensure the wallet is empty before proceeding.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAndRecreate}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Wallet
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-premium p-8 rounded-3xl max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
          <Key className="text-blue-400" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Unlock Wallet</h2>
        <p className="text-gray-400 text-sm">
          Enter your password to unlock your AI trading wallet
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your password"
            className="w-full p-4 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-blue-400 font-medium text-sm mb-1">Secure Access</p>
              <p className="text-blue-300 text-xs">
                Your wallet data is encrypted and stored securely. Only you can unlock it with your password.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleUnlockWallet}
          disabled={!password.trim() || isLoading}
          className="flex-1 btn-premium py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Unlocking...
            </>
          ) : (
            <>
              <Wallet size={16} />
              Unlock Wallet
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default WalletSetup;