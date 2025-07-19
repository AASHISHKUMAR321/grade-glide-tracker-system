import { body, param } from 'express-validator';

export const createSubjectValidator = [
  body('name')
    .notEmpty()
    .withMessage('Subject name is required')
    .isString()
    .withMessage('Subject name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const updateSubjectValidator = [
  param('id')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isUUID()
    .withMessage('Subject ID must be a valid UUID'),
  
  body('name')
    .optional()
    .isString()
    .withMessage('Subject name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const getSubjectByIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isUUID()
    .withMessage('Subject ID must be a valid UUID'),
];

export const deleteSubjectValidator = [
  param('id')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isUUID()
    .withMessage('Subject ID must be a valid UUID'),
];
