import axios from 'axios';

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: Date;
}

export interface PriceData {
  [key: string]: TokenPrice;
}

class PriceService {
  private cache: PriceData = {};
  private lastFetch: Date | null = null;
  private readonly CACHE_DURATION = 60000; // 1 minute in milliseconds
  
  // CoinGecko API mapping for tokens
  private readonly TOKEN_MAPPING = {
    'POL': 'matic-network', // POL (formerly MATIC) on CoinGecko
    'MATIC': 'matic-network', // Legacy support
    'ETH': 'ethereum',
    'WETH': 'weth',
    'USDC': 'usd-coin',
    'USDT': 'tether',
    'DAI': 'dai',
    'WBTC': 'wrapped-bitcoin',
    'BTC': 'bitcoin'
  };

  /**
   * Fetch real-time prices from CoinGecko API
   */
  async fetchPrices(tokens: string[] = Object.keys(this.TOKEN_MAPPING)): Promise<PriceData> {
    try {
      // Check cache validity
      if (this.lastFetch && Date.now() - this.lastFetch.getTime() < this.CACHE_DURATION) {
        return this.cache;
      }

      // Map tokens to CoinGecko IDs
      const coinIds = tokens
        .map(token => this.TOKEN_MAPPING[token.toUpperCase() as keyof typeof this.TOKEN_MAPPING])
        .filter(Boolean)
        .join(',');

      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: coinIds,
          vs_currencies: 'usd',
          include_24hr_change: 'true',
          include_market_cap: 'true',
          include_24hr_vol: 'true'
        },
        timeout: 5000
      });

      // Transform response to our format
      const newCache: PriceData = {};
      
      for (const [token, coinId] of Object.entries(this.TOKEN_MAPPING)) {
        const data = response.data[coinId];
        if (data) {
          newCache[token] = {
            symbol: token,
            price: data.usd || 0,
            change24h: data.usd_24h_change || 0,
            marketCap: data.usd_market_cap || 0,
            volume24h: data.usd_24h_vol || 0,
            lastUpdated: new Date()
          };

          // Special handling for MATIC -> POL transition
          if (token === 'MATIC') {
            newCache['POL'] = {
              ...newCache[token],
              symbol: 'POL'
            };
          }
        }
      }

      this.cache = newCache;
      this.lastFetch = new Date();
      
      return this.cache;
    } catch (error) {
      console.error('Error fetching prices:', error);
      
      // Return cached data if available, otherwise return empty object
      return this.cache;
    }
  }

  /**
   * Get price for a specific token
   */
  async getTokenPrice(token: string): Promise<TokenPrice | null> {
    const prices = await this.fetchPrices();
    
    // Handle MATIC -> POL mapping
    if (token.toUpperCase() === 'MATIC') {
      return prices['POL'] || prices['MATIC'] || null;
    }
    
    return prices[token.toUpperCase()] || null;
  }

  /**
   * Get multiple token prices
   */
  async getTokenPrices(tokens: string[]): Promise<PriceData> {
    const allPrices = await this.fetchPrices();
    const result: PriceData = {};

    for (const token of tokens) {
      const upperToken = token.toUpperCase();
      
      // Handle MATIC -> POL mapping
      if (upperToken === 'MATIC') {
        const price = allPrices['POL'] || allPrices['MATIC'];
        if (price) {
          result[token] = price;
        }
      } else {
        const price = allPrices[upperToken];
        if (price) {
          result[token] = price;
        }
      }
    }

    return result;
  }

  /**
   * Format price for display
   */
  formatPrice(price: number): string {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 1000) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  /**
   * Format percentage change
   */
  formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  /**
   * Get cached prices (no API call)
   */
  getCachedPrices(): PriceData {
    return { ...this.cache };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
    this.lastFetch = null;
  }
}

// Export singleton instance
export const priceService = new PriceService();
export default priceService;