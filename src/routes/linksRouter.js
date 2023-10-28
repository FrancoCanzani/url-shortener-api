import { Router } from 'express';
import { getRecentLinks } from '../controllers/recentLinksController.js';

const linksRouter = Router();

linksRouter.get('/recent', getRecentLinks);

export default linksRouter;
