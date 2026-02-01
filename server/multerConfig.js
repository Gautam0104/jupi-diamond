import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./uploads");
  },

  filename: function (request, file, cb) {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});
export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB limit
  },
});
