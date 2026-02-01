import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addPriceData, clearAllPriceData } from '../../store/slices/realtimePricesSlice';
import { cryptoCompareApi } from '../../services/cryptoCompareApi';
import RealtimeChart from '../../components/RealtimeChart/RealtimeChart';
import './RealtimeReports.css';

const RealtimeReports: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCoins = useAppSelector((state) => state.selectedCoins.selectedCoins);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Clear previous price data
    dispatch(clearAllPriceData());

    if (selectedCoins.length === 0) {
      return;
    }

    // Fetch prices immediately
    const fetchPrices = async () => {
      try {
        const symbols = selectedCoins.map((coin) => coin.symbol);
        const prices = await cryptoCompareApi.getRealtimePrices(symbols);
        const timestamp = Date.now();

        console.log('Fetched prices:', prices); // Debug log

        // Check if API returned an error
        if (prices.Response === 'Error') {
          const errorMsg = prices.Message || 'שגיאה בקבלת נתונים מ-API';
          console.error('CryptoCompare API Error:', errorMsg);
          setError(errorMsg);
          return;
        }

        setError(null); // Clear error if successful

        // Update Redux with price data for each coin
        let hasValidData = false;
        Object.entries(prices).forEach(([symbol, data]) => {
          if (data && typeof data === 'object' && 'USD' in data && data.USD) {
            hasValidData = true;
            dispatch(
              addPriceData({
                symbol: symbol.toUpperCase(), // Keep uppercase for consistency
                price: data.USD,
                timestamp,
              })
            );
            console.log(`Added price for ${symbol}: $${data.USD}`);
          }
        });

        if (!hasValidData) {
          console.warn('No valid price data received from API');
        }
      } catch (error: any) {
        console.error('Error fetching realtime prices:', error);
        let errorMessage = 'שגיאה בטעינת מחירים';
        if (error.response) {
          console.error('Response error:', error.response.data);
          errorMessage = `שגיאת שרת: ${error.response.status}`;
        } else if (error.request) {
          console.error('Request error:', error.request);
          errorMessage = 'לא התקבלה תשובה מהשרת. בדוק את החיבור לאינטרנט.';
        } else {
          errorMessage = error.message || 'שגיאה לא ידועה';
        }
        setError(errorMessage);
      }
    };

    fetchPrices();

    // Set up interval to fetch every second
    intervalRef.current = setInterval(fetchPrices, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedCoins, dispatch]);

  if (selectedCoins.length === 0) {
    return (
      <div className="realtime-reports-page">
        <div className="no-selection-message">
          <h2>אין מטבעות נבחרים</h2>
          <p>אנא בחר מטבעות בדף הבית כדי לצפות בדו"חות זמן אמת</p>
        </div>
      </div>
    );
  }

  return (
    <div className="realtime-reports-page">
      <div className="realtime-reports-container">
        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={() => setError(null)}>הסתר</button>
          </div>
        )}
        <RealtimeChart coins={selectedCoins} />
      </div>
    </div>
  );
};

export default RealtimeReports;



