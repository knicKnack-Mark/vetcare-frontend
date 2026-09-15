import { PawPrint } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <PawPrint className="text-primary" size={28} />
            <h2 className="card-title text-2xl">VetCare</h2>
          </div>

          {error && (
            <div className="alert alert-error text-sm py-2 mb-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="form-control">
              <span className="label-text mb-1">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
                placeholder="you@vetcare.com"
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full"
                placeholder="••••••••"
              />
            </label>

            <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;