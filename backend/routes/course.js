import { Router } from "express";
import userMiddleware from "../middleware/user";
import { Purchase } from "../db";
const courseRouter = Router()

courseRouter.post("/purchase", userMiddleware, async function(req, res){
    const userId = req.userId
    const courseId = req.body.courseId

    const purchase = await Purchase.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully bought the course"
    })
})



courseRouter.post("/preview", async function(req, res){
    const course = await Purchase.findOne({})

    res.json({
        course
    })
})
export default courseRouter