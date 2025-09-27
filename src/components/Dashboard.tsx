import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Coins, 
  Wallet, 
  LogOut, 
  Menu, 
  X,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Import dashboard pages
import AIAgent from './dashboard/AIAgent';
import ManageTokens from './dashboard/ManageTokens';
import ManageWallet from './dashboard/ManageWallet';

interface DashboardProps {
  defaultTab?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ defaultTab = 'ai-agent' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, signOut, wallet } = useAuth();

  const sidebarItems = [
    {
      id: 'ai-agent',
      name: 'AI Agent',
      icon: Bot,
      description: 'Intelligent trading assistant'
    },
    {
      id: 'manage-tokens',
      name: 'Manage Tokens',
      icon: Coins,
      description: 'View your token portfolio'
    },
    {
      id: 'manage-wallet',
      name: 'Manage Wallet',
      icon: Wallet,
      description: 'Wallet settings and keys'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'ai-agent':
        return <AIAgent />;
      case 'manage-tokens':
        return <ManageTokens />;
      case 'manage-wallet':
        return <ManageWallet />;
      default:
        return <AIAgent />;
    }
  };

  return (
    <div className="min-h-screen bg-premium-mesh text-white flex">
      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-premium border-r border-white/10 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        initial={false}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-premium">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 784.37 1277.39" 
                className="text-white"
                fill="currentColor"
              >
                <g>
                  <polygon points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
                  <polygon points="392.07,0 0,650.54 392.07,882.29 392.07,472.33 "/>
                  <polygon points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
                  <polygon points="392.07,1277.38 392.07,956.52 0,724.89 "/>
                  <polygon points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
                  <polygon points="0,650.54 392.07,882.29 392.07,472.33 "/>
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text-premium">EthAI</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.user_metadata?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          {/* Wallet Status */}
          {wallet && (
            <div className="bg-black/20 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-green-400" />
                <span className="text-xs font-medium text-green-400">Wallet Connected</span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.li key={item.id}>
                  <motion.button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                      isActive 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={20} className={isActive ? 'text-blue-400' : ''} />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-colors group"
          >
            <LogOut size={20} className="group-hover:text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-black/20 border-b border-white/10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-white">
            {sidebarItems.find(item => item.id === activeTab)?.name}
          </h2>
          <div></div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {renderActiveTab()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;