import React from 'react';

export default function FoodCard({ item, onAddClick }) {
  return (
    <div 
      onClick={() => onAddClick(item)}
      className="food-card"
    >
      <div className="food-card-image-box">
        <img 
          alt={item.title} 
          className="food-card-img" 
          src={item.image}
          onError={(e) => { e.target.src = '/images/plain_maggi.png'; }}
        />
        <div className="rating-badge">
          <span className="material-symbols-outlined material-symbols-filled">star</span>
          <span className="rating-value">{item.rating}</span>
        </div>
        <span className={`veg-ribbon ${item.isVeg ? 'veg' : 'nonveg'}`}>
          {item.isVeg ? 'VEG' : 'NON-VEG'}
        </span>
      </div>

      <div className="food-card-body">
        <h4 className="food-card-title">{item.title}</h4>
        <p className="food-card-desc">{item.description}</p>
        
        <div className="food-card-footer">
          <span className="food-card-price">₹{item.price}</span>
          <button 
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick(item);
            }}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
