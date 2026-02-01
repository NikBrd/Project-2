
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ParallaxBackground from './components/ParallaxBackground/ParallaxBackground';
import Home from './pages/Home/Home';
import RealtimeReports from './pages/RealtimeReports/RealtimeReports';
import AIRecommendations from './pages/AIRecommendations/AIRecommendations';
import About from './pages/About/About';
import './App.css';

function App() {
  return (
    <div className="App">
      <ParallaxBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/realtime-reports" element={<RealtimeReports />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;




