import express from "express";
import userRouter from "./routes/user.routes";
import AssignmentRouter from "./routes/assignments.routes";
import ProjectRouter from "./routes/projects.routes";
import EngineerRouter from "./routes/engineers.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: ["https://erms-virid.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("/*any", cors());

app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/assignments", AssignmentRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/engineers", EngineerRouter);
app.use(errorMiddleware);

export default app;
