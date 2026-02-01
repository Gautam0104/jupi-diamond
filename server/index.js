/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pkg from "pg";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import apiRoutes from "./routes/modules.js";
import { allowedOrigins } from "./config/allowedOrigin.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const { Pool } = pkg;
const port = process.env.PORT || 8000;

// Initialize Express
const app = express();

// Create HTTP server (required for Socket.IO)
const server = http.createServer(app);

// PostgreSQL connection pool
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Express Session Middleware
app.use(
  session({
    store: new (pgSession(session))({
      pool: pgPool, // Connection pool for session storage
      tableName: "Session", // Session table name
    }),
    secret: process.env.SESSION_SECRET_KEY || "your-secret-key", // Use env variable for secret
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day session
    },
  })
);

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", apiRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json("Server started successfully!");
});

// Global Error Handler
app.use(errorHandler);

// Socket setup........................
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Admin connected via Socket.IO:", socket.id);

  socket.on("disconnect", () => {
    console.log("Admin disconnected:", socket.id);
  });
});

// Export io instance for use in utils like stock alerts
export { io };

// Start Server
server.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

// /* eslint-disable no-undef */
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// import session from "express-session";
// import pgSession from "connect-pg-simple";
// import pkg from "pg";
// import { errorHandler } from "./middleware/errorHandler.js";
// import apiRoutes from "./routes/modules.js";
// import { allowedOrigins } from "./config/allowedOrigin.js";
// import cookieParser from "cookie-parser";
// import morgan from "morgan";

// dotenv.config();
// const port = process.env.PORT || 8000;

// const { Pool } = pkg;
// const app = express();
// // app.set("trust proxy", 1);
// // PostgreSQL connection
// const pgPool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// app.use(
//   session({
//     store: new (pgSession(session))({
//       pool: pgPool, // Connection pool for session storage
//       tableName: "Session", // Session table name
//     }),
//     secret: process.env.SESSION_SECRET_KEY || "your-secret-key", // Use env variable for secret
//     resave: false, // Don't save session if unmodified
//     saveUninitialized: false, // Don't create session until something is stored
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, // 1 day session
//     },
//   })
// );

// app.use(morgan("dev"));
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// // app.use(sessionMiddleware);

// // app.get("/session", (req, res) => {
// //   res.json(req.session.user || "No session found");
// // });
// app.use("/api/v1", apiRoutes);
// app.get("/", (req, res) => {
//   res.status(200).json("Server started successfully!");
// });

// //last middleware for global error
// app.use(errorHandler);
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });
