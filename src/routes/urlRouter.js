import { Router } from 'express';
import { shortenURL } from '../controllers/urlController.js';

export const urlRouter = Router();

urlRouter.post('/', shortenURL);
