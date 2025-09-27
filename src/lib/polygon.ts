import { ethers } from 'ethers';

// Polygon Mainnet configuration
export const POLYGON_CONFIG = {
  chainId: 137,
  name: 'Polygon',
  currency: 'MATIC',
  decimals: 18,
  rpcUrl: 'https://polygon-rpc.com',
  blockExplorerUrl: 'https://polygonscan.com',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  }
};

// Common ERC-20 tokens on Polygon
export const POLYGON_TOKENS = {
  MATIC: {
    address: '0x0000000000000000000000000000000000001010',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  },
  USDC: {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  USDT: {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  },
  WETH: {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  }
};

// ERC-20 ABI (minimal)
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

// Initialize Polygon provider
let polygonProvider: ethers.JsonRpcProvider;

export const getPolygonProvider = (): ethers.JsonRpcProvider => {
  if (!polygonProvider) {
    polygonProvider = new ethers.JsonRpcProvider(POLYGON_CONFIG.rpcUrl);
  }
  return polygonProvider;
};

/**
 * Get MATIC balance for an address
 */
export const getMaticBalance = async (address: string): Promise<string> => {
  try {
    const provider = getPolygonProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting MATIC balance:', error);
    return '0';
  }
};

/**
 * Get ERC-20 token balance
 */
export const getTokenBalance = async (
  tokenAddress: string, 
  userAddress: string, 
  decimals: number = 18
): Promise<string> => {
  try {
    const provider = getPolygonProvider();
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(userAddress);
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};

/**
 * Get all token balances for an address
 */
export const getAllTokenBalances = async (address: string) => {
  try {
    const balances = await Promise.all([
      getMaticBalance(address),
      ...Object.values(POLYGON_TOKENS).filter(token => token.address !== POLYGON_TOKENS.MATIC.address)
        .map(token => getTokenBalance(token.address, address, token.decimals))
    ]);

    const tokenBalances = Object.values(POLYGON_TOKENS).map((token, index) => ({
      ...token,
      balance: index === 0 ? balances[0] : balances[index],
      balanceUSD: '0' // TODO: Add price API integration
    }));

    return tokenBalances;
  } catch (error) {
    console.error('Error getting all token balances:', error);
    return [];
  }
};

/**
 * Get recent transactions for an address
 */
export const getRecentTransactions = async (address: string, limit: number = 10) => {
  try {
    // Using Polygonscan API - you'll need to get an API key
    const apiKey = import.meta.env.VITE_POLYGONSCAN_API_KEY || '';
    const response = await fetch(
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        timeStamp: new Date(parseInt(tx.timeStamp) * 1000),
        status: tx.isError === '0' ? 'success' : 'failed',
        gasUsed: tx.gasUsed,
        gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei')
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

/**
 * Send MATIC transaction
 */
export const sendMaticTransaction = async (
  privateKey: string,
  toAddress: string,
  amount: string
): Promise<string> => {
  try {
    const provider = getPolygonProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount)
    });
    
    return tx.hash;
  } catch (error) {
    console.error('Error sending MATIC transaction:', error);
    throw error;
  }
};

/**
 * Send ERC-20 token transaction
 */
export const sendTokenTransaction = async (
  privateKey: string,
  tokenAddress: string,
  toAddress: string,
  amount: string,
  decimals: number = 18
): Promise<string> => {
  try {
    const provider = getPolygonProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
    
    const tx = await contract.transfer(toAddress, ethers.parseUnits(amount, decimals));
    return tx.hash;
  } catch (error) {
    console.error('Error sending token transaction:', error);
    throw error;
  }
};