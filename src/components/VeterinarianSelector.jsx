import { useState, useEffect } from 'react';
import api from '../services/api';

const VeterinarianSelector = ({ value, onChange, label = 'Veterinarian' }) => {
  const [vets, setVets] = useState([]);

  useEffect(() => {
    // Reuses existing /api/auth or a users listing — assumes a lightweight endpoint exists
    api.get('/users?role=VETERINARIAN').then((res) => setVets(res.data.data?.users || [])).catch(() => setVets([]));
  }, []);

  return (
    <div>
      <label className="label-text text-sm">{label}</label>
      <select className="select select-bordered w-full" value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">Unassigned</option>
        {vets.map((v) => <option key={v._id} value={v._id}>{v.name}</option>)}
      </select>
    </div>
  );
};
export default VeterinarianSelector;