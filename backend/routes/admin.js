import { Router } from "express";
import bcrypt from "bcrypt";
import { Admin, Course } from "../db.js";
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

adminRouter.post("/course", async function (req, res) {
  const adminId = req.userId;

  const { title, description, price, imageUrl } = req.body;

  const course = await Course.create({
    title: title,
    description: description,
    price: price,
    imageUrl: imageUrl,
    creatorId: adminId,
  });

  res.json({
    message: "Course Created",
    courseId: course._id,
  });
});

adminRouter.put("/course", async function (req, res) {
  const adminId = req.userId;

  const { title, description, price, imageUrl, courseId } = req.body;

  const courseExists = Course.findOne({
    _id: courseId,
    creatorId: adminId,
  });

  if (!courseExists) {
    res.json({
      message: "Course does not exist",
    });
  }

  const course = await Course.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
    }
  );

  res.json({
    message: "Course Updated",
    courseId: course._id,
  });
});

adminRouter.get("/course/bulk", async function (req, res) {
  const adminId = req.userId;

  const course = await Course.find(
    {
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    }
  );
  res.json({
    message: "All Course",
    course,
  });
});

export default adminRouter;
