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
      // After deletion, close the modal and let the user create a new wallet
      setError('Wallet deleted. Please create a new wallet from your account settings.');
      setTimeout(() => {
        onClose();
        // Redirect to account settings or refresh page to trigger new wallet creation
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

interface WalletSetupProps {
  onWalletCreated?: (wallet: WalletInfo) => void;
  onWalletUnlocked?: (password: string) => Promise<void>;
  onClose: () => void;
  isUnlocking?: boolean;
  isLoading?: boolean;
}

const WalletSetup: React.FC<WalletSetupProps> = ({ 
  onWalletCreated, 
  onWalletUnlocked, 
  onClose, 
  isUnlocking = false,
  isLoading = false 
}) => {
  const [mode, setMode] = useState<'choose' | 'create' | 'import' | 'unlock'>(
    isUnlocking ? 'unlock' : 'choose'
  );
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState('');
  const [importKey, setImportKey] = useState('');
  const [password, setPassword] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [createdWallet, setCreatedWallet] = useState<WalletInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const loading = isLoading || internalLoading;

  const handleUnlockWallet = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    if (!onWalletUnlocked) {
      setError('Unlock function not provided');
      return;
    }

    setError('');
    setInternalLoading(true);
    
    try {
      await onWalletUnlocked(password);
    } catch (err: any) {
      setError(err.message || 'Failed to unlock wallet. Please check your password.');
    }
    
    setInternalLoading(false);
  };

  const handleCreateWallet = async () => {
    setInternalLoading(true);
    setError('');
    
    try {
      const wallet = await AIWalletService.initializeWallet();
      setCreatedWallet(wallet);
      setMode('create');
    } catch (err: any) {
      setError(err.message || 'Failed to create wallet');
    }
    
    setInternalLoading(false);
  };

  const handleImportWallet = async () => {
    if (!importKey.trim()) {
      setError('Please enter a private key');
      return;
    }

    setInternalLoading(true);
    setError('');
    
    try {
      const wallet = await AIWalletService.importWallet(importKey.trim());
      if (onWalletCreated) {
        onWalletCreated(wallet);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to import wallet');
    }
    
    setInternalLoading(false);
  };

  const handleCopyPrivateKey = async () => {
    if (createdWallet) {
      await navigator.clipboard.writeText(createdWallet.privateKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProceedWithWallet = () => {
    if (createdWallet && onWalletCreated) {
      onWalletCreated(createdWallet);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (mode === 'unlock') {
        handleUnlockWallet();
      }
    }
  };

  if (mode === 'unlock') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-premium p-8 rounded-3xl max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
            <Lock className="text-yellow-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Unlock Wallet</h2>
          <p className="text-gray-400 text-sm">
            Enter your password to unlock your wallet for AI trading
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
              placeholder="Enter your account password"
              className="w-full p-4 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={loading}
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
                <p className="text-blue-400 font-medium text-sm mb-1">Secure Unlocking</p>
                <p className="text-blue-300 text-xs">
                  Your password is used to decrypt your wallet locally. It never leaves your device.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUnlockWallet}
            disabled={!password.trim() || loading}
            className="flex-1 btn-premium py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Unlocking...
              </>
            ) : (
              <>
                <Key size={18} />
                Unlock
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  if (mode === 'choose') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-premium p-8 rounded-3xl max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Setup AI Wallet</h2>
          <p className="text-gray-400 text-sm">
            Your AI agent needs a wallet to execute trades automatically
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreateWallet}
            disabled={loading}
            className="w-full p-4 border border-gray-600/50 rounded-xl hover:border-blue-500/50 transition-all group text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Plus className="text-green-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Create New Wallet</h3>
                <p className="text-gray-400 text-sm">
                  Generate a new wallet for your AI agent (Recommended)
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode('import')}
            className="w-full p-4 border border-gray-600/50 rounded-xl hover:border-blue-500/50 transition-all group text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Upload className="text-blue-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Import Existing Wallet</h3>
                <p className="text-gray-400 text-sm">
                  Use your existing private key to import a wallet
                </p>
              </div>
            </div>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <AlertTriangle className="text-yellow-400 flex-shrink-0" size={16} />
          <p className="text-yellow-400 text-xs">
            Your wallet will be stored locally. Keep your private key safe and backed up.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    );
  }

  if (mode === 'create' && createdWallet) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-premium p-8 rounded-3xl max-w-lg mx-auto"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <Check className="text-green-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Created!</h2>
          <p className="text-gray-400 text-sm">
            Your AI agent wallet has been successfully created
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-black/40 rounded-xl border border-gray-600/30">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <code className="text-white text-sm font-mono flex-1 truncate">
                {createdWallet.address}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(createdWallet.address)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-gray-600/30">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              Private Key
              <Shield size={16} className="text-yellow-400" />
            </label>
            <div className="flex items-center gap-2">
              <input
                type={showPrivateKey ? 'text' : 'password'}
                value={createdWallet.privateKey}
                readOnly
                className="bg-transparent text-white text-sm font-mono flex-1 outline-none"
              />
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={handleCopyPrivateKey}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-red-400 font-medium text-sm mb-1">Important Security Notice</p>
              <p className="text-red-300 text-xs leading-relaxed">
                Please backup your private key securely. If you lose it, you'll lose access to your funds forever. 
                Never share your private key with anyone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setMode('choose')}
            className="flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleProceedWithWallet}
            className="flex-1 btn-premium py-3 px-6 flex items-center justify-center gap-2"
          >
            <Wallet size={18} />
            Start Trading
          </button>
        </div>
      </motion.div>
    );
  }

  if (mode === 'import') {
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
          <h2 className="text-2xl font-bold text-white mb-2">Import Wallet</h2>
          <p className="text-gray-400 text-sm">
            Enter your private key to import an existing wallet
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Private Key
            </label>
            <textarea
              value={importKey}
              onChange={(e) => setImportKey(e.target.value)}
              placeholder="Enter your private key (0x...)"
              className="w-full p-4 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none h-20 font-mono text-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-yellow-400 font-medium text-sm mb-1">Security Reminder</p>
                <p className="text-yellow-300 text-xs">
                  Never share your private key. We store it securely on your device only.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setMode('choose')}
            className="flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleImportWallet}
            disabled={!importKey.trim() || loading}
            className="flex-1 btn-premium py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Importing...
              </>
            ) : (
              <>
                <Download size={18} />
                Import Wallet
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default WalletSetup;