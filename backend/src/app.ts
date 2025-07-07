import express from "express";
import userRouter from "./routes/user.routes";
import AssignmentRouter from "./routes/assignments.routes";
import ProjectRouter from "./routes/projects.routes";
import EngineerRouter from "./routes/engineers.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import cors from "cors";
const app = express();

const allowedOrigins = [
  "https://erms-virid.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name",
  ],
  maxAge: 86400,
};

app.use(cors(corsOptions));

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
