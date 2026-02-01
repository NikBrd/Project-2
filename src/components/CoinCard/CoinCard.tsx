import React, { useState } from 'react';
import { Coin } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleCoinSelection } from '../../store/slices/selectedCoinsSlice';
import { fetchCoinDetails } from '../../store/slices/coinDetailsSlice';
import CoinPriceInfo from '../CoinPriceInfo/CoinPriceInfo';
import SelectionDialog from '../SelectionDialog/SelectionDialog';
import './CoinCard.css';

interface CoinCardProps {
  coin: Coin;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const dispatch = useAppDispatch();
  const selectedCoins = useAppSelector((state) => state.selectedCoins.selectedCoins);
  const coinDetails = useAppSelector((state) => state.coinDetails.details[coin.id]);
  const isLoadingDetails = useAppSelector(
    (state) => state.coinDetails.loading[coin.id]
  );
  const [showPriceInfo, setShowPriceInfo] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const isSelected = selectedCoins.some((c) => c.id === coin.id);

  const handleSwitchToggle = () => {
    if (!isSelected && selectedCoins.length >= 5) {
      setShowDialog(true);
      return;
    }
    dispatch(toggleCoinSelection(coin));
  };

  const handleMoreInfoClick = () => {
    if (!coinDetails && !isLoadingDetails) {
      dispatch(fetchCoinDetails(coin.id));
    }
    setShowPriceInfo(!showPriceInfo);
  };

  return (
    <>
      <div className="coin-card">
        <div className="coin-card-header">
          <img src={coin.image} alt={coin.name} className="coin-icon" />
          <div className="coin-info">
            <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
            <div className="coin-name">{coin.name}</div>
          </div>
        </div>
        <div className="coin-card-actions">
          <button
            className="more-info-btn"
            onClick={handleMoreInfoClick}
            aria-label="מידע נוסף"
          >
            More Info
          </button>
          <label className="switch">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleSwitchToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
        {showPriceInfo && coinDetails && (
          <CoinPriceInfo coinDetails={coinDetails} />
        )}
      </div>
      {showDialog && (
        <SelectionDialog
          selectedCoins={selectedCoins}
          newCoin={coin}
          onClose={() => setShowDialog(false)}
          onConfirm={(coinToRemove) => {
            dispatch(toggleCoinSelection(coinToRemove));
            dispatch(toggleCoinSelection(coin));
            setShowDialog(false);
          }}
        />
      )}
    </>
  );
};

export default CoinCard;






