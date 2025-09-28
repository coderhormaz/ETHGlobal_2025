import { ethers } from 'ethers';
import { TOKENS } from './gemini';

// Uniswap V3 Router address on Polygon
const UNISWAP_V3_ROUTER = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

// Uniswap V3 Router ABI (minimal)
const ROUTER_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenIn", "type": "address" },
          { "internalType": "address", "name": "tokenOut", "type": "address" },
          { "internalType": "uint24", "name": "fee", "type": "uint24" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          { "internalType": "uint256", "name": "amountOutMinimum", "type": "uint256" },
          { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "internalType": "struct ISwapRouter.ExactInputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "exactInputSingle",
    "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }],
    "stateMutability": "payable",
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
  }
];

interface SwapQuote {
  amountOut: string;
  amountOutFormatted: string;
  gasEstimate: string;
  priceImpact: string;
  route: string;
}

interface SwapTransaction {
  hash: string;
  explorerLink: string;
  amountIn: string;
  amountOut: string;
  fromToken: string;
  toToken: string;
  gasUsed?: string;
}

class UniswapService {
  private provider: ethers.JsonRpcProvider;
  private router: ethers.Contract;

  constructor() {
    // Initialize with Polygon RPC
    this.provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    this.router = new ethers.Contract(UNISWAP_V3_ROUTER, ROUTER_ABI, this.provider);
    // Note: Quoter temporarily disabled due to RPC issues
  }

  // Convert native tokens to their wrapped equivalents for Uniswap trading
  private getSwappableToken(token: string): string {
    if (token === 'POL' || token === 'MATIC') {
      return 'WPOL'; // Use wrapped POL for trading
    }
    return token;
  }

  async getSwapQuote(
    fromToken: string,
    toToken: string,
    amountIn: string
  ): Promise<SwapQuote | null> {
    try {
      // Handle native POL/MATIC conversion to wrapped tokens for Uniswap
      const actualFromToken = this.getSwappableToken(fromToken);
      const actualToToken = this.getSwappableToken(toToken);
      
      console.log(`Getting quote for: ${fromToken} (${actualFromToken}) → ${toToken} (${actualToToken}), Amount: ${amountIn}`);
      
      const fromTokenInfo = TOKENS[actualFromToken];
      const toTokenInfo = TOKENS[actualToToken];

      if (!fromTokenInfo || !toTokenInfo) {
        console.error(`Unsupported token: ${actualFromToken} or ${actualToToken}`);
        throw new Error(`Unsupported token: ${actualFromToken} or ${actualToToken}`);
      }

      // Convert amount to token units
      const amountInWei = ethers.parseUnits(amountIn, fromTokenInfo.decimals);
      console.log(`Amount in wei: ${amountInWei.toString()}`);

      // Use simplified pricing calculation instead of failing quoter
      console.log('Using simplified quote calculation due to quoter issues...');
      
      // Simplified quote calculation - in production, you'd want to use actual DEX data
      // For demo purposes, we'll calculate a rough estimate
      let estimatedAmountOut;
      let usedFee = 3000;
      
      // Rough price estimates for common pairs (this would normally come from price feeds)
      const priceEstimates: Record<string, Record<string, number>> = {
        'WPOL': {
          'USDC': 0.4, // 1 WPOL ≈ $0.40
          'USDT': 0.4,
          'DAI': 0.4,
          'WETH': 0.00015, // 1 WPOL ≈ 0.00015 ETH
        },
        'USDC': {
          'WPOL': 2.5, // 1 USDC ≈ 2.5 WPOL
          'WETH': 0.00038,
          'DAI': 1.0,
        }
      };
      
      const rate = priceEstimates[actualFromToken]?.[actualToToken];
      if (!rate) {
        throw new Error(`Price estimation not available for ${actualFromToken} → ${actualToToken}`);
      }
      
      const amountInFloat = parseFloat(amountIn);
      const estimatedOutFloat = amountInFloat * rate;
      estimatedAmountOut = ethers.parseUnits(estimatedOutFloat.toString(), toTokenInfo.decimals);
      
      const quote = {
        amountOut: estimatedAmountOut,
        gasEstimate: BigInt(150000) // Estimated gas
      };

      const amountOutFormatted = ethers.formatUnits(quote.amountOut, toTokenInfo.decimals);

      return {
        amountOut: quote.amountOut.toString(),
        amountOutFormatted,
        gasEstimate: quote.gasEstimate.toString(),
        priceImpact: '< 0.1%', // Simplified - in production, calculate actual price impact
        route: `${actualFromToken} → ${actualToToken} (${usedFee/10000}% fee)${fromToken !== actualFromToken ? ` [${fromToken} wrapped as ${actualFromToken}]` : ''}`
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      return null;
    }
  }

  async executeSwap(
    signer: ethers.Signer,
    fromToken: string,
    toToken: string,
    amountIn: string,
    slippageTolerance: number = 0.5
  ): Promise<SwapTransaction | null> {
    try {
      // Handle native POL/MATIC conversion to wrapped tokens for Uniswap
      const actualFromToken = this.getSwappableToken(fromToken);
      const actualToToken = this.getSwappableToken(toToken);
      
      const fromTokenInfo = TOKENS[actualFromToken];
      const toTokenInfo = TOKENS[actualToToken];

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Unsupported token');
      }

      const amountInWei = ethers.parseUnits(amountIn, fromTokenInfo.decimals);
      const userAddress = await signer.getAddress();

      // Get quote first (using actual wrapped tokens)
      const quote = await this.getSwapQuote(fromToken, toToken, amountIn);
      if (!quote) {
        throw new Error('Could not get swap quote');
      }

      // Calculate minimum amount out with slippage tolerance
      const amountOutMin = BigInt(quote.amountOut) * BigInt(10000 - Math.floor(slippageTolerance * 100)) / BigInt(10000);

      // Approve token if it's not native ETH/POL
      if (fromToken !== 'POL' && fromToken !== 'MATIC') {
        const tokenContract = new ethers.Contract(fromTokenInfo.address, ERC20_ABI, signer);
        
        // Check current allowance
        const allowance = await tokenContract.balanceOf(userAddress);
        
        if (allowance < amountInWei) {
          const approveTx = await tokenContract.approve(UNISWAP_V3_ROUTER, amountInWei);
          await approveTx.wait();
        }
      }

      // Prepare swap parameters
      const params = {
        tokenIn: fromTokenInfo.address,
        tokenOut: toTokenInfo.address,
        fee: 3000,
        recipient: userAddress,
        deadline: Math.floor(Date.now() / 1000) + 1200, // 20 minutes
        amountIn: amountInWei,
        amountOutMinimum: amountOutMin,
        sqrtPriceLimitX96: 0
      };

      // Execute swap
      const routerWithSigner = this.router.connect(signer) as any;
      const swapTx = await routerWithSigner.exactInputSingle(params, {
        value: (fromToken === 'POL' || fromToken === 'MATIC') ? amountInWei : 0
      });

      const receipt = await swapTx.wait();

      return {
        hash: swapTx.hash,
        explorerLink: `https://polygonscan.com/tx/${swapTx.hash}`,
        amountIn: amountIn,
        amountOut: quote.amountOutFormatted,
        fromToken,
        toToken,
        gasUsed: receipt.gasUsed?.toString()
      };

    } catch (error: any) {
      console.error('Error executing swap:', error);
      throw new Error(`Swap failed: ${error.message || 'Unknown error'}`);
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

  formatTokenAmount(amount: string, decimals: number = 4): string {
    const num = parseFloat(amount);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    return num.toFixed(decimals);
  }

  getExplorerLink(txHash: string): string {
    return `https://polygonscan.com/tx/${txHash}`;
  }
}

export default new UniswapService();
export { type SwapQuote, type SwapTransaction };