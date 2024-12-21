import { Request, Response, NextFunction } from "express";
import { join } from "path";
import { logger } from "../logger";
import { Worker } from "worker_threads";

export type IDownloadReponse = {
  success: number;
  errors: string[];
};

export class fileUploadController {
  static async handleUpload(req: Request, res: Response): Promise<any> {
    const startTime = Date.now();
    logger.info(`started processing  ${req.file?.filename}`);

    const filePath = join(__dirname, "..", "uploads", req.file?.filename ?? "");

    const workerPromise = new Promise<IDownloadReponse>((resolve, reject) => {
      const worker = new Worker(join(__dirname, "..", "lib/csvWorker.js"), {
        workerData: { filePath },
      });
      console.log("worker executed...");
      worker.on("message", (message) => {
        if (message.success) {
          resolve(message.result);
        } else {
          reject(new Error(message.error));
        }
      });

      worker.on("error", (error) => reject(error));
      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });

    try {
      const finalResult = await workerPromise;
      const timeTaken = (Date.now() - startTime) / 1000;
      logger.info(
        `CSV parsing finished in ${timeTaken} seconds for file ${req.file?.filename}`
      );

      return res.json({
        success: true,
        message: `Processed ${finalResult.success} images successfully`,
        errors: finalResult.errors,
      });
    } catch (error) {
      logger.error(
        `Error processing file ${req.file?.filename}: ${
          (error as Error).message
        }`
      );
      return res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }
}
