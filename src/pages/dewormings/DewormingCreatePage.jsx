import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PetSelector from '../../components/appointments/PetSelector';
import { dewormingService } from '../../services/dewormingService';

const DewormingCreatePage = () => {
  const navigate = useNavigate();
  const [petId, setPetId] = useState('');
  const [form, setForm] = useState({ medicineName: '', manufacturer: '', batchNumber: '', administrationDate: '', nextDueDate: '', weight: '', dosage: '', route: 'Oral', reaction: 'None', notes: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (f, v) => setForm((s) => ({ ...s, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!petId) errs.pet = 'Please select a pet';
    if (!form.medicineName) errs.medicineName = 'Medicine name is required';
    if (!form.administrationDate) errs.administrationDate = 'Administration date is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const res = await dewormingService.create({ pet: petId, ...form });
      toast.success('Deworming recorded');
      navigate(`/dewormings/${res.data.deworming._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record deworming');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold">Record Deworming</h1><p className="text-sm opacity-60">Log a deworming treatment.</p></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Pet</h2>
        <PetSelector onChange={({ petId: id }) => setPetId(id)} error={errors.pet} />
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Treatment Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Medicine Name *</label><input className={`input input-bordered w-full ${errors.medicineName ? 'input-error' : ''}`} value={form.medicineName} onChange={(e) => update('medicineName', e.target.value)} />{errors.medicineName && <p className="text-error text-xs mt-1">{errors.medicineName}</p>}</div>
          <div><label className="label-text text-sm">Manufacturer</label><input className="input input-bordered w-full" value={form.manufacturer} onChange={(e) => update('manufacturer', e.target.value)} /></div>
          <div><label className="label-text text-sm">Batch Number</label><input className="input input-bordered w-full" value={form.batchNumber} onChange={(e) => update('batchNumber', e.target.value)} /></div>
          <div><label className="label-text text-sm">Administration Date *</label><input type="date" className={`input input-bordered w-full ${errors.administrationDate ? 'input-error' : ''}`} value={form.administrationDate} onChange={(e) => update('administrationDate', e.target.value)} />{errors.administrationDate && <p className="text-error text-xs mt-1">{errors.administrationDate}</p>}</div>
          <div><label className="label-text text-sm">Next Due Date</label><input type="date" className="input input-bordered w-full" value={form.nextDueDate} onChange={(e) => update('nextDueDate', e.target.value)} /></div>
          <div><label className="label-text text-sm">Pet Weight (kg)</label><input type="number" className="input input-bordered w-full" value={form.weight} onChange={(e) => update('weight', e.target.value)} /></div>
          <div><label className="label-text text-sm">Dosage</label><input className="input input-bordered w-full" value={form.dosage} onChange={(e) => update('dosage', e.target.value)} /></div>
          <div><label className="label-text text-sm">Route</label>
            <select className="select select-bordered w-full" value={form.route} onChange={(e) => update('route', e.target.value)}>
              {['Oral', 'Topical', 'Injectable', 'Other'].map((r) => <option key={r}>{r}</option>)}
            </select></div>
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Reaction & Notes</h2>
        <div className="space-y-3 mt-2">
          <div><label className="label-text text-sm">Reaction</label>
            <select className="select select-bordered w-full" value={form.reaction} onChange={(e) => update('reaction', e.target.value)}>
              {['None', 'Vomiting', 'Diarrhea', 'Lethargy', 'Other'].map((r) => <option key={r}>{r}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} /></div>
        </div>
      </div></div>

      <div className="flex justify-end"><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Record'}</button></div>
    </form>
  );
};
export default DewormingCreatePage;