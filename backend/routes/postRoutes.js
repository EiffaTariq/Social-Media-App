import express from 'express';
import isAuth from "../middleware/isAuth.js";
import { deletePost, newPost,
    editPost, getAllPosts, likeUnlikePost, addComment, editComment,
    editCaption,deleteComment, replyToComment } from '../controllers/postControllers.js';

const router = express.Router();

router.post('/new', isAuth, newPost);
router.get("/all", getAllPosts);
router.put('/:id', isAuth, editPost);
router.put('/:id', isAuth, editCaption);
router.delete('/:id',isAuth, deletePost);
router.post('/:id/like', isAuth, likeUnlikePost);
router.post('/:id/comment', isAuth, addComment);
router.put('/:id/comment/:commentId', isAuth, editComment);
router.delete('/:id/comment/:commentId', isAuth, deleteComment);
router.post('/:id/comment/:commentId/reply', isAuth, replyToComment);

//router.post('/new', newPost);
// router.get('/all', getAllPosts);
// router.put('/:id', editCaption);
// router.delete('/:id', deletePost);
// router.post('/:id/like', likeUnlikePost);
// router.post('/:id/comment', addComment);
// router.put('/:id/comment/:commentId', editComment);
// router.delete('/:id/comment/:commentId', deleteComment);
// router.post('/:id/comment/:commentId/reply', replyToComment);

export default router;