import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "./uploads/"); // Make sure this folder exists
  // },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

console.log("filename", storage.filename);
console.log("destination", storage.destination);

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed"), false);
  }
};

export const uploadExcel = multer({ storage, fileFilter });
