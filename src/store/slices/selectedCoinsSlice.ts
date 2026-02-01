import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coin } from '../../types';

interface SelectedCoinsState {
  selectedCoins: Coin[];
}

const MAX_SELECTED_COINS = 5;
const STORAGE_KEY = 'selectedCoins';

const loadFromStorage = (): Coin[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (coins: Coin[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const initialState: SelectedCoinsState = {
  selectedCoins: loadFromStorage(),
};

const selectedCoinsSlice = createSlice({
  name: 'selectedCoins',
  initialState,
  reducers: {
    toggleCoinSelection: (state, action: PayloadAction<Coin>) => {
      const coin = action.payload;
      const index = state.selectedCoins.findIndex((c) => c.id === coin.id);

      if (index >= 0) {
        // Remove coin if already selected
        state.selectedCoins.splice(index, 1);
      } else {
        // Add coin if not selected
        if (state.selectedCoins.length < MAX_SELECTED_COINS) {
          state.selectedCoins.push(coin);
        }
      }
      saveToStorage(state.selectedCoins);
    },
    removeCoin: (state, action: PayloadAction<string>) => {
      state.selectedCoins = state.selectedCoins.filter(
        (coin) => coin.id !== action.payload
      );
      saveToStorage(state.selectedCoins);
    },
    clearSelectedCoins: (state) => {
      state.selectedCoins = [];
      saveToStorage(state.selectedCoins);
    },
    setSelectedCoins: (state, action: PayloadAction<Coin[]>) => {
      state.selectedCoins = action.payload;
      saveToStorage(state.selectedCoins);
    },
  },
});

export const {
  toggleCoinSelection,
  removeCoin,
  clearSelectedCoins,
  setSelectedCoins,
} = selectedCoinsSlice.actions;
export default selectedCoinsSlice.reducer;






