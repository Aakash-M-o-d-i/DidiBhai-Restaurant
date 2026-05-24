import React from 'react';
import CategoryChip from '../components/CategoryChip';
import FoodCard from '../components/FoodCard';

export default function HomeMenu({ 
  filteredItems, 
  selectedCategory, 
  setSelectedCategory, 
  handleOpenCustomization 
}) {
  return (
    <div className="animate-fade-in">
      
      {/* Brand Promo Banner */}
      <div className="hero-banner">
        <div>
          <span className="hero-tag">Special Offer</span>
          <h3 className="hero-title">Rainy Day Comforts!</h3>
          <p className="hero-desc">Steaming hot Momos and aromatic Himalayan soups prepared fresh.</p>
          <div className="hero-time">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
            <span>10-15 Mins Prep Time</span>
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <section className="categories-sec">
        <div className="section-title-row">
          <h3 className="section-title">Categories</h3>
          <button className="section-action">See All</button>
        </div>
        
        <div className="categories-container no-scrollbar">
          {[
            { name: 'All', icon: 'lunch_dining' },
            { name: 'Beverages', icon: 'local_bar' },
            { name: 'Maggi', icon: 'ramen_dining' },
            { name: 'Momos', icon: 'bakery_dining' },
            { name: 'Thalis', icon: 'restaurant' }
          ].map((cat) => (
            <CategoryChip 
              key={cat.name}
              catName={cat.name}
              icon={cat.icon}
              active={selectedCategory === cat.name}
              onClick={() => setSelectedCategory(cat.name)}
            />
          ))}
        </div>
      </section>

      {/* Most Popular Grid */}
      <section className="food-section">
        <div className="section-title-row" style={{ padding: 0, marginTop: '16px' }}>
          <h3 className="section-title">
            {selectedCategory === 'All' ? 'Most Popular' : `${selectedCategory} Specials`}
          </h3>
          <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'bold' }}>
            {filteredItems.length} items
          </span>
        </div>

        <div className="food-grid">
          {filteredItems.map((item) => (
            <FoodCard 
              key={item.id}
              item={item}
              onAddClick={handleOpenCustomization}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
