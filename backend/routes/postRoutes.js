import express from 'express';
import { deletePost, newPost, 
    editCaption, getAllPosts, likeUnlikePost, addComment, editComment, 
    deleteComment, replyToComment } from '../controllers/postControllers.js';

const router = express.Router();

router.post('/new', newPost);
router.get('/all', getAllPosts);
router.put('/:id', editCaption);
router.delete('/:id', deletePost);
router.post('/:id/like', likeUnlikePost);
router.post('/:id/comment', addComment);
router.put('/:id/comment/:commentId', editComment);
router.delete('/:id/comment/:commentId', deleteComment);
router.post('/:id/comment/:commentId/reply', replyToComment);

export default router;