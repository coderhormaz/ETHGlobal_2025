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
import { geminiAI, type SwapInstruction } from '../../lib/gemini';
import UniswapV4Service, { type SwapQuote } from '../../lib/uniswapV4';
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
      content: "👋 Hey there! I'm your AI Trading Agent. I can help you swap tokens on Polygon using natural language. Just tell me what you want to trade!\n\nFor example:\n• \"Swap 5 ETH for USDC\"\n• \"Exchange 100 USDT to WPOL\"\n• \"Trade 0.1 WBTC for DAI\"\n\n💡 Note: POL is the new native token (formerly MATIC)",
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

  // Generate unique ID for messages
  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMessage = (content: string, type: 'user' | 'bot', swapData?: any) => {
    const newMessage: Message = {
      id: generateMessageId(),
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
      return { valid: false, message: 'No wallet connected. Starting demo mode...' };
    }

    if (wallet.privateKey === '***encrypted***') {
      return { valid: false, message: 'Wallet is locked. Using simulation mode...' };
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

  // Simulate the complete swap execution process
  const simulateSwapExecution = async (pendingSwapData: any) => {
    const { instruction, quote } = pendingSwapData;
    
    addMessage('✅ **Confirmed!** Processing your swap...', 'bot');
    
    // Simulate processing steps with delays
    setTimeout(() => {
      addMessage(
        `🔐 **Step 3**: Signing transaction with wallet...\n\n` +
        `📝 Transaction details:\n` +
        `• From: ${instruction.amount} ${instruction.fromToken}\n` +
        `• To: ~${UniswapV4Service.formatTokenAmount(quote.amountOutFormatted)} ${instruction.toToken}\n` +
        `• Gas: ~${ethers.formatUnits(quote.gasEstimate, 18).slice(0,6)} POL\n\n` +
        `🔏 _Signing with private key..._`,
        'bot'
      );
    }, 1000);

    setTimeout(() => {
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66).padEnd(64, '0');
      addMessage(
        `📡 **Step 4**: Broadcasting to Polygon network...\n\n` +
        `Transaction Hash: \`${mockTxHash}\`\n\n` +
        `⏳ _Waiting for confirmation..._`,
        'bot'
      );
    }, 3000);

    setTimeout(() => {
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66).padEnd(64, '0');
      addMessage(
        `🎉 **Swap Successful!**\n\n` +
        `✅ **Transaction Confirmed**\n` +
        `📊 **Summary:**\n` +
        `• Sent: ${instruction.amount} ${instruction.fromToken}\n` +
        `• Received: ${UniswapV4Service.formatTokenAmount(quote.amountOutFormatted)} ${instruction.toToken}\n` +
        `• Gas Used: ${ethers.formatUnits(quote.gasEstimate, 18).slice(0,6)} POL\n\n` +
        `🔍 **View on PolygonScan:**\n` +
        `https://polygonscan.com/tx/${mockTxHash}\n\n` +
        `💰 Your ${instruction.toToken} tokens are now in your wallet!`,
        'bot'
      );
    }, 5500);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    addMessage(userMessage, 'user');
    
    setIsTyping(true);
    
    try {
      // Check for pending swap confirmation
      if (pendingSwap) {
        const response = userMessage.toLowerCase();
        
        if (response === 'yes' || response === 'y' || response === 'confirm') {
          await simulateSwapExecution(pendingSwap);
          setPendingSwap(null);
          setIsTyping(false);
          return;
        } else if (response === 'no' || response === 'n' || response === 'cancel') {
          addMessage('❌ **Swap cancelled** by user. No transactions were executed.', 'bot');
          setPendingSwap(null);
          setIsTyping(false);
          return;
        }
        // If not a clear yes/no, continue with normal flow but remind about pending swap
        addMessage(
          `⏳ You still have a pending swap confirmation. Type **"yes"** to proceed or **"no"** to cancel.\n\n` +
          `I can also help you with other questions while you decide!`,
          'bot'
        );
      }

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
      const swapInstruction = await geminiAI.parseSwapInstruction(userMessage);
      
      if (swapInstruction) {
        await handleSwapCommand(swapInstruction);
      } else {
        // Generate general response
        const response = await geminiAI.generateResponse(userMessage);
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
        addMessage(`🔐 ${validation.message}`, 'bot');
        
        // Start simulation flow
        addMessage(
          `🔍 **Demo Mode**: Let me show you how this swap would work!\n\n` +
          `**Step 1**: Getting quote for ${instruction.amount} ${instruction.fromToken} → ${instruction.toToken}...`,
          'bot'
        );

        // Simulate quote fetch with delay
        setTimeout(async () => {
          const quote = await UniswapV4Service.getSwapQuote(
            instruction.fromToken,
            instruction.toToken,
            instruction.amount
          );

          if (!quote) {
            addMessage(`❌ Unable to get a quote for ${instruction.amount} ${instruction.fromToken} → ${instruction.toToken}.`, 'bot');
            return;
          }

          // Show detailed quote
          addMessage(
            `📊 **Step 2**: Quote Retrieved Successfully!\n\n` +
            `**Sending:** ${instruction.amount} ${instruction.fromToken}\n` +
            `**Receiving:** ~${UniswapV4Service.formatTokenAmount(quote.amountOutFormatted)} ${instruction.toToken}\n` +
            `**Route:** ${quote.route}\n` +
            `**Estimated Gas:** ~${ethers.formatUnits(quote.gasEstimate, 18).slice(0,6)} POL\n` +
            `**Price Impact:** ${quote.priceImpact}\n\n` +
            `💡 **Confirm in chat**: Type **"yes"** to proceed or **"no"** to cancel\n\n` +
            `_Simulation: Waiting for your confirmation..._`,
            'bot'
          );

          // Set up confirmation
          setPendingSwap({ messageId: Date.now().toString(), instruction, quote });
        }, 2000);
        
        return;
      }

      // Original wallet flow for when wallet is actually connected
      addMessage('🔍 Getting the best price for your swap...', 'bot');
      
      const quote = await UniswapV4Service.getSwapQuote(
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
        `**You'll receive:** ~${UniswapV4Service.formatTokenAmount(quote.amountOutFormatted)} ${instruction.toToken}\n` +
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

      const transaction = await UniswapV4Service.executeSwap(
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
      <div className="glass-premium p-3 lg:p-4 border-b border-white/10">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-brand-gradient rounded-xl flex items-center justify-center">
            <Bot className="text-white" size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg lg:text-xl font-bold text-white truncate">AI Trading Agent</h2>
            <p className="text-gray-400 text-xs lg:text-sm truncate">Powered by Gemini AI • Connected to Polygon</p>
          </div>
          {wallet && (
            <div className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs font-medium hidden sm:inline">Wallet Connected</span>
              <span className="text-green-400 text-xs font-medium sm:hidden">Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
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
      <div className="glass-premium p-3 lg:p-4 border-t border-white/10">
        <div className="flex items-end gap-2 lg:gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to swap tokens... (e.g., 'swap 5 ETH for USDC')"
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 pr-10 lg:pr-12 bg-black/40 border border-gray-600/50 rounded-xl text-white text-sm lg:text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={isTyping}
            />
            {inputMessage && (
              <button
                onClick={() => setInputMessage('')}
                className="absolute right-2.5 lg:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg lg:text-xl"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="btn-premium p-2.5 lg:p-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={16} className="lg:hidden" />
            <Send size={18} className="hidden lg:inline" />
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
      className={`flex items-start gap-2 lg:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-blue-600' : 'bg-brand-gradient'
      }`}>
        {isUser ? <User size={14} className="text-white lg:hidden" /> : <Bot size={14} className="text-white lg:hidden" />}
        {isUser ? <User size={16} className="text-white hidden lg:inline" /> : <Bot size={16} className="text-white hidden lg:inline" />}
      </div>

      {/* Message Content */}
      <div className={`max-w-[85%] lg:max-w-2xl ${isUser ? 'text-right' : ''}`}>
        <div className={`glass-premium p-3 lg:p-4 rounded-2xl ${
          isUser 
            ? 'bg-blue-600/20 border-blue-500/30' 
            : 'bg-white/5 border-white/10'
        }`}>
          <div className="text-white whitespace-pre-wrap text-sm lg:text-base leading-relaxed">
            {message.content}
          </div>

          {/* Swap Action Buttons */}
          {hasSwapData && !hasSwapData.confirmed && !hasSwapData.txHash && (
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-white/10">
              <button
                onClick={onConfirmSwap}
                disabled={isPending}
                className="btn-premium px-4 lg:px-6 py-2 text-xs lg:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
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
                className="px-4 lg:px-6 py-2 text-xs lg:text-sm border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all disabled:opacity-50"
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