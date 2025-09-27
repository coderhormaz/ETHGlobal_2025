import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, TrendingUp, Zap, MessageCircle } from 'lucide-react';

interface Message {
  id: number;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI trading assistant. I can help you analyze market trends, suggest trading strategies, and manage your portfolio. What would you like to know?',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dummyResponses = [
    "Based on current market analysis, MATIC is showing strong bullish signals with increased volume.",
    "I recommend diversifying your portfolio with 60% MATIC, 25% USDC, and 15% WETH for optimal risk management.",
    "The current market sentiment for Polygon ecosystem tokens is positive. Consider dollar-cost averaging into your positions.",
    "Your portfolio performance is up 12.5% this week. The AI-suggested rebalancing strategy is working well.",
    "Market volatility is expected to increase. I suggest setting stop-losses at 15% below current prices.",
    "DeFi opportunities on Polygon are growing. Consider exploring yield farming with AAVE or Compound."
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: dummyResponses[Math.floor(Math.random() * dummyResponses.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: TrendingUp, text: 'Market Analysis', color: 'blue' },
    { icon: Zap, text: 'Quick Trade', color: 'green' },
    { icon: MessageCircle, text: 'Portfolio Review', color: 'purple' },
  ];

  return (
    <div className="h-screen flex flex-col bg-transparent">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Trading Agent</h1>
            <p className="text-sm text-gray-400">Your intelligent trading assistant</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-b border-white/10 bg-black/10">
        <div className="flex gap-3 overflow-x-auto">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors whitespace-nowrap ${
                  action.color === 'blue' ? 'border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' :
                  action.color === 'green' ? 'border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20' :
                  'border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{action.text}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'glass-premium border border-white/10 text-white'
              }`}
            >
              {message.type === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={16} className="text-blue-400" />
                  <span className="text-xs font-medium text-blue-400">AI Agent</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="glass-premium border border-white/10 p-4 rounded-2xl max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={16} className="text-blue-400" />
                <span className="text-xs font-medium text-blue-400">AI Agent</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10 bg-black/20">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about trading strategies, market analysis, or portfolio management..."
            className="flex-1 px-4 py-3 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            disabled={isLoading}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={16} />
            <span className="font-medium">Send</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;