const BillingFilters = ({ billingStatus, setBillingStatus, paymentStatus, setPaymentStatus, dateFrom, setDateFrom, dateTo, setDateTo, onReset }) => (
  <div className="flex flex-wrap items-end gap-3">
    <div className="flex flex-col gap-1">
      <label className="text-xs opacity-60">Billing Status</label>
      <select className="select select-bordered select-sm" value={billingStatus} onChange={(e) => setBillingStatus(e.target.value)}>
        <option value="">All</option>
        {['draft', 'issued', 'voided', 'cancelled', 'refunded'].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs opacity-60">Payment Status</label>
      <select className="select select-bordered select-sm" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
        <option value="">All</option>
        {['unpaid', 'partially_paid', 'paid', 'overpaid', 'refunded'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
      </select>
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs opacity-60">From</label>
      <input type="date" className="input input-bordered input-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs opacity-60">To</label>
      <input type="date" className="input input-bordered input-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
    </div>
    <button className="btn btn-ghost btn-sm" onClick={onReset}>Reset</button>
  </div>
);
export default BillingFilters;