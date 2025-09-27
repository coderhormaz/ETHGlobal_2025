-- Supabase Database Schema for EthAI

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for storing user wallet information
CREATE TABLE user_wallets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    encrypted_private_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one wallet per user
    UNIQUE(user_id)
);

-- Table for storing transaction history
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    transaction_hash TEXT NOT NULL UNIQUE,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    amount TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    token_address TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('send', 'receive')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
    block_number INTEGER,
    gas_used TEXT NOT NULL,
    gas_price TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX idx_transactions_hash ON transactions(transaction_hash);

-- Row Level Security (RLS) Policies
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy for user_wallets: users can only see their own wallet
CREATE POLICY "Users can view their own wallet" ON user_wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet" ON user_wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON user_wallets
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for transactions: users can only see their own transactions
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_wallets_updated_at 
    BEFORE UPDATE ON user_wallets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON user_wallets TO authenticated;
GRANT SELECT, INSERT ON transactions TO authenticated;