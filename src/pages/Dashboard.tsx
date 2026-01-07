import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="dashboard">
      <main className="main">
        <header className="topbar">
          <div><h2>Dashboard</h2></div>
          <div><button className="btn btn-secondary" onClick={() => logout()}><LogOut />Salir</button></div>
        </header>
        <section className="content">
          <div className="card">
            <h3>Gestor de Dotación CL</h3>
            <p>Usuario: {user?.email}</p>
            <p>Sistema funcionando correctamente.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
