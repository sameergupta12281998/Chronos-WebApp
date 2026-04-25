import type { PropsWithChildren } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../features/auth/store/authStore';
import { getGatewayHealth } from '../../api/health.api';
import { QUERY_KEYS } from '../../lib/constants';
import { StatusBadge } from '../common/StatusBadge';

export const AppShell = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const username = useAuthStore((state) => state.username);
  const clearSession = useAuthStore((state) => state.clearSession);

  const healthQuery = useQuery({
    queryKey: [QUERY_KEYS.health],
    queryFn: getGatewayHealth,
    refetchInterval: 30_000,
  });

  const signOut = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          Chronos
        </Link>
        <nav className="app-nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/notifications">Notifications</NavLink>
        </nav>
        <div className="header-meta">
          {healthQuery.data?.status ? <StatusBadge value={healthQuery.data.status} /> : null}
          <span>{username}</span>
          <button type="button" className="ghost-btn" onClick={signOut}>
            Logout
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};
