import React from 'react';

export default function SplashScreen() {
  return (
    <div 
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'var(--color-background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '64px 20px',
        zIndex: 50,
        height: '100%'
      }}
      className="animate-fade-in"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
        <div style={{ position: 'relative', width: '144px', height: '144px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <div className="rotate-splash" style={{ position: 'absolute', inset: 0, border: '4px dashed var(--color-primary-container)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', inset: '8px', border: '2px double var(--color-secondary)', borderRadius: '50%' }}></div>
          <img 
            src="/images/logo.jpg" 
            alt="Didi-Bhai Logo" 
            style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} 
          />
        </div>
        <h1 className="brand-title" style={{ color: '#003366', fontSize: '30px', textAlign: 'center', textTransform: 'uppercase', fontWeight: '800' }}>
          Didi-Bhai Restaurant
        </h1>
        <p style={{ color: 'var(--color-primary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800', marginTop: '4px' }}>
          Digital Cuisine App
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-surface-container-high)', padding: '4px 12px', borderRadius: '9999px', marginTop: '16px' }}>
          <span className="live-dot"></span>
          <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: '800', textTransform: 'uppercase' }}>Premium Dining</span>
        </div>
      </div>
      <p style={{ fontSize: '10px', color: '#5a4136', opacity: 0.7, textAlign: 'center' }}>
        Traditional Hospitality meets Digital Efficiency.
      </p>
    </div>
  );
}
