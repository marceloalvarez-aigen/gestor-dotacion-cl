import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, user, error, clearError, demoCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch {
      // Error ya manejado por el contexto
    } finally {
      setSubmitting(false);
    }
  };

  const useDemo = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <ShieldCheck aria-hidden />
          </div>
          <div>
            <h1>Gestor de Dotación CL</h1>
            <p>Gestión de dotación docente - Ley 20.903</p>
          </div>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden>
                <Mail />
              </span>
              <input
                id="email"
                type="email"
                placeholder="nombre@institucion.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || submitting}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden>
                <Lock />
              </span>
              <input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || submitting}
              />
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading || submitting}>
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>

          <button className="btn btn-secondary" type="button" onClick={useDemo} disabled={loading || submitting}>
            Usar usuario demo
          </button>

          <div className="helper">
            <strong>Demo:</strong> {demoCredentials.email} / {demoCredentials.password}
          </div>
        </form>
      </div>
    </div>
  );
}
