import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Edit3, FileText, Syringe, Stethoscope } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PetStatusBadge from '../../components/pets/PetStatusBadge';
import { petService } from '../../services/petService';
import { vaccinationService } from '../../services/vaccinationService';
import api from '../../services/api';

const Detail = ({ label, children }) => (
  <div><p className="text-xs opacity-60">{label}</p><p className="mt-1">{children}</p></div>
);

const RecordTable = ({ columns, rows, emptyMessage }) => (
  rows.length ? (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead><tr className="text-xs opacity-60">{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={row._id || index} className="hover">{columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  ) : <p className="text-sm opacity-60 py-4">{emptyMessage}</p>
);

const calculateAge = (birthDate) => {
  if (!birthDate) return '—';
  const years = (Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return years < 1 ? `${Math.round(years * 12)}mo` : `${Math.floor(years)}y`;
};

const PetProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      petService.getById(id),
      api.get(`/pets/${id}/vaccinations`).then((r) => r.data).catch(() => ({ data: { vaccinations: [] } })),
      api.get(`/pets/${id}/appointments`).then((r) => r.data).catch(() => ({ data: { appointments: [] } })),
    ])
      .then(([petRes, vacRes, apptRes]) => {
        setPet(petRes.data.pet);
        setVaccinations(vacRes.data.vaccinations || []);
        setAppointments(apptRes.data.appointments || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load pet'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="skeleton h-96 w-full" />;
  if (error) return <p className="text-error">{error}</p>;
  if (!pet) return <p>Pet not found.</p>;

  const vaccinationRows = vaccinations
    .filter((v) => v.status === 'administered')
    .map((v) => ({
      _id: v._id,
      date: new Date(v.administrationDate).toLocaleDateString(),
      vaccine: v.vaccineName,
      dose: v.dose || '—',
      veterinarian: v.veterinarian?.name || '—',
      nextDue: v.nextDueDate ? new Date(v.nextDueDate).toLocaleDateString() : '—',
      status: v.status,
    }));

  const nextDueDate = vaccinationRows.length
    ? vaccinationRows.reduce((soonest, v) => (!soonest || new Date(v.nextDue) < new Date(soonest) ? v.nextDue : soonest), null)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm btn-square" onClick={() => navigate('/pets')} aria-label="Back to pets"><ArrowLeft size={18} /></button>
          <div><h1 className="text-2xl font-bold">{pet.name}</h1><p className="text-sm opacity-60 font-mono">{pet._id}</p></div>
        </div>
        <button className="btn btn-primary btn-sm gap-2" onClick={() => navigate(`/pets/${id}/edit`)}><Edit3 size={16} /> Edit Pet</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="card bg-base-100 shadow-sm lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Patient details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              <Detail label="Pet ID"><span className="font-mono">{pet._id}</span></Detail>
              <Detail label="Type / Breed">{pet.petType} / {pet.breed || '—'}</Detail>
              <Detail label="Sex / Age">{pet.sex} / {calculateAge(pet.birthDate)}</Detail>
              <Detail label="Birth date">{pet.birthDate ? new Date(pet.birthDate).toLocaleDateString() : '—'}</Detail>
              <Detail label="Status"><span className={`badge ${pet.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>{pet.status}</span></Detail>
              <Detail label="Weight">{pet.weight ? `${pet.weight} kg` : '—'}</Detail>
            </div>
          </div>
        </section>

        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Furparent</h2>
            <div className="space-y-4 mt-2">
              <Detail label="Name"><Link to={`/owners/${pet.owner?._id}`} className="link link-primary">{pet.owner?.firstName} {pet.owner?.lastName}</Link></Detail>
              <Detail label="Contact">{pet.owner?.mobileNumber}</Detail>
              <Detail label="Last visit">{appointments.find((a) => a.status === 'completed')?.date ? new Date(appointments.find((a) => a.status === 'completed').date).toLocaleDateString() : 'No visit yet'}</Detail>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-sm"><div className="card-body p-4">
          <div className="flex items-center gap-2"><Syringe size={17} className="text-primary" /><p className="text-sm font-medium">Vaccination</p></div>
          <PetStatusBadge status={nextDueDate && new Date(nextDueDate) < new Date() ? 'overdue' : vaccinationRows.length ? 'up_to_date' : 'due_soon'} />
        </div></div>
        <div className="card bg-base-100 shadow-sm"><div className="card-body p-4">
          <div className="flex items-center gap-2"><CalendarDays size={17} className="text-secondary" /><p className="text-sm font-medium">Deworming</p></div>
          <PetStatusBadge status="up_to_date" />
        </div></div>
        <div className="card bg-base-100 shadow-sm"><div className="card-body p-4">
          <div className="flex items-center gap-2"><Syringe size={17} className="text-warning" /><p className="text-sm font-medium">Anti-rabies</p></div>
          <PetStatusBadge status="up_to_date" />
        </div></div>
      </div>

      <section className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title gap-2"><Syringe size={19} /> Vaccination history</h2>
            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/vaccinations/create?pet=${id}`)}>Record Vaccination</button>
          </div>
          <RecordTable
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'vaccine', label: 'Vaccine' },
              { key: 'dose', label: 'Dose' },
              { key: 'veterinarian', label: 'Veterinarian' },
              { key: 'nextDue', label: 'Next Due' },
              { key: 'actions', label: '', render: (row) => <button className="btn btn-ghost btn-xs" onClick={() => navigate(`/vaccinations/${row._id}`)}>View</button> },
            ]}
            rows={vaccinationRows}
            emptyMessage="No vaccination records yet."
          />
        </div>
      </section>

      <section className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title gap-2"><CalendarDays size={19} /> Deworming history</h2>
          <RecordTable columns={[{ key: 'date', label: 'Date' }, { key: 'product', label: 'Product' }, { key: 'dosage', label: 'Dosage' }, { key: 'veterinarian', label: 'Veterinarian' }]} rows={[]} emptyMessage="No deworming records yet — module coming soon." />
        </div>
      </section>

      <section className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title gap-2"><Stethoscope size={19} /> Appointment history</h2>
          <RecordTable
            columns={[
              { key: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
              { key: 'type', label: 'Type', render: (row) => row.appointmentType },
              { key: 'time', label: 'Time', render: (row) => row.startTime },
              { key: 'status', label: 'Status', render: (row) => <span className="badge badge-sm">{row.status}</span> },
              { key: 'actions', label: '', render: (row) => <button className="btn btn-ghost btn-xs" onClick={() => navigate(`/appointments/${row._id}`)}>View</button> },
            ]}
            rows={appointments}
            emptyMessage="No appointments yet."
          />
        </div>
      </section>

      <section className="card bg-base-100 shadow-sm"><div className="card-body"><h2 className="card-title gap-2"><FileText size={19} /> Medical record summary</h2><p className="text-sm opacity-70">This profile consolidates the patient identity, furparent details, vaccination, deworming, and appointment records.</p></div></section>
    </div>
  );
};

export default PetProfilePage;