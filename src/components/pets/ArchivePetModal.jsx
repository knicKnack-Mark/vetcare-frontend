const ArchivePetModal = ({ pet, onConfirm, onCancel }) => {
  if (!pet) return null;
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Archive Pet?</h3>
        <p className="py-4 text-sm">
          Are you sure you want to archive <strong>{pet.name}</strong>? The pet will no longer appear in the
          active pet list, but its medical history will be preserved.
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-error" onClick={onConfirm}>Archive Pet</button>
        </div>
      </div>
    </div>
  );
};

export default ArchivePetModal;