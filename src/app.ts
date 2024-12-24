import express, { NextFunction, Request, Response } from "express";
import { fileUpload } from "./middleware/fileupload.middleware";
import { fileUploadController } from "./controllers/fileUpload.controller";
import { logger } from "./logger";
import { join } from "path";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.static(join(__dirname, "public")));

// Serve upload.html for /upload
app.get("/upload", (req: Request, res: Response) => {
  res.sendFile(join(__dirname, "public", "upload.html"));
});

app.post("/upload", fileUpload.single("items"), (req, res) =>
  fileUploadController.handleUpload(req, res)
);

// General error handler (add winston for logs)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    let message = "Unexcpected error happened";
    if (err instanceof Error) {
      message = err.message;
    }
    res.status(400).json({
      success: false,
      message,
    });
  }
});

const startServer = () => {
  app.listen(3000, function () {
    logger.info("App is up and running on 3000");
  });
};
export { startServer };
