import PostModel from "../Models/Post.Model.js";
import mongoose from "mongoose";
import UserModel from "../Models/User.Model.js";

//create new post
export const createPost = async (req, res) => {
   try {
      const newPost = new PostModel({ userId: req.user.id, ...req.body });
      await newPost.save();
      res.status(200).json(newPost);
   } catch (error) {
      next(error);
   }
};

//get a post
export const getPost = async (req, res, next) => {
   try {
      const post = await PostModel.find({ userId: req.params.id });
      res.status(200).json(post);
   } catch (error) {
      next(error);
   }
};

//update a apost
export const updatePost = async (req, res) => {
   const postId = req.params.id;
   const { userId } = req.body;

   try {
      const post = await PostModel.findById(postId);
      if (post.userId === userId) {
         await post.updateOne({ $set: req.body });
         res.status(200).json("post updated");
      } else {
         res.status(403).json("action forbidden");
      }
   } catch (error) {
      res.status(500).json(error);
   }
};

//delete post
export const deletePost = async (req, res) => {
   const id = req.params.id;
   const { userId } = req.body;

   try {
      const post = await PostModel.findById(id);
      if (post.userId === userId) {
         await post.deleteOne();
         res.status(200).json("post deleted successfully");
      } else {
         res.status(403).json("action forbidden");
      }
   } catch (error) {
      res.status(500).json(error);
   }
};

// like/disalike a post
export const likePost = async (req, res, next) => {
   const postId = req.params.id;
   const userId = req.user.id;
   try {
      const post = await PostModel.findById({ _id: postId });
      if (!post.likes.includes(userId)) {
         await post.updateOne({ $push: { likes: userId } });
         res.status(200).json("post liked");
      } else {
         await post.updateOne({ $pull: { likes: userId } });
         res.status(200).json("post unLiked");
      }
   } catch (error) {
      res.status(500).json(error);
   }
};

//get timeline post
export const getTimelinePost = (req, res) => {
   const userId = req.params.id;
   try {
      const currentUserPost = PostModel.find({ userId: userId });
      const followingsPost = UserModel.aggregate([
         {
            $match: {
               _id: new mongoose.Types.ObjectId(userId),
            },
            $lookup: {
               from: "posts",
               localField: "followings",
               foreignField: "userId",
               as: "followingPost",
            },
            $project: {
               followingsPost: 1,
               _id: 0,
            },
         },
      ]);
      res.status(200).json(
         currentUserPost
            .concat(...followingsPost[0].followingsPost)
            .sort((a, b) => {
               return b.createdAt - a.createdAt;
            })
      );
   } catch (error) {
      res.status(500).json(error);
   }
};

export const getRandomPost = async (req, res, next) => {
   try {
      const posts = await PostModel.aggregate([{ $sample: { size: 100 } }]);
      res.status(200).json(posts);
   } catch (error) {
      next(error);
   }
};
