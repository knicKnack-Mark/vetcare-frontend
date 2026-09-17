import { ArrowLeft, CalendarDays, Edit3, FileText, Syringe, Stethoscope } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PetStatusBadge from '../../components/pets/PetStatusBadge';
import { getDemoPetProfile } from '../../services/petService';

const Detail = ({ label, children }) => (
  <div><p className="text-xs opacity-60">{label}</p><p className="mt-1">{children}</p></div>
);

const RecordTable = ({ columns, rows, emptyMessage }) => (
  rows.length ? (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead><tr className="text-xs opacity-60">{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={`${row.date}-${index}`} className="hover">{columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  ) : <p className="text-sm opacity-60 py-4">{emptyMessage}</p>
);

const PetProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pet = getDemoPetProfile(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3"><button className="btn btn-ghost btn-sm btn-square" onClick={() => navigate('/pets')} aria-label="Back to pets"><ArrowLeft size={18} /></button><div><h1 className="text-2xl font-bold">{pet.name}</h1><p className="text-sm opacity-60 font-mono">{pet.id}</p></div></div>
        <button className="btn btn-primary btn-sm gap-2"><Edit3 size={16} /> Edit Pet</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="card bg-base-100 shadow-sm lg:col-span-2"><div className="card-body"><h2 className="card-title">Patient details</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2"><Detail label="Pet ID"><span className="font-mono">{pet.id}</span></Detail><Detail label="Type / Breed">{pet.type} / {pet.breed}</Detail><Detail label="Sex / Age">{pet.sex} / {pet.age}</Detail><Detail label="Birth date">{pet.birthDate}</Detail><Detail label="Status"><span className="badge badge-success">Active</span></Detail><Detail label="Medical status"><span className="badge badge-info capitalize">{pet.medicalStatus.replace('_', ' ')}</span></Detail></div></div></section>
        <section className="card bg-base-100 shadow-sm"><div className="card-body"><h2 className="card-title">Furparent</h2><div className="space-y-4 mt-2"><Detail label="Name">{pet.furparent.name}</Detail><Detail label="Contact">{pet.furparent.contact}</Detail><Detail label="Last visit">{pet.consultations[0].date}</Detail></div></div></section>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-sm"><div className="card-body p-4"><div className="flex items-center gap-2"><Syringe size={17} className="text-primary" /><p className="text-sm font-medium">Vaccination</p></div><PetStatusBadge status={pet.vaccinationStatus} /></div></div>
        <div className="card bg-base-100 shadow-sm"><div className="card-body p-4"><div className="flex items-center gap-2"><CalendarDays size={17} className="text-secondary" /><p className="text-sm font-medium">Deworming</p></div><PetStatusBadge status={pet.dewormingStatus} /></div></div>
        <div className="card bg-base-100 shadow-sm"><div className="card-body p-4"><div className="flex items-center gap-2"><Syringe size={17} className="text-warning" /><p className="text-sm font-medium">Anti-rabies</p></div><PetStatusBadge status={pet.antiRabiesStatus} /></div></div>
      </div>
      <section className="card bg-base-100 shadow-sm"><div className="card-body"><h2 className="card-title gap-2"><Syringe size={19} /> Vaccination history</h2><RecordTable columns={[{ key: 'date', label: 'Date' }, { key: 'vaccine', label: 'Vaccine' }, { key: 'dose', label: 'Dose' }, { key: 'veterinarian', label: 'Veterinarian' }, { key: 'status', label: 'Status', render: (row) => <span className="badge badge-success badge-sm">{row.status}</span> }]} rows={pet.vaccinationHistory} emptyMessage="No vaccination records yet." /></div></section>
      <section className="card bg-base-100 shadow-sm"><div className="card-body"><h2 className="card-title gap-2"><CalendarDays size={19} /> Deworming history</h2><RecordTable columns={[{ key: 'date', label: 'Date' }, { key: 'product', label: 'Product' }, { key: 'dosage', label: 'Dosage' }, { key: 'veterinarian', label: 'Veterinarian' }, { key: 'status', label: 'Status', render: (row) => <span className="badge badge-success badge-sm">{row.status}</span> }]} rows={pet.dewormingHistory} emptyMessage="No deworming records yet." /></div></section>
      <section className="card bg-base-100 shadow-sm"><div className="card-body"><h2 className="card-title gap-2"><Syringe size={19} /> Anti-rabies history</h2><RecordTable columns={[{ key: 'date', label: 'Date' }, { key: 'vaccine', label: 'Vaccine' }, { key: 'nextDue', label: 'Next due' }, { key: 'veterinarian', label: 'Veterinarian' }, { key: 'status', label: 'Status', render: (row) => <span className="badge badge-warning badge-sm">{row.status}</span> }]} rows={pet.antiRabiesHistory} emptyMessage="No anti-rabies records yet." /></div></section>
      <section className="card bg-base-100 shadow-sm"><div className="card-body"><h2 className="card-title gap-2"><Stethoscope size={19} /> Consultation history</h2><RecordTable columns={[{ key: 'date', label: 'Date' }, { key: 'reason', label: 'Reason' }, { key: 'diagnosis', label: 'Diagnosis' }, { key: 'veterinarian', label: 'Veterinarian' }]} rows={pet.consultations} emptyMessage="No consultation records yet." /></div></section>
      <section className="card bg-base-100 shadow-sm"><div className="card-body"><h2 className="card-title gap-2"><FileText size={19} /> Medical record summary</h2><p className="text-sm opacity-70">This profile consolidates the patient identity, furparent details, vaccination, deworming, anti-rabies, and consultation records. New clinical entries can be added from the corresponding record workflow.</p></div></section>
    </div>
  );
};

export default PetProfilePage;
