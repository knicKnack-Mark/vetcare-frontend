const OwnerFilters = ({
  statusFilter, setStatusFilter,
  municipality, setMunicipality,
  province, setProvince,
  contactMethod, setContactMethod,
  onReset,
}) => (
  <div className="flex flex-wrap items-end gap-3">
    <div className="flex flex-col gap-1">
      <label className="text-xs opacity-60">Status</label>
      <select className="select select-bordered select-sm w-32" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="all">All</option>
      </select>
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-xs opacity-60">Municipality</label>
      <input
        className="input input-bordered input-sm w-36"
        placeholder="Any"
        value={municipality}
        onChange={(e) => setMunicipality(e.target.value)}
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-xs opacity-60">Province</label>
      <input
        className="input input-bordered input-sm w-32"
        placeholder="Any"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-xs opacity-60">Contact Method</label>
      <select className="select select-bordered select-sm w-36" value={contactMethod} onChange={(e) => setContactMethod(e.target.value)}>
        <option value="">Any</option>
        <option value="sms">SMS</option>
        <option value="call">Call</option>
        <option value="email">Email</option>
      </select>
    </div>

    <button onClick={onReset} className="btn btn-ghost btn-sm">Reset</button>
  </div>
);

export default OwnerFilters;