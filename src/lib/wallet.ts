import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

// Encryption key - In production, this should be more secure
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secure-encryption-key-here';

export interface WalletData {
  address: string;
  privateKey: string;
  mnemonic?: string;
}

/**
 * Generate a new Ethereum wallet
 */
export const generateWallet = (): WalletData => {
  const wallet = ethers.Wallet.createRandom();
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase
  };
};

/**
 * Encrypt private key for secure storage
 */
export const encryptPrivateKey = (privateKey: string, userPassword: string): string => {
  const combinedKey = ENCRYPTION_KEY + userPassword;
  return CryptoJS.AES.encrypt(privateKey, combinedKey).toString();
};

/**
 * Decrypt private key for wallet restoration
 */
export const decryptPrivateKey = (encryptedPrivateKey: string, userPassword: string): string => {
  const combinedKey = ENCRYPTION_KEY + userPassword;
  const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, combinedKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Restore wallet from encrypted private key
 */
export const restoreWallet = (encryptedPrivateKey: string, userPassword: string): WalletData => {
  const privateKey = decryptPrivateKey(encryptedPrivateKey, userPassword);
  const wallet = new ethers.Wallet(privateKey);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
};

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

/**
 * Format address for display (shortened)
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format balance for display
 */
export const formatBalance = (balance: string, decimals: number = 18): string => {
  try {
    const formatted = ethers.formatUnits(balance, decimals);
    return parseFloat(formatted).toFixed(4);
  } catch (error) {
    return '0.0000';
  }
};

/**
 * Parse balance to wei
 */
export const parseBalance = (balance: string, decimals: number = 18): string => {
  try {
    return ethers.parseUnits(balance, decimals).toString();
  } catch (error) {
    return '0';
  }
};