import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Printer, CreditCard, Ban, RotateCcw, Receipt as ReceiptIcon } from 'lucide-react';
import { billingService } from '../../services/billingService';
import { BillingStatusBadge, PaymentStatusBadge } from '../../components/billing/BillingStatusBadge';
import PaymentModal from '../../components/billing/PaymentModal';
import VoidBillingModal from '../../components/billing/VoidBillingModal';
import RefundModal from '../../components/billing/RefundModal';
import InvoicePreview from '../../components/billing/InvoicePreview';
import ReceiptPreview from '../../components/billing/ReceiptPreview';

const BillingProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState(null);
  const [payments, setPayments] = useState([]);
  const [modal, setModal] = useState(null);
  const [receiptPayment, setReceiptPayment] = useState(null);

  const load = () => billingService.getById(id).then((res) => { setBilling(res.data.billing); setPayments(res.data.payments); });
  useEffect(() => { load(); }, [id]);

  if (!billing) return <div className="skeleton h-96 w-full" />;

  const handleFinalize = async () => {
    try { await billingService.finalize(id); toast.success('Invoice finalized'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to finalize'); }
  };

  const handlePayment = async (data) => { await billingService.addPayment(id, data); toast.success('Payment recorded'); setModal(null); load(); };
  const handleVoid = async (reason, returnInventory) => { await billingService.void(id, reason, returnInventory); toast.success('Invoice voided'); setModal(null); load(); };
  const handleRefund = async (data) => { await billingService.refund(id, data); toast.success('Refund processed'); setModal(null); load(); };

  const printInvoice = () => { setReceiptPayment(null); setTimeout(() => window.print(), 50); };
  const printReceipt = (payment) => { setReceiptPayment(payment); setTimeout(() => window.print(), 50); };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{billing.invoiceNumber || 'Draft Bill'}</h1>
            <div className="flex gap-2 mt-1"><BillingStatusBadge status={billing.billingStatus} /><PaymentStatusBadge status={billing.paymentStatus} /></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {billing.billingStatus === 'draft' && <button className="btn btn-primary btn-sm" onClick={handleFinalize}>Finalize Invoice</button>}
            {billing.billingStatus === 'issued' && billing.balance > 0 && <button className="btn btn-success btn-sm gap-1" onClick={() => setModal('payment')}><CreditCard size={14} /> Add Payment</button>}
            {billing.billingStatus === 'issued' && billing.amountPaid > 0 && <button className="btn btn-warning btn-sm gap-1" onClick={() => setModal('refund')}><RotateCcw size={14} /> Refund</button>}
            {billing.billingStatus === 'issued' && <button className="btn btn-error btn-sm gap-1" onClick={() => setModal('void')}><Ban size={14} /> Void</button>}
            <button className="btn btn-outline btn-sm gap-1" onClick={printInvoice}><Printer size={14} /> Print Invoice</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-sm"><div className="card-body">
            <h2 className="card-title text-base">Customer</h2>
            <p className="text-sm">{billing.owner?.firstName} {billing.owner?.lastName} · {billing.owner?.mobileNumber}</p>
            <Link to={`/owners/${billing.owner?._id}`} className="link link-primary text-sm">View Owner</Link>
          </div></div>
          {billing.pet && (
            <div className="card bg-base-100 shadow-sm"><div className="card-body">
              <h2 className="card-title text-base">Pet</h2>
              <p className="text-sm">{billing.pet?.name}</p>
              <Link to={`/pets/${billing.pet?._id}`} className="link link-primary text-sm">View Pet</Link>
            </div></div>
          )}
        </div>

        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Items</h2>
          <table className="table table-sm">
            <thead><tr className="text-xs opacity-60"><th>Description</th><th>Type</th><th>Qty</th><th>Unit Price</th><th>Discount</th><th>Total</th></tr></thead>
            <tbody>
              {billing.items.map((item, i) => (
                <tr key={i}><td className="text-sm">{item.name}</td><td className="text-sm">{item.itemType}</td><td className="text-sm">{item.quantity} {item.unit}</td><td className="text-sm">₱{item.unitPrice}</td><td className="text-sm">₱{item.discount}</td><td className="text-sm font-medium">₱{item.total}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="divider" />
          <div className="space-y-1 max-w-xs ml-auto text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₱{billing.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-₱{billing.discountAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₱{billing.taxAmount.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>₱{billing.totalAmount.toLocaleString()}</span></div>
            <div className="flex justify-between text-success"><span>Paid</span><span>₱{billing.amountPaid.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-error"><span>Balance</span><span>₱{billing.balance.toLocaleString()}</span></div>
          </div>
        </div></div>

        <div className="card bg-base-100 shadow-sm"><div className="card-body">
          <h2 className="card-title text-base">Payment History</h2>
          {payments.length === 0 ? <p className="text-sm opacity-60 py-4 text-center">No payment history.</p> : (
            <table className="table table-sm">
              <thead><tr className="text-xs opacity-60"><th>Payment #</th><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th><th>By</th><th></th></tr></thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td className="text-xs font-mono">{p.paymentNumber}</td><td className="text-sm">{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td className="text-sm">₱{p.amount.toLocaleString()}</td><td className="text-sm capitalize">{p.paymentMethod.replace('_', ' ')}</td>
                    <td className="text-sm">{p.referenceNumber || '—'}</td><td className="text-sm">{p.receivedBy?.name}</td>
                    <td><button className="btn btn-ghost btn-xs gap-1" onClick={() => printReceipt(p)}><ReceiptIcon size={12} /> Receipt</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div></div>
      </div>

      {/* Print-only layouts, hidden on screen */}
      {!receiptPayment && <InvoicePreview billing={billing} />}
      {receiptPayment && <ReceiptPreview billing={billing} payment={receiptPayment} />}

      <PaymentModal billing={modal === 'payment' ? billing : null} onCancel={() => setModal(null)} onConfirm={handlePayment} />
      <VoidBillingModal billing={modal === 'void' ? billing : null} onCancel={() => setModal(null)} onConfirm={handleVoid} />
      <RefundModal billing={modal === 'refund' ? billing : null} onCancel={() => setModal(null)} onConfirm={handleRefund} />
    </>
  );
};
export default BillingProfilePage;