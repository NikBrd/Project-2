import axios from 'axios';
import { RealtimePriceData } from '../types';

const BASE_URL = 'https://min-api.cryptocompare.com/data';

export const cryptoCompareApi = {
  // Fetch realtime prices for multiple coins
  getRealtimePrices: async (symbols: string[]): Promise<RealtimePriceData> => {
    // Convert symbols to uppercase and join with comma
    const fsyms = symbols.map((s) => s.toUpperCase()).join(',');
    console.log('Fetching prices for symbols:', fsyms); // Debug log
    const response = await axios.get<RealtimePriceData>(
      `${BASE_URL}/pricemulti?fsyms=${fsyms}&tsyms=USD`,
      {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    console.log('API Response:', response.data); // Debug log
    return response.data;
  },
};



