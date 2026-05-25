
export default function CategoryChip({ catName, icon, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`category-chip ${active ? 'active' : ''}`}
    >
      <div className="category-icon-wrapper">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="category-label">{catName}</span>
    </div>
  );
}
