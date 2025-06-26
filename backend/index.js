import express from "express"
// import { userRouter } from "./routes/user.js"
import  adminRouter  from "./routes/admin.js"
import  courseRouter  from "./routes/course.js"
import userRouter from "./routes/user.js"
import { connectDb } from "./db.js"


const app = express()

app.use("/api/v1/user", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/course", courseRouter)


const PORT = 3000
app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});