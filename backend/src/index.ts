import app from "./app";
import { PORT } from "./constants/constants";
import { connectDB } from "./db/mongodb";

async function init() {
  try {
    await connectDB();

    const server = app.listen(Number(PORT), "0.0.0.0", () => {
      console.log("Server is listening on Port:", PORT, "......");
    });

    server.keepAliveTimeout = 120000; // 120 seconds
    server.headersTimeout = 120000; // 120 seconds
  } catch (error) {
    console.log(error);
  }
}

init();
