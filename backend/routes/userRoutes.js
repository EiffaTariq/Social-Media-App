import express from 'express';
import { createUser, getAllUser, getUser, updateUser, deleteUser } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/new', createUser);
router.get('/all', getAllUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;