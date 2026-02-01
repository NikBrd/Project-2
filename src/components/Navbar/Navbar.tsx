import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { filterCoins } from '../../store/slices/coinsSlice';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(filterCoins(value));
  };

  // Only show search on home page
  const showSearch = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Cryptonite
        </Link>
        <div className="navbar-menu">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            דף בית
          </Link>
          <Link
            to="/realtime-reports"
            className={`navbar-link ${
              location.pathname === '/realtime-reports' ? 'active' : ''
            }`}
          >
            דו"חות זמן אמת
          </Link>
          <Link
            to="/ai-recommendations"
            className={`navbar-link ${
              location.pathname === '/ai-recommendations' ? 'active' : ''
            }`}
          >
            המלצת AI
          </Link>
          <Link
            to="/about"
            className={`navbar-link ${
              location.pathname === '/about' ? 'active' : ''
            }`}
          >
            אודות
          </Link>
        </div>
        {showSearch && (
          <div className="navbar-search">
            <input
              type="text"
              placeholder="חפש מטבע..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;






