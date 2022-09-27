import Express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./Routes/Auth.route.js";
import UserRoute from "./Routes/User.route.js";
import PostRoute from "./Routes/Post.route.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

mongoose
   .connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => app.listen(PORT, () => console.log(`app is running at ${PORT}`)))
   .catch((error) => console.log(error));

const app = Express();

//Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//usage of route
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);

app.use((err, req, res, next) => {
   const status = err.status || 500;
   const message = err.message || "somthing went wrong";
   return res.status(status).json({
      success: false,
      status,
      message,
   });
});
