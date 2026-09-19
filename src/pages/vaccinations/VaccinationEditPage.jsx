import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { vaccinationService } from '../../services/vaccinationService';

const VACCINE_TYPES = ['Core Vaccine', 'Non-Core Vaccine', 'Puppy Vaccine', 'Kitten Vaccine', 'Annual Booster', 'Rabies', 'Other'];
const VACCINE_NAMES = ['5-in-1', '6-in-1', '8-in-1', '9-in-1', 'Rabies', 'Bordetella', 'Leptospirosis', 'FVRCP', 'FeLV', 'Other'];
const ROUTES = ['Subcutaneous', 'Intramuscular', 'Intranasal', 'Oral', 'Other'];
const REACTIONS = ['None', 'Mild swelling', 'Mild fever', 'Lethargy', 'Vomiting', 'Allergic reaction', 'Other'];

const VaccinationEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    vaccinationService.getById(id).then((res) => {
      const v = res.data.vaccination;
      setForm({
        vaccineType: v.vaccineType, vaccineName: v.vaccineName, manufacturer: v.manufacturer || '',
        batchNumber: v.batchNumber || '', lotNumber: v.lotNumber || '',
        expirationDate: v.expirationDate?.slice(0, 10) || '',
        administrationDate: v.administrationDate?.slice(0, 10) || '',
        nextDueDate: v.nextDueDate?.slice(0, 10) || '',
        dose: v.dose || '', route: v.route || 'Subcutaneous', administrationSite: v.administrationSite || '',
        reaction: v.reaction || 'None', notes: v.notes || '',
        petName: v.pet?.name,
      });
      setLoading(false);
    });
  }, [id]);

  const update = (f, val) => setForm((s) => ({ ...s, [f]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await vaccinationService.update(id, form);
      toast.success('Vaccination record updated');
      navigate(`/vaccinations/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update record');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="skeleton h-96 w-full" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Edit Vaccination Record</h1>
        <p className="text-sm opacity-60">{form.petName}</p>
      </div>

      <div className="card bg-base-100 shadow-sm"><div className="card-body">
        <h2 className="card-title text-base">Vaccine Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div><label className="label-text text-sm">Vaccine Type</label>
            <select className="select select-bordered w-full" value={form.vaccineType} onChange={(e) => update('vaccineType', e.target.value)}>
              {VACCINE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className="label-text text-sm">Vaccine Name</label>
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
          <div><label className="label-text text-sm">Administration Date</label><input type="date" className="input input-bordered w-full" value={form.administrationDate} onChange={(e) => update('administrationDate', e.target.value)} /></div>
          <div><label className="label-text text-sm">Next Due Date</label><input type="date" className="input input-bordered w-full" value={form.nextDueDate} onChange={(e) => update('nextDueDate', e.target.value)} /></div>
          <div><label className="label-text text-sm">Dose</label><input className="input input-bordered w-full" value={form.dose} onChange={(e) => update('dose', e.target.value)} /></div>
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
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Changes'}</button>
      </div>
    </form>
  );
};
export default VaccinationEditPage;