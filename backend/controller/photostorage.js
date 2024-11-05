import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Set up project root path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const storagePath = join(projectRoot, "photos");
    // Call callback to set the path
    cb(null, storagePath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
