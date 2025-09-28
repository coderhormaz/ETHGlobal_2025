import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const GEMINI_API_KEY = 'AIzaSyCHdDtUUnnyfweBS8zB1ntLaKs3hQH1ie4';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Token definitions for Polygon Network (updated with POL)
const TOKENS: Record<string, {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}> = {
  'POL': {
    address: '0x0000000000000000000000000000000000001010', // Native POL
    symbol: 'POL',
    name: 'Polygon',
    decimals: 18
  },
  'WPOL': {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // Wrapped POL
    symbol: 'WPOL', 
    name: 'Wrapped Polygon',
    decimals: 18
  },
  'MATIC': {
    address: '0x0000000000000000000000000000000000001010', // Legacy - maps to POL
    symbol: 'MATIC',
    name: 'Polygon (Legacy)',
    decimals: 18
  },
  'WMATIC': {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // Legacy - maps to WPOL
    symbol: 'WMATIC',
    name: 'Wrapped Polygon (Legacy)',
    decimals: 18
  },
  'USDC': {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6
  },
  'USDT': {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    symbol: 'USDT', 
    name: 'Tether USD',
    decimals: 6
  },
  'WETH': {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18
  },
  'WBTC': {
    address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8
  },
  'DAI': {
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18
  },
  'LINK': {
    address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
    symbol: 'LINK',
    name: 'ChainLink Token',
    decimals: 18
  }
};

interface SwapInstruction {
  action: 'swap' | 'trade' | 'exchange';
  fromToken: string;
  toToken: string;
  amount: string;
  amountUnit: string;
}

class GeminiAI {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async parseSwapInstruction(userMessage: string): Promise<SwapInstruction | null> {
    try {
      const prompt = `
        Parse this user message for token swap instructions. Return ONLY valid JSON or "null" if no swap is requested.
        
        User message: "${userMessage}"
        
        Available tokens: ${Object.keys(TOKENS).join(', ')}
        
        Important notes:
        - MATIC has been renamed to POL
        - Accept both MATIC and POL, but convert MATIC to POL
        - WMATIC should become WPOL
        
        Return JSON format:
        {
          "action": "swap|trade|exchange",
          "fromToken": "TOKEN_SYMBOL",
          "toToken": "TOKEN_SYMBOL", 
          "amount": "number_as_string",
          "amountUnit": "TOKEN_SYMBOL"
        }
        
        Return "null" if:
        - No swap/trade/exchange intent
        - Missing required information
        - Unsupported tokens
        
        Examples:
        - "swap 5 ETH for USDC" → {"action":"swap","fromToken":"WETH","toToken":"USDC","amount":"5","amountUnit":"WETH"}
        - "trade 100 MATIC for DAI" → {"action":"trade","fromToken":"POL","toToken":"DAI","amount":"100","amountUnit":"POL"}
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();
      
      if (text === 'null' || text === 'NULL') {
        return null;
      }

      // Try to parse JSON
      try {
        const parsed = JSON.parse(text);
        
        // Validate required fields
        if (!parsed.action || !parsed.fromToken || !parsed.toToken || !parsed.amount) {
          console.warn('Invalid swap instruction format:', parsed);
          return null;
        }

        // Convert legacy tokens
        if (parsed.fromToken === 'MATIC') parsed.fromToken = 'POL';
        if (parsed.toToken === 'MATIC') parsed.toToken = 'POL';
        if (parsed.fromToken === 'WMATIC') parsed.fromToken = 'WPOL';
        if (parsed.toToken === 'WMATIC') parsed.toToken = 'WPOL';
        if (parsed.amountUnit === 'MATIC') parsed.amountUnit = 'POL';
        if (parsed.amountUnit === 'WMATIC') parsed.amountUnit = 'WPOL';

        // Validate tokens exist
        if (!TOKENS[parsed.fromToken] || !TOKENS[parsed.toToken]) {
          console.warn('Unsupported tokens:', parsed.fromToken, parsed.toToken);
          return null;
        }

        return parsed as SwapInstruction;
      } catch (jsonError) {
        console.warn('Failed to parse Gemini JSON response:', text);
        return this.fallbackParseSwap(userMessage);
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      // Return fallback parsing result
      return this.fallbackParseSwap(userMessage);
    }
  }

  async generateResponse(userMessage: string, swapInstruction?: SwapInstruction): Promise<string> {
    try {
      let prompt = '';
      
      if (swapInstruction) {
        prompt = `
          The user requested a token swap: ${JSON.stringify(swapInstruction)}
          
          Generate a helpful, conversational response confirming the swap details.
          Include:
          - Confirmation of the swap (${swapInstruction.amount} ${swapInstruction.fromToken} → ${swapInstruction.toToken})
          - Note that POL is the updated name for MATIC
          - Brief mention that the transaction will be processed
          
          Keep it friendly and concise (2-3 sentences max).
          User message: "${userMessage}"
        `;
      } else {
        prompt = `
          User message: "${userMessage}"
          
          You are a helpful AI assistant for a cryptocurrency wallet on Polygon network.
          Available tokens: ${Object.keys(TOKENS).join(', ')}
          
          Note: MATIC has been renamed to POL (Polygon). Both names refer to the same token.
          
          Provide a helpful response. If they're asking about swaps, guide them on proper format.
          Keep responses conversational and concise (2-3 sentences max).
        `;
      }

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini response generation error:', error);
      return "I'm experiencing some technical difficulties right now, but I'm still here to help with your token swaps! Try using simple commands like 'swap [amount] [token] for [token]'.";
    }
  }

  // Fallback parsing when Gemini API is unavailable
  private fallbackParseSwap(userMessage: string): SwapInstruction | null {
    const message = userMessage.toLowerCase();
    
    // Check if it's a swap command
    if (!message.includes('swap') && !message.includes('trade') && !message.includes('exchange')) {
      return null;
    }

    // Pattern to match: [action] [amount] [token] for/to [token]
    const patterns = [
      /(?:swap|trade|exchange)\s+(\d+(?:\.\d+)?)\s+(\w+)\s+(?:for|to)\s+(\w+)/,
      /(\d+(?:\.\d+)?)\s+(\w+)\s+(?:for|to)\s+(\w+)/,
      /(?:swap|trade|exchange)\s+(\d+(?:\.\d+)?)\s+(\w+)\s+(\w+)/, // without for/to
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const [, amount, fromToken, toToken] = match;
        
        // Normalize token names
        const normalizeToken = (token: string) => {
          const upper = token.toUpperCase();
          if (upper === 'MATIC') return 'POL';
          if (upper === 'WMATIC') return 'WPOL';
          return upper;
        };

        const fromTokenNormalized = normalizeToken(fromToken);
        const toTokenNormalized = normalizeToken(toToken);

        // Check if tokens are supported
        if (TOKENS[fromTokenNormalized] && TOKENS[toTokenNormalized]) {
          return {
            action: 'swap',
            fromToken: fromTokenNormalized,
            toToken: toTokenNormalized,
            amount,
            amountUnit: fromTokenNormalized
          };
        }
      }
    }

    return null;
  }
}

// Export singleton instance
export const geminiAI = new GeminiAI();
export { TOKENS };
export type { SwapInstruction };