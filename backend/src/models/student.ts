import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Student {
  id?: number;
  name: string;
  email: string;
  student_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export const findAll = async (): Promise<Student[]> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM students');
  return rows as Student[];
};

export const findById = async (id: number): Promise<Student | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM students WHERE id = ?',
    [id]
  );
  
  if (rows.length === 0) {
    return null;
  }
  
  return rows[0] as Student;
};

export const create = async (student: Student): Promise<number> => {
  const { name, email, student_id } = student;
  
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO students (name, email, student_id) VALUES (?, ?, ?)',
    [name, email, student_id]
  );
  
  return result.insertId;
};

export const update = async (id: number, student: Student): Promise<boolean> => {
  const { name, email, student_id } = student;
  
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE students SET name = ?, email = ?, student_id = ? WHERE id = ?',
    [name, email, student_id, id]
  );
  
  return result.affectedRows > 0;
};

export const remove = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM students WHERE id = ?',
    [id]
  );
  
  return result.affectedRows > 0;
};
