import { connectDB } from "./db/db.js";
import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    const db = await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT} 🚀`);
    });
  } catch (error: any) {
    console.error("Failed to start the server: 👎", error.message);
    process.exit(1);
  }
})();
