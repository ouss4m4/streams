import { Request, Response, NextFunction } from "express";
import { join } from "path";
import { parseCsvFromDiskAndStream } from "../lib/parseCsvFromDiskAndStream";
import { fetchAndSaveImagesFromCsvRow } from "../lib/fetchAndSaveImagesFromCsvRow";

export type IDownloadReponse = {
  success: number;
  errors: string[];
};

export class fileUploadController {
  static async handleUpload(req: Request, res: Response): Promise<any> {
    console.log("started processing ", req.file?.filename);
    const filePath = join(__dirname, "..", "uploads", req.file?.filename ?? "");
    let csvStream = parseCsvFromDiskAndStream(filePath);
    // File is parsed and stream at this point

    console.log();
    if (req.file && req.file.filename.indexOf("(2)") > 0) {
      // sleep 3 sec
      console.log("sleeping for some seconds,. blocking other calls?");
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("done");
        }, 8000);
      });
    }

    console.log("processing file after wait", req.file?.filename);
    const finalResult: IDownloadReponse = {
      success: 0,
      errors: [],
    };

    const rowProcessingPromises: Promise<IDownloadReponse>[] = [];

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
    console.log("finished processing ", req.file?.filename);
    return res.json({
      success: true,
      message: `Processed ${finalResult.success} images successfully`,
      errors: finalResult.errors,
    });
  }
}
