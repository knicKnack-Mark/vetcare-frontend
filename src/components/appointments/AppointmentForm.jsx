import { useState } from 'react';
import PetSelector from './PetSelector';
import VeterinarianSelector from '../VeterinarianSelector';
const APPOINTMENT_TYPES = ['Checkup', 'Vaccination', 'Deworming', 'Anti-Rabies', 'Follow-up', 'Consultation', 'Surgery', 'Laboratory', 'Grooming', 'Emergency', 'Other'];

const emptyForm = {
  petId: '', ownerId: '', appointmentType: 'Checkup', service: '', title: '',
  date: '', startTime: '', endTime: '', reason: '', notes: '', priority: 'normal',
};

const AppointmentForm = ({ initialData, onSubmit, submitLabel = 'Schedule Appointment' }) => {
  const [form, setForm] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [conflictMsg, setConflictMsg] = useState('');

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handlePetSelect = ({ petId, ownerId }) => setForm((f) => ({ ...f, petId, ownerId }));

  const validate = () => {
    const errs = {};
    if (!form.petId) errs.pet = 'Please select a pet';
    if (!form.date) errs.date = 'Date is required';
    if (!form.startTime) errs.startTime = 'Start time is required';
    if (!form.endTime) errs.endTime = 'End time is required';
    if (form.startTime && form.endTime && form.startTime >= form.endTime) errs.endTime = 'End time must be after start time';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConflictMsg('');
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({
        pet: form.petId,
        owner: form.ownerId,
        appointmentType: form.appointmentType,
        service: form.service,
        title: form.title || `${form.appointmentType} appointment`,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        reason: form.reason,
        notes: form.notes,
        priority: form.priority,
      });
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictMsg(err.response.data.message || 'The selected time conflicts with another appointment.');
      } else {
        throw err;
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {conflictMsg && <div className="alert alert-error text-sm">{conflictMsg}</div>}

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Pet</h2>
          <PetSelector value={form.petId} onChange={handlePetSelect} error={errors.pet} />
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Appointment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="label-text text-sm">Appointment Type *</label>
              <select className="select select-bordered w-full" value={form.appointmentType} onChange={(e) => update('appointmentType', e.target.value)}>
                {APPOINTMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text text-sm">Service</label>
              <input className="input input-bordered w-full" value={form.service} onChange={(e) => update('service', e.target.value)} placeholder="e.g. 5-in-1 Vaccine" />
            </div>
            <div>
              <label className="label-text text-sm">Date *</label>
              <input type="date" className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`} value={form.date} onChange={(e) => update('date', e.target.value)} />
              {errors.date && <p className="text-error text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="label-text text-sm">Priority</label>
              <select className="select select-bordered w-full" value={form.priority} onChange={(e) => update('priority', e.target.value)}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <VeterinarianSelector value={form.veterinarian} onChange={(v) => update('veterinarian', v)} />

            <div>
              <label className="label-text text-sm">Start Time *</label>
              <input type="time" className={`input input-bordered w-full ${errors.startTime ? 'input-error' : ''}`} value={form.startTime} onChange={(e) => update('startTime', e.target.value)} />
              {errors.startTime && <p className="text-error text-xs mt-1">{errors.startTime}</p>}
            </div>
            <div>
              <label className="label-text text-sm">End Time *</label>
              <input type="time" className={`input input-bordered w-full ${errors.endTime ? 'input-error' : ''}`} value={form.endTime} onChange={(e) => update('endTime', e.target.value)} />
              {errors.endTime && <p className="text-error text-xs mt-1">{errors.endTime}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Reason & Notes</h2>
          <div className="space-y-3 mt-2">
            <div>
              <label className="label-text text-sm">Reason</label>
              <input className="input input-bordered w-full" value={form.reason} onChange={(e) => update('reason', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Notes</label>
              <textarea className="textarea textarea-bordered w-full" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="loading loading-spinner loading-sm" /> : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;