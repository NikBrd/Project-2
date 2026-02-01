import React, { useState } from 'react';
import { Coin } from '../../types';
import './SelectionDialog.css';

interface SelectionDialogProps {
  selectedCoins: Coin[];
  newCoin: Coin;
  onClose: () => void;
  onConfirm: (coinToRemove: Coin) => void;
}

const SelectionDialog: React.FC<SelectionDialogProps> = ({
  selectedCoins,
  newCoin,
  onClose,
  onConfirm,
}) => {
  const [selectedCoinToRemove, setSelectedCoinToRemove] = useState<string>(
    selectedCoins[0]?.id || ''
  );

  const handleConfirm = () => {
    const coinToRemove = selectedCoins.find(
      (coin) => coin.id === selectedCoinToRemove
    );
    if (coinToRemove) {
      onConfirm(coinToRemove);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // Prevent closing on backdrop click
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className="dialog-overlay"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        // Prevent closing on Escape
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>בחירת מטבע להסרה</h2>
          <p>יש לך כבר 5 מטבעות נבחרים. בחר מטבע להסרה כדי להוסיף את {newCoin.name}:</p>
        </div>
        <div className="dialog-body">
          <div className="coins-list">
            {selectedCoins.map((coin) => (
              <label key={coin.id} className="coin-option">
                <input
                  type="radio"
                  name="coinToRemove"
                  value={coin.id}
                  checked={selectedCoinToRemove === coin.id}
                  onChange={(e) => setSelectedCoinToRemove(e.target.value)}
                />
                <div className="coin-option-content">
                  <img src={coin.image} alt={coin.name} className="coin-option-icon" />
                  <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="dialog-footer">
          <button className="confirm-btn" onClick={handleConfirm}>
            אישור
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionDialog;






