import axios from 'axios';
import { Coin, CoinDetails } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const axiosConfig = {
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
};

export const coinGeckoApi = {
  // Fetch list of coins for home page
  getCoins: async (): Promise<Coin[]> => {
    const response = await axios.get<Coin[]>(
      `${BASE_URL}/coins/markets?vs_currency=usd&per_page=100&page=1`,
      axiosConfig
    );
    return response.data;
  },

  // Fetch single coin details for More Info
  getCoinDetails: async (coinId: string): Promise<CoinDetails> => {
    const response = await axios.get<CoinDetails>(
      `${BASE_URL}/coins/${coinId}`,
      axiosConfig
    );
    return response.data;
  },

  // Fetch coin details with market data for AI recommendation
  getCoinDetailsForAI: async (coinId: string): Promise<CoinDetails> => {
    const response = await axios.get<CoinDetails>(
      `${BASE_URL}/coins/${coinId}?market_data=true`,
      axiosConfig
    );
    return response.data;
  },
};


