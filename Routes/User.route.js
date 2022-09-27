import express from "express";
import {
   deleteUser,
   followUser,
   getAllUsers,
   getUser,
   unFollowUser,
   updateUser,
} from "../Controllers/User.controller.js";
import { verifyToken } from "../MiddleWare/verifyToken.js";
const router = express.Router();

router.get("/allusers", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.put("/:id/follow", verifyToken, followUser);
router.put("/:id/unfollow", verifyToken, unFollowUser);

export default router;
