import { Search } from 'lucide-react';

const OwnerSearch = ({ value, onChange }) => (
  <label className="input input-bordered flex items-center gap-2 w-full max-w-md">
    <Search size={16} className="opacity-50" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search owners by name, phone, or email..."
      className="grow"
    />
  </label>
);

export default OwnerSearch;