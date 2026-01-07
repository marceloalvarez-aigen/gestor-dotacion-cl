import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { loadExcelFile, saveDocentesToDB, DocenteData } from '../utils/dataLoader';

export default function Docentes() {
  const [docentes, setDocentes] = useState<DocenteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDocentes();
  }, []);

  async function fetchDocentes() {
    try {
      const { data, error } = await supabase
        .from('docentes')
        .select('*')
        .order('apellido', { ascending: true });
      
      if (error) throw error;
      setDocentes(data || []);
    } catch (error: any) {
      setMessage('Error al cargar docentes: ' + error.message);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      const data = await loadExcelFile(file);
      const docentesData: DocenteData[] = data.map((row: any) => ({
        rut: row.rut || row.RUT,
        nombre: row.nombre || row.Nombre,
        apellido: row.apellido || row.Apellido,
        email: row.email || row.Email,
        telefono: row.telefono || row.Telefono,
        especialidad: row.especialidad || row.Especialidad
      }));

      await saveDocentesToDB(docentesData);
      await fetchDocentes();
      setMessage(`✓ ${docentesData.length} docentes cargados exitosamente`);
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Docentes</h1>
      
      <div className="mb-6 p-4 bg-white rounded shadow">
        <label className="block mb-2 font-semibold">Cargar Docentes desde Excel:</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={loading}
          className="mb-2"
        />
        {message && (
          <p className={message.startsWith('✓') ? 'text-green-600' : 'text-red-600'}>
            {message}
          </p>
        )}
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">RUT</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Apellido</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Especialidad</th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((docente) => (
              <tr key={docente.rut} className="border-t">
                <td className="px-4 py-2">{docente.rut}</td>
                <td className="px-4 py-2">{docente.nombre}</td>
                <td className="px-4 py-2">{docente.apellido}</td>
                <td className="px-4 py-2">{docente.email}</td>
                <td className="px-4 py-2">{docente.especialidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {docentes.length === 0 && (
          <p className="text-center py-4 text-gray-500">No hay docentes registrados</p>
        )}
      </div>
    </div>
  );
}
