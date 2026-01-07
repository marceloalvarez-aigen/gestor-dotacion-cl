import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

export interface DocenteData {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidad?: string;
}

export interface AsignaturaData {
  codigo: string;
  nombre: string;
  nivel: string;
  horas_semanales: number;
}

export interface AsignacionData {
  docente_rut: string;
  asignatura_codigo: string;
  colegio_id: string;
  horas: number;
  periodo: string;
}

export async function loadExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(file);
  });
}

export async function saveDocentesToDB(docentes: DocenteData[]) {
  const { data, error } = await supabase
    .from('docentes')
    .upsert(docentes, { onConflict: 'rut' });
  
  if (error) throw error;
  return data;
}

export async function saveAsignaturaToDB(asignaturas: AsignaturaData[]) {
  const { data, error } = await supabase
    .from('asignaturas')
    .upsert(asignaturas, { onConflict: 'codigo' });
  
  if (error) throw error;
  return data;
}

export async function saveAsignacionesToDB(asignaciones: AsignacionData[]) {
  const { data, error } = await supabase
    .from('asignaciones')
    .insert(asignaciones);
  
  if (error) throw error;
  return data;
}
