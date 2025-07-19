import express from 'express';
import { CreateSubjectController } from '../controllers/subject/CreateSubjectController';
import { GetSubjectsController } from '../controllers/subject/GetSubjectsController';
import { GetSubjectByIdController } from '../controllers/subject/GetSubjectByIdController';
import { UpdateSubjectController } from '../controllers/subject/UpdateSubjectController';
import { DeleteSubjectController } from '../controllers/subject/DeleteSubjectController';
import { 
  createSubjectValidator, 
  updateSubjectValidator, 
  getSubjectByIdValidator, 
  deleteSubjectValidator 
} from '../validators/subjectValidator';
import { catchAsync } from '../middlewares/errorHandler';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware to check validation results
const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new subject
router.post(
  '/',
  createSubjectValidator,
  validate,
  catchAsync((req: express.Request, res: express.Response) => 
    new CreateSubjectController().execute(req, res)
  )
);

// Get all subjects
router.get(
  '/',
  catchAsync((req: express.Request, res: express.Response) => 
    new GetSubjectsController().execute(req, res)
  )
);

// Get a subject by ID
router.get(
  '/:id',
  getSubjectByIdValidator,
  validate,
  catchAsync((req: express.Request, res: express.Response) => 
    new GetSubjectByIdController().execute(req, res)
  )
);

// Update a subject
router.put(
  '/:id',
  updateSubjectValidator,
  validate,
  catchAsync((req: express.Request, res: express.Response) => 
    new UpdateSubjectController().execute(req, res)
  )
);

// Delete a subject
router.delete(
  '/:id',
  deleteSubjectValidator,
  validate,
  catchAsync((req: express.Request, res: express.Response) => 
    new DeleteSubjectController().execute(req, res)
  )
);

export default router;
