const Pagination = ({ page, totalPages, onPageChange, total, limit }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs opacity-60">
        Showing {from}–{to} of {total}
      </p>
      <div className="join">
        <button className="join-item btn btn-sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          «
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`join-item btn btn-sm ${p === page ? 'btn-active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button className="join-item btn btn-sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;