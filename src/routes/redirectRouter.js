import { Router } from 'express';
import { redirectToURL } from '../controllers/redirectController.js';

const redirectRouter = Router();

redirectRouter.get('/:id', redirectToURL);

export { redirectRouter };
