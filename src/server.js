require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;

const bootstrap = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server started successfully on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application bootstrap failed:", error.message);
    process.exit(1);
  }
};

bootstrap();
