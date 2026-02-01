/* eslint-disable no-undef */
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

export default sessionMiddleware;
