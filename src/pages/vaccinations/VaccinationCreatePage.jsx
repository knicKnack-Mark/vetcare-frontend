import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PetSelector from '../../components/appointments/PetSelector';
import { vaccinationService } from '../../services/vaccinationService';

const VACCINE_TYPES = ['Core Vaccine', 'Non-Core Vaccine', 'Puppy Vaccine', 'Kitten Vaccine', 'Annual Booster', 'Rabies', 'Other'];
const VACCINE_NAMES = ['5-in-1', '6-in-1', '8-in-1', '9-in-1', 'Rabies', 'Bordetella', 'Leptospirosis', 'FVRCP', 'FeLV', 'Other'];
const ROUTES = ['Subcutaneous', 'Intramuscular', 'Intranasal', 'Oral', 'Other'];
const REACTIONS = ['None', 'Mild swelling', 'Mild fever', 'Lethargy', 'Vomiting', 'Allergic reaction', 'Other'];

const VaccinationCreatePage = () => {
  const navigate = useNavigate();
  const [petId, setPetId] = useState('');
  const [form, setForm] = useState({
    vaccineType: 'Core Vaccine', vaccineName: '5-in-1', manufacturer: '', batchNumber: '', lotNumber: '', expirationDate: '',
    administrationDate: '', nextDueDate: '', dose: '', route: 'Subcutaneous', administrationSite: '', reaction: 'None', notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (f, v) => setForm((s) => ({ ...s, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!petId) errs.pet = 'Please select a pet';
    if (!form.administrationDate) errs.administrationDate = 'Administration date is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const res = await vaccinationService.create({ pet: petId, ...form });
      toast.success('Vaccination recorded');
      navigate(`/vaccinations/${res.data.vaccination._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record vaccination');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Record Vaccination</h1>
        <p className="text-sm opacity-60">Log a vaccine that was administered to a pet.</p>
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Pet</h2>
        <PetSelector onChange={({ petId: id }) => setPetId(id)} error={errors.pet} />
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Vaccine Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Vaccine Type *</label>
            <select className="select select-bordered w-full" value={form.vaccineType} onChange={(e) => update('vaccineType', e.target.value)}>
              {VACCINE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Vaccine Name *</label>
            <select className="select select-bordered w-full" value={form.vaccineName} onChange={(e) => update('vaccineName', e.target.value)}>
              {VACCINE_NAMES.map((n) => <option key={n}>{n}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Manufacturer</label><input className="input input-bordered w-full" value={form.manufacturer} onChange={(e) => update('manufacturer', e.target.value)} /></div>
          <div><label className="label-text text-sm">Batch Number</label><input className="input input-bordered w-full" value={form.batchNumber} onChange={(e) => update('batchNumber', e.target.value)} /></div>
          <div><label className="label-text text-sm">Lot Number</label><input className="input input-bordered w-full" value={form.lotNumber} onChange={(e) => update('lotNumber', e.target.value)} /></div>
          <div><label className="label-text text-sm">Expiration Date</label><input type="date" className="input input-bordered w-full" value={form.expirationDate} onChange={(e) => update('expirationDate', e.target.value)} /></div>
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Administration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Administration Date *</label>
            <input type="date" className={`input input-bordered w-full ${errors.administrationDate ? 'input-error' : ''}`} value={form.administrationDate} onChange={(e) => update('administrationDate', e.target.value)} />
            {errors.administrationDate && <p className="text-error text-xs mt-1">{errors.administrationDate}</p>}</div>
          <div><label className="label-text text-sm">Next Due Date</label><input type="date" className="input input-bordered w-full" value={form.nextDueDate} onChange={(e) => update('nextDueDate', e.target.value)} /></div>
          <div><label className="label-text text-sm">Dose</label><input className="input input-bordered w-full" value={form.dose} onChange={(e) => update('dose', e.target.value)} placeholder="e.g. 1ml" /></div>
          <div><label className="label-text text-sm">Route</label>
            <select className="select select-bordered w-full" value={form.route} onChange={(e) => update('route', e.target.value)}>
              {ROUTES.map((r) => <option key={r}>{r}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Administration Site</label><input className="input input-bordered w-full" value={form.administrationSite} onChange={(e) => update('administrationSite', e.target.value)} /></div>
        </div>
      </div></div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Reaction & Notes</h2>
        <div className="space-y-3 mt-2">
          <div><label className="label-text text-sm">Reaction</label>
            <select className="select select-bordered w-full" value={form.reaction} onChange={(e) => update('reaction', e.target.value)}>
              {REACTIONS.map((r) => <option key={r}>{r}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Notes</label><textarea className="textarea textarea-bordered w-full" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} /></div>
        </div>
      </div></div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Vaccination Record'}</button>
      </div>
    </form>
  );
};
export default VaccinationCreatePage;