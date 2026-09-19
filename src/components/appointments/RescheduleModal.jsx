import { useState } from 'react';

const RescheduleModal = ({ appointment, onConfirm, onCancel }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!appointment) return null;

  const handleSubmit = async () => {
    if (!date || !startTime || !endTime) { setError('All fields are required'); return; }
    setError('');
    try {
      await onConfirm({ date, startTime, endTime, reason });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reschedule');
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reschedule Appointment</h3>
        <div className="text-sm py-2 opacity-70">
          Current: {new Date(appointment.date).toLocaleDateString()} · {appointment.startTime}–{appointment.endTime}
        </div>
        {error && <div className="alert alert-error text-sm py-2">{error}</div>}
        <div className="space-y-3 mt-2">
          <div>
            <label className="label-text text-sm">New Date</label>
            <input type="date" className="input input-bordered w-full" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text text-sm">Start Time</label>
              <input type="time" className="input input-bordered w-full" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">End Time</label>
              <input type="time" className="input input-bordered w-full" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label-text text-sm">Reason</label>
            <textarea className="textarea textarea-bordered w-full" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Reschedule</button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;