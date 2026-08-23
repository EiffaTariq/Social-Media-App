import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { uploadFile } from "../controllers/uploadControllers.js";

const router = express.Router();

router.post("/", isAuth, upload.single("file"), uploadFile);

export default router;