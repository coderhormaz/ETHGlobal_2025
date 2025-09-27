import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Mail, 
  Shield, 
  Key, 
  Download, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const WalletFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const mockPrivateKey = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const mockAddress = "0x742d35cE6aF99c2cF2F3D8b8cBFb6E8e5b8a7C9D";

  const tabs = [
    { id: 'create', label: 'Create Wallet', icon: Wallet },
    { id: 'manage', label: 'Fund Management', icon: DollarSign },
    { id: 'security', label: 'Security & Export', icon: Shield },
  ];

  const networks = [
    { name: 'Polygon', color: 'text-purple-400', balance: '125.50 USDC' },
    { name: 'Ethereum', color: 'text-blue-400', balance: '0.0341 ETH' },
    { name: 'Arbitrum', color: 'text-cyan-400', balance: '45.20 USDC' },
    { name: 'Base', color: 'text-green-400', balance: '0.0123 ETH' },
  ];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Smart Wallet Integration"
          subtitle="Email-based account creation with full wallet ownership. Your keys, your crypto, your control - with the simplicity of traditional sign-up."
        />

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="glass-premium rounded-2xl p-2 border border-white/10">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {/* Create Wallet Tab */}
          {activeTab === 'create' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Simple Email Registration
                  </h3>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Create your AI trading account with just an email. We automatically generate 
                    and secure your wallet, giving you full ownership of your private keys.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {[
                    {
                      icon: Mail,
                      title: 'Email Sign-Up',
                      description: 'No complex wallet setup required'
                    },
                    {
                      icon: Wallet,
                      title: 'Auto Wallet Creation',
                      description: 'HD wallet generated and secured'
                    },
                    {
                      icon: Shield,
                      title: 'Database Encryption',
                      description: 'Your keys are encrypted and stored safely'
                    },
                    {
                      icon: Key,
                      title: 'Full Ownership',
                      description: 'Export your private keys anytime'
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 glass-subtle rounded-2xl hover:glass-premium transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <feature.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sign-up Form Mockup */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-premium p-8 rounded-3xl border border-white/10"
              >
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-white mb-2">Create AI Trading Account</h4>
                  <p className="text-gray-400">Start trading with natural language commands</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    Create Account & Wallet
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    Your wallet will be created automatically upon registration
                  </div>
                </div>

                {/* Process Steps */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-sm text-gray-400 mb-4">What happens next:</div>
                  <div className="space-y-3">
                    {[
                      '1. Account verification via email',
                      '2. Secure HD wallet generation',
                      '3. Multi-chain address creation',
                      '4. AI agent activation'
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Fund Management Tab */}
          {activeTab === 'manage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Portfolio Overview */}
                <div className="glass-premium p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Wallet size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Portfolio Balance</h4>
                      <p className="text-gray-400">Across all networks</p>
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-white mb-6">$272.18</div>

                  <div className="space-y-4">
                    {networks.map((network) => (
                      <div key={network.name} className="flex items-center justify-between p-4 glass-subtle rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 ${network.color.replace('text-', 'bg-')} rounded-full`}></div>
                          <span className="font-medium text-white">{network.name}</span>
                        </div>
                        <span className={`font-semibold ${network.color}`}>{network.balance}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-6">
                  <div className="glass-premium p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <ArrowDownLeft className="text-green-400" size={20} />
                      <h5 className="font-semibold text-white">Add Funds</h5>
                    </div>
                    <p className="text-gray-400 mb-4">Deposit crypto to your wallet</p>
                    <div className="glass-subtle p-4 rounded-xl mb-4">
                      <div className="text-xs text-gray-500 mb-1">Wallet Address</div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-blue-400 font-mono">{mockAddress}</code>
                        <button
                          onClick={() => handleCopy(mockAddress)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition-colors">
                      Generate Deposit Address
                    </button>
                  </div>

                  <div className="glass-premium p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <ArrowUpRight className="text-orange-400" size={20} />
                      <h5 className="font-semibold text-white">Withdraw Funds</h5>
                    </div>
                    <p className="text-gray-400 mb-4">Send crypto to external address</p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Recipient address"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                      />
                      <div className="flex gap-3">
                        <input
                          type="number"
                          placeholder="Amount"
                          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                        />
                        <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition-colors">
                          <option value="USDC">USDC</option>
                          <option value="ETH">ETH</option>
                        </select>
                      </div>
                    </div>
                    <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-colors mt-4">
                      Withdraw Funds
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security & Export Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div className="glass-premium p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                      <Key size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Private Key Export</h4>
                      <p className="text-gray-400">Full ownership of your wallet</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Shield className="text-yellow-400 flex-shrink-0 mt-1" size={16} />
                        <div className="text-sm">
                          <div className="font-semibold text-yellow-400 mb-1">Security Warning</div>
                          <div className="text-gray-300">
                            Never share your private key. Anyone with access can control your funds.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-subtle p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Private Key</span>
                        <button
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div className="bg-black/50 p-3 rounded-lg border border-white/10">
                        <code className="text-sm font-mono text-green-400 break-all">
                          {showPrivateKey ? mockPrivateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                        </code>
                      </div>
                      <button
                        onClick={() => handleCopy(mockPrivateKey)}
                        className="flex items-center gap-2 mt-3 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                        <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
                      </button>
                    </div>

                    <button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]">
                      Export Private Key
                    </button>
                  </div>
                </div>

                <div className="glass-premium p-6 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="text-blue-400" size={20} />
                    <h5 className="font-semibold text-white">Export Options</h5>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 glass-subtle rounded-xl hover:glass-premium transition-all duration-300">
                      <span className="text-gray-300">Keystore File (.json)</span>
                      <ExternalLink size={16} className="text-gray-500" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 glass-subtle rounded-xl hover:glass-premium transition-all duration-300">
                      <span className="text-gray-300">Mnemonic Phrase</span>
                      <ExternalLink size={16} className="text-gray-500" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 glass-subtle rounded-xl hover:glass-premium transition-all duration-300">
                      <span className="text-gray-300">QR Code</span>
                      <ExternalLink size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-premium p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Shield size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Security Features</h4>
                      <p className="text-gray-400">Your funds are protected</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: 'AES-256 Encryption',
                        description: 'Military-grade encryption for private keys',
                        status: 'active'
                      },
                      {
                        title: 'Secure Database',
                        description: 'Encrypted storage with redundancy',
                        status: 'active'
                      },
                      {
                        title: 'Multi-Chain Support',
                        description: 'Unified security across all networks',
                        status: 'active'
                      },
                      {
                        title: 'Regular Backups',
                        description: 'Automated secure backup system',
                        status: 'active'
                      }
                    ].map((feature) => (
                      <div key={feature.title} className="flex items-center gap-4 p-4 glass-subtle rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <CheckCircle size={16} className="text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm">{feature.title}</div>
                          <div className="text-gray-400 text-xs">{feature.description}</div>
                        </div>
                        <div className="text-green-400 text-xs font-medium">Active</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-premium p-6 rounded-3xl border border-white/10">
                  <h5 className="font-semibold text-white mb-4">Wallet Information</h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet Type:</span>
                      <span className="text-white">HD Wallet (BIP44)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Derivation Path:</span>
                      <span className="text-white font-mono">m/44'/60'/0'/0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Networks:</span>
                      <span className="text-white">4 Chains</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WalletFeatures;