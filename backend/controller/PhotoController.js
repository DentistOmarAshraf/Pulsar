import Photos from "../models/photo.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projcetpath = join(__dirname, "..", "photos");

class PhotoController {
  static async getPhoto(req, res) {
    const { id } = req.params;
    const photo = await Photos.findById(id);
    if (!photo) {
      return res.status(404).json({ error: "Photo Not found" });
    }
    const photoPath = join(projcetpath, photo.name);
    fs.stat(photoPath, (error, stats) => {
      if (error || !stats.isFile()) {
        return res.status(404).send("Photo not found");
      }
    });
    res.setHeader("Content-Type", "image/jpeg");
    const fileStream = fs.createReadStream(photoPath);
    fileStream.pipe(res);
  }
}
export default PhotoController;
