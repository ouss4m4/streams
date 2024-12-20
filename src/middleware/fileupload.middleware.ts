import Multer, { diskStorage, DiskStorageOptions } from "multer";
import { join } from "path";

const storageOptions: DiskStorageOptions = {
  destination(_, __, callback) {
    callback(null, join(__dirname, "..", "uploads"));
  },
  filename(_, file, callback) {
    let suffix = Math.random() * 1000;
    callback(null, `${file.originalname}-${suffix}.csv`);
  },
};

const storage = diskStorage(storageOptions);
const fileUpload = Multer({
  storage,
  fileFilter(_, file, callback) {
    if (file.mimetype != "text/csv") {
      return callback(new Error("Only csv format is allowd"));
    }
    callback(null, true);
  },
});

export { fileUpload };
