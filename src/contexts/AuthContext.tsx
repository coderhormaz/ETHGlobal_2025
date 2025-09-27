import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { generateWallet, encryptPrivateKey, restoreWallet, type WalletData } from '../lib/wallet';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  wallet: WalletData | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadWallet: (password: string) => Promise<WalletData | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletData | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Auto-load wallet if user exists and has a stored wallet
      if (session?.user) {
        checkForExistingWallet(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setWallet(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Check for existing wallet when user signs in
        checkForExistingWallet(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user has an existing wallet without requiring password
  const checkForExistingWallet = async (userId: string) => {
    try {
      const { data: walletData, error } = await supabase
        .from('user_wallets')
        .select('wallet_address')
        .eq('user_id', userId)
        .single();

      if (!error && walletData) {
        // User has a wallet but we need password to decrypt it
        // For now, just set a partial wallet object with the address
        setWallet({ 
          address: walletData.wallet_address, 
          privateKey: '***encrypted***' 
        });
      }
    } catch (error) {
      // Wallet doesn't exist or other error - this is normal for new users
      console.log('No existing wallet found for user');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Generate new wallet
        const newWallet = generateWallet();
        
        // Encrypt private key with user's password
        const encryptedPrivateKey = encryptPrivateKey(newWallet.privateKey, password);

        // Store wallet in database
        const { error: walletError } = await supabase
          .from('user_wallets')
          .insert({
            user_id: data.user.id,
            wallet_address: newWallet.address,
            encrypted_private_key: encryptedPrivateKey,
          });

        if (walletError) {
          console.error('Error storing wallet:', walletError);
          throw new Error('Failed to create wallet');
        }

        setWallet(newWallet);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific error types
      if (error.message === 'User already registered') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (error.message.includes('Password')) {
        throw new Error('Password must be at least 6 characters long.');
      } else if (error.message.includes('Email')) {
        throw new Error('Please enter a valid email address.');
      } else {
        throw new Error('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Try to load user's wallet with the provided password
        try {
          await loadWallet(password);
        } catch (walletError) {
          // If wallet loading fails, user can still proceed but will need to enter password in wallet modal
          console.log('Could not auto-load wallet, user will need to unlock it manually');
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific error types
      if (error.message === 'Invalid login credentials') {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link before signing in.');
      } else {
        throw new Error('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadWallet = async (password: string) => {
    try {
      if (!user) return;

      // If we already have a fully loaded wallet, no need to reload
      if (wallet && wallet.privateKey !== '***encrypted***') {
        return;
      }

      const { data: walletData, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading wallet:', error);
        throw new Error('Failed to load wallet');
      }

      if (walletData) {
        // Decrypt and restore wallet
        const restoredWallet = restoreWallet(walletData.encrypted_private_key, password);
        setWallet(restoredWallet);
        return restoredWallet;
      }
    } catch (error) {
      console.error('Load wallet error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setWallet(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    wallet,
    signUp,
    signIn,
    signOut,
    loadWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};