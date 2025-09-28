import { ethers } from 'ethers';

interface WalletInfo {
  address: string;
  privateKey: string;
  balance: string;
}

interface TransactionRequest {
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
}

class AIWalletService {
  private wallet: ethers.HDNodeWallet | ethers.Wallet | null = null;
  private provider: ethers.JsonRpcProvider;
  private isInitialized = false;

  constructor() {
    // Initialize with Polygon RPC
    this.provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
  }

  // Generate a new wallet or load from stored private key
  async initializeWallet(privateKey?: string): Promise<WalletInfo> {
    try {
      if (privateKey) {
        // Load existing wallet
        this.wallet = new ethers.Wallet(privateKey, this.provider);
      } else {
        // Generate new wallet
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
      }

      this.isInitialized = true;

      if (!this.wallet) {
        throw new Error('Wallet initialization failed');
      }

      const balance = await this.provider.getBalance(this.wallet.address);
      const balanceEth = ethers.formatEther(balance);

      const walletInfo: WalletInfo = {
        address: this.wallet.address,
        privateKey: this.wallet.privateKey,
        balance: balanceEth
      };

      // Store in localStorage (in production, use secure storage)
      this.storeWalletSecurely(walletInfo);

      return walletInfo;
    } catch (error) {
      console.error('Error initializing wallet:', error);
      throw new Error('Failed to initialize wallet');
    }
  }

  // Load wallet from secure storage
  async loadStoredWallet(): Promise<WalletInfo | null> {
    try {
      const storedWallet = localStorage.getItem('ai_agent_wallet');
      if (!storedWallet) return null;

      const walletData = JSON.parse(storedWallet);
      
      // Decrypt and validate (simplified for demo)
      if (walletData.privateKey && walletData.address) {
        return await this.initializeWallet(walletData.privateKey);
      }
      
      return null;
    } catch (error) {
      console.error('Error loading stored wallet:', error);
      return null;
    }
  }

  // Store wallet securely (in production, use encryption)
  private storeWalletSecurely(walletInfo: WalletInfo): void {
    // WARNING: In production, encrypt the private key before storing
    const walletData = {
      address: walletInfo.address,
      privateKey: walletInfo.privateKey, // Should be encrypted
      timestamp: Date.now()
    };
    
    localStorage.setItem('ai_agent_wallet', JSON.stringify(walletData));
  }

  // Get wallet address
  getAddress(): string | null {
    return this.wallet?.address || null;
  }

  // Get signer instance
  getSigner(): ethers.Signer | null {
    return this.wallet;
  }

  // Sign transaction with user confirmation
  async signTransaction(
    transactionRequest: TransactionRequest,
    userConfirmed: boolean = false
  ): Promise<string> {
    if (!this.wallet || !this.isInitialized) {
      throw new Error('Wallet not initialized');
    }

    if (!userConfirmed) {
      throw new Error('User confirmation required');
    }

    try {
      // Prepare transaction
      const tx = {
        to: transactionRequest.to,
        value: transactionRequest.value || '0',
        data: transactionRequest.data || '0x',
        gasLimit: transactionRequest.gasLimit || '21000',
        gasPrice: transactionRequest.gasPrice || await this.provider.getFeeData().then(f => f.gasPrice?.toString() || '20000000000')
      };

      // Sign and send transaction
      const signedTx = await this.wallet.sendTransaction(tx);
      return signedTx.hash;
    } catch (error: any) {
      console.error('Error signing transaction:', error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  // Get wallet balance
  async getBalance(): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not initialized');
    
    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }

  // Get transaction status
  async getTransactionStatus(txHash: string) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return { status: 'pending', confirmations: 0 };
      }

      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      return {
        status: receipt.status === 1 ? 'success' : 'failed',
        confirmations,
        gasUsed: receipt.gasUsed?.toString(),
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return { status: 'unknown', confirmations: 0 };
    }
  }

  // Estimate gas for transaction
  async estimateGas(transactionRequest: TransactionRequest): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not initialized');

    try {
      const gasEstimate = await this.provider.estimateGas({
        to: transactionRequest.to,
        value: transactionRequest.value || '0',
        data: transactionRequest.data || '0x'
      });

      return gasEstimate.toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '21000'; // Default gas limit
    }
  }

  // Check if wallet is connected and has balance
  async validateWalletForTrading(): Promise<{ valid: boolean; message: string }> {
    if (!this.wallet || !this.isInitialized) {
      return { valid: false, message: 'Wallet not initialized' };
    }

    try {
      const balance = await this.getBalance();
      const balanceNum = parseFloat(balance);

      if (balanceNum < 0.001) {
        return { 
          valid: false, 
          message: 'Insufficient POL balance for gas fees. Please add some POL to your wallet.' 
        };
      }

      return { valid: true, message: 'Wallet ready for trading' };
    } catch (error) {
      return { valid: false, message: 'Unable to check wallet status' };
    }
  }

  // Clear wallet from storage
  clearWallet(): void {
    localStorage.removeItem('ai_agent_wallet');
    this.wallet = null;
    this.isInitialized = false;
  }

  // Export wallet info for backup
  exportWallet(): WalletInfo | null {
    if (!this.wallet) return null;

    return {
      address: this.wallet.address,
      privateKey: this.wallet.privateKey,
      balance: '0' // Will be fetched separately
    };
  }

  // Import wallet from private key
  async importWallet(privateKey: string): Promise<WalletInfo> {
    // Validate private key format
    if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
      throw new Error('Invalid private key format');
    }

    return await this.initializeWallet(privateKey);
  }

  // Get network info
  getNetworkInfo() {
    return {
      name: 'Polygon',
      chainId: 137,
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com'
    };
  }
}

export default new AIWalletService();
export { type WalletInfo, type TransactionRequest };