import { LogOut, Users, FileText, BarChart3, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Inicio' },
    { path: '/funcionarios', icon: Users, label: 'Funcionarios' },
    { path: '/docentes', icon: Users, label: 'Docentes' },
    { path: '/reportes', icon: BarChart3, label: 'Reportes' },
  ];

  const quickActions = [
    {
      title: 'Gestión de Funcionarios',
      description: 'Administrar funcionarios del establecimiento',
      icon: Users,
      path: '/funcionarios',
      color: '#3b82f6'
    },
    {
      title: 'Gestión de Docentes',
      description: 'Gestionar dotación docente según Ley 20.903',
      icon: Users,
      path: '/docentes',
      color: '#10b981'
    },
    {
      title: 'Reportes de Carga Horaria',
      description: 'Visualizar carga horaria por asignatura y colegio',
      icon: BarChart3,
      path: '/reportes',
      color: '#f59e0b'
    },
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Gestor Dotación CL</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="sidebar-item"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="btn btn-secondary btn-block" onClick={() => logout()}>
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1>Panel General</h1>
        </header>

        <section className="content">
          <div className="welcome-card">
            <h2>Bienvenido al Sistema de Gestión de Dotación</h2>
            <p>Sistema de gestión de dotación docente - Ley 20.903</p>
          </div>

          <div className="quick-actions">
            <h3>Acceso Rápido</h3>
            <div className="actions-grid">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.path}
                    className="action-card"
                    onClick={() => navigate(action.path)}
                    style={{ borderLeftColor: action.color }}
                  >
                    <div className="action-icon" style={{ color: action.color }}>
                      <Icon size={32} />
                    </div>
                    <div className="action-content">
                      <h4>{action.title}</h4>
                      <p>{action.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
