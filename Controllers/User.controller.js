import UserModel from "../Models/User.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

//get all user
export const getAllUsers = async (req, res, next) => {
   try {
      let users = await UserModel.find();
      users = users.map((user) => {
         const { password, ...otherDatails } = user._doc;
         return otherDatails;
      });
      res.status(200).json(users);
   } catch (error) {
      next(error);
   }
};

//get a user
export const getUser = async (req, res) => {
   try {
      const user = await UserModel.findById({ _id: req.params.id });
      if (user) {
         const { password, ...otherDatails } = user._doc;
         res.status(200).json(otherDatails);
      } else {
         res.status(404).json("No such user exits");
      }
   } catch (error) {
      next(error);
   }
};

//update a user
export const updateUser = async (req, res) => {
   const { token, ...other } = req.body;
   if (req.params.id === req.user.id) {
      try {
         const updateUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
               $set: other,
            },
            { new: true }
         );
         const { password, ...otherInfo } = updateUser._doc;
         res.status(200).json({ ...otherInfo, token });
      } catch (error) {
         next(error);
      }
   } else {
      next(createError(403, "you update only your account"));
   }
};

//delete user
export const deleteUser = async (req, res) => {
   const id = req.params.id;
   const { currentUserId, currentUserAdminStatus } = req.body;
   if (id === currentUserId || currentUserAdminStatus) {
      try {
         await UserModel.findByIdAndDelete(id);
         res.status(200).json("user deleted successfully");
      } catch (error) {
         res.status(500).json(error);
      }
   } else {
      res.status(403).json("Access Denile! you can delete your own profile");
   }
};

//follow a user
export const followUser = async (req, res) => {
   const id = req.params.id;
   const { _id } = req.body;

   if (_id === id) {
      res.status(403).json("Action forbidden");
   } else {
      try {
         const followUser = await UserModel.findById(id);
         const folloingUser = await UserModel.findById(_id);

         if (!followUser.followers.includes(_id)) {
            await followUser.updateOne({ $push: { followers: _id } });
            await folloingUser.updateOne({ $push: { followings: id } });
            res.status(200).json("users followed");
         } else {
            res.status(403).json("user is already followed by you");
         }
      } catch (error) {
         res.status(500).json(error);
      }
   }
};

//UnFollow a user
export const unFollowUser = async (req, res) => {
   const id = req.params.id;
   const { _id } = req.body;

   if (_id === id) {
      res.status(403).json("Action forbidden");
   } else {
      try {
         const followUser = await UserModel.findById(id);
         const folloingUser = await UserModel.findById(_id);

         if (followUser.followers.includes(_id)) {
            await followUser.updateOne({ $pull: { followers: _id } });
            await folloingUser.updateOne({ $pull: { followings: id } });
            res.status(200).json("users UnFollowed");
         } else {
            res.status(403).json("user is not followed by you");
         }
      } catch (error) {
         res.status(500).json(error);
      }
   }
};
