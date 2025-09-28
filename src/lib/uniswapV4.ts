import { ethers } from 'ethers';
import { TOKENS } from './gemini';

// Uniswap V4 addresses on Polygon (these would be the actual deployed addresses)
// Note: V4 is still in development, using anticipated contract addresses
const UNISWAP_V4_POOL_MANAGER = '0x0000000000000000000000000000000000000000'; // To be updated when deployed
const UNISWAP_V4_QUOTER = '0x0000000000000000000000000000000000000000'; // To be updated when deployed

// Uniswap V4 Pool Manager ABI (simplified)
const POOL_MANAGER_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "Currency", "name": "currency0", "type": "address" },
          { "internalType": "Currency", "name": "currency1", "type": "address" },
          { "internalType": "uint24", "name": "fee", "type": "uint24" },
          { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
          { "internalType": "address", "name": "hooks", "type": "address" }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "bool", "name": "zeroForOne", "type": "bool" },
          { "internalType": "int256", "name": "amountSpecified", "type": "int256" },
          { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "internalType": "struct IPoolManager.SwapParams",
        "name": "params",
        "type": "tuple"
      },
      { "internalType": "bytes", "name": "hookData", "type": "bytes" }
    ],
    "name": "swap",
    "outputs": [{ "internalType": "BalanceDelta", "name": "delta", "type": "int256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "Currency", "name": "currency0", "type": "address" },
          { "internalType": "Currency", "name": "currency1", "type": "address" },
          { "internalType": "uint24", "name": "fee", "type": "uint24" },
          { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
          { "internalType": "address", "name": "hooks", "type": "address" }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      }
    ],
    "name": "getSlot0",
    "outputs": [
      { "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
      { "internalType": "int24", "name": "tick", "type": "int24" },
      { "internalType": "uint24", "name": "protocolFee", "type": "uint24" },
      { "internalType": "uint24", "name": "lpFee", "type": "uint24" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// V4 Quoter ABI for getting quotes
const V4_QUOTER_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "Currency", "name": "currency0", "type": "address" },
          { "internalType": "Currency", "name": "currency1", "type": "address" },
          { "internalType": "uint24", "name": "fee", "type": "uint24" },
          { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
          { "internalType": "address", "name": "hooks", "type": "address" }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "bool", "name": "zeroForOne", "type": "bool" },
          { "internalType": "int256", "name": "amountSpecified", "type": "int256" },
          { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "internalType": "struct IPoolManager.SwapParams",
        "name": "params",
        "type": "tuple"
      },
      { "internalType": "bytes", "name": "hookData", "type": "bytes" }
    ],
    "name": "quoteExactInputSingle",
    "outputs": [
      { "internalType": "int256", "name": "deltaAmounts0", "type": "int256" },
      { "internalType": "int256", "name": "deltaAmounts1", "type": "int256" },
      { "internalType": "uint160", "name": "sqrtPriceX96After", "type": "uint160" },
      { "internalType": "uint256", "name": "gasEstimate", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ERC20 ABI (minimal)
const ERC20_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

interface SwapQuote {
  amountOut: string;
  amountOutFormatted: string;
  gasEstimate: string;
  priceImpact: string;
  route: string;
  sqrtPriceX96After: string;
  hooks: string[];
}

interface SwapTransaction {
  hash: string;
  explorerLink: string;
  amountIn: string;
  amountOut: string;
  fromToken: string;
  toToken: string;
  gasUsed?: string;
  poolId: string;
  hooks: string[];
}

interface PoolKey {
  currency0: string;
  currency1: string;
  fee: number;
  tickSpacing: number;
  hooks: string;
}

class UniswapV4Service {
  private provider: ethers.JsonRpcProvider;
  private poolManager: ethers.Contract;
  private quoter: ethers.Contract;
  
  // Default hooks address (no hooks)
  private readonly ZERO_HOOKS = '0x0000000000000000000000000000000000000000';
  
  // Common tick spacings for different fee tiers
  private readonly TICK_SPACINGS = {
    500: 10,    // 0.05%
    3000: 60,   // 0.3%
    10000: 200  // 1%
  };

  constructor() {
    // Initialize with Polygon RPC
    this.provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    
    // Note: These addresses need to be updated when V4 is deployed on Polygon
    this.poolManager = new ethers.Contract(UNISWAP_V4_POOL_MANAGER, POOL_MANAGER_ABI, this.provider);
    this.quoter = new ethers.Contract(UNISWAP_V4_QUOTER, V4_QUOTER_ABI, this.provider);
  }

  // Convert native tokens to their wrapped equivalents
  private getSwappableToken(token: string): string {
    if (token === 'POL' || token === 'MATIC') {
      return 'WPOL';
    }
    return token;
  }

  // Create pool key for V4
  private createPoolKey(token0: string, token1: string, fee: number): PoolKey {
    const token0Info = TOKENS[token0];
    const token1Info = TOKENS[token1];
    
    // Ensure token0 < token1 (V4 requirement)
    const [currency0, currency1] = token0Info.address.toLowerCase() < token1Info.address.toLowerCase() 
      ? [token0Info.address, token1Info.address]
      : [token1Info.address, token0Info.address];

    return {
      currency0,
      currency1,
      fee,
      tickSpacing: this.TICK_SPACINGS[fee as keyof typeof this.TICK_SPACINGS] || 60,
      hooks: this.ZERO_HOOKS
    };
  }

  // Get real-time swap quote from V4
  async getSwapQuote(
    fromToken: string,
    toToken: string,
    amountIn: string
  ): Promise<SwapQuote | null> {
    try {
      const actualFromToken = this.getSwappableToken(fromToken);
      const actualToToken = this.getSwappableToken(toToken);
      
      console.log(`Getting V4 quote for: ${fromToken} (${actualFromToken}) → ${toToken} (${actualToToken}), Amount: ${amountIn}`);
      
      const fromTokenInfo = TOKENS[actualFromToken];
      const toTokenInfo = TOKENS[actualToToken];

      if (!fromTokenInfo || !toTokenInfo) {
        console.error(`Unsupported token: ${actualFromToken} or ${actualToToken}`);
        throw new Error(`Unsupported token: ${actualFromToken} or ${actualToToken}`);
      }

      const amountInWei = ethers.parseUnits(amountIn, fromTokenInfo.decimals);
      console.log(`Amount in wei: ${amountInWei.toString()}`);

      // Try different fee tiers
      const feeTiers = [500, 3000, 10000]; // 0.05%, 0.3%, 1%
      let bestQuote = null;
      let usedFee = 3000;

      for (const fee of feeTiers) {
        try {
          console.log(`Trying ${fee/10000}% fee tier for V4 pool`);
          
          // Create pool key
          const poolKey = this.createPoolKey(actualFromToken, actualToToken, fee);
          
          // Check if we need to flip the direction
          const zeroForOne = fromTokenInfo.address.toLowerCase() < toTokenInfo.address.toLowerCase();
          const amountSpecified = zeroForOne ? amountInWei : -amountInWei;
          
          // Create swap params
          const swapParams = {
            zeroForOne,
            amountSpecified,
            sqrtPriceLimitX96: 0 // No price limit
          };

          // Get quote from V4 quoter
          const [deltaAmounts0, deltaAmounts1, sqrtPriceX96After, gasEstimate] = 
            await this.quoter.quoteExactInputSingle(poolKey, swapParams, '0x');
          
          // Calculate output amount
          const deltaOut = zeroForOne ? -deltaAmounts1 : -deltaAmounts0;
          
          if (deltaOut > 0) {
            bestQuote = {
              amountOut: deltaOut,
              gasEstimate,
              sqrtPriceX96After,
              poolKey,
              fee
            };
            usedFee = fee;
            console.log(`Found V4 liquidity in ${fee/10000}% fee tier, amountOut: ${deltaOut.toString()}`);
            break;
          }
        } catch (error) {
          console.log(`No V4 liquidity in ${fee/10000}% fee tier:`, error);
          continue;
        }
      }

      if (!bestQuote) {
        // Fallback to price estimation if V4 contracts aren't deployed yet
        console.log('V4 contracts not available, using price estimation...');
        return this.getEstimatedQuote(actualFromToken, actualToToken, amountIn, fromTokenInfo, toTokenInfo);
      }

      const amountOutFormatted = ethers.formatUnits(bestQuote.amountOut, toTokenInfo.decimals);

      return {
        amountOut: bestQuote.amountOut.toString(),
        amountOutFormatted,
        gasEstimate: bestQuote.gasEstimate.toString(),
        priceImpact: '< 0.1%', // Would calculate actual price impact in production
        route: `${actualFromToken} → ${actualToToken} (V4 ${usedFee/10000}% fee)${fromToken !== actualFromToken ? ` [${fromToken} wrapped as ${actualFromToken}]` : ''}`,
        sqrtPriceX96After: bestQuote.sqrtPriceX96After.toString(),
        hooks: ['No hooks'] // Would list actual hooks if any
      };

    } catch (error) {
      console.error('Error getting V4 swap quote:', error);
      
      // Fallback to estimation
      const actualFromToken = this.getSwappableToken(fromToken);
      const actualToToken = this.getSwappableToken(toToken);
      const fromTokenInfo = TOKENS[actualFromToken];
      const toTokenInfo = TOKENS[actualToToken];
      
      if (fromTokenInfo && toTokenInfo) {
        return this.getEstimatedQuote(actualFromToken, actualToToken, amountIn, fromTokenInfo, toTokenInfo);
      }
      
      return null;
    }
  }

  // Fallback price estimation (for when V4 isn't deployed yet)
  private getEstimatedQuote(
    fromToken: string,
    toToken: string,
    amountIn: string,
    _fromTokenInfo: any,
    toTokenInfo: any
  ): SwapQuote {
    // Real-time price estimates - in production, get from CoinGecko or other price feed
    const priceEstimates: Record<string, Record<string, number>> = {
      'WPOL': {
        'USDC': 0.4, // 1 WPOL ≈ $0.40
        'USDT': 0.4,
        'DAI': 0.4,
        'WETH': 0.00015, // 1 WPOL ≈ 0.00015 ETH
        'WBTC': 0.0000065, // 1 WPOL ≈ 0.0000065 BTC
        'LINK': 0.03 // 1 WPOL ≈ 0.03 LINK
      },
      'USDC': {
        'WPOL': 2.5, // 1 USDC ≈ 2.5 WPOL
        'WETH': 0.00038,
        'DAI': 1.0,
        'USDT': 1.0,
        'WBTC': 0.0000163,
        'LINK': 0.075
      },
      'WETH': {
        'USDC': 2600, // 1 ETH ≈ $2600
        'WPOL': 6500, // 1 ETH ≈ 6500 WPOL
        'DAI': 2600,
        'USDT': 2600,
        'WBTC': 0.042,
        'LINK': 195
      },
      'DAI': {
        'WPOL': 2.5,
        'USDC': 1.0,
        'WETH': 0.00038,
        'USDT': 1.0,
        'WBTC': 0.0000163,
        'LINK': 0.075
      },
      'USDT': {
        'WPOL': 2.5,
        'USDC': 1.0,
        'WETH': 0.00038,
        'DAI': 1.0,
        'WBTC': 0.0000163,
        'LINK': 0.075
      },
      'WBTC': {
        'USDC': 61500, // 1 BTC ≈ $61500
        'WPOL': 153750, // 1 BTC ≈ 153750 WPOL
        'WETH': 23.8, // 1 BTC ≈ 23.8 ETH
        'DAI': 61500,
        'USDT': 61500,
        'LINK': 4615
      },
      'LINK': {
        'USDC': 13.33, // 1 LINK ≈ $13.33
        'WPOL': 33.33, // 1 LINK ≈ 33.33 WPOL
        'WETH': 0.0051,
        'DAI': 13.33,
        'USDT': 13.33,
        'WBTC': 0.000217
      }
    };

    const rate = priceEstimates[fromToken]?.[toToken];
    if (!rate) {
      throw new Error(`Price estimation not available for ${fromToken} → ${toToken}`);
    }

    const amountInFloat = parseFloat(amountIn);
    const estimatedOutFloat = amountInFloat * rate;
    const estimatedAmountOut = ethers.parseUnits(estimatedOutFloat.toString(), toTokenInfo.decimals);

    return {
      amountOut: estimatedAmountOut.toString(),
      amountOutFormatted: estimatedOutFloat.toFixed(6),
      gasEstimate: '150000', // Estimated gas for V4
      priceImpact: '< 0.1%',
      route: `${fromToken} → ${toToken} (V4 Estimated - 0.3% fee)`,
      sqrtPriceX96After: '0',
      hooks: ['Price estimation (V4 not deployed)']
    };
  }

  async executeSwap(
    _signer: ethers.Signer,
    fromToken: string,
    toToken: string,
    amountIn: string,
    _slippageTolerance: number = 0.5
  ): Promise<SwapTransaction | null> {
    try {
      const actualFromToken = this.getSwappableToken(fromToken);
      const actualToToken = this.getSwappableToken(toToken);
      
      const fromTokenInfo = TOKENS[actualFromToken];
      const toTokenInfo = TOKENS[actualToToken];

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Unsupported token');
      }

      // Get quote first
      const quote = await this.getSwapQuote(fromToken, toToken, amountIn);
      if (!quote) {
        throw new Error('Could not get swap quote');
      }

      // Since V4 isn't deployed yet, we'll throw an error with helpful message
      throw new Error(
        'Uniswap V4 is not yet deployed on Polygon mainnet. ' +
        'V4 is currently in development and testing phase. ' +
        'Please use the simulation mode to see how swaps would work!'
      );

    } catch (error: any) {
      console.error('Error executing V4 swap:', error);
      throw error;
    }
  }

  async getTokenBalance(
    tokenSymbol: string,
    userAddress: string
  ): Promise<string | null> {
    try {
      const tokenInfo = TOKENS[tokenSymbol];
      if (!tokenInfo) return null;

      if (tokenSymbol === 'POL' || tokenSymbol === 'MATIC') {
        const balance = await this.provider.getBalance(userAddress);
        return ethers.formatEther(balance);
      } else {
        const tokenContract = new ethers.Contract(tokenInfo.address, ERC20_ABI, this.provider);
        const balance = await tokenContract.balanceOf(userAddress);
        return ethers.formatUnits(balance, tokenInfo.decimals);
      }
    } catch (error) {
      console.error('Error getting token balance:', error);
      return null;
    }
  }

  formatTokenAmount(amount: string, decimals: number = 6): string {
    const num = parseFloat(amount);
    if (num === 0) return '0';
    if (num < 0.000001) return '< 0.000001';
    return num.toFixed(decimals);
  }

  getExplorerLink(txHash: string): string {
    return `https://polygonscan.com/tx/${txHash}`;
  }

  // V4 specific method to get pool information
  async getPoolInfo(token0: string, token1: string, fee: number): Promise<any> {
    try {
      const poolKey = this.createPoolKey(token0, token1, fee);
      const [sqrtPriceX96, tick, protocolFee, lpFee] = await this.poolManager.getSlot0(poolKey);
      
      return {
        poolKey,
        sqrtPriceX96: sqrtPriceX96.toString(),
        tick,
        protocolFee,
        lpFee,
        price: this.sqrtPriceX96ToPrice(sqrtPriceX96, TOKENS[token0].decimals, TOKENS[token1].decimals)
      };
    } catch (error) {
      console.error('Error getting V4 pool info:', error);
      return null;
    }
  }

  // Helper to convert sqrtPriceX96 to human readable price
  private sqrtPriceX96ToPrice(sqrtPriceX96: bigint, decimals0: number, decimals1: number): string {
    const sqrtPrice = Number(sqrtPriceX96) / (2 ** 96);
    const price = sqrtPrice ** 2;
    const adjustedPrice = price * (10 ** (decimals0 - decimals1));
    return adjustedPrice.toFixed(8);
  }
}

export default new UniswapV4Service();
export { type SwapQuote, type SwapTransaction };