export const BillingStatusBadge = ({ status }) => {
  const map = { draft: ['Draft', 'badge-ghost'], issued: ['Issued', 'badge-info'], voided: ['Voided', 'badge-error'], cancelled: ['Cancelled', 'badge-ghost'], refunded: ['Refunded', 'badge-warning'] };
  const [label, cls] = map[status] || map.draft;
  return <span className={`badge badge-sm ${cls}`}>{label}</span>;
};

export const PaymentStatusBadge = ({ status }) => {
  const map = { unpaid: ['Unpaid', 'badge-error'], partially_paid: ['Partial', 'badge-warning'], paid: ['Paid', 'badge-success'], overpaid: ['Overpaid', 'badge-info'], refunded: ['Refunded', 'badge-ghost'] };
  const [label, cls] = map[status] || map.unpaid;
  return <span className={`badge badge-sm ${cls}`}>{label}</span>;
};