import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Funcionario {
  id: number;
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  telefono?: string;
}

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    telefono: ''
  });

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  async function fetchFuncionarios() {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('apellido_paterno', { ascending: true });
      
      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error: any) {
      setMessage('Error al cargar funcionarios: ' + error.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('funcionarios')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        setMessage('✓ Funcionario actualizado exitosamente');
      } else {
        // Create
        const { error } = await supabase
          .from('funcionarios')
          .insert([formData]);
        
        if (error) throw error;
        setMessage('✓ Funcionario creado exitosamente');
      }

      await fetchFuncionarios();
      handleCloseModal();
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Está seguro de eliminar este funcionario?')) return;

    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMessage('✓ Funcionario eliminado exitosamente');
      await fetchFuncionarios();
    } catch (error: any) {
      setMessage('Error al eliminar: ' + error.message);
    }
  }

  function handleEdit(funcionario: Funcionario) {
    setEditingId(funcionario.id);
    setFormData({
      rut: funcionario.rut,
      nombre: funcionario.nombre,
      apellido_paterno: funcionario.apellido_paterno,
      apellido_materno: funcionario.apellido_materno,
      email: funcionario.email,
      telefono: funcionario.telefono || ''
    });
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      rut: '',
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      email: '',
      telefono: ''
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Funcionarios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Nuevo Funcionario
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.startsWith('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RUT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apellidos</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{funcionario.rut}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{funcionario.nombre}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {funcionario.apellido_paterno} {funcionario.apellido_materno}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{funcionario.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{funcionario.telefono || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(funcionario)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(funcionario.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {funcionarios.length === 0 && (
          <p className="text-center py-8 text-gray-500">No hay funcionarios registrados</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Funcionario' : 'Nuevo Funcionario'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">RUT *</label>
                <input
                  type="text"
                  required
                  value={formData.rut}
                  onChange={(e) => setFormData({...formData, rut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="12345678-9"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Apellido Paterno *</label>
                <input
                  type="text"
                  required
                  value={formData.apellido_paterno}
                  onChange={(e) => setFormData({...formData, apellido_paterno: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Apellido Materno *</label>
                <input
                  type="text"
                  required
                  value={formData.apellido_materno}
                  onChange={(e) => setFormData({...formData, apellido_materno: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
