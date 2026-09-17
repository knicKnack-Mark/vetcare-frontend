import { Search } from 'lucide-react';

const PetSearch = ({ value, onChange }) => (
  <label className="input input-bordered flex items-center gap-2 w-full max-w-md">
    <Search size={16} className="opacity-50" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by pet name, owner, phone number, or Pet ID..."
      className="grow"
    />
  </label>
);

export default PetSearch;