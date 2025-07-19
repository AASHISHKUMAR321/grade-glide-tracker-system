import { body, param } from 'express-validator';

export const createCompetencyValidator = [
  body('name')
    .notEmpty()
    .withMessage('Competency name is required')
    .isString()
    .withMessage('Competency name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Competency name must be between 2 and 100 characters'),
  
  body('subjectId')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isUUID()
    .withMessage('Subject ID must be a valid UUID'),
  
  body('marks')
    .notEmpty()
    .withMessage('Marks are required')
    .isInt({ min: 0, max: 10 })
    .withMessage('Marks must be an integer between 0 and 10'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const updateCompetencyValidator = [
  param('id')
    .notEmpty()
    .withMessage('Competency ID is required')
    .isUUID()
    .withMessage('Competency ID must be a valid UUID'),
  
  body('name')
    .optional()
    .isString()
    .withMessage('Competency name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Competency name must be between 2 and 100 characters'),
  
  body('marks')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Marks must be an integer between 0 and 10'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const getCompetencyByIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Competency ID is required')
    .isUUID()
    .withMessage('Competency ID must be a valid UUID'),
];

export const deleteCompetencyValidator = [
  param('id')
    .notEmpty()
    .withMessage('Competency ID is required')
    .isUUID()
    .withMessage('Competency ID must be a valid UUID'),
];
