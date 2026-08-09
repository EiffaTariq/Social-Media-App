import express from 'express'
import { isAuth } from '../middleware/isAuth.js';
import { deletePost, newPost, editCaption, getAllPosts, likeUnlikePost, commentonPost, deleteComment,getTimelinePosts } from '../controllers/postControllers.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();
//console.log("Upload type:", upload);

router.post('/new', isAuth, uploadFile, newPost);

//router.post("/new", upload.single("file"), isAuth, newPost);
router.put("/:id", isAuth, editCaption);
router.delete('/:id', isAuth, deletePost);


router.get("/all", isAuth, getAllPosts);

router.post("/like/:id", isAuth, likeUnlikePost);

router.post("/comment/:id", isAuth, commentonPost);
router.delete("/comment/:id", isAuth, deleteComment);
router.get('/:id/timeline', getTimelinePosts);
export default router;
