import express, { Request, Response, NextFunction } from "express";
import userRouter from "./routes/user.routes";
import AssignmentRouter from "./routes/assignments.routes";
import ProjectRouter from "./routes/projects.routes";
import EngineerRouter from "./routes/engineers.routes";
import { errorMiddleware } from "./middleware/error.middleware";

// ===== Allowed Origins =====
const allowedOrigins = [
  "https://erms-virid.vercel.app",
  "http://localhost:5173",
];

// ===== Manual CORS Middleware =====
function corsManual(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin as string | undefined;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // Always set these headers for CORS
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    // Respond with 200 and headers only, no body
    return res.status(200).end();
  }

  // Continue to next middleware/route
  next();
}

// ===== Express App Setup =====
const app = express();

app.use(corsManual); // Manual CORS middleware (must be first)
app.use(express.json()); // JSON body parser

// ===== Routers =====

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "Server is running",
  });
});
app.use("/api/auth", userRouter);
app.use("/api/assignments", AssignmentRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/engineers", EngineerRouter);

// ===== Root Route =====
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is up to date");
});

// ===== Error Middleware =====
app.use(errorMiddleware);

// ===== 404 Handler (Optional) =====
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", message: "An error occured" });
});

export default app;
