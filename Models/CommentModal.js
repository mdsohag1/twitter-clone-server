import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
   {
      userId: { type: String, required: true },
      postId: { type: String, required: true },
      comments: { type: Array, default: [] },
   },
   { timestamps: true }
);

const CommentModal = mongoose.model("comments", commentSchema);
export default CommentModal;
