import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  CheckCircle, 
  ExternalLink
} from 'lucide-react';
import GeminiAI, { type SwapInstruction } from '../../lib/gemini';
import UniswapService, { type SwapQuote } from '../../lib/uniswap';
import { ethers } from 'ethers';
import type { WalletData } from '../../lib/wallet';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  swapData?: {
    instruction: SwapInstruction;
    quote: SwapQuote;
    confirmed: boolean;
    txHash?: string;
    explorerLink?: string;
  };
}

interface AIAgentChatProps {
  wallet?: WalletData | null;
  onWalletRequired: () => void;
}

const AIAgentChat: React.FC<AIAgentChatProps> = ({ wallet, onWalletRequired }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hey there! I'm your AI Trading Agent. I can help you swap tokens on Polygon using natural language. Just tell me what you want to trade!\n\nFor example:\n• \"Swap 5 ETH for USDC\"\n• \"Exchange 100 USDT to WMATIC\"\n• \"Trade 0.1 WBTC for DAI\"",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingSwap, setPendingSwap] = useState<{
    messageId: string;
    instruction: SwapInstruction;
    quote: SwapQuote;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addMessage = (content: string, type: 'user' | 'bot', swapData?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      swapData
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  };

  const validateWalletForTrading = (): { valid: boolean; message: string } => {
    if (!wallet) {
      return { valid: false, message: 'Wallet not connected' };
    }

    if (wallet.privateKey === '***encrypted***') {
      return { valid: false, message: 'Wallet is locked. Please unlock it first.' };
    }

    // In a real implementation, you'd check the actual balance
    return { valid: true, message: 'Wallet ready for trading' };
  };

  const createSigner = (): ethers.Signer | null => {
    if (!wallet || wallet.privateKey === '***encrypted***') {
      return null;
    }

    try {
      const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
      const walletInstance = new ethers.Wallet(wallet.privateKey, provider);
      return walletInstance;
    } catch (error) {
      console.error('Error creating signer:', error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    addMessage(userMessage, 'user');
    
    setIsTyping(true);
    
    try {
      // Check for wallet first
      if (!wallet) {
        addMessage(
          "I need access to a wallet to execute trades. Let me help you set one up! 🔐",
          'bot'
        );
        setIsTyping(false);
        onWalletRequired();
        return;
      }

      // Parse the command using Gemini AI
      const swapInstruction = await GeminiAI.parseSwapCommand(userMessage);
      
      if (swapInstruction) {
        await handleSwapCommand(swapInstruction);
      } else {
        // Generate general response
        const response = await GeminiAI.generateResponse(userMessage);
        addMessage(response, 'bot');
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage(
        "Sorry, I encountered an error processing your request. Please try again.",
        'bot'
      );
    }
    
    setIsTyping(false);
  };

  const handleSwapCommand = async (instruction: SwapInstruction) => {
    try {
      // Validate wallet
      const validation = validateWalletForTrading();
      if (!validation.valid) {
        addMessage(`❌ ${validation.message}`, 'bot');
        return;
      }

      // Get swap quote
      addMessage('🔍 Getting the best price for your swap...', 'bot');
      
      const quote = await UniswapService.getSwapQuote(
        instruction.fromToken,
        instruction.toToken,
        instruction.amount
      );

      if (!quote) {
        addMessage(
          `❌ Unable to get a quote for ${instruction.amount} ${instruction.fromToken} → ${instruction.toToken}. Please check if this trading pair is available.`,
          'bot'
        );
        return;
      }

      // Create swap confirmation message
      const swapData = {
        instruction,
        quote,
        confirmed: false
      };

      const messageId = addMessage(
        `📊 **Swap Quote**\n\n` +
        `**You're sending:** ${instruction.amount} ${instruction.fromToken}\n` +
        `**You'll receive:** ~${UniswapService.formatTokenAmount(quote.amountOutFormatted)} ${instruction.toToken}\n` +
        `**Route:** ${quote.route}\n` +
        `**Price Impact:** ${quote.priceImpact}\n\n` +
        `**Are you sure you want to execute this swap?**`,
        'bot',
        swapData
      );

      setPendingSwap({ messageId, instruction, quote });

    } catch (error) {
      console.error('Error handling swap command:', error);
      addMessage('❌ Failed to process swap request. Please try again.', 'bot');
    }
  };

  const executeSwap = async () => {
    if (!pendingSwap || !wallet) return;

    const { messageId, instruction, quote } = pendingSwap;
    
    try {
      // Update message to show execution
      updateMessage(messageId, {
        content: '⏳ Executing swap... Please wait while I sign and submit the transaction.',
        swapData: { instruction, quote, confirmed: true }
      });

      // Execute the swap
      const signer = createSigner();
      if (!signer) {
        throw new Error('Unable to create wallet signer');
      }

      const transaction = await UniswapService.executeSwap(
        signer,
        instruction.fromToken,
        instruction.toToken,
        instruction.amount
      );

      if (transaction) {
        // Success message
        updateMessage(messageId, {
          content: `✅ **Swap Executed Successfully!**\n\n` +
                  `**Transaction Hash:** \`${transaction.hash.slice(0, 20)}...\`\n` +
                  `**Amount Swapped:** ${transaction.amountIn} ${transaction.fromToken}\n` +
                  `**Amount Received:** ${transaction.amountOut} ${transaction.toToken}\n` +
                  `**Gas Used:** ${transaction.gasUsed ? (parseInt(transaction.gasUsed) / 1000000).toFixed(2) + 'M' : 'N/A'}\n\n` +
                  `[View on Polygonscan](${transaction.explorerLink}) 🔗`,
          swapData: {
            instruction,
            quote,
            confirmed: true,
            txHash: transaction.hash,
            explorerLink: transaction.explorerLink
          }
        });

        // Add follow-up message
        setTimeout(() => {
          addMessage(
            '🎉 Great! Your swap has been completed. Is there anything else you\'d like to trade?',
            'bot'
          );
        }, 2000);
      }

    } catch (error: any) {
      console.error('Swap execution error:', error);
      updateMessage(messageId, {
        content: `❌ **Swap Failed**\n\n${error.message}\n\nPlease try again or contact support if the issue persists.`,
        swapData: { instruction, quote, confirmed: false }
      });
    }

    setPendingSwap(null);
  };

  const cancelSwap = () => {
    if (pendingSwap) {
      updateMessage(pendingSwap.messageId, {
        content: '❌ Swap cancelled by user.',
        swapData: { ...pendingSwap, confirmed: false }
      });
      setPendingSwap(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="glass-premium p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Trading Agent</h2>
            <p className="text-gray-400 text-sm">Powered by Gemini AI • Connected to Polygon</p>
          </div>
          {wallet && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs font-medium">Wallet Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onConfirmSwap={executeSwap}
            onCancelSwap={cancelSwap}
            isPending={pendingSwap?.messageId === message.id}
          />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="glass-premium p-4 rounded-2xl max-w-md">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="text-blue-400 animate-spin" />
                <span className="text-gray-300">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-premium p-4 border-t border-white/10">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to swap tokens... (e.g., 'swap 5 ETH for USDC')"
              className="w-full px-4 py-3 pr-12 bg-black/40 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={isTyping}
            />
            {inputMessage && (
              <button
                onClick={() => setInputMessage('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="btn-premium p-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{
  message: Message;
  onConfirmSwap: () => void;
  onCancelSwap: () => void;
  isPending: boolean;
}> = ({ message, onConfirmSwap, onCancelSwap, isPending }) => {
  const isUser = message.type === 'user';
  const hasSwapData = message.swapData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-blue-600' : 'bg-brand-gradient'
      }`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>

      {/* Message Content */}
      <div className={`max-w-2xl ${isUser ? 'text-right' : ''}`}>
        <div className={`glass-premium p-4 rounded-2xl ${
          isUser 
            ? 'bg-blue-600/20 border-blue-500/30' 
            : 'bg-white/5 border-white/10'
        }`}>
          <div className="text-white whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>

          {/* Swap Action Buttons */}
          {hasSwapData && !hasSwapData.confirmed && !hasSwapData.txHash && (
            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
              <button
                onClick={onConfirmSwap}
                disabled={isPending}
                className="btn-premium px-6 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Confirm Swap
                  </>
                )}
              </button>
              <button
                onClick={onCancelSwap}
                disabled={isPending}
                className="px-6 py-2 text-sm border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Transaction Link */}
          {hasSwapData?.explorerLink && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <a
                href={hasSwapData.explorerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                <ExternalLink size={14} />
                View Transaction
              </a>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-2 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AIAgentChat;