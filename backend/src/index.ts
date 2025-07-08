import app from "./app";
import { PORT } from "./constants/constants";
import { connectDB } from "./db/mongodb";

async function init() {
  try {
    await connectDB();
    // Add '0.0.0.0' as the host parameter
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log("Server is listening on Port:", PORT, "......");
    });
  } catch (error) {
    console.log(error);
  }
}

init();
