import app from "./app";
import { PORT } from "./constants/constants";
import { connectDB } from "./db/mongodb";

async function init() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is listening on Port:", PORT, "......");
    });
  } catch (error) {
    console.log(error);
  }
}

init();
