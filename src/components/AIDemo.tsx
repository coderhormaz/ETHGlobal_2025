import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Zap, TrendingUp, Wallet, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  action?: {
    type: 'swap' | 'price' | 'balance' | 'deposit';
    details?: any;
  };
}

const AIDemo: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const demoScenarios = [
    {
      title: 'Trading Commands',
      userMessage: 'Swap 10 USDC to ETH',
      aiResponse: 'I\'ll execute a swap of 10 USDC to ETH for you. Finding the best rate across Polygon, Ethereum, Arbitrum, and Base networks...',
      action: {
        type: 'swap' as const,
        details: {
          from: 'USDC',
          to: 'ETH',
          amount: 10,
          estimatedOutput: '0.0023 ETH',
          network: 'Polygon',
          gasFee: '$0.02'
        }
      }
    },
    {
      title: 'Price Discovery',
      userMessage: 'What\'s the current ETH price?',
      aiResponse: 'The current ETH price from Pyth Oracle is $4,300.25 USD. It\'s up 2.3% in the last 24 hours. Would you like to see price charts or trading opportunities?',
      action: {
        type: 'price' as const,
        details: {
          symbol: 'ETH',
          price: '$4,300.25',
          change: '+2.3%',
          source: 'Pyth Oracle'
        }
      }
    },
    {
      title: 'Wallet Management',
      userMessage: 'Show my wallet balance',
      aiResponse: 'Here\'s your wallet balance across all networks: 125.50 USDC on Polygon, 0.0341 ETH on Ethereum, 45.20 USDC on Arbitrum. Total portfolio value: $272.18',
      action: {
        type: 'balance' as const,
        details: {
          total: '$272.18',
          assets: [
            { symbol: 'USDC', balance: '125.50', network: 'Polygon' },
            { symbol: 'ETH', balance: '0.0341', network: 'Ethereum' },
            { symbol: 'USDC', balance: '45.20', network: 'Arbitrum' }
          ]
        }
      }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoScenarios.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Reset messages and start new demo
    setMessages([]);
    setIsTyping(false);

    const timer = setTimeout(() => {
      startDemo(currentDemo);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentDemo]);

  const startDemo = (scenarioIndex: number) => {
    const scenario = demoScenarios[scenarioIndex];
    
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: scenario.userMessage,
      timestamp: new Date()
    };

    setMessages([userMsg]);
    setIsTyping(true);

    // Add AI response after delay
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: scenario.aiResponse,
        timestamp: new Date(),
        action: scenario.action
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleManualDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand you want to interact with the blockchain. Our AI agent can help with trading, price checking, and wallet management across multiple chains.",
        "I'm here to help! Try commands like 'swap tokens', 'check ETH price', or 'show my balance' to see what I can do.",
        "Great question! Our AI processes natural language to execute blockchain actions. I can trade across Polygon, Ethereum, Arbitrum, and Base networks."
      ];

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const ActionCard: React.FC<{ action: ChatMessage['action'] }> = ({ action }) => {
    if (!action) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20"
      >
        {action.type === 'swap' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Zap size={16} />
              <span>Trade Execution</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">From</div>
                <div className="font-semibold">{action.details.amount} {action.details.from}</div>
              </div>
              <div>
                <div className="text-gray-400">To</div>
                <div className="font-semibold text-green-400">{action.details.estimatedOutput}</div>
              </div>
              <div>
                <div className="text-gray-400">Network</div>
                <div className="font-semibold text-purple-400">{action.details.network}</div>
              </div>
              <div>
                <div className="text-gray-400">Gas Fee</div>
                <div className="font-semibold text-yellow-400">{action.details.gasFee}</div>
              </div>
            </div>
          </div>
        )}

        {action.type === 'price' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-400 font-semibold">
              <TrendingUp size={16} />
              <span>Price Data</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-white">{action.details.price}</div>
                <div className="text-green-400 text-sm">{action.details.change}</div>
              </div>
              <div className="text-right text-sm text-gray-400">
                Source: {action.details.source}
              </div>
            </div>
          </div>
        )}

        {action.type === 'balance' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-semibold">
              <Wallet size={16} />
              <span>Portfolio Balance</span>
            </div>
            <div className="text-2xl font-bold text-white mb-3">{action.details.total}</div>
            <div className="space-y-2">
              {action.details.assets.map((asset: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{asset.balance} {asset.symbol}</span>
                  <span className="text-gray-500">{asset.network}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="AI Agent in Action"
          subtitle="Experience conversational blockchain trading. Watch our AI understand natural language and execute complex multi-chain operations instantly."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Selector */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Try These Commands</h3>
              <p className="text-gray-400">Click any scenario below to see the AI agent in action</p>
            </div>

            <div className="space-y-4">
              {demoScenarios.map((scenario, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentDemo(index)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-300 ${
                    currentDemo === index 
                      ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30' 
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white mb-1">{scenario.title}</div>
                      <div className="text-sm text-gray-400">"{scenario.userMessage}"</div>
                    </div>
                    <ChevronRight className={`transition-transform duration-300 ${
                      currentDemo === index ? 'text-blue-400 rotate-90' : 'text-gray-600'
                    }`} size={20} />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">AI Capabilities</h4>
              <div className="space-y-3">
                {[
                  { icon: '🔄', text: 'Multi-chain token swaps' },
                  { icon: '📊', text: 'Real-time price discovery' },
                  { icon: '💰', text: 'Portfolio management' },
                  { icon: '🔐', text: 'Secure wallet operations' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-300">
                    <span className="text-lg">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:sticky lg:top-8">
            <motion.div 
              className="glass-premium rounded-3xl overflow-hidden border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">AI Trading Agent</div>
                  <div className="text-sm text-green-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Online • Ready to trade
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-sm ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
                          : 'bg-white/10 text-gray-200 rounded-2xl rounded-bl-md'
                      } p-4`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <ActionCard action={message.action} />
                      </div>

                      {message.type === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-white/10 rounded-2xl rounded-bl-md p-4">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-white/10">
                <form onSubmit={handleManualDemo} className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Try: 'What's the price of BTC?' or 'Swap 5 USDC to ETH'"
                    className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 p-3 rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;