import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      firstname: {
         type: String,
         required: true,
      },
      lastname: {
         type: String,
         required: true,
      },
      isAdmin: {
         type: Boolean,
         default: false,
      },
      profilePicture: {
         type: String,
         default:
            "https://firebasestorage.googleapis.com/v0/b/twitter-clone-7bde0.appspot.com/o/1663392570030images.png?alt=media&token=7a9b0c0f-de14-42c9-86fb-fdf17ba72f2d",
      },
      coverPicture: {
         type: String,
         default:
            "https://firebasestorage.googleapis.com/v0/b/twitter-clone-7bde0.appspot.com/o/images.jpg?alt=media&token=4c17917c-2d61-475d-8f6c-d2caa70de2c2",
      },
      bio: String,
      livesin: String,
      worksat: String,
      country: String,
      relationship: String,
      followers: [],
      followings: [],
   },
   { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
