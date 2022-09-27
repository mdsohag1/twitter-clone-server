import UserModel from "../Models/User.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//registring a new User
export const registerUser = async (req, res, next) => {
   const salt = await bcrypt.genSalt(10);
   const hashedPass = await bcrypt.hash(req.body.password, salt);
   const newUser = new UserModel({ ...req.body, password: hashedPass });
   try {
      const user = await newUser.save();
      if (user) {
         const { password, ...other } = user._doc;
         const token = jwt.sign(
            {
               username: user.username,
               id: user._id,
            },
            process.env.JWT_KEY
            // { expiresIn: "1" }
         );
         res.status(200).json({ ...other, token });
      }
   } catch (error) {
      res.status(200).json({ message: "user Created successfully" });
   }
};

//login user
export const loginUser = async (req, res, next) => {
   try {
      const user = await UserModel.findOne({ username: req.body.username });
      if (user) {
         const validity = await bcrypt.compare(
            req.body.password,
            user.password
         );
         if (!validity) {
            res.status(400).json("wrong password");
         } else {
            const token = jwt.sign(
               {
                  username: user.username,
                  id: user._id,
               },
               process.env.JWT_KEY
               // { expiresIn: "1h" }
            );
            const { password, ...other } = user._doc;
            res.status(200).json({ ...other, token });
         }
      } else {
         res.status(404).json("user not exit");
      }
   } catch (error) {
      next(error);
   }
};
