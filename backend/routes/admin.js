import { Router } from "express";

const adminRouter = Router();

adminRouter.post("/signup", function (req, res) {
  res.json({
    message: "Signup succeeded",
  });
});


adminRouter.post("/signin", function (req, res) {
  res.json({
    message: "Signin succeeded",
  });
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
