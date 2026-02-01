export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
      eur: number;
      ils: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_percentage_30d_in_currency: {
      usd: number;
    };
    price_change_percentage_60d_in_currency: {
      usd: number;
    };
    price_change_percentage_200d_in_currency: {
      usd: number;
    };
  };
}

export interface RealtimePrice {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface RealtimePriceData {
  [symbol: string]: {
    USD: number;
  } | string;
  Response?: string;
  Message?: string;
}

export interface AIRecommendation {
  coinId: string;
  shouldBuy: boolean;
  explanation: string;
}



