import { useState } from 'react';

const CancelAppointmentModal = ({ appointment, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  if (!appointment) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Cancel Appointment?</h3>
        <div className="text-sm py-3 space-y-1">
          <p><span className="opacity-60">Pet:</span> {appointment.pet?.name}</p>
          <p><span className="opacity-60">Date:</span> {new Date(appointment.date).toLocaleDateString()}</p>
          <p><span className="opacity-60">Time:</span> {appointment.startTime}</p>
        </div>
        <label className="label-text text-sm">Reason</label>
        <textarea className="textarea textarea-bordered w-full" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Owner requested cancellation" />
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Keep Appointment</button>
          <button className="btn btn-error" onClick={() => onConfirm(reason)}>Cancel Appointment</button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;