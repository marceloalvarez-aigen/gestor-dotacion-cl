import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CargaHoraria {
  docente_nombre: string;
  docente_apellido: string;
  asignatura_nombre: string;
  colegio_nombre: string;
  horas: number;
  periodo: string;
}

export default function Reportes() {
  const [cargaHoraria, setCargaHoraria] = useState<CargaHoraria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroDocente, setFiltroDocente] = useState('');
  const [filtroColegio, setFiltroColegio] = useState('');
  const [filtroAsignatura, setFiltroAsignatura] = useState('');

  useEffect(() => {
    fetchCargaHoraria();
  }, []);

  async function fetchCargaHoraria() {
    try {
      const { data, error } = await supabase
        .from('asignaciones')
        .select(`
          horas,
          periodo,
          docentes!inner(nombre, apellido),
          asignaturas!inner(nombre),
          colegios!inner(nombre)
        `);
      
      if (error) throw error;

      const formatted = data?.map((item: any) => ({
        docente_nombre: item.docentes.nombre,
        docente_apellido: item.docentes.apellido,
        asignatura_nombre: item.asignaturas.nombre,
        colegio_nombre: item.colegios.nombre,
        horas: item.horas,
        periodo: item.periodo
      })) || [];

      setCargaHoraria(formatted);
    } catch (error: any) {
      console.error('Error al cargar carga horaria:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const datosFiltrados = cargaHoraria.filter(item => {
    const matchDocente = `${item.docente_nombre} ${item.docente_apellido}`
      .toLowerCase()
      .includes(filtroDocente.toLowerCase());
    const matchColegio = item.colegio_nombre
      .toLowerCase()
      .includes(filtroColegio.toLowerCase());
    const matchAsignatura = item.asignatura_nombre
      .toLowerCase()
      .includes(filtroAsignatura.toLowerCase());
    
    return matchDocente && matchColegio && matchAsignatura;
  });

  const totalHoras = datosFiltrados.reduce((sum, item) => sum + item.horas, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reportes de Carga Horaria</h1>
      
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-4">Filtros:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Docente:</label>
            <input
              type="text"
              value={filtroDocente}
              onChange={(e) => setFiltroDocente(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Colegio:</label>
            <input
              type="text"
              value={filtroColegio}
              onChange={(e) => setFiltroColegio(e.target.value)}
              placeholder="Buscar por colegio..."
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Asignatura:</label>
            <input
              type="text"
              value={filtroAsignatura}
              onChange={(e) => setFiltroAsignatura(e.target.value)}
              placeholder="Buscar por asignatura..."
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-4">Cargando...</p>
      ) : (
        <>
          <div className="mb-4 p-4 bg-blue-50 rounded">
            <p className="font-semibold">Total de horas: {totalHoras} hrs</p>
            <p className="text-sm text-gray-600">Registros: {datosFiltrados.length}</p>
          </div>

          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Docente</th>
                  <th className="px-4 py-2 text-left">Asignatura</th>
                  <th className="px-4 py-2 text-left">Colegio</th>
                  <th className="px-4 py-2 text-left">Horas</th>
                  <th className="px-4 py-2 text-left">Periodo</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">
                      {item.docente_nombre} {item.docente_apellido}
                    </td>
                    <td className="px-4 py-2">{item.asignatura_nombre}</td>
                    <td className="px-4 py-2">{item.colegio_nombre}</td>
                    <td className="px-4 py-2 font-semibold">{item.horas}</td>
                    <td className="px-4 py-2">{item.periodo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {datosFiltrados.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No hay datos que coincidan con los filtros
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
