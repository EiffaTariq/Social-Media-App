import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { newStatus, getActiveStatuses, markSeen } from '../controllers/statusControllers.js';

const router = express.Router();

router.post('/new', isAuth, newStatus);
router.get('/all', getActiveStatuses);
router.post('/:id/seen', markSeen);


//router.post('/new', newStatus);
export default router;