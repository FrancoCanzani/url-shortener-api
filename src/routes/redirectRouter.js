import { Router } from 'express';
import { redirectToLink } from '../controllers/redirectController.js';

const redirectRouter = Router();

redirectRouter.get('/:id', redirectToLink);

export { redirectRouter };
