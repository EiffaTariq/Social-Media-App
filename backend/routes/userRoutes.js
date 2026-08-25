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
  acceptFollowRequest, rejectFollowRequest,
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/new', createUser);
router.get('/all', getAllUser);
router.get('/search', searchUsers);
router.post('/:id/follow', isAuth, toggleFollow);
router.post('/:id/follow-request/accept', isAuth, acceptFollowRequest);
router.post('/:id/follow-request/reject', isAuth, rejectFollowRequest);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;