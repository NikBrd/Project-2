import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Coin } from '../../types';
import { useAppSelector } from '../../store/hooks';
import './RealtimeChart.css';

interface RealtimeChartProps {
  coins: Coin[];
}

const RealtimeChart: React.FC<RealtimeChartProps> = ({ coins }) => {
  const prices = useAppSelector((state) => state.realtimePrices.prices);
  const latestPrices = useAppSelector((state) => state.realtimePrices.latestPrices);

  // Prepare data for chart
  const chartData: any[] = [];

  if (coins.length > 0 && prices) {
    // Get all timestamps from all coins
    const allTimestamps = new Set<number>();
    coins.forEach((coin) => {
      const symbol = coin.symbol.toUpperCase();
      if (prices[symbol]) {
        prices[symbol].forEach((price) => {
          allTimestamps.add(price.timestamp);
        });
      }
    });

    // Create chart data points
    Array.from(allTimestamps)
      .sort((a, b) => a - b)
      .forEach((timestamp) => {
        const dataPoint: any = {
          time: new Date(timestamp).toLocaleTimeString('he-IL'),
          timestamp,
        };

        coins.forEach((coin) => {
          const symbol = coin.symbol.toUpperCase();
          if (prices[symbol]) {
            const priceEntry = prices[symbol].find((p) => p.timestamp === timestamp);
            if (priceEntry) {
              dataPoint[coin.name] = priceEntry.price;
            }
          }
        });

        chartData.push(dataPoint);
      });
  }

  const colors = ['#4facfe', '#00f2fe', '#667eea', '#764ba2', '#f093fb'];

  // Debug: log prices and chart data
  React.useEffect(() => {
    console.log('Prices state:', prices);
    console.log('Latest prices:', latestPrices);
    console.log('Chart data length:', chartData.length);
    console.log('Coins:', coins.map(c => ({ name: c.name, symbol: c.symbol.toUpperCase() })));
  }, [prices, latestPrices, chartData, coins]);

  const hasData = chartData.length > 0;

  return (
    <div className="realtime-chart-container">
      <h2 className="chart-title">דו"ח זמן אמת - מחירים בדולרים</h2>
      <div className="chart-wrapper">
        {hasData ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#666' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: '#666' }}
                label={{ value: 'מחיר (USD)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <Legend />
              {coins.map((coin, index) => (
                <Line
                  key={coin.id}
                  type="monotone"
                  dataKey={coin.name}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <p>טוען נתונים... אנא המתן מספר שניות</p>
          </div>
        )}
      </div>
      <div className="current-prices">
        <h3>מחירים נוכחיים:</h3>
        <div className="prices-grid">
          {coins.map((coin) => {
            const symbol = coin.symbol.toUpperCase();
            const latestPrice = latestPrices[symbol];
            return (
              <div key={coin.id} className="price-card">
                <img src={coin.image} alt={coin.name} className="price-coin-icon" />
                <div className="price-coin-info">
                  <div className="price-coin-name">{coin.name}</div>
                  <div className="price-coin-symbol">{symbol}</div>
                </div>
                <div className="price-value">
                  ${latestPrice ? latestPrice.toLocaleString() : 'טוען...'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RealtimeChart;

