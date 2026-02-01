import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">אודות הפרויקט</h1>
        
        <div className="about-section">
          <h2>תיאור הפרויקט</h2>
          <p>
            Cryptonite הוא אתר מתקדם לניטור וניתוח מטבעות וירטואליים.
            האתר מאפשר למשתמשים לצפות במידע מעודכן על 100 מטבעות
            וירטואליים פופולריים, לעקוב אחר מחירים בזמן אמת, ולקבל המלצות
            חכמות מבוססות AI לגבי כדאיות רכישה של מטבעות שונים.
          </p>
          <p>
            הפרויקט נבנה באמצעות React ו-TypeScript, עם ניהול state
            מתקדם באמצעות Redux Toolkit, ומציע חוויית משתמש אינטואיטיבית
            ויפה עם עיצוב מודרני ואנימציות חלקות.
          </p>
        </div>

        <div className="about-section">
          <h2>תכונות עיקריות</h2>
          <ul className="features-list">
            <li>הצגת 100 מטבעות וירטואליים פופולריים עם מידע מעודכן</li>
            <li>חיפוש מטבעות בזמן אמת</li>
            <li>בחירה וניהול של עד 5 מטבעות מועדפים</li>
            <li>דו"חות זמן אמת עם גרפים דינמיים</li>
            <li>המלצות AI מבוססות ChatGPT</li>
            <li>תמיכה בשערי מטבעות שונים (USD, EUR, ILS)</li>
          </ul>
        </div>

        <div className="about-section developer-section">
          <h2>המתכנת</h2>
          <div className="developer-info">
            <div className="developer-image-container">
              <img 
                src="/My Personal Image For Project.jpg" 
                alt="Nik Boroday" 
                className="developer-image"
                onError={(e) => {
                  console.error('Failed to load image:', e);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const container = target.parentElement;
                  if (container) {
                    container.classList.add('developer-image-placeholder');
                    container.innerHTML = '<span>👤</span>';
                  }
                }}
              />
            </div>
            <div className="developer-details">
              <h3>פרטים אישיים</h3>
              <p>
                <strong>שם:</strong> Nik Boroday
              </p>
              <p>
                <strong>אימייל:</strong> Multisinglerity@gmail.com
              </p>
              <p>
                <strong>תאריך פיתוח:</strong> {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;



