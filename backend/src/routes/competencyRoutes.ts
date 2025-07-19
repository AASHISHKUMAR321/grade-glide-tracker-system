import express from 'express';
import { CreateCompetencyController } from '../controllers/competency/CreateCompetencyController';
import { GetCompetenciesController } from '../controllers/competency/GetCompetenciesController';
import { GetCompetencyByIdController } from '../controllers/competency/GetCompetencyByIdController';
import { UpdateCompetencyController } from '../controllers/competency/UpdateCompetencyController';
import { DeleteCompetencyController } from '../controllers/competency/DeleteCompetencyController';
import { 
  createCompetencyValidator, 
  updateCompetencyValidator, 
  getCompetencyByIdValidator, 
  deleteCompetencyValidator 
} from '../validators/competencyValidator';
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

// Create a new competency
router.post(
  '/',
  createCompetencyValidator,
  validate,
  catchAsync((req: express.Request, res: express.Response) => 
    new CreateCompetencyController().execute(req, res)
  )
);

// Get all competencies or filter by subject ID
router.get(
  '/',
  catchAsync((req: express.Request, res: express.Response) => 
    new GetCompetenciesController().execute(req, res)
  )
);

// Get a competency by ID
router.get(
  '/:id',
  getCompetencyByIdValidator,
  validate,
  catchAsync((req: express.Request, res: express.Response) => 
    new GetCompetencyByIdController().execute(req, res)
  )
);

// Update a competency
router.put(
  '/:id',
  updateCompetencyValidator,
  validate,
  catchAsync((req: express.Request, res: express.Response) => 
    new UpdateCompetencyController().execute(req, res)
  )
);

// Delete a competency
router.delete(
  '/:id',
  deleteCompetencyValidator,
  validate,
  catchAsync((req: express.Request, res: express.Response) => 
    new DeleteCompetencyController().execute(req, res)
  )
);

export default router;
