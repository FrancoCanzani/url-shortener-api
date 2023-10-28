import { Router } from 'express';
import { shortenLink } from '../controllers/linkController.js';

export const linkRouter = Router();

linkRouter.post('/', shortenLink);
