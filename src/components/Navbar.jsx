const Navbar = ({ user }) => {
  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-sm leading-none">{user?.name}</p>
          <p className="text-xs opacity-60">{user?.role}</p>
        </div>
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-9">
            <span className="text-sm">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;