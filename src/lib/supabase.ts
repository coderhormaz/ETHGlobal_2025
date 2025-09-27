import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      user_wallets: {
        Row: {
          id: string
          user_id: string
          wallet_address: string
          encrypted_private_key: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wallet_address: string
          encrypted_private_key: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wallet_address?: string
          encrypted_private_key?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          wallet_address: string
          transaction_hash: string
          from_address: string
          to_address: string
          amount: string
          token_symbol: string
          token_address: string
          transaction_type: 'send' | 'receive'
          status: 'pending' | 'confirmed' | 'failed'
          block_number: number
          gas_used: string
          gas_price: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wallet_address: string
          transaction_hash: string
          from_address: string
          to_address: string
          amount: string
          token_symbol: string
          token_address: string
          transaction_type: 'send' | 'receive'
          status: 'pending' | 'confirmed' | 'failed'
          block_number?: number
          gas_used: string
          gas_price: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wallet_address?: string
          transaction_hash?: string
          from_address?: string
          to_address?: string
          amount?: string
          token_symbol?: string
          token_address?: string
          transaction_type?: 'send' | 'receive'
          status?: 'pending' | 'confirmed' | 'failed'
          block_number?: number
          gas_used?: string
          gas_price?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}