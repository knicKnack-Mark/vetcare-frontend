export const StockStatusBadge = ({ status }) => {
  const map = { in_stock: ['In Stock', 'badge-success'], low_stock: ['Low Stock', 'badge-warning'], out_of_stock: ['Out of Stock', 'badge-error'] };
  const [label, cls] = map[status] || map.in_stock;
  return <span className={`badge badge-sm ${cls}`}>{label}</span>;
};

export const ExpirationStatusBadge = ({ status }) => {
  const map = { no_expiration: ['—', 'badge-ghost'], valid: ['Valid', 'badge-success'], expiring_soon: ['Expiring Soon', 'badge-warning'], expired: ['Expired', 'badge-error'] };
  const [label, cls] = map[status] || map.valid;
  return <span className={`badge badge-sm ${cls}`}>{label}</span>;
};