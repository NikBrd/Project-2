import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCoinDetails } from '../../store/slices/coinDetailsSlice';
import { openAiApi } from '../../services/openAiApi';
import { coinGeckoApi } from '../../services/coinGeckoApi';
import { AIRecommendation } from '../../types';
import './AIRecommendations.css';

const AIRecommendations: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCoins = useAppSelector((state) => state.selectedCoins.selectedCoins);
  const coinDetails = useAppSelector((state) => state.coinDetails.details);
  const [recommendations, setRecommendations] = useState<{
    [coinId: string]: AIRecommendation;
  }>({});
  const [loadingRecommendations, setLoadingRecommendations] = useState<{
    [coinId: string]: boolean;
  }>({});

  const handleGetRecommendation = async (coinId: string) => {
    setLoadingRecommendations((prev) => ({ ...prev, [coinId]: true }));

    try {
      // Check if we have coin details, if not fetch them
      let details = coinDetails[coinId];
      if (!details) {
        const detailsData = await coinGeckoApi.getCoinDetailsForAI(coinId);
        details = detailsData;
        // Store in Redux
        dispatch(fetchCoinDetails(coinId));
      }

      // Get AI recommendation
      const recommendation = await openAiApi.getRecommendation(details);

      setRecommendations((prev) => ({
        ...prev,
        [coinId]: {
          coinId,
          shouldBuy: recommendation.shouldBuy,
          explanation: recommendation.explanation,
        },
      }));
    } catch (error: any) {
      console.error('Error getting recommendation:', error);
      const errorMessage = error?.message || 'שגיאה בקבלת המלצה. אנא נסה שוב מאוחר יותר.';
      setRecommendations((prev) => ({
        ...prev,
        [coinId]: {
          coinId,
          shouldBuy: false,
          explanation: errorMessage,
        },
      }));
    } finally {
      setLoadingRecommendations((prev => ({ ...prev, [coinId]: false })));
    }
  };

  if (selectedCoins.length === 0) {
    return (
      <div className="ai-recommendations-page">
        <div className="no-selection-message">
          <h2>אין מטבעות נבחרים</h2>
          <p>אנא בחר מטבעות בדף הבית כדי לקבל המלצות AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations-page">
      <div className="ai-recommendations-container">
        <h1 className="page-title">המלצות AI</h1>
        <p className="page-subtitle">
          בחר מטבע לקבלת המלצה לגבי כדאיות הרכישה שלו
        </p>
        <div className="recommendations-grid">
          {selectedCoins.map((coin) => {
            const recommendation = recommendations[coin.id];
            const isLoading = loadingRecommendations[coin.id];

            return (
              <div key={coin.id} className="recommendation-card">
                <div className="coin-header">
                  <img src={coin.image} alt={coin.name} className="coin-icon" />
                  <div className="coin-info">
                    <div className="coin-name">{coin.name}</div>
                    <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <button
                  className="recommendation-btn"
                  onClick={() => handleGetRecommendation(coin.id)}
                  disabled={isLoading}
                >
                  {isLoading ? 'טוען המלצה...' : 'קבל המלצה'}
                </button>
                {recommendation && (
                  <div
                    className={`recommendation-result ${
                      recommendation.shouldBuy ? 'positive' : 'negative'
                    }`}
                  >
                    <div className="recommendation-header">
                      <span className="recommendation-icon">
                        {recommendation.shouldBuy ? '✓' : '✗'}
                      </span>
                      <span className="recommendation-title">
                        {recommendation.shouldBuy
                          ? 'מומלץ לרכישה'
                          : 'לא מומלץ לרכישה'}
                      </span>
                    </div>
                    <div className="recommendation-explanation">
                      {recommendation.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;



