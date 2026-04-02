const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { setupSwagger } = require("./config/swagger");
const { notFound } = require("./middleware/notFound.middleware");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json());

setupSwagger(app);

app.get("/", (req, res) => {
  res.status(200).send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Finance Backend API</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.6;">
        <h1>Finance Backend API is running</h1>
        <p>This is a backend-only project.</p>
        <p>Use Postman to test endpoints.</p>
      </body>
    </html>
  `);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
