const ReceiptPreview = ({ billing, payment }) => {
  if (!billing || !payment) return null;

  return (
    <div className="hidden print:block p-8 text-black bg-white mx-auto" style={{ width: '80mm' }}>
      <div className="text-center border-b border-dashed border-black pb-2 mb-2">
        <h1 className="text-lg font-bold">🐾 VetCare Clinic</h1>
        <p className="text-xs">Purok 9, Sogod, Bacacay, Albay</p>
        <p className="text-xs">(052) 123-4567</p>
      </div>

      <p className="text-xs text-center font-bold mb-2">OFFICIAL RECEIPT</p>
      <div className="text-xs space-y-0.5 mb-2">
        <p>Receipt #: {payment.paymentNumber}</p>
        <p>Invoice #: {billing.invoiceNumber}</p>
        <p>Date: {new Date(payment.paymentDate).toLocaleString()}</p>
        <p>Owner: {billing.owner?.firstName} {billing.owner?.lastName}</p>
        {billing.pet && <p>Pet: {billing.pet?.name}</p>}
      </div>

      <div className="border-t border-dashed border-black pt-2 text-xs space-y-0.5">
        <div className="flex justify-between"><span>Amount Paid</span><span>₱{payment.amount.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Method</span><span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span></div>
        {payment.referenceNumber && <div className="flex justify-between"><span>Reference</span><span>{payment.referenceNumber}</span></div>}
        <div className="flex justify-between"><span>Remaining Balance</span><span>₱{billing.balance.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Received By</span><span>{payment.receivedBy?.name}</span></div>
      </div>

      <p className="text-xs text-center mt-4">
        {billing.balance <= 0 ? 'PAID IN FULL' : 'PARTIAL PAYMENT — balance remains'}
      </p>
      <p className="text-xs text-center mt-2">Thank you!</p>
    </div>
  );
};
export default ReceiptPreview;