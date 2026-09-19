import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { petService } from '../../services/petService';

const PetSelector = ({ value, onChange, error }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); return; }
    petService.getPets({ search: debouncedQuery, limit: 8 }).then((res) => setResults(res.data.pets));
  }, [debouncedQuery]);

  const selectPet = (pet) => {
    setSelected(pet);
    setQuery('');
    setResults([]);
    onChange({ petId: pet._id, ownerId: pet.owner._id, pet, owner: pet.owner });
  };

  return (
    <div className="relative">
      {selected ? (
        <div className="flex items-center justify-between bg-base-200 rounded-lg p-3">
          <div>
            <p className="text-sm font-medium">{selected.name} — {selected.breed || selected.petType}</p>
            <p className="text-xs opacity-60">Owner: {selected.owner.firstName} {selected.owner.lastName} · {selected.owner.mobileNumber}</p>
          </div>
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => { setSelected(null); onChange({ petId: '', ownerId: '' }); }}>Change</button>
        </div>
      ) : (
        <>
          <input
            className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
            placeholder="Search pet by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {error && <p className="text-error text-xs mt-1">{error}</p>}
          {results.length > 0 && (
            <ul className="absolute z-10 bg-base-100 border border-base-300 rounded-lg w-full mt-1 shadow-lg max-h-56 overflow-y-auto">
              {results.map((p) => (
                <li key={p._id} className="px-3 py-2 hover:bg-base-200 cursor-pointer text-sm" onClick={() => selectPet(p)}>
                  {p.name} · {p.petType}/{p.breed} · owner: {p.owner?.firstName} {p.owner?.lastName}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default PetSelector;