const PetFilters = ({ typeFilter, setTypeFilter, sexFilter, setSexFilter, breedFilter, setBreedFilter, medicalStatusFilter, setMedicalStatusFilter, statusFilter, setStatusFilter, onReset }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap gap-2 w-full lg:w-auto lg:shrink-0">
    <select className="select select-bordered select-sm w-full lg:w-auto" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
      {['All Types', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((t) => (
        <option key={t}>{t}</option>
      ))}
    </select>

    <select className="select select-bordered select-sm w-full lg:w-auto" value={sexFilter} onChange={(e) => setSexFilter(e.target.value)}>
      {['Gender', 'Male', 'Female'].map((sex) => <option key={sex}>{sex}</option>)}
    </select>

    <select className="select select-bordered select-sm w-full lg:w-auto" value={breedFilter} onChange={(e) => setBreedFilter(e.target.value)}>
      {['All Breeds', 'Golden Retriever', 'Persian', 'Poodle', 'Shih Tzu', 'Siamese'].map((breed) => <option key={breed}>{breed}</option>)}
    </select>

    <select className="select select-bordered select-sm w-full lg:w-auto" value={medicalStatusFilter} onChange={(e) => setMedicalStatusFilter(e.target.value)}>
      {['All Medical Statuses', 'healthy', 'under_treatment', 'recovered', 'critical'].map((status) => <option key={status} value={status}>{status === 'All Medical Statuses' ? status : status.replace('_', ' ')}</option>)}
    </select>

    <select className="select select-bordered select-sm w-full lg:w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
      {['Active', 'Archived', 'All'].map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>

    <button onClick={onReset} className="btn btn-ghost btn-sm">
      Reset Filters
    </button>
  </div>
);

export default PetFilters;