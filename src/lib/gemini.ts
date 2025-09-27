import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const GEMINI_API_KEY = 'AIzaSyCHdDtUUnnyfweBS8zB1ntLaKs3hQH1ie4';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface SwapInstruction {
  action: 'swap';
  fromToken: string;
  toToken: string;
  amount: string;
  amountUnit: string;
}

interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
}

// Common token addresses on Polygon
const TOKENS: Record<string, TokenInfo> = {
  'ETH': { symbol: 'ETH', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18 },
  'WETH': { symbol: 'WETH', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18 },
  'USDC': { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
  'USDT': { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
  'MATIC': { symbol: 'MATIC', address: '0x0000000000000000000000000000000000001010', decimals: 18 },
  'WMATIC': { symbol: 'WMATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', decimals: 18 },
  'DAI': { symbol: 'DAI', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18 },
  'WBTC': { symbol: 'WBTC', address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', decimals: 8 }
};

class GeminiAI {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async parseSwapCommand(userMessage: string): Promise<SwapInstruction | null> {
    const prompt = `
      You are a DeFi trading assistant. Analyze the user's message and extract swap instructions.
      
      User message: "${userMessage}"
      
      If this is a swap command, respond with ONLY a JSON object in this exact format:
      {
        "action": "swap",
        "fromToken": "TOKEN_SYMBOL",
        "toToken": "TOKEN_SYMBOL", 
        "amount": "NUMBER",
        "amountUnit": "TOKEN_SYMBOL"
      }
      
      Supported tokens: ETH, WETH, USDC, USDT, MATIC, WMATIC, DAI, WBTC
      
      Examples:
      - "swap 5 eth for usdc" → {"action": "swap", "fromToken": "ETH", "toToken": "USDC", "amount": "5", "amountUnit": "ETH"}
      - "trade 100 usdc to weth" → {"action": "swap", "fromToken": "USDC", "toToken": "WETH", "amount": "100", "amountUnit": "USDC"}
      - "exchange 0.5 wbtc for dai" → {"action": "swap", "fromToken": "WBTC", "toToken": "DAI", "amount": "0.5", "amountUnit": "WBTC"}
      
      If this is NOT a swap command, respond with: null
      
      Only respond with the JSON object or null, nothing else.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text().trim();
      
      if (response === 'null') {
        return null;
      }
      
      const parsed = JSON.parse(response);
      
      // Validate the parsed instruction
      if (
        parsed.action === 'swap' &&
        parsed.fromToken &&
        parsed.toToken &&
        parsed.amount &&
        parsed.amountUnit &&
        TOKENS[parsed.fromToken.toUpperCase()] &&
        TOKENS[parsed.toToken.toUpperCase()]
      ) {
        return {
          action: parsed.action,
          fromToken: parsed.fromToken.toUpperCase(),
          toToken: parsed.toToken.toUpperCase(),
          amount: parsed.amount,
          amountUnit: parsed.amountUnit.toUpperCase()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing swap command:', error);
      return null;
    }
  }

  async generateResponse(userMessage: string, context?: string): Promise<string> {
    const prompt = `
      You are an AI trading assistant for a DeFi platform. Be helpful, concise, and professional.
      
      ${context ? `Context: ${context}` : ''}
      
      User message: "${userMessage}"
      
      Provide a helpful response. If they're asking about trading, explain what you can do.
      If they want to make a swap, guide them on the format.
      
      Keep responses under 100 words and be conversational.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm having trouble processing your request right now. Please try again.";
    }
  }

  getTokenInfo(symbol: string): TokenInfo | null {
    return TOKENS[symbol.toUpperCase()] || null;
  }

  getSupportedTokens(): TokenInfo[] {
    return Object.values(TOKENS);
  }
}

export default new GeminiAI();
export { TOKENS, type SwapInstruction, type TokenInfo };