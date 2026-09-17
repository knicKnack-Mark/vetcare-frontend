import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PetCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/pets');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button className="btn btn-ghost btn-sm btn-square" onClick={() => navigate('/pets')} aria-label="Back to pets"><ArrowLeft size={18} /></button>
        <div><h1 className="text-2xl font-bold">Add New Pet</h1><p className="text-sm opacity-60">Create a patient record for your clinic.</p></div>
      </div>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm">
        <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="form-control"><span className="label-text mb-1">Pet name</span><input required name="name" className="input input-bordered" /></label>
          <label className="form-control"><span className="label-text mb-1">Type</span><select name="type" className="select select-bordered"><option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Other</option></select></label>
          <label className="form-control"><span className="label-text mb-1">Breed</span><input required name="breed" className="input input-bordered" /></label>
          <label className="form-control"><span className="label-text mb-1">Sex</span><select name="sex" className="select select-bordered"><option>Male</option><option>Female</option></select></label>
          <label className="form-control"><span className="label-text mb-1">Birth date</span><input required type="date" name="birthDate" className="input input-bordered" /></label>
          <label className="form-control"><span className="label-text mb-1">Furparent name</span><input required name="furparent" className="input input-bordered" /></label>
          <label className="form-control sm:col-span-2"><span className="label-text mb-1">Contact number</span><input required name="contact" className="input input-bordered" /></label>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2"><button type="button" className="btn btn-ghost" onClick={() => navigate('/pets')}>Cancel</button><button className="btn btn-primary gap-2"><Save size={16} /> Save Pet</button></div>
        </div>
      </form>
    </div>
  );
};

export default PetCreatePage;
