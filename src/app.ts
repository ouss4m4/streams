import express, { NextFunction, Request, Response } from "express";
import { fileUpload } from "./middleware/fileupload.middleware";
import { fileUploadController } from "./controllers/fileUpload.controller";
import { logger } from "./logger";

const app = express();

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
    logger.info("App is up and running");
  });
};
export { startServer };
