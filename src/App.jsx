import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import DeviceFrame from './components/DeviceFrame';
import SplashScreen from './components/SplashScreen';
import BottomNavBar from './components/BottomNavBar';
import CustomizationSheet from './components/CustomizationSheet';

// Pages
import HomeMenu from './pages/HomeMenu';
import SearchMenu from './pages/SearchMenu';
import OrdersPlate from './pages/OrdersPlate';
import AdminDashboard from './pages/AdminDashboard';
import AdminConsole from './pages/AdminConsole';
import AdminLogin from './pages/AdminLogin';

// Live Menu Data aligned directly with provided assets and Didi-Bhai Restaurant Menu Card
const INITIAL_MENU = [
  // Beverages
  {
    id: 'black-tea',
    title: 'Black/Milk Tea',
    description: 'Cardamom and ginger brewed traditional tea cup.',
    price: 20,
    category: 'Beverages',
    image: '/images/black_milk_tea.png',
    rating: 4.9,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Ginger', price: 10 },
      { name: 'Extra Sugar', price: 5 },
      { name: 'Extra Milk Portion', price: 10 }
    ],
    ingredients: ["Premium Tea Leaves", "Cardamom & Ginger", "Fresh Milk", "Sugar"]
  },
  {
    id: 'hot-coffee',
    title: 'Coffee',
    description: 'Frothy hot coffee served in a traditional cup.',
    price: 40,
    category: 'Beverages',
    image: '/images/hot_coffee.png',
    rating: 4.5,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Whipped Cream', price: 15 },
      { name: 'Extra Espresso Shot', price: 20 }
    ],
    ingredients: ["Rich Coffee Beans", "Whipped Cream", "Steamed Milk", "Sugar"]
  },
  // Momos
  {
    id: 'veg-momos',
    title: 'Veg Momo (8 pcs)',
    description: '8 Pcs of steamed cabbage & carrot dumplings with spicy red chutney.',
    price: 80,
    category: 'Momos',
    image: '/images/veg_momos.png',
    rating: 4.6,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Spicy Schezwan Chutney', price: 15 },
      { name: 'Cheese Dip Cup', price: 20 }
    ],
    ingredients: ["Steamed Cabbage & Carrot", "Thin Wrapper", "Local Garlic & Ginger"]
  },
  {
    id: 'chicken-momos',
    title: 'Chicken Momo (8 pcs)',
    description: '8 Pcs of juicy minced chicken dumplings served with spicy red chutney.',
    price: 120,
    category: 'Momos',
    image: '/images/chicken_momos.png',
    rating: 4.8,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: [
      { name: 'Spicy Schezwan Chutney', price: 15 },
      { name: 'Cheese Dip Cup', price: 20 }
    ],
    ingredients: ["Juicy Minced Chicken", "Thin Wrapper", "Fresh Coriander & Spices"]
  },
  // Maggi Specials
  {
    id: 'plain-maggi',
    title: 'Plain Maggi',
    description: 'Classic bowl of plain masala noodles cooked in our secret spice blend.',
    price: 50,
    category: 'Maggi',
    image: '/images/plain_maggi.png',
    rating: 4.4,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Cheese Slice', price: 20 },
      { name: 'Fried Egg', price: 15 }
    ],
    ingredients: ["Springy Noodles", "Didi-Bhai Special Maggi Masala", "Skillet Butter"]
  },
  {
    id: 'egg-maggi',
    title: 'Egg Maggi',
    description: 'Springy masala noodles tossed with soft-boiled scrambled eggs and seasoning.',
    price: 80,
    category: 'Maggi',
    image: '/images/egg_maggi.png',
    rating: 4.7,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Cheese Slice', price: 20 },
      { name: 'Extra Egg', price: 15 }
    ],
    ingredients: ["Double Egg", "Springy Noodles", "Signature Masala", "Coriander"]
  },
  {
    id: 'aloo-thukpa',
    title: 'Aloo thukpa',
    description: 'Warm and comforting Himalayan noodle soup served with potatoes and fresh herbs.',
    price: 120,
    category: 'Maggi',
    image: '/images/aloo_thukpa.png',
    rating: 4.6,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Aloo Cubes', price: 20 },
      { name: 'Spicy Schezwan Sauce', price: 15 }
    ],
    ingredients: ["Himalayan Noodles", "Spiced Aloo Cubes", "Warm Vegetable Broth", "Ginger-Garlic"]
  },
  // Thalis
  {
    id: 'veg-thali',
    title: 'Veg Thali',
    description: 'Complete traditional platter with Paneer Gravy, Yellow Dal Tadka, Sabzi, Roti, Rice & Sweet.',
    price: 130,
    category: 'Thalis',
    image: '/images/veg_thali.png',
    rating: 4.5,
    isVeg: true,
    isPopular: true,
    available: true,
    addOns: [
      { name: 'Extra Rice Portion', price: 30 },
      { name: 'Extra Paneer Gravy', price: 40 },
      { name: 'Sweet Gulab Jamun', price: 25 }
    ],
    ingredients: ["Paneer Masala", "Dal Tadka", "Jeera Rice", "4 Tawa Rotis", "Sweet Gulab Jamun"]
  },
  {
    id: 'chicken-thali',
    title: 'Chicken Thali',
    description: 'A hearty traditional platter of basmati rice, warm butter chicken curry, chicken dry stir-fry, and roti.',
    price: 230,
    category: 'Thalis',
    image: '/images/chicken_thali.png',
    rating: 4.7,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: [
      { name: 'Extra Rice Portion', price: 30 },
      { name: 'Extra Butter Chicken', price: 60 },
      { name: 'Sweet Gulab Jamun', price: 25 }
    ],
    ingredients: ["Butter Chicken Curry", "Chicken Dry Stir-Fry", "Basmati Rice", "Tawa Roti", "Sweet Gulab Jamun"]
  },
  {
    id: 'pork-thali',
    title: 'Pork thali',
    description: 'Traditional Naga-style smoked pork slow-cooked with bamboo shoots, served with rice, dal, and local greens.',
    price: 350,
    category: 'Thalis',
    image: '/images/pork_thali.png',
    rating: 4.8,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Rice Portion', price: 30 },
      { name: 'Extra Smoked Pork', price: 80 }
    ],
    ingredients: ["Smoked Pork", "Bamboo Shoots", "Basmati Rice", "Local Boiled Greens", "Dal"]
  },
  // Pastries & Snacks
  {
    id: 'roti-sabzi',
    title: 'Roti Sabzi (4 pcs)',
    description: '4 soft whole wheat tawa rotis served with seasonal mixed vegetables curry.',
    price: 80,
    category: 'Maggi',
    image: '/images/roti_sabzi.png',
    rating: 4.3,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Rotis (2 pcs)', price: 20 },
      { name: 'Extra Sabzi Bowl', price: 30 }
    ],
    ingredients: ["4 Whole Wheat Rotis", "Seasonal Mixed Veg", "Traditional Masala"]
  },
  {
    id: 'puri-sabzi',
    title: 'Puri Sabzi (4 pcs)',
    description: '4 fluffy deep fried golden puris served with spicy dry aloo bhaji masala.',
    price: 80,
    category: 'Maggi',
    image: '/images/puri_sabzi.png',
    rating: 4.5,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Puris (2 pcs)', price: 25 },
      { name: 'Extra Aloo Bhaji', price: 30 }
    ],
    ingredients: ["4 Deep Fried Puris", "Spicy Dry Aloo Bhaji", "Aromatic Spices"]
  },
  // Omelettes
  {
    id: 'bread-omelette',
    title: 'Bread Omelette',
    description: 'Soft white bread slices toasted on skillet with a double masala egg omelette.',
    price: 70,
    category: 'Beverages',
    image: '/images/bread_omelette.png',
    rating: 4.4,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Cheese Slice', price: 20 },
      { name: 'Double Butter Toast', price: 15 }
    ],
    ingredients: ["2 Farm Eggs", "2 Slices Toast Bread", "Chopped Onion & Chillies"]
  },
  {
    id: 'single-omelette',
    title: 'Single Omelette',
    description: 'Fluffy single egg omelette cooked on skillet with fresh onion and coriander.',
    price: 30,
    category: 'Beverages',
    image: '/images/double_omelette.png',
    rating: 4.1,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Cheese Slice', price: 20 },
      { name: 'Extra Toast Slices (2)', price: 15 }
    ],
    ingredients: ["1 Farm Egg", "Fresh Coriander & Onion", "Skillet Butter"]
  },
  {
    id: 'double-omelette',
    title: 'Double Omelette',
    description: 'Skillet double egg omelette cooked with chopped onions, tomatoes, and spicy green chilies.',
    price: 50,
    category: 'Beverages',
    image: '/images/double_omelette.png',
    rating: 4.2,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: [
      { name: 'Cheese Slice', price: 20 },
      { name: 'Toast Slices (2)', price: 15 }
    ],
    ingredients: ["2 Farm Eggs", "Fresh Green Chillies", "Onions & Tomatoes"]
  },
  // Chowmein
  {
    id: 'veg-chowmein',
    title: 'Veg Chowmein',
    description: 'Wok stir-fried noodles tossed with crisp local market greens, shredded carrots, cabbage, and soy sauce.',
    price: 100,
    category: 'Momos',
    image: '/images/veg_chowmein.png',
    rating: 4.4,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Veggies', price: 20 },
      { name: 'Spicy Schezwan Sauce', price: 15 }
    ],
    ingredients: ["Wok Tossed Noodles", "Shredded Cabbage", "Julienne Carrots", "Bell Peppers", "Soy Sauce"]
  },
  {
    id: 'chicken-chowmein',
    title: 'Chicken Chowmein',
    description: 'Wok stir-fried noodles tossed with tender chicken slivers, garlic, local vegetables, and savory sauces.',
    price: 120,
    category: 'Momos',
    image: '/images/chicken_chowmein.png',
    rating: 4.7,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: [
      { name: 'Extra Chicken', price: 40 },
      { name: 'Spicy Schezwan Sauce', price: 15 }
    ],
    ingredients: ["Tossed Noodles", "Tender Chicken", "Shredded Cabbage", "Garlic & Ginger Soy"]
  },
  {
    id: 'aloo-waiwai',
    title: 'Aloo waiwai',
    description: 'Dry Wai Wai instant noodles tossed with spicy boiled potato cubes, onion, mustard oil, and lime.',
    price: 80,
    category: 'Momos',
    image: '/images/aloo_waiwai.png',
    rating: 4.5,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Potato Cubes', price: 15 },
      { name: 'Extra Lime & Onion', price: 10 }
    ],
    ingredients: ["Crispy Wai Wai Noodles", "Spiced Potato Cubes", "Fresh Lime Juice", "Chopped Onion", "Mustard Oil"]
  },
  // Specials
  {
    id: 'ramen-pouch-egg',
    title: 'Ramen with Pouch Egg',
    description: 'Korean style spicy instant ramen soup topped with a perfectly poached egg and fresh green onions.',
    price: 250,
    category: 'Thalis',
    image: '/images/ramen_pouch_egg.png',
    rating: 4.8,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: [
      { name: 'Extra Poached Egg', price: 20 },
      { name: 'Cheese Slice', price: 20 }
    ],
    ingredients: ["Spicy Ramen Broth", "Perfect Poached Egg", "Green Onion Garnish", "Nori strips"]
  },
  {
    id: 'chicken-chilli',
    title: 'Chicken chilli (8 pieces)',
    description: '8 pieces of crispy batter-fried chicken cubes tossed with bell peppers and onion in a spicy soy-chilli glaze.',
    price: 250,
    category: 'Thalis',
    image: '/images/chicken_chilli.png',
    rating: 4.7,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Chilli Soy Glaze', price: 15 },
      { name: 'Extra Peppers & Onion', price: 15 }
    ],
    ingredients: ["8 batter-fried Chicken", "Green Bell Peppers", "Sliced Onion", "Chilli Soy Glaze"]
  },
  {
    id: 'chicken-karchi-marchi',
    title: 'Chicken Karchi marchi',
    description: 'Crispy skillet local dry stir-fry chicken nuggets flavored with fresh local bird\'s eye green chillies and curry leaves.',
    price: 150,
    category: 'Thalis',
    image: '/images/chicken_karchi_marchi.png',
    rating: 4.6,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: [
      { name: 'Extra Green Chillies', price: 10 },
      { name: 'Extra Chicken Nuggets', price: 40 }
    ],
    ingredients: ["Skillet Fried Chicken Nuggets", "Bird's Eye Green Chillies", "Curry Leaves", "Ginger-Garlic"]
  }
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'search', 'orders', 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState(INITIAL_MENU);
  const [menuLoaded, setMenuLoaded] = useState(false);
  
  // Customization State
  const [customizingItem, setCustomizingItem] = useState(null);
  const [addOns, setAddOns] = useState({
    cheese: false,
    schezwan: false,
    description: ''
  });

  // Cart State
  const [cart, setCart] = useState([]);

  // Admin stats
  const [liveVisitors, setLiveVisitors] = useState(14);
  const [totalSales, setTotalSales] = useState(14850);
  const [totalOrders, setTotalOrders] = useState(62);

  // Client-side lightweight routing
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Admin authentication state
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminAuthChecked, setAdminAuthChecked] = useState(false);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminSession = async () => {
      const token = sessionStorage.getItem('adminToken');
      if (token) {
        try {
          const res = await fetch('/g/a/n/e/s/h/ganeshdidibhai/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          const data = await res.json();
          if (data.valid) {
            setAdminAuthenticated(true);
          } else {
            sessionStorage.removeItem('adminToken');
            sessionStorage.removeItem('adminLoginTime');
          }
        } catch (err) {
          // Server down, clear session
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('adminLoginTime');
        }
      }
      setAdminAuthChecked(true);
    };
    checkAdminSession();
  }, []);

  const handleAdminLogin = (token) => {
    setAdminAuthenticated(true);
  };

  const handleAdminLogout = async () => {
    const token = sessionStorage.getItem('adminToken');
    try {
      await fetch('/g/a/n/e/s/h/ganeshdidibhai/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    } catch (err) { /* ignore */ }
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminLoginTime');
    setAdminAuthenticated(false);
  };

  // Fetch menu from REST API
  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
        setMenuLoaded(true);
      }
    } catch (err) {
      console.warn('API unreachable, using local menu data:', err.message);
    }
  };

  // Load menu from API on first mount
  useEffect(() => {
    fetchMenu();
  }, []);

  // Auto-poll every 5 seconds on customer page to sync admin changes
  useEffect(() => {
    const isAdmin = currentPath === '/g/a/n/e/s/h/ganeshdidibhai' || currentPath === '/g/a/n/e/s/h/ganeshdidibhai/';
    if (isAdmin) return; // Don't poll on admin page

    const interval = setInterval(() => {
      fetchMenu();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPath]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath === '/g/a/n/e/s/h/ganeshdidibhai' || currentPath === '/g/a/n/e/s/h/ganeshdidibhai/') {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [currentPath]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    // Refresh menu from API when returning to customer view
    if (path === '/') {
      fetchMenu();
    }
  };

  useEffect(() => {
    // Custom premium splash timer
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);


  const handleOpenCustomization = (item) => {
    setCustomizingItem(item);
  };

  const handleConfirmCustomization = (selectedAddOns, finalPrice, qty, notes) => {
    const cartItem = {
      cartId: `${customizingItem.id}-${Date.now()}`,
      itemId: customizingItem.id,
      title: customizingItem.title,
      image: customizingItem.image,
      basePrice: customizingItem.price,
      finalPrice: finalPrice,
      addOns: selectedAddOns,
      quantity: qty || 1,
      notes: notes || ''
    };

    setCart(prev => [...prev, cartItem]);
    setCustomizingItem(null);
    setTotalSales(prev => prev + (finalPrice * (qty || 1)));
    setTotalOrders(prev => prev + 1);
  };

  const updateQty = (cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const getSubtotal = () => cart.reduce((s, i) => s + (i.finalPrice * i.quantity), 0);

  // Filter items for Home Menu (respects category selection)
  const filteredHomeItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesCategory && item.available;
  });

  // Filter items for Search Menu (searches across all categories)
  const filteredSearchItems = menuItems.filter(item => {
    const query = searchQuery.toLowerCase();
    
    const matchesTitle = item.title?.toLowerCase().includes(query);
    const matchesDesc = item.description?.toLowerCase().includes(query);
    const matchesCategory = item.category?.toLowerCase().includes(query);
    
    const matchesIngredients = Array.isArray(item.ingredients) && item.ingredients.some(ing => 
      typeof ing === 'string' && ing.toLowerCase().includes(query)
    );
    
    const matchesAddOns = Array.isArray(item.addOns) && item.addOns.some(add => 
      add && typeof add.name === 'string' && add.name.toLowerCase().includes(query)
    );

    return (matchesTitle || matchesDesc || matchesCategory || matchesIngredients || matchesAddOns) && item.available;
  });

  const handleToggleStock = (id) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, available: !m.available } : m));
  };

  if (currentPath === '/g/a/n/e/s/h/ganeshdidibhai' || currentPath === '/g/a/n/e/s/h/ganeshdidibhai/') {
    // Show login page if not authenticated
    if (!adminAuthenticated) {
      return <AdminLogin onLoginSuccess={handleAdminLogin} />;
    }

    return (
      <AdminConsole 
        menuItems={menuItems}
        setMenuItems={setMenuItems}
        liveVisitors={liveVisitors}
        setLiveVisitors={setLiveVisitors}
        totalSales={totalSales}
        setTotalSales={setTotalSales}
        totalOrders={totalOrders}
        setTotalOrders={setTotalOrders}
        onNavigateHome={() => navigateTo('/')}
        fetchMenu={fetchMenu}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <DeviceFrame>
      
      {/* SPLASH INTRO VIEW */}
      {showSplash && <SplashScreen />}

      {/* CORE VIEW ORCHESTRATION */}
      {!showSplash && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          
          {/* HEADER BAR */}
          <header className="top-app-bar">
            <div className="top-bar-left">
              <button className="top-bar-menu-btn" style={{ cursor: 'default' }}>
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/images/logo.jpg" alt="Didi-Bhai Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-primary-container)' }} />
                <h1 className="brand-title">Didi-Bhai</h1>
              </div>
            </div>
            <div className="avatar-container" style={{ cursor: 'default' }}>
              <img 
                alt="Profile Avatar" 
                className="avatar-img" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb50mlh1j9RjJ2s8y44qAnRCmKRl1w-9al3VSQ5ItNmJeIEdfEOWpugRUlZWJHy7kVS-e3zsLWATfWq1YmraNicAOpA5q287aBkFjraofwDQvWDajBCF5Ubvfip7Qw9KBvxty55oXWDKCkJZJKHKLv33Wbi2NotsqEIytrzf09zZyCWkPPGRyfFg49bEvFDS_jMMgjgYCvVAJUSskTsYJecpRCQKWczb9RpRLnC59TGTaZEK5NrGfqRzVQmnM49RBzIti2zgeHfdA"
              />
            </div>
          </header>

          {/* PAGE ROUTING BODY */}
          <div className="app-content hide-scrollbar">
            
            {activeTab === 'home' && (
              <HomeMenu 
                filteredItems={filteredHomeItems}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                handleOpenCustomization={handleOpenCustomization}
              />
            )}

            {activeTab === 'search' && (
              <SearchMenu 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredItems={filteredSearchItems}
                handleOpenCustomization={handleOpenCustomization}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersPlate 
                cart={cart}
                updateQty={updateQty}
                getSubtotal={getSubtotal}
                onCheckout={() => {
                  alert("Delicious choices placed! Sent directly to the kitchen.");
                  setCart([]);
                }}
                onNavigateHome={() => setActiveTab('home')}
              />
            )}

          </div>

          {/* TAB SYSTEM BOTTOM BAR */}
          <BottomNavBar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />

          {/* DRAWER TOPPINGS CUSTOMIZATION MODAL (NOW BREATHTAKING DISH DETAILS VIEW) */}
          {customizingItem && (
            <CustomizationSheet 
              customizingItem={customizingItem}
              onClose={() => setCustomizingItem(null)}
              onSubmit={handleConfirmCustomization}
            />
          )}

        </div>
      )}

    </DeviceFrame>
  );
}
