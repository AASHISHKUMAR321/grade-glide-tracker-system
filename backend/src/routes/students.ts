import express from 'express';
import * as studentController from '../controllers/studentController';

const router = express.Router();

// GET all students
router.get('/', studentController.getAllStudents);

// GET student by ID
router.get('/:id', studentController.getStudentById);

// POST create new student
router.post('/', studentController.createStudent);

// PUT update student
router.put('/:id', studentController.updateStudent);

// DELETE student
router.delete('/:id', studentController.deleteStudent);

export default router;
