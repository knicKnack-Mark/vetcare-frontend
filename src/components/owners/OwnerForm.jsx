import { useState } from 'react';

const emptyForm = {
  firstName: '', middleName: '', lastName: '', suffix: '',
  mobileNumber: '', email: '', alternateContactNumber: '', preferredContactMethod: 'sms',
  address: { houseStreet: '', barangay: '', municipality: '', province: '', zipCode: '' },
  notes: '',
};

const OwnerForm = ({ initialData, onSubmit, submitLabel = 'Save Owner' }) => {
  const [form, setForm] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const updateAddress = (field, value) => setForm((f) => ({ ...f, address: { ...f.address, [field]: value } }));

  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = 'First name is required';
    if (!form.lastName) errs.lastName = 'Last name is required';
    if (!/^09\d{9}$/.test(form.mobileNumber)) errs.mobileNumber = 'Enter a valid PH mobile number (e.g. 09171234567)';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.address.municipality) errs.municipality = 'Municipality is required';
    if (!form.address.province) errs.province = 'Province is required';
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
      {/* Personal Information */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="label-text text-sm">First Name *</label>
              <input className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
              {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="label-text text-sm">Middle Name</label>
              <input className="input input-bordered w-full" value={form.middleName} onChange={(e) => update('middleName', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Last Name *</label>
              <input className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`} value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
              {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="label-text text-sm">Suffix</label>
              <input className="input input-bordered w-full" value={form.suffix} onChange={(e) => update('suffix', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="label-text text-sm">Mobile Number *</label>
              <input className={`input input-bordered w-full ${errors.mobileNumber ? 'input-error' : ''}`} value={form.mobileNumber} onChange={(e) => update('mobileNumber', e.target.value)} placeholder="09171234567" />
              {errors.mobileNumber && <p className="text-error text-xs mt-1">{errors.mobileNumber}</p>}
            </div>
            <div>
              <label className="label-text text-sm">Email</label>
              <input className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} value={form.email} onChange={(e) => update('email', e.target.value)} />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label-text text-sm">Alternate Contact Number</label>
              <input className="input input-bordered w-full" value={form.alternateContactNumber} onChange={(e) => update('alternateContactNumber', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Preferred Contact Method</label>
              <select className="select select-bordered w-full" value={form.preferredContactMethod} onChange={(e) => update('preferredContactMethod', e.target.value)}>
                <option value="sms">SMS</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="sm:col-span-2">
              <label className="label-text text-sm">House / Street</label>
              <input className="input input-bordered w-full" value={form.address.houseStreet} onChange={(e) => updateAddress('houseStreet', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Barangay</label>
              <input className="input input-bordered w-full" value={form.address.barangay} onChange={(e) => updateAddress('barangay', e.target.value)} />
            </div>
            <div>
              <label className="label-text text-sm">Municipality / City *</label>
              <input className={`input input-bordered w-full ${errors.municipality ? 'input-error' : ''}`} value={form.address.municipality} onChange={(e) => updateAddress('municipality', e.target.value)} />
              {errors.municipality && <p className="text-error text-xs mt-1">{errors.municipality}</p>}
            </div>
            <div>
              <label className="label-text text-sm">Province *</label>
              <input className={`input input-bordered w-full ${errors.province ? 'input-error' : ''}`} value={form.address.province} onChange={(e) => updateAddress('province', e.target.value)} />
              {errors.province && <p className="text-error text-xs mt-1">{errors.province}</p>}
            </div>
            <div>
              <label className="label-text text-sm">ZIP Code</label>
              <input className="input input-bordered w-full" value={form.address.zipCode} onChange={(e) => updateAddress('zipCode', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">Additional Information</h2>
          <textarea className="textarea textarea-bordered w-full mt-2" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Notes about this owner..." />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="loading loading-spinner loading-sm" /> : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default OwnerForm;