import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RealtimePrice } from '../../types';

interface RealtimePricesState {
  prices: { [symbol: string]: RealtimePrice[] };
  latestPrices: { [symbol: string]: number };
}

const initialState: RealtimePricesState = {
  prices: {},
  latestPrices: {},
};

const MAX_DATA_POINTS = 60; // Keep last 60 seconds of data

const realtimePricesSlice = createSlice({
  name: 'realtimePrices',
  initialState,
  reducers: {
    addPriceData: (
      state,
      action: PayloadAction<{ symbol: string; price: number; timestamp: number }>
    ) => {
      const { symbol, price, timestamp } = action.payload;

      if (!state.prices[symbol]) {
        state.prices[symbol] = [];
      }

      state.prices[symbol].push({ symbol, price, timestamp });
      state.latestPrices[symbol] = price;

      // Keep only last MAX_DATA_POINTS
      if (state.prices[symbol].length > MAX_DATA_POINTS) {
        state.prices[symbol] = state.prices[symbol].slice(-MAX_DATA_POINTS);
      }
    },
    clearPriceData: (state, action: PayloadAction<string>) => {
      delete state.prices[action.payload];
      delete state.latestPrices[action.payload];
    },
    clearAllPriceData: (state) => {
      state.prices = {};
      state.latestPrices = {};
    },
  },
});

export const { addPriceData, clearPriceData, clearAllPriceData } =
  realtimePricesSlice.actions;
export default realtimePricesSlice.reducer;






