const InvoicePreview = ({ billing }) => {
  if (!billing) return null;

  return (
    <div className="hidden print:block p-10 text-black bg-white" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">🐾 VetCare Clinic</h1>
          <p className="text-sm">Purok 9, Sogod, Bacacay, Albay</p>
          <p className="text-sm">Phone: (052) 123-4567</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">INVOICE</h2>
          <p className="text-sm">{billing.invoiceNumber}</p>
          <p className="text-sm">{billing.issuedAt ? new Date(billing.issuedAt).toLocaleDateString() : new Date(billing.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <p className="text-xs font-bold uppercase mb-1">Bill To</p>
          <p className="text-sm">{billing.owner?.firstName} {billing.owner?.lastName}</p>
          <p className="text-sm">{billing.owner?.mobileNumber}</p>
          <p className="text-sm">{billing.owner?.email}</p>
        </div>
        {billing.pet && (
          <div>
            <p className="text-xs font-bold uppercase mb-1">Patient</p>
            <p className="text-sm">{billing.pet?.name}</p>
          </div>
        )}
      </div>

      <table className="w-full text-sm mb-6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr className="border-b-2 border-black text-left">
            <th className="py-1">Description</th><th className="py-1">Qty</th><th className="py-1">Unit Price</th><th className="py-1">Discount</th><th className="py-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {billing.items.map((item, i) => (
            <tr key={i} className="border-b border-gray-300">
              <td className="py-1">{item.name}</td><td className="py-1">{item.quantity} {item.unit}</td><td className="py-1">₱{item.unitPrice}</td><td className="py-1">₱{item.discount}</td><td className="py-1 text-right">₱{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 text-sm space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>₱{billing.subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-₱{billing.discountAmount.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₱{billing.taxAmount.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold border-t border-black pt-1"><span>Total</span><span>₱{billing.totalAmount.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Amount Paid</span><span>₱{billing.amountPaid.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold"><span>Balance Due</span><span>₱{billing.balance.toLocaleString()}</span></div>
        </div>
      </div>

      {billing.notes && <p className="text-xs mt-6"><strong>Notes:</strong> {billing.notes}</p>}
      <p className="text-xs text-center mt-10 text-gray-500">Thank you for trusting VetCare with your pet's health.</p>
    </div>
  );
};
export default InvoicePreview;