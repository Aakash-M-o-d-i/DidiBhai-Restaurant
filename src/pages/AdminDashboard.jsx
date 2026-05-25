
export default function AdminDashboard({ 
  liveVisitors, 
  totalSales, 
  totalOrders, 
  menuItems, 
  handleToggleStock, 
  onRefreshStats 
}) {
  return (
    <div className="admin-view animate-fade-in">
      
      <div className="admin-header-row">
        <h3 className="admin-title">
          <span className="material-symbols-outlined">dashboard</span> Admin Portal
        </h3>
        <button 
          onClick={onRefreshStats}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
        </button>
      </div>

      {/* Action card for switching to immersive console */}
      <div 
        onClick={() => {
          window.history.pushState({}, '', '/g/a/n/e/s/h/ganeshdidibhai');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(160, 65, 0, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Immersive Admin Console</h4>
          <p style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>Open full-screen delivery logs & charts</p>
        </div>
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>open_in_new</span>
      </div>

      {/* Stats Widgets */}
      <div className="admin-stats-row">
        <div className="stat-widget">
          <span className="stat-title">Diners</span>
          <span className="stat-value">
            {liveVisitors}
            <span className="live-dot"></span>
          </span>
        </div>
        <div className="stat-widget">
          <span className="stat-title">Sales</span>
          <span className="stat-value" style={{ color: 'var(--color-primary)' }}>₹{totalSales}</span>
        </div>
        <div className="stat-widget">
          <span className="stat-title">Orders</span>
          <span className="stat-value">{totalOrders}</span>
        </div>
      </div>

      {/* Live Inventory List */}
      <div className="inventory-panel">
        <h4 className="inventory-title">Live Menu Inventory</h4>
        
        <div className="inventory-list no-scrollbar">
          {menuItems.map((item) => (
            <div key={item.id} className="inventory-item">
              <div className="inventory-item-left">
                <div className="inventory-img-box">
                  <img src={item.image} className="inventory-img" alt={item.title} />
                </div>
                <div>
                  <h5 className="inventory-item-name">{item.title}</h5>
                  <span className="inventory-item-price">₹{item.price}</span>
                </div>
              </div>

              <div className="toggle-switch-wrapper">
                <button 
                  onClick={() => handleToggleStock(item.id)}
                  className={`toggle-switch ${item.available ? 'active' : ''}`}
                >
                  <div className="toggle-knob"></div>
                </button>
                <span className="toggle-status-label">{item.available ? 'In Stock' : 'Out'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
