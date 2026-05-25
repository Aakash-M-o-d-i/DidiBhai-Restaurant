
export default function SearchMenu({ 
  searchQuery, 
  setSearchQuery, 
  filteredItems, 
  handleOpenCustomization 
}) {
  return (
    <div className="search-view animate-fade-in">
      <h3 className="section-title" style={{ marginBottom: '12px' }}>Search Culinary Items</h3>
      <div className="search-bar-box">
        <span className="material-symbols-outlined">search</span>
        <input 
          type="text"
          placeholder="Search momos, hot thalis, spices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-input"
        />
      </div>

      <div className="search-results-list">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div 
              key={item.id}
              onClick={() => handleOpenCustomization(item)}
              className="search-row-card animate-fade-in"
            >
              <div className="search-row-img-box">
                <img 
                  src={item.image} 
                  className="search-row-img" 
                  alt={item.title} 
                  onError={(e) => { e.target.src = '/images/plain_maggi.png'; }}
                />
              </div>
              <div className="search-row-body">
                <div>
                  <h4 className="search-row-title">{item.title}</h4>
                  <p className="search-row-desc">{item.description}</p>
                </div>
                <div className="search-row-footer">
                  <span className="search-row-price">₹{item.price}</span>
                  <span className="search-row-rating">★ {item.rating}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-placeholder animate-fade-in" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <span className="material-symbols-outlined placeholder-icon" style={{ fontSize: '48px', color: '#9ca3af' }}>search_off</span>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-on-surface)', marginTop: '12px' }}>No culinary items found</h4>
            <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Try searching for generic terms like tea, thali, momos, or maggi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
