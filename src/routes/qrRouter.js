import { Router } from 'express';
import { generateQR } from '../controllers/qrController.js';

const qrRouter = Router();

qrRouter.get('/:url(*)', generateQR);

export { qrRouter };
