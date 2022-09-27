import express from "express";
import {
   createPost,
   deletePost,
   getPost,
   getRandomPost,
   getTimelinePost,
   likePost,
   updatePost,
} from "./../Controllers/Post.controller.js";
const router = express.Router();
import { verifyToken } from "../MiddleWare/verifyToken.js";

router.post("/", verifyToken, createPost);
router.get("/yourPost/:id", getPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.put("/:id/like", verifyToken, likePost);
router.get("/:id/timeline", getTimelinePost);
router.get("/random/allposts", getRandomPost);

export default router;
