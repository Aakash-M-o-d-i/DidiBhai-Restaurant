import React from 'react';

export default function BottomNavBar({ activeTab, setActiveTab, cartCount }) {
  return (
    <nav className="bottom-nav">
      <button 
        onClick={() => setActiveTab('home')}
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
      >
        <span className="material-symbols-outlined">home</span>
        {activeTab === 'home' && <span className="nav-label">Home</span>}
      </button>

      <button 
        onClick={() => setActiveTab('search')}
        className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
      >
        <span className="material-symbols-outlined">search</span>
        {activeTab === 'search' && <span className="nav-label">Search</span>}
      </button>

      <button 
        onClick={() => setActiveTab('orders')}
        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
        style={{ position: 'relative' }}
      >
        <span className="material-symbols-outlined">shopping_bag</span>
        {activeTab === 'orders' && <span className="nav-label">Orders</span>}
        {cartCount > 0 && (
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: 'var(--color-primary-container)', color: '#fff', fontSize: '8px', fontWeight: 'bold', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fff' }}>
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
}
