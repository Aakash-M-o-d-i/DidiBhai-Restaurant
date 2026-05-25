import { useState } from 'react';

export default function CustomizationSheet({ customizingItem, onClose, onSubmit }) {
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [notes, setNotes] = useState('');

  const handleIncrement = () => setQty(prev => prev + 1);
  const handleDecrement = () => setQty(prev => prev > 1 ? prev - 1 : 1);

  // Dynamic add-ons list loaded from item
  const addonsList = customizingItem.addOns || [];

  const toggleAddon = (addon) => {
    if (selectedAddOns.includes(addon.name)) {
      setSelectedAddOns(prev => prev.filter(name => name !== addon.name));
    } else {
      setSelectedAddOns(prev => [...prev, addon.name]);
    }
  };

  // Calculate customized unit price
  let itemUnitPrice = customizingItem.price;
  addonsList.forEach(addon => {
    if (selectedAddOns.includes(addon.name)) {
      itemUnitPrice += addon.price;
    }
  });

  const totalCalculatedCost = itemUnitPrice * qty;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const addOnsPayload = addonsList
      .filter(addon => selectedAddOns.includes(addon.name))
      .map(addon => `${addon.name} (+₹${addon.price})`);
    
    onSubmit(addOnsPayload, itemUnitPrice, qty, notes);
  };

  return (
    <div className="details-page-overlay">
      
      {/* 1. Hero Image & Overlays */}
      <header className="details-hero">
        <img 
          alt={customizingItem.title} 
          className="details-hero-img" 
          src={customizingItem.image}
          onError={(e) => { e.target.src = '/images/plain_maggi.png'; }}
        />
        <div className="details-gradient-overlay"></div>
        
        {/* Floating Action Circles */}
        <div className="details-top-actions">
          <button 
            type="button"
            onClick={onClose}
            className="details-circle-btn"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button 
            type="button"
            onClick={() => setIsFavorite(prev => !prev)}
            className="details-circle-btn"
            style={{ color: isFavorite ? '#ba1a1a' : '#261812' }}
          >
            <span 
              className={`material-symbols-outlined ${isFavorite ? 'material-symbols-filled text-red-600' : ''}`}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Floating Dish Info Card */}
        <div className="details-floating-card">
          <div className="details-veg-tag">
            <span className={`veg-box-outline ${customizingItem.isVeg ? 'veg' : 'nonveg'}`}>
              <span className={`veg-dot-inner ${customizingItem.isVeg ? 'veg' : 'nonveg'}`}></span>
            </span>
            <span className="details-tag-label">
              {customizingItem.isVeg ? 'Classic Veg Selection' : 'Premium Selection'}
            </span>
          </div>

          <div className="details-title-row">
            <div>
              <h1 className="details-dish-title">{customizingItem.title}</h1>
              <div className="details-stars">
                <span className="material-symbols-outlined material-symbols-filled">star</span>
                <span>{customizingItem.rating} (1.2k+ Ratings)</span>
              </div>
            </div>
            <div className="details-price-box">
              <span className="details-price-num">₹{customizingItem.price}</span>
              <span className="details-price-tax-label block">Best Price</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Scrollable Detail content */}
      <section className="details-scroll-content">
        
        {/* Description Section */}
        <div>
          <h2 className="details-section-heading">Description</h2>
          <p className="details-paragraph">
            {customizingItem.description || `The ultimate comfort food elevated for the connoisseur. Our signature Didi-Bhai ${customizingItem.title} is prepared with premium culinary standards, organic spices, and fresh ingredients for that perfect dining texture.`}
          </p>
        </div>

        {/* Ingredients & Add-ons Customization */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 className="details-section-heading" style={{ margin: 0 }}>Ingredients &amp; Add-ons</h2>
            <span style={{ fontSize: '10px', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-primary)', fontWeight: '800', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '9999px' }}>
              Customizable
            </span>
          </div>

          {/* Dynamic Ingredient Chips loaded from DB */}
          {customizingItem.ingredients && Array.isArray(customizingItem.ingredients) && customizingItem.ingredients.length > 0 ? (
            <div className="details-chip-grid">
              {customizingItem.ingredients.map((ing, idx) => {
                let icon = 'restaurant';
                const ingLower = ing.toLowerCase();
                if (ingLower.includes('egg')) icon = 'egg';
                else if (ingLower.includes('veg') || ingLower.includes('herb') || ingLower.includes('mint') || ingLower.includes('coriander') || ingLower.includes('cabbage') || ingLower.includes('onion') || ingLower.includes('potato') || ingLower.includes('chilli') || ingLower.includes('greens') || ingLower.includes('shoot')) icon = 'eco';
                else if (ingLower.includes('rice') || ingLower.includes('flour') || ingLower.includes('dough') || ingLower.includes('noodle') || ingLower.includes('wrapper') || ingLower.includes('bread') || ingLower.includes('puri') || ingLower.includes('roti') || ingLower.includes('ramen')) icon = 'rice_bowl';
                else if (ingLower.includes('tea') || ingLower.includes('coffee') || ingLower.includes('milk') || ingLower.includes('brew') || ingLower.includes('curry') || ingLower.includes('gravy') || ingLower.includes('broth') || ingLower.includes('soup')) icon = 'local_bar';

                return (
                  <div key={idx} className="details-ingredient-chip">
                    <div className="details-chip-icon">
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                      <p className="details-chip-label">{ing}</p>
                      <p className="details-chip-status">Included</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontStyle: 'italic', marginBottom: '16px' }}>
              Standard authentic recipe ingredients included.
            </p>
          )}

          {/* Dynamic Checklist boxes loaded from DB */}
          {addonsList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {addonsList.map((addon, index) => {
                const isChecked = selectedAddOns.includes(addon.name);
                return (
                  <div 
                    key={index}
                    onClick={() => toggleAddon(addon)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', cursor: 'pointer', backgroundColor: isChecked ? 'var(--color-surface-container-low)' : 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => {}} // handled by click
                        className="addon-checkbox" 
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>{addon.name}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-secondary)' }}>+ ₹{addon.price}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontStyle: 'italic', marginTop: '8px' }}>
              No custom add-ons available for this item.
            </p>
          )}
        </div>

        {/* Special Instructions / Chef Notes */}
        <div style={{ marginTop: '24px' }}>
          <h2 className="details-section-heading">Special Instructions</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. Less sugar, extra spicy, no onions..."
            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', fontSize: '13px', backgroundColor: 'var(--color-surface-container-lowest)', outline: 'none', resize: 'none', fontFamily: 'inherit', color: 'inherit' }}
            rows="2"
          />
        </div>

        {/* Nutritional Widget */}
        <div className="details-nutrients-card" style={{ marginTop: '24px' }}>
          <div className="nutrient-col">
            <p className="nutrient-val">{customizingItem.isVeg ? '340' : '420'}</p>
            <p className="nutrient-label">Kcal</p>
          </div>
          <div className="nutrient-divider-line"></div>
          <div className="nutrient-col">
            <p className="nutrient-val">{customizingItem.isVeg ? '10g' : '18g'}</p>
            <p className="nutrient-label">Protein</p>
          </div>
          <div className="nutrient-divider-line"></div>
          <div className="nutrient-col">
            <p className="nutrient-val">{customizingItem.isVeg ? '6g' : '12g'}</p>
            <p className="nutrient-label">Fats</p>
          </div>
        </div>

      </section>

      {/* 3. Sticky Bottom action drawer from mockup */}
      <footer className="details-bottom-bar">
        {/* Quantity control */}
        <div className="details-qty-box">
          <button 
            type="button" 
            onClick={handleDecrement}
            className="details-qty-btn-circle"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
          </button>
          <span className="details-qty-number">{qty}</span>
          <button 
            type="button" 
            onClick={handleIncrement}
            className="details-qty-btn-circle active"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          </button>
        </div>

        {/* Big Add button */}
        <button 
          onClick={handleFormSubmit}
          className="details-add-cart-btn"
        >
          <span>Add to Cart</span>
          <span className="details-btn-divider"></span>
          <span>₹{totalCalculatedCost}</span>
        </button>
      </footer>

    </div>
  );
}
