import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coinsSlice';
import selectedCoinsReducer from './slices/selectedCoinsSlice';
import coinDetailsReducer from './slices/coinDetailsSlice';
import realtimePricesReducer from './slices/realtimePricesSlice';

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    selectedCoins: selectedCoinsReducer,
    coinDetails: coinDetailsReducer,
    realtimePrices: realtimePricesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;






