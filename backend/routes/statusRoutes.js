import express from 'express';
import { newStatus, getActiveStatuses, markSeen } from '../controllers/statusControllers.js';

const router = express.Router();

router.post('/new', newStatus);
router.get('/all', getActiveStatuses);
router.post('/:id/seen', markSeen);

export default router;