const multer = require("multer");
const path = require("path");

// Конфигурация для сохранения изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Папка, куда будут сохраняться изображения
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imageUrl = req.file.path;
  return res.json({ success: true, imageUrl });
};

module.exports = { upload, uploadImage };
