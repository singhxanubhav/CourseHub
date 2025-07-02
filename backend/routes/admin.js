import { Router } from "express";
import bcrypt from "bcrypt";
import { Admin } from "../db.js";
import jwt from "jsonwebtoken";
import { userSignin, userSignup } from "../types.js";

const adminRouter = Router();

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET;

adminRouter.post("/signup", async function (req, res) {
  try {
    const { firstName, lastName, email, password } = userSignup.parse(req.body);

    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(411).json({ msg: "User Already Exists!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      ADMIN_SECRET,
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

adminRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = userSignin.parse(req.body);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(411).json({ msg: "email not register!" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      ADMIN_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

adminRouter.post("/course", function (req, res) {
  res.json({
    message: "course created",
  });
});

adminRouter.put("/course", function (req, res) {
  res.json({
    message: "Course updated",
  });
});

adminRouter.get("/course/bulk", function (req, res) {
  res.json({
    message: "get all courses",
  });
});

export default adminRouter;
