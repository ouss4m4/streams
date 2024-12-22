import { Request, Response, NextFunction } from "express";
import { join } from "path";
import { parseCsvFromDiskAndStream } from "../lib/parseCsvFromDiskAndStream";
import { fetchAndSaveImagesFromCsvRow } from "../lib/fetchAndSaveImagesFromCsvRow";
import { logger } from "../logger";

export type IDownloadReponse = {
  success: number;
  errors: string[];
};

export class fileUploadController {
  static async handleUpload(req: Request, res: Response): Promise<any> {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      logger.error("No file uploaded.");
      return;
    }

    const startTime = Date.now();
    const filePath = join(__dirname, "..", "uploads", req.file.filename);
    logger.info(`Started processing ${req.file.filename}`);

    res.setHeader("Content-Type", "application/json");

    const finalResult: IDownloadReponse = { success: 0, errors: [] };
    try {
      let csvStream = parseCsvFromDiskAndStream(filePath);

      // Start streaming response
      // res.setHeader("Content-Type", "text/plain");
      // res.write(`Processing started for file: ${req.file?.filename}\n`);

      // // File is parsed and stream at this point
      // const finalResult: IDownloadReponse = {
      //   success: 0,
      //   errors: [],
      // };

      // const rowProcessingPromises: Promise<IDownloadReponse>[] = [];

      // let rows = 0;

      for await (const row of csvStream) {
        const rowResult = await fetchAndSaveImagesFromCsvRow(row);

        finalResult.success += rowResult.success;
        finalResult.errors.push(...rowResult.errors);

        res.write(
          JSON.stringify({
            success: true,
            message: `Processed ${finalResult.success} images successfully.`,
            errors: finalResult.errors,
          })
        );
      }
      // let rowsProcessingResult = await Promise.allSettled(
      //   rowProcessingPromises
      // );

      // rowsProcessingResult.forEach((resOrErr) => {
      //   if (resOrErr.status == "fulfilled") {
      //     finalResult.success += resOrErr.value.success;
      //     finalResult.errors = finalResult.errors.concat(resOrErr.value.errors);
      //   }
      // });
    } catch (err) {
      logger.error(`Error processing CSV file: ${(err as Error).message}`);
    } finally {
      res.end();
      logger.info(
        `Processing finished in ${(Date.now() - startTime) / 1000}s for file ${
          req.file.filename
        }`
      );
    }
  }
}
