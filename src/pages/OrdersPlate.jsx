
export default function OrdersPlate({ cart, updateQty, getSubtotal, onCheckout, onNavigateHome }) {
  // Helper to get nice subtitles matching authentic style
  const getItemSubtitle = (item) => {
    if (item.itemId === 'veg-thali') return 'Classic North Indian Platter';
    if (item.itemId === 'chicken-thali') return 'Savory Chicken Thali Platter';
    if (item.itemId === 'chicken-momos') return 'Juicy Steamed Chicken Dumplings';
    if (item.itemId === 'veg-momos') return 'Steamed Cabbage & Carrot Dumplings';
    if (item.itemId === 'egg-maggi') return 'Himalayan Noodles with Eggs';
    if (item.itemId === 'plain-maggi') return 'Masala Noodles with Fresh Herbs';
    if (item.itemId === 'chicken-chilli') return 'Crispy Chicken in Soy-Chilli Glaze';
    if (item.itemId === 'black-tea') return 'Traditional Cardamom Cardamom Tea';
    if (item.itemId === 'hot-coffee') return 'Frothy Hot Ceramic Mug Brew';
    return 'Authentic Didi-Bhai Special';
  };

  return (
    <div className="plate-view animate-fade-in">
      <h2 className="page-header-title">My Food Plate</h2>

      {cart.length === 0 ? (
        <div className="empty-placeholder">
          <span className="material-symbols-outlined placeholder-icon">shopping_bag</span>
          <h4>Your plate is currently empty</h4>
          <p>Browse our delicious authentic menu and select customized items to add them here.</p>
          <button onClick={onNavigateHome}>Discover Menu</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* List of Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.cartId} className="cart-card">
                <div className="cart-card-img-box">
                  <img src={item.image} className="cart-card-img" alt={item.title} />
                </div>
                <div className="cart-card-body">
                  <div>
                    <h3 className="cart-card-title">{item.title}</h3>
                    <p className="cart-card-subtitle">{getItemSubtitle(item)}</p>
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="cart-item-addons" style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                        {item.addOns.map((addon, index) => (
                          <span key={index} style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '600' }}>
                            + {addon}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="cart-card-footer">
                    <span className="cart-card-price">₹{item.finalPrice * item.quantity}</span>
                    <div className="cart-qty-pill">
                      <button 
                        type="button"
                        onClick={() => updateQty(item.cartId, -1)} 
                        className="cart-qty-btn-minus"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>remove</span>
                      </button>
                      <span className="cart-qty-val-label">{item.quantity}</span>
                      <button 
                        type="button"
                        onClick={() => updateQty(item.cartId, 1)} 
                        className="cart-qty-btn-plus"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary Section matching mockup exactly */}
          <div className="cart-summary-card">
            <div className="summary-row" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-outline-variant)' }}>
              <span className="summary-row-label">Subtotal</span>
              <span className="summary-row-val">₹{getSubtotal()}</span>
            </div>
            <div className="summary-row-total">
              <span className="summary-total-label">Total Plate Cost</span>
              <span className="summary-total-val">₹{getSubtotal()}</span>
            </div>
          </div>

          {/* Checkout Button matching saffron shadow pill */}
          <div>
            <button 
              onClick={onCheckout}
              className="cart-checkout-btn-full"
            >
              <span className="material-symbols-outlined material-symbols-filled" style={{ fontSize: '24px' }}>check_circle</span>
              <span>Send Order To Kitchen</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
