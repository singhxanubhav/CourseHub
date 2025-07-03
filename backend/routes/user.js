import { Router } from "express";
import bcrypt from "bcrypt";
import { User } from "../db.js";
import jwt from "jsonwebtoken";
import { userSignin, userSignup } from "../types.js";
import userMiddleware from "../middleware/user.js";
const userRouter = Router();

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

userRouter.post("/signup", async function (req, res) {
  try {
    const { firstName, lastName, email, password } = userSignup.parse(req.body);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(411).json({ msg: "User Already Exists!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    const token = jwt.sign(
      { userId: user._id},
      USER_JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "signup succeesded",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong during signup" });
  }
});

userRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = userSignin.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(411).json({ msg: "email not register!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign(
      { userId: user._id},
      USER_JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/purchases", userMiddleware,  async function (req, res) {
  const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
});

export default userRouter;
