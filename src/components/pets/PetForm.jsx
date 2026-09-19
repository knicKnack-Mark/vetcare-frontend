import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { ownerService } from '../../services/ownerService';

const emptyForm = {
  name: '', petType: 'Dog', breed: '', sex: 'Male', birthDate: '', color: '', weight: '',
  owner: '', allergies: '', existingConditions: '', medicalNotes: '',
};

const PetForm = ({ initialData, onSubmit, submitLabel = 'Save Pet' }) => {
  const [form, setForm] = useState(initialData || emptyForm);
  const [ownerQuery, setOwnerQuery] = useState('');
  const [ownerResults, setOwnerResults] = useState([]);
  const [selectedOwnerName, setSelectedOwnerName] = useState(initialData?.ownerName || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const debouncedOwnerQuery = useDebounce(ownerQuery, 300);

  useEffect(() => {
    if (debouncedOwnerQuery.length < 2) { setOwnerResults([]); return; }
    ownerService.searchOwners(debouncedOwnerQuery).then((res) => setOwnerResults(res.data.matches));
  }, [debouncedOwnerQuery]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const selectOwner = (owner) => {
    update('owner', owner._id);
    setSelectedOwnerName(owner.name);
    setOwnerQuery('');
    setOwnerResults([]);
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Pet name is required';
    if (!form.owner) errs.owner = 'Please select a furparent';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Furparent</h2>
          {selectedOwnerName ? (
            <div className="flex items-center justify-between bg-base-200 rounded-lg p-3 mt-2">
              <span className="text-sm font-medium">{selectedOwnerName}</span>
              <button type="button" className="btn btn-ghost btn-xs" onClick={() => { setSelectedOwnerName(''); update('owner', ''); }}>Change</button>
            </div>
          ) : (
            <div className="relative mt-2">
              <input
                className={`input input-bordered w-full ${errors.owner ? 'input-error' : ''}`}
                placeholder="Search furparent by name or phone..."
                value={ownerQuery}
                onChange={(e) => setOwnerQuery(e.target.value)}
              />
              {errors.owner && <p className="text-error text-xs mt-1">{errors.owner}</p>}
              {ownerResults.length > 0 && (
                <ul className="absolute z-10 bg-base-100 border border-base-300 rounded-lg w-full mt-1 shadow-lg max-h-48 overflow-y-auto">
                  {ownerResults.map((o) => (
                    <li key={o._id} className="px-3 py-2 hover:bg-base-200 cursor-pointer text-sm" onClick={() => selectOwner(o)}>
                      {o.name} · {o.mobileNumber} · {o.petCount} pet(s)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Pet Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="label-text text-sm">Pet Name *</label>
              <input className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={(e) => update('name', e.target.value)} />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label-text text-sm">Pet Type *</label>
              <select className="select select-bordered w-full" value={form.petType} onChange={(e) => update('petType', e.target.value)}>
                {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text text-sm">Breed</label>
              <input className="input input-bordered w-full" value={form.breed} onChange={(e) => update('breed', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Sex *</label>
              <select className="select select-bordered w-full" value={form.sex} onChange={(e) => update('sex', e.target.value)}>
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <div>
              <label className="label-text text-sm">Birth Date</label>
              <input type="date" className="input input-bordered w-full" value={form.birthDate?.slice(0, 10) || ''} onChange={(e) => update('birthDate', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Color</label>
              <input className="input input-bordered w-full" value={form.color} onChange={(e) => update('color', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Weight (kg)</label>
              <input type="number" className="input input-bordered w-full" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Medical Information</h2>
          <div className="space-y-3 mt-2">
            <div>
              <label className="label-text text-sm">Allergies</label>
              <input className="input input-bordered w-full" value={form.allergies} onChange={(e) => update('allergies', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Existing Conditions</label>
              <input className="input input-bordered w-full" value={form.existingConditions} onChange={(e) => update('existingConditions', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Medical Notes</label>
              <textarea className="textarea textarea-bordered w-full" rows={3} value={form.medicalNotes} onChange={(e) => update('medicalNotes', e.target.value)} />
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

export default PetForm;