import express from 'express';
import { deletePost, newPost, editCaption, getAllPosts, likeUnlikePost, addComment } from '../controllers/postControllers.js';

const router = express.Router();

router.post('/new', newPost);
router.get('/all', getAllPosts);
router.put('/:id', editCaption);
router.delete('/:id', deletePost);
router.post('/:id/like', likeUnlikePost);
router.post('/:id/comment', addComment);

export default router;