import express from 'express';
import isAuth from '../middleware/isAuth.js';
import {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  searchUsers,
  toggleFollow,
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/new', createUser);
router.get('/all', getAllUser);
router.get('/search', searchUsers);
router.post('/:id/follow', isAuth, toggleFollow);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;