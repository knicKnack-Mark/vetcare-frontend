import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { billingService } from '../../services/billingService';
import { BillingStatusBadge, PaymentStatusBadge } from '../../components/billing/BillingStatusBadge';
import BillingFilters from '../../components/billing/BillingFilters';

const BillingPage = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState({ todaySales: 0, todayCollections: 0, outstandingBalance: 0, unpaidBills: 0, partialBills: 0, monthlySales: 0 });
  const [search, setSearch] = useState('');
  const [billingStatus, setBillingStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      billingService.getAll({ search: search || undefined, billingStatus: billingStatus || undefined, paymentStatus: paymentStatus || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, limit: 20 }),
      billingService.getSummary(),
    ]).then(([listRes, sumRes]) => { setBills(listRes.data.billings); setSummary(sumRes.data); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, billingStatus, paymentStatus, dateFrom, dateTo]);

  const resetFilters = () => { setSearch(''); setBillingStatus(''); setPaymentStatus(''); setDateFrom(''); setDateTo(''); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Billing</h1><p className="text-sm opacity-60">Manage invoices, payments, and financial records.</p></div>
        <button className="btn btn-primary gap-2" onClick={() => navigate('/billing/create')}><Plus size={16} /> New Bill</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Today's Sales", value: `₱${summary.todaySales.toLocaleString()}` },
          { label: "Today's Collections", value: `₱${summary.todayCollections.toLocaleString()}` },
          { label: 'Outstanding', value: `₱${summary.outstandingBalance.toLocaleString()}`, danger: summary.outstandingBalance > 0 },
          { label: 'Unpaid Bills', value: summary.unpaidBills, danger: summary.unpaidBills > 0 },
          { label: 'Partial Payments', value: summary.partialBills },
          { label: 'Monthly Sales', value: `₱${summary.monthlySales.toLocaleString()}` },
        ].map((c) => (
          <div key={c.label} className="card bg-base-100 shadow-sm"><div className="card-body p-4">
            <p className="text-xs opacity-60 uppercase">{c.label}</p>
            <p className={`text-xl font-bold ${c.danger ? 'text-error' : ''}`}>{c.value}</p>
          </div></div>
        ))}
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <div className="flex flex-col gap-3 mb-4">
          <input className="input input-bordered input-sm w-64" placeholder="Search invoice #, owner, pet..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <BillingFilters
            billingStatus={billingStatus} setBillingStatus={setBillingStatus}
            paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus}
            dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo}
            onReset={resetFilters}
          />
        </div>
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>
        ) : bills.length === 0 ? (
          <p className="text-center py-10 text-sm opacity-60">No billing records found.</p>
        ) : (
          <table className="table">
            <thead><tr className="text-xs opacity-60"><th>Invoice #</th><th>Date</th><th>Customer</th><th>Pet</th><th>Total</th><th>Paid</th><th>Balance</th><th>Payment</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b._id} className="hover">
                  <td className="text-xs font-mono">{b.invoiceNumber || 'DRAFT'}</td>
                  <td className="text-sm">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="text-sm">{b.owner?.firstName} {b.owner?.lastName}</td>
                  <td className="text-sm">{b.pet?.name || '—'}</td>
                  <td className="text-sm">₱{b.totalAmount.toLocaleString()}</td>
                  <td className="text-sm">₱{b.amountPaid.toLocaleString()}</td>
                  <td className="text-sm">₱{b.balance.toLocaleString()}</td>
                  <td><PaymentStatusBadge status={b.paymentStatus} /></td>
                  <td><BillingStatusBadge status={b.billingStatus} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-xs" onClick={() => navigate(`/billing/${b._id}`)}>View</button>
                      {b.billingStatus === 'draft' && <button className="btn btn-ghost btn-xs" onClick={() => navigate(`/billing/${b._id}/edit`)}>Edit</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
    </div>
  );
};
export default BillingPage;