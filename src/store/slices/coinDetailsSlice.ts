import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CoinDetails } from '../../types';

interface CoinDetailsState {
  details: { [coinId: string]: CoinDetails };
  loading: { [coinId: string]: boolean };
  error: { [coinId: string]: string | null };
}

const initialState: CoinDetailsState = {
  details: {},
  loading: {},
  error: {},
};

export const fetchCoinDetails = createAsyncThunk(
  'coinDetails/fetchCoinDetails',
  async (coinId: string) => {
    const response = await axios.get<CoinDetails>(
      `https://api.coingecko.com/api/v3/coins/${coinId}`
    );
    return { coinId, data: response.data };
  }
);

const coinDetailsSlice = createSlice({
  name: 'coinDetails',
  initialState,
  reducers: {
    clearCoinDetails: (state, action: PayloadAction<string>) => {
      delete state.details[action.payload];
      delete state.loading[action.payload];
      delete state.error[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoinDetails.pending, (state, action) => {
        const coinId = action.meta.arg;
        state.loading[coinId] = true;
        state.error[coinId] = null;
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action) => {
        const { coinId, data } = action.payload;
        state.loading[coinId] = false;
        state.details[coinId] = data;
        state.error[coinId] = null;
      })
      .addCase(fetchCoinDetails.rejected, (state, action) => {
        const coinId = action.meta.arg;
        state.loading[coinId] = false;
        state.error[coinId] = action.error.message || 'Failed to fetch coin details';
      });
  },
});

export const { clearCoinDetails } = coinDetailsSlice.actions;
export default coinDetailsSlice.reducer;






