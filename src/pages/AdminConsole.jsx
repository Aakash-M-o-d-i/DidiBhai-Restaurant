import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api/menu';

export default function AdminConsole({
  menuItems,
  setMenuItems,
  liveVisitors,
  onNavigateHome,
  fetchMenu,
  onLogout
}) {
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // 'dashboard', 'menu', 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Security / IP Management state
  const [blockedData, setBlockedData] = useState({ blockedIPs: {}, loginAttempts: {} });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [manualIp, setManualIp] = useState('');

  const fetchBlockedIPs = useCallback(async () => {
    setSecurityLoading(true);
    const token = sessionStorage.getItem('adminToken');
    try {
      const res = await fetch('/g/a/n/e/s/h/ganeshdidibhai/blocked', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBlockedData(data || { blockedIPs: {}, loginAttempts: {} });
      }
    } catch (err) {
      console.error('Failed to fetch blocked IPs:', err.message);
    } finally {
      setSecurityLoading(false);
    }
  }, []);

  const handleUnblockIP = async (ip) => {
    if (ip !== '__all__' && !ip.trim()) {
      alert('Please enter a valid IP address.');
      return;
    }
    if (ip === '__all__' && !confirm('Are you sure you want to unblock ALL IP addresses?')) {
      return;
    }
    const token = sessionStorage.getItem('adminToken');
    try {
      const res = await fetch('/g/a/n/e/s/h/ganeshdidibhai/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, ipToUnblock: ip })
      });
      const data = await res.json();
      if (data.success) {
        setSecurityMessage(`Successfully unblocked: ${ip === '__all__' ? 'All IPs' : ip}`);
        setTimeout(() => setSecurityMessage(''), 4000);
        setManualIp('');
        fetchBlockedIPs();
      } else {
        alert(data.message || 'Failed to unblock IP.');
      }
    } catch (err) {
      alert('Error unblocking IP: ' + err.message);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'security') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchBlockedIPs();
    }
  }, [activeSubTab, fetchBlockedIPs]);

  // Fetch latest menu from backend on mount
  useEffect(() => {
    if (fetchMenu) fetchMenu();
  }, [fetchMenu]);

  // Edit / Add Item State
  const [editingItem, setEditingItem] = useState(null); // when not null, modal is shown
  const [modalForm, setModalForm] = useState({
    id: '',
    title: '',
    description: '',
    price: 0,
    category: 'Main Course',
    image: '',
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: [],
    ingredients: []
  });

  // Local state for add-on and ingredient edit
  const [newAddOn, setNewAddOn] = useState({ name: '', price: 0 });
  const [newIngredient, setNewIngredient] = useState('');

  // Handle open editor modal
  const handleOpenEdit = (item) => {
    if (item) {
      setModalForm({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        category: item.category || 'Main Course',
        image: item.image || '/images/plain_maggi.png',
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        isPopular: item.isPopular !== undefined ? item.isPopular : false,
        available: item.available !== undefined ? item.available : true,
        addOns: item.addOns ? [...item.addOns] : [],
        ingredients: item.ingredients ? [...item.ingredients] : []
      });
    } else {
      // Add new item template
      setModalForm({
        id: `custom-${Date.now()}`,
        title: '',
        description: '',
        price: 100,
        category: 'Main Course',
        image: '/images/plain_maggi.png',
        isVeg: true,
        isPopular: false,
        available: true,
        addOns: [],
        ingredients: []
      });
    }
    setNewIngredient('');
    setNewAddOn({ name: '', price: 0 });
    setEditingItem(true);
  };

  // Handle toggle stock status directly from grid — calls API
  const handleToggleStock = async (id) => {
    // Optimistic UI update
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
    try {
      await fetch(`${API_BASE}/${id}/toggle`, { method: 'PATCH' });
      if (fetchMenu) fetchMenu();
    } catch (err) {
      console.error('Toggle failed:', err.message);
    }
  };

  // Delete menu item — calls API
  const handleDeleteItem = async (id, title) => {
    if (confirm(`Are you sure you want to remove "${title}" from the menu?`)) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      try {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (fetchMenu) fetchMenu();
      } catch (err) {
        console.error('Delete failed:', err.message);
      }
    }
  };

  // Save changes from form — calls API (POST for new, PUT for existing)
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!modalForm.title.trim()) {
      alert('Please enter a valid item name!');
      return;
    }

    const savedItem = {
      ...modalForm,
      price: Number(modalForm.price)
    };

    // Optimistic UI update
    setMenuItems(prev => {
      const exists = prev.some(item => item.id === savedItem.id);
      if (exists) {
        return prev.map(item => item.id === savedItem.id ? savedItem : item);
      } else {
        return [...prev, savedItem];
      }
    });

    // Simple visual spinner/success button transition trigger
    const submitBtn = e.nativeEvent.submitter;
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Saving...';
      submitBtn.disabled = true;

      try {
        const isNew = !menuItems.some(item => item.id === savedItem.id);
        const url = isNew ? API_BASE : `${API_BASE}/${savedItem.id}`;
        const method = isNew ? 'POST' : 'PUT';
        
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedItem)
        });
        
        if (fetchMenu) fetchMenu();

        setTimeout(() => {
          submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Saved Successfully!';
          submitBtn.style.backgroundColor = '#16a34a';

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
            setEditingItem(null);
          }, 1000);
        }, 400);
      } catch (err) {
        console.error('Save failed:', err.message);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    } else {
      // No submit button — still call API
      try {
        const isNew = !menuItems.some(item => item.id === savedItem.id);
        const url = isNew ? API_BASE : `${API_BASE}/${savedItem.id}`;
        const method = isNew ? 'POST' : 'PUT';
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedItem)
        });
        if (fetchMenu) fetchMenu();
      } catch (err) {
        console.error('Save failed:', err.message);
      }
      setEditingItem(null);
    }
  };

  // Filter dynamic list based on category & search terms
  const filteredMenuItems = menuItems.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (item.title || '').toLowerCase().includes(query) || 
                          (item.description || '').toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || 
                          (item.category || '').toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Extract categories for filter


return (
    <div className="admin-container animate-fade-in">
      
      {/* ==========================================
         SIDEBAR NAVIGATION DRAWER (DESKTOP)
         ========================================== */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '22px', fontWeight: '800', color: 'var(--color-primary)' }}>
            Admin Console
          </h1>
          <button 
            className="material-symbols-outlined admin-sidebar-close-btn" 
            onClick={() => setSidebarOpen(false)}
          >
            close
          </button>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div 
            className={`admin-nav-item ${activeSubTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('dashboard'); setSidebarOpen(false); }}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </div>

          <div 
            className={`admin-nav-item ${activeSubTab === 'menu' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('menu'); setSidebarOpen(false); }}
          >
            <span className="material-symbols-outlined">restaurant_menu</span>
            <span>Menu Management</span>
          </div>

          <div 
            className={`admin-nav-item ${activeSubTab === 'analytics' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('analytics'); setSidebarOpen(false); }}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span>Visitor Analytics</span>
          </div>

          <div 
            className={`admin-nav-item ${activeSubTab === 'security' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('security'); setSidebarOpen(false); }}
          >
            <span className="material-symbols-outlined">security</span>
            <span>Security Control</span>
          </div>

          <div 
            className="admin-nav-item"
            onClick={() => { if(confirm('Exit Admin Panel and return to home menu?')) onNavigateHome(); }}
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Customer View</span>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar Backdrop overlay */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==========================================
         MAIN CONTENT CANVAS
         ========================================== */}
      <main className="admin-main">
        
        {/* MOBILE TOP HEADER */}
        <header className="admin-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="material-symbols-outlined text-primary" 
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px' }}
            >
              menu
            </button>
            <span style={{ fontFamily: 'var(--font-brand)', fontSize: '18px', color: 'var(--color-primary)', letterSpacing: '0.02em' }}>
              Didi-Bhai
            </span>
          </div>
          <div className="avatar-container" onClick={onNavigateHome}>
            <img 
              alt="Admin Profile" 
              className="avatar-img" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbyeuVTCAitaKE6Vl-OvCcapd1KqEpKxbmYxeiwSfsy7p_ziLYuRgA8-1t7DUh2Xy3vFu51lGJ3S9Zr-AVx8WDfvGc7Sz2SPlpxiSxpqVXFB3SQZiqna0vHqhmJ5JxgEPH_fZ4EXENFOWzCuNRHfw6uLZqFmCAThovPa5RC-7xsx52wkZg5uwV2WT63xq23jwYWGaWG2gQL5N9cTugbBCz7PFSLFbzaMbH2Wm--XCs8Xkkg43QJ8K7LRpMzFQqD06SmeTbGsSmkO0"
            />
          </div>
        </header>

        {/* DESKTOP TOP HEADER */}
        <header className="admin-header">
          <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '24px', color: 'var(--color-primary)', letterSpacing: '0.02em' }}>
            Didi-Bhai
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Admin Hub</p>
              <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>System Administrator</p>
            </div>
            <div className="avatar-container" onClick={onNavigateHome}>
              <img 
                alt="Admin Profile" 
                className="avatar-img" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbyeuVTCAitaKE6Vl-OvCcapd1KqEpKxbmYxeiwSfsy7p_ziLYuRgA8-1t7DUh2Xy3vFu51lGJ3S9Zr-AVx8WDfvGc7Sz2SPlpxiSxpqVXFB3SQZiqna0vHqhmJ5JxgEPH_fZ4EXENFOWzCuNRHfw6uLZqFmCAThovPa5RC-7xsx52wkZg5uwV2WT63xq23jwYWGaWG2gQL5N9cTugbBCz7PFSLFbzaMbH2Wm--XCs8Xkkg43QJ8K7LRpMzFQqD06SmeTbGsSmkO0"
              />
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="admin-logout-btn"
                title="Sign out"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="admin-logout-label">Sign Out</span>
              </button>
            )}
          </div>
        </header>

        {/* MAIN VIEWS ORCHESTRATION */}
        <div className="admin-content">

          {/* ==========================================
             VIEW 1: DASHBOARD OVERVIEW
             ========================================== */}
          {activeSubTab === 'dashboard' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '28px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                    Dashboard Overview
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                    Welcome back! Here's what's happening with your delivery hub today.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-primary" onClick={() => handleOpenEdit(null)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Add New Item
                  </button>
                  <button className="btn-secondary" onClick={() => setActiveSubTab('menu')}>
                    Manage Menu
                  </button>
                </div>
              </section>

              {/* Metrics Row */}
              <section className="metric-row">
                {/* Metric 1 */}
                <div className="metric-card">
                  <div className="metric-header">
                    <div className="metric-icon-box" style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}>
                      <span className="material-symbols-outlined">group</span>
                    </div>
                    <span className="metric-trend up">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>trending_up</span> 12%
                    </span>
                  </div>
                  <div>
                    <p className="metric-label">Diners / Visitors</p>
                    <h3 className="metric-value">{liveVisitors}</h3>
                  </div>
                </div>
              </section>

              {/* Bento Row: Popular Items & Promos */}
              <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* Top Sellers */}
                <div className="admin-card" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                      Top Sellers
                    </h4>
                    <button 
                      style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                      onClick={() => setActiveSubTab('analytics')}
                    >
                      View All
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-surface-container)' }}>
                        <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="/images/veg_thali.png" alt="Veg Thali" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Veg Thali</p>
                        <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>842 orders this week</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}>₹130</p>
                        <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-surface-container)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                          <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-surface-container)' }}>
                        <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="/images/chicken_momos.png" alt="Chicken Momos" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Chicken Momos</p>
                        <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>765 orders this week</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}>₹120</p>
                        <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-surface-container)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                          <div style={{ width: '72%', height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo Campaign Banner */}
                <div className="admin-card" style={{ backgroundColor: 'var(--color-primary-container)', color: '#ffffff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>Weekend Promo</h4>
                    <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>Set up active discounts for the upcoming holiday rush.</p>
                    <button 
                      style={{ border: 'none', backgroundColor: '#ffffff', color: 'var(--color-primary)', fontWeight: '700', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', marginTop: '16px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      onClick={() => alert('Discounts can be added via the Menu Manager editing custom price tokens.')}
                    >
                      Create Offer
                    </button>
                  </div>
                  <span 
                    className="material-symbols-outlined" 
                    style={{ position: 'absolute', right: '-10px', bottom: '-15px', fontSize: '100px', opacity: 0.15, color: '#ffffff', userSelect: 'none' }}
                  >
                    campaign
                  </span>
                </div>

              </section>

            </div>
          )}

          {/* ==========================================
             VIEW 2: VISITOR ANALYTICS
             ========================================== */}
          {activeSubTab === 'analytics' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '28px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                    Visitor Analytics
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                    Real-time insights into your store's performance.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-secondary" style={{ backgroundColor: 'var(--color-surface-container-high)', border: '1px solid var(--color-outline-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_today</span> Last 7 Days
                  </button>
                  <button className="btn-primary" onClick={() => alert('Visitor Analytics log exported to system CSV download!')}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span> Export
                  </button>
                </div>
              </section>

              {/* Analytics Bento Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* Traffic Trend Chart */}
                <div className="admin-card" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                        Site Visitors
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                        <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>+12.4%</span> vs last week
                      </p>
                    </div>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)', cursor: 'pointer' }}>more_vert</span>
                  </div>

                  {/* SVG Line Graph */}
                  <div style={{ position: 'relative', height: '200px', width: '100%', marginTop: '16px' }}>
                    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} viewBox="0 0 700 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Gradient Fill */}
                      <path 
                        d="M0,130 Q100,100 200,120 T400,60 T600,90 T700,30 L700,160 L0,160 Z" 
                        fill="url(#areaGradient)" 
                      />
                      
                      {/* Line Stroke */}
                      <path 
                        d="M0,130 Q100,100 200,120 T400,60 T600,90 T700,30" 
                        fill="none" 
                        stroke="var(--color-primary)" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                      />

                      {/* Nodes */}
                      <circle cx="0" cy="130" r="4.5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="200" cy="120" r="4.5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="400" cy="60" r="4.5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="600" cy="90" r="4.5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="700" cy="30" r="4.5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: 'var(--color-on-surface-variant)', marginTop: '16px', borderTop: '1px solid rgba(142, 113, 100, 0.15)', paddingTop: '8px' }}>
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Demographics & Gauges */}
                <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                    User Demographics
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                    
                    {/* Progress bars list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--color-on-surface-variant)' }}>18-24 years</span>
                          <span>35%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-container)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: '35%', height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--color-on-surface-variant)' }}>25-34 years</span>
                          <span>48%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-container)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: '48%', height: '100%', backgroundColor: 'var(--color-secondary)' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--color-on-surface-variant)' }}>35+ years</span>
                          <span>17%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-container)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: '17%', height: '100%', backgroundColor: 'var(--color-tertiary)' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Circular repeat-diners gauge */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="demographics-gauge">
                        <svg viewBox="0 0 36 36">
                          <circle className="demographics-gauge-bg" cx="18" cy="18" r="15.9" />
                          <circle className="demographics-gauge-fill" cx="18" cy="18" r="15.9" strokeDasharray="65, 100" />
                        </svg>
                        <div className="demographics-gauge-text">65%</div>
                      </div>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>
                        Repeat Customers
                      </p>
                    </div>

                  </div>
                </div>

                {/* Quick stats cards */}
                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="admin-card" style={{ backgroundColor: 'var(--color-surface-container-high)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>timer</span>
                    <div>
                      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: '600' }}>Avg. Session Duration</p>
                      <h5 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>4m 32s</h5>
                    </div>
                  </div>

                  <div className="admin-card" style={{ backgroundColor: 'var(--color-secondary-container)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                    <span className="material-symbols-outlined text-secondary" style={{ fontSize: '32px' }}>shopping_cart_checkout</span>
                    <div>
                      <p style={{ fontSize: '12px', color: 'var(--color-on-secondary-container)', fontWeight: '600' }}>Conversion Rate</p>
                      <h5 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: '800', color: 'var(--color-on-secondary-container)', marginTop: '4px' }}>8.42%</h5>
                    </div>
                  </div>
                </div>

              </div>

              {/* Visitor Source Detailed Table */}
              <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                    Visitor Source Details
                  </h4>
                  <button 
                    style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    onClick={() => alert('Filters applied.')}
                  >
                    Filter Details
                  </button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Source Channel</th>
                        <th>Visitors</th>
                        <th>Bounce Rate</th>
                        <th>Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>search</span>
                          Google Search
                        </td>
                        <td>2,450</td>
                        <td>24.2%</td>
                        <td style={{ fontWeight: '800', color: 'var(--color-primary)' }}>₹82,400</td>
                      </tr>
                      <tr>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                          <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>share</span>
                          Social Media
                        </td>
                        <td>1,820</td>
                        <td>31.8%</td>
                        <td style={{ fontWeight: '800', color: 'var(--color-primary)' }}>₹45,210</td>
                      </tr>
                      <tr>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                          <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '18px' }}>send</span>
                          Direct Links
                        </td>
                        <td>940</td>
                        <td>18.5%</td>
                        <td style={{ fontWeight: '800', color: 'var(--color-primary)' }}>₹28,900</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
             VIEW 3: MENU MANAGEMENT
             ========================================== */}
          {activeSubTab === 'menu' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '28px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                    Menu Management
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                    Update and organize your culinary offerings &mdash; <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{menuItems.length} items total</span> ({filteredMenuItems.length} filtered)
                  </p>
                </div>
                <button className="btn-primary" onClick={() => handleOpenEdit(null)}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span> Add New Item
                </button>
              </section>

              {/* Search & Category Chips */}
              <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                {/* Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '24px', padding: '10px 18px', width: '100%', maxWidth: '360px', border: '1px solid var(--color-outline-variant)' }}>
                  <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '22px', marginRight: '10px' }}>search</span>
                  <input 
                    type="text" 
                    placeholder="Search dish name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--color-on-surface)', fontSize: '14px' }}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '18px' }}>cancel</span>
                    </button>
                  )}
                </div>

                {/* Category selector pills in menu manager */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['All', 'Thalis', 'Momos', 'Maggi', 'Beverages'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`admin-category-chip ${selectedCategory === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Grid of editable items */}
              <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                
                {filteredMenuItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="glass-panel" 
                    style={{ borderRadius: '16px', border: '1px solid var(--color-outline-variant)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.25s' }}
                  >
                    
                    {/* Item Image with dynamic overlay badges */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', backgroundColor: 'var(--color-surface-container)' }}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        onError={(e) => { e.target.src = '/images/plain_maggi.png'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      
                      <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', borderRadius: '20px', padding: '4px 10px', backgroundColor: item.isVeg ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)', color: '#ffffff' }}>
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                        {item.isPopular && (
                          <span style={{ fontSize: '11px', fontWeight: '700', borderRadius: '20px', padding: '4px 10px', backgroundColor: 'rgba(255, 152, 0, 0.9)', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>star</span> Popular
                          </span>
                        )}
                      </div>

                      {!item.available && (
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', border: '2px solid #ffffff', padding: '6px 12px', borderRadius: '4px' }}>
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </h4>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary)' }}>
                          ₹{item.price}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', flex: 1, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.5', marginBottom: '16px' }}>
                        {item.description || 'No description provided.'}
                      </p>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                        <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }}>
                          {item.category}
                        </span>
                        {item.ingredients && item.ingredients.length > 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                            &bull; {item.ingredients.length} ingredients
                          </span>
                        )}
                        {item.addOns && item.addOns.length > 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                            &bull; {item.addOns.length} add-ons
                          </span>
                        )}
                      </div>

                      {/* Stock Switcher & Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-outline-variant)', paddingTop: '16px' }}>
                        <div className="toggle-switch-wrapper" style={{ cursor: 'pointer' }} onClick={() => handleToggleStock(item.id)}>
                          <button 
                            className={`toggle-switch ${item.available ? 'active' : ''}`}
                            style={{ pointerEvents: 'none' }}
                          >
                            <div className="toggle-knob"></div>
                          </button>
                          <span className="toggle-status-label" style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: '700' }}>
                            {item.available ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="btn-secondary" 
                            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Edit Item"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="btn-secondary" 
                            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-error, #ba1a1a)' }}
                            title="Delete Item"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}

                {/* Empty Add New card trigger in grid */}
                <div 
                  className="group" 
                  onClick={() => handleOpenEdit(null)}
                  style={{ border: '2px dashed var(--color-outline-variant)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', minHeight: '350px', cursor: 'pointer', transition: 'all 0.25s' }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '16px' }}>
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>add</span>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                    Add New Item
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px', textAlign: 'center' }}>
                    Expand your menu with fresh flavors.
                  </p>
                </div>

              </section>

            </div>
          )}

          {/* ==========================================
             VIEW 4: SECURITY & IP MANAGEMENT
             ========================================== */}
          {activeSubTab === 'security' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Header Info */}
              <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '28px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                    Security Control Center
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                    Monitor system access, manage login attempts, and unblock blacklisted IP addresses.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={fetchBlockedIPs} 
                    disabled={securityLoading}
                    style={{ backgroundColor: 'var(--color-surface-container-high)', border: '1px solid var(--color-outline-variant)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: securityLoading ? 'spin 1.5s linear infinite' : 'none' }}>refresh</span>
                    Refresh Logs
                  </button>
                  <button 
                    className="btn-primary" 
                    style={{ backgroundColor: 'var(--color-error, #ba1a1a)' }}
                    onClick={() => handleUnblockIP('__all__')}
                    disabled={Object.keys(blockedData.blockedIPs || {}).length === 0}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock_open</span>
                    Unblock All IPs
                  </button>
                </div>
              </section>

              {/* Status Message */}
              {securityMessage && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-on-primary-container)',
                  fontSize: '14px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s'
                }}>
                  <span className="material-symbols-outlined">info</span>
                  {securityMessage}
                </div>
              )}

              {/* Metrics Widgets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                
                <div className="stat-widget" style={{ position: 'relative', overflow: 'hidden' }}>
                  <span className="stat-title">Access Status</span>
                  <span className="stat-value" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', marginTop: '12px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#2e7d32', fontSize: '24px' }}>shield</span>
                    Fully Protected
                    <span className="live-dot" style={{ backgroundColor: '#2e7d32' }}></span>
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>IP auto-lockout threshold: 8 wrong attempts</p>
                </div>

                <div className="stat-widget">
                  <span className="stat-title">Active Blacklist</span>
                  <span className="stat-value" style={{ color: Object.keys(blockedData.blockedIPs || {}).length > 0 ? 'var(--color-error, #ba1a1a)' : 'var(--color-on-surface)' }}>
                    {Object.keys(blockedData.blockedIPs || {}).length}
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>IP addresses permanently blocked</p>
                </div>

                <div className="stat-widget">
                  <span className="stat-title">Active Intrusion Track</span>
                  <span className="stat-value">
                    {Object.keys(blockedData.loginAttempts || {}).length}
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>IPs currently with failed attempts</p>
                </div>
              </div>

              {/* Layout for unblock list and manual input */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                
                {/* Blocked IP Registry Card */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)' }}>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-error, #ba1a1a)' }}>gpp_bad</span>
                    Blocked IP Registry
                  </h4>

                  {securityLoading ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: '32px' }}>refresh</span>
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>Fetching safety registry...</p>
                    </div>
                  ) : Object.keys(blockedData.blockedIPs || {}).length === 0 ? (
                    <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(46, 125, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: '#2e7d32', fontSize: '28px' }}>verified_user</span>
                      </div>
                      <div>
                        <h5 style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-on-surface)' }}>System Safety Clear</h5>
                        <p style={{ fontSize: '11px', marginTop: '2px' }}>No IP addresses are currently blacklisted.</p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }} className="hide-scrollbar">
                      {Object.keys(blockedData.blockedIPs).map(ip => (
                        <div 
                          key={ip} 
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: 'var(--color-surface-container-high)',
                            borderRadius: '12px',
                            border: '1px solid var(--color-outline-variant)'
                          }}
                        >
                          <div>
                            <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '14px', color: 'var(--color-on-surface)' }}>{ip}</span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', backgroundColor: 'var(--color-error-container, #ffdad6)', color: 'var(--color-on-error-container, #410002)', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>Blocked</span>
                              <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                                Attempts: {blockedData.loginAttempts[ip] || 8}
                              </span>
                            </div>
                          </div>
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '16px', borderColor: 'var(--color-primary)' }}
                            onClick={() => handleUnblockIP(ip)}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock_open</span>
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Login Attempts & Manual Unblock Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Manual Tool */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)' }}>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>build</span>
                      Manual Administrative Tools
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                        Directly unblock any target IP address if it is not currently displaying in the auto-detected list.
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="e.g. 192.168.1.1" 
                          value={manualIp}
                          onChange={(e) => setManualIp(e.target.value)}
                          className="admin-input"
                          style={{ fontFamily: 'monospace', flex: 1, padding: '10px 14px', fontSize: '13px' }}
                        />
                        <button 
                          className="btn-primary" 
                          style={{ padding: '10px 16px' }}
                          onClick={() => handleUnblockIP(manualIp)}
                        >
                          Unblock IP
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Intrusion Tracking Card */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)' }}>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>tracking</span>
                      Active Attempt Logs
                    </h4>
                    
                    {securityLoading ? (
                      <div style={{ textAlign: 'center', padding: '16px' }}>
                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: '24px' }}>refresh</span>
                      </div>
                    ) : Object.keys(blockedData.loginAttempts || {}).filter(ip => !blockedData.blockedIPs[ip]).length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontStyle: 'italic', textAlign: 'center', padding: '12px' }}>
                        No ongoing failed attempts tracked. Everything is secure.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }} className="hide-scrollbar">
                        {Object.keys(blockedData.loginAttempts)
                          .filter(ip => !blockedData.blockedIPs[ip])
                          .map(ip => (
                            <div 
                              key={ip}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                backgroundColor: 'var(--color-surface-container)',
                                borderRadius: '8px',
                                border: '1px solid var(--color-outline-variant)',
                                fontSize: '12px'
                              }}
                            >
                              <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--color-on-surface)' }}>{ip}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'var(--color-on-surface-variant)' }}>
                                  Attempts: <strong>{blockedData.loginAttempts[ip]} / 8</strong>
                                </span>
                                <button 
                                  onClick={() => handleUnblockIP(ip)}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    color: 'var(--color-primary)',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '11px',
                                    padding: '2px 4px'
                                  }}
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* ==========================================
           IMMERSIBLE EDIT / ADD FORM MODAL SHEET
           ========================================== */}
        {editingItem && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-sheet no-scrollbar">
              <div className="glass-panel" style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255, 248, 246, 0.9)' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '22px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                    {modalForm.id.startsWith('custom') ? 'Add New Item' : 'Edit Menu Item'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                    Update the details for your restaurant's dish.
                  </p>
                </div>
                <button 
                  className="material-symbols-outlined text-primary-container"
                  onClick={() => setEditingItem(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px' }}
                >
                  cancel
                </button>
              </div>

              <form onSubmit={handleSaveItem} style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                  
                  {/* Left Column: Image placeholder card */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface-variant)' }}>Item Cover Image</label>
                    <div 
                      className="group" 
                      onClick={() => {
                        const newUrl = prompt('Enter image URL or select simulated cover:', modalForm.image);
                        if(newUrl) setModalForm(prev => ({ ...prev, image: newUrl }));
                      }}
                      style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '2px dashed var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <img 
                        src={modalForm.image} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
                      />
                      <div className="glass-panel" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, hoverOpacity: 1, backgroundColor: 'rgba(0,0,0,0.4)', transition: 'opacity 0.25s' }}>
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '36px' }}>cloud_upload</span>
                        <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '12px', marginTop: '8px' }}>Change Image</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', textAlign: 'center', fontStyle: 'italic' }}>
                      Recommended: 1080x1080px (Max 5MB)
                    </p>
                  </div>

                  {/* Right Column: Inputs details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Item Name</label>
                      <input 
                        className="admin-input"
                        required
                        value={modalForm.title}
                        onChange={(e) => setModalForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Special Butter Chicken"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Category</label>
                        <select 
                          className="admin-select"
                          value={modalForm.category}
                          onChange={(e) => setModalForm(prev => ({ ...prev, category: e.target.value }))}
                        >
                          <option value="Thalis">Thalis</option>
                          <option value="Momos">Momos</option>
                          <option value="Maggi">Maggi</option>
                          <option value="Beverages">Beverages</option>
                          <option value="Main Course">Main Course</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Price (₹)</label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '14px', top: '14px', fontWeight: '700', color: 'var(--color-on-surface-variant)' }}>₹</span>
                          <input 
                            className="admin-input"
                            type="number"
                            style={{ paddingLeft: '32px' }}
                            required
                            min="0"
                            value={modalForm.price}
                            onChange={(e) => setModalForm(prev => ({ ...prev, price: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Food Type</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button 
                            type="button"
                            className={`admin-category-pill ${modalForm.isVeg ? 'active' : 'inactive'}`}
                            onClick={() => setModalForm(prev => ({ ...prev, isVeg: true }))}
                          >
                            Veg
                          </button>
                          <button 
                            type="button"
                            className={`admin-category-pill ${!modalForm.isVeg ? 'active' : 'inactive'}`}
                            onClick={() => setModalForm(prev => ({ ...prev, isVeg: false }))}
                          >
                            Non-Veg
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Initial Stock Status</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button 
                            type="button"
                            className={`admin-toggle-btn ${modalForm.available ? 'active' : ''}`}
                            onClick={() => setModalForm(prev => ({ ...prev, available: !prev.available }))}
                          >
                            <div className="admin-toggle-knob"></div>
                          </button>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)' }}>
                            {modalForm.available ? 'In Stock' : 'Out'}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Add-ons Custom Sub-section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-outline-variant)', paddingBottom: '8px' }}>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                      Toppings & Add-ons
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {modalForm.addOns.map((addon, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>{addon.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '700' }}>₹{addon.price}</p>
                        </div>
                        <button 
                          type="button"
                          className="material-symbols-outlined text-error"
                          onClick={() => setModalForm(prev => ({ ...prev, addOns: prev.addOns.filter((_, i) => i !== index) }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                        >
                          delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add addon form */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                    <input 
                      className="admin-input" 
                      placeholder="Add-on name..." 
                      style={{ flex: 2, height: '40px' }}
                      value={newAddOn.name}
                      onChange={(e) => setNewAddOn(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <input 
                      className="admin-input" 
                      type="number" 
                      placeholder="Price..." 
                      style={{ flex: 1, height: '40px' }}
                      value={newAddOn.price || ''}
                      onChange={(e) => setNewAddOn(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />
                    <button 
                      type="button"
                      className="btn-primary" 
                      style={{ height: '40px', padding: '0 16px' }}
                      onClick={() => {
                        if(!newAddOn.name.trim() || newAddOn.price <= 0) return;
                        setModalForm(prev => ({ ...prev, addOns: [...prev.addOns, newAddOn] }));
                        setNewAddOn({ name: '', price: 0 });
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Ingredients Custom Sub-section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-outline-variant)', paddingBottom: '8px' }}>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                      Dish Ingredients
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {modalForm.ingredients && modalForm.ingredients.map((ing, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-on-surface)' }}>{ing}</span>
                        <button 
                          type="button"
                          className="material-symbols-outlined text-error"
                          onClick={() => setModalForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: 0 }}
                        >
                          close
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add ingredient form */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                    <input 
                      className="admin-input" 
                      placeholder="Add ingredient name..." 
                      style={{ flex: 1, height: '40px' }}
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                    />
                    <button 
                      type="button"
                      className="btn-primary" 
                      style={{ height: '40px', padding: '0 16px' }}
                      onClick={() => {
                        if(!newIngredient.trim()) return;
                        setModalForm(prev => ({ ...prev, ingredients: [...(prev.ingredients || []), newIngredient.trim()] }));
                        setNewIngredient('');
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Description Textarea */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '24px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Item Description</label>
                  <textarea 
                    className="admin-textarea"
                    rows="3"
                    value={modalForm.description}
                    onChange={(e) => setModalForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this delicious dish's ingredients, taste profile, and spices..."
                  />
                </div>

                {/* Save & Cancel Action Row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', borderTop: '1px solid var(--color-outline-variant)', paddingTop: '24px' }}>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setEditingItem(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span> Save Changes
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--color-outline-variant)', padding: '24px 32px', backgroundColor: 'var(--color-surface-container)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
              2026 &copy; 2024 Didi-Bhai Restaurant Admin. All Rights Reserved.
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              <a href="#" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Support</a>
              <a href="#" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>Terms of Service</a>
            </div>
          </div>
        </footer>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="admin-mobile-nav">
          <button 
            className={`admin-mobile-nav-btn ${activeSubTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('dashboard')}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <label>Home</label>
          </button>
          <button 
            className={`admin-mobile-nav-btn ${activeSubTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('menu')}
          >
            <span className="material-symbols-outlined">restaurant_menu</span>
            <label>Menu</label>
          </button>
          <button 
            className={`admin-mobile-nav-btn ${activeSubTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('analytics')}
          >
            <span className="material-symbols-outlined">analytics</span>
            <label>Analytics</label>
          </button>
          <button 
            className={`admin-mobile-nav-btn ${activeSubTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('security')}
          >
            <span className="material-symbols-outlined">security</span>
            <label>Security</label>
          </button>
          <button 
            className="admin-mobile-nav-btn"
            onClick={onNavigateHome}
          >
            <span className="material-symbols-outlined">logout</span>
            <label>Exit</label>
          </button>
        </nav>

      </main>
    </div>
  );
}
