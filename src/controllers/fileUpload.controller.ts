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
    const startTime = Date.now();
    logger.info(`started processing  ${req.file?.filename}`);

    const filePath = join(__dirname, "..", "uploads", req.file?.filename ?? "");
    let csvStream = parseCsvFromDiskAndStream(filePath);

    // File is parsed and stream at this point
    const finalResult: IDownloadReponse = {
      success: 0,
      errors: [],
    };

    const rowProcessingPromises: Promise<IDownloadReponse>[] = [];

    // sku, image1, image2, image3
    for await (const row of csvStream) {
      rowProcessingPromises.push(fetchAndSaveImagesFromCsvRow(row));
    }
    let rowsProcessingResult = await Promise.allSettled(rowProcessingPromises);

    rowsProcessingResult.forEach((resOrErr) => {
      if (resOrErr.status == "fulfilled") {
        finalResult.success += resOrErr.value.success;
        finalResult.errors = finalResult.errors.concat(resOrErr.value.errors);
      }
    });

    logger.info(
      `Csv parsing finished in ${
        (Date.now() - startTime) / 1000
      } seconds for file ${req.file?.filename}`
    );
    return res.json({
      success: true,
      message: `Processed ${finalResult.success} images successfully`,
      errors: finalResult.errors,
    });
  }
}
