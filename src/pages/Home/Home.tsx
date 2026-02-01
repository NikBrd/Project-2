import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCoins } from '../../store/slices/coinsSlice';
import CoinCard from '../../components/CoinCard/CoinCard';
import ParallaxHeader from '../../components/ParallaxHeader/ParallaxHeader';
import './Home.css';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredCoins, loading, error } = useAppSelector((state) => state.coins);

  const handleRetry = () => {
    console.log('Retrying to fetch coins...');
    // Clear error and fetch again
    dispatch(fetchCoins());
  };

  useEffect(() => {
    // Always try to fetch on mount
    dispatch(fetchCoins());
  }, [dispatch]);

  // Debug: log state changes
  useEffect(() => {
    console.log('Home state:', { loading, error, coinsCount: filteredCoins.length });
  }, [loading, error, filteredCoins.length]);

  if (loading) {
    return (
      <div className="home-page">
        <ParallaxHeader />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>טוען מטבעות...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <ParallaxHeader />
        <div className="error-container">
          <p>שגיאה בטעינת המטבעות: {error}</p>
          <button 
            onClick={handleRetry} 
            className="retry-button"
            disabled={loading}
          >
            {loading ? 'טוען...' : 'נסה שוב'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <ParallaxHeader />
      <div className="coins-container">
        <div className="coins-grid">
          {filteredCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
        {filteredCoins.length === 0 && (
          <div className="no-results">
            <p>לא נמצאו מטבעות התואמים לחיפוש</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;


