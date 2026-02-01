import React from 'react';
import { CoinDetails } from '../../types';
import './CoinPriceInfo.css';

interface CoinPriceInfoProps {
  coinDetails: CoinDetails;
}

const CoinPriceInfo: React.FC<CoinPriceInfoProps> = ({ coinDetails }) => {
  const { market_data } = coinDetails;
  const { usd, eur, ils } = market_data.current_price;

  return (
    <div className="coin-price-info">
      <div className="price-item">
        <span className="currency-symbol">$</span>
        <span className="price-value">{usd.toLocaleString()}</span>
        <span className="currency-code">USD</span>
      </div>
      <div className="price-item">
        <span className="currency-symbol">€</span>
        <span className="price-value">{eur.toLocaleString()}</span>
        <span className="currency-code">EUR</span>
      </div>
      <div className="price-item">
        <span className="currency-symbol">₪</span>
        <span className="price-value">{ils.toLocaleString()}</span>
        <span className="currency-code">ILS</span>
      </div>
    </div>
  );
};

export default CoinPriceInfo;






