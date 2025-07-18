import { Request, Response } from 'express';
import * as StudentModel from '../models/student';

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await StudentModel.findAll();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const student = await StudentModel.findById(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, student_id } = req.body;
    
    if (!name || !email || !student_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newStudentId = await StudentModel.create({
      name,
      email,
      student_id
    });
    
    res.status(201).json({ 
      message: 'Student created successfully',
      id: newStudentId
    });
  } catch (error) {
    console.error('Error creating student:', error);
    
    // Check for duplicate entry error
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return res.status(409).json({ message: 'Student with this email or ID already exists' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const { name, email, student_id } = req.body;
    
    if (!name || !email || !student_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const success = await StudentModel.update(id, {
      name,
      email,
      student_id
    });
    
    if (!success) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    
    // Check for duplicate entry error
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return res.status(409).json({ message: 'Student with this email or ID already exists' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const success = await StudentModel.remove(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
