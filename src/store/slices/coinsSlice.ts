import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Coin } from '../../types';

interface CoinsState {
  coins: Coin[];
  filteredCoins: Coin[];
  loading: boolean;
  error: string | null;
}

const initialState: CoinsState = {
  coins: [],
  filteredCoins: [],
  loading: false,
  error: null,
};

export const fetchCoins = createAsyncThunk(
  'coins/fetchCoins',
  async (_, { rejectWithValue }) => {
    console.log('Fetching coins from API...');
    try {
      const response = await axios.get<Coin[]>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1',
        {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      console.log('Coins fetched successfully:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching coins:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMsg = `שגיאת שרת: ${error.response.status} - ${error.response.data?.error || 'שגיאה לא ידועה'}`;
        console.error('Server error:', errorMsg);
        return rejectWithValue(errorMsg);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received');
        return rejectWithValue('לא התקבלה תשובה מהשרת. בדוק את החיבור לאינטרנט.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        return rejectWithValue(error.message || 'שגיאה בטעינת המטבעות');
      }
    }
  }
);

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    filterCoins: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      if (searchTerm === '') {
        state.filteredCoins = state.coins;
      } else {
        state.filteredCoins = state.coins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(searchTerm) ||
            coin.symbol.toLowerCase().includes(searchTerm)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload;
        state.filteredCoins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'שגיאה בטעינת המטבעות';
      });
  },
});

export const { filterCoins } = coinsSlice.actions;
export default coinsSlice.reducer;


