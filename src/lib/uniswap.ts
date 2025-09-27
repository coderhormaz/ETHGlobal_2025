import { ethers } from 'ethers';
import GeminiAI from './gemini';

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

// Quoter V2 ABI (for price quotes)
const QUOTER_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "tokenIn", "type": "address" },
      { "internalType": "address", "name": "tokenOut", "type": "address" },
      { "internalType": "uint24", "name": "fee", "type": "uint24" },
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
    ],
    "name": "quoteExactInputSingle",
    "outputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
      { "internalType": "uint160", "name": "sqrtPriceX96After", "type": "uint160" },
      { "internalType": "uint32", "name": "initializedTicksCrossed", "type": "uint32" },
      { "internalType": "uint256", "name": "gasEstimate", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const QUOTER_V2_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';

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
  private quoter: ethers.Contract;

  constructor() {
    // Initialize with Polygon RPC
    this.provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    this.router = new ethers.Contract(UNISWAP_V3_ROUTER, ROUTER_ABI, this.provider);
    this.quoter = new ethers.Contract(QUOTER_V2_ADDRESS, QUOTER_ABI, this.provider);
  }

  async getSwapQuote(
    fromToken: string,
    toToken: string,
    amountIn: string
  ): Promise<SwapQuote | null> {
    try {
      const fromTokenInfo = GeminiAI.getTokenInfo(fromToken);
      const toTokenInfo = GeminiAI.getTokenInfo(toToken);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Unsupported token');
      }

      // Convert amount to token units
      const amountInWei = ethers.parseUnits(amountIn, fromTokenInfo.decimals);

      // Get quote from Uniswap V3
      const fee = 3000; // 0.3% fee tier (most common)
      
      const [amountOut, , , gasEstimate] = await this.quoter.quoteExactInputSingle.staticCall(
        fromTokenInfo.address,
        toTokenInfo.address,
        fee,
        amountInWei,
        0
      );

      const amountOutFormatted = ethers.formatUnits(amountOut, toTokenInfo.decimals);

      return {
        amountOut: amountOut.toString(),
        amountOutFormatted,
        gasEstimate: gasEstimate.toString(),
        priceImpact: '< 0.1%', // Simplified - in production, calculate actual price impact
        route: `${fromToken} → ${toToken} (0.3% fee)`
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
      const fromTokenInfo = GeminiAI.getTokenInfo(fromToken);
      const toTokenInfo = GeminiAI.getTokenInfo(toToken);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Unsupported token');
      }

      const amountInWei = ethers.parseUnits(amountIn, fromTokenInfo.decimals);
      const userAddress = await signer.getAddress();

      // Get quote first
      const quote = await this.getSwapQuote(fromToken, toToken, amountIn);
      if (!quote) {
        throw new Error('Could not get swap quote');
      }

      // Calculate minimum amount out with slippage tolerance
      const amountOutMin = BigInt(quote.amountOut) * BigInt(10000 - Math.floor(slippageTolerance * 100)) / BigInt(10000);

      // Approve token if it's not native ETH/MATIC
      if (fromToken !== 'MATIC') {
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
        value: fromToken === 'MATIC' ? amountInWei : 0
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
      const tokenInfo = GeminiAI.getTokenInfo(tokenSymbol);
      if (!tokenInfo) return null;

      if (tokenSymbol === 'MATIC') {
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