import express from "express";
import userRouter from "./routes/user.routes";
import AssignmentRouter from "./routes/assignments.routes";
import ProjectRouter from "./routes/projects.routes";
import EngineerRouter from "./routes/engineers.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// Manual CORS handling
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://erms-virid.vercel.app",
    "http://localhost:5173",
  ];
  const origin = req.headers.origin!;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-Requested-With,Accept,Origin,Cache-Control,X-File-Name"
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    console.log("Preflight request from:", origin); // Optional: for debugging
    res.status(200).end();
    return;
  }

  next();
});

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/assignments", AssignmentRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/engineers", EngineerRouter);

app.use("/", (req, res) => {
  res.status(200).send("Server is up to date");
});

app.use(errorMiddleware);

export default app;
